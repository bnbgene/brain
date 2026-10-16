"""Walkthrough video from listing photos.

Each photo gets a depth map (Depth Anything V2, ONNX), so the camera can dolly
forward with real parallax: near furniture grows faster than far walls. A light
walking sway runs through the whole video, and rooms connect with a forward
"move-through" blend instead of a cut.

usage: python3 walk.py PHOTOS_DIR DEPTH_MODEL.onnx OUT.mp4
"""
import sys, subprocess, math
import numpy as np, cv2, onnxruntime as ort
from PIL import Image, ImageDraw, ImageFont

PHOTOS, MODEL, OUT = sys.argv[1:4]
W, H, FPS = 1920, 1080, 30
D, X = 3.7, 0.55           # seconds per room, seconds of overlap between rooms
FB = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"
FL = "/usr/share/fonts/opentype/inter/Inter-Light.otf"

# photo, caption, move: (dolly amount, sideways drift, focus x, focus y)
SHOTS = [
 (55, "Welcome to Desert Oasis", (0.30, 0.00, 0.00, 0.05)),
 (56, "Step inside",              (0.40, 0.00, 0.00, 0.00)),
 (9,  "Game room · full-size pool table", (0.30, 0.06, 0.00, 0.05)),
 (13, "Open living room",         (0.30, -0.06, 0.00, 0.00)),
 (15, "Chef's kitchen",           (0.32, 0.05, 0.00, 0.00)),
 (17, "Breakfast nook with pool views", (0.30, -0.05, 0.00, 0.00)),
 (20, "Dining for the whole crew",(0.30, 0.05, 0.00, 0.05)),
 (22, "Primary suite · king bed", (0.30, -0.04, 0.00, 0.05)),
 (39, "Spa-style primary bath",   (0.30, 0.05, 0.00, 0.00)),
 (26, "Bedroom 2 · king",         (0.30, -0.05, 0.00, 0.05)),
 (33, "Bedroom 3 · two beds",     (0.30, 0.05, 0.00, 0.05)),
 (44, "Covered patio",            (0.32, -0.05, 0.00, 0.00)),
 (45, "Resort-style pool & spa",  (0.30, 0.05, 0.00, 0.05)),
 (8,  "Fire pit lounge",          (0.30, -0.05, 0.00, 0.05)),
 (46, "Nights by the pool",       (0.28, 0.04, 0.00, 0.00)),
 (3,  "",                         (0.22, 0.00, 0.00, 0.00)),
]

sess = ort.InferenceSession(MODEL)
def depth_of(img):
    h, w = 518, int(round(518 * img.shape[1] / img.shape[0] / 14)) * 14
    x = cv2.resize(img, (w, h), interpolation=cv2.INTER_AREA)[:, :, ::-1].astype(np.float32) / 255
    x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
    d = sess.run(None, {"pixel_values": x.transpose(2, 0, 1)[None].astype(np.float32)})[0][0]
    d = (d - np.percentile(d, 2)) / (np.percentile(d, 98) - np.percentile(d, 2) + 1e-6)
    d = cv2.GaussianBlur(np.clip(d, 0, 1).astype(np.float32), (0, 0), 3)
    return 1.0 / (0.25 + 0.75 * d)          # distance: near ~1.0, far ~4.0

class Room:
    def __init__(self, path, move):
        img = cv2.imread(path)
        ih, iw = img.shape[:2]                 # crop to 16:9, upscale for clean resampling
        ch = int(iw * 9 / 16); y0 = (ih - ch) // 2
        img = img[y0:y0 + ch]
        self.img = cv2.resize(img, (W, H), interpolation=cv2.INTER_LANCZOS4)
        self.Z = cv2.resize(depth_of(img), (W, H), interpolation=cv2.INTER_LINEAR)
        self.dz, self.tx, self.fx, self.fy = move
        ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
        self.u = (xs - W / 2) / (W / 2); self.v = (ys - H / 2) / (W / 2)

    def frame(self, t, sway):
        """t in [-X, D+X] seconds; camera keeps moving forward the whole time."""
        p = t / D
        e = 0.5 - 0.5 * math.cos(math.pi * min(max(p, 0), 1))   # eased main move
        z = self.dz * (0.15 + 0.85 * e)
        if t > D: z += 0.30 * ((t - D) / X) ** 2                 # speed up through the doorway
        if t < X: z -= 0.06 * (1 - t / X) ** 2                   # arrive still moving forward
        tx = self.tx * (e - 0.5)
        su, sv, roll = sway
        ca, sa = math.cos(roll), math.sin(roll)
        u = self.u * ca - self.v * sa + su; v = self.u * sa + self.v * ca + sv
        u0, v0 = u - self.fx, v - self.fy
        base = 1.07                                              # margin for drift and sway
        su_, sv_ = u0 / base, v0 / base
        for _ in range(3):                                       # solve source point for each output pixel
            sx = (su_ + self.fx) * (W / 2) + W / 2; sy = (sv_ + self.fy) * (W / 2) + H / 2
            Zs = cv2.remap(self.Z, sx, sy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
            k = np.maximum(Zs - z, 0.25) / Zs
            su_ = (u0 * k - tx / Zs) / base; sv_ = v0 * k / base
        sx = (su_ + self.fx) * (W / 2) + W / 2; sy = (sv_ + self.fy) * (W / 2) + H / 2
        return cv2.remap(self.img, sx, sy, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)

def text_layer(lines):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for txt, font, size, fill, xy, anchor in lines:
        f = ImageFont.truetype(font, size)
        d.text((xy[0] + 2, xy[1] + 2), txt, font=f, fill=(0, 0, 0, 120), anchor=anchor)
        d.text(xy, txt, font=f, fill=fill, anchor=anchor)
    a = np.asarray(im).astype(np.float32) / 255
    return a[:, :, 2::-1] * 255, a[:, :, 3:]

grad = np.clip((np.arange(H, dtype=np.float32) - (H - 360)) / 360, 0, 1)[:, None, None] ** 1.5 * 0.55
def caption(i, cap):
    if i == len(SHOTS) - 1:
        return text_layer([
            ("Desert Oasis", FB, 120, (255, 255, 255, 255), (W / 2, H / 2 - 70), "mm"),
            ("4 bedrooms  ·  sleeps 10  ·  pool, spa & fire pit", FL, 42, (255, 255, 255, 255), (W / 2, H / 2 + 40), "mm"),
            ("★ 4.98  ·  Book your stay", FB, 46, (107, 198, 246, 255), (W / 2, H / 2 + 120), "mm")])
    lines = [(cap, FB, 60, (255, 255, 255, 255), (96, H - 110), "ls")]
    if i == 0: lines.append(("SCOTTSDALE, ARIZONA", FL, 34, (255, 255, 255, 230), (98, H - 190), "ls"))
    return text_layer(lines)

rooms = [Room(f"{PHOTOS}/{p:02d}.jpg", m) for p, _, m in SHOTS]
caps = [caption(i, c) for i, (_, c, _) in enumerate(SHOTS)]
step = D - X
total = step * (len(SHOTS) - 1) + D + 1.0
N = int(total * FPS)
ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "bgr24",
    "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "slow", "-crf", "19",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", OUT], stdin=subprocess.PIPE)
smooth = lambda x: x * x * (3 - 2 * x)
def wsum_blur(T):
    # blur strength: peaks in the middle of each room change
    for i in range(1, len(SHOTS)):
        t = T - i * step
        if 0 <= t < X: return math.sin(math.pi * t / X)
    return 0.0
def zoom_blur(img, k):
    # forward motion blur: average of slightly larger copies around the centre
    acc = img.copy(); n = 6
    for j in range(1, n):
        s_ = 1 + 0.07 * k * j / (n - 1)
        M = np.float32([[s_, 0, W / 2 * (1 - s_)], [0, s_, H / 2 * (1 - s_)]])
        acc += cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    return acc / n
for n in range(N):
    T = n / FPS
    # walking sway: gentle bob at step rate, slow side drift, tiny roll
    sway = (0.0025 * math.sin(T * 1.9), 0.0035 * math.sin(T * 3.8 + 0.6), math.radians(0.25) * math.sin(T * 1.9 + 1.1))
    out = None; wsum = 0.0
    for i, r in enumerate(rooms):
        t = T - i * step
        last = i == len(rooms) - 1
        if t < -X or (t > D + X and not last) or (last and t > D + 1.0): continue
        if t < 0: continue
        w = 1.0
        if i > 0 and t < X: w = smooth(t / X)
        f = r.frame(t if not last or t < X else min(t, D), sway).astype(np.float32)
        if last: f *= 0.62                                       # darken for the end card
        out = f * w if out is None else out * (1 - w) + f * w
    if out is None: continue
    if wsum_blur(T) > 0: out = zoom_blur(out, wsum_blur(T))
    cl = None
    for i in range(len(rooms)):                                  # caption of the room we're in
        t = T - i * step
        if 0 <= t <= D - 0.2:
            a = min(1, max(0, (t - 0.6) / 0.5)) * min(1, max(0, (D - 0.2 - t) / 0.4))
            if i == len(rooms) - 1: a = min(1, max(0, (t - 0.5) / 0.7))
            if a > 0: cl = (caps[i], a)
    if cl is None and T >= step * (len(rooms) - 1): cl = (caps[-1], 1.0)
    if cl:
        (rgb, al), a = cl
        if cl[0] is not caps[-1]: out = out * (1 - grad * a)
        out = out * (1 - al * a) + rgb * al * a
    fade = min(1, T / 0.7, max(0, (total - T) / 0.9))
    ff.stdin.write(np.clip(out * fade, 0, 255).astype(np.uint8).tobytes())
    if n % 150 == 0: print(f"{n}/{N}", flush=True)
ff.stdin.close(); ff.wait()
print("done", total)
