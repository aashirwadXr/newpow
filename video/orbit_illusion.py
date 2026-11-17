"""
"Orbiting static" optical illusion.

Nested, off-centre discs (alternating red / blue) orbit inside each other with
black gaps between them. Each disc is filled with fresh grainy static every frame:
short strokes that swirl around the disc's own centre (red) or fine grain (blue).
The uneven gaps and boiling texture make it read as a wobbling tunnel / eye.

8 s, 1080x1080, 30 fps, seamless loop.

Usage:  python3 video/orbit_illusion.py [out.mp4 | frame.png]
Needs:  numpy, Pillow, ffmpeg.
"""
import math
import subprocess
import sys

import numpy as np
from PIL import Image

W = H = 1080
FPS = 30
DUR = 8.0
NFRAMES = int(FPS * DUR)

RED = np.array([255, 20, 20], dtype=np.float32)
BLUE = np.array([20, 30, 255], dtype=np.float32)

# layers from outside in: (radius, colour, texture, orbit cycles per loop, phase)
LAYERS = [
    dict(r=470, col=RED, tex="swirl", cycles=1, phase=0.0),
    dict(r=375, col=BLUE, tex="grain", cycles=-1, phase=1.2),
    dict(r=270, col=RED, tex="swirl", cycles=2, phase=2.4),
    dict(r=180, col=BLUE, tex="grain", cycles=-2, phase=0.6),
    dict(r=100, col=RED, tex="swirl", cycles=3, phase=3.3),
]
GAP = 26            # black gap between neighbouring discs
WANDER = 0.78       # how far (0..1) each disc swings towards its parent's edge

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)


def hash2(ix, iy, seed):
    """Fast integer hash -> float in [0,1)."""
    h = (ix.astype(np.int64) * 73856093) ^ (iy.astype(np.int64) * 19349663) ^ (seed * 83492791)
    h = (h ^ (h >> 13)) * 1274126177
    h = h ^ (h >> 16)
    return (h & 0xFFFFFF).astype(np.float32) / float(0x1000000)


def centres(t):
    """Disc centres for time t: each one orbits inside its parent."""
    w = 2 * math.pi * t / DUR
    cx, cy = W / 2 + 18 * math.cos(w), H / 2 + 18 * math.sin(2 * w)   # outer disc drifts a little
    out = [(cx, cy, LAYERS[0]["r"])]
    for k in range(1, len(LAYERS)):
        parent_r = out[-1][2]
        r = LAYERS[k]["r"] * (1 + 0.03 * math.sin(w * 2 + k))         # gentle breathing
        room = parent_r - r - GAP
        d = room * WANDER
        a = LAYERS[k]["cycles"] * w + LAYERS[k]["phase"]
        cx, cy = cx + d * math.cos(a), cy + d * math.sin(a)
        out.append((cx, cy, r))
    return out


def texture(kind, cx, cy, t, seed):
    dx, dy = xx - cx, yy - cy
    rr = np.sqrt(dx * dx + dy * dy) + 1e-3
    if kind == "swirl":
        # cells elongated along the circle -> short tangential strokes; they slowly spin
        phi = np.arctan2(dy, dx) + 0.6 * t
        u = np.floor(rr / 2.6)
        v = np.floor(phi * rr / 7.5 + hash2(u, u * 0 + 7, seed) * 7)    # random stagger per ring row
        n = hash2(u, v, seed)
        on = n < 0.52
        level = 0.35 + 0.65 * hash2(v, u, seed + 1)
    else:
        u = np.floor(xx / 2.2)
        v = np.floor(yy / 2.2)
        n = hash2(u, v, seed)
        # clump the grain a bit: mix with a coarser cell
        n2 = hash2(np.floor(xx / 6), np.floor(yy / 6), seed + 5)
        on = (0.6 * n + 0.4 * n2) < 0.5
        level = 0.3 + 0.7 * hash2(v, u, seed + 2)
    return on * level


def render_frame(i):
    t = i / FPS
    seed = 1000 + i                      # brand-new static every frame
    img = np.zeros((H, W, 3), dtype=np.float32)
    cs = centres(t)
    for k, (cx, cy, r) in enumerate(cs):
        inside = (xx - cx) ** 2 + (yy - cy) ** 2 < r * r
        if k + 1 < len(cs):
            ncx, ncy, nr = cs[k + 1]
            inside &= (xx - ncx) ** 2 + (yy - ncy) ** 2 > (nr + GAP) ** 2
        # soft speckled edge: drop some pixels near the rim so the edge fizzes
        rim = np.abs(np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) - r) < 5
        inside &= ~(rim & (hash2(xx, yy, seed + 9) < 0.5))
        tex = texture(LAYERS[k]["tex"], cx, cy, t, seed + 31 * k)
        img[inside] = (tex[inside, None] * LAYERS[k]["col"][None, :])
    return Image.fromarray(img.clip(0, 255).astype(np.uint8))


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "video/orbit_illusion.mp4"
    if out.endswith(".png"):
        render_frame(int(sys.argv[2]) if len(sys.argv) > 2 else 40).save(out)
        return
    ff = subprocess.Popen(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
         "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
         "-movflags", "+faststart", out],
        stdin=subprocess.PIPE)
    for i in range(NFRAMES):
        ff.stdin.write(render_frame(i).tobytes())
        if i % 30 == 0:
            print(f"frame {i}/{NFRAMES}", flush=True)
    ff.stdin.close()
    ff.wait()
    print("wrote", out)


if __name__ == "__main__":
    main()
