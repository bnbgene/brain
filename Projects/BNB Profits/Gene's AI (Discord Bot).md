# Gene's AI (Discord bot)

**Project:** [[BNB Profits]]
**Code:** `bnb-bot/` on the BNB Profits branch (setup guide in its README)

## What it does
- Welcomes new members and answers questions in any open channel, in Gene's voice and slang.
- Waits ~30 seconds for a human to answer first; always replies when @mentioned or replied to.
- Says it's Gene's AI (never Gene himself). Never gives trade signals.
- `voice.md` holds real lines from Gene's Discord messages; `knowledge.md` holds BNBProfits facts.

## Cost
About $15–30/month at ~100 answers a day (Claude API, with a monthly spend limit). Built-in rate limits per person and per hour.

## Commands
- `!bias`: post the daily bias · `!nolive`: not going live today · `!help`: list commands

## Changes
- 2026-11-13 (later): Daily bias and live ping now run as built-in scheduled jobs (no AI); added `!bias`, `!nolive`, `!help`.
- 2026-11-13: Replies after 30s (was 75s); talks in Gene's slang; answers when Gene @mentions or replies.
- 2026-11-12: Built, with voice file and simple setup guide.
