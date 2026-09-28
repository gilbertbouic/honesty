import * as THREE from "three";

const PEARL = 0xf4f5f3;
const JOINT = 0x1a1c1f;
const GLASS = 0x14181c;
const INK = 0xea2839;
const FLAG = [0xea2839, 0x1a206d, 0xffd500, 0x00a551];

class StampScene {
  constructor(scene) {
    this.group = new THREE.Group();
    this.geos = [];
    this.mats = [];
    this.folders = [];
    this.competition = "tender";
    this.outcome = "open";
    this.correct = 0;

    const hemi = new THREE.HemisphereLight(0xd5e4f2, 0x3a3428, 0.55);
    const sun = new THREE.DirectionalLight(0xfff3df, 1.05);
    sun.position.set(4, 10, 6);
    this.group.add(hemi, sun);

    this.shell = this.mat(PEARL, { rough: 0.32, metal: 0.22 });
    this.joint = this.mat(JOINT, { rough: 0.45, metal: 0.4 });
    this.glass = this.mat(GLASS, { rough: 0.12, metal: 0.55, emissive: 0x1a2830, ei: 0.22 });
    this.ink = this.mat(INK, { rough: 0.45, metal: 0.05 });
    this.padMat = this.mat(INK, { rough: 0.4, metal: 0.05 });

    this.buildPlaza();
    this.buildVan();
    this.buildCounter();
    this.buildFolders();
    this.buildStamp();
    this.buildShutter();
    this.walker = this.buildWalker();
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

  mesh(parent, geo, material, x, y, z) {
    this.geos.push(geo);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  buildPlaza() {
    const pad = this.mesh(this.group, new THREE.CircleGeometry(7.2, 40), this.mat(0xd4cbb8, { rough: 1 }), 0, -0.02, 0.4);
    pad.rotation.x = -Math.PI / 2;
  }

  buildVan() {
    const g = new THREE.Group();
    this.mesh(g, new THREE.BoxGeometry(3.7, 0.16, 1.55), this.joint, 0, 0.28, 0);
    this.mesh(g, new THREE.BoxGeometry(3.45, 0.82, 1.32), this.shell, 0, 0.78, 0);
    this.mesh(g, new THREE.BoxGeometry(2.15, 0.46, 1.18), this.shell, -0.35, 1.38, 0);
    this.mesh(g, new THREE.BoxGeometry(3.55, 0.05, 1.42), this.joint, 0, 1.66, 0);
    this.visor = this.mesh(g, new THREE.BoxGeometry(1.85, 0.32, 0.06), this.glass, -0.4, 1.4, 0.62);
    this.mesh(g, new THREE.BoxGeometry(2.9, 0.22, 0.05), this.glass, 0.15, 1.02, 0.68);
    FLAG.forEach((color, i) => {
      const band = this.mat(color, { rough: 0.4, metal: 0.15 });
      this.mesh(g, new THREE.BoxGeometry(0.62, 0.045, 0.03), band, -1.15 + i * 0.72, 0.62, 0.68);
    });
    this.wheels = [];
    [-1.35, 1.25].forEach((x) => {
      [-0.72, 0.72].forEach((z) => {
        const wheel = this.mesh(g, new THREE.CylinderGeometry(0.28, 0.28, 0.16, 14), this.joint, x, 0.28, z);
        wheel.rotation.z = Math.PI / 2;
        const hub = this.mesh(
          g,
          new THREE.CylinderGeometry(0.1, 0.1, 0.18, 8),
          this.mat(0xd5d6d2, { rough: 0.3, metal: 0.6 }),
          x,
          0.28,
          z,
        );
        hub.rotation.z = Math.PI / 2;
        this.wheels.push(wheel);
      });
    });
    this.group.add(g);
    this.van = g;
  }

  buildCounter() {
    this.counter = new THREE.Group();
    this.mesh(this.counter, new THREE.BoxGeometry(2.9, 0.08, 0.95), this.shell, 0, 0, 0);
    this.mesh(this.counter, new THREE.BoxGeometry(2.74, 0.025, 0.78), this.glass, 0, 0.05, 0);
    this.mesh(this.counter, new THREE.BoxGeometry(2.96, 0.03, 0.04), this.joint, 0, 0.02, 0.48);
    this.counter.position.set(0.15, 0.98, 1.22);
    this.group.add(this.counter);
    this.drawer = this.mesh(this.group, new THREE.BoxGeometry(0.7, 0.16, 0.42), this.joint, 1.15, 0.72, 0.85);
  }

  folderIcon(kind, parent) {
    if (kind === "envelope") {
      this.mesh(parent, new THREE.BoxGeometry(0.16, 0.012, 0.1), this.mat(0xf4f1ea, { rough: 0.7 }), 0, 0.05, 0);
      const flap = this.mesh(parent, new THREE.BoxGeometry(0.16, 0.012, 0.06), this.mat(0xe7e2d6, { rough: 0.7 }), 0, 0.06, -0.02);
      flap.rotation.x = -0.5;
    } else if (kind === "kin") {
      const skin = this.mat(0xd7b39a, { rough: 0.65 });
      this.mesh(parent, new THREE.SphereGeometry(0.035, 8, 6), skin, -0.04, 0.07, 0);
      this.mesh(parent, new THREE.SphereGeometry(0.035, 8, 6), skin, 0.04, 0.07, 0);
    } else if (kind === "plate") {
      const plate = this.mesh(parent, new THREE.TorusGeometry(0.05, 0.012, 6, 14), this.mat(0xf0c030, { metal: 0.4, rough: 0.35 }), 0, 0.06, 0);
      plate.rotation.x = Math.PI / 2;
    } else if (kind === "slab") {
      this.mesh(parent, new THREE.BoxGeometry(0.14, 0.04, 0.1), this.mat(0xb7b2a8, { rough: 0.85 }), 0, 0.06, 0);
    } else if (kind === "calendar") {
      this.mesh(parent, new THREE.BoxGeometry(0.14, 0.012, 0.16), this.mat(0xf7f4ee, { rough: 0.8 }), 0, 0.05, 0);
      this.mesh(parent, new THREE.BoxGeometry(0.14, 0.02, 0.03), this.ink, 0, 0.065, -0.06);
    } else {
      this.mesh(parent, new THREE.BoxGeometry(0.12, 0.07, 0.1), this.shell, 0, 0.07, 0);
      this.mesh(parent, new THREE.ConeGeometry(0.09, 0.06, 4), this.joint, 0, 0.13, 0);
    }
  }

  buildFolders() {
    const kinds = ["envelope", "kin", "plate", "slab", "calendar", "listing"];
    kinds.forEach((kind, i) => {
      const folder = new THREE.Group();
      const paper = this.mat(0xf7f4ee, { rough: 0.75 });
      this.mesh(folder, new THREE.BoxGeometry(0.34, 0.035, 0.42), paper, 0, 0, 0);
      this.folderIcon(kind, folder);
      const mark = this.mesh(folder, new THREE.CircleGeometry(0.07, 16), this.ink, 0.08, 0.03, 0.08);
      mark.rotation.x = -Math.PI / 2;
      mark.scale.setScalar(0.001);
      const smear = this.mesh(
        folder,
        new THREE.CircleGeometry(0.09, 12),
        this.mat(0x6a2030, { rough: 0.8, opacity: 0.0 }),
        -0.04,
        0.03,
        -0.04,
      );
      smear.rotation.x = -Math.PI / 2;
      smear.material.transparent = true;
      folder.position.set(-1.15 + i * 0.46, 0.06, 0);
      this.counter.add(folder);
      this.folders.push({ group: folder, mark, smear, homeX: folder.position.x });
    });
  }

  buildStamp() {
    this.stamp = new THREE.Group();
    this.mesh(this.stamp, new THREE.CylinderGeometry(0.045, 0.05, 0.28, 10), this.joint, 0, 0.2, 0);
    this.mesh(this.stamp, new THREE.BoxGeometry(0.16, 0.05, 0.16), this.shell, 0, 0.04, 0);
    this.pad = this.mesh(this.stamp, new THREE.BoxGeometry(0.12, 0.02, 0.12), this.padMat, 0, 0.01, 0);
    this.stamp.position.set(-1.15, 1.35, 1.22);
    this.group.add(this.stamp);
  }

  buildShutter() {
    this.shutter = this.mesh(this.group, new THREE.BoxGeometry(3.15, 0.72, 0.04), this.shell, 0.1, 1.85, 0.74);
  }

  buildWalker() {
    const g = new THREE.Group();
    const pearl = this.shell;
    const skin = this.mat(0xd7b39a, { rough: 0.65 });
    const shoe = this.joint;
    const leg = (x) => {
      const hip = new THREE.Group();
      hip.position.set(x, 0.42, 0);
      this.mesh(hip, new THREE.CapsuleGeometry(0.05, 0.2, 3, 6), pearl, 0, -0.14, 0);
      this.mesh(hip, new THREE.BoxGeometry(0.09, 0.05, 0.14), shoe, 0, -0.28, 0.03);
      g.add(hip);
      return hip;
    };
    this.legL = leg(-0.08);
    this.legR = leg(0.08);
    this.mesh(g, new THREE.BoxGeometry(0.28, 0.32, 0.16), pearl, 0, 0.58, 0);
    FLAG.forEach((color, i) => {
      this.mesh(g, new THREE.BoxGeometry(0.05, 0.03, 0.02), this.mat(color, { rough: 0.4 }), -0.08 + i * 0.05, 0.62, 0.09);
    });
    this.mesh(g, new THREE.SphereGeometry(0.1, 10, 8), skin, 0, 0.86, 0);
    this.mesh(g, new THREE.BoxGeometry(0.12, 0.03, 0.02), this.glass, 0, 0.87, 0.09);
    g.position.set(-2.2, 0, 1.85);
    this.group.add(g);
    return g;
  }

  sync(competition, outcome, correct) {
    this.competition = competition;
    this.outcome = outcome;
    this.correct = correct;
  }

  tick(dt, t, reduced) {
    const on = this.competition === "stamp";
    this.group.visible = on;
    if (!on) return;
    const ease = reduced ? 1 : 1 - Math.exp(-3 * dt);
    const click = this.outcome === "click";
    const smear = this.outcome === "smear";
    const shut = this.outcome === "shut";
    this.folders.forEach((folder, i) => {
      const held = i < this.correct;
      const markScale = held ? 1 : 0.001;
      folder.mark.scale.x += (markScale - folder.mark.scale.x) * ease;
      folder.mark.scale.y += (markScale - folder.mark.scale.y) * ease;
      folder.mark.scale.z += (markScale - folder.mark.scale.z) * ease;
      const blot = smear && !held ? 0.72 : 0;
      folder.smear.material.opacity += (blot - folder.smear.material.opacity) * ease;
      const under = shut && !held;
      const y = held ? 0.08 : under ? -0.22 : 0.06;
      const z = under ? -0.35 : 0;
      folder.group.position.y += (y - folder.group.position.y) * ease;
      folder.group.position.z += (z - folder.group.position.z) * ease;
    });
    const shutterY = shut ? 1.12 : 1.92;
    this.shutter.position.y += (shutterY - this.shutter.position.y) * ease;
    const drawerZ = shut ? 1.15 : 0.85;
    this.drawer.position.z += (drawerZ - this.drawer.position.z) * ease;
    const slot = Math.min(5, Math.max(0, this.correct - 1));
    const homeX = shut ? 1.15 : -1.0 + slot * 0.46;
    const homeY = shut ? 0.78 : heldLift(this.correct);
    const homeZ = shut ? 1.05 : 1.22;
    this.stamp.position.x += (homeX - this.stamp.position.x) * ease;
    this.stamp.position.y += (homeY - this.stamp.position.y) * ease;
    this.stamp.position.z += (homeZ - this.stamp.position.z) * ease;
    if (!reduced && !shut) this.stamp.position.y += Math.sin(t * 3.2) * 0.012;
    this.padMat.color.set(this.correct > 0 && !shut ? INK : 0x3a2428);
    const glassOn = click || this.correct > 0;
    this.visor.material.emissive.set(glassOn ? 0x1a2838 : 0x050608);
    this.visor.material.emissiveIntensity = shut ? 0.02 : glassOn ? 0.35 : 0.12;
    if (!reduced && click) {
      this.wheels.forEach((wheel) => {
        wheel.rotation.x += dt * 0.4;
      });
      const step = t * 5.2;
      this.legL.rotation.x = Math.sin(step) * 0.5;
      this.legR.rotation.x = Math.sin(step + Math.PI) * 0.5;
      const trip = (t * 0.18) % 2;
      const leg = trip < 1 ? trip : 2 - trip;
      this.walker.position.x = -2.1 + leg * 4.2;
      this.walker.position.z = 1.9;
      this.walker.rotation.y = trip < 1 ? Math.PI / 2 : -Math.PI / 2;
    }
  }

  dispose() {
    this.group.removeFromParent();
    for (const g of this.geos) g.dispose();
    for (const m of this.mats) m.dispose();
  }
}

function heldLift(correct) {
  return correct > 0 ? 1.08 : 1.48;
}

export { StampScene };
