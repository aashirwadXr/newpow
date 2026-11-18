"""
Pixel-art rainy forest pond with a "next-gen" water look, rendered at a smooth 60 fps.

Original scene (not a copy of any game map): a pond fed by a stream, a wooden dock,
a cottage with a smoking chimney, trees, cattails, ducks, rain.

Water effects (all recomputed every frame, so motion is smooth at 60 fps):
  - depth shading: light teal at the shore -> deep teal in the middle (distance field)
  - moving wave highlights with an ordered-dither (halftone) look
  - shoreline foam that laps in and out
  - the stream flows: white rapids streaks travel downstream
  - raindrop ripple rings that expand and fade
  - ducks with V-shaped wakes, bobbing lily pads, dock shadow on the water

360x360 pixel grid upscaled x3 (nearest) -> 1080x1080, 60 fps, 10 s, seamless loop.
Usage:  python3 video/pixel_pond.py [out.mp4 | frame.png N]
Needs:  numpy, Pillow, ffmpeg.
"""
import math
import random
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw

G = 360                 # pixel-art grid
SCALE = 3
OUT = G * SCALE
FPS = 60
DUR = 10.0
NFRAMES = int(FPS * DUR)
W0 = 2 * math.pi / DUR  # base angular frequency -> everything periodic over DUR

rng = random.Random(3)
nrng = np.random.default_rng(3)

# ---------------------------------------------------------------- palette
GRASS = np.array([(30, 54, 36), (42, 74, 42), (58, 96, 48), (78, 118, 54), (102, 140, 62)], np.float32)
WATER_LIGHT = np.array((86, 158, 150), np.float32)
WATER_MID = np.array((44, 112, 112), np.float32)
WATER_DEEP = np.array((18, 62, 70), np.float32)
FOAM = np.array((205, 230, 222), np.float32)
HILITE = np.array((140, 196, 186), np.float32)

BAYER4 = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]], np.float32) / 16.0
YY, XX = np.mgrid[0:G, 0:G].astype(np.float32)
BAYER = np.tile(BAYER4, (G // 4, G // 4))


def smooth_noise(scale, seed):
    r = np.random.default_rng(seed)
    small = r.random((G // scale + 2, G // scale + 2)).astype(np.float32)
    img = Image.fromarray(small).resize((G + 2 * scale, G + 2 * scale), Image.BICUBIC)
    return np.asarray(img)[scale:scale + G, scale:scale + G]


# ---------------------------------------------------------------- water geometry
POND = [(150, 200, 70, 50), (115, 215, 42, 34), (190, 190, 40, 32), (160, 168, 38, 26)]
_CTRL = [(262, -10), (258, 30), (240, 62), (246, 96), (232, 126), (205, 152), (185, 168)]


def _catmull(pts, n=10):
    out = []
    P = [pts[0]] + pts + [pts[-1]]
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = map(np.array, (P[i - 1], P[i], P[i + 1], P[i + 2]))
        for k in range(n):
            t = k / n
            out.append(tuple(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t
                                    + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3)))
    out.append(pts[-1])
    return out


STREAM = _catmull(_CTRL)


def water_mask():
    m = Image.new("L", (G, G), 0)
    d = ImageDraw.Draw(m)
    for cx, cy, rx, ry in POND:
        d.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=255)
    for i in range(len(STREAM) - 1):
        w = int(13 + 6 * i / (len(STREAM) - 1))
        d.line([STREAM[i], STREAM[i + 1]], fill=255, width=w)
        d.ellipse((STREAM[i][0] - w / 2, STREAM[i][1] - w / 2, STREAM[i][0] + w / 2, STREAM[i][1] + w / 2), fill=255)
    a = np.asarray(m) > 0
    # wobble the outline a little so it's organic
    n = smooth_noise(6, 11)
    grow = (n > 0.62)
    shrink = (n < 0.30)
    a = (a | (dilate(a, 1) & grow)) & ~(edge(a) & shrink)
    return a


def dilate(a, k=1):
    out = a.copy()
    for _ in range(k):
        o = out.copy()
        o[1:] |= out[:-1]
        o[:-1] |= out[1:]
        o[:, 1:] |= out[:, :-1]
        o[:, :-1] |= out[:, 1:]
        out = o
    return out


def erode(a):
    o = a.copy()
    o[1:] &= a[:-1]
    o[:-1] &= a[1:]
    o[:, 1:] &= a[:, :-1]
    o[:, :-1] &= a[:, 1:]
    return o


def edge(a):
    return a & ~erode(a)


def distance_inside(a, maxd=40):
    d = np.zeros(a.shape, np.float32)
    cur = a.copy()
    for k in range(maxd):
        d[cur] += 1
        cur = erode(cur)
        if not cur.any():
            break
    return d


WATER = water_mask()
DIST = distance_inside(WATER)


def stream_params():
    """For stream pixels: distance travelled along the stream (s) and lateral offset."""
    pts = []
    for i in range(len(STREAM) - 1):
        a, b = np.array(STREAM[i], float), np.array(STREAM[i + 1], float)
        n = int(np.linalg.norm(b - a))
        for k in range(n):
            pts.append(a + (b - a) * k / n)
    pts = np.array(pts)
    s_along = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(pts, axis=0), axis=1))])
    ys, xs = np.nonzero(WATER)
    S = np.full((G, G), -1.0, np.float32)
    LAT = np.zeros((G, G), np.float32)
    for y, x in zip(ys, xs):
        dd = (pts[:, 0] - x) ** 2 + (pts[:, 1] - y) ** 2
        i = int(dd.argmin())
        if dd[i] < 14 ** 2 and i < len(pts) - 6:
            S[y, x] = s_along[i]
            t = pts[min(i + 1, len(pts) - 1)] - pts[max(i - 1, 0)]
            t /= (np.linalg.norm(t) + 1e-6)
            LAT[y, x] = (x - pts[i, 0]) * -t[1] + (y - pts[i, 1]) * t[0]
    return S, LAT


S_ALONG, LATERAL = stream_params()
IN_STREAM = S_ALONG >= 0

# ---------------------------------------------------------------- static base (ground)


def build_ground():
    n1 = smooth_noise(22, 1)
    n2 = smooth_noise(7, 2)
    v = 0.6 * n1 + 0.4 * n2 + (BAYER - 0.5) * 0.18
    idx = np.clip((v * 5.2 - 1.0).astype(int), 0, 4)
    img = GRASS[idx].copy()
    # grass blades
    for _ in range(5200):
        x, y = rng.randrange(G), rng.randrange(2, G)
        c = GRASS[rng.choice([0, 1, 3, 4])]
        h = rng.randint(2, 4)
        img[max(0, y - h):y, x] = c
        if rng.random() < 0.3 and x + 1 < G:
            img[y - 1, x + 1] = c
    # muddy shore ring + pebbles
    ring = dilate(WATER, 2) & ~WATER
    img[ring] = img[ring] * 0.55 + np.array((70, 66, 46)) * 0.45
    ring1 = dilate(WATER, 1) & ~WATER
    img[ring1] = np.array((52, 58, 44))
    ys, xs = np.nonzero(dilate(WATER, 4) & ~WATER)
    for _ in range(110):
        i = rng.randrange(len(xs))
        x, y = xs[i], ys[i]
        c = np.array(rng.choice([(110, 116, 120), (88, 94, 100), (132, 136, 136)]), np.float32)
        img[y:y + 2, x:x + 3] = c
        img[y, x] = c * 1.15
    # flowers
    for _ in range(420):
        x, y = rng.randrange(G), rng.randrange(G)
        if dilate(WATER, 3)[y, x]:
            continue
        c = np.array(rng.choice([(196, 62, 66), (230, 120, 150), (230, 220, 200), (236, 196, 70),
                                 (150, 110, 200)]), np.float32)
        img[y, x] = c
        if rng.random() < 0.4 and x + 1 < G:
            img[y, x + 1] = c * 0.85
    # dirt path from the cottage to the dock
    path = Image.new("L", (G, G), 0)
    ImageDraw.Draw(path).line([(292, 262), (270, 278), (232, 286), (196, 282), (168, 262)], fill=255, width=7)
    pm = (np.asarray(path) > 0) & ~WATER
    img[pm] = np.array((120, 100, 66)) + (BAYER[pm, None] - 0.5) * 30
    return img


# ---------------------------------------------------------------- static top layer (trees, house, dock...)
class Top:
    def __init__(self):
        self.rgb = np.zeros((G, G, 3), np.float32)
        self.a = np.zeros((G, G), np.float32)

    def put(self, mask, color, alpha=1.0):
        self.rgb[mask] = color
        self.a[mask] = np.maximum(self.a[mask], alpha)

    def put_px(self, x, y, color, alpha=1.0):
        if 0 <= x < G and 0 <= y < G:
            self.rgb[y, x] = color
            self.a[y, x] = alpha


def poly_mask(pts):
    m = Image.new("L", (G, G), 0)
    ImageDraw.Draw(m).polygon(pts, fill=255)
    return np.asarray(m) > 0


def rect_mask(x0, y0, x1, y1):
    m = np.zeros((G, G), bool)
    m[max(0, y0):max(0, y1), max(0, x0):max(0, x1)] = True
    return m


LEAF = np.array([(22, 48, 30), (34, 70, 38), (52, 96, 46), (78, 128, 56), (112, 156, 70)], np.float32)


def tree(top, cx, cy, R):
    # ground shadow
    sh = ((XX - (cx + R * 0.35)) / (R * 1.05)) ** 2 + ((YY - (cy + R * 0.95)) / (R * 0.45)) ** 2 < 1
    top.put(sh & (top.a == 0), np.array((16, 34, 24), np.float32), 0.55)
    # trunk
    trunk = rect_mask(int(cx - 3), int(cy + R * 0.3), int(cx + 3), int(cy + R * 1.05))
    top.put(trunk, np.array((74, 46, 34), np.float32))
    top.put(rect_mask(int(cx - 3), int(cy + R * 0.3), int(cx - 1), int(cy + R * 1.05)), np.array((96, 62, 42), np.float32))
    top.put(rect_mask(int(cx - 6), int(cy + R * 0.98), int(cx + 6), int(cy + R * 1.05)), np.array((60, 38, 28), np.float32))
    # canopy: cluster of blobs, each shaded from the top-left, quantised with Bayer dither
    blobs = [(0, 0, 1.0)] + [(math.cos(a) * R * 0.55, math.sin(a) * R * 0.45 - R * 0.1, rng.uniform(0.5, 0.65))
                             for a in np.linspace(0, 2 * math.pi, 7)[:-1]]
    blobs += [(rng.uniform(-0.3, 0.3) * R, -R * 0.45, 0.5)]
    canopy = np.zeros((G, G), bool)
    for bx, by, br in sorted(blobs, key=lambda b: b[1]):
        r = R * br
        dx, dy = XX - (cx + bx), YY - (cy + by - R * 0.15)
        inside = dx * dx + dy * dy < r * r
        light = (-(dx + dy * 1.2) / (r * 1.6) + 0.5) + (BAYER - 0.5) * 0.35
        lv = np.clip(light * 2.6 + 1.3, 1, 4).astype(int)
        top.rgb[inside] = LEAF[lv[inside]]
        top.a[inside] = 1.0
        canopy[inside] = True
    outline = canopy & ~erode(canopy)
    top.put(outline, LEAF[0])
    # leaf speckle highlights
    for _ in range(int(R * 3)):
        a = rng.uniform(math.pi * 0.9, math.pi * 1.9)
        rr = rng.uniform(0, R * 0.8)
        x, y = int(cx + math.cos(a) * rr), int(cy - R * 0.2 + math.sin(a) * rr)
        top.put_px(x, y, LEAF[4])


def cattails(top, x, y):
    for k in range(rng.randint(2, 4)):
        xx = x + k * 2 + rng.randint(-1, 1)
        h = rng.randint(6, 10)
        for yy in range(y - h, y):
            top.put_px(xx, yy, np.array((50, 92, 44), np.float32))
        top.put_px(xx, y - h, np.array((110, 62, 40), np.float32))
        top.put_px(xx, y - h + 1, np.array((110, 62, 40), np.float32))
        top.put_px(xx, y - h + 2, np.array((92, 50, 34), np.float32))


def cottage(top, x0, y0):
    w, h = 54, 30
    wall = np.array((96, 118, 82), np.float32)
    top.put(rect_mask(x0 + 2, y0 + h - 2, x0 + w + 6, y0 + h + 4), np.array((20, 36, 26), np.float32), 0.6)
    top.put(rect_mask(x0, y0, x0 + w, y0 + h), wall)
    for yy in range(y0 + 2, y0 + h, 3):
        top.put(rect_mask(x0, yy, x0 + w, yy + 1), wall * 0.82)
    top.put(rect_mask(x0, y0, x0 + 2, y0 + h), np.array((60, 44, 34), np.float32))
    top.put(rect_mask(x0 + w - 2, y0, x0 + w, y0 + h), np.array((60, 44, 34), np.float32))
    # windows (glowing) and door
    for wx in (x0 + 7, x0 + 37):
        top.put(rect_mask(wx - 1, y0 + 7, wx + 10, y0 + 19), np.array((56, 40, 30), np.float32))
        top.put(rect_mask(wx, y0 + 8, wx + 9, y0 + 18), np.array((242, 186, 86), np.float32))
        top.put(rect_mask(wx, y0 + 8, wx + 4, y0 + 12), np.array((252, 220, 140), np.float32))
        top.put(rect_mask(wx + 4, y0 + 8, wx + 5, y0 + 18), np.array((56, 40, 30), np.float32))
        top.put(rect_mask(wx, y0 + 12, wx + 9, y0 + 13), np.array((56, 40, 30), np.float32))
    top.put(rect_mask(x0 + 22, y0 + 12, x0 + 32, y0 + h), np.array((84, 54, 38), np.float32))
    top.put(rect_mask(x0 + 23, y0 + 13, x0 + 31, y0 + h), np.array((104, 68, 44), np.float32))
    top.put_px(x0 + 29, y0 + 21, np.array((220, 190, 90), np.float32))
    # roof: slate, dithered shingles, seen from above at an angle
    roof = poly_mask([(x0 - 6, y0 + 1), (x0 + w + 6, y0 + 1), (x0 + w - 4, y0 - 26), (x0 + 4, y0 - 26)])
    shade = (YY - (y0 - 26)) / 27.0
    rc = np.where((((YY.astype(int) - y0) % 4) == 0)[..., None], np.array((56, 64, 84), np.float32),
                  np.where((BAYER < 0.5 - shade * 0.3)[..., None], np.array((92, 104, 128), np.float32),
                           np.array((74, 84, 106), np.float32)))
    top.rgb[roof] = rc[roof]
    top.a[roof] = 1
    top.put(rect_mask(x0 + 4, y0 - 27, x0 + w - 4, y0 - 25), np.array((112, 124, 146), np.float32))
    top.put(rect_mask(x0 - 6, y0, x0 + w + 6, y0 + 2), np.array((44, 50, 66), np.float32))
    # chimney
    top.put(rect_mask(x0 + 38, y0 - 36, x0 + 46, y0 - 18), np.array((120, 84, 70), np.float32))
    top.put(rect_mask(x0 + 37, y0 - 37, x0 + 47, y0 - 34), np.array((90, 62, 52), np.float32))
    # lantern by the door
    top.put(rect_mask(x0 + 34, y0 + 14, x0 + 37, y0 + 18), np.array((250, 210, 110), np.float32))
    return (x0 + 42, y0 - 38)


def dock(top):
    x0, y0, x1, y1 = 160, 222, 172, 264       # from the bank into the pond
    top.put(rect_mask(x0 + 3, y0 + 2, x1 + 4, y1 + 3), np.array((10, 40, 46), np.float32), 0.45)  # shadow
    for yy in range(y0, y1, 3):
        c = np.array((128, 92, 56), np.float32) * (1.0 if (yy // 3) % 2 else 0.9)
        top.put(rect_mask(x0, yy, x1, yy + 2), c)
        top.put(rect_mask(x0, yy + 2, x1, yy + 3), np.array((80, 56, 36), np.float32))
    for px, py in ((x0 - 1, y0 + 4), (x1, y0 + 4), (x0 - 1, y1 - 3), (x1, y1 - 3)):
        top.put(rect_mask(px, py, px + 2, py + 5), np.array((70, 48, 32), np.float32))


def build_top():
    top = Top()
    dock(top)
    for (x, y) in [(70, 156), (58, 268), (226, 208), (122, 262), (204, 132), (248, 158), (96, 140)]:
        cattails(top, x, y)
    chim = cottage(top, 268, 214)
    trees = [(28, 30, 34), (84, 18, 30), (140, 42, 30), (20, 118, 30), (330, 40, 34), (318, 128, 28),
             (30, 330, 36), (100, 344, 30), (210, 342, 32), (300, 330, 34), (350, 250, 26), (190, 52, 24)]
    for cx, cy, R in sorted(trees, key=lambda t: t[1]):
        tree(top, cx, cy, R)
    return top, chim


# ---------------------------------------------------------------- dynamic elements
LILIES = [(118, 198, 6), (132, 228, 5), (176, 206, 7), (98, 222, 5), (190, 182, 4), (148, 176, 5)]


def make_ripples():
    out = []
    ys, xs = np.nonzero(WATER & (DIST > 2) & ~IN_STREAM)
    r = random.Random(9)
    for _ in range(150):
        i = r.randrange(len(xs))
        out.append((xs[i], ys[i], r.uniform(0, DUR), r.uniform(0.7, 1.2), r.uniform(5, 10)))
    return out


RIPPLES = make_ripples()
RAIN = [(rng.uniform(0, G), rng.uniform(0, G), rng.choice([1, 2, 3])) for _ in range(380)]


def duck_pos(t, k):
    a = W0 * t * (1 if k == 0 else -1) + k * 2.4
    cx, cy, rx, ry = (148, 204, 40, 22) if k == 0 else (156, 196, 26, 16)
    x = cx + rx * math.cos(a)
    y = cy + ry * math.sin(a)
    vx = -rx * math.sin(a) * (1 if k == 0 else -1)
    return x, y, vx, a


def draw_duck(img, x, y, facing_right, t, k):
    bob = 0.5 * math.sin(t * W0 * 25 + k)
    xi, yi = int(round(x)), int(round(y + bob))
    body = (110, 78, 52) if k == 0 else (122, 100, 70)
    head = (40, 110, 70) if k == 0 else (120, 94, 64)
    s = 1 if facing_right else -1
    # body 8x4
    for dx in range(-4, 4):
        for dy in range(-2, 2):
            if abs(dx + 0.5) + abs(dy + 0.5) * 1.6 < 5:
                put(img, xi + dx, yi + dy, body)
    put(img, xi - 4 * s, yi - 2, (60, 44, 32))                 # tail
    for dx in range(-2, 2):
        put(img, xi + dx, yi - 2, tuple(int(c * 1.15) for c in body))
    put(img, xi + 3 * s, yi - 3, head)
    put(img, xi + 4 * s, yi - 3, head)
    put(img, xi + 3 * s, yi - 4, head)
    put(img, xi + 4 * s, yi - 4, head)
    put(img, xi + 5 * s, yi - 3, (230, 180, 60))              # beak
    put(img, xi + 4 * s, yi - 4, (10, 10, 10))                # eye
    if k == 0:
        put(img, xi + 3 * s, yi - 2, (230, 230, 225))         # white neck ring


def put(img, x, y, c, a=1.0):
    if 0 <= x < G and 0 <= y < G:
        img[y, x] = img[y, x] * (1 - a) + np.array(c, np.float32) * a


# ---------------------------------------------------------------- frame
GROUND = build_ground()
TOP, CHIMNEY = build_top()
WIDX = np.nonzero(WATER)
WX, WY = XX[WIDX], YY[WIDX]
WD = DIST[WIDX]
WS = S_ALONG[WIDX]
WL = LATERAL[WIDX]
WSTREAM = IN_STREAM[WIDX]
WB = BAYER[WIDX]
NOISE_W = smooth_noise(5, 21)[WIDX]


def shade_water(t):
    depth = np.clip(WD / 16.0, 0, 1) ** 0.8
    col = WATER_LIGHT[None] * (1 - depth[:, None]) + WATER_DEEP[None] * depth[:, None]
    col = np.where((depth < 0.45)[:, None], col * 0.6 + WATER_MID * 0.4, col)
    # moving wave highlights (halftone dither)
    wv = (np.sin(WX * 0.32 + WY * 0.11 + 3 * W0 * t) + np.sin(WX * 0.12 - WY * 0.38 - 2 * W0 * t)
          + np.sin((WX + WY) * 0.21 + 4 * W0 * t + NOISE_W * 4))
    hl = ((wv / 3 + 0.2 * (1 - depth)) > (0.5 + WB * 0.3)) & ((WY.astype(int) % 3) == 0)
    col = np.where(hl[:, None], col * 0.45 + HILITE * 0.55, col)
    dark = (wv / 3) < (-0.75 + WB * 0.2)
    col = np.where(dark[:, None], col * 0.82, col)
    # shoreline foam lapping in and out
    lap = np.sin(WD * 1.5 - 5 * W0 * t + NOISE_W * 6)
    foam = (WD <= 1.5) | ((WD <= 3.5) & (lap > 0.55 + WB * 0.4))
    col = np.where(foam[:, None], col * 0.25 + FOAM * 0.75, col)
    # stream: flowing white rapids
    col = np.where(WSTREAM[:, None], col * 0.7 + WATER_MID * 0.3, col)
    phase = WS * 0.33 - 30 * W0 * t + NOISE_W * 7 + np.floor(WL * 0.5) * 2.3
    streak = np.sin(phase) * 0.5 + 0.5
    bank = np.abs(WL) > 4.5
    rapids = WSTREAM & ((streak > 0.93 - 0.08 * bank) | ((streak > 0.82) & (WB > 0.75)))
    col = np.where(rapids[:, None], col * 0.2 + FOAM * 0.8, col)
    flow_dark = WSTREAM & (streak < 0.12)
    col = np.where(flow_dark[:, None], col * 0.78, col)
    return col


def render_frame(i):
    t = i / FPS
    img = GROUND.copy()
    img[WIDX] = shade_water(t)

    # rain ripples on the pond
    for x, y, b, life, rmax in RIPPLES:
        age = (t - b) % DUR
        if age > life:
            continue
        u = age / life
        r = 1 + rmax * u
        a = (1 - u) ** 1.2
        for k in range(int(6 + r * 4)):
            ang = 2 * math.pi * k / int(6 + r * 4)
            px, py = int(round(x + r * math.cos(ang))), int(round(y + r * 0.55 * math.sin(ang)))
            if 0 <= px < G and 0 <= py < G and WATER[py, px]:
                put(img, px, py, (170, 214, 204), 0.75 * a)
        if u < 0.12:
            put(img, int(x), int(y) - 1, (220, 240, 235), 0.8)

    # lily pads (gentle bob) with a pink flower on some
    for k, (lx, ly, lr) in enumerate(LILIES):
        dy = 0.6 * math.sin(W0 * 3 * t + k)
        for yy in range(-lr, lr + 1):
            for xx in range(-lr, lr + 1):
                if xx * xx + (yy * 1.6) ** 2 <= lr * lr and not (xx > 0 and abs(yy) <= 0 and xx < lr):
                    c = (70, 130, 60) if (xx + yy) < 0 else (54, 106, 50)
                    put(img, lx + xx, int(round(ly + yy * 0.62 + dy)), c)
        if k % 2 == 0:
            put(img, lx - 1, int(ly + dy) - 1, (240, 150, 190))
            put(img, lx, int(ly + dy) - 1, (250, 200, 220))

    # ducks + wakes
    for k in range(2):
        x, y, vx, a = duck_pos(t, k)
        for back in range(1, 26):
            bt = t - back * 0.04
            bx, by, _, _ = duck_pos(bt, k)
            spread = back * 0.32
            fade = (1 - back / 26) * 0.6
            # perpendicular to motion, approximated in screen space
            x2, y2, _, _ = duck_pos(bt + 0.01, k)
            dxm, dym = x2 - bx, y2 - by
            ln = math.hypot(dxm, dym) + 1e-6
            nx, ny = -dym / ln, dxm / ln
            for s in (-1, 1):
                px, py = int(round(bx + nx * spread * s)), int(round(by + 1 + ny * spread * s * 0.6))
                if 0 <= px < G and 0 <= py < G and WATER[py, px]:
                    put(img, px, py, (190, 226, 216), fade)
        draw_duck(img, x, y, vx > 0, t, k)

    # static top layer (dock, trees, cottage, cattails)
    a = TOP.a[..., None]
    img = img * (1 - a) + TOP.rgb * a

    # chimney smoke: soft puffs that rise, grow and drift with the wind
    NP = 70
    for k in range(NP):
        b = k * DUR / NP
        age = (t - b) % DUR
        life = 3.6
        if age > life:
            continue
        u = age / life
        x = CHIMNEY[0] + 4 * math.sin(age * 2.2 + k * 1.7) - 26 * u * u
        y = CHIMNEY[1] - age * 13
        rad = 1.5 + u * 5
        c = 120 + 70 * (1 - u)
        alpha = 0.5 * (1 - u) ** 1.1 * min(1.0, age * 6)
        for dy in range(-int(rad), int(rad) + 1):
            for dx in range(-int(rad), int(rad) + 1):
                if dx * dx + dy * dy <= rad * rad:
                    put(img, int(x) + dx, int(y) + dy, (c, c, c + 10), alpha)

    # rain (smooth: positions advance a little every 60fps frame)
    for x0, y0, sp in RAIN:
        speed = G * (3 + sp)                       # integer laps per loop -> seamless
        y = (y0 + speed * t / DUR) % (G + 12) - 6
        x = (x0 - 0.18 * speed * t / DUR) % G
        for k in range(4 + sp):
            put(img, int(x - k * 0.18), int(y - k), (176, 196, 214), 0.42 if sp < 3 else 0.55)

    # rainy grade: cooler, slightly hazy, soft vignette
    img = img * 0.93 + np.array((16, 26, 36), np.float32) * 0.07
    vig = 1 - 0.28 * (((XX - G / 2) / (G / 2)) ** 2 + ((YY - G / 2) / (G / 2)) ** 2)
    img = img * vig[..., None]
    out = np.clip(img, 0, 255).astype(np.uint8)
    return np.repeat(np.repeat(out, SCALE, 0), SCALE, 1)


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "video/pixel_pond.mp4"
    if out.endswith(".png"):
        Image.fromarray(render_frame(int(sys.argv[2]) if len(sys.argv) > 2 else 60)).save(out)
        return
    ff = subprocess.Popen(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{OUT}x{OUT}", "-r", str(FPS), "-i", "-",
         "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
         "-movflags", "+faststart", out], stdin=subprocess.PIPE)
    for i in range(NFRAMES):
        ff.stdin.write(render_frame(i).tobytes())
        if i % 60 == 0:
            print(f"frame {i}/{NFRAMES}", flush=True)
    ff.stdin.close()
    ff.wait()
    print("wrote", out)


if __name__ == "__main__":
    main()
