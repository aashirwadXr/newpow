"""
Procedural "line-boil" animation: a smoking skeleton pushing a boulder uphill in the rain.

Everything is drawn from short hatch strokes on black, re-randomised every other
frame to get the hand-drawn shimmer. Output: 8 s, 1080x1080, 24 fps MP4 (seamless loop).

Usage:  python3 video/skeleton_boulder.py [out.mp4]
Needs:  numpy, Pillow, ffmpeg on PATH.
"""
import math
import random
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw

# ---------------------------------------------------------------- settings
W = H = 1080          # output size
SS = 2                # supersampling factor (render at 2x, downscale -> anti-aliased)
FPS = 24
DUR = 8.0
NFRAMES = int(FPS * DUR)
BOIL_EVERY = 2        # re-randomise strokes every N frames (12 fps boil)

PINK = (255, 46, 136)
PINK_DIM = (150, 22, 82)
PINK_HOT = (255, 110, 175)
BLUE = (38, 96, 255)
BLUE_LT = (95, 150, 255)
GREEN = (70, 235, 80)
GREEN_DK = (40, 150, 60)
BONE = (242, 240, 232)
BONE_FAR = (165, 162, 158)
BLACK = (0, 0, 0)

SLOPE = 0.42                      # ground rises to the right
SLOPE_A = math.atan(SLOPE)
GROUND_DIR = (math.cos(SLOPE_A), -math.sin(SLOPE_A))     # up-hill unit vector


def ground_y(x):
    return 985 - x * SLOPE + 6 * math.sin(x * 0.011) + 4 * math.sin(x * 0.027 + 1.3)


def bg_hill_y(x):
    return 760 - 110 * math.exp(-((x - 40) / 110) ** 2)


# ---------------------------------------------------------------- skeleton rig
K = 1.0
THIGH, SHIN = 118 * K, 112 * K
TORSO = 150 * K
UPPER_ARM, FOREARM = 84 * K, 80 * K
SKULL = 36 * K
NECK = 16 * K
TORSO_LEAN = math.radians(52)     # from vertical, leaning into the boulder

CYCLE = DUR / 6                   # 6 steps cycles per 8 s -> loops
STANCE = 0.62
FOOT_FRONT, FOOT_BACK = 30 * K, -112 * K
STRIDE = FOOT_FRONT - FOOT_BACK
GROUND_SPEED = STRIDE / (STANCE * CYCLE)          # px/s along x

HIP_X = 255
HIP_H = 168 * K                   # hip height above ground at hip x


def rot(v, a):
    c, s = math.cos(a), math.sin(a)
    return (v[0] * c - v[1] * s, v[0] * s + v[1] * c)


def add(a, b, k=1.0):
    return (a[0] + b[0] * k, a[1] + b[1] * k)


def sub(a, b):
    return (a[0] - b[0], a[1] - b[1])


def length(v):
    return math.hypot(v[0], v[1])


def norm(v):
    l = length(v) or 1.0
    return (v[0] / l, v[1] / l)


def ik(a, t, l1, l2, bend):
    """2-bone IK; bend=-1 knee forward/up, +1 elbow down."""
    d = sub(t, a)
    dist = max(abs(l1 - l2) + 1e-3, min(l1 + l2 - 1e-3, length(d)))
    a0 = math.atan2(d[1], d[0])
    cosA = (l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist)
    al = math.acos(max(-1, min(1, cosA)))
    ang = a0 + bend * al
    j = (a[0] + l1 * math.cos(ang), a[1] + l1 * math.sin(ang))
    ang2 = math.atan2(t[1] - j[1], t[0] - j[0])
    end = (j[0] + l2 * math.cos(ang2), j[1] + l2 * math.sin(ang2))
    return j, end


TORSO_DIR = (math.sin(TORSO_LEAN), -math.cos(TORSO_LEAN))
BASE_HIP = (HIP_X, ground_y(HIP_X) - HIP_H)
BASE_SHOULDER = add(BASE_HIP, TORSO_DIR, TORSO)

# --- place the boulder so the hands just reach it
R_BOULDER = 175


def boulder_center(contact_x):
    n = (-math.sin(SLOPE_A), -math.cos(SLOPE_A))
    gx, gy = contact_x, ground_y(contact_x)
    return (gx + n[0] * R_BOULDER, gy + n[1] * R_BOULDER)


def _solve_boulder():
    reach = (UPPER_ARM + FOREARM) * 0.86
    best = None
    for cx in np.linspace(BASE_SHOULDER[0], BASE_SHOULDER[0] + 500, 2000):
        c = boulder_center(cx)
        gap = length(sub(c, BASE_SHOULDER)) - R_BOULDER
        if best is None or abs(gap - reach) < abs(best[1] - reach):
            best = (c, gap)
    return best[0]


B_CENTER = _solve_boulder()
OMEGA = (GROUND_SPEED / math.cos(SLOPE_A)) / R_BOULDER   # rolling speed (rad/s)


def pose(t):
    """All joint positions for time t (seconds)."""
    p = (t / CYCLE) % 1.0
    bob = 5 * math.cos(4 * math.pi * p)
    surge = 4 * math.sin(4 * math.pi * p)
    hip = (BASE_HIP[0] + surge * 0.5, BASE_HIP[1] + bob)
    lean = TORSO_LEAN + math.radians(2.5) * math.sin(4 * math.pi * p + 0.6)
    tdir = (math.sin(lean), -math.cos(lean))
    shoulder = add(hip, tdir, TORSO)

    def foot(ph):
        ph %= 1.0
        if ph < STANCE:
            u = ph / STANCE
            fx = hip[0] + FOOT_FRONT + (FOOT_BACK - FOOT_FRONT) * u
            lift = 0.0
        else:
            u = (ph - STANCE) / (1 - STANCE)
            s = 0.5 - 0.5 * math.cos(math.pi * u)
            fx = hip[0] + FOOT_BACK + (FOOT_FRONT - FOOT_BACK) * s
            lift = 34 * math.sin(math.pi * u)
        return (fx, ground_y(fx) - 8 - lift), ph < STANCE

    legs = []
    for ph in (p, p + 0.5):
        ankle, planted = foot(ph)
        knee, ankle = ik(hip, ankle, THIGH, SHIN, -1)
        legs.append((knee, ankle, planted))

    # hands on boulder surface, nearest point to shoulder, slightly lower
    to_s = norm(sub(shoulder, B_CENTER))
    arms = []
    for k, off in enumerate((0.10, -0.06)):
        dirn = rot(to_s, -off - 0.10)  # rotate around centre
        target = add(B_CENTER, dirn, R_BOULDER - 1)
        target = add(target, (0, 3 * math.sin(4 * math.pi * p + k)))
        elbow, hand = ik(add(shoulder, (-6 * k, -4 * k)), target, UPPER_ARM, FOREARM, +1)
        arms.append((add(shoulder, (-6 * k, -4 * k)), elbow, hand, dirn))

    head_tilt = math.radians(-12) + math.radians(3) * math.sin(4 * math.pi * p + 1.0)
    neck_end = add(shoulder, tdir, NECK)
    return dict(p=p, hip=hip, shoulder=shoulder, tdir=tdir, legs=legs, arms=arms,
                head_tilt=head_tilt, neck_end=neck_end)


# skull outline in skull units, x forward (right), y down
SKULL_ATTACH = (-0.28, 0.72)


def skull_xf(ps):
    tilt = ps["head_tilt"]
    origin = sub(ps["neck_end"], rot((SKULL_ATTACH[0] * SKULL, SKULL_ATTACH[1] * SKULL), tilt))

    def f(x, y):
        v = rot((x * SKULL, y * SKULL), tilt)
        return (origin[0] + v[0], origin[1] + v[1])
    return f


def mouth_and_tip(ps):
    f = skull_xf(ps)
    mouth = f(1.03, 0.77)
    tip = f(1.03 + 1.05, 0.77 - 0.18)
    return mouth, tip


# ---------------------------------------------------------------- smoke model
DRAGS = [0.7, 0.7 + DUR / 3, 0.7 + 2 * DUR / 3]     # cigarette drags (s)
DRAG_LEN = 0.55
EXHALE_DELAY = 0.45
WIND = (-34.0, 0.0)


def ember_heat(t):
    h = 0.35 + 0.08 * math.sin(t * 11) + 0.05 * math.sin(t * 23.0)
    for d in DRAGS:
        dt = (t - d) % DUR
        if dt < DRAG_LEN:
            h = max(h, 0.35 + 0.65 * math.sin(math.pi * dt / DRAG_LEN))
    return min(1.0, h)


RIBBON_DT = 1 / 60
RIBBON_LIFE = 3.2
RIBBONS = [dict(phase=0.0, amp=16, vx=4, vy=-48), dict(phase=2.1, amp=11, vx=-6, vy=-58)]


def make_smoke():
    rng = random.Random(7)
    parts = []
    # exhaled puffs from the mouth
    for d in DRAGS:
        for i in range(70):
            b = d + DRAG_LEN + EXHALE_DELAY + rng.uniform(0, 0.8)
            ang = math.radians(rng.uniform(-40, 5))
            sp = rng.uniform(120, 230)
            parts.append(dict(b=b % DUR, life=rng.uniform(1.8, 3.4),
                              vx=math.cos(ang) * sp, vy=math.sin(ang) * sp,
                              wob=rng.uniform(6, 18), wf=rng.uniform(0.8, 2.0), ph=rng.uniform(0, 6.28)))
    return parts


SMOKE = make_smoke()


# ---------------------------------------------------------------- tree (fixed structure)
def make_tree():
    rng = random.Random(3)
    segs = []
    base_x = B_CENTER[0] + R_BOULDER * 0.95
    base = (base_x, ground_y(base_x) + 4)

    def grow(p, ang, ln, w, depth):
        if depth == 0 or ln < 7:
            return
        bend = rng.uniform(-0.22, 0.22)
        mid = add(p, (math.cos(ang + bend) * ln * 0.5, math.sin(ang + bend) * ln * 0.5))
        end = add(mid, (math.cos(ang - bend * 0.5) * ln * 0.5, math.sin(ang - bend * 0.5) * ln * 0.5))
        segs.append((p, mid, w, depth))
        segs.append((mid, end, w * 0.9, depth))
        n = 2 if rng.random() < 0.75 else 3
        for i in range(n):
            spread = rng.uniform(0.25, 0.65) * (1 if i % 2 == 0 else -1)
            grow(end, ang + spread + rng.uniform(-0.15, 0.15), ln * rng.uniform(0.66, 0.8), w * 0.68, depth - 1)

    grow(base, -math.pi / 2 - 0.15, 105, 10, 8)
    return segs


TREE = make_tree()
TREE_TOP_SWAY = 1.0


# ---------------------------------------------------------------- ground props
def make_props():
    rng = random.Random(11)
    props = []
    span = 1700.0
    for i in range(16):
        props.append(dict(kind="grass", s=rng.uniform(0, span), size=rng.uniform(26, 48),
                          depth=rng.uniform(4, 60), n=rng.randint(6, 11)))
    for i in range(22):
        props.append(dict(kind="rock", s=rng.uniform(0, span), size=rng.uniform(20, 60),
                          depth=rng.uniform(10, 260)))
    return props, span


PROPS, PROP_SPAN = make_props()

# far background grass on the static ridge (doesn't scroll – it's "far")
RIDGE_GRASS = [(840, 0), (1010, 0)]


# ---------------------------------------------------------------- rain
def make_rain():
    rng = random.Random(5)
    return [(rng.uniform(0, W + 300), rng.uniform(0, H), rng.uniform(0.75, 1.25), rng.random())
            for _ in range(1100)]


RAIN = make_rain()
RAIN_DIR = norm((-0.42, 1.0))
RAIN_SPEED = 900.0


# ---------------------------------------------------------------- drawing helpers
class Canvas:
    def __init__(self):
        self.img = Image.new("RGB", (W * SS, H * SS), BLACK)
        self.d = ImageDraw.Draw(self.img)

    def line(self, pts, col, w=2.0):
        self.d.line([(x * SS, y * SS) for x, y in pts], fill=col, width=max(1, int(round(w * SS))), joint="curve")

    def dot(self, p, r, col):
        x, y = p[0] * SS, p[1] * SS
        r *= SS
        self.d.ellipse((x - r, y - r, x + r, y + r), fill=col)

    def poly(self, pts, col, outline=None, w=1):
        self.d.polygon([(x * SS, y * SS) for x, y in pts], fill=col, outline=outline,
                       width=max(1, int(w * SS)))

    def dash(self, x, y, ang, ln, col, w):
        dx, dy = math.cos(ang) * ln * 0.5, math.sin(ang) * ln * 0.5
        self.d.line(((x - dx) * SS, (y - dy) * SS, (x + dx) * SS, (y + dy) * SS),
                    fill=col, width=max(1, int(round(w * SS))))

    def bone(self, a, b, w, col, outline=5.0):
        self.line([a, b], BLACK, w + outline)
        self.dot(a, (w + outline) / 2, BLACK)
        self.dot(b, (w + outline) / 2, BLACK)
        self.line([a, b], col, w)
        self.dot(a, w * 0.62, col)
        self.dot(b, w * 0.62, col)


def mix(c1, c2, k):
    return tuple(int(c1[i] + (c2[i] - c1[i]) * k) for i in range(3))


# ---------------------------------------------------------------- scene layers
def draw_sky(cv, rng, t):
    gy_cache = ground_y
    # boiling field of pink dashes (the "pouring rain" texture)
    for _ in range(2300):
        x, y = rng.uniform(-10, W + 10), rng.uniform(-10, H)
        if y > gy_cache(x) + 2:
            continue
        if (x - B_CENTER[0]) ** 2 + (y - B_CENTER[1]) ** 2 < (R_BOULDER + 2) ** 2:
            continue
        c = PINK if rng.random() < 0.72 else PINK_DIM
        cv.dash(x, y, math.atan2(RAIN_DIR[1], RAIN_DIR[0]) + rng.uniform(-0.18, 0.18),
                rng.uniform(7, 15), c, rng.uniform(1.6, 2.8))
    # moving rain drops (actually fall)
    ang = math.atan2(RAIN_DIR[1], RAIN_DIR[0])
    for x0, y0, sp, ph in RAIN:
        dist = (t * RAIN_SPEED * sp + ph * 2000) % (H + 200)
        x = (x0 + RAIN_DIR[0] * dist) % (W + 300) - 150
        y = (y0 + RAIN_DIR[1] * dist) % (H + 100) - 50
        c = PINK_HOT if ph < 0.25 else PINK
        cv.dash(x, y, ang, 13 * sp, c, 1.8)


def draw_moon(cv, rng):
    c = (885, 205)
    r = 38
    for _ in range(3):
        j = rng.uniform(-1.5, 1.5)
        outer, inner = [], []
        for i in range(30):
            a = math.radians(40 + i * (205 / 29))
            outer.append((c[0] + (r + j) * math.cos(a), c[1] + (r + j) * math.sin(a)))
            inner.append((c[0] + 9 + (r - 4 + j) * math.cos(a), c[1] - 9 + (r - 4 + j) * math.sin(a)))
        cv.line(outer, GREEN, rng.uniform(3, 4.5))
        cv.line(inner[3:-3], GREEN_DK, 1.5)


def draw_bg_hill(cv, rng):
    for _ in range(420):
        x = rng.uniform(0, 220)
        top = bg_hill_y(x)
        if top > ground_y(x) - 4:
            continue
        y = top + rng.uniform(0, 26) ** 1.2
        if y > ground_y(x):
            continue
        slope = math.atan(-(bg_hill_y(x + 1) - bg_hill_y(x - 1)) / 2)
        c = BLUE if y - top < 8 and rng.random() < 0.7 else (PINK if rng.random() < 0.8 else BLUE_LT)
        cv.dash(x, y, -slope + rng.uniform(-0.2, 0.2), rng.uniform(8, 18), c, rng.uniform(2, 3.5))


def draw_ground(cv, rng, t):
    a = -SLOPE_A
    for _ in range(4200):
        x = rng.uniform(-10, W + 10)
        top = ground_y(x)
        y = top + (rng.random() ** 1.6) * (H - top + 20)
        if y < top:
            continue
        depth = y - top
        r = rng.random()
        if depth < 14:
            c = BLUE if r < 0.45 else (PINK_HOT if r < 0.7 else PINK)
            w = rng.uniform(2.5, 4.2)
        else:
            c = PINK if r < 0.82 else (BLUE if r < 0.94 else PINK_DIM)
            w = rng.uniform(1.8, 3.4)
        # boulder shadow: sparse strokes downhill of contact
        cx = B_CENTER[0] + R_BOULDER * math.sin(SLOPE_A)
        if abs(x - (cx - 60)) < 140 and depth < 70 and rng.random() < 0.5:
            continue
        cv.dash(x, y, a + rng.uniform(-0.35, 0.35), rng.uniform(9, 22), c, w)

    # bright ridge line along the surface
    for _ in range(260):
        x = rng.uniform(0, W)
        cv.dash(x, ground_y(x) + rng.uniform(-1, 4), a + rng.uniform(-0.15, 0.15),
                rng.uniform(10, 24), BLUE if rng.random() < 0.55 else PINK_HOT, rng.uniform(2.5, 4))

    # scrolling props (treadmill) – move downhill with the walk
    shift = (t * GROUND_SPEED) % PROP_SPAN
    for pr in PROPS:
        x = (pr["s"] - shift) % PROP_SPAN - 200
        if x < -80 or x > W + 80:
            continue
        top = ground_y(x)
        if pr["kind"] == "grass":
            base = (x, top + pr["depth"] * 0.25)
            for i in range(pr["n"]):
                ang = math.radians(-90 - 45 + 90 * i / max(1, pr["n"] - 1)) + rng.uniform(-0.12, 0.12)
                ln = pr["size"] * rng.uniform(0.6, 1.05)
                tip = add(base, (math.cos(ang), math.sin(ang)), ln)
                mid = add(add(base, (math.cos(ang), math.sin(ang)), ln * 0.5), (2, 0))
                cv.line([base, mid, tip], GREEN if rng.random() < 0.7 else GREEN_DK, rng.uniform(1.5, 2.6))
        else:
            y = top + pr["depth"]
            for i in range(6):
                cv.dash(x + rng.uniform(-pr["size"], pr["size"]) * 0.5, y + rng.uniform(-6, 6),
                        a + rng.uniform(-0.2, 0.2), pr["size"] * rng.uniform(0.4, 0.9),
                        BLUE if rng.random() < 0.6 else BLUE_LT, rng.uniform(2.5, 4.5))

    # far grass tufts on the ridge
    for gx, _ in RIDGE_GRASS:
        base = (gx, ground_y(gx) + 2)
        for i in range(9):
            ang = math.radians(-145 + 110 * i / 8) + rng.uniform(-0.1, 0.1)
            ln = rng.uniform(20, 34)
            cv.line([base, add(base, (math.cos(ang), math.sin(ang)), ln)], GREEN_DK, 1.6)


def draw_tree(cv, rng, t):
    sway = 2.0 * math.sin(t * 1.3)
    for (a, b, w, depth) in TREE:
        k = (8 - depth) / 8.0
        off = sway * k * k * 3
        a2 = (a[0] + off * 0.8 + rng.uniform(-1, 1) * k, a[1] + rng.uniform(-1, 1) * k)
        b2 = (b[0] + off + rng.uniform(-1.5, 1.5) * k, b[1] + rng.uniform(-1.5, 1.5) * k)
        # trunk/branches are built from several jittery strokes
        n = 3 if w > 4 else 2
        for i in range(n):
            j = (rng.uniform(-w, w) * 0.35, rng.uniform(-w, w) * 0.35)
            c = BLUE if rng.random() < 0.55 else (PINK if rng.random() < 0.6 else BLUE_LT)
            cv.line([add(a2, j), add(b2, j)], c, max(1.2, w * rng.uniform(0.35, 0.6)))


def draw_boulder(cv, rng, t):
    cx, cy = B_CENTER
    R = R_BOULDER
    roll = t * OMEGA                       # clockwise = rolling uphill to the right
    # dark disc to hide rain behind
    cv.dot((cx, cy), R, BLACK)
    # fixed "craters" in boulder space make the rotation readable
    craters = [(0.3, 0.55, 0.22), (2.2, 0.65, 0.18), (3.9, 0.35, 0.25), (5.1, 0.72, 0.15)]
    for _ in range(2000):
        rr = math.sqrt(rng.random()) * R
        a = rng.uniform(0, 2 * math.pi)
        x, y = cx + rr * math.cos(a), cy + rr * math.sin(a)
        fr = rr / R
        # light from upper-right: more strokes on the rim and upper side
        lit = 0.5 + 0.5 * math.cos(a - math.radians(-60))
        dens = 0.18 + 0.75 * fr ** 3 + 0.25 * lit * fr
        if rng.random() > dens:
            continue
        local_a = a - roll
        near_crater = False
        for ca, cr, cs in craters:
            px, py = cr * math.cos(ca), cr * math.sin(ca)
            if (fr * math.cos(local_a) - px) ** 2 + (fr * math.sin(local_a) - py) ** 2 < cs * cs:
                near_crater = True
                break
        rim = fr > 0.9
        if near_crater:
            c = BLUE if rng.random() < 0.7 else PINK_DIM
        elif rim and lit > 0.45:
            c = BLUE_LT if rng.random() < 0.5 else BLUE
        else:
            c = PINK if rng.random() < 0.85 else PINK_DIM
        # strokes wrap around the sphere and turn with the roll
        ang = a + math.pi / 2 + 0.6 * (1 - fr) * math.sin(local_a * 2) + rng.uniform(-0.25, 0.25)
        cv.dash(x, y, ang, rng.uniform(8, 18) * (0.5 + 0.5 * fr), c, rng.uniform(1.8, 3.4))
    # outline arc on the lit side
    pts = []
    j = rng.uniform(-1.5, 1.5)
    for i in range(40):
        a = math.radians(-175 + i * 160 / 39)
        pts.append((cx + (R + j) * math.cos(a), cy + (R + j) * math.sin(a)))
    cv.line(pts, BLUE, 4)


def draw_skeleton(cv, rng, ps, t):
    j = lambda p, s=0.8: (p[0] + rng.uniform(-s, s), p[1] + rng.uniform(-s, s))
    hip, sh, tdir = ps["hip"], ps["shoulder"], ps["tdir"]
    nrm = (-tdir[1], tdir[0])   # belly side

    # ---- far limbs (dimmer) first
    far_leg = ps["legs"][1]
    cv.bone(j(hip), j(far_leg[0]), 7, BONE_FAR)
    cv.bone(j(far_leg[0]), j(far_leg[1]), 6, BONE_FAR)
    draw_foot(cv, rng, far_leg[1], BONE_FAR)
    far_arm = ps["arms"][1]
    cv.bone(j(far_arm[0]), j(far_arm[1]), 6, BONE_FAR)
    cv.bone(j(far_arm[1]), j(far_arm[2]), 5, BONE_FAR)
    draw_hand(cv, rng, far_arm[2], far_arm[3], BONE_FAR)

    # ---- pelvis
    R = math.atan2(tdir[1], tdir[0]) + math.pi / 2
    pel = [(-22, -8), (-6, -36), (22, -30), (30, -6), (16, 18), (-8, 22), (-24, 10)]
    pel_pts = [add(hip, rot(p, R)) for p in pel]
    cv.poly(pel_pts, BONE, outline=BLACK, w=3)
    cv.dot(add(hip, rot((4, 4), R)), 7, BLACK)

    # ---- spine (vertebrae)
    for i in range(13):
        u = i / 12
        bow = math.sin(u * math.pi) * -10       # slight hunch
        p = add(add(hip, tdir, TORSO * u), nrm, bow)
        cv.dot(j(p, 0.4), 6.5, BLACK)
        cv.dot(j(p, 0.4), 4.5, BONE)

    # ---- ribcage: oval of curved ribs hanging from the spine to the sternum
    def spine_pt(u):
        return add(add(hip, tdir, TORSO * u), nrm, math.sin(u * math.pi) * -10)
    D = 52
    for i in range(8):
        u = 0.90 - i * 0.065
        a = spine_pt(u)
        floating = i >= 6
        ue = u - 0.10 - 0.02 * i
        depth = D * (0.75 + 0.25 * math.sin(math.pi * (i + 1) / 9)) * (0.6 if floating else 1)
        b = add(add(hip, tdir, TORSO * ue), nrm, depth)
        ctrl = add(add(a, nrm, depth * 0.95), tdir, TORSO * 0.05)
        pts = []
        for k in range(10):
            s_ = k / 9
            x = (1 - s_) ** 2 * a[0] + 2 * (1 - s_) * s_ * ctrl[0] + s_ * s_ * b[0]
            y = (1 - s_) ** 2 * a[1] + 2 * (1 - s_) * s_ * ctrl[1] + s_ * s_ * b[1]
            pts.append(j((x, y), 0.4))
        cv.line(pts, BLACK, 8)
        cv.line(pts, BONE, 3.6)
    # sternum
    st_a = add(add(hip, tdir, TORSO * 0.40), nrm, D * 0.95)
    st_b = add(add(hip, tdir, TORSO * 0.80), nrm, D * 0.8)
    cv.bone(st_a, st_b, 5, BONE, 3)
    # collarbone + shoulder blade
    cv.bone(sh, add(sh, nrm, 26), 5, BONE)
    cv.bone(add(sh, tdir, -10), add(add(sh, tdir, -48), nrm, -8), 6, BONE)

    # ---- neck
    cv.bone(sh, ps["neck_end"], 6, BONE)

    # ---- near leg
    near_leg = ps["legs"][0]
    cv.bone(j(hip), j(near_leg[0]), 8, BONE)
    cv.dot(near_leg[0], 6, BONE)
    knee, ankle = near_leg[0], near_leg[1]
    perp = norm((-(ankle[1] - knee[1]), ankle[0] - knee[0]))
    cv.bone(j(add(knee, perp, 2.5)), j(add(ankle, perp, 2.5)), 5, BONE)    # tibia
    cv.bone(j(add(knee, perp, -3)), j(add(ankle, perp, -3)), 3, BONE, 4)   # fibula
    draw_foot(cv, rng, ankle, BONE)

    # ---- near arm
    s0, el, hand, dirn = ps["arms"][0]
    cv.bone(j(s0), j(el), 7, BONE)
    perp = norm((-(hand[1] - el[1]), hand[0] - el[0]))
    cv.bone(j(add(el, perp, 2.2)), j(add(hand, perp, 2.2)), 4, BONE)
    cv.bone(j(add(el, perp, -2.2)), j(add(hand, perp, -2.2)), 3, BONE, 4)
    draw_hand(cv, rng, hand, dirn, BONE)

    # ---- skull + cigarette (on top of arms)
    draw_skull(cv, rng, ps, t)


def draw_foot(cv, rng, ankle, col):
    heel = add(ankle, (-8, 6))
    toe = add(ankle, GROUND_DIR, 30)
    toe = (toe[0], min(toe[1] + 6, ground_y(toe[0]) - 2))
    cv.bone(heel, toe, 6, col)
    for k in range(3):
        a = add(toe, (0, -2 + k * 2))
        b = add(a, GROUND_DIR, 9)
        cv.line([a, b], col, 2.2)


def draw_hand(cv, rng, hand, surface_dir, col):
    # palm against the boulder, fingers fanned upward along the surface
    palm = add(hand, surface_dir, -3)
    up = (surface_dir[1], -surface_dir[0])      # tangent pointing up the surface
    base_a = math.atan2(up[1], up[0])
    cv.dot(palm, 7.5, BLACK)
    cv.dot(palm, 5.5, col)
    for k in range(4):
        a = base_a + (k - 1.5) * 0.32 + 0.35
        tip = add(palm, (math.cos(a), math.sin(a)), 13 - abs(k - 1.5) * 1.5)
        cv.line([palm, tip], BLACK, 5)
        cv.line([palm, tip], col, 2.4)
    thumb = add(palm, (-up[0] * 0.6 - surface_dir[0] * 0.8, -up[1] * 0.6 - surface_dir[1] * 0.8), 10)
    cv.line([palm, thumb], BLACK, 5)
    cv.line([palm, thumb], col, 2.4)


SKULL_PROFILE = [(-1.05, 0.0), (-0.95, -0.5), (-0.6, -0.88), (-0.1, -1.02), (0.4, -0.9), (0.78, -0.55),
                 (0.93, -0.2), (0.86, -0.02), (0.97, 0.12), (1.10, 0.36), (1.02, 0.48), (1.08, 0.62),
                 (1.03, 0.73), (0.75, 0.73), (0.45, 0.62), (0.15, 0.56), (-0.05, 0.72), (-0.35, 0.62),
                 (-0.75, 0.46), (-1.0, 0.25)]
JAW = [(0.12, 0.52), (0.30, 0.63), (0.55, 0.79), (1.00, 0.79), (1.03, 0.92), (0.93, 1.08),
       (0.55, 1.08), (0.20, 1.02), (0.08, 0.76)]


def draw_skull(cv, rng, ps, t):
    f = skull_xf(ps)
    jj = lambda: rng.uniform(-0.015, 0.015)
    heat = ember_heat(t)
    open_ = 0.0
    for d in DRAGS:
        dt = (t - (d + DRAG_LEN + EXHALE_DELAY)) % DUR
        if dt < 0.6:
            open_ = max(open_, math.sin(math.pi * dt / 0.6) * 0.22)   # radians of jaw drop

    def outline_poly(pts, col):
        for _ in range(2):   # Chaikin smoothing
            pts = [p for i in range(len(pts)) for p in (
                (0.75 * pts[i][0] + 0.25 * pts[(i + 1) % len(pts)][0], 0.75 * pts[i][1] + 0.25 * pts[(i + 1) % len(pts)][1]),
                (0.25 * pts[i][0] + 0.75 * pts[(i + 1) % len(pts)][0], 0.25 * pts[i][1] + 0.75 * pts[(i + 1) % len(pts)][1]))]
        q = [f(x + jj(), y + jj()) for x, y in pts]
        cv.line(q + [q[0]], BLACK, 7)
        cv.poly(q, col)
        cv.line(q + [q[0]], BLACK, 2.2)

    # jaw rotates around the condyle
    cx_, cy_ = 0.12, 0.52
    jaw = [(cx_ + (x - cx_) * math.cos(open_) - (y - cy_) * math.sin(open_),
            cy_ + (x - cx_) * math.sin(open_) + (y - cy_) * math.cos(open_)) for x, y in JAW]
    outline_poly(jaw, BONE)
    outline_poly(SKULL_PROFILE, BONE)
    # lower teeth
    for k in range(5):
        x = 0.62 + k * 0.09
        a_ = jaw[2][0] + (jaw[3][0] - jaw[2][0]) * (k / 4)
        b_ = jaw[2][1] + (jaw[3][1] - jaw[2][1]) * (k / 4)
        cv.line([f(a_, b_), f(a_ + 0.01, b_ + 0.12)], BLACK, 1.6)
    # upper teeth
    for k in range(5):
        x = 0.66 + k * 0.085
        cv.line([f(x, 0.60), f(x, 0.73)], BLACK, 1.6)
    cv.line([f(0.62, 0.60), f(1.05, 0.60)], BLACK, 1.4)
    # eye socket
    eye = [f(0.57 + 0.25 * math.cos(a), 0.06 + 0.24 * math.sin(a)) for a in np.linspace(0, 2 * math.pi, 18)]
    cv.poly(eye, BLACK)
    if heat > 0.7:
        cv.dot(f(0.66, 0.10), 2.4 * (heat - 0.5) * 2, (255, 120, 60))
    # nasal cavity, cheekbone, ear hole, suture
    cv.poly([f(0.90, 0.24), f(1.01, 0.46), f(0.85, 0.46)], BLACK)
    cv.line([f(0.18, 0.40), f(0.62, 0.36)], BLACK, 1.8)
    cv.dot(f(0.04, 0.42), 2.6, BLACK)
    cv.line([f(-0.15, -0.95), f(0.0, -0.6), f(-0.2, -0.3)], BLACK, 1.3)

    # cigarette
    mouth, tip = mouth_and_tip(ps)
    cv.line([mouth, tip], BLACK, 8)
    filt = add(mouth, norm(sub(tip, mouth)), 10)
    cv.line([mouth, filt], (230, 150, 70), 5)
    cv.line([filt, tip], (245, 245, 240), 5)
    # ember
    ember_col = mix((200, 40, 20), (255, 220, 120), heat)
    cv.dot(tip, 4.5 + 2.5 * heat, mix((120, 20, 10), (255, 90, 30), heat))
    cv.dot(tip, 2.5 + 2.0 * heat, ember_col)
    if heat > 0.6:
        for _ in range(int(6 * heat)):
            a = rng.uniform(0, 2 * math.pi)
            cv.dash(tip[0] + math.cos(a) * 9, tip[1] + math.sin(a) * 9, a, 5, (255, 140, 50), 1.5)


_tip_cache = {}


def tip_at(bt):
    key = round(bt * 240)
    if key not in _tip_cache:
        _tip_cache[key] = mouth_and_tip(pose(bt))
    return _tip_cache[key]


def draw_smoke(cv, rng, t):
    # --- thin ribbons rising from the ember
    n = int(DUR / RIBBON_DT)
    for rb in RIBBONS:
        prev = None
        # walk births from newest to oldest
        k0 = int(math.floor(t / RIBBON_DT))
        for step in range(int(RIBBON_LIFE / RIBBON_DT)):
            bt = (k0 - step) * RIBBON_DT
            age = t - bt
            if age < 0:
                continue
            tip = tip_at(bt % DUR)[1]
            bump = 1.0 + 1.8 * max(0.0, ember_heat(bt % DUR) - 0.5)   # thicker plume while dragging
            wob = rb["amp"] * min(1.0, age * 0.9) * math.sin(2 * math.pi * 0.55 * age + bt * 2.3 + rb["phase"])
            wob += 0.5 * rb["amp"] * min(1.0, age * 0.6) * math.sin(2 * math.pi * 1.3 * age + bt * 5.1)
            x = tip[0] + rb["vx"] * age + WIND[0] * age * age * 0.5 + wob
            y = tip[1] + rb["vy"] * age * (1 + 0.08 * age)
            fade = (1 - age / RIBBON_LIFE) ** 1.2
            if prev is not None and rng.random() > (age / RIBBON_LIFE) ** 2 * 0.8:
                col = mix((60, 20, 50), (225, 222, 238), fade)
                cv.line([prev, (x, y)], col, (1.2 + 2.2 * fade) * bump)
            prev = (x, y)
    # --- exhaled puffs: wispy strokes streaming forward then rising
    for sp in SMOKE:
        age = (t - sp["b"]) % DUR
        if age > sp["life"]:
            continue
        mouth = tip_at((t - age) % DUR)[0]
        k = 2.2

        def at(ag):
            e = (1 - math.exp(-k * ag)) / k
            x = mouth[0] + 6 + sp["vx"] * e + WIND[0] * 0.4 * ag
            y = mouth[1] + sp["vy"] * e - 38 * ag
            x += math.sin(sp["ph"] + ag * sp["wf"] * 2 * math.pi) * sp["wob"] * min(1, ag)
            return x, y
        fade = (1 - age / sp["life"]) ** 1.4 * min(1.0, age * 3)
        if fade < 0.06:
            continue
        col = mix((50, 15, 45), (215, 212, 228), fade)
        trail = 0.10 + 0.12 * age
        pts = [at(max(0.0, age - trail * i / 4)) for i in range(5)]
        pts = [(x + rng.uniform(-1, 1), y + rng.uniform(-1, 1)) for x, y in pts]
        cv.line(pts, col, 1.2 + 2.0 * fade)


# ---------------------------------------------------------------- render
def render_frame(i):
    t = i / FPS
    boil = i // BOIL_EVERY
    rng = random.Random(1000 + boil)
    cv = Canvas()
    ps = pose(t)
    draw_sky(cv, rng, t)
    draw_moon(cv, rng)
    draw_bg_hill(cv, rng)
    draw_ground(cv, rng, t)
    draw_tree(cv, rng, t)
    draw_boulder(cv, rng, t)
    draw_skeleton(cv, rng, ps, t)
    draw_smoke(cv, rng, t)
    return cv.img.resize((W, H), Image.LANCZOS)


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "video/skeleton_boulder.mp4"
    if out.endswith(".png"):
        render_frame(int(FPS * 1.6)).save(out)
        return
    ff = subprocess.Popen(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
         "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-pix_fmt", "yuv420p",
         "-movflags", "+faststart", out],
        stdin=subprocess.PIPE)
    for i in range(NFRAMES):
        ff.stdin.write(render_frame(i).tobytes())
        if i % 24 == 0:
            print(f"frame {i}/{NFRAMES}", flush=True)
    ff.stdin.close()
    ff.wait()
    print("wrote", out)


if __name__ == "__main__":
    main()
