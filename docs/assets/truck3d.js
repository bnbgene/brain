// BNB 3D truck: a box truck that drives onto the hero, kicks up dust, brakes, then idles and follows the pointer.
// Usage: <div class="stage3d" data-truck='{"cab":"#4DB8FF","box":"#F4F7FB","trim":"#0B2342","label":"ON SCENE","sub":"Junk removal + cleaning"}'>
//          <svg ...fallback drawing...></svg></div>
//        <script type="module" src="../assets/truck3d.js"></script>
// The fallback drawing stays if WebGL is missing or the visitor prefers reduced motion.
import * as THREE from './three/three.module.min.js';
import { RoundedBoxGeometry } from './three/RoundedBoxGeometry.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function webglOK() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}

function labelTexture(o) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = o.box; g.fillRect(0, 0, 1024, 512);
  g.fillStyle = o.trim; g.fillRect(0, 430, 1024, 82);
  g.fillStyle = o.cab; g.fillRect(0, 410, 1024, 20);
  // sparkle mark
  g.save(); g.translate(150, 210); g.fillStyle = o.cab;
  g.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? 26 : 88, a = i * Math.PI / 4 - Math.PI / 2; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill();
  g.restore();
  g.fillStyle = o.trim; g.font = '900 120px Inter, Arial Black, sans-serif'; g.textBaseline = 'middle';
  g.fillText(o.label, 270, 190, 720);
  g.fillStyle = '#56657A'; g.font = '700 50px Inter, Arial, sans-serif';
  g.fillText(o.sub || '', 274, 300, 720);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

function buildTruck(o) {
  const truck = new THREE.Group(), body = new THREE.Group(), wheels = [];
  truck.add(body);
  const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: .45, metalness: .1, ...extra });
  const rb = (w, h, d, r = .12) => new RoundedBoxGeometry(w, h, d, 4, r);
  const add = (geo, m, x, y, z, parent = body) => { const s = new THREE.Mesh(geo, m); s.position.set(x, y, z); s.castShadow = true; s.receiveShadow = true; parent.add(s); return s; };

  const boxMat = mat(o.box, { roughness: .35 }), cabMat = mat(o.cab, { roughness: .3, metalness: .25 }), trimMat = mat(o.trim, { roughness: .6 });
  const glass = new THREE.MeshStandardMaterial({ color: '#BFE3F7', roughness: .05, metalness: .6, emissive: '#1b3550', emissiveIntensity: .25 });
  const dark = mat('#1A1F27', { roughness: .8 });

  // chassis + cargo box
  add(new THREE.BoxGeometry(5.7, .32, 1.7), dark, -.15, .62, 0);
  const cargo = add(rb(3.7, 2.25, 2.15, .1), boxMat, -1.05, 1.92, 0);
  const lbl = labelTexture(o);
  [1, -1].forEach(side => {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 1.75), new THREE.MeshStandardMaterial({ map: lbl, roughness: .4 }));
    p.position.set(-1.05, 1.95, side * 1.081); if (side < 0) p.rotation.y = Math.PI; p.receiveShadow = true; body.add(p);
  });
  add(new THREE.BoxGeometry(.06, 2.0, 1.9), trimMat, -2.92, 1.92, 0); // rear door seam frame

  // cab
  add(rb(1.75, 1.15, 2.0, .16), cabMat, 1.75, 1.2, 0);
  const cabin = add(rb(1.25, 1.0, 1.92, .2), cabMat, 1.5, 2.15, 0);
  const ws = add(new THREE.PlaneGeometry(1.05, .8), glass, 2.13, 2.2, 0); ws.rotation.y = Math.PI / 2; ws.rotation.x = 0; ws.rotation.z = 0;
  ws.rotation.set(0, Math.PI / 2, 0); ws.rotateX(-.28);
  [1, -1].forEach(side => { const w = add(new THREE.PlaneGeometry(.75, .62), glass, 1.55, 2.22, side * .965); if (side < 0) w.rotation.y = Math.PI; });
  add(rb(.2, .32, 2.04, .06), trimMat, 2.68, .82, 0); // bumper
  // lights
  const head = new THREE.MeshStandardMaterial({ color: '#FFF6C8', emissive: '#FFE58A', emissiveIntensity: 1.6 });
  const tail = new THREE.MeshStandardMaterial({ color: '#ff5a5a', emissive: '#ff2a2a', emissiveIntensity: .9 });
  [.72, -.72].forEach(z => { add(new THREE.BoxGeometry(.06, .2, .34), head, 2.63, 1.25, z); add(new THREE.BoxGeometry(.06, .3, .18), tail, -2.94, 1.0, z * 1.2); });
  const beam = new THREE.SpotLight('#fff2c0', 6, 9, .5, .6, 1.2); beam.position.set(2.7, 1.25, 0); beam.target.position.set(7, 0, 0); body.add(beam, beam.target);
  add(new THREE.BoxGeometry(.18, .12, .1), trimMat, 1.9, 1.95, 1.03); // mirror
  add(new THREE.BoxGeometry(.18, .12, .1), trimMat, 1.9, 1.95, -1.03);

  // wheels (outside the body so suspension can bob)
  const tireG = new THREE.CylinderGeometry(.5, .5, .38, 32), hubG = new THREE.CylinderGeometry(.27, .27, .4, 20), boltG = new THREE.BoxGeometry(.08, .42, .08);
  const tireM = mat('#14171c', { roughness: .9 }), hubM = mat('#C8D4E2', { metalness: .7, roughness: .3 });
  [[1.85, .95], [1.85, -.95], [-1.9, .95], [-1.9, -.95], [-1.05, .95], [-1.05, -.95]].forEach(([x, z]) => {
    const w = new THREE.Group(); w.position.set(x, .5, z);
    const t = new THREE.Mesh(tireG, tireM); t.rotation.x = Math.PI / 2; t.castShadow = true; w.add(t);
    const h = new THREE.Mesh(hubG, hubM); h.rotation.x = Math.PI / 2; w.add(h);
    for (let i = 0; i < 3; i++) { const b = new THREE.Mesh(boltG, dark); b.rotation.x = Math.PI / 2; b.rotation.y = i * Math.PI / 3; w.add(b); }
    truck.add(w); wheels.push(w);
  });
  return { truck, body, wheels };
}

function mount(stage) {
  const o = Object.assign({ cab: '#4DB8FF', box: '#F4F7FB', trim: '#0B2342', label: 'ON SCENE', sub: '' }, JSON.parse(stage.dataset.truck || '{}'));
  const fallback = stage.querySelector('svg');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  const cv = renderer.domElement; cv.className = 'truck3d'; cv.setAttribute('aria-hidden', 'true');
  stage.appendChild(cv);

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(30, 1, .1, 100);
  scene.add(new THREE.HemisphereLight('#dbeaff', '#203048', 1.35));
  const sun = new THREE.DirectionalLight('#ffffff', 2.2); sun.position.set(4, 9, 6); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 6, bottom: -6 }); sun.shadow.radius = 6;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(o.cab, 1.2); rim.position.set(-6, 4, -5); scene.add(rim);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), new THREE.ShadowMaterial({ opacity: .35 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  const { truck, body, wheels } = buildTruck(o);
  scene.add(truck);

  // dust puffs
  const dustM = new THREE.MeshStandardMaterial({ color: '#d9cbb3', transparent: true, opacity: .0, roughness: 1 });
  const dustG = new THREE.SphereGeometry(.22, 10, 8), puffs = [];
  for (let i = 0; i < 26; i++) { const m = new THREE.Mesh(dustG, dustM.clone()); m.visible = false; scene.add(m); puffs.push({ m, life: 0 }); }
  let nextPuff = 0;
  function puff(x, z) { const p = puffs[nextPuff++ % puffs.length]; p.m.position.set(x, .25, z + (Math.random() - .5) * .3); p.m.scale.setScalar(.6); p.life = 1; p.m.visible = true; p.vy = .4 + Math.random() * .4; p.vx = -.6 - Math.random() * .8; }

  function resize() {
    const r = cv.getBoundingClientRect(), w = r.width || stage.clientWidth, h = r.height || stage.clientHeight || w * .7;
    renderer.setSize(w, h, false); cam.aspect = w / h;
    const narrow = w / h < 1.15; cam.fov = narrow ? 36 : 30;
    cam.position.set(narrow ? 5.6 : 6.6, narrow ? 3.4 : 3.1, narrow ? 10.5 : 9.2);
    cam.lookAt(.1, 1.25, 0); cam.updateProjectionMatrix();
  }
  resize(); addEventListener('resize', resize);

  // state
  const START = -16, DUR = 2.6;
  let t0 = performance.now(), phase = 'in', x = START, lastX = START, wheelRot = 0, pitch = 0, pitchV = 0, bounce = 0, bounceV = 0;
  let px = 0, py = 0, tx = 0, ty = 0, visible = true, first = true;
  const ease = t => 1 - Math.pow(1 - t, 3);
  stage.addEventListener('pointermove', e => { const r = stage.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width - .5); ty = ((e.clientY - r.top) / r.height - .5); });
  stage.addEventListener('pointerleave', () => { tx = 0; ty = 0; });
  stage.addEventListener('click', () => { if (phase === 'idle') { phase = 'out'; t0 = performance.now(); } });
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) requestAnimationFrame(loop); }).observe(stage);

  let prev = performance.now();
  function loop(now) {
    if (!visible) return;
    const dt = Math.min(.05, (now - prev) / 1000); prev = now;
    const t = (now - t0) / 1000;
    if (phase === 'in') { const k = Math.min(1, t / DUR); x = START + (0 - START) * ease(k); if (k >= 1) { phase = 'idle'; pitchV -= .9; bounceV -= .5; } }
    else if (phase === 'out') { x += (6 + t * 22) * dt; if (x > 18) { phase = 'in'; t0 = now; x = START; lastX = START; } }
    const speed = (x - lastX) / Math.max(dt, 1e-3); lastX = x;
    wheelRot -= (speed * dt) / .5;
    wheels.forEach(w => { w.rotation.z = wheelRot; });
    // suspension: braking pitch + bounce springs
    const accel = phase === 'in' ? -speed * .004 : 0;
    pitchV += (-pitch * 60 - pitchV * 7 + accel * 10) * dt; pitch += pitchV * dt;
    bounceV += (-bounce * 80 - bounceV * 8) * dt; bounce += bounceV * dt;
    const rumble = phase === 'idle' ? Math.sin(now * .06) * .004 : Math.sin(now * .03) * Math.min(.02, Math.abs(speed) * .002);
    body.position.y = bounce * .08 + rumble; body.rotation.z = pitch * .05;
    truck.position.x = x;
    if (Math.abs(speed) > 1.5 && Math.random() < .55) { puff(x - 2.2, .95); puff(x - 2.2, -.95); }
    puffs.forEach(p => { if (p.life <= 0) return; p.life -= dt * .9; p.m.position.y += p.vy * dt; p.m.position.x += p.vx * dt; p.m.scale.multiplyScalar(1 + dt * 1.6); p.m.material.opacity = Math.max(0, p.life) * .45; if (p.life <= 0) p.m.visible = false; });
    // look-around: pointer + scroll
    px += (tx - px) * .06; py += (ty - py) * .06;
    const sc = Math.min(1, scrollY / 600);
    truck.rotation.y = px * .5 - .12 + sc * .35 + (phase === 'idle' ? Math.sin(now * .0006) * .05 : 0);
    scene.rotation.x = py * .06;
    renderer.render(scene, cam);
    if (first) { first = false; stage.classList.add('is-3d'); }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

if (!reduce && webglOK()) document.querySelectorAll('.stage3d').forEach(s => { try { mount(s); } catch (e) { console.warn('3D truck off:', e); } });
