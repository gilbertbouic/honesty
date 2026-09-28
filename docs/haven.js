// src/lib/game/haven-scene.ts
import * as THREE from "three";

const QUIET = { x: -2.2, z: 8.7 };
const SHELL = 0xd5d6d2;
const JOINT = 0x1a1c1f;
const VISOR = 0x0c1016;
const STONE = 0x8a847c;
const BLOOD = new THREE.Color(0x5c2a28);
const EMBER = new THREE.Color(0xff6a3c);
const FLAME = new THREE.Color(0xffb15a);
const VOID = new THREE.Color(0x14120f);
const STAGE = [0x3f9a55, 0x2f6b34, 0xffb15a, 0x7ec8ff, 0xe0a030, 0x3f9a55];

class HavenScene {
  constructor(scene) {
    this.group = new THREE.Group();
    this.geos = [];
    this.mats = [];
    this.stones = [];
    this.stoneMats = [];
    this.stageMats = [];
    this.flames = [];
    this.stonePos = [];
    this.competition = "tender";
    this.outcome = "open";
    this.correct = 0;
    this.porch = new THREE.Vector3(QUIET.x + 0.05, 0.04, QUIET.z + 1.15);
    this.look = new THREE.Vector3();

    const hemi = new THREE.HemisphereLight(0xd5e4f2, 0x5a4328, 0.35);
    const sun = new THREE.DirectionalLight(0xfff3df, 0.9);
    sun.position.set(4, 9, 6);
    this.group.add(hemi, sun);

    this.yard();
    this.shell = this.buildHouse();
    this.door = this.buildDoor();
    this.curtain = this.buildCurtain();
    this.phone = this.buildPhone();
    this.column = this.buildColumn();
    this.core = this.column.userData.core;
    this.buildFlames();
    this.buildStones();
    this.buildWalker();
    this.ribbon = this.buildRibbon();
    this.beacon = this.buildBeacon();
    this.fog = this.buildFog();

    const midX = (QUIET.x + (QUIET.x - 2.25)) / 2;
    const midZ = (QUIET.z + (QUIET.z - 0.15)) / 2;
    this.group.position.set(-midX, 0, -midZ);
    this.group.visible = false;
    scene.add(this.group);
  }

  mat(color, opts = {}) {
    const m = new THREE.MeshStandardMaterial({
      color,
      roughness: opts.rough ?? 0.55,
      metalness: opts.metal ?? 0.06,
      emissive: opts.emissive ?? 0x000000,
      emissiveIntensity: opts.ei ?? 1,
      transparent: (opts.opacity ?? 1) < 1,
      opacity: opts.opacity ?? 1,
      depthWrite: opts.depthWrite ?? true,
      side: opts.side ?? THREE.FrontSide,
    });
    this.mats.push(m);
    return m;
  }

  mesh(parent, geometry, material, x, y, z) {
    this.geos.push(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  yard() {
    const pad = this.mesh(this.group, new THREE.CircleGeometry(7.5, 36), this.mat(0x3c5a34, { rough: 1 }), 0, -0.06, 6.6);
    pad.rotation.x = -Math.PI / 2;
    const path = this.mesh(this.group, new THREE.BoxGeometry(1.15, 0.04, 4.4), this.mat(0x6d5a40, { rough: 0.95 }), QUIET.x, 0.02, QUIET.z + 2.5);
    path.receiveShadow = true;
  }

  buildHouse() {
    const x = QUIET.x;
    const z = QUIET.z;
    const shell = this.mat(SHELL, { rough: 0.62 });
    const roof = this.mat(JOINT, { rough: 0.5, metal: 0.2 });
    const W = 2.25;
    const D = 1.8;
    const H = 2.05;
    this.mesh(this.group, new THREE.BoxGeometry(W, H, D), shell, x, H / 2, z);
    this.mesh(this.group, new THREE.BoxGeometry(W + 0.28, 0.16, D + 0.24), roof, x, H + 0.08, z);
    const step = this.mesh(this.group, new THREE.BoxGeometry(1.5, 0.08, 0.7), this.mat(0x6d5a40, { rough: 1 }), x, 0.06, z + D / 2 + 0.35);
    step.receiveShadow = true;
    return shell;
  }

  buildDoor() {
    const hinge = new THREE.Group();
    hinge.position.set(QUIET.x - 0.38, 0.62, QUIET.z + 0.92);
    const door = this.mesh(hinge, new THREE.BoxGeometry(0.7, 1.16, 0.06), this.mat(0x4a3428, { rough: 0.7 }), 0.35, 0, 0);
    door.castShadow = true;
    this.mesh(hinge, new THREE.BoxGeometry(0.08, 0.08, 0.04), this.mat(0xc4a35a, { metal: 0.4, rough: 0.35 }), 0.58, 0, 0.04);
    this.group.add(hinge);
    return hinge;
  }

  buildCurtain() {
    const mesh = this.mesh(
      this.group,
      new THREE.PlaneGeometry(0.72, 0.42),
      this.mat(FLAME, { opacity: 0.34, depthWrite: false, side: THREE.DoubleSide, rough: 0.4, emissive: 0xff6a3c, ei: 0.4 }),
      QUIET.x,
      1.52,
      QUIET.z + 0.92,
    );
    return mesh;
  }

  buildPhone() {
    const mesh = this.mesh(
      this.group,
      new THREE.BoxGeometry(0.16, 0.035, 0.28),
      this.mat(JOINT, { rough: 0.35, metal: 0.4, emissive: 0x1a6a88, ei: 0.5 }),
      QUIET.x + 0.35,
      0.14,
      QUIET.z + 1.28,
    );
    mesh.rotation.x = -0.4;
    return mesh;
  }

  buildColumn() {
    const g = new THREE.Group();
    g.position.set(QUIET.x - 2.25, 0, QUIET.z - 0.15);
    this.mesh(g, new THREE.CylinderGeometry(0.46, 0.52, 0.08, 8), this.mat(JOINT, { rough: 0.6 }), 0, 0.05, 0);
    for (let i = 0; i < 6; i++) {
      const w = 0.5 - i * 0.025;
      const mat = this.mat(0x14120f, { rough: 0.45, emissive: 0x000000, ei: 0 });
      this.stageMats.push(mat);
      this.mesh(g, new THREE.BoxGeometry(w, 0.28, w), mat, 0, 0.28 + i * 0.36, 0);
    }
    const core = this.mesh(g, new THREE.CylinderGeometry(0.035, 0.035, 2.35, 8), this.mat(0xe7eef2, { metal: 0.2, rough: 0.3, opacity: 0.35 }), 0, 1.2, 0);
    this.mesh(g, new THREE.OctahedronGeometry(0.14, 0), this.mat(SHELL, { rough: 0.3, metal: 0.2 }), 0, 2.45, 0);
    g.userData.core = core;
    this.group.add(g);
    return g;
  }

  buildFlames() {
    const spots = [
      [QUIET.x - 0.85, 0.22, QUIET.z + 1.05],
      [QUIET.x + 0.85, 0.22, QUIET.z + 1.05],
      [QUIET.x - 1.15, 0.28, QUIET.z - 0.1],
      [QUIET.x + 1.15, 0.28, QUIET.z - 0.1],
      [QUIET.x - 0.35, 2.22, QUIET.z + 0.15],
      [QUIET.x + 0.4, 2.22, QUIET.z - 0.2],
    ];
    for (const [x, y, z] of spots) {
      const mesh = this.mesh(
        this.group,
        new THREE.ConeGeometry(0.07, 0.26, 6),
        this.mat(EMBER, { emissive: 0xff6a3c, ei: 0.8, rough: 0.4 }),
        x, y, z,
      );
      this.flames.push(mesh);
    }
  }

  buildStones() {
    for (let i = 0; i < 6; i++) {
      const x = this.porch.x + Math.sin((i - 2.5) * 0.42) * (0.55 + i * 0.16);
      const z = this.porch.z + 0.42 + i * 0.36;
      this.stonePos.push(new THREE.Vector3(x, 0.05, z));
      const mat = this.mat(STONE, { rough: 0.9, emissive: 0x14301c, ei: 0 });
      this.stoneMats.push(mat);
      const mesh = this.mesh(this.group, new THREE.CylinderGeometry(0.18, 0.2, 0.07, 8), mat, x, 0.05, z);
      this.stones.push(mesh);
    }
  }

  buildWalker() {
    const g = new THREE.Group();
    const shell = this.mat(SHELL, { rough: 0.4, metal: 0.08 });
    const joint = this.mat(JOINT, { rough: 0.5, metal: 0.4 });
    const visor = this.mat(VISOR, { rough: 0.15, metal: 0.6, emissive: 0x102030, ei: 0.45 });
    const put = (geo, material, x, y, z) => this.mesh(g, geo, material, x, y, z);
    put(new THREE.CapsuleGeometry(0.05, 0.16, 3, 6), shell, -0.07, 0.16, 0);
    put(new THREE.CapsuleGeometry(0.05, 0.16, 3, 6), shell, 0.07, 0.16, 0);
    put(new THREE.CapsuleGeometry(0.1, 0.16, 4, 8), shell, 0, 0.42, 0);
    put(new THREE.SphereGeometry(0.09, 12, 10), shell, 0, 0.66, 0);
    put(new THREE.BoxGeometry(0.12, 0.035, 0.02), visor, 0, 0.66, 0.08);
    put(new THREE.SphereGeometry(0.025, 6, 6), joint, 0, 0.52, 0.09);
    g.scale.setScalar(0.32);
    this.walkStops = [this.porch.clone(), ...this.stonePos.map((p) => p.clone())];
    this.walkerPos = this.porch.clone();
    g.position.copy(this.walkerPos);
    this.group.add(g);
    this.walker = g;
    this.walkerVisor = visor;
  }

  buildRibbon() {
    const mesh = this.mesh(
      this.group,
      new THREE.BoxGeometry(0.08, 0.02, 1),
      this.mat(0x3f9a55, { opacity: 0.5, depthWrite: false, emissive: 0x1a5a28, ei: 0.4, rough: 0.4 }),
      0, 0.03, 0,
    );
    mesh.visible = false;
    return mesh;
  }

  buildBeacon() {
    const last = this.stonePos[this.stonePos.length - 1];
    this.mesh(this.group, new THREE.CylinderGeometry(0.04, 0.05, 0.7, 6), this.mat(JOINT, { metal: 0.3 }), last.x, 0.4, last.z);
    const mesh = this.mesh(
      this.group,
      new THREE.SphereGeometry(0.16, 12, 10),
      this.mat(0x3f9a55, { opacity: 0, emissive: 0x3f9a55, ei: 0.2, rough: 0.35 }),
      last.x, 0.78, last.z,
    );
    return mesh;
  }

  buildFog() {
    const count = 90;
    this.fogPos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = 1.7 + (i % 4) * 0.22;
      this.fogPos[i * 3] = QUIET.x + Math.cos(a) * r;
      this.fogPos[i * 3 + 1] = 0.2 + (i % 6) * 0.18;
      this.fogPos[i * 3 + 2] = QUIET.z + Math.sin(a) * r * 0.75;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(this.fogPos, 3));
    this.geos.push(geo);
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x6a6560, size: 0.08, transparent: true, opacity: 0, depthWrite: false }));
    this.mats.push(pts.material);
    this.group.add(pts);
    return pts;
  }

  sync(competition, outcome, correct) {
    this.competition = competition;
    this.outcome = outcome;
    this.correct = correct;
  }

  tick(dt, t, reduced) {
    const on = this.competition === "haven";
    this.group.visible = on;
    if (!on) return;
    const outcome = this.outcome;
    const n = outcome === "line" ? 6 : outcome === "fog" ? 0 : Math.min(6, this.correct);
    const lit = Math.min(6, n);
    const ease = reduced ? 1 : 1 - Math.exp(-3.2 * dt);
    const stain = outcome === "fog" ? 1 : outcome === "line" ? 0 : 0.25;
    this.shell.color.set(SHELL).lerp(BLOOD, stain);

    const doorTarget = outcome === "line" ? -1.2 : 0;
    this.door.rotation.y += (doorTarget - this.door.rotation.y) * ease;

    const curtainMat = this.curtain.material;
    const breath = reduced ? 0.34 : 0.28 + Math.sin(t * 1.3) * 0.1;
    curtainMat.opacity = outcome === "line" ? 0.08 : breath;
    curtainMat.color.copy(outcome === "fog" ? VOID : FLAME);
    curtainMat.emissive.copy(curtainMat.color);

    const phoneMat = this.phone.material;
    const blink = reduced || outcome !== "open" ? 1 : 0.45 + Math.sin(t * 5.5) * 0.55;
    phoneMat.emissiveIntensity = outcome === "fog" ? 0.05 : 0.2 + blink * 0.8;

    this.column.rotation.y = reduced ? 0.4 : t * 0.15;
    this.core.material.opacity = outcome === "fog" ? 0.2 : 0.85;

    this.stageMats.forEach((mat, i) => {
      const litStage = i < n;
      mat.color.set(litStage ? STAGE[i] : 0x2a2824);
      mat.emissive.set(litStage ? STAGE[i] : 0x000000);
      mat.emissiveIntensity = litStage ? 0.55 : 0;
    });

    this.flames.forEach((mesh, i) => {
      const burn = i >= n;
      mesh.visible = burn;
      if (!burn) return;
      mesh.material.color.copy(FLAME).lerp(EMBER, reduced ? 0.4 : 0.5 + Math.sin(t * 8 + i) * 0.5);
      mesh.material.emissive.copy(mesh.material.color);
      mesh.scale.y = reduced ? 1 : 0.7 + Math.abs(Math.sin(t * 9 + i * 1.3)) * 0.55;
    });

    for (let i = 0; i < this.stones.length; i++) {
      const onStone = i < lit;
      const mat = this.stoneMats[i];
      mat.color.set(onStone ? 0xd7e2d4 : STONE);
      mat.emissive.set(onStone ? 0x1a5a28 : 0x000000);
      mat.emissiveIntensity = onStone ? 0.35 : 0;
      this.stones[i].position.y = onStone && !reduced ? 0.08 + Math.sin(t * 2 + i) * 0.02 : 0.05;
    }

    const step = Math.max(0, Math.min(this.walkStops.length - 1, n));
    const goal = this.walkStops[step];
    const easeWalk = reduced ? 1 : 1 - Math.exp(-3.6 * dt);
    this.walkerPos.lerp(goal, easeWalk);
    const grow = 0.55 + (n / 6) * 0.7;
    const s = this.walker.scale.x + (grow - this.walker.scale.x) * easeWalk;
    this.walker.scale.setScalar(Math.max(0.55, s));
    this.walker.position.set(this.walkerPos.x, 0.02, this.walkerPos.z);
    const ahead = this.walkStops[Math.min(step + 1, this.walkStops.length - 1)];
    this.look.copy(ahead);
    const faceX = ahead.x - this.walkerPos.x;
    const faceZ = ahead.z - this.walkerPos.z;
    if (faceX * faceX + faceZ * faceZ > 4e-4) {
      const yaw = Math.atan2(faceX, faceZ);
      this.walker.rotation.y += (yaw - this.walker.rotation.y) * easeWalk;
    }
    const led = outcome === "line" ? 0x3dff86 : outcome === "fog" ? 0xff2a2a : 0x7ec8ff;
    this.walkerVisor.emissive.set(led);
    this.walkerVisor.emissiveIntensity = outcome === "line" ? 0.8 : 0.45;

    const ribbonMat = this.ribbon.material;
    if (lit <= 0) this.ribbon.visible = false;
    else {
      this.ribbon.visible = true;
      const end = this.stonePos[lit - 1];
      const dx = end.x - this.porch.x;
      const dz = end.z - this.porch.z;
      const len = Math.hypot(dx, dz);
      this.ribbon.scale.set(1, 1, len);
      this.ribbon.position.set(this.porch.x + dx / 2, 0.04, this.porch.z + dz / 2);
      this.ribbon.rotation.y = Math.atan2(dx, dz);
      ribbonMat.opacity = outcome === "line" ? 0.9 : 0.5;
    }

    const beaconMat = this.beacon.material;
    const full = lit >= this.stones.length;
    beaconMat.opacity = full ? 1 : 0.25 + (lit / this.stones.length) * 0.35;
    beaconMat.emissiveIntensity = full ? 1.1 : 0.15;
    this.beacon.position.y = 0.78 + (reduced ? 0 : Math.sin(t * 1.6) * 0.04);

    const fogMat = this.fog.material;
    const fogOp = outcome === "line" ? 0.02 : outcome === "lamp" ? 0.22 : outcome === "fog" ? 0.78 : 0.32;
    fogMat.opacity = fogOp;
    if (!reduced && fogOp > 0.05) {
      for (let i = 0; i < this.fogPos.length; i += 3) {
        this.fogPos[i + 1] += dt * (0.15 + (i % 5) * 0.02);
        if (this.fogPos[i + 1] > 1.6) this.fogPos[i + 1] = 0.15;
      }
      this.fog.geometry.getAttribute("position").needsUpdate = true;
    }
  }

  dispose() {
    this.group.removeFromParent();
    for (const g of this.geos) g.dispose();
    for (const m of this.mats) m.dispose();
    this.fog.material.dispose();
  }
}

export { HavenScene, QUIET };
