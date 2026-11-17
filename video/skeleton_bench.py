"""
Procedural "line-boil" animation: the smoking skeleton sits on a park bench in a
thunderstorm, watching a little paper boat drift across a rain puddle.

8 s, 1080x1080, 24 fps, seamless loop, with synthesized rain + thunder audio.

Usage:  python3 video/skeleton_bench.py [out.mp4 | frame.png]
Needs:  numpy, Pillow, ffmpeg. Reuses the skull/cigarette/drawing helpers from
        skeleton_boulder.py (same folder).
"""
import math
import os
import random
import subprocess
import sys
import tempfile
import wave

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import skeleton_boulder as sb  # noqa: E402
from skeleton_boulder import (Canvas, mix, add, rot, norm, sub, ik,  # noqa: E402
                              PINK, PINK_DIM, PINK_HOT, BLUE, BLUE_LT, GREEN, GREEN_DK,
                              BONE, BONE_FAR, BLACK)

W = H = sb.W
SS = sb.SS
FPS = 24
DUR = 8.0
NFRAMES = int(FPS * DUR)
BOIL_EVERY = 2

LAMP = (205, 255, 170)          # pale green street-lamp light
LAMP_DIM = (90, 140, 80)
CLOUD = (70, 55, 150)
CLOUD_DK = (40, 30, 95)
BOLT = (235, 240, 255)
BOLT_GLOW = (150, 120, 255)

HORIZON = 600
GROUND_Y = 832                   # ground line under the bench


def ground_top(x):
    return HORIZON + 4 * math.sin(x * 0.01)


# ---------------------------------------------------------------- storm timing
STRIKES = [dict(t=1.9, x=820, seed=4), dict(t=5.5, x=560, seed=9)]
FLICKER = [1.0, 0.25, 0.85, 0.4, 0.15]          # per-frame flash pattern


def flash(t):
    f = 0.0
    for s in STRIKES:
        dt = (t - s["t"]) % DUR
        idx = int(dt * FPS)
        if idx < len(FLICKER):
            f = max(f, FLICKER[idx])
        elif dt < 1.2:
            f = max(f, 0.15 * math.exp(-(dt - len(FLICKER) / FPS) * 4))
    return f


def active_strike(t):
    for s in STRIKES:
        dt = (t - s["t"]) % DUR
        if int(dt * FPS) < 4:
            return s
    return None


def make_bolt(x0, seed):
    rng = random.Random(seed)
    segs = []

    def branch(p, ang, ln, w, depth):
        pts = [p]
        for _ in range(int(ln / 18)):
            ang += rng.uniform(-0.45, 0.45)
            ang = max(math.radians(45), min(math.radians(135), ang))
            p = (p[0] + math.cos(ang) * 18, p[1] + math.sin(ang) * 18)
            pts.append(p)
            if depth > 0 and rng.random() < 0.10:
                branch(p, ang + rng.choice([-1, 1]) * rng.uniform(0.4, 0.8), ln * 0.35, w * 0.5, depth - 1)
            if p[1] > HORIZON - 5:
                break
        segs.append((pts, w))

    branch((x0, 120), math.radians(95), 560, 5.0, 2)
    return segs


BOLTS = {s["seed"]: make_bolt(s["x"], s["seed"]) for s in STRIKES}

# ---------------------------------------------------------------- scene geometry
SEAT_Y = 712
BENCH_X0, BENCH_X1 = 110, 470
BACK_OFF = (-26, -26)                       # depth offset for the back edge
LAMP_POST_X = 70
LAMP_HEAD = (205, 330)

PUDDLE_C = (770, 905)
PUDDLE_RX, PUDDLE_RY = 270, 78


def in_puddle(x, y, shrink=0.0):
    dx = (x - PUDDLE_C[0]) / (PUDDLE_RX - shrink)
    dy = (y - PUDDLE_C[1]) / (PUDDLE_RY - shrink * 0.3)
    wob = 1 + 0.06 * math.sin(math.atan2(dy, dx) * 5 + 1.0)
    return dx * dx + dy * dy < wob * wob


def in_lamp_cone(x, y):
    if y < LAMP_HEAD[1] + 10 or y > GROUND_Y + 40:
        return 0.0
    u = (y - LAMP_HEAD[1]) / (GROUND_Y + 40 - LAMP_HEAD[1])
    half = 18 + u * 230
    d = abs(x - LAMP_HEAD[0]) / half
    if d > 1:
        return 0.0
    return (1 - d) ** 0.7 * (1 - 0.3 * u)


# ---------------------------------------------------------------- paper boat
def boat_state(t):
    w = 2 * math.pi / DUR
    x = PUDDLE_C[0] + 85 * math.sin(w * t) + 15 * math.sin(2 * w * t + 0.7)
    y = PUDDLE_C[1] - 8 + 9 * math.sin(w * t + 1.2)
    bob = 2.5 * math.sin(7 * w * t)
    rock = 0.10 * math.sin(5 * w * t) + 0.04 * math.sin(11 * w * t)
    return (x, y + bob), rock


def boat_shape(scale=1.0):
    s = 44 * scale
    hull = [(-1.25, -0.05), (1.25, -0.05), (0.82, 0.55), (-0.82, 0.55)]
    sail = [(-0.75, -0.05), (0.0, -1.15), (0.75, -0.05)]
    return s, hull, sail


# ---------------------------------------------------------------- skeleton pose (seated)
TORSO = 150
UPPER_ARM, FOREARM = 100, 92
HIP0 = (292, SEAT_Y - 14)
LEAN0 = math.radians(33)


def pose(t):
    w = 2 * math.pi / DUR
    breathe = math.sin(3 * w * t)
    lean = LEAN0 + math.radians(1.6) * breathe
    tdir = (math.sin(lean), -math.cos(lean))
    hip = HIP0
    shoulder = add(hip, tdir, TORSO)

    knee_n = add(hip, (118, -4))
    knee_f = add(hip, (112, -12))
    ankle_n = (knee_n[0] + 18, GROUND_Y - 10)
    # far foot taps
    tap = max(0.0, math.sin(6 * w * t)) ** 3
    ankle_f = (knee_f[0] + 6, GROUND_Y - 16 - 6 * tap)

    # forearms resting on the thighs, hands hanging over the knees
    hand_n = add(knee_n, (22, 14 + 2 * breathe))
    hand_f = add(knee_f, (16, 6 + 2 * breathe))
    s_f = add(shoulder, (-7, -4))
    elbow_n, hand_n = ik(shoulder, hand_n, UPPER_ARM, FOREARM, +1)
    elbow_f, hand_f = ik(s_f, hand_f, UPPER_ARM, FOREARM, +1)

    # head looks down at the boat, following it a little
    (bx, by), _ = boat_state(t)
    neck_end = add(shoulder, tdir, 16)
    look = math.atan2(by - neck_end[1], bx - neck_end[0])
    head_tilt = 0.85 * look + 0.04 * breathe - 0.08
    return dict(hip=hip, shoulder=shoulder, tdir=tdir, knee_n=knee_n, knee_f=knee_f,
                ankle_n=ankle_n, ankle_f=ankle_f, s_f=s_f, elbow_n=elbow_n, hand_n=hand_n,
                elbow_f=elbow_f, hand_f=hand_f, neck_end=neck_end, head_tilt=head_tilt, tap=tap)


# ---------------------------------------------------------------- smoke
WIND = (-55.0, 0.0)
RIBBON_DT = 1 / 60
RIBBON_LIFE = 2.6
RIBBONS = [dict(phase=0.0, amp=14, vx=0, vy=-50), dict(phase=2.1, amp=9, vx=-8, vy=-60)]
_tip_cache = {}


def tip_at(bt):
    key = round(bt * 240)
    if key not in _tip_cache:
        _tip_cache[key] = sb.mouth_and_tip(pose(bt))
    return _tip_cache[key]


def make_puffs():
    rng = random.Random(7)
    parts = []
    for d in sb.DRAGS:
        for _ in range(70):
            b = d + sb.DRAG_LEN + sb.EXHALE_DELAY + rng.uniform(0, 0.8)
            ang = math.radians(rng.uniform(-35, 15))
            sp = rng.uniform(100, 210)
            parts.append(dict(b=b % DUR, life=rng.uniform(1.6, 3.0), vx=math.cos(ang) * sp,
                              vy=math.sin(ang) * sp, wob=rng.uniform(6, 16),
                              wf=rng.uniform(0.8, 2.0), ph=rng.uniform(0, 6.28)))
    return parts


PUFFS = make_puffs()


# ---------------------------------------------------------------- persistent particles
def make_rain():
    rng = random.Random(5)
    return [(rng.uniform(0, W + 400), rng.uniform(0, H), rng.uniform(0.75, 1.3), rng.random())
            for _ in range(1500)]


RAIN = make_rain()
RAIN_DIR = norm((-0.38, 1.0))
RAIN_ANG = math.atan2(RAIN_DIR[1], RAIN_DIR[0])
RAIN_SPEED = 1100.0


def make_ripples():
    rng = random.Random(21)
    out = []
    while len(out) < 140:
        x = PUDDLE_C[0] + rng.uniform(-1, 1) * PUDDLE_RX
        y = PUDDLE_C[1] + rng.uniform(-1, 1) * PUDDLE_RY
        if in_puddle(x, y, 25):
            out.append((x, y, rng.uniform(0, DUR), rng.uniform(0.5, 0.9), rng.uniform(14, 30)))
    return out


RIPPLES = make_ripples()


def make_tree():
    rng = random.Random(13)
    segs = []

    def grow(p, ang, ln, w, depth):
        if depth == 0:
            return
        end = (p[0] + math.cos(ang) * ln, p[1] + math.sin(ang) * ln)
        segs.append((p, end, w, depth))
        for i in range(2 if rng.random() < 0.8 else 3):
            grow(end, ang + rng.uniform(0.25, 0.6) * (1 if i % 2 == 0 else -1),
                 ln * rng.uniform(0.66, 0.8), w * 0.68, depth - 1)

    grow((965, HORIZON + 6), -math.pi / 2 + 0.08, 70, 6, 7)
    return segs


TREE = make_tree()


# ---------------------------------------------------------------- layers
def draw_background(cv, F):
    if F > 0:
        cv.d.rectangle((0, 0, W * SS, H * SS), fill=mix(BLACK, (55, 35, 95), F * 0.85))


def draw_clouds(cv, rng, t, F):
    drift = t * 14
    for _ in range(1500):
        x = rng.uniform(-20, W + 20)
        y = rng.uniform(0, 330) ** 1.0
        band = 0.5 + 0.5 * math.sin((x + drift) * 0.012) * math.sin((x - drift * 0.6) * 0.005 + 1.0)
        top = 120 + 110 * band
        if y > top + rng.uniform(-30, 30):
            continue
        # cloud strokes curl along lumpy shapes
        ang = math.pi + 0.5 * math.sin((x + drift) * 0.03 + y * 0.04)
        dens = 1 - y / (top + 30)
        c = mix(CLOUD_DK if rng.random() < 0.55 else CLOUD, (215, 200, 255), F * (0.4 + 0.6 * dens))
        cv.dash(x, y, ang, rng.uniform(10, 26), c, rng.uniform(2.0, 3.6))


def draw_bolt(cv, rng, t):
    s = active_strike(t)
    if not s:
        return
    for pts, w in BOLTS[s["seed"]]:
        jp = [(x + rng.uniform(-2, 2), y + rng.uniform(-2, 2)) for x, y in pts]
        cv.line(jp, BOLT_GLOW, w * 3.2)
        cv.line(jp, BOLT, w)


def draw_sky_rain(cv, rng, t, F):
    for _ in range(1900):
        x, y = rng.uniform(-10, W + 10), rng.uniform(-10, HORIZON + 8)
        if y > ground_top(x):
            continue
        lit = in_lamp_cone(x, y)
        c = PINK if rng.random() < 0.7 else PINK_DIM
        if lit > 0.15 and rng.random() < lit:
            c = LAMP if rng.random() < 0.5 else LAMP_DIM
        c = mix(c, (255, 220, 255), F * 0.6)
        cv.dash(x, y, RAIN_ANG + rng.uniform(-0.15, 0.15), rng.uniform(8, 16), c, rng.uniform(1.6, 2.6))


def draw_lamp_glow(cv, rng, t):
    flick = 1.0 if (int(t * FPS) % 37) not in (3, 4) else 0.35
    for _ in range(int(700 * flick)):
        x = rng.uniform(LAMP_HEAD[0] - 260, LAMP_HEAD[0] + 260)
        y = rng.uniform(LAMP_HEAD[1] + 10, GROUND_Y + 30)
        lit = in_lamp_cone(x, y)
        if rng.random() > lit:
            continue
        c = LAMP if rng.random() < lit else LAMP_DIM
        cv.dash(x, y, RAIN_ANG + rng.uniform(-0.12, 0.12), rng.uniform(8, 16), c, rng.uniform(1.4, 2.4))
    # pool of light on the wet ground
    for _ in range(int(520 * flick)):
        a = rng.uniform(0, 2 * math.pi)
        r = math.sqrt(rng.random())
        x = LAMP_HEAD[0] + 30 + 250 * r * math.cos(a)
        y = GROUND_Y + 25 + 55 * r * math.sin(a)
        c = LAMP if rng.random() > r else LAMP_DIM
        cv.dash(x, y, rng.uniform(-0.12, 0.12), rng.uniform(10, 26), c, rng.uniform(1.6, 2.8))


def draw_far(cv, rng, t, F):
    # distant hill line
    for _ in range(320):
        x = rng.uniform(0, W)
        y = ground_top(x) + rng.uniform(-3, 6)
        cv.dash(x, y, rng.uniform(-0.12, 0.12), rng.uniform(12, 28),
                BLUE if rng.random() < 0.6 else BLUE_LT, rng.uniform(2.4, 3.8))
    # bare tree on the horizon
    for (a, b, w, depth) in TREE:
        k = (7 - depth) / 7
        sway = 4 * k * k * math.sin(t * 2 * math.pi / DUR * 3)
        a2 = (a[0] + sway * 0.7, a[1])
        b2 = (b[0] + sway + rng.uniform(-1, 1) * k, b[1] + rng.uniform(-1, 1) * k)
        c = mix(BLUE if rng.random() < 0.6 else PINK, (240, 230, 255), F * 0.7)
        cv.line([a2, b2], c, max(1.2, w * rng.uniform(0.4, 0.65)))


def draw_ground(cv, rng, t, F):
    for _ in range(5200):
        x = rng.uniform(-10, W + 10)
        top = ground_top(x)
        y = top + (rng.random() ** 1.3) * (H - top + 20)
        if in_puddle(x, y):
            continue
        persp = (y - HORIZON) / (H - HORIZON)          # strokes get longer toward us
        lit = in_lamp_cone(x, y)
        r = rng.random()
        if lit > 0.2 and r < lit * 0.8:
            c = LAMP if rng.random() < 0.35 else LAMP_DIM
        else:
            c = PINK if r < 0.72 else (BLUE if r < 0.9 else PINK_DIM)
        c = mix(c, (255, 230, 255), F * 0.45)
        cv.dash(x, y, rng.uniform(-0.18, 0.18), (6 + 20 * persp) * rng.uniform(0.6, 1.2),
                c, 1.5 + 2.2 * persp)
    # puddle rim
    for _ in range(320):
        a = rng.uniform(0, 2 * math.pi)
        wob = 1 + 0.06 * math.sin(a * 5 + 1.0)
        x = PUDDLE_C[0] + PUDDLE_RX * wob * math.cos(a)
        y = PUDDLE_C[1] + PUDDLE_RY * wob * math.sin(a)
        cv.dash(x, y, a + math.pi / 2 + rng.uniform(-0.2, 0.2), rng.uniform(8, 18),
                BLUE_LT if rng.random() < 0.6 else BLUE, rng.uniform(2.5, 4))
    # splashes on the ground
    for _ in range(70):
        x = rng.uniform(0, W)
        y = rng.uniform(HORIZON + 30, H)
        if in_puddle(x, y):
            continue
        s = 3 + 6 * (y - HORIZON) / (H - HORIZON)
        c = mix(PINK_HOT, (255, 255, 255), F * 0.5)
        cv.line([(x - s, y - s * 1.3), (x, y)], c, 1.6)
        cv.line([(x + s, y - s * 1.3), (x, y)], c, 1.6)


def draw_puddle(cv, rng, t, F):
    # dark water with horizontal reflection strokes: reflected sky, lamp glow, lightning
    for _ in range(1300):
        x = PUDDLE_C[0] + rng.uniform(-1, 1) * PUDDLE_RX
        y = PUDDLE_C[1] + rng.uniform(-1, 1) * PUDDLE_RY
        if not in_puddle(x, y, 6):
            continue
        r = rng.random()
        c = BLUE if r < 0.45 else (PINK_DIM if r < 0.8 else PINK)
        c = mix(c, (230, 220, 255), F * 0.8)
        ln = rng.uniform(10, 30) * (1 + 0.5 * math.sin(t * 3 + y * 0.2))
        cv.dash(x, y, rng.uniform(-0.05, 0.05), ln, c, rng.uniform(1.4, 2.6))
    # reflected bolt
    s = active_strike(t)
    if s and abs(s["x"] - PUDDLE_C[0]) < PUDDLE_RX - 20:
        x = s["x"]
        pts = []
        for i in range(10):
            yy = PUDDLE_C[1] - PUDDLE_RY * 0.8 + i * PUDDLE_RY * 0.16
            pts.append((x + rng.uniform(-10, 10), yy))
        cv.line(pts, BOLT_GLOW, 6)
        cv.line(pts, BOLT, 2)
    # rain ripples
    for x, y, b, life, rmax in RIPPLES:
        age = (t - b) % DUR
        if age > life:
            continue
        u = age / life
        rx = 3 + rmax * u
        c = mix(BLACK, mix(BLUE_LT, (255, 255, 255), F), (1 - u) ** 0.8)
        pts = [(x + rx * math.cos(a), y + rx * 0.32 * math.sin(a)) for a in np.linspace(0, 2 * math.pi, 18)]
        cv.line(pts, c, 1.8)
        if u < 0.35:
            cv.line([(x, y), (x, y - 10 * (1 - u / 0.35))], c, 1.6)


def boat_points(t, reflect=False):
    (bx, by), rock = boat_state(t)
    s, hull, sail = boat_shape()

    def tf(px, py):
        if reflect:
            py = 1.1 - py
        x, y = rot((px * s, py * s), rock if not reflect else -rock)
        return (bx + x, by + y)
    return [tf(*p) for p in hull], [tf(*p) for p in sail], tf


def draw_boat(cv, rng, t, F):
    # reflection (dim, wobbly)
    hull, sail, tf = boat_points(t, reflect=True)
    for poly in (hull, sail):
        pts = [(x + rng.uniform(-3, 3), y) for x, y in poly]
        cv.line(pts + [pts[0]], mix((80, 70, 100), (200, 200, 230), F), 2)
    for k in range(6):
        y = tf(0, 0.9 + k * 0.2)[1]
        x = tf(rng.uniform(-0.8, 0.8), 0)[0]
        cv.dash(x, y, 0, rng.uniform(12, 26), (110, 100, 130), 2)

    hull, sail, tf = boat_points(t)
    paper = mix((228, 226, 215), (255, 255, 255), F)
    shade = mix((180, 176, 170), (230, 230, 240), F)
    cv.line(hull + [hull[0]], BLACK, 7)
    cv.line(sail + [sail[0]], BLACK, 7)
    cv.poly(sail, shade)
    cv.poly([sail[0], sail[1], tf(0.0, -0.05)], paper)
    cv.poly(hull, paper)
    # fold lines
    cv.line([tf(-0.82, 0.55), tf(-0.5, -0.05)], BLACK, 1.4)
    cv.line([tf(0.82, 0.55), tf(0.5, -0.05)], BLACK, 1.4)
    cv.line([tf(0.0, -1.15), tf(0.0, -0.05)], BLACK, 1.4)
    cv.line(hull + [hull[0]], BLACK, 1.8)
    cv.line(sail + [sail[0]], BLACK, 1.8)
    # wet water line
    cv.line([tf(-0.9, 0.5), tf(0.9, 0.5)], BLUE_LT, 2)


def plank(cv, rng, a, b, thick, F, col_a=BLUE_LT, col_b=BLUE):
    """A wooden slat built from several jittery strokes."""
    n = 4
    for i in range(n):
        off = (i / (n - 1) - 0.5) * thick
        c = col_a if rng.random() < 0.5 else col_b
        if rng.random() < 0.15:
            c = PINK
        c = mix(c, (240, 235, 255), F * 0.5)
        cv.line([(a[0] + rng.uniform(-2, 2), a[1] + off + rng.uniform(-0.8, 0.8)),
                 (b[0] + rng.uniform(-2, 2), b[1] + off + rng.uniform(-0.8, 0.8))], c, rng.uniform(1.8, 3))


def draw_bench_back(cv, rng, F):
    bx0, bx1 = BENCH_X0, BENCH_X1
    ox, oy = BACK_OFF
    iron = mix(PINK, (255, 230, 255), F * 0.5)
    # rear legs + back uprights
    for x in (bx0 + 18, bx1 - 18):
        cv.line([(x + ox, GROUND_Y - 22), (x + ox, SEAT_Y + oy), (x + ox - 10, SEAT_Y - 150)], BLACK, 9)
        cv.line([(x + ox, GROUND_Y - 22), (x + ox, SEAT_Y + oy), (x + ox - 10, SEAT_Y - 150)], iron, 4)
    # backrest slats
    for k in range(3):
        y = SEAT_Y - 62 - k * 30
        a, b = (bx0 + ox - 14, y), (bx1 + ox - 14, y)
        cv.line([a, b], BLACK, 22)
        plank(cv, rng, a, b, 14, F)
    # seat (top surface seen slightly from above)
    for k in range(3):
        f = k / 2
        a = (bx0 + ox * (1 - f), SEAT_Y + oy * (1 - f))
        b = (bx1 + ox * (1 - f), SEAT_Y + oy * (1 - f))
        cv.line([a, b], BLACK, 13)
        plank(cv, rng, a, b, 7, F)


def draw_bench_front(cv, rng, F):
    iron = mix(PINK, (255, 230, 255), F * 0.5)
    a, b = (BENCH_X0, SEAT_Y + 6), (BENCH_X1, SEAT_Y + 6)
    cv.line([a, b], BLACK, 14)
    plank(cv, rng, a, b, 8, F, BLUE, BLUE_LT)
    for x in (BENCH_X0 + 18, BENCH_X1 - 18):
        pts = [(x, SEAT_Y + 10), (x + 4, SEAT_Y + 60), (x - 6, GROUND_Y - 4), (x + 10, GROUND_Y)]
        cv.line(pts, BLACK, 10)
        cv.line(pts, iron, 4.5)
        # curly armrest
        arm = [(x, SEAT_Y + 4)] + [(x + 22 * math.cos(a) * (1 - a / 9) - 4, SEAT_Y - 40 + 22 * math.sin(a) * (1 - a / 9))
                                   for a in np.linspace(math.pi / 2, math.pi / 2 + 4.5, 12)]
        cv.line(arm, BLACK, 9)
        cv.line(arm, iron, 4)


def draw_lamp(cv, rng, t, F):
    post = mix(BLUE, (230, 230, 255), F * 0.5)
    pts = [(LAMP_POST_X, GROUND_Y + 10), (LAMP_POST_X, 360), (LAMP_POST_X + 10, 320),
           (LAMP_POST_X + 60, 300), (LAMP_HEAD[0] - 20, 302), (LAMP_HEAD[0], 318)]
    cv.line(pts, BLACK, 12)
    cv.line(pts, post, 5)
    # lamp head + flicker
    flick = 1.0 if (int(t * FPS) % 37) not in (3, 4) else 0.4
    shade = [(LAMP_HEAD[0] - 26, LAMP_HEAD[1] + 4), (LAMP_HEAD[0] + 26, LAMP_HEAD[1] + 4),
             (LAMP_HEAD[0] + 12, LAMP_HEAD[1] - 12), (LAMP_HEAD[0] - 12, LAMP_HEAD[1] - 12)]
    cv.poly(shade, BLACK, outline=post, w=3)
    cv.dot((LAMP_HEAD[0], LAMP_HEAD[1] + 8), 9, mix(LAMP_DIM, LAMP, flick))
    for _ in range(int(14 * flick)):
        a = rng.uniform(0.15, math.pi - 0.15)
        r0 = rng.uniform(14, 22)
        cv.dash(LAMP_HEAD[0] + math.cos(a) * r0, LAMP_HEAD[1] + 8 + math.sin(a) * r0, a,
                rng.uniform(6, 12), LAMP, 2)


def draw_skeleton(cv, rng, ps, t):
    j = lambda p, s=0.7: (p[0] + rng.uniform(-s, s), p[1] + rng.uniform(-s, s))
    hip, sh, tdir = ps["hip"], ps["shoulder"], ps["tdir"]
    nrm = (-tdir[1], tdir[0])

    # far limbs
    cv.bone(j(hip), j(ps["knee_f"]), 7, BONE_FAR)
    cv.bone(j(ps["knee_f"]), j(ps["ankle_f"]), 6, BONE_FAR)
    foot(cv, ps["ankle_f"], BONE_FAR, ps["tap"])
    cv.bone(j(ps["s_f"]), j(ps["elbow_f"]), 6, BONE_FAR)
    cv.bone(j(ps["elbow_f"]), j(ps["hand_f"]), 5, BONE_FAR)
    hand(cv, ps["hand_f"], BONE_FAR)

    # pelvis
    R = math.atan2(tdir[1], tdir[0]) + math.pi / 2
    pel = [(-22, -8), (-6, -36), (22, -30), (30, -6), (16, 18), (-8, 22), (-24, 10)]
    cv.poly([add(hip, rot(p, R)) for p in pel], BONE, outline=BLACK, w=3)
    cv.dot(add(hip, rot((4, 4), R)), 7, BLACK)

    def spine_pt(u):
        return add(add(hip, tdir, TORSO * u), nrm, math.sin(u * math.pi) * -14)   # slouch

    for i in range(13):
        p = spine_pt(i / 12)
        cv.dot(j(p, 0.3), 6.5, BLACK)
        cv.dot(j(p, 0.3), 4.5, BONE)

    D = 52
    for i in range(8):
        u = 0.90 - i * 0.065
        a = spine_pt(u)
        ue = u - 0.10 - 0.02 * i
        depth = D * (0.75 + 0.25 * math.sin(math.pi * (i + 1) / 9)) * (0.6 if i >= 6 else 1)
        b = add(add(hip, tdir, TORSO * ue), nrm, depth)
        ctrl = add(add(a, nrm, depth * 0.95), tdir, TORSO * 0.05)
        pts = []
        for k in range(10):
            s_ = k / 9
            pts.append(j(((1 - s_) ** 2 * a[0] + 2 * (1 - s_) * s_ * ctrl[0] + s_ * s_ * b[0],
                          (1 - s_) ** 2 * a[1] + 2 * (1 - s_) * s_ * ctrl[1] + s_ * s_ * b[1]), 0.3))
        cv.line(pts, BLACK, 8)
        cv.line(pts, BONE, 3.6)
    cv.bone(add(add(hip, tdir, TORSO * 0.40), nrm, D * 0.95),
            add(add(hip, tdir, TORSO * 0.80), nrm, D * 0.8), 5, BONE, 3)
    cv.bone(sh, add(sh, nrm, 26), 5, BONE)
    cv.bone(add(sh, tdir, -10), add(add(sh, tdir, -48), nrm, -8), 6, BONE)
    cv.bone(sh, ps["neck_end"], 6, BONE)

    # near leg
    knee, ankle = ps["knee_n"], ps["ankle_n"]
    cv.bone(j(hip), j(knee), 8, BONE)
    perp = norm((-(ankle[1] - knee[1]), ankle[0] - knee[0]))
    cv.bone(j(add(knee, perp, 2.5)), j(add(ankle, perp, 2.5)), 5, BONE)
    cv.bone(j(add(knee, perp, -3)), j(add(ankle, perp, -3)), 3, BONE, 4)
    cv.dot(knee, 7, BONE)
    foot(cv, ankle, BONE, 0)

    # near arm
    el, hd = ps["elbow_n"], ps["hand_n"]
    cv.bone(j(sh), j(el), 7, BONE)
    perp = norm((-(hd[1] - el[1]), hd[0] - el[0]))
    cv.bone(j(add(el, perp, 2.2)), j(add(hd, perp, 2.2)), 4, BONE)
    cv.bone(j(add(el, perp, -2.2)), j(add(hd, perp, -2.2)), 3, BONE, 4)
    hand(cv, hd, BONE)

    sb.draw_skull(cv, rng, ps, t)


def foot(cv, ankle, col, tap):
    toe_lift = 10 * tap
    heel = add(ankle, (-8, 8))
    toe = (ankle[0] + 30, GROUND_Y - 2 - toe_lift)
    cv.bone(heel, toe, 6, col)
    for k in range(3):
        a = (toe[0], toe[1] - 2 + k * 2)
        cv.line([a, (a[0] + 9, a[1] + 1)], col, 2.2)


def hand(cv, p, col):
    # relaxed hand hanging down over the knee
    cv.dot(p, 7.5, BLACK)
    cv.dot(p, 5.5, col)
    for k in range(4):
        a = math.radians(70 + (k - 1.5) * 14)
        ln = 15 - abs(k - 1.5) * 2
        mid = add(p, (math.cos(a), math.sin(a)), ln * 0.55)
        tip = add(mid, (math.cos(a + 0.5), math.sin(a + 0.5)), ln * 0.5)
        cv.line([p, mid, tip], BLACK, 5)
        cv.line([p, mid, tip], col, 2.3)


def draw_smoke(cv, rng, t, F):
    k0 = int(math.floor(t / RIBBON_DT))
    for rb in RIBBONS:
        prev = None
        for step in range(int(RIBBON_LIFE / RIBBON_DT)):
            bt = (k0 - step) * RIBBON_DT
            age = t - bt
            if age < 0:
                continue
            tip = tip_at(bt % DUR)[1]
            bump = 1.0 + 1.6 * max(0.0, sb.ember_heat(bt % DUR) - 0.5)
            wob = rb["amp"] * min(1.0, age) * math.sin(2 * math.pi * 0.6 * age + bt * 2.3 + rb["phase"])
            wob += 0.5 * rb["amp"] * min(1.0, age * 0.6) * math.sin(2 * math.pi * 1.4 * age + bt * 5.1)
            x = tip[0] + rb["vx"] * age + WIND[0] * age * age * 0.5 + wob
            y = tip[1] + rb["vy"] * age * (1 + 0.08 * age)
            fade = (1 - age / RIBBON_LIFE) ** 1.2
            if prev is not None and rng.random() > (age / RIBBON_LIFE) ** 2 * 0.8:
                col = mix(mix((60, 20, 50), (225, 222, 238), fade), (255, 255, 255), F * 0.3)
                cv.line([prev, (x, y)], col, (1.2 + 2.0 * fade) * bump)
            prev = (x, y)
    for sp in PUFFS:
        age = (t - sp["b"]) % DUR
        if age > sp["life"]:
            continue
        mouth = tip_at((t - age) % DUR)[0]

        def at(ag):
            e = (1 - math.exp(-2.2 * ag)) / 2.2
            x = mouth[0] + 6 + sp["vx"] * e + WIND[0] * 0.5 * ag
            y = mouth[1] + sp["vy"] * e - 36 * ag
            x += math.sin(sp["ph"] + ag * sp["wf"] * 2 * math.pi) * sp["wob"] * min(1, ag)
            return x, y
        fade = (1 - age / sp["life"]) ** 1.4 * min(1.0, age * 3)
        if fade < 0.06:
            continue
        col = mix((50, 15, 45), (215, 212, 228), fade)
        trail = 0.10 + 0.12 * age
        pts = [at(max(0.0, age - trail * i / 4)) for i in range(5)]
        cv.line([(x + rng.uniform(-1, 1), y + rng.uniform(-1, 1)) for x, y in pts], col, 1.2 + 2.0 * fade)


def draw_front_rain(cv, rng, t, F):
    for x0, y0, sp, ph in RAIN:
        dist = (t * RAIN_SPEED * sp + ph * 2000) % (H + 200)
        x = (x0 + RAIN_DIR[0] * dist) % (W + 400) - 200
        y = (y0 + RAIN_DIR[1] * dist) % (H + 100) - 50
        lit = in_lamp_cone(x, y)
        c = PINK_HOT if ph < 0.25 else PINK
        if lit > 0.1:
            c = mix(c, LAMP, min(1, lit * 1.4))
        c = mix(c, (255, 240, 255), F * 0.7)
        cv.dash(x, y, RAIN_ANG, 15 * sp, c, 1.7)


# ---------------------------------------------------------------- render
def render_frame(i):
    t = i / FPS
    rng = random.Random(5000 + i // BOIL_EVERY)
    F = flash(t)
    cv = Canvas()
    ps = pose(t)
    draw_background(cv, F)
    draw_clouds(cv, rng, t, F)
    draw_bolt(cv, rng, t)
    draw_sky_rain(cv, rng, t, F)
    draw_far(cv, rng, t, F)
    draw_ground(cv, rng, t, F)
    draw_lamp_glow(cv, rng, t)
    draw_puddle(cv, rng, t, F)
    draw_boat(cv, rng, t, F)
    draw_bench_back(cv, rng, F)
    draw_bench_front(cv, rng, F)
    draw_skeleton(cv, rng, ps, t)
    draw_lamp(cv, rng, t, F)
    draw_smoke(cv, rng, t, F)
    draw_front_rain(cv, rng, t, F)
    return cv.img.resize((W, H), Image.LANCZOS)


# ---------------------------------------------------------------- audio: rain + thunder
def make_audio(path, sr=44100):
    rng = np.random.default_rng(3)
    n = int(DUR * sr)
    white = rng.standard_normal(n)
    # rain: hiss (high-passed noise) + soft patter (sparse droplet clicks)
    hiss = np.diff(white, prepend=0) * 0.12
    k = np.ones(8) / 8
    body = np.convolve(white, k, mode="same") * 0.10
    drops = np.zeros(n)
    idx = rng.integers(0, n - 200, 2400)
    for i0 in idx:
        drops[i0:i0 + 120] += rng.uniform(0.05, 0.25) * np.exp(-np.arange(120) / 18) * rng.standard_normal(120)
    rain = hiss + body + drops * 0.6
    # thunder: crack at the flash, rumble a moment later (brown noise, low-passed)
    thunder = np.zeros(n)
    for s in STRIKES:
        brown = np.cumsum(rng.standard_normal(n))
        brown -= np.convolve(brown, np.ones(4001) / 4001, mode="same")
        brown /= (np.abs(brown).max() + 1e-9)
        tt = np.arange(n) / sr
        d = (tt - (s["t"] + 0.35)) % DUR
        env = np.where(d < 3.5, (1 - np.exp(-d / 0.08)) * np.exp(-d / 1.1), 0)
        wobble = 0.6 + 0.4 * np.sin(2 * np.pi * 3.1 * d) * np.sin(2 * np.pi * 0.9 * d + 1)
        thunder += brown * env * wobble * 0.9
        dc = (tt - s["t"]) % DUR
        crack = np.where(dc < 0.25, np.exp(-dc / 0.04), 0) * np.diff(white, prepend=0) * 0.5
        thunder += crack
    mix_ = rain + thunder
    mix_ /= np.abs(mix_).max() * 1.1
    pcm = (mix_ * 32767).astype(np.int16)
    stereo = np.stack([pcm, np.roll(pcm, 37)], axis=1)
    with wave.open(path, "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(stereo.tobytes())


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "video/skeleton_bench.mp4"
    if out.endswith(".png"):
        fr = int(sys.argv[2]) if len(sys.argv) > 2 else 30
        render_frame(fr).save(out)
        return
    wav = os.path.join(tempfile.mkdtemp(), "storm.wav")
    make_audio(wav)
    ff = subprocess.Popen(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", wav,
         "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", out],
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
