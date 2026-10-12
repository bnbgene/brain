"""Assemble the Content HQ artifact page from its source, the Story Maker's
canvas engine and the brand images. Usage: python3 tools/build-hq.py OUT.html"""
import base64, sys, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
src = (root / 'tools/content-hq.src.html').read_text()
story = (root / 'tools/story-generator.src.html').read_text()
engine = story[story.index('  // ---------- images'):story.index('  // ---------- controls')]
def data_uri(p): return 'data:image/webp;base64,' + base64.b64encode((root / p).read_bytes()).decode()
out = (src.replace('/*__ENGINE__*/', engine)
          .replace('__LOGO__', data_uri('bnbprofits/img/logo.webp'))
          .replace('__PNL__', data_uri('bnbprofits/img/pnl-4520.webp')))
pathlib.Path(sys.argv[1]).write_text(out)
print('wrote', sys.argv[1], len(out), 'bytes')
