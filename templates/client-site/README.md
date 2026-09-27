# Client site security template

Every client site starts from this folder. Copy these files next to the
client's `index.html` before it goes live.

| File | What it does |
|---|---|
| `netlify.toml` | Security headers (HTTPS-only, no framing, trusted sources only) and caching |
| `quote-form.html` | Spam-protected quote form using Netlify Forms. Paste into the page |
| `thanks.html` | Page visitors see after sending the form |
| `privacy.html` | Plain privacy policy to fill in |
| `404.html` | Friendly "page not found" page |
| `robots.txt` | Tells Google what to index |

Replace every `[BRACKET]` placeholder before launch.

## Launch security checklist

This is the "Security checked" step in the Lead Desk client setup.

1. **Padlock:** the site loads on `https://` and `http://` redirects to it (Netlify: Domain management > HTTPS).
2. **Security grade:** run the domain through https://securityheaders.com and get an A.
3. **Form:** send a test quote and check it reaches the client. Turn on Netlify's spam filter and the email notification.
4. **Domain:** registered in the client's name, with auto-renew ON, registrar (transfer) lock ON, and WHOIS privacy ON.
5. **Uptime monitor:** add the site to a free monitor such as UptimeRobot, with alerts to your phone or email.
6. **Accounts:** two-step login ON for GitHub, Netlify, the domain registrar, Google and your email. Clients add you as a user; never take their passwords.
7. **Analytics (if used):** its domains added to the Content-Security-Policy in `netlify.toml`, the privacy page updated, and a cookie banner for Google Analytics when the client is in Europe or the UK.
