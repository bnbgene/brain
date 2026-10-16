# How This Works

## The big idea
Each Claude chat or cloud session starts out **knowing nothing** about your other sessions.
Your AI Characters session doesn't know what your Web Design session did.

This vault fixes that. It's **one shared notebook** that every session can read and write.
- The notebook lives on **GitHub** (repo `bnbgene/brain`), so every cloud session can reach it.
- **Obsidian** shows you the same notebook on your computer or phone, nicely formatted.

```
 AI Characters session ─┐
 BNB Profits session   ─┼──►  GitHub: bnbgene/brain  ◄──►  Obsidian (you)
 Web Design session    ─┘        (the shared brain)
```

## What you say to Claude
**At the start of a session** (in any of your 3 sessions):
> Add the repo bnbgene/brain and read CLAUDE.md and my notes for [project name].

**At the end of a session:**
> Save what we did today to my brain.

Claude writes a short log entry, updates the project's status and next steps, and pushes it to GitHub.

**Anytime:**
> What's the status of all my projects?
> What did we decide about X?

## Setting up Obsidian on your side (one time)
1. Download Obsidian from obsidian.md (free).
2. Get this repo onto your computer. The easiest way is **GitHub Desktop** (desktop.github.com): sign in, then *Clone* `bnbgene/brain`.
3. In Obsidian: **Open folder as vault** → pick the `brain` folder.
4. Optional, keeps it synced automatically: Settings → Community plugins → Browse → install **Obsidian Git** → enable it. It pulls Claude's updates and pushes your edits.
   Without it, press *Fetch/Pull* in GitHub Desktop to get Claude's latest notes.

## Words you'll hear
- **Vault**: the folder of notes.
- **Repo (repository)**: a folder stored on GitHub with its full history.
- **Commit / push**: save a snapshot / upload it to GitHub.
- **Pull**: download the latest version.
- **Branch**: a separate draft copy of the repo. Claude often works on a branch; merging it puts the changes into the main copy.
- **`CLAUDE.md`**: a standing instructions file Claude reads automatically.
