# BNB motion kit

Makes sample sites feel alive: hero entrance, glowing background, scroll-in sections,
scrolling badge strip, card tilt, button shine, pulsing phone bar, photo zoom,
count-up numbers and a drag-to-compare before/after slider.

Use: paste the whole of `motion.html` at the very end of a sample's `concept.html`.

Optional hooks:
- Before/after slider (use real before/after photos of the same spot only):
  `<div class="ba"><img src="img/AFTER.jpg" alt="..."><img class="ba-before" src="img/BEFORE.jpg" alt="..."><span class="tag l">Before</span><span class="tag r">After</span><span class="ba-line"></span><input type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after"></div>`
- Count-up: `<b data-count="30" data-suffix="+">30+</b>` (real numbers only).
- Hero drawing: add `float` to the svg, wrap the main object in `<g class="drive-in">`, sparkles/details in `<g class="twinkle">`.

Demo: https://bnbgene.github.io/brain/on-scene-cleaning-services-demo/

## 3D truck (for businesses that use a truck or van)
Wrap the hero drawing in a stage and load the module (files live in docs/assets/, served by GitHub Pages):
`<div class="truck stage3d" data-truck='{"cab":"#4DB8FF","box":"#F4F7FB","trim":"#0B2342","label":"ON SCENE","sub":"Junk removal + cleaning"}'><svg>...fallback drawing...</svg></div>`
plus the `.stage3d` CSS from the demo page and `<script type="module" src="../assets/truck3d.js"></script>`.
The truck drives in with dust, brakes, idles, turns with pointer/scroll, and drives off and back when tapped.
Falls back to the drawing without WebGL or with reduced motion.
