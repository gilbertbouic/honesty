// src/lib/game/fair-scene.ts
import * as THREE from "three";

const SHELL = 0xd5d6d2;
const JOINT = 0x1a1c1f;
const GREEN = new THREE.Color(0x3f9a55);
const CRIMSON = new THREE.Color(0xc4312e);
const IRIS = new THREE.Color(0xb7c6de);
const PAPER = 0xf4f5f3;
const GATE_COLORS = [0x8d6b5a, 0xc47a8a, 0xd4a017, 0x8a847c, 0x6a5a78, 0x7a8f6a];

class FairScene {
  constructor(scene) {
    this.group = new THREE.Group();
    this.geos = [];
    this.mats = [];
    this.bars = [];
    this.barMats = [];
    this.competition = "tender";
    this.outcome = "open";
    this.correct = 0;

    const hemi = new THREE.HemisphereLight(0xd5e4f2, 0x5a4328, 0.4);
    const sun = new THREE.DirectionalLight(0xfff3df, 1.05);
    sun.position.set(5, 10, 6);
    this.group.add(hemi, sun);

    this.buildPlaza();
    this.buildGates();
    this.core = this.buildCore();
    this.coreMat = this.core.material;
    this.group.visible = false;
    scene.add(this.group);
  }

  mat(color, opts = {}) {
    const m = new THREE.MeshStandardMaterial({
      color,
      roughness: opts.rough ?? 0.5,
      metalness: opts.metal ?? 0.06,
      emissive: opts.emissive ?? 0x000000,
      emissiveIntensity: opts.ei ?? 1,
      transparent: (opts.opacity ?? 1) < 1,
      opacity: opts.opacity ?? 1,
    });
    this.mats.push(m);
    return m;
  }

  addBox(x, y, z, w, h, d, color, opacity = 1, parent = this.group, opts = {}) {
    const geo = new THREE.BoxGeometry(w, h, d);
    this.geos.push(geo);
    const fill = this.mat(color, { ...opts, opacity, rough: opts.rough ?? 0.48 });
    const mesh = new THREE.Mesh(geo, fill);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  buildPlaza() {
    const stone = this.mat(0xc8c2b6, { rough: 1 });
    const disc = new THREE.Mesh(new THREE.CircleGeometry(5.4, 48), stone);
    this.geos.push(disc.geometry);
    disc.rotation.x = -Math.PI / 2;
    disc.receiveShadow = true;
    this.group.add(disc);
    const ring = new THREE.Mesh(new THREE.RingGeometry(2.7, 3.55, 48), this.mat(0xb7aea0, { rough: 0.9 }));
    this.geos.push(ring.geometry);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.02;
    this.group.add(ring);
  }

  buildGates() {
    const kinds = ["black", "woman", "star", "elder", "veil", "pride"];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const gate = new THREE.Group();
      gate.position.set(Math.cos(a) * 3.15, 0, Math.sin(a) * 3.15);
      gate.rotation.y = Math.PI / 2 - a;
      this.group.add(gate);
      const color = GATE_COLORS[i];
      this.addBox(-0.42, 0.7, 0, 0.08, 1.45, 0.08, PAPER, 1, gate, { rough: 0.4 });
      this.addBox(0.42, 0.7, 0, 0.08, 1.45, 0.08, PAPER, 1, gate, { rough: 0.4 });
      this.addBox(-0.42, 1.46, 0, 0.12, 0.08, 0.12, JOINT, 1, gate, { metal: 0.3 });
      this.addBox(0.42, 1.46, 0, 0.12, 0.08, 0.12, JOINT, 1, gate, { metal: 0.3 });
      const geo = new THREE.BoxGeometry(0.92, 0.07, 0.08);
      this.geos.push(geo);
      const mat = this.mat(color, { rough: 0.35, metal: 0.25, emissive: color, ei: 0.15 });
      const bar = new THREE.Mesh(geo, mat);
      bar.position.set(0, 1.05, 0);
      bar.castShadow = true;
      this.bars.push(bar);
      this.barMats.push(mat);
      gate.add(bar);
      this.addBox(0, 0.04, 0, 0.85, 0.05, 0.7, color, 1, gate, { rough: 0.8 });
      this.placePerson(gate, kinds[i]);
    }
  }

  put(parent, x, y, z, w, h, d, color, opts = {}) {
    return this.addBox(x, y, z, w, h, d, color, 1, parent, opts);
  }

  placePerson(gate, kind) {
    const person = new THREE.Group();
    person.position.set(0, 0, 0.42);
    gate.add(person);
    const cloth = 0x2c3338;
    const skin = kind === "black" ? 0x5a3828 : kind === "elder" ? 0xc4a48a : 0xd7b39a;
    const hair = kind === "elder" ? 0xb7b2aa : 0x1a1c1f;
    if (kind === "woman") {
      this.put(person, 0, 0.28, 0, 0.42, 0.46, 0.26, 0xc47a8a, { rough: 0.6 });
      this.put(person, 0, 0.62, 0, 0.28, 0.28, 0.16, 0xc47a8a, { rough: 0.6 });
      this.put(person, 0, 0.92, 0.02, 0.16, 0.16, 0.14, skin, { rough: 0.7 });
      this.put(person, 0, 1.0, -0.04, 0.18, 0.16, 0.16, hair);
      this.put(person, 0, 0.7, -0.08, 0.1, 0.42, 0.08, hair);
    } else if (kind === "veil") {
      this.put(person, 0, 0.32, 0, 0.4, 0.55, 0.26, 0x3a3148, { rough: 0.7 });
      this.put(person, 0, 0.78, 0, 0.32, 0.32, 0.2, 0x3a3148, { rough: 0.7 });
      this.put(person, 0, 1.08, 0, 0.22, 0.2, 0.2, 0x2a2436, { rough: 0.65 });
      this.put(person, 0, 0.96, 0.1, 0.1, 0.08, 0.04, skin, { rough: 0.6 });
    } else if (kind === "elder") {
      person.scale.setScalar(0.88);
      this.put(person, -0.07, 0.26, 0, 0.1, 0.42, 0.1, cloth);
      this.put(person, 0.07, 0.26, 0, 0.1, 0.42, 0.1, cloth);
      this.put(person, 0, 0.66, 0, 0.3, 0.38, 0.16, 0x4a5560);
      this.put(person, 0, 1.0, 0.02, 0.16, 0.16, 0.14, skin, { rough: 0.75 });
      this.put(person, 0, 1.1, -0.02, 0.18, 0.08, 0.16, hair);
      this.put(person, 0.16, 0.42, 0.06, 0.03, 0.55, 0.03, 0x6d5a40, { rough: 0.8 });
    } else if (kind === "star") {
      this.put(person, -0.07, 0.28, 0, 0.1, 0.46, 0.1, cloth);
      this.put(person, 0.07, 0.28, 0, 0.1, 0.46, 0.1, cloth);
      this.put(person, 0, 0.7, 0, 0.3, 0.4, 0.16, 0x243038);
      this.put(person, 0, 1.05, 0.02, 0.16, 0.16, 0.14, skin, { rough: 0.7 });
      this.put(person, 0, 1.14, -0.02, 0.18, 0.07, 0.16, hair);
      this.put(person, 0, 0.74, 0.1, 0.1, 0.1, 0.02, 0xd4a017, { metal: 0.45, rough: 0.3, emissive: 0x8a6a10, ei: 0.3 });
    } else if (kind === "pride") {
      this.put(person, -0.07, 0.28, 0, 0.1, 0.46, 0.1, cloth);
      this.put(person, 0.07, 0.28, 0, 0.1, 0.46, 0.1, cloth);
      const bands = [0xe24b4b, 0xe07a2f, 0xe6c84a, 0x3f9a55, 0x3a6fd8, 0x7a4ea3];
      bands.forEach((color, s) => this.put(person, 0, 0.52 + s * 0.07, 0, 0.3, 0.07, 0.16, color, { rough: 0.45 }));
      this.put(person, 0, 1.05, 0.02, 0.16, 0.16, 0.14, skin, { rough: 0.7 });
      this.put(person, 0, 1.14, -0.02, 0.18, 0.08, 0.16, 0x5a4030);
    } else {
      this.put(person, -0.07, 0.28, 0, 0.1, 0.46, 0.1, cloth);
      this.put(person, 0.07, 0.28, 0, 0.1, 0.46, 0.1, cloth);
      this.put(person, 0, 0.7, 0, 0.3, 0.4, 0.16, 0x1c2428);
      this.put(person, 0, 1.05, 0.02, 0.16, 0.16, 0.14, skin, { rough: 0.7 });
      this.put(person, 0, 1.14, -0.02, 0.18, 0.08, 0.16, hair);
    }
  }

  buildCore() {
    const g = new THREE.Group();
    const post = this.addBox(0, 0.7, 0, 0.22, 1.4, 0.22, SHELL, 1, g, { rough: 0.4, metal: 0.08 });
    const geo = new THREE.BoxGeometry(0.12, 0.42, 0.04);
    this.geos.push(geo);
    const mat = this.mat(IRIS, { rough: 0.2, metal: 0.4, emissive: IRIS, ei: 0.45 });
    const core = new THREE.Mesh(geo, mat);
    core.position.set(0, 1.15, 0.12);
    g.add(core);
    g.position.y = 0;
    this.group.add(g);
    this.coreRig = g;
    this.post = post;
    return core;
  }

  sync(competition, outcome, correct) {
    this.competition = competition;
    this.outcome = outcome;
    this.correct = correct;
  }

  tick(dt, t, reduced) {
    const on = this.competition === "fair";
    this.group.visible = on;
    if (!on) return;
    const fair = this.outcome === "fair";
    const barred = this.outcome === "barred";
    const lit = fair ? 6 : barred ? 0 : this.correct;
    const ease = reduced ? 1 : 1 - Math.exp(-3 * dt);
    this.bars.forEach((bar, i) => {
      const open = i < lit;
      const target = open ? 2.15 : 1.05;
      bar.position.y += (target - bar.position.y) * ease;
      const mat = this.barMats[i];
      mat.color.set(open ? 0x3f9a55 : barred ? 0xc4312e : GATE_COLORS[i]);
      mat.emissive.copy(mat.color);
      mat.emissiveIntensity = open ? 0.45 : barred ? 0.35 : 0.12;
    });
    this.coreMat.color.copy(fair ? GREEN : barred ? CRIMSON : IRIS);
    this.coreMat.emissive.copy(this.coreMat.color);
    this.coreMat.emissiveIntensity = fair ? 0.9 : 0.35 + (reduced ? 0 : Math.sin(t * 2) * 0.12);
    this.coreRig.rotation.y = reduced ? 0.4 : t * 0.15;
  }

  dispose() {
    this.group.removeFromParent();
    for (const g of this.geos) g.dispose();
    for (const m of this.mats) m.dispose();
  }
}

export { FairScene };
