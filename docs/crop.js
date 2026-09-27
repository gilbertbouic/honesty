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
var CropScene = class {
  group = new THREE.Group();
  geos = [];
  mats = [];
  plots = [];
  competition = "tender";
  outcome = "open";
  correct = 0;
  constructor(scene) {
    this.buildSoil();
    this.plots = [
      this.lettuce(-4.2, 1.2),
      this.tomato(-2.5, -0.6),
      this.chilli(-0.8, 1.4),
      this.herb(0.9, -0.8),
      this.cabbage(2.6, 1.1),
      this.cucumber(4.3, -0.4)
    ];
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
    const lit = grown ? 6 : bare ? 0 : this.correct;
    const ease = reduced ? 1 : 1 - Math.exp(-2.4 * dt);
    this.plots.forEach((plot, i) => {
      const open = i < lit;
      const target = open ? 1 : 0.28;
      const s = plot.group.scale.x + (target - plot.group.scale.x) * ease;
      plot.group.scale.set(s, s, s);
      plot.mats.forEach((mat) => {
        const base = mat.userData.base;
        mat.color.copy(!open && bare ? WILT : base);
        mat.opacity = open ? 0.95 : 0.55;
      });
    });
    if (!reduced) this.group.position.y = Math.sin(t * 0.6) * 0.02;
  }
  dispose() {
    this.group.removeFromParent();
    for (const g of this.geos) g.dispose();
    for (const m of this.mats) m.dispose();
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
    return { group: g, mats };
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
    const row = this.mesh(11, 0.04, 5.2, new THREE.Color(4863012), 0.55);
    row.mesh.position.set(0, 0.02, 0.3);
    this.group.add(row.mesh);
  }
};
export {
  CropScene
};
