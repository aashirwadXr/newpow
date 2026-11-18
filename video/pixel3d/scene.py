"""
3D -> pixel-art scene, rendered with Blender (bpy) + Cycles at a tiny resolution.

An original autumn marsh: teal water, islands with reeds / bushes / trees, a windmill
with turning sails and lit windows, a drifting cloud that casts a real shadow, ducks
swimming, sheep grazing, a little dock + rowboat, and a stone weir with water pouring
down to a lower basin.

Run with the bpy venv:
    <venv>/bin/python video/pixel3d/scene.py OUT_DIR [first_frame] [last_frame]
Writes OUT_DIR/f0000.png ... (low-res, 370x366) and OUT_DIR/water_mask.png.
Post-processing (dither, rain, upscale, encode) is done by post.py.
"""
import math
import os
import random
import sys

import bpy  # must come first: it makes bmesh/mathutils importable
import bmesh  # noqa: E402
from mathutils import Euler, Matrix, Vector

OUT = sys.argv[1] if len(sys.argv) > 1 else "frames"
F0 = int(sys.argv[2]) if len(sys.argv) > 2 else 0
F1 = int(sys.argv[3]) if len(sys.argv) > 3 else 599
FPS, DUR = 60, 10.0
RES_X, RES_Y = 370, 366
os.makedirs(OUT, exist_ok=True)
rng = random.Random(7)
TAU = 2 * math.pi

# ---------------------------------------------------------------- reset
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = 24
scene.cycles.use_denoising = True
scene.cycles.filter_width = 0.01            # no anti-aliasing -> crisp pixels
scene.cycles.max_bounces = 4
scene.render.resolution_x, scene.render.resolution_y = RES_X, RES_Y
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGB"
scene.view_settings.view_transform = "Standard"
scene.view_settings.look = "None"
scene.render.threads_mode = "FIXED"
scene.render.threads = os.cpu_count() or 4

world = bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs[0].default_value = (0.20, 0.25, 0.27, 1)
bg.inputs[1].default_value = 0.9


# ---------------------------------------------------------------- materials
def mat(name, color, rough=0.8, emit=None, emit_strength=0.0, vcol=False, spec=0.2):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Roughness"].default_value = rough
    if "Specular IOR Level" in p.inputs:
        p.inputs["Specular IOR Level"].default_value = spec
    if emit:
        p.inputs["Emission Color"].default_value = (*emit, 1)
        p.inputs["Emission Strength"].default_value = emit_strength
    if vcol:
        a = nt.nodes.new("ShaderNodeVertexColor")
        a.layer_name = "Col"
        nt.links.new(a.outputs["Color"], p.inputs["Base Color"])
    return m


M_SAND = mat("sand", (0.30, 0.15, 0.06))
def ground_material():
    m = bpy.data.materials.new("ground")
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    p.inputs["Roughness"].default_value = 1.0
    p.inputs["Specular IOR Level"].default_value = 0.0
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 1.4
    nz.inputs["Detail"].default_value = 6
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    els = ramp.color_ramp.elements
    els[0].position, els[0].color = 0.35, (0.16, 0.08, 0.035, 1)
    els[1].position, els[1].color = 0.62, (0.30, 0.17, 0.06, 1)
    e = els.new(0.5)
    e.color = (0.10, 0.11, 0.04, 1)
    nt.links.new(nz.outputs["Fac"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], p.inputs["Base Color"])
    return m


M_GRASS = ground_material()
M_VEG = mat("veg", (1, 1, 1), vcol=True, rough=1.0, spec=0.0)
M_ROCK = mat("rock", (1, 1, 1), vcol=True, rough=1.0, spec=0.05)
M_WOOD = mat("wood", (0.20, 0.10, 0.05))
M_WOOD_DK = mat("wood_dk", (0.09, 0.05, 0.03))
M_STONE = mat("stone", (0.38, 0.37, 0.30), rough=0.95)
M_WALL = mat("mill_wall", (0.36, 0.33, 0.31), spec=0.05)
M_ROOF = mat("mill_roof", (0.28, 0.08, 0.06))
M_SAIL = mat("sail", (0.48, 0.43, 0.37), spec=0.05)
M_WINDOW = mat("window", (1.0, 0.75, 0.35), emit=(1.0, 0.62, 0.25), emit_strength=6.0)
M_CLOUD = mat("cloud", (0.72, 0.62, 0.78), rough=1.0, spec=0.0)
M_WOOL = mat("wool", (0.34, 0.30, 0.34), rough=1.0, spec=0.0)
M_FACE = mat("face", (0.06, 0.05, 0.05))
M_DUCK = mat("duck", (0.30, 0.17, 0.09))
M_DUCK_HEAD = mat("duck_head", (0.05, 0.25, 0.12))
M_BEAK = mat("beak", (0.85, 0.55, 0.10))
M_LEAF = mat("lily", (0.45, 0.13, 0.07))


def water_material():
    m = bpy.data.materials.new("water")
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = (0.035, 0.20, 0.17, 1)
    p.inputs["Roughness"].default_value = 0.12
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.noise_dimensions = "4D"
    noise.inputs["Scale"].default_value = 1.6
    noise.inputs["Detail"].default_value = 3
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.18
    nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], p.inputs["Normal"])
    return m, noise


M_WATER, WATER_NOISE = water_material()


def flow_material():
    """Water pouring over the weir: bright streaks that scroll downhill."""
    m = bpy.data.materials.new("flow")
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    p.inputs["Roughness"].default_value = 0.3
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    wave = nt.nodes.new("ShaderNodeTexWave")
    wave.wave_type = "BANDS"
    wave.bands_direction = "Y"
    wave.inputs["Scale"].default_value = 2.5
    wave.inputs["Distortion"].default_value = 6.0
    wave.inputs["Detail"].default_value = 2
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.55
    ramp.color_ramp.elements[0].color = (0.10, 0.32, 0.28, 1)
    ramp.color_ramp.elements[1].position = 0.85
    ramp.color_ramp.elements[1].color = (0.55, 0.70, 0.62, 1)
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    nt.links.new(mp.outputs["Vector"], wave.inputs["Vector"])
    nt.links.new(wave.outputs["Fac"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], p.inputs["Base Color"])
    return m, mp


M_FLOW, FLOW_MAP = flow_material()


# ---------------------------------------------------------------- mesh helpers
def new_obj(name, bm, material, smooth=False):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    if smooth:
        for poly in me.polygons:
            poly.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    ob.data.materials.append(material)
    scene.collection.objects.link(ob)
    return ob


def colorize(bm, new_faces, color):
    layer = bm.loops.layers.color.get("Col") or bm.loops.layers.color.new("Col")
    for f in new_faces:
        for loop in f.loops:
            loop[layer] = (*color, 1)


def add_prim(bm, kind, matrix, color=None, **kw):
    before = set(bm.faces)
    if kind == "ico":
        bmesh.ops.create_icosphere(bm, subdivisions=kw.get("sub", 1), radius=1.0, matrix=matrix)
    elif kind == "cone":
        bmesh.ops.create_cone(bm, cap_ends=True, segments=kw.get("seg", 6), radius1=kw.get("r1", 1.0),
                              radius2=kw.get("r2", 0.0), depth=kw.get("depth", 1.0), matrix=matrix)
    elif kind == "cube":
        bmesh.ops.create_cube(bm, size=1.0, matrix=matrix)
    if color is not None:
        colorize(bm, [f for f in bm.faces if f not in before], color)


def M(loc=(0, 0, 0), rot=(0, 0, 0), scale=(1, 1, 1)):
    return Matrix.LocRotScale(Vector(loc), Euler(rot), Vector(scale))


def blob_poly(cx, cy, R, sx=1.0, sy=1.0, ang=0.0, n=48, seed=0):
    r = random.Random(seed)
    a1, a2, a3 = r.uniform(0, TAU), r.uniform(0, TAU), r.uniform(0, TAU)
    pts = []
    for i in range(n):
        t = TAU * i / n
        rr = R * (1 + 0.18 * math.sin(3 * t + a1) + 0.10 * math.sin(5 * t + a2) + 0.06 * math.sin(9 * t + a3))
        x, y = rr * math.cos(t) * sx, rr * math.sin(t) * sy
        pts.append((cx + x * math.cos(ang) - y * math.sin(ang), cy + x * math.sin(ang) + y * math.cos(ang)))
    return pts


def slab(name, pts, z0, z1, material):
    bm = bmesh.new()
    vs = [bm.verts.new((x, y, z0)) for x, y in pts]
    face = bm.faces.new(vs)
    ext = bmesh.ops.extrude_face_region(bm, geom=[face])
    top = [e for e in ext["geom"] if isinstance(e, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, verts=top, vec=(0, 0, z1 - z0))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return new_obj(name, bm, material)


def point_in_poly(x, y, pts):
    inside = False
    j = len(pts) - 1
    for i in range(len(pts)):
        xi, yi = pts[i]
        xj, yj = pts[j]
        if ((yi > y) != (yj > y)) and (x < (xj - xi) * (y - yi) / (yj - yi + 1e-9) + xi):
            inside = not inside
        j = i
    return inside


# ---------------------------------------------------------------- terrain
WATER_Z = 0.0

ISLANDS = [  # cx, cy, R, sx, sy, angle
    (1.5, 0.5, 5.2, 1.25, 0.85, 0.5),
    (-6.5, 9.0, 5.0, 1.9, 0.55, -0.55),
    (11.0, 3.5, 4.4, 0.9, 1.3, 0.2),
    (12.5, -10.5, 5.0, 1.2, 1.0, 0.0),
    (-11.0, 4.0, 3.0, 1.0, 1.5, 0.3),
    (-2.8, -6.5, 1.3, 1.0, 1.0, 0.0),
]
ISLAND_TOPS = []
for k, (cx, cy, R, sx, sy, ang) in enumerate(ISLANDS):
    pts = blob_poly(cx, cy, R, sx, sy, ang, seed=k)
    slab(f"sand{k}", pts, -0.3, 0.12, M_SAND)
    top = blob_poly(cx, cy, R * 0.86, sx, sy, ang, seed=k)
    g = slab(f"grass{k}", top, 0.0, 0.22, M_GRASS)
    # vertex-colour the grass top in patchy autumn tones
    ISLAND_TOPS.append(top)

# stone weir + lower basin (bottom-left corner)
weir_bm = bmesh.new()
A, B = Vector((-26.0, 11.0)), Vector((11.0, -26.0))
d = (B - A)
n = Vector((-d.y, d.x)).normalized()          # points towards the upper water
steps = 72
for i in range(steps):
    p = A + d * (i + 0.5) / steps
    add_prim(weir_bm, "cube", M((p.x, p.y, 0.05), (0, 0, math.atan2(d.y, d.x)), (d.length / steps * 0.92, 0.9, 0.35)))
WEIR = new_obj("weir", weir_bm, M_STONE)
flow_bm = bmesh.new()
_q = [A - n * 0.35, B - n * 0.35, B - n * 3.2, A - n * 3.2]
_qz = [0.02, 0.02, -2.2, -2.2]
_qa, _qb = A - d * 0.2, B + d * 0.2
_q = [_qa - n * 0.35, _qb - n * 0.35, _qb - n * 3.2, _qa - n * 3.2]
flow_bm.faces.new([flow_bm.verts.new((p.x, p.y, z)) for p, z in zip(_q, _qz)])
FLOW = new_obj("flow", flow_bm, M_FLOW)


def clip_halfplane(poly, a, nrm, off):
    """Keep the part of a polygon where (p - a).dot(nrm) >= off (Sutherland-Hodgman, one edge)."""
    out = []
    f = lambda p: (Vector(p) - a).dot(nrm) - off
    for i in range(len(poly)):
        p, q = poly[i], poly[(i + 1) % len(poly)]
        fp, fq = f(p), f(q)
        if fp >= 0:
            out.append(p)
        if (fp >= 0) != (fq >= 0):
            t = fp / (fp - fq)
            out.append((p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t))
    return out


_sq = [(-40, -40), (40, -40), (40, 40), (-40, 40)]
_wpoly = clip_halfplane(_sq, A, n, -0.35)
water_bm = bmesh.new()
water_bm.faces.new([water_bm.verts.new((x, y, WATER_Z)) for x, y in _wpoly])
WATER = new_obj("water", water_bm, M_WATER)
basin_bm = bmesh.new()
_bpoly = clip_halfplane([(-60, -60), (60, -60), (60, 60), (-60, 60)], A, -n, 3.1)
basin_bm.faces.new([basin_bm.verts.new((x, y, -2.2)) for x, y in _bpoly])
BASIN = new_obj("basin", basin_bm, M_FLOW)



def above_weir(x, y):
    return (Vector((x, y)) - A).dot(n) > -0.6


# ---------------------------------------------------------------- vegetation (merged per material)
veg = bmesh.new()
rocks = bmesh.new()
AUTUMN = [(0.45, 0.16, 0.05), (0.55, 0.26, 0.07), (0.32, 0.10, 0.06), (0.25, 0.20, 0.07),
          (0.60, 0.12, 0.08), (0.18, 0.16, 0.06)]
REED = [(0.07, 0.05, 0.03), (0.11, 0.08, 0.04), (0.16, 0.12, 0.05), (0.05, 0.07, 0.04)]
SHEEP_SPOTS, MILL_POS = [], Vector((2.4, 0.2))
for k, pts in enumerate(ISLAND_TOPS):
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    area = (max(xs) - min(xs)) * (max(ys) - min(ys))
    tries = int(area * 7)
    for _ in range(tries):
        x, y = rng.uniform(min(xs), max(xs)), rng.uniform(min(ys), max(ys))
        if not point_in_poly(x, y, pts):
            continue
        if k == 0 and (Vector((x, y)) - MILL_POS).length < 2.0:
            continue
        if k == 0 and -2.2 < x < 0.6 and -2.0 < y < 1.0:         # sheep meadow
            if rng.random() < 0.85:
                continue
        r = rng.random()
        z = 0.22
        if r < 0.55:                                              # reed clump
            for _ in range(rng.randint(5, 10)):
                h = rng.uniform(0.45, 1.0)
                add_prim(veg, "cone", M((x + rng.uniform(-0.15, 0.15), y + rng.uniform(-0.15, 0.15), z + h / 2),
                                        (rng.uniform(-0.12, 0.12), rng.uniform(-0.12, 0.12), 0)),
                         rng.choice(REED), seg=3, r1=0.035, r2=0.0, depth=h)
        elif r < 0.78:                                            # low bush
            s = rng.uniform(0.14, 0.32)
            add_prim(veg, "ico", M((x, y, z + s * 0.6), (0, 0, rng.uniform(0, 3)), (s, s, s * 0.75)),
                     rng.choice(AUTUMN), sub=1)
        elif r < 0.80:                                            # small autumn tree
            h = rng.uniform(1.0, 1.6)
            add_prim(veg, "cone", M((x, y, z + h / 2)), (0.13, 0.07, 0.04), seg=5, r1=0.07, r2=0.05, depth=h)
            s = rng.uniform(0.4, 0.62)
            add_prim(veg, "ico", M((x, y, z + h + s * 0.4), (0, 0, rng.uniform(0, 3)), (s, s, s * 0.85)),
                     rng.choice(AUTUMN[:3]), sub=1)
        elif r < 0.88:                                            # rock
            s = rng.uniform(0.15, 0.4)
            g = rng.uniform(0.18, 0.30)
            add_prim(rocks, "ico", M((x, y, z + s * 0.3), (rng.uniform(0, 3), 0, rng.uniform(0, 3)), (s, s * 0.8, s * 0.6)),
                     (g, g * 0.97, g * 0.9), sub=1)
        else:                                                     # red/orange flowers
            for _ in range(3):
                add_prim(veg, "ico", M((x + rng.uniform(-0.2, 0.2), y + rng.uniform(-0.2, 0.2), z + 0.08), scale=(0.06,) * 3),
                         rng.choice([(0.7, 0.10, 0.08), (0.8, 0.45, 0.10), (0.6, 0.3, 0.5)]), sub=0)
# reeds standing in shallow water along shores
for k, pts in enumerate(ISLANDS[:4]):
    cx, cy, R, sx, sy, ang = pts
    for _ in range(30):
        t = rng.uniform(0, TAU)
        poly = blob_poly(cx, cy, R * rng.uniform(1.02, 1.12), sx, sy, ang, seed=k)
        x, y = poly[int(t / TAU * len(poly)) % len(poly)]
        if not above_weir(x, y):
            continue
        for _ in range(rng.randint(2, 5)):
            h = rng.uniform(0.4, 0.9)
            add_prim(veg, "cone", M((x + rng.uniform(-0.15, 0.15), y + rng.uniform(-0.15, 0.15), h / 2)),
                     rng.choice(REED), seg=3, r1=0.03, r2=0.0, depth=h)
# lily pads near the ducks
for _ in range(14):
    x, y = rng.uniform(-9.5, -5.5), rng.uniform(-5, -1.5)
    add_prim(veg, "cone", M((x, y, 0.02)), rng.choice([(0.45, 0.13, 0.07), (0.30, 0.16, 0.06)]),
             seg=8, r1=rng.uniform(0.15, 0.25), r2=rng.uniform(0.15, 0.25), depth=0.02)
VEG = new_obj("veg", veg, M_VEG)
ROCKS = new_obj("rocks", rocks, M_ROCK)

# ---------------------------------------------------------------- windmill
mill = bmesh.new()
mx, my = MILL_POS
add_prim(mill, "cone", M((mx, my, 0.22 + 1.6)), seg=10, r1=0.95, r2=0.62, depth=3.2)
add_prim(mill, "cone", M((mx, my, 0.22 + 0.15)), seg=10, r1=1.25, r2=1.15, depth=0.3)
MILL = new_obj("mill", mill, M_WALL)
roof = bmesh.new()
add_prim(roof, "cone", M((mx, my, 0.22 + 3.2 + 0.55)), seg=10, r1=0.85, r2=0.08, depth=1.1)
ROOF = new_obj("roof", roof, M_ROOF)
win = bmesh.new()
_cam_rot = Euler((math.radians(50), 0, math.radians(28)))
_fwd = _cam_rot.to_matrix() @ Vector((0, 0, -1))
SAIL_DIR = Vector((-_fwd.x, -_fwd.y, 0)).normalized()          # hub axis points at the camera
for (zz, ang) in [(1.0, -60), (2.2, -75), (2.6, -35)]:
    a = math.radians(ang)
    r = 0.95 - (zz / 3.2) * 0.33 + 0.02
    add_prim(win, "cube", M((mx + math.cos(a) * r, my + math.sin(a) * r, 0.22 + zz), (0, 0, a), (0.06, 0.22, 0.32)))
door_a = math.radians(-100)
add_prim(win, "cube", M((mx + math.cos(door_a) * 1.0, my + math.sin(door_a) * 1.0, 0.6), (0, 0, door_a), (0.06, 0.35, 0.65)))
WINDOWS = new_obj("windows", win, M_WINDOW)
HUB = Vector((mx + SAIL_DIR.x * 0.75, my + SAIL_DIR.y * 0.75, 0.22 + 3.0))
sails = bmesh.new()
for i in range(4):
    # each sail: a spar + a lattice panel, built along +Z then rotated about the hub axis (local X)
    rot = Matrix.Rotation(TAU * i / 4, 4, "X")
    for m_ in (M((0, 0, 1.4), scale=(0.07, 0.07, 2.8)), M((0, 0.3, 1.65), scale=(0.03, 0.55, 2.1))):
        bm_tmp_mat = rot @ m_
        add_prim(sails, "cube", bm_tmp_mat)
add_prim(sails, "cube", M(scale=(0.25, 0.25, 0.25)))
SAILS = new_obj("sails", sails, M_SAIL)
SAIL_BASE_ROT = math.atan2(SAIL_DIR.y, SAIL_DIR.x)
SAILS.location = HUB
# little dock + rowboat
dock = bmesh.new()
for i in range(6):
    add_prim(dock, "cube", M((-2.3 - i * 0.42, -3.6 - i * 0.18, 0.18), (0, 0, 0.4), (0.38, 0.9, 0.06)))
for (px, py) in [(-2.2, -3.2), (-2.4, -4.1), (-4.3, -4.0), (-4.5, -4.9)]:
    add_prim(dock, "cube", M((px, py, 0.05), scale=(0.1, 0.1, 0.6)))
DOCK = new_obj("dock", dock, M_WOOD)
boat = bmesh.new()
add_prim(boat, "ico", M(scale=(0.8, 0.32, 0.2)), sub=2)
BOAT = new_obj("boat", boat, M_WOOD_DK)
BOAT_HOME = Vector((-4.6, -5.6, 0.06))
# fence on the main island
fence = bmesh.new()
for i in range(7):
    x, y = -2.6 + i * 0.55, -2.4 + i * 0.12
    add_prim(fence, "cube", M((x, y, 0.45), scale=(0.07, 0.07, 0.5)))
add_prim(fence, "cube", M((-0.95, -2.05, 0.55), (0, 0, 0.21), (3.4, 0.05, 0.06)))
add_prim(fence, "cube", M((-0.95, -2.05, 0.38), (0, 0, 0.21), (3.4, 0.05, 0.06)))
FENCE = new_obj("fence", fence, M_WOOD)

# ---------------------------------------------------------------- cloud
cloud = bmesh.new()
for (x, y, z, s) in [(0, 0, 0, 1.2), (1.1, 0.2, 0.1, 1.0), (-1.1, -0.1, 0.0, 0.95), (0.4, 0.5, 0.5, 0.9),
                     (-0.5, 0.4, 0.45, 0.8), (1.8, -0.2, -0.1, 0.7), (-1.8, 0.1, -0.15, 0.65), (0.2, -0.4, 0.3, 0.8)]:
    add_prim(cloud, "ico", M((x, y, z), scale=(s, s, s * 0.8)), sub=2)
CLOUD = new_obj("cloud", cloud, M_CLOUD, smooth=True)
CLOUD_HOME = Vector((8.5, 9.0, 6.5))


# ---------------------------------------------------------------- animals
def make_duck(name, drake):
    bm = bmesh.new()
    add_prim(bm, "ico", M(scale=(0.28, 0.16, 0.12)), sub=1)
    ob = new_obj(name, bm, M_DUCK)
    h = bmesh.new()
    add_prim(h, "ico", M((0.24, 0, 0.16), scale=(0.09, 0.09, 0.09)), sub=1)
    head = new_obj(name + "_head", h, M_DUCK_HEAD if drake else M_DUCK)
    b = bmesh.new()
    add_prim(b, "cube", M((0.34, 0, 0.14), scale=(0.08, 0.05, 0.03)))
    beak = new_obj(name + "_beak", b, M_BEAK)
    head.parent = ob
    beak.parent = ob
    return ob


DUCKS = [make_duck("duck0", True), make_duck("duck1", False), make_duck("duck2", True)]


def make_sheep(name):
    bm = bmesh.new()
    add_prim(bm, "ico", M(scale=(0.42, 0.28, 0.26)), sub=2)
    ob = new_obj(name, bm, M_WOOL, smooth=True)
    h = bmesh.new()
    add_prim(h, "ico", M((0.38, 0, 0.0), scale=(0.14, 0.1, 0.11)), sub=1)
    for lx in (-0.22, 0.22):
        for ly in (-0.12, 0.12):
            add_prim(h, "cube", M((lx, ly, -0.28), scale=(0.06, 0.06, 0.25)))
    head = new_obj(name + "_head", h, M_FACE)
    head.parent = ob
    return ob, head


SHEEP = []
for i, (x, y, yaw) in enumerate([(-1.3, -0.9, 0.4), (-0.2, -1.5, 2.6), (-1.6, 0.3, -0.9)]):
    s, h = make_sheep(f"sheep{i}")
    s.location = (x, y, 0.22 + 0.42)
    s.rotation_euler = (0, 0, yaw)
    SHEEP.append((s, h, i))

# ---------------------------------------------------------------- light + camera
sun_data = bpy.data.lights.new("sun", "SUN")
sun_data.energy = 2.6
sun_data.angle = math.radians(8)
sun_data.color = (1.0, 0.90, 0.80)
sun = bpy.data.objects.new("sun", sun_data)
sun.rotation_euler = Euler((math.radians(48), 0, math.radians(-35)))
scene.collection.objects.link(sun)

cam_data = bpy.data.cameras.new("cam")
cam_data.type = "ORTHO"
cam_data.ortho_scale = 27.0
cam = bpy.data.objects.new("cam", cam_data)
rot = Euler((math.radians(50), 0, math.radians(28)))
target = Vector((1.0, -0.5, 0))
forward = rot.to_matrix() @ Vector((0, 0, -1))
cam.location = target - forward * 60
cam.rotation_euler = rot
cam_data.clip_end = 200
scene.collection.objects.link(cam)
scene.camera = cam


# ---------------------------------------------------------------- animation (set per frame, loops over DUR)
def animate(t):
    w = TAU / DUR
    WATER_NOISE.inputs["W"].default_value = 0.6 * math.sin(w * t) + 0.3 * math.cos(2 * w * t)
    FLOW_MAP.inputs["Location"].default_value[1] = -t * 0.8          # streaks travel down the weir (seam hidden by distortion)
    SAILS.rotation_euler = Euler((-w * t * 2, 0, SAIL_BASE_ROT))       # 2 turns per loop
    CLOUD.location = CLOUD_HOME + Vector((1.6 * math.sin(w * t), 0.8 * math.sin(2 * w * t + 1), 0.15 * math.sin(3 * w * t)))
    for i, d in enumerate(DUCKS):
        cx, cy, rr, sp = [(-7.5, -3.2, 1.6, 1), (-7.0, -3.6, 1.0, -2), (-8.6, -2.6, 0.7, 1)][i]
        a = sp * w * t + i * 2.1
        d.location = (cx + rr * math.cos(a), cy + rr * math.sin(a) * 0.8, 0.06 + 0.02 * math.sin(10 * w * t + i))
        d.rotation_euler = (0, 0, a + math.copysign(math.pi / 2, sp))
    BOAT.location = BOAT_HOME + Vector((0, 0, 0.03 * math.sin(4 * w * t)))
    BOAT.rotation_euler = (0.06 * math.sin(4 * w * t + 1), 0.04 * math.sin(3 * w * t), 0.3)
    for s, h, i in SHEEP:
        graze = max(0.0, math.sin(w * t * (2 + i) + i * 2))
        h.rotation_euler = (0, 0.5 * graze, 0)


def render_mask():
    """White = water surface (for post-process ripples), black elsewhere."""
    mw = bpy.data.materials.new("mask_white")
    mw.use_nodes = True
    nt = mw.node_tree
    nt.nodes.remove(nt.nodes["Principled BSDF"])
    em = nt.nodes.new("ShaderNodeEmission")
    em.inputs[0].default_value = (1, 1, 1, 1)
    nt.links.new(em.outputs[0], nt.nodes["Material Output"].inputs[0])
    mb = bpy.data.materials.new("mask_black")
    mb.use_nodes = True
    mb.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0, 0, 0, 1)
    mb.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 1
    saved = {}
    for ob in scene.objects:
        if ob.type == "MESH":
            saved[ob.name] = list(ob.data.materials)
            ob.data.materials.clear()
            ob.data.materials.append(mw if ob.name == "water" else mb)
        if ob.name in ("cloud", "sun"):
            ob.hide_render = True
    bg.inputs[1].default_value = 0.0
    scene.cycles.samples = 1
    scene.cycles.use_denoising = False
    animate(0)
    scene.render.filepath = os.path.join(OUT, "water_mask.png")
    bpy.ops.render.render(write_still=True)
    for ob in scene.objects:
        if ob.type == "MESH":
            ob.data.materials.clear()
            for m_ in saved[ob.name]:
                ob.data.materials.append(m_)
        if ob.name in ("cloud", "sun"):
            ob.hide_render = False
    bg.inputs[1].default_value = 0.9
    scene.cycles.samples = 24
    scene.cycles.use_denoising = True


if F0 == 0 and not os.path.exists(os.path.join(OUT, "water_mask.png")):
    render_mask()

for f in range(F0, F1 + 1):
    path = os.path.join(OUT, f"f{f:04d}.png")
    if os.path.exists(path):
        continue
    animate(f / FPS)
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
    print("rendered", f, flush=True)
