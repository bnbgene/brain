# How This Works

## The big idea
Each Claude chat **can't see your other chats**. Your AI Characters chat doesn't know what your Web Design chat did.

This vault is **one notebook that sums up all of them**, so you (and Claude) can see everything in one place.

```
 AI CHARACTERS chat ─┐
 BNB PROFITS chat   ─┼──►  "Obsidian integration overview" chat  ──►  your notes (this vault)
 WEBSITE DESIGN chat ─┘     reads all 3 and updates the notes          view them in Obsidian
```

## What you actually do
1. **Keep working in your 3 chats exactly like you do now.** Nothing to change there.
2. Whenever you want your notes caught up, go to the **"Obsidian integration overview"** chat and say:
   > **Update my brain.**
3. Open Obsidian to see where everything stands.

Other things you can ask there:
- "What's the status of all my projects?"
- "What do I need to do this week?"
- "What did we decide about the Discord?"

## Setting up Obsidian on your computer (one time, about 10 minutes)
1. Download **Obsidian** from obsidian.md (free).
2. Download **GitHub Desktop** from desktop.github.com (free) and sign in with your GitHub account.
3. In GitHub Desktop: **File → Clone repository** → pick `bnbgene/brain` → Clone.
4. In Obsidian: **Open folder as vault** → pick that `brain` folder.
5. To get the newest notes later: in GitHub Desktop, click **Fetch origin**, then **Pull**.
   (Optional, automatic: in Obsidian, Settings → Community plugins → Browse → **Obsidian Git** → Install → Enable.)

On your phone: install the Obsidian app. Syncing a phone takes more setup, so just ask Claude when you want it.

## Words you'll hear
- **Vault**: the folder of notes.
- **Repo**: a folder stored on GitHub with its full history.
- **Branch**: a separate copy of the repo. Each of your chats works on its own branch so they don't step on each other.
- **Commit / push / pull**: save a snapshot / upload it / download the latest.
- **`CLAUDE.md`**: a standing instructions file Claude reads automatically.

## Starting a new chat about something new
Just start it. The next brain update (every morning, or when you say "update my brain") finds it, gives it its own project page, and adds it to Home.
- Tip: give the chat a clear name (like "AI CHARACTERS") so its project page gets a good name.
- Only **Claude Code** chats (the ones that work on your `brain` repo, like your other three) can be seen. Regular claude.ai chats can't be read, so for one of those, paste a summary into this chat or into `00 Inbox/`.
