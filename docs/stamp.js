// Stage 8. The stamp. Clerk walks the counter and stamps each file that holds.
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
    this.stampClock = 1.4;
    this.seenCorrect = 0;
    this.clerkLegs = [];

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
    this.buildShutter();
    this.buildOfficial();
    this.buildStamp();
    this.buildQueue();
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
    this.mesh(this.stamp, new THREE.CylinderGeometry(0.04, 0.045, 0.22, 10), this.joint, 0, 0.12, 0);
    this.mesh(this.stamp, new THREE.BoxGeometry(0.14, 0.045, 0.14), this.shell, 0, 0.0, 0);
    this.pad = this.mesh(this.stamp, new THREE.BoxGeometry(0.1, 0.02, 0.1), this.padMat, 0, -0.03, 0);
    this.stamp.position.set(0, -0.12, 0.02);
    this.group.add(this.stamp);
    this.handWorld = new THREE.Vector3();
    this.paperWorld = new THREE.Vector3();
  }

  buildShutter() {
    this.shutter = this.mesh(this.group, new THREE.BoxGeometry(3.15, 0.72, 0.04), this.shell, 0.1, 1.85, 0.74);
  }

  buildPerson(opts) {
    const g = new THREE.Group();
    const s = opts.scale ?? 1;
    const skin = this.mat(opts.skin, { rough: 0.62 });
    const cloth = this.mat(opts.cloth, { rough: 0.55 });
    const hair = this.mat(opts.hair, { rough: 0.5 });
    const legs = [];
    [-1, 1].forEach((side) => {
      const hip = new THREE.Group();
      hip.position.set(side * 0.08 * s, 0.4 * s, 0);
      this.mesh(hip, new THREE.CapsuleGeometry(0.045 * s, 0.16 * s, 3, 6), opts.skirt ? skin : cloth, 0, -0.12 * s, 0);
      this.mesh(hip, new THREE.BoxGeometry(0.08 * s, 0.04 * s, 0.12 * s), this.joint, 0, -0.24 * s, 0.02 * s);
      g.add(hip);
      legs.push(hip);
    });
    if (opts.skirt) this.mesh(g, new THREE.ConeGeometry(0.16 * s, 0.26 * s, 8), cloth, 0, 0.4 * s, 0);
    this.mesh(g, new THREE.BoxGeometry(0.26 * s, 0.28 * s, 0.14 * s), cloth, 0, 0.6 * s, 0);
    this.mesh(g, new THREE.SphereGeometry(0.09 * s, 10, 8), skin, 0, 0.84 * s, 0);
    this.mesh(g, new THREE.SphereGeometry(0.096 * s, 8, 6), hair, 0, 0.9 * s, -0.015 * s);
    this.mesh(g, new THREE.BoxGeometry(0.12 * s, 0.08 * s, 0.02 * s), cloth, 0, 0.58 * s, 0.08 * s);
    const paper = this.mesh(g, new THREE.BoxGeometry(0.1 * s, 0.012 * s, 0.14 * s), this.mat(0xf7f4ee, { rough: 0.7 }), 0.12 * s, 0.48 * s, 0.08 * s);
    paper.rotation.z = -0.4;
    g.position.set(opts.x, 0, opts.z);
    g.rotation.y = opts.rot ?? Math.PI;
    g.userData.legs = legs;
    this.group.add(g);
    return g;
  }

  buildOfficial() {
    const g = new THREE.Group();
    const s = 1.22;
    const skin = this.mat(0xc4865a, { rough: 0.58 });
    const suit = this.mat(0x1a2744, { rough: 0.42, metal: 0.12 });
    const shirt = this.mat(0xf7f4ee, { rough: 0.5 });
    this.clerkLegs = [];
    [-1, 1].forEach((side) => {
      const hip = new THREE.Group();
      hip.position.set(side * 0.08 * s, 0.42 * s, 0);
      this.mesh(hip, new THREE.CapsuleGeometry(0.05 * s, 0.18 * s, 3, 6), suit, 0, -0.12 * s, 0);
      this.mesh(hip, new THREE.BoxGeometry(0.09 * s, 0.045 * s, 0.14 * s), this.joint, 0, -0.26 * s, 0.03 * s);
      g.add(hip);
      this.clerkLegs.push(hip);
    });
    this.mesh(g, new THREE.BoxGeometry(0.34 * s, 0.36 * s, 0.16 * s), suit, 0, 0.64 * s, 0);
    this.mesh(g, new THREE.BoxGeometry(0.07 * s, 0.18 * s, 0.02 * s), shirt, 0, 0.66 * s, 0.09 * s);
    this.mesh(g, new THREE.BoxGeometry(0.03 * s, 0.14 * s, 0.015 * s), this.ink, 0, 0.62 * s, 0.105 * s);
    this.mesh(g, new THREE.SphereGeometry(0.1 * s, 12, 8), skin, 0, 0.94 * s, 0);
    this.mesh(g, new THREE.BoxGeometry(0.16 * s, 0.05 * s, 0.12 * s), this.mat(0x14120e, { rough: 0.45 }), 0, 1.02 * s, -0.01 * s);
    this.hand = new THREE.Group();
    this.hand.position.set(0.2 * s, 0.9 * s, 0.28 * s);
    g.add(this.hand);
    this.mesh(this.hand, new THREE.SphereGeometry(0.045 * s, 8, 6), skin, 0, 0, 0);
    this.mesh(g, new THREE.CapsuleGeometry(0.04 * s, 0.16 * s, 3, 5), suit, 0.16 * s, 0.72 * s, 0.1 * s);
    g.position.set(-0.42, 0, 1.52);
    g.rotation.y = -Math.PI / 2;
    this.group.add(g);
    this.official = g;
  }

  buildQueue() {
    const people = [
      { skin: 0xf3d2b5, cloth: 0x2a6f7f, hair: 0x2a1810 },
      { skin: 0x8d5524, cloth: 0xf4f1ea, hair: 0x111111, skirt: true },
      { skin: 0x5c3317, cloth: 0xc45c26, hair: 0x1a120c },
      { skin: 0xd7b39a, cloth: 0x1a206d, hair: 0x6b4423, skirt: true },
      { skin: 0x3d2314, cloth: 0x00a551, hair: 0x0e0c0a },
      { skin: 0xf0c7a0, cloth: 0xea2839, hair: 0x3a2418 },
      { skin: 0xa86b45, cloth: 0xe07030, hair: 0x1c140f, skirt: true },
      { skin: 0xc48a62, cloth: 0x245c8a, hair: 0x2a1810 },
    ];
    this.queue = people.map((person, i) => this.buildPerson({
      ...person,
      x: 2.15 + (i % 2) * 0.32,
      z: 2.05 + i * 0.42,
      rot: Math.PI,
      scale: 0.98 + (i % 3) * 0.08,
    }));
  }

  sync(competition, outcome, correct) {
    this.competition = competition;
    this.outcome = outcome;
    if (correct > this.seenCorrect) this.stampClock = 0;
    if (correct < this.seenCorrect) this.stampClock = 1.4;
    this.seenCorrect = correct;
    this.correct = correct;
  }

  tick(dt, t, reduced) {
    const on = this.competition === "stamp";
    this.group.visible = on;
    if (!on) return;
    const ease = reduced ? 1 : 1 - Math.exp(-3.4 * dt);
    const click = this.outcome === "click";
    const smear = this.outcome === "smear";
    const shut = this.outcome === "shut";
    const slot = this.correct > 0 ? Math.min(5, this.correct - 1) : 0;
    const folderX = -1 + slot * 0.46;
    const goalX = shut ? 1.35 : folderX + 0.58;
    const goalZ = shut ? 2.15 : 1.52;
    const dx = goalX - this.official.position.x;
    this.official.position.x += dx * ease;
    this.official.position.z += (goalZ - this.official.position.z) * ease;
    const moving = Math.abs(dx) > 0.06;
    if (!moving) this.stampClock = Math.min(1.6, this.stampClock + dt);
    const yaw = moving ? (dx > 0 ? Math.PI / 2 : -Math.PI / 2) : -Math.PI / 2;
    let dyaw = yaw - this.official.rotation.y;
    while (dyaw > Math.PI) dyaw -= Math.PI * 2;
    while (dyaw < -Math.PI) dyaw += Math.PI * 2;
    this.official.rotation.y += dyaw * ease;
    const u = Math.min(1, this.stampClock / 1.15);
    const dip = !shut && !moving && this.correct > 0 && u < 1
      ? (u < 0.28 ? u / 0.28 : u < 0.72 ? 1 : 1 - (u - 0.72) / 0.28)
      : 0;
    this.official.rotation.x = dip * 0.22;
    this.folders.forEach((folder, i) => {
      const held = i < this.correct;
      const landed = i < this.correct - 1 || (i === slot && this.correct > 0 && (dip > 0.85 || this.stampClock >= 1.15 || reduced));
      const markScale = held && landed ? 1.7 : 0.001;
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
    const handX = 0.02;
    const handY = shut ? 0.42 : 1.42 - dip * 0.34;
    const handZ = shut ? 0.06 : 0.22 + dip * 0.42;
    this.hand.position.x += (handX - this.hand.position.x) * ease;
    this.hand.position.y += (handY - this.hand.position.y) * ease;
    this.hand.position.z += (handZ - this.hand.position.z) * ease;
    if (!reduced && !shut && dip === 0) this.hand.position.y += Math.sin(t * 2.2) * 0.01;
    this.hand.getWorldPosition(this.handWorld);
    this.folders[slot].group.getWorldPosition(this.paperWorld);
    this.paperWorld.y += 0.1;
    this.stamp.position.lerpVectors(this.handWorld, this.paperWorld, shut ? 0 : dip);
    this.stamp.position.y += 0.05;
    this.padMat.color.set(dip > 0.45 && !shut ? INK : 0x3a2428);
    const glassOn = click || this.correct > 0;
    this.visor.material.emissive.set(glassOn ? 0x1a2838 : 0x050608);
    this.visor.material.emissiveIntensity = shut ? 0.02 : glassOn ? 0.35 : 0.12;
    const step = moving ? Math.sin(t * 9) * 0.7 : Math.sin(t * 1.6) * 0.04;
    this.clerkLegs[0].rotation.x = step;
    this.clerkLegs[1].rotation.x = -step;
    if (!reduced) {
      this.queue.forEach((person, i) => {
        const sway = t * 1.4 + i;
        const shift = Math.sin(sway) * 0.012;
        person.position.x = 2.15 + (i % 2) * 0.32 + shift;
        person.userData.legs[0].rotation.x = Math.sin(sway) * 0.06;
        person.userData.legs[1].rotation.x = Math.sin(sway + Math.PI) * 0.06;
      });
    }
  }

  dispose() {
    this.group.removeFromParent();
    for (const g of this.geos) g.dispose();
    for (const m of this.mats) m.dispose();
  }
}

export { StampScene };
