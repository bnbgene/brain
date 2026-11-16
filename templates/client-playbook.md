# CONTEXT FOR CLAUDE — Local Business Website Playbook

You're helping me run a web design business for local businesses. Read this whole thing so you get the system. Then help me build sites, write outreach, and price and deliver. Use the prompt templates below when I say "build a [type] site" or "add motion".

---

## THE BIG PICTURE (how the business works)

- **The site gets you in the door. The monthly plan is the actual business.** Don't sell a one-time $500 site and go hunting again Monday. Sell build fee + monthly retainer.
- Local owners don't want "a website." They want **calls, bookings, and foot traffic.** Pitch it that way.
- **Money model:**
  - Build fee, paid up front (at least 50% before starting)
  - Monthly plan (~$300/mo): hosting, edits, Google Business Profile, monthly report
  - Add-ons: extra pages, seasonal promos
- **Math:** Monthly income goal ÷ $300 = number of retainer clients needed.
- **Price on value, not hours.** If one customer is worth $500 to a roofer, a site that brings 2/month pays for itself fast.

---

## THE 8-STEP PROCESS

1. **Collect before building.** Logo, 10–20 real photos, services, prices, hours, reviews, phone. Real content > design tricks.
2. **Write the brief.** Who they serve, the ONE action a visitor should take (call / book / order), 2–3 sites with a feel you like.
3. **Build with AI.** Start with one fast page: hero + main button, services, proof, location, footer.
4. **Check on a phone first.** Tap targets, text size, load speed.
5. **Deploy free** (Netlify or similar), send yourself the link.
6. **Find leads on Google Maps.** Search "[business type] [city]." Look for: no website button, slow/broken/old site, or **great reviews + weak online presence (best leads).** Track in a sheet: name, phone, email, current site, what's wrong, 1 thing you'd fix. Goal: 30 leads, star the 5 with best reviews + worst site.
7. **Pitch with a live demo, not a description.** Build a 1-page demo with THEIR name, photos, services. Record a short screen video (phone + desktop). Point out 1 thing their current setup can't do (tap-to-call, online ordering). Under 1 hour per demo; reuse one layout.
8. **Close + keep them.** 2–3 clear packages, simple agreement, invoice link, auto-billing monthly. First 30 days after launch decide retention:
   - Set up/clean their Google Business Profile
   - Get reviews from happy customers (make it one tap)
   - Monthly note: what you updated, visits, calls/bookings
   - Fix small requests same day

---

## RULES FOR EVERY SITE BUILD (apply always)

- Use ONLY the content I give. **Never invent** menu items, prices, reviews, awards, licenses, years in business, stats, or clients.
- Mobile-first and fast.
- All text = real HTML text (never baked into images).
- Alt text on every photo.
- Schema markup for Google (Restaurant / Hotel / LocalBusiness / CafeOrCoffeeShop).
- Colors pulled from the logo.
- Main call-to-action in the hero AND sticky on mobile.

---

## PROMPT TEMPLATES — FIRST DRAFT SITES

Swap [brackets] for real info, attach logo + photos.

### Restaurant
Single-page site for [Name], a [food type] restaurant in [City]. Goal: online orders + table bookings. Hero buttons: "Order online" + tap-to-call. Sections: (1) Hero w/ big food/room photo, name, 1-line hook, both buttons (2) 6–8 signature dishes w/ photo, desc, price (3) Full menu by category, phone-friendly (4) Short owner story (5) Real reviews w/ stars (6) Hours, address, Google Map, parking note (7) Footer: phone, address, IG, order + reservation links. Style: warm, appetizing, big food photos, lots of space.
Content: logo, photos, menu+prices, hours, address/phone, reviews, order link, reservation link.

### Hotel / Vacation Rental
Single-page site for [Name], a [boutique hotel / inn / rental] in [City]. Goal: direct bookings (skip the booking apps). "Check availability" in hero + sticky "Book now" on mobile → [booking link]. Sections: (1) Hero w/ best property/view photo (2) Room cards: photos, beds/guests, features, "Book this room" (3) Amenity icon grid (only what I list) (4) Gallery, full-screen on tap (5) Nearby spots w/ walk/drive times + map (6) Real reviews (7) Check-in/out, cancellation policy, contact (8) Footer. Style: calm, premium, white space.
Content: logo, photos, rooms, amenities, nearby spots, policies, reviews, booking link, contact.

### Barbershop / Salon
Single-page site for [Name], a [barbershop / salon / nail salon] in [City]. Goal: bookings. "Book now" in hero + sticky on mobile → [booking link]. Sections: (1) Hero w/ strong work/shop photo (2) Services by category w/ price + time (3) Team: photo, name, specialty, own booking link if given (4) Work gallery, full-screen on tap (5) Real reviews (6) Hours, address, map, parking (7) Footer. Style: [clean modern / bold gritty / soft luxe].
Content: logo, photos, services/prices/times, team, hours, address/phone, reviews, booking link.

### Home Services (roofing / plumbing / landscaping)
Single-page site for [Company], serving [City + nearby]. Goal: calls + quote requests. Tap-to-call + "Get a free quote" in hero, sticky call button on mobile. Sections: (1) Hero w/ real job photo (2) Service cards (3) Why us: 3–4 points, only what I give (4) Recent work grid w/ captions (5) Service area towns (6) Real reviews w/ stars (7) Quote form: name, phone, address, need, photo upload → [email] (8) Footer w/ license # if given. Style: trustworthy, strong contrast, real job photos over stock.
Content: logo, job photos, services, why-us points, service area, hours, reviews, phone/email.

### Coffee Shop / Bakery
Single-page site for [Name], a [coffee shop / bakery / cafe] in [City]. Goal: visits + order-ahead. Hero buttons: "Order ahead" → [link] + "Get directions" → Google Maps. Sections: (1) Cozy hero photo (2) 4–6 best sellers w/ photo + price (3) Full menu by category (4) The space: short blurb + photos (Wi-Fi, seating — only what I say) (5) Real reviews (6) Hours, address, map (7) Footer. Style: warm, soft logo colors, close-up photos.
Content: logo, photos, menu+prices, hours, address/phone, reviews, order link.

---

## PROMPT TEMPLATES — MAKE IT MOVE (run in order, same chat, check phone after each)

**Global rules for all motion:** content visible by default (nothing stays hidden if JS fails), respect `prefers-reduced-motion`, smooth on phone, subtle/premium not bouncy, use CSS or GSAP (no heavy libraries).

1. **Animated hero** — Keep all text/buttons/links. Headline reveals line-by-line sliding up from a mask w/ stagger (~0.8s). Subtext + buttons fade/rise after, 0.15s apart. Background: [looping muted video / animated brand gradient / slow zoom on hero photo]. Main button: hover lift + soft brand-color glow. Text readable within 1 second.

2. **Scroll animations everywhere** — Don't change content/colors/layout. GSAP + ScrollTrigger. Headings rise 30px + fade. Cards/images stagger in at 0.08s. Big images get gentle parallax. Numbers count up from 0 once. Every animation runs once, never reverses.

3. **Premium polish pass** — Act as senior web designer. Don't change words, photos, or section order. Fix: consistent spacing; clear type scale, tighter heading letter-spacing, comfy body line-height, max 70 chars/line; 1 accent color from logo for buttons/links only; matching radius + soft shadows + hover states on buttons/cards; sticky header that goes solid + blur on scroll, smooth anchor scroll, consistent icon sizes. **Then list every change in plain English.**

4. **Edit one thing only** — Change ONLY: [describe]. No new sections, no restyling, no rewording, no bonus "improvements." Before editing, tell me which files/parts you'll touch. After, confirm nothing else changed and it looks right on phone + desktop.

5. **One signature interaction** — Pick the best fit, build only that one, tell me why: (A) horizontal-scroll gallery of [work/dishes/projects] (B) sticky "how it works" — steps change left, image/phone mockup pinned right (C) service/menu cards w/ slight 3D tilt + lift on hover/tap (D) looping ticker of real reviews w/ stars. Must work with touch, match existing colors/fonts.

---

## PROMPT TEMPLATES — SHOWCASE / WOW SITES (fresh builds, expect back-and-forth)

**Global rules:** real text always readable even if animation fails, respect `prefers-reduced-motion`, smooth on phone, never invent content.

1. **Motion graphics site** — [Brand], dark background, 1 bold accent [logo / #hex], big tight sans-serif headlines, lots of space. All motion in code (no stock video), GSAP + ScrollTrigger: kinetic word-by-word hero headline w/ SVG lines/circles/grid drawing in behind; solid color panel wipes between sections; looping SVG icons per service; big numbers that scrub with scroll (reverse on scroll up); giant brand name in footer drifting sideways.

2. **Scroll story (Apple-style, pinned)** — Hero: huge line + image that shrinks into a rounded card as you scroll, text fades up. Pinned section: 4 steps play out, right image crossfades per step, left text highlights one at a time, progress line fills. Horizontal gallery of 6–8 photos (swipeable row on mobile). Big statement where each word lights gray→white on scroll. Clean CTA w/ one button. GSAP ScrollTrigger w/ scrub.

3. **Image sequence product reveal** — Frames `frame_0001.jpg`–`frame_0120.jpg` (export from a short product video). Full-screen canvas pinned ~3 screen heights; scroll = play video forward/back. Preload w/ progress bar, show frame 1 instantly. 3 text callouts fade in at ~20/50/80%. Then specs section + Buy/Book button. Canvas + requestAnimationFrame (or ScrollTrigger), retina-sharp, smaller frames on phones, still image for reduced-motion.

4. **3D hero (Three.js)** — Object: [describe or attach .glb]; if no model, build from simple shapes w/ glossy clearcoat material. Soft key light, cool rim light, warm fill, soft shadows on invisible floor. Eases in on load, then idle float + turn. On scroll, camera orbits + pushes in, object shows a new side per section. Canvas fixed in background, 3–4 text sections scroll over it, ends w/ button. Cap pixel ratio at 2, pause when off-screen, still-image fallback if no WebGL. Text = real HTML on top.

5. **Particle / dot hero** — Thousands of glowing dots on black (canvas, or WebGL points for 10k+). Dots start scattered, drift together into [brand name / shape / logo]. Once formed they "breathe." On scroll, shape breaks into a stream flowing into next section. White dots + a few in [accent color]. Below: simple page (intro, 3 services, contact button). Fewer dots on phone, pause off-screen, brand name as real text for SEO/screen readers, still version for reduced-motion.

6. **Scroll-built site (assembles as you scroll)** — Hero starts as gray wireframe boxes on a faint grid. On scroll each piece fills in: headline types itself, image fades into its box, button drops in w/ small bounce, colors switch on last. Every section does the same, once. Corner label counts "Building... 40%" → "Live" at the bottom. Real content always in HTML; reduced-motion shows the finished page.

---

## OUTREACH — COLD EMAIL TEMPLATES

**Rules:** business name in subject (never "Website services"), under 100 words, 1 link, no attachments, no logo in signature, send from a real inbox a few at a time (no mass email tool), find the OWNER's email (named person beats info@). Most replies come on email 2–4. Follow up every ~3 days in the same thread with something new (screenshot of their Google listing, a competitor's site, or a demo upgrade).

**Email 1**
Subject: Quick preview for [Business name]
> Hi [First name], I was looking for [business type] in [City] and found [Business name]. Your reviews are great, but [no website on your Google listing / your site is hard to use on a phone]. I made a quick preview of what a new site could look like, no strings: [Demo link]. Worth a 10-min call this week to walk through it? — [Name], [Phone]

**Follow-up**
> Hi [First name], bumping this in case it got buried. I added your [menu / services / photos] to the preview so you can see it with your real info: [Demo link]. Happy to walk you through it whenever. — [Name]

---

## HOW I WANT YOU TO HELP ME

- When I give you a business, pick the matching template, fill it with what I give you, and build the first draft.
- Ask me for any missing content instead of making it up.
- After the draft, suggest which motion prompt to run next.
- Help me write personalized cold emails + follow-ups for each lead.
- Help me build 2–3 packages (build fee + monthly) and a monthly client report template.
- Keep it casual, short, and action-focused.
