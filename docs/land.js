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
function box(group, geos, parts, x, y, z, w, h, d, color, fill = 0.5) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const edges = new THREE.EdgesGeometry(geo);
  geos.push(geo, edges);
  const fillMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: fill, depthWrite: true });
  const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 });
  parts.fills.push(fillMat);
  parts.lines.push(lineMat);
  const mesh = new THREE.Mesh(geo, fillMat);
  const line = new THREE.LineSegments(edges, lineMat);
  mesh.position.set(x, y, z);
  line.position.set(x, y, z);
  group.add(mesh, line);
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
    this.buildField();
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
      box(this.group, this.geos, parts, x, h / 2, z, 1.15, h, 0.9, HOUSE, 0.35);
      const win = new THREE.Mesh(
        new THREE.PlaneGeometry(0.28, 0.22),
        new THREE.MeshBasicMaterial({ color: WINDOW, transparent: true, opacity: 0.26, side: THREE.DoubleSide })
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
        void main() {
          vec3 p = position;
          float w = sin(p.x * 0.62 + uTime * 1.25) * 0.09 + sin(p.y * 1.05 + uTime * 0.85) * 0.05;
          p.z += w;
          vH = w;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vH;
        void main() {
          float crest = smoothstep(-0.01, 0.09, vH);
          vec3 col = mix(uColor, vec3(0.78, 0.95, 1.0), crest * 0.7);
          gl_FragColor = vec4(col, 0.46 + crest * 0.28);
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
      const mat2 = new THREE.MeshBasicMaterial({ color: SAND, transparent: true, opacity: 0.22 });
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
    const mat = new THREE.MeshBasicMaterial({ color: SAND, transparent: true, opacity: 0.92 });
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
      const mat = new THREE.MeshBasicMaterial({ color: SAND, transparent: true, opacity: 0.45 });
      this.plotMats.push(mat);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      this.group.add(mesh);
    }
    const stampGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.04, 6);
    this.geos.push(stampGeo);
    const stamp = new THREE.Mesh(
      stampGeo,
      new THREE.MeshBasicMaterial({ color: STATE, transparent: true, opacity: 0 })
    );
    stamp.position.set(2.3, 0.08, 1.6);
    stamp.scale.set(0.04, 1, 0.04);
    this.group.add(stamp);
    [-0.28, 0.28].forEach((x, i) => {
      const geo = new THREE.BoxGeometry(0.5, 0.7, 0.06);
      this.geos.push(geo);
      const mesh = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ color: SAND, transparent: true, opacity: 0.88 })
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
        new THREE.MeshBasicMaterial({ color: SAND, transparent: true, opacity: 0.32 })
      );
      mesh.position.set(x, y, z);
      this.villas.push({ mesh, home: new THREE.Vector3(x, y, z) });
      this.group.add(mesh);
      if (i < 4) {
        const line = new THREE.BoxGeometry(1.1, 0.02, 0.03);
        this.geos.push(line);
        const mat = new THREE.MeshBasicMaterial({ color: SAND, transparent: true, opacity: 0.4 });
        this.lotMats.push(mat);
        const mark = new THREE.Mesh(line, mat);
        mark.position.set(-0.6 + i * 1.1, 0.05, 3.1);
        mark.rotation.y = i % 2 ? 0.4 : -0.2;
        this.group.add(mark);
      }
    });
  }
  buildWetland() {
    const geo = new THREE.CircleGeometry(1.7, 24);
    this.geos.push(geo);
    this.wetMat = new THREE.MeshBasicMaterial({ color: WET, transparent: true, opacity: 0.62, side: THREE.DoubleSide });
    const wet = new THREE.Mesh(geo, this.wetMat);
    wet.rotation.x = -Math.PI / 2;
    wet.position.set(-3.5, 0.03, 0.8);
    this.group.add(wet);
    [-0.55, 0.1, 0.7].forEach((x, i) => {
      const g = new THREE.BoxGeometry(0.62, 0.26, 0.5);
      this.geos.push(g);
      const mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: FILL, transparent: true, opacity: 0.82 }));
      mesh.position.set(-3.5 + x, 0.16, 0.7 + i * 0.12);
      this.fills.push(mesh);
      this.group.add(mesh);
    });
    const floodGeo = new THREE.BoxGeometry(0.55, 0.03, 4.2);
    this.geos.push(floodGeo);
    this.floodMat = new THREE.MeshBasicMaterial({ color: FILL, transparent: true, opacity: 0.38 });
    this.flood = new THREE.Mesh(floodGeo, this.floodMat);
    this.flood.position.set(-3.5, 0.05, -2.2);
    this.group.add(this.flood);
  }
  buildPermit() {
    const geo = new THREE.BoxGeometry(0.58, 0.74, 0.04);
    const edges = new THREE.EdgesGeometry(geo);
    this.geos.push(geo, edges);
    this.pageMat = new THREE.MeshBasicMaterial({ color: PAPER, transparent: true, opacity: 0.9, depthWrite: true });
    const page = new THREE.Mesh(geo, this.pageMat);
    page.position.set(5.55, 0.82, 2.55);
    const frame = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: PAPER, transparent: true, opacity: 0.95 }));
    frame.position.copy(page.position);
    this.group.add(page, frame);
    const strokes = [
      { x: -0.12, y: 0.08, w: 0.22, h: 0.03, rot: 0.4 },
      { x: 0.02, y: 0, w: 0.26, h: 0.03, rot: -0.22 },
      { x: 0.13, y: 0.07, w: 0.16, h: 0.03, rot: 0.55 },
      { x: 0, y: -0.1, w: 0.32, h: 0.028, rot: 0.06 },
      { x: -0.11, y: -0.16, w: 0.14, h: 0.028, rot: -0.45 },
      { x: 0.1, y: -0.16, w: 0.12, h: 0.028, rot: 0.3 }
    ];
    strokes.forEach((stroke, i) => {
      const mark = new THREE.BoxGeometry(stroke.w, stroke.h, 0.03);
      this.geos.push(mark);
      const bit = new THREE.Mesh(
        mark,
        new THREE.MeshBasicMaterial({ color: CRIMSON, transparent: true, opacity: 1, depthWrite: true })
      );
      bit.position.set(page.position.x + stroke.x, page.position.y + stroke.y, page.position.z + 0.04);
      bit.rotation.z = stroke.rot;
      bit.userData.home = bit.position.clone();
      bit.userData.fly = new THREE.Vector3((i - 2.5) * 0.18, 0.42, 0.12);
      this.signBits.push(bit);
      this.group.add(bit);
    });
  }
  buildField() {
    [-0.18, 0.08].forEach((x) => {
      const geo = new THREE.BoxGeometry(0.55, 0.08, 1.3);
      this.geos.push(geo);
      const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: FILL, transparent: true, opacity: 0.88 }));
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
      const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: CROP, transparent: true, opacity: 0 }));
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
