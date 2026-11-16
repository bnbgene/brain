// Make a looping 12-second "work footage" hero clip from 4 photos (slow push-ins + crossfades, seamless loop).
// Usage: node tools/make_hero_video.mjs <out_dir> <photo1> <photo2> <photo3> <photo4>
//   photos can be URLs (Unsplash/Pexels) or local paths. Writes hero.mp4 (1600x900), hero-sm.mp4 (960x540), poster.jpg.
// Needs ffmpeg + Playwright (both preinstalled in cloud sessions). Label the result "Example footage" unless it's the client's photos.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';

const [out, ...photos] = process.argv.slice(2);
if (!out || photos.length !== 4) { console.error('usage: node tools/make_hero_video.mjs <out_dir> <p1> <p2> <p3> <p4>'); process.exit(1); }
const src = p => /^https?:/.test(p) ? p : 'file://' + resolve(p);
const work = join(tmpdir(), 'herovid-' + Date.now()); mkdirSync(join(work, 'f'), { recursive: true }); mkdirSync(out, { recursive: true });
const imgs = photos.map((p, i) => `<img id="i${i}" src="${src(p)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:${i ? 0 : 1}">`).join('');
writeFileSync(join(work, 'v.html'), `<body style="margin:0;background:#000;overflow:hidden"><div style="position:relative;width:1600px;height:900px;overflow:hidden">${imgs}</div><script>
const cl=x=>Math.max(0,Math.min(1,x)),seg=(t,a,b)=>cl((t-a)/(b-a)),el=[0,1,2,3].map(i=>document.getElementById('i'+i).style);
window.set=t=>{const s=[[0,.3],[.22,.55],[.47,.8],[.72,1]],o=['46% 30%','30% 55%','55% 30%','50% 40%'];
 s.forEach(([a,b],i)=>{const p=seg(t,a,b);el[i].transformOrigin=o[i];el[i].transform='scale('+(i%2?1.04+p*.12:1.14-p*.12)+')';if(i)el[i].opacity=seg(t,a,a+.05)});
 if(t>.95){const f=seg(t,.95,1);el[1].opacity=0;el[2].opacity=0;el[3].opacity=1-f;el[0].transform='scale(1.14)'}};set(0);</script>`);
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1600, height: 900 } });
await pg.goto('file://' + join(work, 'v.html')); await pg.waitForLoadState('networkidle'); await pg.waitForTimeout(2000);
const N = 288;
for (let i = 0; i < N; i++) { await pg.evaluate(t => set(t), i / N); await pg.screenshot({ path: join(work, 'f', String(i).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 85 }); }
await b.close();
const ff = a => execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...a]);
ff(['-framerate', '24', '-i', join(work, 'f/%04d.jpg'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '31', '-preset', 'slow', '-movflags', '+faststart', '-an', join(out, 'hero.mp4')]);
ff(['-framerate', '24', '-i', join(work, 'f/%04d.jpg'), '-vf', 'scale=960:540', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '28', '-movflags', '+faststart', '-an', join(out, 'hero-sm.mp4')]);
ff(['-i', join(work, 'f/0000.jpg'), '-q:v', '5', join(out, 'poster.jpg')]);
rmSync(work, { recursive: true, force: true });
console.log('wrote', out + '/hero.mp4, hero-sm.mp4, poster.jpg');
