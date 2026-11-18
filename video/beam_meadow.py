"""
"Flashlight on the hill": pointillist confetti-beam animation.

The smoking skeleton sits on a boulder on a flowery hill at night next to a little
tent and points a flashlight at the sky. The beam is a cone of colourful paint dabs.
Technique (same family as the lighthouse reference, original scene):
  - flat, perfectly static night sky + static far mountains (contrast)
  - everything else is made of dabs / dots / grass blades that are re-randomised
    EVERY frame (16 fps) -> the whole picture boils
  - stone, tent: white/grey stipple dots shaded by light direction
  - meadow: thousands of short vertical blades + round flower dots
  - beam: capsule-shaped dabs oriented along the beam, growing with distance,
    gently wobbling with the hand

8 s, 1280x720, 16 fps, seamless loop.
Usage:  python3 video/beam_meadow.py [out.mp4 | frame.png N]
"""
import math
import os
import random
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import skeleton_boulder as sb  # noqa: E402  (skull + cigarette drawing)

W, H = 1280, 720
SS = sb.SS
FPS = 16
DUR = 8.0
NFRAMES = int(FPS * DUR)

SKY = (2, 12, 45)
MOUNTAIN = (0, 5, 20)
BONE = (238, 238, 245)
BLACK = (0, 0, 0)

BEAM_COLS = [((40, 110, 235), 22), ((25, 75, 205), 18), ((70, 150, 245), 8),
             ((235, 75, 145), 13), ((245, 190, 40), 13), ((242, 120, 40), 7),
             ((210, 40, 60), 5), ((95, 110, 150), 8), ((22, 40, 95), 6)]
GRASS_COLS = [((205, 160, 40), 34), ((40, 95, 205), 22), ((110, 115, 135), 14),
              ((28, 38, 75), 11), ((70, 140, 230), 7), ((225, 110, 40), 4),
              ((210, 50, 70), 3), ((225, 90, 160), 3), ((160, 150, 120), 2)]
FLOWER_COLS = [((245, 245, 250), 50), ((245, 195, 40), 30), ((235, 90, 160), 20)]


def wchoice(rng, table):
    tot = sum(w for _, w in table)
    r = rng.uniform(0, tot)
    for c, w in table:
        r -= w
        if r <= 0:
            return c
    return table[-1][0]


def jit(c, rng, a=14):
    return tuple(max(0, min(255, int(v + rng.uniform(-a, a)))) for v in c)


def mix(a, b, k):
    return tuple(int(a[i] + (b[i] - a[i]) * k) for i in range(3))


# ---------------------------------------------------------------- geometry
CREST_X, CREST_Y = 430, 432


def hill_y(x):
    if x >= CREST_X:
        return CREST_Y + ((x - CREST_X) / 560) ** 2 * 200
    return CREST_Y + ((CREST_X - x) / 430) ** 2 * 85 + 6 * math.sin(x * 0.02)


BOULDER_C, BOULDER_RX, BOULDER_RY = (452, 410), 72, 42
TENT = [(130, 482), (215, 372), (300, 478)]
TENT_DOOR = [(196, 480), (215, 420), (236, 480)]


def mountains_y(x):
    return 548 - 40 * math.exp(-((x - 980) / 120) ** 2) - 25 * math.exp(-((x - 1180) / 90) ** 2) \
        - 18 * math.exp(-((x - 820) / 70) ** 2)


# ---------------------------------------------------------------- canvas
class Canvas(sb.Canvas):
    def __init__(self, base=None):
        self.img = base.copy() if base is not None else Image.new("RGB", (W * SS, H * SS), SKY)
        self.d = ImageDraw.Draw(self.img)

    def capsule(self, x, y, ang, ln, wd, col):
        dx, dy = math.cos(ang) * ln / 2, math.sin(ang) * ln / 2
        w = max(1, int(wd * SS))
        self.d.line(((x - dx) * SS, (y - dy) * SS, (x + dx) * SS, (y + dy) * SS), fill=col, width=w)
        r = wd / 2
        for px, py in ((x - dx, y - dy), (x + dx, y + dy)):
            self.d.ellipse(((px - r) * SS, (py - r) * SS, (px + r) * SS, (py + r) * SS), fill=col)


def static_background():
    cv = Canvas()
    rng = random.Random(1)
    for _ in range(70):                                   # a few still stars
        x, y = rng.uniform(0, W), rng.uniform(0, 380)
        cv.dot((x, y), rng.uniform(0.6, 1.4), (150, 160, 200))
    pts = [(x, mountains_y(x)) for x in range(560, W + 10, 10)] + [(W, H), (560, H)]
    cv.poly(pts, MOUNTAIN)
    return cv.img


def mask_of(poly_fn):
    m = Image.new("L", (W, H), 0)
    poly_fn(ImageDraw.Draw(m))
    return np.asarray(m) > 0


BOULDER_MASK = mask_of(lambda d: d.ellipse((BOULDER_C[0] - BOULDER_RX, BOULDER_C[1] - BOULDER_RY,
                                            BOULDER_C[0] + BOULDER_RX, BOULDER_C[1] + BOULDER_RY), fill=1))
TENT_MASK = mask_of(lambda d: d.polygon(TENT, fill=1))
DOOR_MASK = mask_of(lambda d: d.polygon(TENT_DOOR, fill=1))
_ys, _xs = np.mgrid[0:H, 0:W]
HILL_MASK = _ys >= np.array([hill_y(x) for x in range(W)])[None, :]


# ---------------------------------------------------------------- beam / pose timing
def beam_angle(t):
    w = 2 * math.pi / DUR
    return math.radians(-24) + math.radians(1.6) * math.sin(w * t) + math.radians(0.6) * math.sin(3 * w * t + 1)


TORSO = 62
THIGH, SHIN = 48, 46
UPPER, FORE = 37, 35
HIP = (456, 372)


def pose(t):
    w = 2 * math.pi / DUR
    breathe = math.sin(2 * w * t)
    lean = math.radians(-12) + math.radians(1.2) * breathe
    tdir = (math.sin(lean), -math.cos(lean))
    sh = sb.add(HIP, tdir, TORSO)
    ba = beam_angle(t)
    bdir = (math.cos(ba), math.sin(ba))
    hand_t = sb.add(sb.add(sh, bdir, 60), (0, 8))
    el_n, hand_n = sb.ik(sh, hand_t, UPPER, FORE, +1)
    s_f = sb.add(sh, (-5, -3))
    el_f, hand_f = sb.ik(s_f, sb.add(hand_t, (-6, 4)), UPPER, FORE, +1)
    knee_n = sb.add(HIP, (46, -5))
    knee_f = sb.add(HIP, (42, -10))
    swing = 4 * math.sin(4 * w * t)
    ankle_n = (knee_n[0] + 10 + swing, knee_n[1] + SHIN)
    ankle_f = (knee_f[0] + 4 - swing, knee_f[1] + SHIN - 2)
    lens = sb.add(hand_n, bdir, 24)
    neck = sb.add(sh, tdir, 7)
    return dict(hip=HIP, shoulder=sh, tdir=tdir, el_n=el_n, hand_n=hand_n, s_f=s_f, el_f=el_f,
                hand_f=hand_f, knee_n=knee_n, knee_f=knee_f, ankle_n=ankle_n, ankle_f=ankle_f,
                lens=lens, bdir=bdir, ba=ba, neck_end=neck, head_tilt=ba * 0.75 - 0.05)


# ---------------------------------------------------------------- layers (redrawn every frame)
def draw_meadow(cv, rng):
    # grass blades: sample points below the hill line, denser near the top edge
    n = 0
    while n < 11000:
        x = rng.uniform(-5, W + 5)
        top = hill_y(x)
        if top > H:
            continue
        y = top - 4 + (rng.random() ** 1.15) * (H - top + 10)
        persp = min(1.0, (y - 400) / 320)
        ln = 7 + 14 * persp * rng.uniform(0.6, 1.3)
        ang = -math.pi / 2 + rng.uniform(-0.22, 0.22)
        zone = math.sin(x * 0.011 + 1.3) * math.sin(y * 0.023 + x * 0.004) + 0.4 * math.sin(x * 0.03 - y * 0.01)
        if y - top < 22:                                 # darker grey-blue crest silhouette
            c = wchoice(rng, [((90, 98, 125), 4), ((40, 55, 100), 3), ((160, 140, 80), 2), ((50, 90, 190), 2)])
        elif zone > 0.45 and rng.random() < 0.55:
            c = wchoice(rng, [((40, 95, 205), 5), ((70, 140, 230), 3), ((28, 38, 75), 2)])
        elif zone < -0.45 and rng.random() < 0.55:
            c = wchoice(rng, [((210, 165, 40), 6), ((225, 110, 40), 1), ((210, 50, 70), 1)])
        else:
            c = wchoice(rng, GRASS_COLS)
        cv.dash(x, y, ang, ln, jit(c, rng), 1.4 + 1.8 * persp)
        n += 1
    for _ in range(330):
        x = rng.uniform(0, W)
        top = hill_y(x)
        if top > H - 5:
            continue
        y = top + 6 + rng.random() ** 0.8 * (H - top)
        persp = min(1.0, (y - 400) / 320)
        cv.dot((x, y), 1.8 + 3.8 * persp * rng.uniform(0.7, 1.2), wchoice(rng, FLOWER_COLS))


def stipple(cv, rng, mask, n, light_fn, rmin=1.6, rmax=3.0):
    ys, xs = np.nonzero(mask)
    if len(xs) == 0:
        return
    idx = np.array([rng.randrange(len(xs)) for _ in range(n)])
    for i in idx:
        x, y = xs[i] + rng.random(), ys[i] + rng.random()
        k = light_fn(x, y)
        if rng.random() < 0.08:
            c = (20, 30, 70)                              # a few dark gaps
        else:
            c = jit(mix((60, 70, 115), (232, 234, 250), k), rng, 12)
        cv.dot((x, y), rng.uniform(rmin, rmax), c)


def draw_boulder(cv, rng, ps):
    bx, by = BOULDER_C
    lx, ly = ps["lens"]

    def light(x, y):
        # lit from the right/top (flashlight spill), dark underside
        k = 0.45 + 0.45 * (x - bx) / BOULDER_RX - 0.35 * (y - by) / BOULDER_RY
        return max(0.0, min(1.0, k))
    stipple(cv, rng, BOULDER_MASK, 1700, light)


def draw_tent(cv, rng):
    def light(x, y):
        return max(0.0, min(1.0, 0.25 + (x - 215) / 120))
    stipple(cv, rng, TENT_MASK & ~DOOR_MASK, 1300, light, 1.5, 2.8)
    # glowing doorway (warm lantern inside)
    ys, xs = np.nonzero(DOOR_MASK)
    for _ in range(260):
        i = rng.randrange(len(xs))
        c = wchoice(rng, [((245, 170, 40), 5), ((240, 110, 40), 3), ((250, 220, 120), 2)])
        cv.dot((xs[i] + rng.random(), ys[i] + rng.random()), rng.uniform(1.4, 2.6), jit(c, rng, 10))
    # guy rope
    cv.line([(300, 478), (330, 486)], (150, 150, 170), 1.2)


def draw_beam(cv, rng, ps):
    ax, ay = ps["lens"]
    ba = ps["ba"]
    L = 1250
    half = math.radians(14)
    for _ in range(4600):
        d = 10 + L * rng.random() ** 0.72
        spread = math.tan(half) * d + 4
        s = (rng.random() * 2 - 1)
        if abs(s) > 0.8 and rng.random() < 0.55:          # ragged edges
            continue
        s *= spread * (1 + 0.12 * rng.uniform(-1, 1))
        x = ax + math.cos(ba) * d - math.sin(ba) * s
        y = ay + math.sin(ba) * d + math.cos(ba) * s
        if x > W + 30 or y < -30:
            continue
        ln = 4 + d * 0.022 * rng.uniform(0.7, 1.4)
        wd = 2.0 + d * 0.0095 * rng.uniform(0.7, 1.3)
        a = ba + s / max(d, 1) * 0.9 + rng.uniform(-0.15, 0.15)
        cv.capsule(x, y, a, ln, wd, jit(wchoice(rng, BEAM_COLS), rng, 10))
    # hot core near the lens
    for _ in range(90):
        d = rng.uniform(4, 60)
        s = rng.uniform(-1, 1) * (math.tan(half) * d + 2)
        x = ax + math.cos(ba) * d - math.sin(ba) * s
        y = ay + math.sin(ba) * d + math.cos(ba) * s
        cv.dot((x, y), rng.uniform(1.2, 2.4), (250, 245, 220))


def draw_skeleton(cv, rng, ps, t):
    j = lambda p, a=0.6: (p[0] + rng.uniform(-a, a), p[1] + rng.uniform(-a, a))
    hip, sh, tdir = ps["hip"], ps["shoulder"], ps["tdir"]
    nrm = (-tdir[1], tdir[0])
    far = (175, 178, 195)

    cv.bone(j(hip), j(ps["knee_f"]), 3.5, far, 2.5)
    cv.bone(j(ps["knee_f"]), j(ps["ankle_f"]), 3, far, 2.5)
    cv.bone(j(ps["s_f"]), j(ps["el_f"]), 3, far, 2.5)
    cv.bone(j(ps["el_f"]), j(ps["hand_f"]), 2.6, far, 2.5)

    # pelvis + spine + ribs
    R = math.atan2(tdir[1], tdir[0]) + math.pi / 2
    pel = [(-10, -4), (-3, -16), (10, -14), (14, -3), (7, 8), (-4, 10), (-11, 4)]
    cv.poly([sb.add(hip, sb.rot(p, R)) for p in pel], BONE, outline=BLACK, w=2)
    for i in range(11):
        u = i / 10
        p = sb.add(sb.add(hip, tdir, TORSO * u), nrm, math.sin(u * math.pi) * -4)
        cv.dot(j(p, 0.3), 3.4, BLACK)
        cv.dot(j(p, 0.3), 2.3, BONE)
    for i in range(6):
        u = 0.9 - i * 0.075
        a = sb.add(sb.add(hip, tdir, TORSO * u), nrm, math.sin(u * math.pi) * -4)
        b = sb.add(sb.add(hip, tdir, TORSO * (u - 0.13)), nrm, 20 * (0.65 if i >= 5 else 1))
        c = sb.add(sb.add(a, nrm, 19), tdir, 3)
        pts = []
        for k in range(8):
            s_ = k / 7
            pts.append(j(((1 - s_) ** 2 * a[0] + 2 * (1 - s_) * s_ * c[0] + s_ * s_ * b[0],
                          (1 - s_) ** 2 * a[1] + 2 * (1 - s_) * s_ * c[1] + s_ * s_ * b[1]), 0.3))
        cv.line(pts, BLACK, 4)
        cv.line(pts, BONE, 1.8)
    cv.bone(sh, ps["neck_end"], 3, BONE, 2.5)

    # near leg
    cv.bone(j(hip), j(ps["knee_n"]), 4, BONE, 2.5)
    cv.bone(j(ps["knee_n"]), j(ps["ankle_n"]), 3.4, BONE, 2.5)
    a = ps["ankle_n"]
    cv.bone(a, (a[0] + 13, a[1] + 2), 3, BONE, 2.5)

    # flashlight (drawn before the near arm so the hand wraps it)
    hand = ps["hand_n"]
    lens = ps["lens"]
    back = sb.add(hand, ps["bdir"], -6)
    cv.line([back, lens], BLACK, 9)
    cv.line([back, lens], (70, 78, 95), 6)
    cv.line([sb.add(lens, ps["bdir"], -5), lens], (160, 165, 180), 8)
    cv.dot(lens, 3.2, (255, 248, 210))

    # near arm
    cv.bone(j(sh), j(ps["el_n"]), 3.6, BONE, 2.5)
    cv.bone(j(ps["el_n"]), j(hand), 3, BONE, 2.5)
    cv.dot(hand, 3.4, BONE)

    # skull (+ cigarette) from the boulder script, at a smaller scale
    sb.draw_skull(cv, rng, ps, t)


SMOKE_DT, SMOKE_LIFE = 1 / 40, 1.7


def draw_smoke(cv, rng, t):
    k0 = int(math.floor(t / SMOKE_DT))
    prev = None
    for step in range(int(SMOKE_LIFE / SMOKE_DT)):
        bt = (k0 - step) * SMOKE_DT
        age = t - bt
        tip = sb.mouth_and_tip(pose(bt % DUR))[1]
        wob = 9 * min(1.0, age * 1.5) * math.sin(2 * math.pi * 0.9 * age + bt * 3.1)
        wob += 4 * min(1.0, age) * math.sin(2 * math.pi * 2.1 * age + bt * 6.0)
        x = tip[0] - 6 * age + wob
        y = tip[1] - 30 * age
        fade = (1 - age / SMOKE_LIFE) ** 1.2
        if prev is not None and rng.random() > (age / SMOKE_LIFE) ** 2 * 0.8:
            cv.line([prev, (x, y)], mix((20, 30, 70), (215, 215, 230), fade), 0.8 + 1.4 * fade)
        prev = (x, y)


# ---------------------------------------------------------------- render
BASE = None


def render_frame(i):
    global BASE
    if BASE is None:
        BASE = static_background()
    t = i / FPS
    rng = random.Random(7000 + i)          # new dabs EVERY frame
    sb.SKULL = 15.5
    cv = Canvas(BASE)
    ps = pose(t)
    draw_beam(cv, rng, ps)
    draw_meadow(cv, rng)
    draw_tent(cv, rng)
    draw_boulder(cv, rng, ps)
    draw_skeleton(cv, rng, ps, t)
    draw_smoke(cv, rng, t)
    return cv.img.resize((W, H), Image.LANCZOS)


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "video/beam_meadow.mp4"
    if out.endswith(".png"):
        render_frame(int(sys.argv[2]) if len(sys.argv) > 2 else 10).save(out)
        return
    ff = subprocess.Popen(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
         "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
         "-movflags", "+faststart", out], stdin=subprocess.PIPE)
    for i in range(NFRAMES):
        ff.stdin.write(render_frame(i).tobytes())
        if i % 16 == 0:
            print(f"frame {i}/{NFRAMES}", flush=True)
    ff.stdin.close()
    ff.wait()
    print("wrote", out)


if __name__ == "__main__":
    main()
