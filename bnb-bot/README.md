# Gene's AI (BNB Discord bot)

Talks like Gene, welcomes every new member, and answers questions in any channel. When someone asks a real question and nobody answers within about a minute, it replies. It always replies when it's @mentioned or replied to. It says it's Gene's AI (never Gene himself) and never gives trade signals.

- `knowledge.md`: facts about BNBProfits it can use.
- `voice.md`: paste Gene's real messages here so it sounds like him.

## 1. Claude API key (2 minutes)
1. Go to https://console.anthropic.com and sign up.
2. Billing: add a card, then set a **monthly spend limit** (for example $30).
3. API Keys › Create Key. Copy it somewhere safe; you only see it once.

## 2. Create the Discord bot (5 minutes)
1. https://discord.com/developers/applications › **New Application** › name it `Gene's AI` › add the BNB logo.
2. **Bot** tab: click **Reset Token** and copy it (that's your bot token). Turn ON **Server Members Intent** and **Message Content Intent**. Save.
3. **OAuth2 › URL Generator**: tick `bot`, then tick **View Channels**, **Send Messages**, **Read Message History**. Open the link at the bottom and add it to your server.
4. In Discord: User Settings › Advanced › turn on **Developer Mode**. Then right-click and **Copy ID** on: your welcome channel, yourself (for OWNER_ID), and any channel it should stay out of.

## 3. Run it on your computer
Install Node.js (LTS) from https://nodejs.org first.

**Mac:** open Terminal and run:
```
cd ~/Downloads/brain/bnb-bot
cp .env.example .env
open -e .env
```
Fill in `.env`, save, then:
```
npm install
caffeinate -i npm start
```
(`caffeinate` keeps the Mac awake while the bot runs.)

**Windows:** open the `bnb-bot` folder, copy `.env.example`, rename the copy to `.env`, open it in Notepad and fill it in. Then in that folder, click the address bar, type `cmd`, press Enter and run:
```
npm install
npm start
```
Set Settings › System › Power › Sleep to **Never** while plugged in.

You'll see `greeter: online as Gene's AI#1234`. Leave that window open. Closing it turns the bot off.

## Cost
- Checking every message to see if it's a question: pennies a day.
- Real answers: roughly $15–30 a month at about 100 a day. Your spend limit caps it.
- Built-in limits: 1 question per person every 12 seconds, 30 per person per day, 150 per hour total.
