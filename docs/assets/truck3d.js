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
  add(new THREE.BoxGeometry(.04, 2.0, 1.95), dark, -2.9, 1.92, 0); // dark cargo opening
  const doors = [1, -1].map(side => {
    const hinge = new THREE.Group(); hinge.position.set(-2.93, 1.92, side * 1.03); body.add(hinge);
    const d = new THREE.Mesh(rb(.06, 2.05, 1.0, .03), boxMat); d.position.set(-.03, 0, -side * .5); d.castShadow = true; hinge.add(d);
    const bar = new THREE.Mesh(new THREE.BoxGeometry(.05, 1.6, .05), trimMat); bar.position.set(-.07, 0, -side * .85); hinge.add(bar);
    hinge.userData.side = side; return hinge;
  });

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
  return { truck, body, wheels, doors };
}


// low-poly workers who carry a couch and boxes from a junk pile into the truck
function person(shirt, skin, pants) {
  const g = new THREE.Group(), m = c => new THREE.MeshStandardMaterial({ color: c, roughness: .7 });
  const part = (geo, mat, x, y, z, parent = g) => { const s = new THREE.Mesh(geo, mat); s.position.set(x, y, z); s.castShadow = true; parent.add(s); return s; };
  const shirtM = m(shirt), skinM = m(skin), pantsM = m(pants), shoeM = m('#1d1d1d');
  part(new RoundedBoxGeometry(.46, .62, .3, 3, .1), shirtM, 0, 1.28, 0);
  part(new THREE.SphereGeometry(.16, 18, 14), skinM, 0, 1.78, 0);
  const cap = part(new THREE.SphereGeometry(.165, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), shirtM, 0, 1.8, 0);
  part(new THREE.BoxGeometry(.2, .03, .16), shirtM, .14, 1.82, 0);
  const limb = (len, r, mat) => { const piv = new THREE.Group(); const l = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 4, 10), mat); l.position.y = -len / 2 - r * .5; l.castShadow = true; piv.add(l); return piv; };
  const legs = [-.11, .11].map(z => { const L = limb(.62, .085, pantsM); L.position.set(0, .98, z); g.add(L); const shoe = new THREE.Mesh(new THREE.BoxGeometry(.24, .09, .12), shoeM); shoe.position.set(.05, -.86, 0); L.add(shoe); return L; });
  const arms = [-.29, .29].map(z => { const A = limb(.46, .07, shirtM); A.position.set(0, 1.52, z); const hand = new THREE.Mesh(new THREE.SphereGeometry(.075, 10, 8), skinM); hand.position.y = -.66; A.add(hand); g.add(A); return A; });
  g.userData = { legs, arms }; return g;
}
function buildCrew(world, o) {
  const P = new THREE.Vector3(-5.3, 0, 2.0);           // junk pile
  const mk = c => new THREE.MeshStandardMaterial({ color: c, roughness: .7 });
  const pile = new THREE.Group(); world.add(pile);
  [[0, .3, 0, .6, .6, .6, '#b08a5a'], [.55, .22, .45, .45, .45, .45, '#c79f6d'], [-.4, .2, .6, .4, .4, .4, '#a07c4f'], [.1, .78, .15, .42, .36, .42, '#d2ad7c']].forEach(([x, y, z, w, h, d, c]) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mk(c)); b.position.set(P.x + x, y, P.z + z); b.castShadow = true; b.receiveShadow = true; pile.add(b);
  });
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, 1.1, 8), mk('#555')); lamp.position.set(P.x - .7, .55, P.z - .2); lamp.rotation.z = .5; pile.add(lamp);
  // couch carried by two
  const couch = new THREE.Group(); const cm = mk('#5f7f74');
  [[0, 0, 0, 1.7, .32, .72], [0, .32, -.28, 1.7, .5, .18], [-.8, .2, 0, .14, .36, .72], [.8, .2, 0, .14, .36, .72]].forEach(([x, y, z, w, h, d]) => { const b = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, .06), cm); b.position.set(x, y, z); b.castShadow = true; couch.add(b); });
  world.add(couch);
  const box = new THREE.Mesh(new THREE.BoxGeometry(.5, .42, .45), mk('#c79f6d')); box.castShadow = true; world.add(box);
  const a = person(o.cab, '#8d5a3b', '#2b3442'), b = person(o.cab, '#e0b48f', '#2b3442'), c = person(o.trim, '#5b3a26', '#3b3f46');
  world.add(a, b, c);
  const smooth = t => t * t * (3 - 2 * t);
  function walker(p, t, from, to, carry) {
    // t in [0,1] along a leg of the trip; carry = arms forward
    const pos = from.clone().lerp(to, smooth(t)); p.position.copy(pos);
    const dir = to.clone().sub(from); p.rotation.y = Math.atan2(-dir.z, dir.x);
    const sw = Math.sin(t * Math.PI * 2 * Math.max(2, from.distanceTo(to) / .9)) * .55;
    p.userData.legs[0].rotation.z = sw; p.userData.legs[1].rotation.z = -sw;
    p.position.y = Math.abs(Math.cos(t * Math.PI * 2 * Math.max(2, from.distanceTo(to) / .9))) * .04;
    p.userData.arms.forEach((ar, i) => { ar.rotation.z = carry ? 1.25 : (i ? sw : -sw) * .8; });
  }
  function stand(p, carry) { p.userData.legs.forEach(l => l.rotation.z *= .8); p.userData.arms.forEach(ar => ar.rotation.z = carry ? 1.25 : ar.rotation.z * .85); p.position.y = 0; }
  const T = 9;                                          // seconds per round trip
  return {
    update(time, dt, working, park) {
      const D = new THREE.Vector3(park - 3.55, 0, .25);  // spot behind the open doors
      if (!working) {                                    // waiting by the pile until the truck parks
        [[a, 0, .9], [b, 0, -.9], [c, 1.4, 0]].forEach(([p, dx, dz]) => { p.position.set(P.x + 1.4 + dx, 0, P.z + dz); p.rotation.y = 0; stand(p, false); });
        couch.visible = false; box.visible = false; return;
      }
      // couch team
      const k = (time % T) / T, half = 1.7 / 2;
      const along = (from, to) => to.clone().sub(from).normalize();
      const start = P.clone().add(new THREE.Vector3(1.2, 0, 0)), end = D.clone();
      let mid, carry = true, phaseT;
      if (k < .42) { phaseT = k / .42; mid = start.clone().lerp(end, smooth(phaseT)); }
      else if (k < .52) { phaseT = (k - .42) / .1; mid = end.clone(); }
      else if (k < .94) { phaseT = (k - .52) / .42; mid = end.clone().lerp(start, smooth(phaseT)); carry = false; }
      else { phaseT = 0; mid = start.clone(); }
      const dir = k < .42 || k >= .94 ? along(start, end) : along(end, start);
      const perp = new THREE.Vector3(-dir.z, 0, dir.x);
      const front = mid.clone().add(dir.clone().multiplyScalar(half)), back = mid.clone().sub(dir.clone().multiplyScalar(half));
      const going = k < .42, returning = k >= .52 && k < .94;
      if (going || returning) {
        const lt = going ? k / .42 : (k - .52) / .42, from = going ? start : end, to = going ? end : start;
        walker(a, lt, from.clone().add(dir.clone().multiplyScalar(half)), to.clone().add(dir.clone().multiplyScalar(half)), going);
        walker(b, lt, from.clone().sub(dir.clone().multiplyScalar(half)), to.clone().sub(dir.clone().multiplyScalar(half)), going);
      } else { a.position.copy(front); b.position.copy(back); stand(a, k < .52); stand(b, k < .52); }
      couch.visible = k < .5 || k >= .94;
      if (couch.visible) {
        const cm2 = a.position.clone().add(b.position).multiplyScalar(.5);
        const lift = k < .42 ? .95 : k < .5 ? .95 + (k - .42) / .08 * .5 : .95;
        couch.position.set(cm2.x, lift, cm2.z); couch.rotation.y = Math.atan2(-dir.z, dir.x);
        if (k >= .42 && k < .5) couch.position.add(dir.clone().multiplyScalar((k - .42) / .08 * 1.4));
      }
      // box carrier, offset in time and path
      const k2 = ((time + T * .45) % (T * .7)) / (T * .7);
      const s2 = P.clone().add(new THREE.Vector3(.4, 0, -1.0)), e2 = D.clone().add(new THREE.Vector3(.2, 0, -1.05));
      if (k2 < .45) walker(c, k2 / .45, s2, e2, true); else if (k2 < .55) { c.position.copy(e2); stand(c, true); } else if (k2 < .95) walker(c, (k2 - .55) / .4, e2, s2, false); else { c.position.copy(s2); stand(c, false); }
      box.visible = k2 < .53 || k2 > .97;
      if (box.visible) { const fwd = new THREE.Vector3(Math.cos(c.rotation.y), 0, -Math.sin(c.rotation.y)); box.position.copy(c.position).add(fwd.multiplyScalar(.42)).setY(1.15); box.rotation.y = c.rotation.y; }
    }
  };
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

  const { truck, body, wheels, doors } = buildTruck(o);
  const world = new THREE.Group(); scene.add(world); world.add(truck);
  const PARK = o.crew ? 1.3 : 0;
  const crew = o.crew ? buildCrew(world, o) : null;

  // dust puffs
  const dustM = new THREE.MeshStandardMaterial({ color: '#d9cbb3', transparent: true, opacity: .0, roughness: 1 });
  const dustG = new THREE.SphereGeometry(.22, 10, 8), puffs = [];
  for (let i = 0; i < 26; i++) { const m = new THREE.Mesh(dustG, dustM.clone()); m.visible = false; world.add(m); puffs.push({ m, life: 0 }); }
  let nextPuff = 0;
  function puff(x, z) { const p = puffs[nextPuff++ % puffs.length]; p.m.position.set(x, .25, z + (Math.random() - .5) * .3); p.m.scale.setScalar(.6); p.life = 1; p.m.visible = true; p.vy = .4 + Math.random() * .4; p.vx = -.6 - Math.random() * .8; }

  function resize() {
    const r = cv.getBoundingClientRect(), w = r.width || stage.clientWidth, h = r.height || stage.clientHeight || w * .7;
    renderer.setSize(w, h, false); cam.aspect = w / h;
    const narrow = w / h < 1.15; cam.fov = narrow ? 36 : 30;
    if (o.crew) { cam.fov = narrow ? 40 : 30; cam.position.set(narrow ? 3.4 : 4.7, narrow ? 4.4 : 3.5, narrow ? 15.8 : 11.4); cam.lookAt(narrow ? -.8 : -.55, 1.05, .6); }
    else { cam.position.set(narrow ? 5.6 : 6.6, narrow ? 3.4 : 3.1, narrow ? 10.5 : 9.2); cam.lookAt(.1, 1.25, 0); }
    cam.updateProjectionMatrix();
  }
  resize(); addEventListener('resize', resize);

  // state
  const START = -16, DUR = 2.6;
  let t0 = performance.now(), phase = 'in', x = START, lastX = START, wheelRot = 0, pitch = 0, pitchV = 0, bounce = 0, bounceV = 0;
  let idleAt = 0, px = 0, py = 0, tx = 0, ty = 0, visible = true, first = true;
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
    if (phase === 'in') { const k = Math.min(1, t / DUR); x = START + (PARK - START) * ease(k); if (k >= 1) { phase = 'idle'; idleAt = now; pitchV -= .9; bounceV -= .5; } }
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
    world.rotation.y = px * (o.crew ? .3 : .5) - .12 + sc * (o.crew ? .2 : .35) + (phase === 'idle' ? Math.sin(now * .0006) * .04 : 0);
    // rear doors swing open while parked, crew works
    const open = phase === 'idle' ? Math.min(1, (now - idleAt) / 900) : Math.max(0, (doors[0].userData.o || 0) - dt * 3);
    doors.forEach(d => { d.userData.o = open; d.rotation.y = -d.userData.side * ease(open) * 1.9; });
    if (crew) crew.update(now / 1000, dt, phase === 'idle' && now - idleAt > 700, PARK);
    scene.rotation.x = py * .06;
    renderer.render(scene, cam);
    if (first) { first = false; stage.classList.add('is-3d'); }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

if (!reduce && webglOK()) document.querySelectorAll('.stage3d').forEach(s => { try { mount(s); } catch (e) { console.warn('3D truck off:', e); } });
