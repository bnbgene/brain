#!/usr/bin/env python3
"""Turn every samples/<slug>/concept.html into samples/<slug>/index.html.

Netlify publishes the samples/ folder, so samples/freestyllez/index.html is
served at https://<site>.netlify.app/freestyllez/. Each page gets a full
<head> and a noindex tag so search engines never list a concept site.
Run it after adding or editing any concept.html:  python3 tools/build_samples.py
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent / "samples"
HEAD = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
        '<meta name="robots" content="noindex,nofollow">\n<style>body{margin:0}</style>\n')

def build(concept: pathlib.Path) -> None:
    src = concept.read_text(encoding="utf-8")
    if "Not their official site" not in src:
        sys.exit(f"{concept}: missing the concept banner, refusing to publish")
    m = re.search(r"</style>", src)
    head, body = (src[: m.end()], src[m.end():]) if m else ("", src)
    out = HEAD + head.strip() + "\n</head>\n<body>\n" + body.strip() + "\n</body>\n</html>\n"
    (concept.parent / "index.html").write_text(out, encoding="utf-8")
    print("built", concept.parent.name)

for c in sorted(ROOT.glob("*/concept.html")):
    build(c)
