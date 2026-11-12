# BNB Greeter (24/7 Discord bot)

Welcomes every new member and answers questions in `#ask-gene` (or anywhere it's @mentioned), around the clock. It talks like you, says it's the BNB bot (never pretends to be you), and never gives signals or financial advice. What it knows lives in `knowledge.md`, so edit that file to change its answers.

## 1. Create the bot in Discord (5 minutes)
1. Go to https://discord.com/developers/applications and click **New Application**. Name it `BNB Desk` and give it the logo.
2. In **Bot**: click **Reset Token**, copy it, and keep it private. That's your `DISCORD_TOKEN`.
3. Still in **Bot**, turn on **Server Members Intent** and **Message Content Intent**.
4. In **OAuth2 › URL Generator**: tick `bot`, then the permissions **View Channels**, **Send Messages**, **Read Message History**. Open the URL it makes and add the bot to your server.
5. In Discord, turn on Developer Mode (User Settings › Advanced), then right-click your welcome channel and `#ask-gene` › **Copy Channel ID**.

## 2. Get a Claude API key
Create one at https://console.anthropic.com and add a little credit. That's `ANTHROPIC_API_KEY`.

## 3. Put it on an always-on host
Any host that keeps a Node app running works. Railway is the easiest:
1. New Project › Deploy from GitHub repo › pick this repo, set the **root directory** to `bnb-bot`.
2. Add the variables: `DISCORD_TOKEN`, `ANTHROPIC_API_KEY`, `WELCOME_CHANNEL_ID`, `ASK_CHANNEL_ID`.
3. Deploy. The logs should say `greeter: online as BNB Desk#1234`.

Netlify can't run this one: a Discord bot has to stay connected all the time, and Netlify functions only run for a few seconds.

## Cost
- Hosting: about $5 a month.
- Claude: it uses Claude Opus 5.5 at low effort. A typical answer costs around one cent, so 100 answers a day is roughly $30 a month. Set `MODEL=claude-haiku-5-5` to make it much cheaper (simpler answers).
- Built-in limits: one question per person every 15 seconds, 25 per person per day, 120 per hour total.

## Run it on your computer (optional)
```
cd bnb-bot
npm install
DISCORD_TOKEN=... ANTHROPIC_API_KEY=... WELCOME_CHANNEL_ID=... ASK_CHANNEL_ID=... npm start
```
