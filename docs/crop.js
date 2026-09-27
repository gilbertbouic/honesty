// src/lib/game/crop-scene.ts
import * as THREE from "three";
var LEAF = new THREE.Color(7323507);
var SOIL = new THREE.Color(7031346);
var FRUIT = new THREE.Color(13781818);
var CHILLI = new THREE.Color(12857646);
var HERB = new THREE.Color(4165450);
var CABBAGE = new THREE.Color(9418090);
var CUBE = new THREE.Color(5216837);
var WILT = new THREE.Color(9071170);
var DRIFT = new THREE.Color(13029962);
var CLEAR = new THREE.Color(4165482);
var RIVER = [
  [-5.2, -2.15],
  [-2.6, -1.45],
  [-0.4, -0.15],
  [1.6, 0.55],
  [3.4, 1.45],
  [5.15, 2.25]
];
var CropScene = class {
  group = new THREE.Group();
  geos = [];
  mats = [];
  plots = [];
  competition = "tender";
  outcome = "open";
  correct = 0;
  riverMat;
  sprayer = new THREE.Group();
  mist = new THREE.Group();
  mistMat;
  can = new THREE.Group();
  bearer = new THREE.Group();
  constructor(scene) {
    this.riverMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { uTime: { value: 0 }, uStain: { value: 0.2 } },
      vertexShader: `
        varying float vFlow;
        void main() {
          vFlow = position.x;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uStain;
        varying float vFlow;
        void main() {
          float rip = sin(vFlow * 7.0 - uTime * 2.2) * 0.5 + 0.5;
          vec3 water = mix(vec3(0.28, 0.58, 0.68), vec3(0.62, 0.74, 0.22), uStain);
          water += rip * 0.07;
          gl_FragColor = vec4(water, 0.86);
        }
      `
    });
    this.mats.push(this.riverMat);
    this.buildSoil();
    this.buildRiver();
    this.tree(-1.7, -1.85, 1.35);
    this.tree(-5.35, 0.35, 0.72);
    this.tree(5.15, -1.35, 0.78);
    this.plots = [
      this.lettuce(-4.2, 1.2),
      this.tomato(-2.5, -0.6),
      this.chilli(-0.8, 1.4),
      this.herb(0.9, -0.8),
      this.cabbage(2.6, 1.1),
      this.cucumber(4.3, -0.4)
    ];
    this.buildPeople();
    this.group.visible = false;
    scene.add(this.group);
  }
  sync(competition, outcome, correct) {
    this.competition = competition;
    this.outcome = outcome;
    this.correct = correct;
  }
  tick(dt, t, reduced) {
    const on = this.competition === "crop";
    this.group.visible = on;
    if (!on) return;
    const grown = this.outcome === "grown";
    const bare = this.outcome === "bare";
    const thin = this.outcome === "thin";
    const lit = grown ? 6 : bare ? 0 : this.correct;
    const ease = reduced ? 1 : 1 - Math.exp(-2.4 * dt);
    this.plots.forEach((plot2, i) => {
      const open = i < lit;
      const target = open ? 1 : 0.28;
      const s = plot2.group.scale.x + (target - plot2.group.scale.x) * ease;
      plot2.group.scale.set(s, s, s);
      plot2.mats.forEach((mat) => {
        const base = mat.userData.base;
        mat.color.copy(!open && bare ? WILT : base);
        mat.opacity = open ? 0.95 : 0.55;
      });
    });
    const idx = Math.min(5, lit);
    const plot = this.plots[idx];
    const sx = plot.x + 0.7;
    const sz = plot.z + 0.35;
    this.sprayer.position.x += (sx - this.sprayer.position.x) * ease;
    this.sprayer.position.z += (sz - this.sprayer.position.z) * ease;
    this.sprayer.position.y = reduced ? 0 : Math.sin(t * 3) * 0.03;
    this.sprayer.rotation.y = Math.atan2(plot.x - sx, plot.z - sz);
    const drift = grown ? 0.05 : bare ? 1 : thin ? 0.7 : 0.82;
    const pull = this.nearestRiver(plot.x, plot.z);
    const mx = plot.x + (pull[0] - plot.x) * drift * 0.55;
    const mz = plot.z + (pull[1] - plot.z) * drift * 0.55;
    this.mist.position.x += (mx - this.mist.position.x) * ease;
    this.mist.position.z += (mz - this.mist.position.z) * ease;
    this.mist.position.y = grown ? 0.35 : 0.7 + (reduced ? 0 : Math.sin(t * 2) * 0.05);
    const ms = grown ? 0.35 : bare ? 1.35 : thin ? 0.9 : 1;
    const mnow = this.mist.scale.x + (ms - this.mist.scale.x) * ease;
    this.mist.scale.setScalar(mnow);
    this.mistMat.color.copy(grown ? CLEAR : DRIFT);
    this.mistMat.opacity = grown ? 0.28 : 0.42;
    const stain = grown ? 0 : bare ? 1 : thin ? 0.55 : (1 - this.correct / 6) * 0.28;
    const cur = this.riverMat.uniforms.uStain.value;
    this.riverMat.uniforms.uStain.value = cur + (stain - cur) * ease;
    this.riverMat.uniforms.uTime.value = reduced ? 0 : t;
    const ended = grown || bare || thin;
    const tip = ended && !grown ? 1.2 : 0;
    this.can.rotation.z += (tip - this.can.rotation.z) * ease;
    const canY = grown ? 0.22 : 0.85;
    this.can.position.y += (canY - this.can.position.y) * ease;
    this.bearer.rotation.y = ended && !grown ? 0.6 : 0.15;
    if (!reduced) this.group.position.y = Math.sin(t * 0.6) * 0.015;
  }
  dispose() {
    this.group.removeFromParent();
    for (const g of this.geos) g.dispose();
    for (const m of this.mats) m.dispose();
  }
  nearestRiver(x, z) {
    let best = RIVER[0];
    let dist = Infinity;
    for (const p of RIVER) {
      const d = (p[0] - x) ** 2 + (p[1] - z) ** 2;
      if (d < dist) {
        dist = d;
        best = p;
      }
    }
    return best;
  }
  mesh(w, h, d, color, opacity = 0.9) {
    const geo = new THREE.BoxGeometry(w, h, d);
    this.geos.push(geo);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
    mat.userData.base = color.clone();
    this.mats.push(mat);
    return { mesh: new THREE.Mesh(geo, mat), mat };
  }
  bed(x, z) {
    const { mesh } = this.mesh(1.5, 0.12, 1.5, SOIL, 0.85);
    mesh.position.set(x, 0.06, z);
    this.group.add(mesh);
  }
  plant(x, z, build) {
    this.bed(x, z);
    const g = new THREE.Group();
    g.position.set(x, 0.12, z);
    g.scale.set(0.28, 0.28, 0.28);
    const mats = [];
    build(g, mats);
    this.group.add(g);
    return { group: g, mats, x, z };
  }
  lettuce(x, z) {
    return this.plant(x, z, (g, mats) => {
      for (let i = 0; i < 4; i++) {
        const { mesh, mat } = this.mesh(0.9 - i * 0.12, 0.08, 0.7 - i * 0.08, LEAF);
        mesh.position.y = 0.15 + i * 0.1;
        mesh.rotation.y = i * 0.4;
        g.add(mesh);
        mats.push(mat);
      }
    });
  }
  tomato(x, z) {
    return this.plant(x, z, (g, mats) => {
      const stem = this.mesh(0.08, 0.7, 0.08, new THREE.Color(3107636));
      stem.mesh.position.y = 0.4;
      g.add(stem.mesh);
      mats.push(stem.mat);
      for (const [px, py] of [[-0.18, 0.55], [0.16, 0.48], [0.02, 0.72]]) {
        const fruit = this.mesh(0.28, 0.26, 0.26, FRUIT);
        fruit.mesh.position.set(px, py, 0);
        g.add(fruit.mesh);
        mats.push(fruit.mat);
      }
    });
  }
  chilli(x, z) {
    return this.plant(x, z, (g, mats) => {
      for (let i = 0; i < 3; i++) {
        const pod = this.mesh(0.08, 0.55, 0.08, CHILLI);
        pod.mesh.position.set((i - 1) * 0.22, 0.4, 0);
        pod.mesh.rotation.z = (i - 1) * 0.35;
        g.add(pod.mesh);
        mats.push(pod.mat);
      }
    });
  }
  herb(x, z) {
    return this.plant(x, z, (g, mats) => {
      for (let i = 0; i < 7; i++) {
        const stem = this.mesh(0.04, 0.55 + i % 3 * 0.08, 0.04, HERB);
        stem.mesh.position.set((i % 4 - 1.5) * 0.16, 0.3, (i % 3 - 1) * 0.12);
        g.add(stem.mesh);
        mats.push(stem.mat);
      }
    });
  }
  cabbage(x, z) {
    return this.plant(x, z, (g, mats) => {
      const ball = this.mesh(0.7, 0.55, 0.7, CABBAGE);
      ball.mesh.position.y = 0.32;
      g.add(ball.mesh);
      mats.push(ball.mat);
    });
  }
  cucumber(x, z) {
    return this.plant(x, z, (g, mats) => {
      const vine = this.mesh(1.1, 0.1, 0.12, CUBE);
      vine.mesh.position.y = 0.16;
      vine.mesh.rotation.y = 0.4;
      g.add(vine.mesh);
      mats.push(vine.mat);
      const cuke = this.mesh(0.7, 0.16, 0.16, new THREE.Color(4034362));
      cuke.mesh.position.set(0.15, 0.28, 0.05);
      g.add(cuke.mesh);
      mats.push(cuke.mat);
    });
  }
  buildSoil() {
    const row = this.mesh(12.4, 0.05, 6.6, new THREE.Color(4863012), 0.7);
    row.mesh.position.set(0, 0.02, 0.15);
    this.group.add(row.mesh);
    for (let i = -2; i <= 2; i++) {
      const furrow = this.mesh(11.2, 0.02, 0.06, new THREE.Color(3811352), 0.8);
      furrow.mesh.position.set(0, 0.05, i * 0.85);
      this.group.add(furrow.mesh);
    }
  }
  buildRiver() {
    for (let i = 0; i < RIVER.length - 1; i++) {
      const [x0, z0] = RIVER[i];
      const [x1, z1] = RIVER[i + 1];
      const dx = x1 - x0;
      const dz = z1 - z0;
      const len = Math.hypot(dx, dz);
      const bank = new THREE.BoxGeometry(len + 0.2, 0.05, 0.78);
      const water = new THREE.BoxGeometry(len, 0.08, 0.42);
      this.geos.push(bank, water);
      const bankMat = new THREE.MeshBasicMaterial({ color: 7166528, transparent: true, opacity: 0.9 });
      this.mats.push(bankMat);
      const bankMesh = new THREE.Mesh(bank, bankMat);
      const waterMesh = new THREE.Mesh(water, this.riverMat);
      const yRot = -Math.atan2(dz, dx);
      bankMesh.position.set((x0 + x1) / 2, 0.05, (z0 + z1) / 2);
      waterMesh.position.set((x0 + x1) / 2, 0.1, (z0 + z1) / 2);
      bankMesh.rotation.y = yRot;
      waterMesh.rotation.y = yRot;
      this.group.add(bankMesh, waterMesh);
    }
  }
  tree(x, z, scale) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.scale.setScalar(scale);
    const trunk = this.mesh(0.22, 1.15, 0.22, new THREE.Color(5913124));
    trunk.mesh.position.y = 0.58;
    g.add(trunk.mesh);
    const greens = [2382898, 3111488, 4034380];
    greens.forEach((hex, i) => {
      const cap = this.mesh(1.35 - i * 0.28, 0.42, 1.15 - i * 0.22, new THREE.Color(hex));
      cap.mesh.position.y = 1.25 + i * 0.32;
      g.add(cap.mesh);
    });
    this.group.add(g);
  }
  buildPeople() {
    const cloth = new THREE.Color(9067058);
    const skin = new THREE.Color(13010538);
    const pack = new THREE.Color(2898480);
    const put = (parent, x, y, z, w, h, d, color) => {
      const piece = this.mesh(w, h, d, color);
      piece.mesh.position.set(x, y, z);
      parent.add(piece.mesh);
    };
    put(this.sprayer, -0.07, 0.32, 0, 0.1, 0.48, 0.1, cloth);
    put(this.sprayer, 0.07, 0.32, 0, 0.1, 0.48, 0.1, cloth);
    put(this.sprayer, 0, 0.78, 0, 0.32, 0.4, 0.16, new THREE.Color(4025162));
    put(this.sprayer, 0, 1.16, 0.02, 0.16, 0.16, 0.14, skin);
    put(this.sprayer, 0, 0.86, -0.12, 0.22, 0.32, 0.12, pack);
    const wand = this.mesh(0.55, 0.04, 0.04, new THREE.Color(2236962));
    wand.mesh.position.set(0.28, 0.7, 0.12);
    wand.mesh.rotation.z = -0.5;
    this.sprayer.add(wand.mesh);
    this.sprayer.position.set(-3.5, 0, 1.55);
    this.group.add(this.sprayer);
    const puff = this.mesh(0.7, 0.28, 0.55, DRIFT, 0.4);
    this.mistMat = puff.mat;
    this.mist.add(puff.mesh);
    const puff2 = this.mesh(0.4, 0.18, 0.32, DRIFT, 0.28);
    puff2.mesh.position.y = 0.2;
    this.mist.add(puff2.mesh);
    this.mist.position.set(-4.2, 0.7, 1.2);
    this.group.add(this.mist);
    this.bearer.position.set(3.7, 0, 1.95);
    put(this.bearer, 0, 0.32, 0, 0.16, 0.5, 0.12, new THREE.Color(2382968));
    put(this.bearer, 0, 0.78, 0, 0.3, 0.38, 0.16, new THREE.Color(1920616));
    put(this.bearer, 0, 1.14, 0.02, 0.16, 0.16, 0.14, skin);
    const stone = this.mesh(0.36, 0.14, 0.28, new THREE.Color(9276036));
    stone.mesh.position.set(0.28, 0.1, 0.15);
    this.bearer.add(stone.mesh);
    const canBody = this.mesh(0.16, 0.28, 0.12, new THREE.Color(13939274));
    canBody.mesh.position.y = 0.14;
    this.can.add(canBody.mesh);
    this.can.position.set(0.22, 0.85, 0.12);
    this.bearer.add(this.can);
    this.group.add(this.bearer);
  }
};
export {
  CropScene
};
