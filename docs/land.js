// src/lib/game/land-scene.ts
import * as THREE from "three";
var SAND = new THREE.Color(15123306);
var SEA = new THREE.Color(1746631);
var GREEN = new THREE.Color(4063130);
var CRIMSON = new THREE.Color(16726862);
var VOID = new THREE.Color(1315084);
var PAPER = new THREE.Color(15199986);
var WET = new THREE.Color(1323048);
var FILL = new THREE.Color(6965810);
var HOUSE = new THREE.Color(12875834);
var WINDOW = new THREE.Color(16757082);
var STATE = new THREE.Color(8308963);
var CROP = new THREE.Color(3074154);
function box(group, geos, parts, x, y, z, w, h, d, color, fill = 0.92) {
  const geo = new THREE.BoxGeometry(w, h, d);
  geos.push(geo);
  const fillMat = new THREE.MeshStandardMaterial({ color, roughness: 0.72, metalness: 0.05, transparent: fill < 0.98, opacity: fill });
  parts.fills.push(fillMat);
  const mesh = new THREE.Mesh(geo, fillMat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}
var LandScene = class {
  group = new THREE.Group();
  geos = [];
  windows = [];
  pathMats = [];
  rope;
  ropeMat;
  boardHalves = [];
  plotMats = [];
  stamp;
  villas = [];
  lotMats = [];
  fills = [];
  wetMat;
  flood;
  floodMat;
  signBits = [];
  slabHalves = [];
  crops = [];
  seaMat;
  pageMat;
  competition = "tender";
  outcome = "open";
  correct = 0;
  constructor(scene) {
    this.buildVillage();
    this.buildGround();
    this.rope = this.buildPath();
    this.ropeMat = this.rope.material;
    this.stamp = this.buildPlot();
    this.buildVillas();
    this.buildWetland();
    this.buildPermit();
    this.buildCrew();
    this.buildShoreWalk();
    this.buildField();
    this.buildGreenery();
    const hemi = new THREE.HemisphereLight(0xd5e4f2, 0x5a4328, 0.4);
    const sun = new THREE.DirectionalLight(0xfff3df, 1);
    sun.position.set(6, 11, 5);
    this.group.add(hemi, sun);
    const yard = new THREE.Mesh(new THREE.CircleGeometry(16, 40), new THREE.MeshStandardMaterial({ color: 0xcbb892, roughness: 1 }));
    yard.rotation.x = -Math.PI / 2;
    yard.position.y = -0.14;
    yard.receiveShadow = true;
    this.group.add(yard);
    this.group.visible = false;
    scene.add(this.group);
  }
  sync(competition, outcome, correct) {
    this.competition = competition;
    this.outcome = outcome;
    this.correct = correct;
  }
  tick(dt, t, reduced) {
    const on = this.competition === "land";
    this.group.visible = on;
    if (!on) return;
    const held = this.outcome === "held";
    const lost = this.outcome === "lost";
    const n = held ? 6 : lost ? 0 : Math.min(6, this.correct);
    const ease = reduced ? 1 : 1 - Math.exp(-3.2 * dt);
    const pathOpen = n >= 1 && !lost;
    this.pathMats.forEach((mat) => {
      mat.color.copy(pathOpen ? GREEN : lost ? CRIMSON : SAND);
      mat.opacity = pathOpen ? 0.72 : lost ? 0.4 : 0.22;
    });
    const ropeY = pathOpen ? 0.06 : 0.86;
    this.rope.position.y += (ropeY - this.rope.position.y) * ease;
    this.rope.scale.x += ((pathOpen ? 0.2 : 1) - this.rope.scale.x) * ease;
    this.ropeMat.color.copy(pathOpen ? GREEN : lost ? CRIMSON : SAND);
    this.ropeMat.opacity = pathOpen ? 0.12 : 0.92;
    const sold = n >= 2 && !lost;
    this.boardHalves.forEach((half, i) => {
      const mat = half.material;
      const y = sold ? 0.12 : 0.95;
      const rot = sold ? i === 0 ? 0.7 : -0.7 : 0;
      half.position.y += (y - half.position.y) * ease;
      half.rotation.z += (rot - half.rotation.z) * ease;
      mat.color.copy(lost ? CRIMSON : SAND);
      mat.opacity = sold ? 0.12 : 0.88;
    });
    this.plotMats.forEach((mat) => {
      mat.color.copy(sold ? STATE : lost ? CRIMSON : SAND);
      mat.opacity = sold ? 0.9 : 0.45;
    });
    const stampScale = sold ? 1 : 0.04;
    this.stamp.scale.x += (stampScale - this.stamp.scale.x) * ease;
    this.stamp.scale.z = this.stamp.scale.x;
    this.stamp.material.opacity = sold ? 0.85 : 0;
    const gather = n >= 3 && !lost;
    this.villas.forEach((villa, i) => {
      const home = lost ? villa.home.clone().add(new THREE.Vector3((i - 2) * 0.55, 0, i % 2 * 0.7)) : villa.home;
      const pile = new THREE.Vector3(0.55 + i % 3 * 0.38, 0.32, 1.05 + Math.floor(i / 3) * 0.28);
      const goal = gather ? pile : home;
      villa.mesh.position.lerp(goal, ease);
      const mat = villa.mesh.material;
      mat.color.copy(lost ? CRIMSON : gather ? PAPER : SAND);
      mat.opacity = lost ? 0.78 : gather ? 0.7 : 0.32;
    });
    this.lotMats.forEach((mat) => {
      mat.opacity = gather ? 0.04 : lost ? 0.7 : 0.4;
      mat.color.copy(lost ? CRIMSON : SAND);
    });
    const restored = n >= 4 && !lost;
    this.fills.forEach((mesh, i) => {
      const y = restored ? 1.35 + i * 0.08 : lost ? 0.22 : 0.16;
      mesh.position.y += (y - mesh.position.y) * ease;
      const mat = mesh.material;
      mat.opacity = restored ? 0.05 : 0.82;
      mat.color.copy(lost ? CRIMSON : FILL);
    });
    this.wetMat.color.copy(lost ? CRIMSON : restored || held ? SEA : WET);
    this.wetMat.opacity = restored ? 0.82 : lost ? 0.5 : 0.62;
    const floodScale = restored ? 0.15 : lost ? 1.7 : 1;
    this.flood.scale.z += (floodScale - this.flood.scale.z) * ease;
    this.floodMat.color.copy(lost ? CRIMSON : restored ? SEA : FILL);
    this.floodMat.opacity = restored ? 0.08 : lost ? 0.62 : 0.38;
    const clean = n >= 5 && !lost;
    this.pageMat.color.copy(clean ? PAPER : lost ? CRIMSON : PAPER);
    this.pageMat.opacity = clean ? 0.96 : lost ? 0.7 : 0.9;
    this.signBits.forEach((bit) => {
      const home = bit.userData.home;
      const fly = bit.userData.fly;
      const goal = clean ? home.clone().add(fly) : home;
      bit.position.lerp(goal, ease);
      const mat = bit.material;
      mat.color.copy(CRIMSON);
      mat.opacity = clean ? 0 : lost ? 0.85 + Math.sin(t * 5) * 0.15 : 1;
    });
    const farmed = n >= 6 && !lost;
    this.slabHalves.forEach((half, i) => {
      const x = farmed ? i === 0 ? -0.72 : 0.42 : i === 0 ? -0.18 : 0.08;
      half.position.x += (x - half.position.x) * ease;
      const mat = half.material;
      mat.color.copy(lost ? CRIMSON : FILL);
      mat.opacity = farmed ? 0.16 : 0.88;
    });
    this.crops.forEach((crop, i) => {
      const s = farmed ? 1 : 0.02;
      crop.scale.y += (s - crop.scale.y) * ease;
      crop.position.y = 0.04 + crop.scale.y * 0.22;
      const mat = crop.material;
      mat.opacity = farmed ? 0.92 : 0;
      if (!reduced && farmed) crop.rotation.y = Math.sin(t * 1.4 + i) * 0.08;
    });
    const warm = held || n >= 6;
    this.windows.forEach((mat) => {
      mat.color.copy(warm ? WINDOW : lost ? VOID : WINDOW);
      mat.opacity = warm ? 0.95 : lost ? 0.06 : 0.26;
    });
    if (this.clerk) {
      const signing = !clean && !lost;
      const swing = signing && !reduced ? Math.sin(t * 3.1) * 0.2 : 0;
      const aim = (signing ? -1.05 : -0.35) + swing;
      this.clerk.armR.rotation.x += (aim - this.clerk.armR.rotation.x) * ease;
    }
    this.strollers.forEach((walker) => {
      const trip = reduced ? walker.phase : t * 0.28 + walker.phase;
      const dir = Math.sin(trip) >= 0 ? 1 : -1;
      walker.root.position.x = walker.homeX + Math.sin(trip) * 1.7;
      walker.root.position.z = walker.homeZ;
      walker.root.rotation.y = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      const step = reduced ? 0 : Math.sin(t * 4.2 + walker.phase) * 0.7;
      walker.legL.rotation.x = step;
      walker.legR.rotation.x = -step;
      walker.armL.rotation.x = -step * 0.6;
      walker.armR.rotation.x = step * 0.6;
      walker.root.position.y = reduced ? 0 : Math.abs(Math.sin(t * 4.2 + walker.phase)) * 0.03;
    });
    if (!reduced) {
      this.crowns?.forEach((crown, i) => {
        crown.rotation.z = Math.sin(t * 0.8 + i) * 0.03;
        crown.rotation.x = Math.cos(t * 0.6 + i) * 0.02;
      });
    }
    this.seaMat.uniforms.uTime.value = reduced ? 0.4 : t;
  }
  dispose() {
    this.group.removeFromParent();
    for (const g of this.geos) g.dispose();
    const mats = [
      ...this.windows,
      ...this.pathMats,
      ...this.plotMats,
      ...this.lotMats,
      this.ropeMat,
      this.wetMat,
      this.floodMat,
      this.seaMat,
      this.pageMat,
      this.stamp.material
    ];
    for (const m of mats) m.dispose();
    for (const m of this.folkMats ?? []) m.dispose();
    for (const mesh of [...this.boardHalves, ...this.fills, ...this.signBits, ...this.slabHalves, ...this.crops, ...this.villas.map((v) => v.mesh)]) {
      mesh.material.dispose();
    }
  }
  buildVillage() {
    const spots = [-7.2, -5.2, -3.4, -1.6, 0.2, 2, 3.8, 5.6, 7.2];
    const parts = { fills: [], lines: [] };
    spots.forEach((x, i) => {
      const h = 0.7 + i % 3 * 0.28;
      const z = -13.5 - i % 2 * 1.2;
      box(this.group, this.geos, parts, x, h / 2, z, 1.15, h, 0.9, 0xd5d6d2, 0.94);
      box(this.group, this.geos, parts, x, h + 0.05, z, 1.28, 0.08, 1.02, 0x1a1c1f, 0.96);
      const win = new THREE.Mesh(
        new THREE.PlaneGeometry(0.28, 0.22),
        new THREE.MeshStandardMaterial({ color: WINDOW, roughness: 0.35, metalness: 0.05, emissive: WINDOW, emissiveIntensity: 0.15, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
      );
      this.geos.push(win.geometry);
      this.windows.push(win.material);
      win.position.set(x, h * 0.62, z + 0.46);
      this.group.add(win);
    });
  }
  buildGround() {
    const parts = { fills: [], lines: [] };
    box(this.group, this.geos, parts, 0, -0.08, 1.4, 18, 0.08, 16, SAND, 0.28);
    const seaGeo = new THREE.PlaneGeometry(20, 7, 32, 12);
    this.geos.push(seaGeo);
    this.seaMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: SEA }
      },
      vertexShader: `
        uniform float uTime;
        varying float vH;
        varying float vShore;
        void main() {
          vec3 p = position;
          float roll = sin(p.y * 1.7 - uTime * 1.45);
          float cross = sin(p.x * 0.4 + p.y * 2.3 - uTime * 1.85);
          float wave = roll * 0.045 + cross * 0.026;
          p.z += wave;
          vH = wave;
          vShore = p.y;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vH;
        varying float vShore;
        void main() {
          float shore = smoothstep(1.15, 3.35, vShore);
          float crest = smoothstep(0.0, 0.045, vH);
          vec3 foam = vec3(0.82, 0.93, 0.96);
          vec3 col = mix(uColor, foam, crest * 0.72 + shore * 0.55);
          gl_FragColor = vec4(col, 0.5 + crest * 0.22 + shore * 0.28);
        }
      `
    });
    const sea = new THREE.Mesh(seaGeo, this.seaMat);
    sea.rotation.x = -Math.PI / 2;
    sea.position.set(0, 0.02, 8.4);
    this.group.add(sea);
  }
  buildPath() {
    for (let i = 0; i < 5; i++) {
      const geo2 = new THREE.BoxGeometry(0.7, 0.04, 0.85);
      this.geos.push(geo2);
      const mat2 = new THREE.MeshStandardMaterial({ color: SAND, roughness: 0.9, transparent: true, opacity: 0.9 });
      this.pathMats.push(mat2);
      const mesh = new THREE.Mesh(geo2, mat2);
      mesh.position.set(0.05, 0.04, 5.6 - i * 0.9);
      this.group.add(mesh);
    }
    const posts = { fills: [], lines: [] };
    box(this.group, this.geos, posts, -0.7, 0.5, 5.5, 0.08, 1, 0.08, PAPER, 0.7);
    box(this.group, this.geos, posts, 0.8, 0.5, 5.5, 0.08, 1, 0.08, PAPER, 0.7);
    const geo = new THREE.BoxGeometry(1.6, 0.045, 0.045);
    this.geos.push(geo);
    const mat = new THREE.MeshStandardMaterial({ color: 0x6d5a40, roughness: 0.6, metalness: 0.05, transparent: true, opacity: 0.92 });
    const rope = new THREE.Mesh(geo, mat);
    rope.position.set(0.05, 0.86, 5.5);
    this.group.add(rope);
    return rope;
  }
  buildPlot() {
    const ring = [
      [2.3, 0.05, 2.6, 2.4, 0.05, 0.06],
      [2.3, 0.05, 0.6, 2.4, 0.05, 0.06],
      [1.1, 0.05, 1.6, 0.06, 0.05, 2.05],
      [3.5, 0.05, 1.6, 0.06, 0.05, 2.05]
    ];
    for (const [x, y, z, w, h, d] of ring) {
      const geo = new THREE.BoxGeometry(w, h, d);
      this.geos.push(geo);
      const mat = new THREE.MeshStandardMaterial({ color: SAND, roughness: 0.85, transparent: true, opacity: 0.9 });
      this.plotMats.push(mat);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      this.group.add(mesh);
    }
    const stampGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.04, 6);
    this.geos.push(stampGeo);
    const stamp = new THREE.Mesh(
      stampGeo,
      new THREE.MeshStandardMaterial({ color: STATE, roughness: 0.45, metalness: 0.1, transparent: true, opacity: 0 })
    );
    stamp.position.set(2.3, 0.08, 1.6);
    stamp.scale.set(0.04, 1, 0.04);
    this.group.add(stamp);
    [-0.28, 0.28].forEach((x, i) => {
      const geo = new THREE.BoxGeometry(0.5, 0.7, 0.06);
      this.geos.push(geo);
      const mesh = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({ color: 0xf4f5f3, roughness: 0.55, transparent: true, opacity: 0.9 })
      );
      mesh.position.set(2.3 + x, 0.95, 3.35);
      this.boardHalves.push(mesh);
      this.group.add(mesh);
      if (i === 0) {
        const post = { fills: [], lines: [] };
        box(this.group, this.geos, post, 2.3, 0.4, 3.35, 0.06, 0.8, 0.06, PAPER, 0.7);
      }
    });
    return stamp;
  }
  buildVillas() {
    const homes = [
      [-1.6, 0.28, 2.8],
      [-0.4, 0.22, 3.4],
      [0.8, 0.3, 3.6],
      [3.8, 0.24, 3.2],
      [4.6, 0.2, 2.2],
      [4.2, 0.26, 0.4]
    ];
    homes.forEach(([x, y, z], i) => {
      const geo = new THREE.BoxGeometry(0.42, 0.36, 0.42);
      this.geos.push(geo);
      const mesh = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({ color: 0xd5d6d2, roughness: 0.45, metalness: 0.08, transparent: true, opacity: 0.95 })
      );
      mesh.position.set(x, y, z);
      mesh.visible = false;
      this.villas.push({ mesh, home: new THREE.Vector3(x, y, z) });
      this.group.add(mesh);
      if (i < 4) {
        const line = new THREE.BoxGeometry(1.1, 0.02, 0.03);
        this.geos.push(line);
        const mat = new THREE.MeshStandardMaterial({ color: SAND, roughness: 0.8, transparent: true, opacity: 0.5 });
        this.lotMats.push(mat);
        const mark = new THREE.Mesh(line, mat);
        mark.position.set(-0.6 + i * 1.1, 0.05, 3.1);
        mark.rotation.y = i % 2 ? 0.4 : -0.2;
        mark.visible = false;
        this.group.add(mark);
      }
    });
  }
  buildWetland() {
    const cx = -4.2;
    const cz = 0.45;
    const addPool = (x, z, r) => {
      const geo = new THREE.CircleGeometry(r, 28);
      this.geos.push(geo);
      if (!this.wetMat) {
        this.wetMat = new THREE.MeshStandardMaterial({ color: WET, roughness: 0.25, metalness: 0.05, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
      }
      const wet = new THREE.Mesh(geo, this.wetMat);
      wet.rotation.x = -Math.PI / 2;
      wet.position.set(x, 0.03, z);
      this.group.add(wet);
    };
    addPool(cx, cz, 3.05);
    addPool(cx + 1.7, cz + 1.35, 1.7);
    const reedMat = new THREE.MeshStandardMaterial({ color: 0x2f6b34, roughness: 0.7 });
    (this.folkMats ??= []).push(reedMat);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const geo = new THREE.ConeGeometry(0.05, 0.38, 4);
      this.geos.push(geo);
      const reed = new THREE.Mesh(geo, reedMat);
      reed.position.set(cx + Math.cos(a) * 2.7, 0.18, cz + Math.sin(a) * 2.2);
      this.group.add(reed);
    }
    [-0.7, 0.15, 0.95].forEach((x, i) => {
      const g = new THREE.BoxGeometry(0.85, 0.32, 0.7);
      this.geos.push(g);
      const mesh = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: FILL, roughness: 0.9, transparent: true, opacity: 0.9 }));
      mesh.position.set(cx + x, 0.16, cz + 0.15 + i * 0.16);
      this.fills.push(mesh);
      this.group.add(mesh);
    });
    const floodGeo = new THREE.BoxGeometry(0.7, 0.03, 4.6);
    this.geos.push(floodGeo);
    this.floodMat = new THREE.MeshStandardMaterial({ color: FILL, roughness: 0.3, transparent: true, opacity: 0.55 });
    this.flood = new THREE.Mesh(floodGeo, this.floodMat);
    this.flood.position.set(cx, 0.05, cz - 3.3);
    this.group.add(this.flood);
  }
  buildPermit() {
    const dx = 4.35;
    const dz = 2.35;
    const desk = { fills: [], lines: [] };
    box(this.group, this.geos, desk, dx, 0.72, dz, 1.15, 0.07, 0.62, 0x6a5344, 0.96);
    box(this.group, this.geos, desk, dx - 0.46, 0.34, dz - 0.2, 0.07, 0.68, 0.07, 0x4a382c, 0.96);
    box(this.group, this.geos, desk, dx + 0.46, 0.34, dz - 0.2, 0.07, 0.68, 0.07, 0x4a382c, 0.96);
    box(this.group, this.geos, desk, dx - 0.46, 0.34, dz + 0.2, 0.07, 0.68, 0.07, 0x4a382c, 0.96);
    box(this.group, this.geos, desk, dx + 0.46, 0.34, dz + 0.2, 0.07, 0.68, 0.07, 0x4a382c, 0.96);
    const geo = new THREE.BoxGeometry(0.46, 0.012, 0.32);
    this.geos.push(geo);
    this.pageMat = new THREE.MeshStandardMaterial({ color: PAPER, roughness: 0.8 });
    const page = new THREE.Mesh(geo, this.pageMat);
    page.position.set(dx + 0.08, 0.77, dz);
    this.group.add(page);
    const strokes = [
      { x: -0.08, z: 0.06, w: 0.16, d: 0.02, rot: 0.4 },
      { x: 0.04, z: 0.01, w: 0.18, d: 0.02, rot: -0.2 },
      { x: 0.1, z: -0.04, w: 0.12, d: 0.02, rot: 0.5 },
      { x: 0, z: -0.08, w: 0.22, d: 0.018, rot: 0.05 }
    ];
    strokes.forEach((stroke, i) => {
      const mark = new THREE.BoxGeometry(stroke.w, 0.02, stroke.d);
      this.geos.push(mark);
      const bit = new THREE.Mesh(mark, new THREE.MeshStandardMaterial({ color: CRIMSON, roughness: 0.5, transparent: true, opacity: 1 }));
      bit.position.set(page.position.x + stroke.x, 0.79, page.position.z + stroke.z);
      bit.rotation.y = stroke.rot;
      bit.userData.home = bit.position.clone();
      bit.userData.fly = new THREE.Vector3((i - 1.5) * 0.16, 0.46, 0.1);
      this.signBits.push(bit);
      this.group.add(bit);
    });
    box(this.group, this.geos, desk, dx, 0.42, dz - 0.48, 0.42, 0.06, 0.4, 0x4a382c, 0.96);
    box(this.group, this.geos, desk, dx, 0.72, dz - 0.66, 0.42, 0.36, 0.06, 0x4a382c, 0.96);
    this.clerk = this.figure({
      x: dx - 0.02,
      y: 0.36,
      z: dz - 0.48,
      yaw: 0,
      skin: 0xc48a62,
      shirt: 0x243044,
      pants: 0x1c2430,
      beard: true,
      shades: true,
      scale: 0.92
    });
    const penGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.16, 6);
    this.geos.push(penGeo);
    const pen = new THREE.Mesh(penGeo, this.folkMat(0x1a1c1f));
    pen.position.set(0.02, -0.42, 0.04);
    pen.rotation.x = 1.2;
    this.clerk.armR.add(pen);
  }
  folkMat(color) {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0.04 });
    (this.folkMats ??= []).push(m);
    return m;
  }
  figure(opts) {
    const g = new THREE.Group();
    const skin = this.folkMat(opts.skin ?? 0xd7b39a);
    const shirt = this.folkMat(opts.shirt);
    const pants = this.folkMat(opts.pants);
    const put = (parent, geo, material, x, y, z) => {
      this.geos.push(geo);
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      parent.add(mesh);
      return mesh;
    };
    const legL = new THREE.Group();
    const legR = new THREE.Group();
    legL.position.set(-0.09, 0.46, 0);
    legR.position.set(0.09, 0.46, 0);
    g.add(legL, legR);
    put(legL, new THREE.CapsuleGeometry(0.055, 0.28, 3, 6), pants, 0, -0.2, 0);
    put(legR, new THREE.CapsuleGeometry(0.055, 0.28, 3, 6), pants, 0, -0.2, 0);
    put(g, new THREE.BoxGeometry(0.32, 0.38, 0.16), shirt, 0, 0.78, 0);
    if (opts.vest) put(g, new THREE.BoxGeometry(0.36, 0.26, 0.18), this.folkMat(opts.vest), 0, 0.82, 0.02);
    const armL = new THREE.Group();
    const armR = new THREE.Group();
    armL.position.set(-0.22, 0.92, 0);
    armR.position.set(0.22, 0.92, 0);
    g.add(armL, armR);
    put(armL, new THREE.CapsuleGeometry(0.045, 0.26, 3, 6), shirt, 0, -0.18, 0);
    put(armR, new THREE.CapsuleGeometry(0.045, 0.26, 3, 6), skin, 0, -0.18, 0);
    const head = new THREE.Group();
    head.position.set(0, 1.12, 0);
    g.add(head);
    put(head, new THREE.SphereGeometry(0.13, 12, 10), skin, 0, 0.06, 0);
    if (opts.hair) put(head, new THREE.SphereGeometry(0.135, 10, 8), this.folkMat(opts.hair), 0, 0.12, -0.02);
    if (opts.beard) put(head, new THREE.SphereGeometry(0.09, 8, 6), this.folkMat(0x1a120e), 0, -0.02, 0.05);
    if (opts.shades) put(head, new THREE.BoxGeometry(0.18, 0.045, 0.03), this.folkMat(0x14181c), 0, 0.08, 0.11);
    if (opts.hat) {
      const brim = put(head, new THREE.CylinderGeometry(0.16, 0.16, 0.04, 10), this.folkMat(opts.hat), 0, 0.14, 0);
      brim.scale.y = 1;
      const crown = put(head, new THREE.SphereGeometry(0.12, 10, 8), this.folkMat(opts.hat), 0, 0.2, 0);
      crown.scale.y = 0.55;
    }
    g.position.set(opts.x, opts.y ?? 0, opts.z);
    g.rotation.y = opts.yaw ?? 0;
    if (opts.scale) g.scale.setScalar(opts.scale);
    this.group.add(g);
    return { root: g, legL, legR, armL, armR, head };
  }
  buildCrew() {
    this.crew = [];
    const spots = [
      [0.05, 2.55, 0.4],
      [-0.85, 1.85, 0.9],
      [-1.75, 1.25, 1.3]
    ];
    const hats = [0xf0c400, 0xf08a1a, 0xf4f5f3];
    spots.forEach(([x, z, yaw], i) => {
      const worker = this.figure({
        x, z, yaw,
        shirt: 0x2a3444,
        pants: 0x3a332c,
        vest: i === 1 ? 0xf08a1a : 0xf0c400,
        hat: hats[i],
        scale: 1.05
      });
      this.crew.push(worker);
    });
    const deck = { fills: [], lines: [] };
    for (let i = 0; i < 5; i++) {
      const t = i / 4;
      box(this.group, this.geos, deck, 0.15 + ( -1.9 - 0.15) * t, 0.05, 2.7 + (1.05 - 2.7) * t, 0.55, 0.04, 0.42, 0x8a6a42, 0.95);
    }
  }
  buildShoreWalk() {
    this.strollers = [
      { x: -3.4, z: 4.55, shirt: 0x3a6fd8, pants: 0x243044, hair: 0x2a1814, phase: 0.2 },
      { x: -0.8, z: 4.75, shirt: 0xc45b78, pants: 0x2a2428, hair: 0x1a1214, phase: 1.4 },
      { x: 1.8, z: 4.5, shirt: 0x3f6f62, pants: 0x2c241c, hair: 0x3a2418, phase: 2.5 },
      { x: 4.1, z: 4.85, shirt: 0xd4a017, pants: 0x1c2430, hair: 0x24180f, phase: 3.6 }
    ].map((spot) => {
      const walker = this.figure({
        x: spot.x,
        z: spot.z,
        yaw: Math.PI / 2,
        shirt: spot.shirt,
        pants: spot.pants,
        hair: spot.hair,
        scale: 0.98
      });
      walker.homeX = spot.x;
      walker.homeZ = spot.z;
      walker.phase = spot.phase;
      return walker;
    });
  }
  buildGreenery() {
    this.crowns = [];
    const leaf = [0x2f6b34, 0x3d7a3c, 0x1f4d2c, 0x4e8a45];
    const put = (parent, geo, material, x, y, z) => {
      this.geos.push(geo);
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };
    const tree = (x, z, h, kind) => {
      const g = new THREE.Group();
      const trunk = this.folkMat(0x5c4030);
      const crownMat = this.folkMat(leaf[kind % leaf.length]);
      put(g, new THREE.CylinderGeometry(0.08 * h, 0.12 * h, h * 0.55, 6), trunk, 0, h * 0.28, 0);
      const crown = new THREE.Group();
      crown.position.y = h * 0.62;
      g.add(crown);
      if (kind % 2 === 0) {
        put(crown, new THREE.ConeGeometry(0.55 * h, h * 0.72, 7), crownMat, 0, 0.1, 0);
        put(crown, new THREE.ConeGeometry(0.38 * h, h * 0.48, 7), this.folkMat(leaf[(kind + 1) % leaf.length]), 0, h * 0.28, 0);
      } else {
        put(crown, new THREE.SphereGeometry(0.42 * h, 10, 8), crownMat, 0, 0.05, 0);
        put(crown, new THREE.SphereGeometry(0.28 * h, 8, 6), this.folkMat(leaf[(kind + 2) % leaf.length]), 0.22 * h, -0.05, 0.1);
        put(crown, new THREE.SphereGeometry(0.22 * h, 8, 6), this.folkMat(leaf[(kind + 1) % leaf.length]), -0.18 * h, 0.02, -0.08);
      }
      g.position.set(x, 0, z);
      this.group.add(g);
      this.crowns.push(crown);
    };
    const bush = (x, z, s) => {
      const g = new THREE.Group();
      const mat = this.folkMat(leaf[(Math.abs(Math.round(x * 3 + z)) ) % leaf.length]);
      put(g, new THREE.SphereGeometry(0.28 * s, 8, 6), mat, 0, 0.22 * s, 0);
      put(g, new THREE.SphereGeometry(0.2 * s, 8, 6), this.folkMat(0x245c30), 0.18 * s, 0.16 * s, 0.06 * s);
      put(g, new THREE.SphereGeometry(0.16 * s, 7, 6), this.folkMat(0x3f7a3a), -0.16 * s, 0.14 * s, -0.04 * s);
      g.position.set(x, 0, z);
      this.group.add(g);
    };
    [
      [-7.5, -0.6, 2.4, 0],
      [-6.4, 3.1, 1.9, 1],
      [-6.8, -4.6, 2.6, 2],
      [-2.4, -7.4, 2.2, 1],
      [1.6, -8.2, 2.7, 0],
      [5.2, -6.4, 2.3, 3],
      [7.2, -1.4, 2.5, 1],
      [7.0, 2.4, 1.8, 0],
      [-7.6, -7.2, 2.1, 2],
      [3.6, -4.8, 1.7, 3],
    ].forEach(([x, z, h, kind]) => tree(x, z, h, kind));
    [
      [-6.6, 0.4, 1.3],
      [-2.8, -1.8, 1.1],
      [-1.2, 3.5, 0.9],
      [1.5, 3.7, 1.15],
      [5.8, 1.15, 1.05],
      [2.6, 4.15, 0.85],
      [-0.2, -3.6, 1.2],
      [1.6, -3.5, 0.95],
      [-5.4, 2.2, 1.0],
      [6.2, 3.6, 1.1],
      [-3.6, 3.3, 0.8],
      [4.8, -3.2, 1.25],
    ].forEach(([x, z, s]) => bush(x, z, s));
  }
  buildField() {
    [-0.18, 0.08].forEach((x) => {
      const geo = new THREE.BoxGeometry(0.55, 0.08, 1.3);
      this.geos.push(geo);
      const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x8a847c, roughness: 0.85, transparent: true, opacity: 0.9 }));
      mesh.position.set(x, 0.08, -2.4);
      this.slabHalves.push(mesh);
      this.group.add(mesh);
    });
    const spots = [
      [-0.55, -2.9],
      [-0.15, -2.7],
      [0.25, -2.95],
      [-0.4, -2.15],
      [0.15, -1.95],
      [0.5, -2.35]
    ];
    for (const [x, z] of spots) {
      const geo = new THREE.ConeGeometry(0.1, 0.42, 5);
      this.geos.push(geo);
      const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: CROP, roughness: 0.6, transparent: true, opacity: 0 }));
      mesh.position.set(x, 0.06, z);
      mesh.scale.y = 0.02;
      this.crops.push(mesh);
      this.group.add(mesh);
    }
  }
};
export {
  LandScene
};
