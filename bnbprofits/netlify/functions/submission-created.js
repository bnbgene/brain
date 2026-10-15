// Netlify runs this automatically after every verified form submission
// (the "submission-created" event). For the 1:1 mentorship application it
// posts the answers to Discord through the webhook in DISCORD_WEBHOOK_URL,
// set under Site configuration → Environment variables (never in code).

const FIELDS = [
  ['name', 'name'],
  ['phone', 'phone'],
  ['handle', 'IG / Discord'],
  ['experience', 'trading for'],
  ['situation', 'where they are'],
  ['eval_spend', 'spent on evals'],
  ['struggles', 'what costs them money'],
  ['frustrating_moment', 'most frustrating moment'],
  ['goal_90_days', '90-day goal'],
  ['ny_open', 'can trade the NY open'],
  ['start_when', 'wants to start'],
  ['budget', 'ready to invest'],
];

const TIER_ICON = { HOT: '🔥', WARM: '🟡', COLD: '🧊', 'DISCORD FIT': '💬' };

// Strip mention syntax from applicant text so nobody can ping the server.
function clean(value, max) {
  let s = String(value == null ? '' : value).replace(/@/g, '@​').replace(/\s+/g, ' ').trim();
  if (s.length > max) s = s.slice(0, max - 1) + '…';
  return s || '–';
}

exports.handler = async (event) => {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) { console.log('discord: DISCORD_WEBHOOK_URL is not set'); return { statusCode: 200, body: 'DISCORD_WEBHOOK_URL not set' }; }

  let payload = {};
  try { payload = JSON.parse(event.body || '{}').payload || {}; } catch (e) { return { statusCode: 400, body: 'bad payload' }; }
  if (payload.form_name !== 'mentorship-application') return { statusCode: 200, body: 'not the application form' };

  const d = payload.data || {};
  const tier = String(d.lead_tier || '').toUpperCase();
  const head = (TIER_ICON[tier] ? TIER_ICON[tier] + ' **' + tier + '**' + (tier === 'HOT' ? ' @here' : '') + '\n' : '') +
    "**You've received a new submission from BNBPROFITS 1:1**";
  const lines = FIELDS.map(([key, label]) => '> **' + label + '**: ' + clean(d[key], 220));
  const notes = d.call_notes ? '\n**Call notes**\n```\n' + String(d.call_notes).replace(/`/g, "'").slice(0, 600) + '\n```' : '';

  let content = head + '\n' + lines.join('\n') + notes;
  if (content.length > 1990) content = content.slice(0, 1989) + '…';

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'New Applicant',
        content,
        allowed_mentions: { parse: tier === 'HOT' ? ['everyone'] : [] },
      }),
    });
  } catch (e) {
    console.log('discord: request failed', String(e));
    return { statusCode: 200, body: 'discord request failed' };
  }
  const detail = res.ok ? '' : (await res.text()).slice(0, 300);
  console.log('discord:', res.status, detail || 'sent');
  return { statusCode: 200, body: res.ok ? 'sent' : 'discord error ' + res.status };
};
