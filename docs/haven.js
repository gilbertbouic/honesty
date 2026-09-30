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
const STAGE = [0x14120f, 0x9a9590, 0x00a551, 0xffd100, 0x1a206d, 0xea2839];

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
    this.buildMan();
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
      this.mat(0xd7eef6, { opacity: 0.22, depthWrite: false, side: THREE.DoubleSide, rough: 0.15, metal: 0.05 }),
      QUIET.x + 0.42,
      1.78,
      QUIET.z + 0.98,
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
    this.justice = this.buildJustice(g);
    g.userData.core = core;
    this.group.add(g);
    return g;
  }

  buildJustice(parent) {
    const bronze = this.mat(0xb08a4a, { rough: 0.42, metal: 0.55 });
    const dark = this.mat(0x5a3e1c, { rough: 0.5, metal: 0.4 });
    const cloth = this.mat(0xc4a35a, { rough: 0.55, metal: 0.22 });
    const root = new THREE.Group();
    root.position.set(0, 2.38, 0);
    parent.add(root);
    this.mesh(root, new THREE.CylinderGeometry(0.16, 0.2, 0.08, 8), dark, 0, 0.04, 0);
    this.mesh(root, new THREE.ConeGeometry(0.2, 0.55, 8), cloth, 0, 0.36, 0);
    this.mesh(root, new THREE.BoxGeometry(0.16, 0.22, 0.12), cloth, 0, 0.68, 0);
    this.mesh(root, new THREE.SphereGeometry(0.09, 10, 8), bronze, 0, 0.88, 0);
    this.mesh(root, new THREE.BoxGeometry(0.16, 0.035, 0.035), dark, 0, 0.89, 0.07);
    this.mesh(root, new THREE.BoxGeometry(0.12, 0.05, 0.1), bronze, 0, 0.96, -0.01);
    const leftArm = new THREE.Group();
    leftArm.position.set(-0.14, 0.7, 0);
    leftArm.rotation.z = 0.55;
    root.add(leftArm);
    this.mesh(leftArm, new THREE.BoxGeometry(0.05, 0.28, 0.05), cloth, 0, 0.12, 0);
    const scales = new THREE.Group();
    scales.position.set(0, 0.3, 0);
    leftArm.add(scales);
    this.mesh(scales, new THREE.BoxGeometry(0.42, 0.02, 0.03), dark, 0, 0, 0);
    this.mesh(scales, new THREE.CylinderGeometry(0.015, 0.015, 0.08, 6), dark, 0, 0.04, 0);
    const panL = this.mesh(scales, new THREE.CylinderGeometry(0.07, 0.055, 0.025, 8), bronze, -0.2, -0.16, 0);
    const panR = this.mesh(scales, new THREE.CylinderGeometry(0.07, 0.055, 0.025, 8), bronze, 0.2, -0.16, 0);
    this.mesh(scales, new THREE.BoxGeometry(0.01, 0.16, 0.01), dark, -0.2, -0.08, 0);
    this.mesh(scales, new THREE.BoxGeometry(0.01, 0.16, 0.01), dark, 0.2, -0.08, 0);
    const rightArm = new THREE.Group();
    rightArm.position.set(0.14, 0.7, 0);
    rightArm.rotation.z = -0.85;
    root.add(rightArm);
    this.mesh(rightArm, new THREE.BoxGeometry(0.05, 0.28, 0.05), cloth, 0, 0.12, 0);
    this.mesh(rightArm, new THREE.BoxGeometry(0.03, 0.42, 0.03), dark, 0, 0.38, 0);
    this.mesh(rightArm, new THREE.BoxGeometry(0.08, 0.03, 0.03), dark, 0, 0.58, 0);
    root.userData.scales = scales;
    return root;
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

  buildMan() {
    const root = new THREE.Group();
    const skin = this.mat(0xc48a62, { rough: 0.62 });
    const beardMat = this.mat(0x1a120e, { rough: 0.85 });
    const shirt = this.mat(0x241c18, { rough: 0.75 });
    const dark = this.mat(0x140c0a, { rough: 0.45 });
    const put = (parent, geo, material, x, y, z) => this.mesh(parent, geo, material, x, y, z);
    put(root, new THREE.BoxGeometry(0.42, 0.28, 0.18), shirt, 0, 0.28, 0);
    const head = new THREE.Group();
    head.position.set(0, 0.58, 0.02);
    root.add(head);
    put(head, new THREE.SphereGeometry(0.16, 14, 12), skin, 0, 0.08, 0);
    put(head, new THREE.SphereGeometry(0.15, 12, 10), beardMat, 0, -0.02, 0.04);
    const beard = put(head, new THREE.BoxGeometry(0.16, 0.1, 0.08), beardMat, 0, -0.06, 0.1);
    beard.scale.y = 1.2;
    put(head, new THREE.BoxGeometry(0.12, 0.035, 0.04), beardMat, 0, 0.02, 0.14);
    put(head, new THREE.SphereGeometry(0.028, 8, 6), this.mat(0xf4f1ea, { rough: 0.35 }), -0.055, 0.1, 0.13);
    put(head, new THREE.SphereGeometry(0.028, 8, 6), this.mat(0xf4f1ea, { rough: 0.35 }), 0.055, 0.1, 0.13);
    put(head, new THREE.SphereGeometry(0.014, 8, 6), dark, -0.055, 0.1, 0.15);
    put(head, new THREE.SphereGeometry(0.014, 8, 6), dark, 0.055, 0.1, 0.15);
    const browL = put(head, new THREE.BoxGeometry(0.09, 0.025, 0.03), dark, -0.055, 0.15, 0.13);
    const browR = put(head, new THREE.BoxGeometry(0.09, 0.025, 0.03), dark, 0.055, 0.15, 0.13);
    browL.rotation.z = 0.55;
    browR.rotation.z = -0.55;
    const frown = put(head, new THREE.BoxGeometry(0.07, 0.018, 0.02), dark, 0, -0.02, 0.15);
    frown.rotation.z = Math.PI;
    const fx = QUIET.x + 0.42;
    const fy = 1.46;
    const fz = QUIET.z + 0.96;
    const frame = this.mat(0x2c241c, { rough: 0.55 });
    this.mesh(this.group, new THREE.BoxGeometry(0.86, 0.08, 0.1), frame, fx, fy + 0.36, fz);
    this.mesh(this.group, new THREE.BoxGeometry(0.86, 0.08, 0.1), frame, fx, fy - 0.36, fz);
    this.mesh(this.group, new THREE.BoxGeometry(0.08, 0.8, 0.1), frame, fx - 0.4, fy, fz);
    this.mesh(this.group, new THREE.BoxGeometry(0.08, 0.8, 0.1), frame, fx + 0.4, fy, fz);
    this.mesh(
      this.group,
      new THREE.PlaneGeometry(0.72, 0.64),
      this.mat(0xd5e8ee, { opacity: 0.16, depthWrite: false, side: THREE.DoubleSide, rough: 0.05 }),
      fx, fy, fz + 0.08,
    );
    root.position.set(fx, fy - 0.55, fz + 0.02);
    root.scale.setScalar(0.95);
    this.group.add(root);
    this.man = { root, head };
  }

  buildChild() {
    const root = new THREE.Group();
    const skin = this.mat(0xe0c0a4, { rough: 0.7 });
    const hairMat = this.mat(0x2a1814, { rough: 0.55 });
    const cloth = this.mat(0x4a6f8a, { rough: 0.55 });
    const put = (parent, geo, material, x, y, z) => this.mesh(parent, geo, material, x, y, z);
    put(root, new THREE.ConeGeometry(0.14, 0.32, 8), cloth, 0, 0.28, 0);
    put(root, new THREE.BoxGeometry(0.14, 0.16, 0.1), cloth, 0, 0.48, 0);
    const head = new THREE.Group();
    head.position.set(0, 0.64, 0);
    root.add(head);
    put(head, new THREE.SphereGeometry(0.1, 12, 10), skin, 0, 0.05, 0);
    put(head, new THREE.SphereGeometry(0.1, 10, 8), hairMat, 0, 0.1, -0.01);
    put(head, new THREE.SphereGeometry(0.016, 6, 6), this.mat(0x1a1214, { rough: 0.4 }), -0.03, 0.06, 0.08);
    put(head, new THREE.SphereGeometry(0.016, 6, 6), this.mat(0x1a1214, { rough: 0.4 }), 0.03, 0.06, 0.08);
    root.scale.setScalar(0.78);
    return { root, head };
  }

  buildWoman(dressColor, hairColor) {
    const root = new THREE.Group();
    const skin = this.mat(0xd7b39a, { rough: 0.7 });
    const hairMat = this.mat(hairColor, { rough: 0.55 });
    const dress = this.mat(dressColor, { rough: 0.48 });
    const eye = this.mat(0x1a1214, { rough: 0.4 });
    const tearMat = this.mat(0xb7e4f2, { opacity: 0.95, depthWrite: false, emissive: 0x7ec8e8, ei: 0.35, rough: 0.2 });
    const spine = new THREE.Group();
    root.add(spine);
    const put = (parent, geo, material, x, y, z) => this.mesh(parent, geo, material, x, y, z);
    put(spine, new THREE.ConeGeometry(0.2, 0.52, 10), dress, 0, 0.46, 0);
    put(spine, new THREE.BoxGeometry(0.18, 0.28, 0.12), dress, 0, 0.78, 0);
    const head = new THREE.Group();
    head.position.set(0, 1.05, 0);
    spine.add(head);
    put(head, new THREE.SphereGeometry(0.12, 14, 12), skin, 0, 0.08, 0);
    put(head, new THREE.SphereGeometry(0.125, 12, 10), hairMat, 0, 0.14, -0.02);
    put(head, new THREE.CapsuleGeometry(0.045, 0.28, 3, 6), hairMat, 0, -0.08, -0.06);
    put(head, new THREE.SphereGeometry(0.02, 8, 6), eye, -0.04, 0.09, 0.1);
    put(head, new THREE.SphereGeometry(0.02, 8, 6), eye, 0.04, 0.09, 0.1);
    const tears = [];
    for (const x of [-0.04, 0.04]) {
      const tear = put(head, new THREE.CapsuleGeometry(0.012, 0.07, 2, 6), tearMat, x, 0.02, 0.11);
      tear.visible = false;
      tears.push(tear);
    }
    const arm = (side) => {
      const pivot = new THREE.Group();
      pivot.position.set(side * 0.16, 0.9, 0);
      spine.add(pivot);
      put(pivot, new THREE.CapsuleGeometry(0.035, 0.28, 3, 6), dress, 0, -0.2, 0);
      put(pivot, new THREE.SphereGeometry(0.04, 8, 6), skin, 0, -0.38, 0);
      return pivot;
    };
    root.scale.setScalar(0.92);
    return { root, spine, head, tears, armL: arm(-1), armR: arm(1) };
  }

  buildWalker() {
    this.hero = this.buildWoman(0xc45b78, 0x2a1814);
    this.child = this.buildChild();
    this.friend = this.buildWoman(0x3f6f62, 0x1a1c1f);
    this.friend.root.visible = false;
    this.support = [
      [0xd4a017, 0x3a2418],
      [0x7a3e8a, 0x1a1214],
      [0x3a6fd8, 0x24180f],
      [0xc47a4a, 0x3a241c],
    ].map(([dress, hair]) => {
      const woman = this.buildWoman(dress, hair);
      woman.root.visible = false;
      return woman;
    });
    this.inside = new THREE.Vector3(QUIET.x + 0.02, 0, QUIET.z + 0.98);
    this.path = [this.inside, ...this.stonePos];
    this.heroPos = this.inside.clone();
    this.friendPos = this.inside.clone();
    this.hero.root.position.copy(this.heroPos);
    this.child.root.position.copy(this.heroPos);
    this.group.add(this.hero.root, this.child.root, this.friend.root);
    for (const woman of this.support) this.group.add(woman.root);
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
    let n = Math.min(6, this.correct);
    if (outcome === "line") n = 6;
    const lit = Math.min(6, n);
    const ease = reduced ? 1 : 1 - Math.exp(-3.2 * dt);
    const stain = outcome === "fog" ? 1 : outcome === "line" ? 0 : 0.25;
    this.shell.color.set(SHELL).lerp(BLOOD, stain);

    const doorTarget = n >= 1 ? -1.2 : 0;
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
    if (this.justice?.userData.scales) {
      this.justice.userData.scales.rotation.z = reduced ? 0 : Math.sin(t * 1.4) * 0.08;
    }
    this.core.material.opacity = outcome === "fog" ? 0.2 : 0.85;

    this.stageMats.forEach((mat, i) => {
      const litStage = i < n;
      mat.color.set(litStage ? STAGE[i] : 0x2a2824);
      mat.emissive.set(litStage ? STAGE[i] : 0x000000);
      mat.emissiveIntensity = litStage ? (i < 2 ? 0.08 : 0.35) : 0;
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

    const easeWalk = reduced ? 1 : 1 - Math.exp(-3.2 * dt);
    const goal = this.path[Math.min(n, this.path.length - 1)];
    this.heroPos.lerp(goal, easeWalk);
    this.hero.root.position.set(this.heroPos.x, n >= 6 && !reduced ? Math.abs(Math.sin(t * 3)) * 0.05 : 0, this.heroPos.z);
    const crying = n >= 1 && n <= 3;
    const headDown = n <= 0 ? 0.7 : n === 1 ? 0.9 : n === 2 ? 0.42 : n === 3 ? 0.5 : n === 4 ? 0.06 : -0.38;
    const bow = n <= 1 ? 0.32 : n === 2 ? 0.14 : 0;
    this.hero.head.rotation.x += (headDown - this.hero.head.rotation.x) * easeWalk;
    this.hero.spine.rotation.x += (bow - this.hero.spine.rotation.x) * easeWalk;
    const heroYaw = n === 3 ? 0.85 : 0;
    this.hero.root.rotation.y += (heroYaw - this.hero.root.rotation.y) * easeWalk;
    const childBack = n === 3 ? -0.22 : 0.04;
    this.child.root.position.set(
      this.heroPos.x - 0.38,
      n >= 6 && !reduced ? Math.abs(Math.sin(t * 3 + 0.4)) * 0.035 : 0,
      this.heroPos.z + childBack,
    );
    this.child.root.rotation.y += ((n === 3 ? 0.4 : 0) - this.child.root.rotation.y) * easeWalk;
    const childHead = n >= 5 ? -0.18 : 0.4;
    this.child.head.rotation.x += (childHead - this.child.head.rotation.x) * easeWalk;
    if (!reduced) this.man.head.rotation.y = Math.sin(t * 0.6) * 0.12;
    for (const tear of this.hero.tears) {
      tear.visible = crying;
      if (!crying || reduced) continue;
      tear.position.y -= dt * 0.28;
      if (tear.position.y < -0.08) tear.position.y = 0.04;
    }
    const hug = n === 3;
    const paired = n >= 3;
    this.friend.root.visible = paired;
    if (paired) {
      const beside = hug ? 0.32 : 0.5;
      this.friendPos.lerp(new THREE.Vector3(goal.x + beside, 0, goal.z + (hug ? 0.02 : 0)), easeWalk);
      this.friend.root.position.set(
        this.friendPos.x,
        n >= 6 && !reduced ? Math.abs(Math.sin(t * 3 + 0.8)) * 0.05 : 0,
        this.friendPos.z,
      );
      const face = hug ? Math.PI - 0.4 : 0;
      this.friend.root.rotation.y += (face - this.friend.root.rotation.y) * easeWalk;
      const fHead = n >= 5 ? -0.2 : hug ? 0.25 : 0.05;
      this.friend.head.rotation.x += (fHead - this.friend.head.rotation.x) * easeWalk;
      this.friend.spine.rotation.x += (0 - this.friend.spine.rotation.x) * easeWalk;
    }
    const reach = (fig, left, right, lift) => {
      fig.armL.rotation.z += (left - fig.armL.rotation.z) * easeWalk;
      fig.armR.rotation.z += (right - fig.armR.rotation.z) * easeWalk;
      fig.armL.rotation.x += (lift - fig.armL.rotation.x) * easeWalk;
      fig.armR.rotation.x += (lift - fig.armR.rotation.x) * easeWalk;
    };
    if (n >= 6) {
      const lift = reduced ? -1.4 : -1.5 + Math.sin(t * 4) * 0.35;
      reach(this.hero, -0.2, 0.2, lift);
      reach(this.friend, 0.2, -0.2, reduced ? -1.4 : -1.5 + Math.sin(t * 4 + 1) * 0.35);
    } else if (hug) {
      reach(this.hero, 1.15, -1.15, -0.35);
      reach(this.friend, 1.15, -1.15, -0.35);
    } else if (n >= 4) {
      reach(this.hero, -0.55, -0.7, 0);
      reach(this.friend, 0.7, -0.12, 0);
    } else {
      reach(this.hero, -0.5, -0.15, 0.1);
      reach(this.friend, 0.15, -0.15, 0);
    }
    this.support.forEach((woman, i) => {
      const onDance = n >= 6;
      woman.root.visible = onDance;
      if (!onDance) return;
      const ang = (reduced ? i : t * 0.7) + (i / this.support.length) * Math.PI * 2;
      woman.root.position.set(
        goal.x + Math.cos(ang) * 1.15,
        reduced ? 0 : Math.abs(Math.sin(t * 3.2 + i)) * 0.07,
        goal.z + Math.sin(ang) * 1.15,
      );
      woman.root.rotation.y = -ang + Math.PI / 2;
      const lift = reduced ? -1.3 : -1.6 + Math.sin(t * 4 + i) * 0.4;
      woman.armL.rotation.x = lift;
      woman.armR.rotation.x = lift;
      woman.armL.rotation.z = -0.35;
      woman.armR.rotation.z = 0.35;
      woman.head.rotation.x = -0.2;
    });

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
