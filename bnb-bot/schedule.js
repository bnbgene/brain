// Scheduled posts that need no AI (so they cost nothing and don't depend on Claude's scheduler):
//  - Daily bias post with a real NQ chart, 45 minutes before the NY open (8:45 AM ET)
//  - "🔴 Live in 10." 10 minutes before the open (9:20 AM ET)
// Gene can type in any channel:
//   !bias <text>   use his own bias/levels in today's post (e.g. "!bias bearish rn, watching 28,950")
//   !nolive        skip today's "Live in 10"
//   !live          undo !nolive
// Both commands are deleted after they're read so the chat stays clean.

import { createCanvas } from '@napi-rs/canvas';
import { AttachmentBuilder } from 'discord.js';

const PREMARKET_CHANNEL = process.env.PREMARKET_CHANNEL_ID || '1557594194594369596';
const OWNER_ID = process.env.OWNER_ID || '';
const UA = { 'User-Agent': 'Mozilla/5.0 (BNB Desk)' };

// NYSE full-day closures (ET dates).
const HOLIDAYS = new Set(['2026-11-26', '2026-12-25', '2027-01-01', '2027-01-18', '2027-02-15', '2027-03-26', '2027-05-31', '2027-06-18', '2027-07-05', '2027-09-06', '2027-11-25', '2027-12-24']);

function partsIn(tz, d = new Date()) {
  const o = {};
  new Intl.DateTimeFormat('en-US', { timeZone: tz, hour12: false, weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    .formatToParts(d).forEach((p) => { o[p.type] = p.value; });
  return { date: `${o.year}-${o.month}-${o.day}`, dow: o.weekday, min: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
}
const isTradingDay = (et) => !['Sat', 'Sun'].includes(et.dow) && !HOLIDAYS.has(et.date);
function mstOpen() { // 9:30 ET in Arizona time, e.g. "7:30 AM MST"
  const ny = partsIn('America/New_York'), az = partsIn('America/Phoenix');
  const diff = ((ny.min - az.min) % 1440 + 1440) % 1440, m = 570 - diff, h = Math.floor(m / 60);
  return `${((h % 12) || 12)}:${String(m % 60).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'} MST`;
}
const fmt = (x) => x.toLocaleString('en-US', { maximumFractionDigits: 2 });

// ---------- state for today (resets each day) ----------
const today = { date: '', bias: '', nolive: false, sent: {} };
function rollDay(et) { if (today.date !== et.date) Object.assign(today, { date: et.date, bias: '', nolive: false, sent: {} }); }

// ---------- data ----------
async function nqBars() {
  const r = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/NQ=F?interval=5m&range=5d', { headers: UA });
  const d = (await r.json()).chart.result[0], q = d.indicators.quote[0];
  return d.timestamp.map((t, i) => ({ t: t * 1000, o: q.open[i], h: q.high[i], l: q.low[i], c: q.close[i] })).filter((b) => b.o != null && b.c != null);
}
async function todaysNews(etDate) {
  try {
    const r = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.json', { headers: UA });
    const list = await r.json();
    return list.filter((e) => e.country === 'USD' && (e.impact === 'High' || e.impact === 'Medium'))
      .map((e) => ({ d: new Date(e.date), title: e.title, high: e.impact === 'High' }))
      .filter((e) => partsIn('America/New_York', e.d).date === etDate)
      .map((e) => `${e.d.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' })} ET ${e.title}${e.high ? ' 🚨' : ''}`);
  } catch { return null; }
}
function levels(bars, etDate) {
  const et = (b) => partsIn('America/New_York', new Date(b.t));
  const rth = (b) => { const p = et(b); return p.min >= 570 && p.min < 960; };
  const days = [...new Set(bars.map((b) => et(b).date))].filter((d) => d < etDate).sort();
  const prevDay = days.filter((d) => bars.some((b) => et(b).date === d && rth(b))).pop();
  const prev = bars.filter((b) => et(b).date === prevDay && rth(b));
  const startON = bars.findIndex((b) => et(b).date === prevDay && et(b).min >= 1080);
  const on = bars.slice(startON < 0 ? 0 : startON).filter((b) => { const p = et(b); return (p.date > prevDay || p.min >= 1080) && !(p.date === etDate && p.min >= 570); });
  const L = { PDH: Math.max(...prev.map((b) => b.h)), PDL: Math.min(...prev.map((b) => b.l)), PDC: prev[prev.length - 1].c, ONH: Math.max(...on.map((b) => b.h)), ONL: Math.min(...on.map((b) => b.l)) };
  const last = on[on.length - 1].c;
  return { L, last, chg: (last - L.PDC) / L.PDC * 100, on };
}
function overnightLine({ L, last, chg }) {
  const where = last > L.PDH ? "holding above yesterday's high" : last < L.PDL ? "trading under yesterday's low" : "chopping inside yesterday's range";
  const side = Math.abs(last - L.ONH) < Math.abs(last - L.ONL) ? 'closer to the overnight high' : 'closer to the overnight low';
  const sign = chg >= 0 ? '+' : '';
  return `NQ ${fmt(last)} (${sign}${chg.toFixed(1)}% overnight). ${where}, sitting ${side}`;
}

// ---------- chart ----------
function chartPng(bars, L, title) {
  const W = 1320, H = 660, pad = { l: 70, r: 170, t: 60, b: 50 }, g = createCanvas(W, H).getContext('2d');
  // 15-minute candles for the last ~26 hours
  const cut = bars[bars.length - 1].t - 26 * 3600e3, c15 = [];
  for (const b of bars.filter((x) => x.t >= cut)) {
    const k = Math.floor(b.t / 900e3), last = c15[c15.length - 1];
    if (last && last.k === k) { last.h = Math.max(last.h, b.h); last.l = Math.min(last.l, b.l); last.c = b.c; } else c15.push({ k, t: b.t, o: b.o, h: b.h, l: b.l, c: b.c });
  }
  const vals = c15.flatMap((b) => [b.h, b.l]).concat(Object.values(L));
  const hi = Math.max(...vals) + 15, lo = Math.min(...vals) - 15;
  const y = (v) => pad.t + (hi - v) / (hi - lo) * (H - pad.t - pad.b), bw = (W - pad.l - pad.r) / c15.length;
  g.fillStyle = '#0a0a0b'; g.fillRect(0, 0, W, H);
  g.strokeStyle = '#1b1b1e'; g.lineWidth = 1; g.font = '14px sans-serif'; g.fillStyle = '#6d6d73';
  const step = Math.pow(10, Math.floor(Math.log10((hi - lo) / 5))) * (((hi - lo) / 5) / Math.pow(10, Math.floor(Math.log10((hi - lo) / 5))) > 5 ? 5 : ((hi - lo) / 5) / Math.pow(10, Math.floor(Math.log10((hi - lo) / 5))) > 2 ? 2 : 1);
  for (let v = Math.ceil(lo / step) * step; v < hi; v += step) { g.beginPath(); g.moveTo(pad.l, y(v)); g.lineTo(W - pad.r, y(v)); g.stroke(); g.fillText(fmt(v), 8, y(v) + 5); }
  c15.forEach((b, i) => {
    const x = pad.l + i * bw + bw / 2, up = b.c >= b.o; g.strokeStyle = g.fillStyle = up ? '#3ddc84' : '#ff5a4e';
    g.beginPath(); g.moveTo(x, y(b.h)); g.lineTo(x, y(b.l)); g.stroke();
    g.fillRect(x - bw * 0.35, y(Math.max(b.o, b.c)), bw * 0.7, Math.max(1, y(Math.min(b.o, b.c)) - y(Math.max(b.o, b.c))));
  });
  const colors = { PDH: '#3ddc84', PDL: '#ff5a4e', PDC: '#a3a3a8', ONH: '#2f9bff', ONL: '#f5b84a' };
  g.setLineDash([7, 5]); g.font = 'bold 14px sans-serif';
  for (const [k, v] of Object.entries(L)) { g.strokeStyle = g.fillStyle = colors[k]; g.beginPath(); g.moveTo(pad.l, y(v)); g.lineTo(W - pad.r, y(v)); g.stroke(); g.fillText(`${k} ${fmt(v)}`, W - pad.r + 8, y(v) + 5); }
  g.setLineDash([]);
  g.fillStyle = '#f4f4f1'; g.font = 'bold 26px sans-serif'; g.fillText(title, pad.l, 40);
  g.fillStyle = '#6d6d73'; g.font = '15px sans-serif'; g.fillText('@bnbgene', W - pad.r - 60, 40);
  return g.canvas.toBuffer('image/png');
}

// ---------- posting ----------
async function hook(client, channelId) {
  const ch = await client.channels.fetch(channelId);
  const hooks = await ch.fetchWebhooks();
  return hooks.find((h) => h.name === 'BNB Desk') || ch.createWebhook({ name: 'BNB Desk' });
}
async function alreadyPosted(client, channelId, needle) {
  const ch = await client.channels.fetch(channelId), todayEt = partsIn('America/New_York').date;
  const msgs = await ch.messages.fetch({ limit: 15 });
  return [...msgs.values()].some((m) => m.content.includes(needle) && partsIn('America/New_York', m.createdAt).date === todayEt);
}
export async function postPremarket(client, { force = false } = {}) {
  const et = partsIn('America/New_York'), label = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York', weekday: 'short', month: 'numeric', day: 'numeric' }).replace(',', '');
  const head = `📊 DAILY BIAS · ${label}`;
  if (!force && await alreadyPosted(client, PREMARKET_CHANNEL, head)) return 'already posted';
  const bars = await nqBars(), lv = levels(bars, et.date), news = await todaysNews(et.date);
  const lines = [head, '', `Bias: ${today.bias || 'waiting for the open'}`, overnightLine(lv),
    `Levels: ONH ${fmt(lv.L.ONH)} · ONL ${fmt(lv.L.ONL)} · PDH ${fmt(lv.L.PDH)} · PDL ${fmt(lv.L.PDL)} · PDC ${fmt(lv.L.PDC)}`,
    `News: ${news == null ? 'check the calendar' : news.length ? news.join(' · ') : 'no major news · light data day'}`, '',
    `Live at ${mstOpen()} 🔴`, 'Not financial advice.'];
  const png = chartPng(bars, lv.L, `NQ PRE-MARKET · ${label}`);
  const w = await hook(client, PREMARKET_CHANNEL);
  await w.send({ username: 'BNB Desk', content: lines.join('\n'), files: [new AttachmentBuilder(png, { name: 'nq-premarket.png' })], allowedMentions: { parse: [] } });
  return 'posted';
}
export async function postLive(client) {
  const w = await hook(client, PREMARKET_CHANNEL);
  await w.send({ username: 'BNB Desk', content: '🔴 Live in 10.', allowedMentions: { parse: [] } });
  return 'posted';
}

// ---------- commands + clock ----------
export function handleCommand(msg) {
  if (!OWNER_ID || msg.author.id !== OWNER_ID) return false;
  const m = msg.content.trim().match(/^!(bias|nolive|live)\b\s*([\s\S]*)$/i);
  if (!m) return false;
  rollDay(partsIn('America/New_York'));
  const cmd = m[1].toLowerCase();
  if (cmd === 'bias') today.bias = m[2].trim().slice(0, 300);
  if (cmd === 'nolive') today.nolive = true;
  if (cmd === 'live') today.nolive = false;
  msg.react('👍').catch(() => {});
  setTimeout(() => msg.delete().catch(() => {}), 4000);
  return true;
}
export function startSchedule(client) {
  const tick = async () => {
    const et = partsIn('America/New_York'); rollDay(et);
    if (!isTradingDay(et)) return;
    try {
      if (!today.sent.pre && et.min >= 525 && et.min < 570) { today.sent.pre = true; console.log('schedule: premarket', await postPremarket(client)); }
      if (!today.sent.live && et.min >= 560 && et.min < 570) {
        today.sent.live = true;
        if (today.nolive) console.log('schedule: live ping skipped (!nolive)');
        else if (await alreadyPosted(client, PREMARKET_CHANNEL, 'Live in 10')) console.log('schedule: live ping already posted');
        else console.log('schedule: live', await postLive(client));
      }
    } catch (err) { console.log('schedule: failed,', err.message); }
  };
  setInterval(tick, 30_000); tick();
  console.log('schedule: daily bias 8:45 AM ET, live ping 9:20 AM ET (weekdays)');
}

// exported for local testing
export const _test = { nqBars, todaysNews, levels, overnightLine, chartPng, partsIn, mstOpen };
