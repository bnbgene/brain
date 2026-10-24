# W-2 Helper (sister's tax office)

**Status:** 🟡 First Windows app built (v0.1.0). Waiting on TaxSlayer screenshot, sample W-2 and API key before real use.
**Chat:** "Build W-2 Helper for sister's tax office" · **Code:** private repo `bnbgene/w2-helper` (branch `claude/sleepy-sagan-rw8tbu`)
**Log:** [[W-2 Helper/Session Log|Session Log]]

## Goal
Clients send W-2 photos through **TaxesToGo**, but TaxSlayer Pro doesn't fill in the numbers, so preparers type every box. W-2 Helper reads the W-2 with AI, shows the numbers to check, and types them into TaxSlayer Pro's W-2 screen with one click. One office first, built so more offices can use it later.

## Tools
- [[W-2 Helper App]]: the Windows app (installer, how it works, recent changes)
- Web demo: https://claude.ai/artifact/WdWrcdWsuvSeFwS3pRwfCX

## Key Decisions
- 2026-10-24: Windows desktop app next to TaxSlayer Pro Desktop. Clients keep using TaxesToGo.
- 2026-10-24: AI = Claude API (Claude Opus 5.5). About 5–10¢ per W-2. Each office uses its own Anthropic account and key.
- 2026-10-24: Fill types like a person (Tab between boxes). No TaxSlayer/TaxesToGo logins.
- 2026-10-24: The office's W-2 screen is a website (E Tax, etax.cloudtaxoffice.com), not TaxSlayer Pro Desktop. Fill works there too (types into Chrome).
- 2026-10-24: Box order per tax software is a settings file (TaxSlayer Pro first, Drake etc. later).
- 2026-10-24: Privacy: nothing saved, only last 4 of SSN read by default, no client info in logs, key in Windows Credential Manager.
- 2026-10-24: Code lives in a private repo, never public. Real sample W-2s are never saved in the repo.

## Next Steps
- [x] Screenshots of the office's W-2 screen (2026-10-24): it's the **E Tax web app** (etax.cloudtaxoffice.com) in Chrome
- [ ] Numbering test on a practice return (type 1, Tab, 2, Tab…) and screenshot, to confirm the box order
- [ ] Ask: is this website what the office uses for every client?
- [x] Sample W-2 photo received 2026-10-24 (caregiver W-2, 4 copies on one page, box 12 code II, box 1 = $0)
- [ ] Office: make an Anthropic account at console.anthropic.com, add ~$20 credit, create an API key
- [ ] Fix TaxSlayer box order from the screenshot, test on a practice return
- [ ] Install on the office PC (see setup guide in the repo: `docs/SETUP.md`)
- [ ] Add the app to the office's security plan (WISP) using `docs/SECURITY.md`
- [ ] Pilot Jan–April; track minutes saved and mistakes caught
