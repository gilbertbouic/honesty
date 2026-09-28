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
    const disc = new THREE.Mesh(new THREE.CircleGeometry(8.2, 56), stone);
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
    const kinds = ["black", "pride", "pregnant", "veil", "rabbi", "elder"];
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
    const g = new THREE.Group();
    g.position.set(0, 0, 0.42);
    if (kind === "elder") {
      g.scale.setScalar(0.9);
      g.rotation.x = 0.12;
    }
    gate.add(g);
    const profiles = {
      black: { skin: 0x5a3828, hair: 0x140e0c, cloth: 0x243044, pants: 0x1c242c },
      pride: { skin: 0xd7b39a, hair: 0x2a1814, cloth: 0x2a2428, pants: 0x1c2430 },
      pregnant: { skin: 0xd7b39a, hair: 0x3a2418, cloth: 0xc45b78, pants: 0xc45b78 },
      veil: { skin: 0xc48a62, hair: 0x2a2436, cloth: 0x3a3148, pants: 0x3a3148 },
      rabbi: { skin: 0xd7b39a, hair: 0x1a120e, cloth: 0x1a1c22, pants: 0x1a1c22 },
      elder: { skin: 0xd8c4ae, hair: 0xc8c6c0, cloth: 0x4a5560, pants: 0x3a4048 },
    };
    const p = profiles[kind];
    const skin = this.mat(p.skin, { rough: 0.72 });
    const cloth = this.mat(p.cloth, { rough: 0.55 });
    const pants = this.mat(p.pants, { rough: 0.6 });
    const hair = this.mat(p.hair, { rough: 0.58 });
    const add = (geo, material, x, y, z) => {
      this.geos.push(geo);
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      g.add(mesh);
      return mesh;
    };
    const male = kind === "black" || kind === "pride" || kind === "rabbi" || kind === "elder";
    add(new THREE.CapsuleGeometry(0.055, 0.28, 3, 6), pants, -0.08, 0.24, 0);
    add(new THREE.CapsuleGeometry(0.055, 0.28, 3, 6), pants, 0.08, 0.24, 0);
    if (kind === "pregnant" || kind === "veil") {
      add(new THREE.ConeGeometry(0.2, 0.42, 8), cloth, 0, 0.34, 0);
    }
    add(new THREE.BoxGeometry(male ? 0.34 : 0.28, 0.36, 0.16), cloth, 0, 0.66, 0);
    add(new THREE.CapsuleGeometry(0.035, 0.22, 3, 6), cloth, -0.2, 0.58, 0);
    add(new THREE.CapsuleGeometry(0.035, 0.22, 3, 6), cloth, 0.2, 0.58, 0);
    add(new THREE.SphereGeometry(0.11, 12, 10), skin, 0, 0.98, 0);
    add(new THREE.SphereGeometry(0.018, 6, 6), this.mat(0x1a1214, { rough: 0.4 }), -0.04, 1.0, 0.09);
    add(new THREE.SphereGeometry(0.018, 6, 6), this.mat(0x1a1214, { rough: 0.4 }), 0.04, 1.0, 0.09);
    if (kind !== "veil") {
      add(new THREE.SphereGeometry(kind === "elder" ? 0.12 : 0.115, 10, 8), hair, 0, kind === "elder" ? 1.05 : 1.06, -0.02);
    }
    if (kind === "elder") add(new THREE.SphereGeometry(0.07, 8, 6), hair, 0, 0.9, 0.06);
    if (kind === "black") add(new THREE.SphereGeometry(0.05, 8, 6), hair, 0, 0.9, 0.06);
    if (kind === "rabbi") {
      add(new THREE.SphereGeometry(0.08, 8, 6), hair, 0, 0.9, 0.07);
      const cap = add(new THREE.SphereGeometry(0.09, 8, 6), this.mat(0x14161c, { rough: 0.5 }), 0, 1.1, 0);
      cap.scale.y = 0.45;
      add(new THREE.TorusGeometry(0.07, 0.008, 6, 10), this.mat(0xd4a017, { metal: 0.6, rough: 0.3 }), 0, 0.9, 0.08);
      const starMat = this.mat(0xf0c84a, { metal: 0.65, rough: 0.25, emissive: 0x8a6a10, ei: 0.35 });
      const tri = (flip) => {
        const shape = new THREE.Shape();
        const r = 0.055;
        if (!flip) {
          shape.moveTo(0, r);
          shape.lineTo(-r * 0.9, -r * 0.5);
          shape.lineTo(r * 0.9, -r * 0.5);
        } else {
          shape.moveTo(0, -r);
          shape.lineTo(-r * 0.9, r * 0.5);
          shape.lineTo(r * 0.9, r * 0.5);
        }
        shape.closePath();
        return new THREE.ExtrudeGeometry(shape, { depth: 0.012, bevelEnabled: false });
      };
      const up = add(tri(false), starMat, 0, 0.74, 0.12);
      const down = add(tri(true), starMat, 0, 0.74, 0.128);
      up.position.z = 0.12;
      down.position.z = 0.132;
    }
    if (kind === "pregnant") {
      add(new THREE.SphereGeometry(0.13, 12, 10), cloth, 0, 0.58, 0.1);
    }
    if (kind === "veil") {
      const veil = this.mat(0x2a2436, { rough: 0.6 });
      add(new THREE.SphereGeometry(0.13, 10, 8), veil, 0, 1.04, -0.02);
      add(new THREE.BoxGeometry(0.28, 0.2, 0.08), veil, 0, 0.86, -0.02);
      add(new THREE.BoxGeometry(0.08, 0.16, 0.04), veil, -0.1, 0.78, 0.04);
      add(new THREE.BoxGeometry(0.08, 0.16, 0.04), veil, 0.1, 0.78, 0.04);
    }
    if (kind === "pride") {
      [0xe24b4b, 0xe07a2f, 0xe6c84a, 0x3f9a55, 0x3a6fd8, 0x7a4ea3].forEach((color, s) => {
        add(new THREE.BoxGeometry(0.36, 0.045, 0.04), this.mat(color, { rough: 0.45, emissive: color, ei: 0.12 }), 0, 0.52 + s * 0.05, 0.07);
      });
    }
    if (kind === "elder") {
      add(new THREE.CylinderGeometry(0.016, 0.016, 0.62, 6), this.mat(0x6d5a40, { rough: 0.75 }), 0.22, 0.34, 0.06);
    }
  }

  buildTown() {
    const shell = () => this.mat(SHELL, { rough: 0.42, metal: 0.1 });
    const joint = () => this.mat(JOINT, { rough: 0.5, metal: 0.35 });
    const glass = () => this.mat(0x1c2830, { rough: 0.25, metal: 0.4, emissive: 0x7ec8ff, ei: 0.18 });
    const add = (parent, geo, material, x, y, z) => {
      this.geos.push(geo);
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };
    const kinds = ["wide", "tower", "step", "hall", "round", "gable"];
    kinds.forEach((kind, i) => {
      const a = (i / 6) * Math.PI * 2 + 0.42;
      const r = 5.15;
      const b = new THREE.Group();
      b.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
      b.rotation.y = -a + Math.PI;
      const s = shell();
      const j = joint();
      const win = glass();
      if (kind === "wide") {
        add(b, new THREE.BoxGeometry(1.7, 1.15, 0.9), s, 0, 0.58, 0);
        add(b, new THREE.BoxGeometry(1.9, 0.08, 1.05), j, 0, 1.18, 0);
        add(b, new THREE.BoxGeometry(1.15, 0.28, 0.04), win, 0, 0.62, 0.46);
      } else if (kind === "tower") {
        add(b, new THREE.BoxGeometry(0.7, 2.7, 0.7), s, 0, 1.35, 0);
        add(b, new THREE.BoxGeometry(0.86, 0.1, 0.86), j, 0, 2.74, 0);
        add(b, new THREE.BoxGeometry(0.36, 0.7, 0.04), win, 0, 1.7, 0.36);
        add(b, new THREE.BoxGeometry(0.36, 0.22, 0.04), win, 0, 0.85, 0.36);
      } else if (kind === "step") {
        add(b, new THREE.BoxGeometry(1.35, 0.7, 1.05), s, 0, 0.35, 0);
        add(b, new THREE.BoxGeometry(0.9, 0.7, 0.75), s, 0, 1.05, 0);
        add(b, new THREE.BoxGeometry(0.5, 0.55, 0.5), s, 0, 1.65, 0);
        add(b, new THREE.BoxGeometry(1.45, 0.06, 1.15), j, 0, 0.72, 0);
        add(b, new THREE.BoxGeometry(0.55, 0.16, 0.04), win, 0, 1.05, 0.39);
      } else if (kind === "hall") {
        add(b, new THREE.BoxGeometry(1.5, 1.7, 0.85), s, 0, 0.85, 0);
        add(b, new THREE.BoxGeometry(1.7, 0.1, 1.05), j, 0, 1.74, 0);
        add(b, new THREE.BoxGeometry(0.28, 0.9, 0.04), win, -0.38, 0.85, 0.44);
        add(b, new THREE.BoxGeometry(0.28, 0.9, 0.04), win, 0.38, 0.85, 0.44);
      } else if (kind === "round") {
        add(b, new THREE.CylinderGeometry(0.55, 0.6, 1.9, 10), s, 0, 0.95, 0);
        add(b, new THREE.CylinderGeometry(0.68, 0.68, 0.08, 10), j, 0, 1.94, 0);
        add(b, new THREE.BoxGeometry(0.7, 0.22, 0.04), win, 0, 1.05, 0.58);
      } else {
        add(b, new THREE.BoxGeometry(1.15, 1.25, 0.9), s, 0, 0.62, 0);
        const roof = add(b, new THREE.ConeGeometry(0.85, 0.7, 4), j, 0, 1.55, 0);
        roof.rotation.y = Math.PI / 4;
        add(b, new THREE.BoxGeometry(0.4, 0.32, 0.04), win, 0, 0.7, 0.46);
      }
      this.group.add(b);
    });
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
    const scales = new THREE.Group();
    scales.position.y = 1.42;
    const beam = new THREE.Group();
    this.group.add(scales);
    scales.add(beam);
    this.addBox(0, 0.28, 0, 0.06, 0.36, 0.06, JOINT, 1, scales, { metal: 0.4 });
    this.addBox(0, 0.46, 0, 0.9, 0.05, 0.05, JOINT, 1, beam, { metal: 0.45 });
    [-0.4, 0.4].forEach((x) => {
      this.addBox(x, 0.28, 0, 0.015, 0.32, 0.015, JOINT, 1, beam, { metal: 0.3 });
      this.addBox(x, 0.1, 0, 0.16, 0.03, 0.16, SHELL, 1, beam, { metal: 0.2, rough: 0.35 });
    });
    this.scaleBeam = beam;
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
    const tilt = fair ? 0 : barred ? 0.42 : (3 - lit) * 0.04;
    if (this.scaleBeam) this.scaleBeam.rotation.z += (tilt - this.scaleBeam.rotation.z) * ease;
    this.coreRig.rotation.y = reduced ? 0.4 : t * 0.15;
  }

  dispose() {
    this.group.removeFromParent();
    for (const g of this.geos) g.dispose();
    for (const m of this.mats) m.dispose();
  }
}

export { FairScene };
