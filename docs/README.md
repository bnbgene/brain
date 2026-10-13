# Sample sites (GitHub Pages)

Free hosting for BNB sample sites. docs/<slug>/index.html is served at
https://bnbgene.github.io/brain/<slug>/ about a minute after a push.
Build a new one with: python3 tools/publish_sample.py <slug> --github
Rebuild after editing a concept.html: python3 tools/build_samples.py --root docs
samples/ is the older Netlify site; changing it costs Netlify credits.
