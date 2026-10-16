# Instructions for Claude

This repo is an Obsidian vault: the owner's "second brain." Read this file first, then `Home.md`.
The owner is not technical. Keep replies short, plain-English, and do the work for them.

## Projects and where their work lives
Each project has its own Claude chat, which usually works on its own git branch of this repo. New chats get added to this table automatically during "Update my brain".
The vault notes live on the default branch.

| Project | Main note | Chat title | Branch with the project's files |
|---|---|---|---|
| AI Characters | `Projects/AI Characters/AI Characters.md` | AI CHARACTERS | `claude/confident-johnson-dpw2es` (`ai-influencer/`) |
| BNB Profits | `Projects/BNB Profits/BNB Profits.md` | BNB PROFITS | `claude/vigilant-ritchie-sli5xu` |
| Listing Videos | `Projects/Listing Videos/Listing Videos.md` | (brain chat) | `tools/listing-video/` on `claude/charming-cori-om30sj` |
| Web Design | `Projects/Web Design/Web Design.md` | WEBSITE DESIGN | `claude/clever-shannon-qbaqz7` (also serves GitHub Pages from `docs/`) |

Do NOT merge those project branches into the vault branch. They hold live sites (Netlify, GitHub Pages). Only read them.

## "Update my brain"
When the owner says this (or "sync", "save to brain"):
1. List ALL the owner's cloud chats (`list_sessions`, mine), not just the ones in the table. Skip this brain chat.
   - A chat that isn't in the table yet is a **new project**: create `Projects/<Name>/` with a main note (from `Templates/Project.md`) and a `Session Log.md`, and add it to the table above and to `Home.md`. If it's clearly part of an existing project, file it there instead. Skip tiny one-off chats (a single quick question).
2. For each project chat with activity since its last Session Log entry, read its recent transcript and `git fetch` its branch for new commits.
3. For each project: add a dated entry at the top of `Session Log.md`, update **Status**, **Key Decisions**, **Next Steps** and links in the main note, and update the table in `Home.md`.
4. Sort anything in `00 Inbox/` into the right project.
5. Commit and push. Tell the owner in 2–4 lines what changed.

## When working inside a project chat
If you're one of the project chats and the owner says "save to brain": write a dated summary to `00 Inbox/<Project> <date>.md` on your branch and tell the owner to say "update my brain" in the brain chat. That chat will file it.

## Style for notes
- Short and scannable: headings, bullets, checkboxes.
- Link related notes with `[[Note Name]]`.
- Never delete the owner's notes. If something is outdated, mark it outdated.
