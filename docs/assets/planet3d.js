// BNB 3D planet: a glowing planet with a ring, stars, and photo "moons" orbiting it.
// Usage: <div class="stage3d" data-planet='{"color":"#5CF08E","ring":"#FF5DB8","cards":["img/p3.jpg","img/p5.jpg"]}'>...fallback...</div>
//        <script type="module" src="../assets/planet3d.js"></script>
// The fallback stays if WebGL is missing or the visitor prefers reduced motion.
import * as THREE from './three/three.module.min.js';
import { RoundedBoxGeometry } from './three/RoundedBoxGeometry.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
function webglOK() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }

function planetTexture(col) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const g = c.getContext('2d');
  const base = new THREE.Color(col), dark = base.clone().multiplyScalar(.18), mid = base.clone().multiplyScalar(.55);
  g.fillStyle = '#' + dark.getHexString(); g.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 26; i++) {            // soft swirling bands
    const y = Math.random() * 512, h = 10 + Math.random() * 46;
    g.fillStyle = `rgba(${Math.round(mid.r * 255)},${Math.round(mid.g * 255)},${Math.round(mid.b * 255)},${.12 + Math.random() * .3})`;
    g.beginPath(); g.moveTo(0, y);
    for (let x = 0; x <= 1024; x += 32) g.lineTo(x, y + Math.sin(x / 90 + i) * 10);
    g.lineTo(1024, y + h); for (let x = 1024; x >= 0; x -= 32) g.lineTo(x, y + h + Math.sin(x / 70 + i) * 8); g.fill();
  }
  for (let i = 0; i < 60; i++) {            // little craters / city lights
    g.fillStyle = `rgba(255,255,255,${Math.random() * .25})`; g.beginPath(); g.arc(Math.random() * 1024, Math.random() * 512, 1 + Math.random() * 3, 0, 7); g.fill();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function glowTexture(col) {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
  const gr = g.createRadialGradient(128, 128, 40, 128, 128, 128); gr.addColorStop(0, col); gr.addColorStop(.45, col + '66'); gr.addColorStop(1, col + '00');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function mount(stage) {
  const o = Object.assign({ color: '#5CF08E', ring: '#FF5DB8', cards: [] }, JSON.parse(stage.dataset.planet || '{}'));
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const cv = renderer.domElement; cv.className = 'planet3d'; cv.setAttribute('aria-hidden', 'true'); stage.appendChild(cv);
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(35, 1, .1, 100);
  scene.add(new THREE.AmbientLight('#6f6a92', .35));
  const key = new THREE.DirectionalLight('#ffffff', 2.6); key.position.set(4, 3, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(o.ring, 2.2); rim.position.set(-5, 1, -3); scene.add(rim);
  const fill = new THREE.DirectionalLight(o.color, .6); fill.position.set(-2, -3, 4); scene.add(fill);

  const world = new THREE.Group(); scene.add(world);
  const planet = new THREE.Mesh(new THREE.SphereGeometry(1.35, 64, 48), new THREE.MeshStandardMaterial({ map: planetTexture(o.color), roughness: .85, emissive: o.color, emissiveIntensity: .06 }));
  world.add(planet);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(o.color), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  glow.scale.setScalar(3.6); glow.material.opacity = .55; world.add(glow);
  const ringG = new THREE.Group(); ringG.rotation.set(1.15, .25, 0); world.add(ringG);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.05, .035, 12, 160), new THREE.MeshBasicMaterial({ color: o.ring }));
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.35, .012, 8, 160), new THREE.MeshBasicMaterial({ color: o.color, transparent: true, opacity: .6 }));
  ringG.add(ring, ring2);
  // stars
  const sg = new THREE.BufferGeometry(), pts = [];
  for (let i = 0; i < 380; i++) { const r = 9 + Math.random() * 10, a = Math.random() * 6.28, b = (Math.random() - .5) * 3; pts.push(Math.cos(a) * r, b * 3, Math.sin(a) * r - 6); }
  sg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: '#ffffff', size: .05, transparent: true, opacity: .8 })); scene.add(stars);
  // photo moons
  const loader = new THREE.TextureLoader(), cards = [];
  o.cards.forEach((src, i) => {
    const g = new THREE.Group();
    const frame = new THREE.Mesh(new RoundedBoxGeometry(1.08, 1.08, .06, 4, .08), new THREE.MeshStandardMaterial({ color: '#13111F', emissive: i % 2 ? o.ring : o.color, emissiveIntensity: .35 }));
    const tex = loader.load(src); tex.colorSpace = THREE.SRGBColorSpace;
    const pic = new THREE.Mesh(new THREE.PlaneGeometry(.96, .96), new THREE.MeshBasicMaterial({ map: tex })); pic.position.z = .035;
    g.add(frame, pic); g.userData.phase = i / o.cards.length * Math.PI * 2; world.add(g); cards.push(g);
  });

  function resize() {
    const r = cv.getBoundingClientRect(), w = r.width || stage.clientWidth, h = r.height || stage.clientHeight || w;
    renderer.setSize(w, h, false); cam.aspect = w / h; const narrow = w / h < 1.1;
    cam.position.set(0, .6, narrow ? 11.5 : 10.4); cam.lookAt(0, 0, 0); cam.updateProjectionMatrix();
  }
  resize(); addEventListener('resize', resize);

  let t0 = performance.now(), tx = 0, ty = 0, px = 0, py = 0, spin = 1, visible = true, first = true;
  stage.addEventListener('pointermove', e => { const r = stage.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5; });
  stage.addEventListener('pointerleave', () => { tx = ty = 0; });
  stage.addEventListener('click', () => { spin = 6; });
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) requestAnimationFrame(loop); }).observe(stage);
  const back = k => { const c = 1.7; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
  let prev = performance.now(), orbit = 0;
  function loop(now) {
    if (!visible) return;
    const dt = Math.min(.05, (now - prev) / 1000); prev = now; const t = (now - t0) / 1000;
    const intro = Math.min(1, t / 1.3), s = back(intro);
    planet.scale.setScalar(Math.max(.001, s)); glow.scale.setScalar(3.6 * Math.max(.001, s)); ringG.scale.setScalar(Math.max(.001, back(Math.min(1, Math.max(0, (t - .3) / 1.1)))));
    spin += (1 - spin) * dt * 1.5;
    planet.rotation.y += dt * .25 * spin; ring.rotation.z += dt * .1 * spin; ring2.rotation.z -= dt * .06 * spin;
    orbit += dt * .35 * spin;
    cards.forEach((g, i) => {
      const k = Math.min(1, Math.max(0, (t - .6 - i * .18) / 1.2)), e = back(k);
      const a = orbit + g.userData.phase, R = 2.9;
      g.position.set(Math.cos(a) * R * e, Math.sin(a * 1.0) * .55 + Math.sin(t + i) * .12, Math.sin(a) * R * .55 * e);
      g.scale.setScalar(Math.max(.001, e) * (1 + Math.sin(a) * .12));
      g.quaternion.copy(cam.quaternion);
      g.rotateZ(Math.sin(t * .8 + i) * .08);
    });
    glow.material.opacity = .45 + Math.sin(t * 2) * .1;
    px += (tx - px) * .05; py += (ty - py) * .05;
    world.rotation.y = px * .6; world.rotation.x = .12 + py * .3;
    stars.rotation.y = t * .01 + px * .1;
    renderer.render(scene, cam);
    if (first) { first = false; stage.classList.add('is-3d'); }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
if (!reduce && webglOK()) document.querySelectorAll('[data-planet]').forEach(s => { try { mount(s); } catch (e) { console.warn('3D planet off:', e); } });
