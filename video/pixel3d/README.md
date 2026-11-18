# 3D → pixel-art scene (Blender + Python)

How the "pixel-art game diorama" look is made here:

1. **Real 3D scene** built in code with Blender's Python API (`scene.py`): islands,
   reeds, bushes, trees, rocks, a windmill with turning sails and lit windows, a cloud
   that casts a real shadow, ducks, sheep, a dock + rowboat, and a stone weir with water
   pouring into a lower basin. Orthographic camera at an isometric-style angle.
2. **Rendered tiny** with Cycles at 370×366, anti-aliasing off (`filter_width = 0.01`),
   so every pixel is a hard pixel.
3. **Post-process** (`post.py`): colour grade, rain streaks, raindrop ripples (on a water
   mask), then **ordered Bayer dithering** to a few colour levels per channel, then a
   **nearest-neighbour ×4 upscale** to 1480×1464, encoded at **60 fps**.

## Run it

```bash
python3 -m venv bpyenv && ./bpyenv/bin/pip install bpy numpy pillow   # Blender 5.x as a Python module
./bpyenv/bin/python video/pixel3d/scene.py frames 0 599                 # ~2 s per frame on 4 CPU cores
python3 video/pixel3d/post.py frames video/pixel3d_marsh.mp4
```

Everything is free / open source: Blender (GPL), numpy, Pillow, FFmpeg.

## Open-source tools for this style (research)

- **Godot Pixel Renderer** (BUKKBEEK, MIT): Godot 4 toolkit, real-time 3D → pixel art,
  Sobel edge outlines + Bayer dithering, batch export.
  https://80.lv/articles/free-open-source-3d-to-pixel-art-toolkit-for-godot
- **devpoodle/godot-3d-pixel-art** (MIT): example shaders for the 3D pixel-art effect in Godot.
  https://awesome.ecosyste.ms/projects/github.com%2Fdevpoodle%2Fgodot-3d-pixel-art
- **3D pixel-art outline & highlight shader** (Godot Shaders):
  https://godotshaders.com/shader/3d-pixel-art-outline-highlight-post-processing-shader/
- **Smooth 3D pixel filtering** (Godot Shaders, for stable sub-pixel camera motion):
  https://godotshaders.com/shader/smooth-3d-pixel-filtering/
- **woodneck/three-pixelate-showcase** (MIT, Three.js pixelate + dithering):
  https://awesome.ecosyste.ms/projects/github.com%2Fwoodneck%2Fthree-pixelate-showcase
- **kents00/pixeldemo** (Blender compositor node group for pixel art):
  https://awesome.ecosyste.ms/projects/github.com%2Fkents00%2Fpixeldemo
- **Lospec Blender toolkit**: https://lospec.com/blender-toolkit
- Write-up on palette matching / dithering with Blender:
  https://davjcosby.github.io/all-published/miscellaneous-tech/faux-pixel-art-with-blender,-rust,-fancy-color-spaces-and-'borrowed'-algorithms.html

For a real-time / interactive version (a game), Godot 4 + the Pixel Renderer shaders is
the most direct open-source route; for offline video, Blender as used here works headless.
