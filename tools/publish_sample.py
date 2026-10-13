#!/usr/bin/env python3
"""Publish an approved draft: move drafts/<slug>/ to samples/<slug>/ and build it.

Only run this after the owner has looked at the preview and said it's good.
Usage:  python3 tools/publish_sample.py <slug>
Then commit and push once; Netlify serves it at <samplesBase>/<slug>/.
To change a sample that is already live, edit samples/<slug>/concept.html
directly (or move it back to drafts/ while it's being reworked).
"""
import pathlib, shutil, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
if len(sys.argv) != 2:
    sys.exit(__doc__)
slug = sys.argv[1].strip("/")
src, dst = ROOT / "drafts" / slug, ROOT / "samples" / slug
if not (src / "concept.html").is_file():
    sys.exit(f"no draft at {src}/concept.html")
if dst.exists():
    shutil.rmtree(dst)  # replacing an older published version of the same sample
shutil.move(str(src), str(dst))
subprocess.run([sys.executable, str(ROOT / "tools" / "build_samples.py")], check=True)
print(f"ready to push: samples/{slug}/")
