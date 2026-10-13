#!/usr/bin/env python3
"""Publish an approved draft: move drafts/<slug>/ to samples/<slug>/ and build it.

Only run this after the owner has looked at the preview and said it's good.
Usage:  python3 tools/publish_sample.py <slug>            -> samples/ (Netlify)
        python3 tools/publish_sample.py <slug> --github   -> docs/ (GitHub Pages, free)
Then commit and push once. Netlify serves samples/<slug>/ at https://bnb-samples.netlify.app/<slug>/;
GitHub Pages serves docs/<slug>/ at https://bnbgene.github.io/brain/<slug>/.
To change a sample that is already live, edit samples/<slug>/concept.html
directly (or move it back to drafts/ while it's being reworked).
"""
import pathlib, shutil, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
args = [a for a in sys.argv[1:] if a != "--github"]
github = "--github" in sys.argv[1:]
if len(args) != 1:
    sys.exit(__doc__)
slug = args[0].strip("/")
src = ROOT / "drafts" / slug
dst = ROOT / ("docs" if github else "samples") / slug
if not (src / "concept.html").is_file():
    sys.exit(f"no draft at {src}/concept.html")
if dst.exists():
    shutil.rmtree(dst)  # replacing an older published version of the same sample
shutil.move(str(src), str(dst))
subprocess.run([sys.executable, str(ROOT / "tools" / "build_samples.py")]
               + (["--root", "docs"] if github else []), check=True)
print(f"ready to push: {dst.relative_to(ROOT)}/")
