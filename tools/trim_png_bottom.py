#!/usr/bin/env python3
"""Cut N rows off the bottom of 8-bit, non-interlaced PNGs (headless Chrome screenshots).
Scanline filters only look at rows above, so the kept rows decode unchanged.
Usage: python3 tools/trim_png_bottom.py ROWS file.png [file.png ...]"""
import struct, sys, zlib

def chunks(data):
    i = 8
    while i < len(data):
        n = struct.unpack(">I", data[i:i+4])[0]
        yield data[i+4:i+8], data[i+8:i+8+n]
        i += 12 + n

def chunk(t, body):
    return struct.pack(">I", len(body)) + t + body + struct.pack(">I", zlib.crc32(t + body) & 0xffffffff)

def trim(path, rows):
    data = open(path, "rb").read()
    parts = list(chunks(data))
    ihdr = parts[0][1]
    w, h, depth, ctype, _, _, interlace = struct.unpack(">IIBBBBB", ihdr)
    assert depth == 8 and interlace == 0 and ctype in (2, 6), (path, depth, ctype, interlace)
    bpp = 4 if ctype == 6 else 3
    raw = zlib.decompress(b"".join(b for t, b in parts if t == b"IDAT"))
    keep = h - rows
    raw = raw[: keep * (1 + w * bpp)]
    out = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, keep, depth, ctype, 0, 0, 0))
    out += chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")
    open(path, "wb").write(out)
    print(path, w, "x", keep)

rows = int(sys.argv[1])
for p in sys.argv[2:]:
    trim(p, rows)
