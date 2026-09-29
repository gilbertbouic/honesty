// Stage 8. Six desks. A stamp only lands on a correct answer.
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
    this.desks = [];
    this.queue = [];
    this.seated = [];
    this.competition = "tender";
    this.outcome = "open";
    this.correct = 0;
    this.active = 0;
    this.deskState = ["open", "open", "open", "open", "open", "open"];
    this.clocks = [2, 2, 2, 2, 2, 2];
    this.rejecting = false;
    this.atRear = false;
    this.rejectTimer = 0;
    this.stamped = 0;
    this.rear = new THREE.Vector3(-3.15, 0, 4.85);

    const hemi = new THREE.HemisphereLight(0xd5e4f2, 0x3a3428, 0.55);
    const sun = new THREE.DirectionalLight(0xfff3df, 1.05);
    sun.position.set(4, 10, 6);
    this.group.add(hemi, sun);
    this.shell = this.mat(PEARL, { rough: 0.32, metal: 0.22 });
    this.joint = this.mat(JOINT, { rough: 0.45, metal: 0.4 });
    this.glass = this.mat(GLASS, { rough: 0.12, metal: 0.55, emissive: 0x1a2830, ei: 0.25 });
    this.ink = this.mat(INK, { rough: 0.4 });
    this.paper = this.mat(0xf7f4ee, { rough: 0.75 });
    this.buildHall();
    this.buildDesks();
    this.buildQueue();
    this.buildSeats();
    this.customer = this.buildCustomer();
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

  deskX(i) {
    return -2.5 + i * 1;
  }

  buildHall() {
    const floor = this.mesh(this.group, new THREE.PlaneGeometry(14, 12), this.tileMat(), 0, -0.02, 1.1);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.mesh(this.group, new THREE.BoxGeometry(8.6, 2.15, 0.1), this.shell, 0, 1.25, -1.4);
    const sign = this.mesh(this.group, new THREE.PlaneGeometry(5.1, 1.45), this.officeSign(), 0, 1.52, -1.33);
    sign.castShadow = false;
    this.flag(-3.55, 1);
    this.flag(3.55, -1);
  }

  tileMat() {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    const cells = 4;
    const size = 256 / cells;
    for (let y = 0; y < cells; y++) {
      for (let x = 0; x < cells; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? "#e7dfd0" : "#d3c6b2";
        ctx.fillRect(x * size, y * size, size, size);
        ctx.strokeStyle = "#b7aa96";
        ctx.lineWidth = 6;
        ctx.strokeRect(x * size + 3, y * size + 3, size - 6, size - 6);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(7, 6);
    tex.anisotropy = 4;
    this.geos.push(tex);
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, metalness: 0.02 });
    this.mats.push(mat);
    return mat;
  }

  flag(x, dir) {
    const g = new THREE.Group();
    g.position.set(x, 0, -1.22);
    this.mesh(g, new THREE.CylinderGeometry(0.035, 0.04, 2.15, 8), this.joint, 0, 1.05, 0);
    this.mesh(g, new THREE.SphereGeometry(0.055, 8, 6), this.mat(0xd4a017, { metal: 0.6, rough: 0.3 }), 0, 2.14, 0);
    FLAG.forEach((color, i) => {
      this.mesh(g, new THREE.BoxGeometry(0.72, 0.16, 0.02), this.mat(color, { rough: 0.45 }), dir * 0.4, 1.82 - i * 0.16, 0);
    });
    this.group.add(g);
  }

  figure(opts) {
    const g = new THREE.Group();
    const s = opts.scale ?? 1;
    const skin = this.mat(opts.skin, { rough: 0.62 });
    const cloth = this.mat(opts.cloth, { rough: 0.52 });
    const pants = this.mat(opts.pants ?? opts.cloth, { rough: 0.58 });
    const hair = this.mat(opts.hair, { rough: 0.5 });
    const body = new THREE.Group();
    g.add(body);
    const legs = [];
    [-1, 1].forEach((side) => {
      const hip = new THREE.Group();
      hip.position.set(side * 0.07 * s, 0.4 * s, 0);
      this.mesh(hip, new THREE.CapsuleGeometry(0.042 * s, 0.16 * s, 3, 5), opts.skirt ? cloth : pants, 0, -0.12 * s, 0);
      this.mesh(hip, new THREE.BoxGeometry(0.07 * s, 0.035 * s, 0.11 * s), this.joint, 0, -0.24 * s, 0.02 * s);
      body.add(hip);
      legs.push(hip);
    });
    if (opts.skirt) this.mesh(body, new THREE.ConeGeometry(0.16 * s, 0.28 * s, 8), cloth, 0, 0.42 * s, 0);
    this.mesh(body, new THREE.BoxGeometry((opts.broad ? 0.32 : 0.26) * s, 0.28 * s, 0.14 * s), cloth, 0, 0.62 * s, 0);
    if (opts.tie) this.mesh(body, new THREE.BoxGeometry(0.03 * s, 0.14 * s, 0.012 * s), this.ink, 0, 0.6 * s, 0.08 * s);
    const arm = new THREE.Group();
    arm.position.set(0.16 * s, 0.72 * s, 0.02 * s);
    this.mesh(arm, new THREE.CapsuleGeometry(0.035 * s, 0.16 * s, 3, 5), cloth, 0.02 * s, -0.12 * s, 0.04 * s);
    const hand = this.mesh(arm, new THREE.SphereGeometry(0.04 * s, 8, 6), skin, 0.02 * s, -0.24 * s, 0.06 * s);
    body.add(arm);
    this.mesh(g, new THREE.SphereGeometry(0.09 * s, 10, 8), skin, 0, 0.86 * s, 0);
    if (!opts.bald) {
      const crown = this.mesh(g, new THREE.SphereGeometry((opts.hijab ? 0.105 : 0.095) * s, 8, 6), opts.hijab || opts.wrap ? cloth : hair, 0, 0.92 * s, -0.01 * s);
      crown.scale.y = opts.hijab ? 0.85 : 0.6;
    }
    if (opts.beard) this.mesh(g, new THREE.SphereGeometry(0.05 * s, 6, 5), hair, 0, 0.8 * s, 0.05 * s);
    if (opts.cap) this.mesh(g, new THREE.CylinderGeometry(0.07 * s, 0.08 * s, 0.04 * s, 8), opts.cap, 0, 0.96 * s, 0);
    if (opts.wrap) this.mesh(g, new THREE.TorusGeometry(0.07 * s, 0.025 * s, 6, 10), cloth, 0, 0.9 * s, 0);
    if (opts.cane) this.mesh(body, new THREE.CylinderGeometry(0.012 * s, 0.012 * s, 0.7 * s, 5), this.mat(0x6d5a40, { rough: 0.7 }), 0.2 * s, 0.32 * s, 0.08 * s);
    g.userData.legs = legs;
    g.userData.body = body;
    g.userData.arm = arm;
    g.userData.hand = hand;
    return g;
  }

  buildDesks() {
    const clerks = [
      { skin: 0xc4865a, cloth: 0x1a2744, pants: 0x1a2744, hair: 0x14120e, tie: true },
      { skin: 0x8d5524, cloth: 0x243044, pants: 0x1c242c, hair: 0x1a120c, tie: true },
      { skin: 0xd7b39a, cloth: 0x1a206d, pants: 0x1a1c22, hair: 0x3a2418, tie: true },
      { skin: 0x5c3317, cloth: 0x2a2428, pants: 0x1c2430, hair: 0x0e0c0a, tie: true },
      { skin: 0xf0c7a0, cloth: 0x1a3a4a, pants: 0x1a2744, hair: 0x6b4423, tie: true, bald: true },
      { skin: 0xa86b45, cloth: 0x142033, pants: 0x1a1c22, hair: 0x2a1810, tie: true },
    ];
    clerks.forEach((look, i) => {
      const desk = new THREE.Group();
      desk.position.set(this.deskX(i), 0, 0);
      this.mesh(desk, new THREE.BoxGeometry(0.86, 0.68, 0.52), this.mat(0x6d4c32, { rough: 0.7 }), 0, 0.34, 0.05);
      this.mesh(desk, new THREE.BoxGeometry(0.92, 0.06, 0.62), this.shell, 0, 0.7, 0.06);
      this.mesh(desk, new THREE.BoxGeometry(0.22, 0.015, 0.16), this.joint, -0.22, 0.75, 0.02);
      const screen = this.mesh(desk, new THREE.BoxGeometry(0.22, 0.14, 0.015), this.glass.clone(), -0.22, 0.84, -0.04);
      this.mats.push(screen.material);
      screen.rotation.x = -0.35;
      this.mesh(desk, new THREE.BoxGeometry(0.1, 0.02, 0.1), this.ink, 0.24, 0.75, 0.08);
      this.mesh(desk, new THREE.BoxGeometry(0.12, 0.16, 0.02), this.mat(0xe7d7a8, { rough: 0.7 }), 0.16, 0.82, -0.12);
      this.mesh(desk, new THREE.BoxGeometry(0.12, 0.16, 0.02), this.mat(0xf4f1ea, { rough: 0.7 }), 0.3, 0.82, -0.1);
      const form = this.mesh(desk, new THREE.BoxGeometry(0.22, 0.012, 0.16), this.paper, 0.02, 0.76, 0.12);
      form.visible = false;
      const mark = this.mesh(desk, new THREE.CircleGeometry(0.045, 14), this.ink, 0.05, 0.78, 0.12);
      mark.rotation.x = -Math.PI / 2;
      mark.scale.setScalar(0.001);
      const clerk = this.figure({ ...look, scale: 1.05, broad: true });
      clerk.position.set(0, 0, -0.42);
      const stamp = new THREE.Group();
      this.mesh(stamp, new THREE.CylinderGeometry(0.028, 0.032, 0.16, 8), this.joint, 0, 0.08, 0);
      this.mesh(stamp, new THREE.BoxGeometry(0.09, 0.03, 0.09), this.shell, 0, -0.01, 0);
      this.mesh(stamp, new THREE.BoxGeometry(0.07, 0.015, 0.07), this.ink, 0, -0.03, 0);
      clerk.userData.hand.add(stamp);
      stamp.position.set(0, -0.05, 0.02);
      desk.add(clerk);
      this.group.add(desk);
      this.desks.push({ root: desk, clerk, form, mark, stamp, screen });
    });
  }

  buildQueue() {
    const people = [
      { skin: 0xc48a62, cloth: 0x3a3148, pants: 0x3a3148, hair: 0x2a1810, hijab: true, skirt: true },
      { skin: 0x5c3317, cloth: 0xc45c26, pants: 0x1c242c, hair: 0x1a120c, cap: this.mat(0xf0c030, { rough: 0.5 }), beard: true },
      { skin: 0xf3d2b5, cloth: 0x4a5560, pants: 0x2c3138, hair: 0xd5d3cc, cane: true, scale: 0.92 },
      { skin: 0x3d2314, cloth: 0x00a551, pants: 0x1a2744, hair: 0x0e0c0a, wrap: true, skirt: true },
      { skin: 0xa86b45, cloth: 0xf4f1ea, pants: 0x1a1c22, hair: 0x2a1810, wrap: true, beard: true },
      { skin: 0xf0c7a0, cloth: 0x245c8a, pants: 0x1c2430, hair: 0x3a2418, skirt: true },
      { skin: 0xd7b39a, cloth: 0x1a1c22, pants: 0x1a2744, hair: 0x1a120e, cap: this.mat(0x14161c, { rough: 0.45 }) },
      { skin: 0x8d5524, cloth: 0xc45b78, pants: 0xc45b78, hair: 0x1a120c, skirt: true },
      { skin: 0xe8c4a8, cloth: 0x2a6f7f, pants: 0x243044, hair: 0x6b4423, cap: this.mat(0x1a2744, { rough: 0.5 }) },
      { skin: 0x6b3a22, cloth: 0x7a3e8a, pants: 0x2a2428, hair: 0x140e0c, skirt: true },
    ];
    people.forEach((person, i) => {
      const fig = this.figure(person);
      fig.position.set(-3.15, 0, 0.15 + i * 0.46);
      fig.rotation.y = -Math.PI / 2;
      this.group.add(fig);
      this.queue.push(fig);
    });
  }

  buildSeats() {
    const people = [
      { skin: 0xf3d2b5, cloth: 0x8d3a2f, pants: 0x2c3138, hair: 0x3a2418, skirt: true },
      { skin: 0x5c3317, cloth: 0x1a2744, pants: 0x1a1c22, hair: 0x14120e, beard: true },
      { skin: 0xd7b39a, cloth: 0xc47a8a, pants: 0xc47a8a, hair: 0x6b4423, hijab: true, skirt: true },
      { skin: 0x8d5524, cloth: 0x2a6f7f, pants: 0x243044, hair: 0x1a120c, cap: this.mat(0xf4f1ea, { rough: 0.5 }) },
      { skin: 0xe8c4a8, cloth: 0x4a5560, pants: 0x3a4048, hair: 0xd5d3cc, scale: 0.9 },
      { skin: 0x3d2314, cloth: 0xd4a017, pants: 0x1c242c, hair: 0x0e0c0a, wrap: true },
      { skin: 0xa86b45, cloth: 0xf4f1ea, pants: 0xf4f1ea, hair: 0x2a1810, skirt: true },
      { skin: 0x6b3a22, cloth: 0x245c8a, pants: 0x1a2744, hair: 0x140e0c, beard: true },
    ];
    const wood = this.mat(0x6d4c32, { rough: 0.75 });
    people.forEach((person, i) => {
      const x = -4.2;
      const z = 0.2 + i * 0.55;
      const chair = new THREE.Group();
      chair.position.set(x, 0, z);
      this.mesh(chair, new THREE.BoxGeometry(0.42, 0.05, 0.42), this.shell, 0, 0.42, 0);
      this.mesh(chair, new THREE.BoxGeometry(0.4, 0.42, 0.04), wood, -0.18, 0.68, 0);
      [[-0.16, -0.16], [0.16, -0.16], [-0.16, 0.16], [0.16, 0.16]].forEach(([lx, lz]) => {
        this.mesh(chair, new THREE.BoxGeometry(0.04, 0.4, 0.04), wood, lx, 0.2, lz);
      });
      this.group.add(chair);
      const fig = this.figure(person);
      fig.position.set(x + 0.02, 0.06, z);
      fig.rotation.y = -Math.PI / 2;
      fig.userData.legs.forEach((hip) => { hip.rotation.x = 1.2; });
      this.group.add(fig);
      this.seated.push(fig);
    });
  }

  officeSign() {
    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f4f5f3";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1a1c1f";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "700 64px Georgia, 'Times New Roman', serif";
    ctx.fillText("CIVIL SERVICES", 640, 78);
    ctx.fillStyle = "#8a847c";
    ctx.fillRect(390, 118, 500, 3);
    ctx.fillStyle = "#1a2744";
    ctx.font = "600 34px Georgia, 'Times New Roman', serif";
    [
      "No envelope under the glass.",
      "The posted fee is the only fee.",
      "A public stamp is not for sale.",
    ].forEach((line, i) => ctx.fillText(line, 640, 175 + i * 52));
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    this.geos.push(tex);
    const mat = new THREE.MeshBasicMaterial({ map: tex });
    this.mats.push(mat);
    return mat;
  }

  buildCustomer() {
    const fig = this.figure({
      skin: 0xd7b39a,
      cloth: 0x0e7c86,
      pants: 0x1c2430,
      hair: 0x2a1810,
      scale: 1.05,
    });
    fig.position.set(this.deskX(0), 0, 0.95);
    fig.rotation.y = Math.PI;
    const form = this.mesh(fig.userData.hand, new THREE.BoxGeometry(0.16, 0.012, 0.11), this.paper, 0, -0.02, 0.06);
    form.rotation.x = -0.6;
    fig.userData.form = form;
    this.group.add(fig);
    return fig;
  }

  sync(competition, outcome, correct, desks, active) {
    this.competition = competition;
    this.outcome = outcome;
    this.correct = correct || 0;
    const next = Array.isArray(desks) && desks.length === 6 ? desks : this.deskState;
    const stamped = next.filter((d) => d === "held").length;
    if (next.every((d) => d === "open")) {
      this.rejecting = false;
      this.atRear = false;
      this.rejectTimer = 0;
      this.stamped = 0;
      this.clocks = [2, 2, 2, 2, 2, 2];
      if (this.customer) {
        this.customer.position.set(this.deskX(0), 0, 0.95);
        this.customer.rotation.y = Math.PI;
      }
    } else {
      const freshMiss = next.findIndex((d, i) => d === "miss" && this.deskState[i] !== "miss");
      if (freshMiss >= 0) {
        this.rejecting = true;
        this.atRear = false;
        this.rejectTimer = 0;
      }
      if (stamped > this.stamped) this.clocks[stamped - 1] = 0;
      this.stamped = stamped;
    }
    this.deskState = next.slice();
    this.active = Number.isFinite(active) ? active : 0;
  }

  face(root, yaw, ease) {
    let dy = yaw - root.rotation.y;
    while (dy > Math.PI) dy -= Math.PI * 2;
    while (dy < -Math.PI) dy += Math.PI * 2;
    root.rotation.y += dy * ease;
  }

  tick(dt, t, reduced) {
    const on = this.competition === "stamp";
    this.group.visible = on;
    if (!on) return;
    const ease = reduced ? 1 : 1 - Math.exp(-3.2 * dt);
    const perfect = this.stamped >= 6;
    if (this.rejecting && this.atRear) {
      this.rejectTimer += dt;
      if (this.rejectTimer > 0.55) {
        this.rejecting = false;
        this.atRear = false;
        this.rejectTimer = 0;
      }
    }
    const slot = Math.min(5, this.stamped);
    const stamping = this.stamped > 0 && this.clocks[this.stamped - 1] < 0.75;
    const goalSlot = perfect ? 5 : stamping ? this.stamped - 1 : slot;
    const at = this.desks[goalSlot].root.position;
    let goalX = at.x;
    let goalZ = 0.95;
    if (perfect && !stamping) {
      goalX = 0;
      goalZ = 1.35;
    } else if (this.rejecting) {
      goalX = this.rear.x;
      goalZ = this.rear.z;
    }
    const customer = this.customer;
    const dx = goalX - customer.position.x;
    const dz = goalZ - customer.position.z;
    const dist = Math.hypot(dx, dz);
    const moving = dist > 0.05;
    customer.position.x += dx * ease;
    customer.position.z += dz * ease;
    if (moving) this.face(customer, Math.atan2(dx, dz), ease);
    else if (perfect) this.face(customer, 0, ease);
    else if (!this.rejecting) this.face(customer, Math.PI, ease);
    const arrived = dist < 0.12;
    if (this.rejecting && arrived) this.atRear = true;
    const step = moving ? Math.sin(t * 9) * 0.65 : 0;
    customer.userData.legs[0].rotation.x = step;
    customer.userData.legs[1].rotation.x = -step;
    const dance = perfect && !moving && !reduced;
    customer.userData.body.rotation.z = dance ? Math.sin(t * 8) * 0.28 : 0;
    customer.userData.body.rotation.x = dance ? Math.abs(Math.sin(t * 8)) * 0.08 : 0;
    customer.userData.body.position.y = dance ? Math.abs(Math.sin(t * 8)) * 0.05 : 0;
    const showCarry = !perfect && (moving || this.rejecting || !arrived);
    customer.userData.form.visible = showCarry;
    this.desks.forEach((item, i) => {
      this.clocks[i] = Math.min(2, this.clocks[i] + dt);
      const held = i < this.stamped;
      const waiting = i === goalSlot && !held && !this.rejecting && arrived && !perfect;
      item.form.visible = held || waiting;
      const u = Math.min(1, this.clocks[i] / 0.85);
      const dip = held && u < 1 ? Math.sin(u * Math.PI) : 0;
      item.clerk.userData.arm.rotation.x = 0.45 + dip * 1.15;
      const mark = held && (this.clocks[i] > 0.4 || reduced) ? 1.5 : 0.001;
      item.mark.scale.x += (mark - item.mark.scale.x) * ease;
      item.mark.scale.y += (mark - item.mark.scale.y) * ease;
      item.mark.scale.z += (mark - item.mark.scale.z) * ease;
      const idle = reduced ? 0 : Math.sin(t * 1.4 + i) * 0.04;
      item.clerk.userData.legs[0].rotation.x = idle;
      item.clerk.userData.legs[1].rotation.x = -idle;
      item.screen.material.emissive.set(held ? 0x143024 : 0x1a2830);
    });
    if (!reduced) {
      this.queue.forEach((person, i) => {
        const sway = Math.sin(t * 1.3 + i) * 0.03;
        person.userData.body.rotation.z = sway;
        person.position.x = -3.15 + Math.sin(t * 0.8 + i) * 0.02;
      });
      this.seated.forEach((person, i) => {
        person.userData.body.rotation.z = Math.sin(t * 1.1 + i) * 0.02;
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
