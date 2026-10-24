# W-2 Helper App

**Project:** [[W-2 Helper]]
**Open it:** Windows installer `W2Helper-Setup.exe` is built automatically in the private repo `bnbgene/w2-helper` (GitHub → Actions → latest "Build Windows installer" run → Artifacts). Setup steps: `docs/SETUP.md` in the repo.
**Demo of the flow:** https://claude.ai/artifact/WdWrcdWsuvSeFwS3pRwfCX

## What it does
1. Drag in the W-2 PDF/photo (or it spots new files in the TaxesToGo save folder).
2. **Read with AI**: every box, plus a list of boxes AI wasn't sure about (shown yellow).
3. **Check**: values next to the W-2, with math checks (box 4 ≈ 6.2% of box 3, box 6 ≈ 1.45% of box 5).
4. Click in TaxSlayer's first W-2 box, then **Fill**: it types each box and presses Tab. Esc stops it.
5. **Next W-2** forgets everything (and can delete the file).

## Good to know
- ⚠️ TaxSlayer's box order is a **draft** until we see a screenshot. Practice returns only until then.
- Cost: about 5–10¢ per W-2, paid by the office's own Anthropic account.
- Windows may warn "protected your PC" on install (not code-signed yet): More info → Run anyway.

## Changes
- 2026-10-24 (later): Handles caregiver W-2s (box 12 code II, box 1 = $0); $0.00 boxes left blank on Fill.
- 2026-10-24: v0.1.0 built: read, check screen, Fill, folder watching, settings, installer.
