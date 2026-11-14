# BNB Profits

**Status:** 🟢 Agent Farm + 9 auto-posting agents + Gene's AI bot running; Discord cleaned up (2026-11-13).
**Chat:** "BNB PROFITS" · **Files live on branch:** `claude/vigilant-ritchie-sli5xu`
**Log:** [[BNB Profits/Session Log|Session Log]]

## What it is
Gene (@bnbgene) trades NQ futures full time. BNBProfits is the trading brand:
- **Free Discord:** daily bias + weekly live calls
- **1:1 mentorship:** people apply on the site. Price and strategy are kept off the site on purpose.
- Proof on the site: prop firm payouts (Lucid, Topstep, Tradeify), P&L screenshots, student wins

## Tools Claude built
- [[Agent Farm]] · [[Gene's AI (Discord Bot)]] · [[Discord Server]]
- [[BNBProfits Website]] · [[Content HQ]] · [[Story Maker]]

| Tool | What it does | Link |
|---|---|---|
| **BNBProfits Live Site** | The website (hosted on Netlify from `bnbprofits/`) | [open](https://claude.ai/artifact/17qXa2HNwCycWZtHUWNKHn) |
| **BNB Content HQ** | Daily posting command center: word-for-word scripts, story rollouts, Discord tab, idea packs | [open](https://claude.ai/artifact/MFYH3z5hz7LhRdxY8rzKMr) |
| **BNB Story Maker** | Makes 4-frame Instagram story rollouts | [open](https://claude.ai/artifact/VKxyiBpS5CsZAw5C3BXNHA) |
| Site Preview | Older preview of the site | [open](https://claude.ai/artifact/N9iHmaar3Xfn3uNrymq7KX) |

## Key Decisions
- 2026-11-12: Built the Agent Farm as the daily command center; agents auto-post to Discord. Live times in MST. Removed Tradeify code/affiliate copy.
- 2026-11-13: Cleaned up the Discord layout (backup saved). Gene's AI bot answers after 30s.
- 2026-10-06: Hide the strategy and the mentorship price on the site.
- 2026-10-12: Site points to the **free** Discord. Content = one-take talking-head scripts only.
- 2026-10-15: 1:1 applications post straight into Discord (Netlify function). The Discord webhook setting needs a Netlify redeploy to take effect.
- 2026-10-16: Added 24 controversial, relatable and business video ideas. Morning routine mixes in non-trading takes.

## Next Steps
- [ ] Monday 6:45 AM MST: check the first automatic daily bias post went out (Friday's didn't)
- [ ] Set your payout goal number (Payouts tab) and tap "Match my real balance" on the TPT card
- [ ] Text your leads: **Damond and Tai** applied and are waiting
- [ ] Update IG/TikTok bios with the new Discord link (https://discord.gg/AfcS4MHA6U)
- [ ] Decide: News Desk 10 checks/day or trim to 5 (saves Claude usage)
- [ ] Install the farm as an app (see [[Agent Farm]])
- [ ] Confirm 1:1 applications are arriving in Discord (redeploy on Netlify if not)
- [ ] Post daily from Content HQ
- [ ] Send Damond the 1:1 mentorship text (drafted in the BNB PROFITS chat); follow up with price + payment link if he's ready

## Links
- Site: https://bnbprofits.netlify.app
- Farm: https://claude.ai/artifact/3fsux837tHKNAtZedkY33V
- Discord: https://discord.gg/AfcS4MHA6U

## Files
- [Website source](https://github.com/bnbgene/brain/blob/claude/vigilant-ritchie-sli5xu/bnbprofits/index.html)
- [Content HQ source](https://github.com/bnbgene/brain/blob/claude/vigilant-ritchie-sli5xu/tools/content-hq.src.html)
- [Story Maker source](https://github.com/bnbgene/brain/blob/claude/vigilant-ritchie-sli5xu/tools/story-generator.src.html)
