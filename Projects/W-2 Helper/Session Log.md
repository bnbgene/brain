# W-2 Helper: Session Log

Newest entries at the top. Back to [[W-2 Helper]].

---
## 2026-10-24 (evening): Saw the real W-2 screen
**Did:** Screenshots showed the office enters W-2s on a website (E Tax, etax.cloudtaxoffice.com) in Chrome. Added a draft box order for it: employer info + boxes 1–11; employee info is already filled in so it's skipped. State boxes are dropdowns, so it types "Arizona" not "AZ".
**Next:** Numbering test on a practice return to confirm the order, then add boxes 12–20.

## 2026-10-24 (later): First sample W-2
**Did:** Tested with the first sample photo (caregiver W-2, 4 copies on a page). Math checks pass. Taught the AI that box 12 code "II" looks like "||", and that box 1 = $0 is normal with it. Fill now leaves $0.00 boxes blank. Sample not saved anywhere.
**Next:** Live AI test once the office has an API key.

## 2026-10-24: First version of the app built
**Did:** Built the Windows app in the private `w2-helper` repo: AI reads the W-2 (PDF or photo), check screen like the demo with math checks, Fill types into TaxSlayer with Tab, watches the save folder, per-office settings and API key, one-click installer built on GitHub. Wrote setup and security (WISP) guides.
**Decided:** Claude Opus 5.5 via the API (~5–10¢/W-2). Only last 4 of SSN by default. Box order per tax software lives in a settings file.
**Next:** Get the TaxSlayer W-2 screen screenshot, a fake/blacked-out sample W-2, and the office's API key. Then fix the box order and test on a practice return.
