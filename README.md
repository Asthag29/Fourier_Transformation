# Fourier Epicycles

I have been pretty obsessed with Fourier transformations lately. There are a lot of Fourier epicycle websites out there, but most of them require you to either draw the shape manually or supply an SVG file — neither of which gives great results for real images. I wanted something that takes an actual image and figures out the epicycles itself. So I tried to make it by myself.

Upload any image and watch it get redrawn by epicycles.

![demo](Shinchan_fourier.gif)

---

## How it works

The pipeline has four stages:

**1. Edge detection** — the image is converted to grayscale and run through OpenCV's Canny edge detector, which gives a binary map of all the boundaries. Up to 2000 edge points are sampled from this.

**2. Point ordering** — the sampled edge points are unordered (just a cloud of dots). A nearest-neighbour traversal walks through them to produce a single connected path, which is what the Fourier transform will be applied to.

**3. Spline fitting** — a parametric spline (scipy `splprep/splev`) is fitted to the ordered points to smooth out the jagged nearest-neighbour path and resample it uniformly in time. If spline fitting fails, it falls back to Gaussian smoothing.

**4. Fourier transform** — the 2D curve is encoded as a complex signal `z = x + iy` and FFT'd. The N largest frequency components (by amplitude) are kept — these become the epicycles. Each circle's radius is the magnitude, its rotation speed is the frequency, and its starting angle is the phase.

The frontend receives the `(magnitude, frequency, phase)` list and animates the epicycles in real time on an HTML canvas.

---

## What needs improvement

Works reasonably well on cartoons and high-contrast images, falls apart on real photos. The core issue is that the pipeline was never designed to produce a clean single continuous stroke — it's a workaround built on top of an edge detector, and it shows.

I've been doing some research on single-stroke tracing algorithms, which would replace the entire edge-sampling + ordering + spline approach with something that actually understands image contours. If you have something to propose, let me know.

---

## Run locally

```bash
git clone https://github.com/Asthag29/Fourier_Transformation.git
cd Fourier_Transformation

uv venv
uv pip install .

uvicorn app:app --port 8000
```

Then open `http://localhost:8000`. Avoid Safari — it caps the circle count at ~100 for some reason. Use Chrome or Arc.
