"""
"Midnight Jazz Club": an original naive / painterly illustration generated in code,
then turned into a 6-frame "film flicker" loop:
  - the drawing itself never moves
  - every frame gets a different exposure (bright / dark strobe), colour tint,
    contrast curve and fresh film grain

Outputs (in video/):
  flicker_club_still.png   the base illustration
  flicker_club.gif         the 6-frame loop (20 fps)
  flicker_club.mp4         the loop repeated for 6 s (20 fps)

Usage:  python3 video/flicker_club.py
Needs:  numpy, Pillow, ffmpeg.
"""
import math
import os
import random
import subprocess

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
W = H = 1200
SS = 2                       # draw at 2x, downscale at the end

PAPER = (232, 216, 186)
INK = (14, 12, 12)
CHALK = (240, 234, 220)
RED = (205, 38, 32)
RED_DK = (140, 22, 20)
YELLOW = (240, 182, 28)
YELLOW_LT = (248, 214, 70)
BLUE_LT = (128, 172, 208)
BLUE_DK = (38, 58, 150)
PURPLE = (112, 48, 160)
GREY = (168, 166, 160)
BROWN = (150, 84, 40)
PINK = (240, 80, 150)
GREEN = (90, 190, 70)

rng = random.Random(42)


# ---------------------------------------------------------------- painting toolkit
class Painter:
    def __init__(self):
        self.img = Image.new("RGB", (W * SS, H * SS), PAPER)
        self.d = ImageDraw.Draw(self.img)

    # -- helpers in 1x coordinates
    def _s(self, pts):
        return [(x * SS, y * SS) for x, y in pts]

    @staticmethod
    def jitter_color(c, amt):
        return tuple(max(0, min(255, int(v + rng.uniform(-amt, amt)))) for v in c)

    @staticmethod
    def rough(pts, amt=3.0, step=10, closed=True):
        """Subdivide a polyline/polygon and wobble it so edges look hand-painted."""
        out = []
        n = len(pts)
        rngs = range(n if closed else n - 1)
        for i in rngs:
            a, b = pts[i], pts[(i + 1) % n]
            seg = max(1, int(math.hypot(b[0] - a[0], b[1] - a[1]) / step))
            for k in range(seg):
                u = k / seg
                out.append((a[0] + (b[0] - a[0]) * u + rng.uniform(-amt, amt),
                            a[1] + (b[1] - a[1]) * u + rng.uniform(-amt, amt)))
        if not closed:
            out.append(pts[-1])
        return out

    def paint(self, pts, color, tex=14, rough_amt=3.0, streak="v", density=1.0):
        """Fill a polygon with a base colour plus dry-brush streaks, clipped to a rough edge."""
        pts = self.rough(pts, rough_amt)
        xs = [p[0] for p in pts]
        ys = [p[1] for p in pts]
        x0, y0, x1, y1 = int(min(xs)) - 4, int(min(ys)) - 4, int(max(xs)) + 4, int(max(ys)) + 4
        w, h = (x1 - x0) * SS, (y1 - y0) * SS
        if w <= 0 or h <= 0:
            return
        layer = Image.new("RGB", (w, h), color)
        ld = ImageDraw.Draw(layer)
        area = (x1 - x0) * (y1 - y0)
        for _ in range(int(area / 90 * density)):
            c = self.jitter_color(color, tex)
            x, y = rng.uniform(0, w), rng.uniform(0, h)
            ln = rng.uniform(8, 40) * SS
            if streak == "v":
                ld.line((x, y, x + rng.uniform(-2, 2) * SS, y + ln), fill=c, width=int(rng.uniform(1, 4) * SS))
            elif streak == "h":
                ld.line((x, y, x + ln, y + rng.uniform(-2, 2) * SS), fill=c, width=int(rng.uniform(1, 4) * SS))
            else:
                a = rng.uniform(0, math.pi)
                ld.line((x, y, x + math.cos(a) * ln, y + math.sin(a) * ln), fill=c, width=int(rng.uniform(1, 4) * SS))
        mask = Image.new("L", (w, h), 0)
        ImageDraw.Draw(mask).polygon([((x - x0) * SS, (y - y0) * SS) for x, y in pts], fill=255)
        self.img.paste(layer, (x0 * SS, y0 * SS), mask)

    def rect(self, x0, y0, x1, y1, color, **kw):
        self.paint([(x0, y0), (x1, y0), (x1, y1), (x0, y1)], color, **kw)

    def ellipse_pts(self, cx, cy, rx, ry, n=36, a0=0, a1=2 * math.pi):
        return [(cx + rx * math.cos(a0 + (a1 - a0) * i / (n - 1)),
                 cy + ry * math.sin(a0 + (a1 - a0) * i / (n - 1))) for i in range(n)]

    def blob(self, cx, cy, rx, ry, color, **kw):
        self.paint(self.ellipse_pts(cx, cy, rx, ry), color, **kw)

    def chalk(self, pts, color=CHALK, width=4.0, passes=3, broken=0.12, amt=1.6, closed=False):
        """Oil-pastel / chalk line: several wobbly passes, with gaps."""
        for p in range(passes):
            q = self.rough(pts, amt, step=8, closed=closed)
            if closed:
                q.append(q[0])
            w = width * rng.uniform(0.55, 1.0) * (1.0 if p == 0 else 0.6)
            for i in range(len(q) - 1):
                if p > 0 and rng.random() < broken:
                    continue
                c = self.jitter_color(color, 12)
                self.d.line((q[i][0] * SS, q[i][1] * SS, q[i + 1][0] * SS, q[i + 1][1] * SS),
                            fill=c, width=max(1, int(w * SS)))

    def dot(self, x, y, r, color):
        self.d.ellipse(((x - r) * SS, (y - r) * SS, (x + r) * SS, (y + r) * SS), fill=color)

    def scrub(self, x0, y0, x1, y1, color, n=None, vertical=True):
        """Loose scrubby dry-brush patch (background colour blocks)."""
        n = n or int((x1 - x0) * (y1 - y0) / 60)
        for _ in range(n):
            c = self.jitter_color(color, 18)
            x, y = rng.uniform(x0, x1), rng.uniform(y0, y1)
            ln = rng.uniform(10, 45)
            if vertical:
                pts = [(x, y), (x + rng.uniform(-3, 3), y + ln)]
            else:
                pts = [(x, y), (x + ln, y + rng.uniform(-3, 3))]
            self.d.line(self._s(pts), fill=c, width=int(rng.uniform(2, 6) * SS))


# ---------------------------------------------------------------- character parts
def eye(p, x, y, r, ring=None, look=(0.25, 0.1)):
    p.dot(x, y, r + 2, INK)
    p.blob(x, y, r, r * rng.uniform(0.9, 1.05), CHALK, tex=6, rough_amt=1.0, density=0.3)
    p.dot(x + look[0] * r, y + look[1] * r, r * 0.42, INK)
    p.dot(x + look[0] * r - r * 0.12, y + look[1] * r - r * 0.15, r * 0.1, CHALK)
    if ring:
        p.chalk(p.ellipse_pts(x, y, r + 5, r + 5, 20), ring, 3.5, closed=True)


MOUTHS = []          # mouths are not baked into the base: they are redrawn every frame


def mouth(p, x, y, w, h, gums=True):
    MOUTHS.append((x, y, w, h))


def draw_mouth(p, x, y, w, h):
    """Two rows of pointy white teeth on red gums. Called once per frame with a
    different seed, so every tooth changes shape / position a little (the 'boil')."""
    j = lambda a=1.2: rng.uniform(-a, a)
    gum_h = h * 0.38
    dy = j(0.8)
    # dark mouth gap (keeps the face black between the gums)
    p.paint([(x - 2, y), (x + w + 2, y), (x + w + 2, y + h), (x - 2, y + h)], INK, tex=4,
            rough_amt=1.0, density=0.1)
    upper = [(x + j(), y + dy + j()), (x + w + j(), y + dy + j()),
             (x + w + j(), y + dy + gum_h + j()), (x + j(), y + dy + gum_h + j())]
    lower = [(x + 3 + j(), y + dy + h - gum_h + j()), (x + w - 3 + j(), y + dy + h - gum_h + j()),
             (x + w - 3 + j(), y + dy + h + j()), (x + 3 + j(), y + dy + h + j())]
    p.paint(upper, RED, tex=16, rough_amt=1.4, density=0.5)
    p.paint(lower, RED, tex=16, rough_amt=1.4, density=0.5)
    n = max(3, int(w / 9))
    tw = w / n
    for row in (0, 1):
        for i in range(n):
            cx = x + tw * (i + 0.5) + j(1.6)
            size = tw * rng.uniform(0.32, 0.5)
            if row == 0:               # upper teeth point down
                base_y = y + dy + gum_h * 0.35 + j(0.8)
                tri = [(cx - size, base_y), (cx + size, base_y),
                       (cx + j(1.5), base_y + gum_h * rng.uniform(0.75, 1.15))]
            else:                      # lower teeth point up
                base_y = y + dy + h - gum_h * 0.35 + j(0.8)
                tri = [(cx - size, base_y), (cx + size, base_y),
                       (cx + j(1.5), base_y - gum_h * rng.uniform(0.75, 1.15))]
            p.paint(tri, CHALK, tex=6, rough_amt=0.7, density=0.2)


def head(p, cx, cy, r, look=(0.25, 0.1), ring=None, hair=None, mouth_w=None):
    if hair == "spiky":
        for i in range(13):
            a = math.radians(-170 + i * 13)
            tip = (cx + math.cos(a) * r * 1.65, cy + math.sin(a) * r * 1.6)
            b1 = (cx + math.cos(a - 0.16) * r * 0.8, cy + math.sin(a - 0.16) * r * 0.8)
            b2 = (cx + math.cos(a + 0.16) * r * 0.8, cy + math.sin(a + 0.16) * r * 0.8)
            p.paint([b1, tip, b2], INK, tex=4, rough_amt=1.5, density=0.2)
    if hair == "curly":
        for i in range(9):
            a = math.radians(-180 + i * 22)
            p.blob(cx + math.cos(a) * r * 0.95, cy + math.sin(a) * r * 0.9 - 4, r * 0.38, r * 0.38, INK,
                   tex=4, density=0.2)
    p.blob(cx, cy, r, r * 1.05, INK, tex=6, density=0.3)
    er = r * 0.34
    eye(p, cx + r * 0.05, cy - r * 0.15, er, ring=ring, look=look)
    eye(p, cx + r * 0.62, cy - r * 0.2, er * 0.8, look=look)
    mw = mouth_w or r * 0.85
    mouth(p, cx + r * 0.05, cy + r * 0.35, mw, r * 0.38)


def body(p, pts, color=INK, outline=CHALK):
    p.paint(pts, color, tex=8, density=0.5)
    # sketchy chalk contour on part of the silhouette (like highlights)
    p.chalk(pts, outline, 3.0, passes=2, broken=0.3, closed=True)


def star(p, cx, cy, r, color, fill=True):
    pts = []
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * 0.45
        pts.append((cx + math.cos(a) * rr, cy + math.sin(a) * rr))
    if fill:
        p.paint(pts, color, tex=14, rough_amt=1.5, density=0.6)
    p.chalk(pts, CHALK if fill else color, 3, closed=True, passes=2)


def note(p, x, y, s=1.0, color=CHALK):
    p.blob(x, y, 9 * s, 7 * s, color, tex=6, rough_amt=1, density=0.2)
    p.chalk([(x + 8 * s, y), (x + 8 * s, y - 38 * s), (x + 22 * s, y - 28 * s)], color, 3.2 * s, passes=2)


# ---------------------------------------------------------------- the scene
def paint_scene():
    p = Painter()

    # paper stains
    for _ in range(60):
        x, y = rng.uniform(0, W), rng.uniform(0, H)
        p.blob(x, y, rng.uniform(30, 120), rng.uniform(20, 90),
               p.jitter_color((222, 204, 170), 10), tex=10, density=0.4, rough_amt=8)

    # loose colour blocks around the edges
    blocks = [(0, 60, 70, 260, RED), (20, 380, 110, 520, YELLOW), (1110, 40, 1200, 210, BLUE_LT),
              (1120, 420, 1200, 640, RED), (300, 0, 420, 70, YELLOW), (760, 10, 880, 90, BLUE_LT),
              (0, 700, 60, 900, BLUE_LT), (1130, 760, 1200, 960, YELLOW), (500, 40, 560, 120, GREY),
              (960, 110, 1060, 170, RED), (150, 120, 260, 170, GREY)]
    for x0, y0, x1, y1, c in blocks:
        p.scrub(x0, y0, x1, y1, c)

    # moon + stars
    p.paint(p.ellipse_pts(1010, 110, 55, 55, 30, math.radians(70), math.radians(290)) +
            p.ellipse_pts(1030, 98, 45, 47, 30, math.radians(270), math.radians(80))[::-1],
            YELLOW_LT, tex=14)
    for sx, sy, sr in [(880, 60, 12), (1140, 300, 10), (640, 60, 9), (120, 300, 11)]:
        star(p, sx, sy, sr, YELLOW, fill=True)

    # ---- the club building (big black block with a stepped roofline)
    roof = [(140, 1200), (140, 330), (200, 330), (200, 280), (330, 280), (330, 240), (470, 240),
            (470, 200), (730, 200), (730, 240), (870, 240), (870, 280), (1000, 280), (1000, 330),
            (1060, 330), (1060, 1200)]
    p.paint(roof, INK, tex=10, density=0.6)
    # coloured interior walls on both wings + checkered floor, so the black figures pop
    p.paint([(150, 500), (388, 500), (388, 872), (150, 872)], (196, 150, 58), tex=22)
    p.paint([(812, 500), (1050, 500), (1050, 872), (812, 872)], (108, 148, 182), tex=22)
    for (x0, x1) in ((150, 388), (812, 1050)):
        for k in range(5):
            yy = 520 + k * 72
            p.chalk([(x0 + 8, yy), (x1 - 8, yy + rng.uniform(-3, 3))], INK, 1.6, passes=1, broken=0.3)
    tile = 52
    for row in range(7):
        for col in range(18):
            x = 150 + col * tile
            y = 872 + row * tile
            if x > 1050:
                continue
            c = INK if (row + col) % 2 == 0 else (214, 200, 172)
            p.rect(x, y, min(x + tile, 1056), y + tile, c, tex=12, rough_amt=1.5, density=0.4)
    # red rug for the cat
    p.blob(930, 1150, 200, 60, RED, tex=22, density=0.8)
    p.chalk(p.ellipse_pts(930, 1150, 200, 60, 40), YELLOW, 3, closed=True, passes=2)
    # chimney with smoke squiggle
    p.rect(900, 170, 950, 282, INK, tex=8)
    p.chalk([(925, 160), (910, 130), (935, 100), (915, 70)], GREY, 5, passes=2)
    # light bulbs along the roof
    for i in range(16):
        x = 480 + i * 16.5
        y = 212 + 6 * math.sin(i * 0.8)
        p.dot(x, y, 5, YELLOW_LT)
    p.chalk([(470, 210), (730, 210)], GREY, 1.6, passes=1)

    # windows
    for (x, y, c) in [(185, 360, YELLOW), (245, 360, BLUE_LT), (185, 440, RED), (245, 440, YELLOW),
                      (955, 360, BLUE_LT), (1015, 360, YELLOW), (955, 440, YELLOW), (1015, 440, RED),
                      (360, 270, BLUE_LT), (800, 270, YELLOW)]:
        p.rect(x - 18, y - 26, x + 18, y + 26, c, tex=18)
        p.chalk([(x, y - 26), (x, y + 26)], INK, 2.5, passes=1)

    # neon sign "JAZZ" (pink chalk letters on black)
    p.rect(470, 236, 730, 312, (30, 18, 30), tex=6)
    letters = {
        "J": [[(0, 0), (30, 0)], [(18, 0), (18, 40), (8, 50), (-4, 42)]],
        "A": [[(0, 50), (16, 0), (32, 50)], [(7, 30), (25, 30)]],
        "Z": [[(0, 0), (32, 0), (0, 50), (32, 50)]],
    }
    x = 500
    for ch in "JAZZ":
        for stroke in letters[ch]:
            pts = [(x + px, 250 + py) for px, py in stroke]
            p.chalk(pts, PINK, 6, passes=3, broken=0.05)
        x += 54
    p.chalk([(482, 244), (718, 244), (718, 304), (482, 304), (482, 244)], YELLOW, 2.2, passes=1)

    # ---- the stage arch
    arch = p.ellipse_pts(600, 520, 210, 180, 30, math.pi, 2 * math.pi) + [(810, 860), (390, 860)]
    p.paint(arch, BLUE_DK, tex=16, streak="d")
    p.blob(600, 520, 120, 120, YELLOW, tex=18, density=0.8)            # spotlight
    # curtains
    for side in (-1, 1):
        x0 = 600 + side * 210
        x1 = 600 + side * 140
        cur = [(x0, 470), (x1, 360), (x1 + side * -10, 600), (x1 + side * 12, 860), (x0, 860)]
        p.paint(cur, RED, tex=20, streak="v")
        for k in range(4):
            fx = x0 + (x1 - x0) * (k + 0.5) / 4
            p.chalk([(fx, 430), (fx + side * 6, 860)], RED_DK, 3, passes=1)
    p.chalk(arch[:30], CHALK, 3.5, passes=2, broken=0.2)
    # stage floor
    p.rect(380, 820, 820, 870, BROWN, tex=20, streak="h")
    for k in range(4):
        p.chalk([(385, 830 + k * 11), (815, 830 + k * 11)], RED_DK, 1.6, passes=1)

    # ---- singer (centre) with a star above the head and a mic stand
    body(p, [(560, 600), (640, 600), (700, 822), (500, 822)], INK)
    p.paint([(578, 640), (622, 640), (648, 822), (552, 822)], PURPLE, tex=20)          # dress panel
    p.chalk([(600, 640), (600, 822)], CHALK, 2.2, passes=1)
    p.chalk([(566, 610), (520, 680), (548, 700)], INK, 14, passes=1)                    # arm
    p.chalk([(634, 612), (668, 560), (652, 540)], INK, 14, passes=1)                    # arm to mic
    head(p, 598, 545, 44, look=(0.4, -0.15), ring=GREEN, hair="curly")
    p.chalk([(655, 548), (690, 822)], GREY, 4, passes=2)                                 # mic stand
    p.blob(653, 540, 9, 12, GREY, tex=10, density=0.4)
    p.chalk([(670, 822), (712, 822)], GREY, 4, passes=1)
    star(p, 600, 455, 28, YELLOW_LT)
    for i, (nx, ny, s) in enumerate([(720, 470, 1.0), (760, 420, 0.8), (470, 440, 0.9)]):
        note(p, nx, ny, s)

    # ---- sax player (left)
    body(p, [(230, 640), (330, 640), (360, 900), (200, 900)], INK)
    p.paint([(240, 650), (320, 650), (345, 760), (215, 760)], PURPLE, tex=22)           # jacket
    head(p, 282, 585, 40, look=(0.5, 0.1), ring=YELLOW, hair="spiky")
    sax = [(318, 600), (330, 640), (330, 720), (310, 770), (280, 780), (268, 760)]
    p.chalk(sax, YELLOW, 15, passes=2, broken=0.0)
    p.blob(272, 772, 22, 16, YELLOW, tex=20, density=0.6)
    p.dot(272, 772, 9, INK)
    for k in range(4):
        p.dot(334, 660 + k * 18, 3.5, CHALK)
    p.chalk([(250, 700), (318, 700)], INK, 14, passes=1)
    p.chalk([(265, 740), (322, 735)], INK, 14, passes=1)
    note(p, 360, 560, 0.9, YELLOW_LT)

    # ---- bass player (right) with top hat and an upright bass
    body(p, [(880, 620), (960, 620), (990, 900), (860, 900)], INK)
    head(p, 920, 565, 40, look=(-0.5, 0.1), ring=BLUE_LT)
    p.rect(888, 490, 952, 532, INK, tex=6)                                               # hat
    p.rect(874, 528, 966, 540, INK, tex=6)
    p.rect(888, 512, 952, 522, RED, tex=10)
    # the bass
    p.blob(840, 820, 58, 62, BROWN, tex=24, density=0.8)
    p.blob(845, 730, 44, 48, BROWN, tex=24, density=0.8)
    p.chalk(p.ellipse_pts(840, 820, 58, 62, 26), CHALK, 2.6, closed=True, passes=1)
    p.chalk([(850, 680), (870, 520)], INK, 9, passes=1)                                  # neck
    for k in range(4):
        p.chalk([(832 + k * 6, 860), (858 + k * 4, 540)], CHALK, 1.2, passes=1)
    p.chalk([(808, 790), (818, 805)], INK, 3, passes=1)
    p.chalk([(868, 790), (858, 805)], INK, 3, passes=1)
    p.chalk([(890, 650), (850, 700), (838, 760)], INK, 14, passes=1)                    # arm plucking

    # ---- foreground: a drinker at a little red table (bottom left)
    body(p, [(40, 1010), (250, 960), (330, 1200), (0, 1200)], INK)
    p.paint([(60, 1030), (240, 985), (290, 1200), (30, 1200)], BLUE_DK, tex=20)         # coat
    head(p, 160, 935, 62, look=(0.55, 0.05), ring=PINK, mouth_w=60)
    p.paint([(230, 1080), (520, 1060), (540, 1100), (215, 1120)], RED, tex=22, streak="h")  # table top
    p.chalk([(230, 1080), (520, 1060), (540, 1100), (215, 1120)], CHALK, 2.6, closed=True, passes=1)
    p.chalk([(380, 1110), (380, 1200)], INK, 12, passes=1)
    # martini glass
    glass = [(400, 980), (460, 980), (430, 1020)]
    p.paint(glass, BLUE_LT, tex=16, density=0.5)
    p.chalk(glass + [glass[0]], CHALK, 3, passes=2)
    p.chalk([(430, 1020), (430, 1060)], CHALK, 3, passes=2)
    p.chalk([(412, 1063), (448, 1060)], CHALK, 3, passes=1)
    p.dot(445, 992, 7, GREEN)
    p.chalk([(445, 992), (470, 960)], CHALK, 1.5, passes=1)
    p.chalk([(235, 1000), (330, 1040), (405, 1000)], INK, 16, passes=1)                 # arm to glass
    # candle on the table
    p.rect(480, 1030, 496, 1070, CHALK, tex=6)
    p.blob(488, 1018, 7, 13, YELLOW_LT, tex=10, density=0.4)
    p.blob(488, 1022, 3, 6, RED, tex=4, density=0.2)

    # ---- foreground: cat on a stack of records (bottom right)
    for k in range(4):
        y = 1170 - k * 22
        p.blob(930, y, 115, 16, INK, tex=8, density=0.3)
        p.blob(930, y - 2, 22, 6, RED if k % 2 == 0 else YELLOW, tex=10, density=0.3)
        p.chalk(p.ellipse_pts(930, y, 115, 16, 24, math.pi * 0.05, math.pi * 0.95), GREY, 1.8, passes=1)
    cat_body = [(870, 1095), (990, 1095), (1000, 1000), (960, 940), (900, 940), (860, 1000)]
    body(p, cat_body, INK)
    p.blob(930, 905, 52, 46, INK, tex=6, density=0.3)
    p.paint([(886, 885), (892, 830), (918, 870)], INK, tex=4, density=0.2)               # ears
    p.paint([(942, 870), (968, 830), (974, 885)], INK, tex=4, density=0.2)
    for ex in (910, 950):
        p.blob(ex, 900, 13, 13, YELLOW_LT, tex=10, density=0.4)
        p.blob(ex + 2, 900, 3.5, 10, INK, tex=2, density=0.1)
    p.chalk([(930, 918), (924, 925), (936, 925), (930, 918)], PINK, 2.4, passes=1)
    for s in (-1, 1):
        for k in range(3):
            p.chalk([(930 + s * 20, 925 + k * 5), (930 + s * 62, 915 + k * 10)], CHALK, 1.4, passes=1)
    tail = [(990, 1080), (1050, 1060), (1070, 1000), (1045, 970), (1030, 990)]
    p.chalk(tail, INK, 13, passes=1)
    p.chalk(tail, CHALK, 2, passes=1, broken=0.3)

    # ---- scattered marks: crosses, dashes, little scribbles (naive poster energy)
    for _ in range(18):
        x, y = rng.uniform(40, 1160), rng.uniform(40, 1160)
        c = rng.choice([CHALK, RED, YELLOW, BLUE_LT])
        if rng.random() < 0.5:
            p.chalk([(x - 8, y - 8), (x + 8, y + 8)], c, 3, passes=1)
            p.chalk([(x + 8, y - 8), (x - 8, y + 8)], c, 3, passes=1)
        else:
            p.chalk([(x, y), (x + rng.uniform(15, 35), y + rng.uniform(-4, 4))], c, 3, passes=1)

    return p


def finish(img_2x):
    img = img_2x.resize((W, H), Image.LANCZOS)
    # slight paper grain baked into the base
    arr = np.asarray(img).astype(np.float32)
    grain = np.random.default_rng(1).normal(0, 6, (H, W, 1))
    return Image.fromarray(np.clip(arr + grain, 0, 255).astype(np.uint8))


def frame_with_mouths(base_painter, k):
    """Copy the static painting and redraw every mouth with a per-frame seed."""
    global rng
    fp = Painter()
    fp.img = base_painter.img.copy()
    fp.d = ImageDraw.Draw(fp.img)
    rng = random.Random(900 + k)
    for m in MOUTHS:
        draw_mouth(fp, *m)
    return finish(fp.img)


# ---------------------------------------------------------------- the flicker grade
# per frame: exposure, RGB tint, gamma (crush), red->magenta push, grain strength
GRADES = [
    dict(exp=1.00, tint=(1.00, 1.00, 1.00), gamma=1.00, magenta=0.0, grain=10),
    dict(exp=0.52, tint=(1.06, 0.84, 0.62), gamma=1.30, magenta=0.0, grain=14),   # dark sepia
    dict(exp=1.03, tint=(1.00, 1.05, 0.74), gamma=0.95, magenta=0.0, grain=11),   # lemon
    dict(exp=0.62, tint=(1.10, 0.80, 0.60), gamma=1.22, magenta=0.0, grain=14),   # red-brown
    dict(exp=1.06, tint=(1.05, 0.94, 0.98), gamma=0.92, magenta=0.55, grain=10),  # pink reds
    dict(exp=0.36, tint=(1.12, 0.78, 0.55), gamma=1.45, magenta=0.0, grain=16),   # muddy dark
]


def grade(base, g, seed):
    r = np.random.default_rng(seed)
    a = np.asarray(base).astype(np.float32) / 255.0
    if g["magenta"]:
        red_dom = np.clip((a[..., 0] - np.maximum(a[..., 1], a[..., 2])) * 2.0, 0, 1)
        a[..., 2] += red_dom * g["magenta"] * 0.55
        a[..., 1] -= red_dom * g["magenta"] * 0.08
    a = a * np.array(g["tint"], dtype=np.float32) * g["exp"]
    a = np.clip(a, 0, 1) ** g["gamma"]
    # fresh film grain (mostly luminance, a little chroma) + blotchy paper flutter
    lum = r.normal(0, g["grain"] / 255.0, (H, W, 1))
    chroma = r.normal(0, g["grain"] / 700.0, (H, W, 3))
    blot = r.normal(0, 1, (H // 40, W // 40)).astype(np.float32)
    blot = np.asarray(Image.fromarray(blot).resize((W, H), Image.BICUBIC))[..., None]
    a = a + lum + chroma
    a = a * (1 + 0.05 * blot)
    out = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
    return out.filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))


def main():
    base_p = paint_scene()
    bases = [frame_with_mouths(base_p, k) for k in range(len(GRADES))]
    base = bases[0]
    base.save(os.path.join(OUT_DIR, "flicker_club_still.png"))
    frames = [grade(bases[i], g, 100 + i) for i, g in enumerate(GRADES)]

    gif = os.path.join(OUT_DIR, "flicker_club.gif")
    small = [f.resize((720, 720), Image.LANCZOS).quantize(colors=200, method=Image.Quantize.MEDIANCUT)
             for f in frames]
    small[0].save(gif, save_all=True, append_images=small[1:], duration=50, loop=0, disposal=1)

    mp4 = os.path.join(OUT_DIR, "flicker_club.mp4")
    ff = subprocess.Popen(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{W}x{H}", "-r", "20", "-i", "-",
         "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-pix_fmt", "yuv420p",
         "-movflags", "+faststart", mp4], stdin=subprocess.PIPE)
    for k in range(20):                   # 20 repeats x 6 frames = 120 frames = 6 s
        for f in frames:
            ff.stdin.write(f.tobytes())
    ff.stdin.close()
    ff.wait()
    print("wrote", mp4, gif)


if __name__ == "__main__":
    main()
