# W-2 Helper: Session Log

Newest entries at the top. Back to [[W-2 Helper]].

---
## 2026-10-24 (night): Fill works on E Tax ✅
**Did:** Fixed the last issues (big dollar amounts with commas, employer name being cleared by E Tax after the EIN). v0.2.2: every box filled on a practice return.
**Next:** API key, AI-read test, answers on code II and QUAL OT, then the office install.

## 2026-10-24 (late): Switched Fill to a Chrome add-on
**Did:** First real test: Tab typing put values in the wrong boxes (E Tax dropdowns ignore typing, so everything shifted). Used a Claude-in-Chrome page check to get every box's id. Built a Chrome add-on that fills each box by id, picks dropdown choices, and handles box 12/14 rows. Tested end to end on a stand-in page. v0.2.0.
**Next:** Install the add-on (Developer mode → Load unpacked), test on a practice return.

## 2026-10-24 (night): Box order set from the numbering test
**Did:** Set Fill's order from the numbering test. Box 12 rows are only typed when used. Box 13 (checkboxes) and box 14 (dropdown) can't be reached with Tab, so the app lists them under "Do by hand" with the values. Added a reminder for code II W-2s.
**Next:** Practice-return test of Fill. Answers on code II and QUAL OT.

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
