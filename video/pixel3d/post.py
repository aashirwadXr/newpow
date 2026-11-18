"""
Post-process the low-res Blender frames into the final pixel-art video.

  1. colour grade (muted, slightly teal, rainy)
  2. rain streaks + raindrop ripples on the water (water_mask.png from scene.py)
  3. ordered (Bayer) dithering to a reduced number of colour levels -> pixel-art texture
  4. nearest-neighbour upscale x4 (370x366 -> 1480x1464)
  5. encode 60 fps H.264

Usage:  python3 video/pixel3d/post.py FRAMES_DIR out.mp4 [preview_frame]
"""
import math
import os
import random
import subprocess
import sys

import numpy as np
from PIL import Image

FR = sys.argv[1]
OUT = sys.argv[2]
FPS, DUR = 60, 10.0
SCALE = 4
LEVELS = 11                     # colour levels per channel before dithering

mask = np.asarray(Image.open(os.path.join(FR, "water_mask.png")).convert("L")) > 128
H, W = mask.shape
B4 = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]], np.float32) / 16.0 - 0.5
BAYER = np.tile(B4, (H // 4 + 1, W // 4 + 1))[:H, :W][..., None]

rng = random.Random(4)
RAIN = [(rng.uniform(0, W), rng.uniform(0, H), rng.choice([2, 3, 4])) for _ in range(300)]
ys, xs = np.nonzero(mask)
RIPPLES = []
for _ in range(240):
    i = rng.randrange(len(xs))
    RIPPLES.append((xs[i], ys[i], rng.uniform(0, DUR), rng.uniform(0.45, 0.8), rng.uniform(1.8, 3.2)))
SPLASH = [(rng.uniform(0, W), rng.uniform(0, H), rng.uniform(0, DUR)) for _ in range(500)]


def blend(img, x, y, c, a):
    if 0 <= x < W and 0 <= y < H:
        img[y, x] = img[y, x] * (1 - a) + c * a


def process(i):
    t = i / FPS
    img = np.asarray(Image.open(os.path.join(FR, f"f{i:04d}.png")).convert("RGB")).astype(np.float32) / 255.0
    # grade: slight desaturation, cool/teal shadows, gentle contrast
    lum = img.mean(axis=2, keepdims=True)
    img = img * 0.82 + lum * 0.18
    img = img * np.array([0.97, 1.0, 0.98]) + np.array([0.0, 0.012, 0.015]) * (1 - lum)
    img = np.clip((img - 0.5) * 1.06 + 0.5, 0, 1)

    # raindrop ripples on the water surface
    ring = np.array([0.55, 0.72, 0.66], np.float32)
    for x, y, b, life, rmax in RIPPLES:
        age = (t - b) % DUR
        if age > life:
            continue
        u = age / life
        r = 0.6 + rmax * u
        n = max(4, int(r * 6))
        for k in range(n):
            a = 2 * math.pi * k / n
            px, py = int(round(x + r * math.cos(a))), int(round(y + r * 0.55 * math.sin(a)))
            if 0 <= px < W and 0 <= py < H and mask[py, px]:
                blend(img, px, py, ring, 0.55 * (1 - u))
    # little splashes on land / water
    for x, y, b in SPLASH:
        age = (t - b) % DUR
        if age < 0.08:
            blend(img, int(x), int(y), np.array([0.62, 0.70, 0.72]), 0.6)

    # rain streaks (integer laps per loop -> seamless; small steps per 60fps frame)
    drop = np.array([0.62, 0.72, 0.76], np.float32)
    for x0, y0, sp in RAIN:
        speed = (H + 10) * (5 + sp)
        y = (y0 + speed * t / DUR) % (H + 10) - 5
        x = (x0 - 0.12 * speed * t / DUR) % W
        for k in range(sp + 1):
            blend(img, int(x + k * 0.12), int(y - k), drop, 0.30 + 0.05 * sp)

    # ordered dithering to LEVELS per channel
    q = np.floor(img * (LEVELS - 1) + 0.5 + BAYER * 0.9) / (LEVELS - 1)
    out = (np.clip(q, 0, 1) * 255).astype(np.uint8)
    return np.repeat(np.repeat(out, SCALE, 0), SCALE, 1)


def main():
    if len(sys.argv) > 3:
        Image.fromarray(process(int(sys.argv[3]))).save(OUT)
        return
    n = len([f for f in os.listdir(FR) if f.startswith("f") and f.endswith(".png")])
    ff = subprocess.Popen(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{W * SCALE}x{H * SCALE}", "-r", str(FPS), "-i", "-",
         "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p",
         "-movflags", "+faststart", OUT], stdin=subprocess.PIPE)
    for i in range(n):
        ff.stdin.write(process(i).tobytes())
    ff.stdin.close()
    ff.wait()
    print("wrote", OUT, n, "frames")


if __name__ == "__main__":
    main()
