# BNB sample site playbook (the house style)

Every sample site we build follows this. The owner approved it after testing three industries.
Match these live examples before inventing anything new:

- Construction: https://bnbgene.github.io/brain/sandoval-concrete/ (`docs/sandoval-concrete/concept.html`)
- Restaurant / food: https://bnbgene.github.io/brain/freestyllez/ (`docs/freestyllez/concept.html`)
- Office / services with a mascot: https://bnbgene.github.io/brain/emeryville-tax-services/ (`docs/emeryville-tax-services/concept.html`)

The fastest way to build a new one is to copy the closest example and swap in the new business.

## What the owner wants
Professional, but alive. Never plain, and never "just one little 3D toy". The top of the page should feel like a
video: people working, a real person up front, things moving. Motion all the way down the page.
(The owner rejected: a lone 3D truck/planet as the main idea, animated 3D people, and plain static heroes.)

## The hero (top of the page), in layers
1. **Background that moves**: a stock work clip in a `<video class="hero-video">` (Mixkit `assets.mixkit.co/videos/<id>/<id>-720.mp4`
   plus fallbacks; it fades in only when it really plays). Under it, a crossfading **slideshow** (`.hero-slides`) of 3 photos
   with slow zoom: the business's own photos first, else Pexels stock of people doing that job
   (`https://images.pexels.com/photos/<id>/pexels-photo-<id>.jpeg?auto=compress&cs=tinysrgb&w=1600`). Dark brand-colored shade on top.
2. **A real person up front**: a framed, slightly tilted portrait (`.portrait` / `.office`) that slides in and slowly zooms.
   Prefer a real photo of the owner or team (their Instagram). Else a Pexels worker/chef/etc. photo labeled "Example photo".
   Always add `onerror` to fall back to one of their own photos.
3. **Floating proof cards** around the photo (`.float-card`), popping in one by one and bobbing: only REAL facts:
   license #, years in business, rating (only if 4.0+), review quote, follower count, a signature item + price,
   address, "late filers welcome", etc.
4. **Brand character** if they have one (mascot, logo art): animated (blink, wave, hop, float). If they have a mascot,
   draw it to match their real one (colors, outfit, logo on it) and add a small "Mascot concept" label until approved.
5. Headline + lead + 2 buttons + a row of chips (services / payments / trust).

## Rest of the page
- Scrolling marquee strip of services.
- Services cards (only services they actually advertise), How it works (3 steps), real photos / before-after gallery,
  review quote (real, with first name + initial and source), community/about with their own photo, hours, payments,
  contact form (preview only), sticky mobile call bar.
- Something interactive when it fits (e.g. "what to bring" checklist with a progress bar for tax/medical/legal).
- Paste the whole motion kit at the end: `templates/motion-kit/motion.html` (scroll reveals, marquee, card tilt,
  button shine, count-ups, before/after slider, sticky-header fix). Extend its `sel` list if the page uses new card classes.

## Colors & look
- Take colors from their logo / storefront / posts (e.g. Freestyllez = logo's purple-pink-orange on space black,
  green wordmark). Never default to generic green-on-dark.
- Fonts from Google Fonts; big confident headline with one highlighted phrase.
- Must look right at 390px wide (phone) with no sideways scroll. Check desktop and phone screenshots before publishing.

## Honesty rules (always)
- Sticky banner first: "Website concept prepared for <Name>. Not their official site. Buttons are for preview only."
  If they already have a website: "Website redesign concept prepared for …".
- Only real facts. Stock photos/video are labeled "Example photo" / "Example footage". No invented reviews, numbers,
  awards or services. Leave out a weak rating rather than show it.
- All buttons/links stay on the page (`href="#..."`), no real phone/email/booking links.
- Mixkit clips marked "personal use" are fine for a pitch sample; swap in the client's own footage before launch.

## Publishing
- Save to `drafts/<slug>/concept.html` (+ `img/`), then `python3 tools/publish_sample.py <slug> --github`
  → `docs/<slug>/` → live at `https://bnbgene.github.io/brain/<slug>/` about a minute after pushing branch
  `claude/clever-shannon-qbaqz7`. Never touch `samples/` (old Netlify site, costs credits).
- Edits later: change `docs/<slug>/concept.html`, run `python3 tools/build_samples.py --root docs`, push. Same link.
- Escape apostrophes inside `data-*='{...}'` JSON as `&#39;`.
- Put the link on the lead in the BNB Lead Desk (`sampleUrl`) with a history note.
