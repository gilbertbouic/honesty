// Stage 10. The oath is undivided. The room watches each seat.
import * as THREE from "three";

const PEARL = 0xf4f5f3;
const INK = 0x1a1c1f;

class OathScene {
  constructor(scene) {
    this.group = new THREE.Group();
    this.geos = [];
    this.mats = [];
    this.marks = {};
    this.active = "cousin";
    this.outcome = "open";
    this.competition = "tender";
    const hemi = new THREE.HemisphereLight(0xd5e4f2, 0x3a3428, 0.55);
    const sun = new THREE.DirectionalLight(0xfff3df, 1.02);
    sun.position.set(3, 10, 5);
    this.group.add(hemi, sun);
    this.shell = this.mat(PEARL, { rough: 0.32, metal: 0.22 });
    this.joint = this.mat(INK, { rough: 0.45, metal: 0.4 });
    this.ink = this.mat(0xea2839, { rough: 0.4 });
    this.wood = this.mat(0x6d4c32, { rough: 0.72 });
    this.buildRoom();
    this.chair = this.person({ skin: 0xd7b39a, cloth: 0x1a206d, pants: 0x1a1c22, hair: 0x2a1810, tie: true }, 0, -0.86, 0);
    this.cousin = this.person({ skin: 0x8d5524, cloth: 0xc45c26, pants: 0x1c242c, hair: 0x1a120c }, -1.4, 0.62, 0.7);
    this.clerk = this.person({ skin: 0xf0c7a0, cloth: 0x243044, pants: 0x1a2744, hair: 0x3a2418, skirt: true }, 1.2, 0.52, -2.2);
    this.member = this.person({ skin: 0x5c3317, cloth: 0x1a2744, pants: 0x1a1c22, hair: 0x14120e, beard: true }, -1.28, -0.05, 0.45);
    this.memberB = this.person({ skin: 0xf3d2b5, cloth: 0x2a6f7f, pants: 0x1c242c, hair: 0x3a2418, skirt: true }, 1.28, -0.05, -0.45);
    this.bearer = this.person({ skin: 0xe8c4a8, cloth: 0x3a6f4a, pants: 0x2c3138, hair: 0x6b4423 }, -1.05, 0.92, 0.8);
    this.friend = this.person({ skin: 0xa86b45, cloth: 0x4a5560, pants: 0x243044, hair: 0x2a1810 }, 1.42, 0.72, -2.2);
    this.folder = this.prop(0.22, 0.035, 0.16, 0xc45c26);
    this.pen = this.prop(0.018, 0.018, 0.16, 0x1a1c1f);
    this.line = this.prop(0.28, 0.008, 0.014, 0xea2839);
    this.line.scale.setScalar(0.01);
    this.hamper = this.hamperMesh();
    this.page = this.prop(0.24, 0.01, 0.32, 0xf7f4ee);
    this.sign = this.prop(0.12, 0.008, 0.028, 0x1a2744);
    this.sign.scale.setScalar(0.01);
    this.key = this.keyMesh();
    this.seat(this.chair, 1);
    this.seat(this.member, 1);
    this.seat(this.memberB, 1);
    this.group.visible = false;
    this.group.scale.setScalar(1.25);
    scene.add(this.group);
  }

  mat(color, opts = {}) {
    const m = new THREE.MeshStandardMaterial({
      color,
      roughness: opts.rough ?? 0.6,
      metalness: opts.metal ?? 0.05,
    });
    this.mats.push(m);
    return m;
  }

  mesh(parent, geo, material, x, y, z) {
    if (geo) this.geos.push(geo);
    const mesh = geo ? new THREE.Mesh(geo, material) : material;
    if (geo) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }

  prop(w, h, d, color) {
    return this.mesh(this.group, new THREE.BoxGeometry(w, h, d), this.mat(color, { rough: 0.5 }), 0, 0.2, 0);
  }

  hamperMesh() {
    const g = new THREE.Group();
    this.mesh(g, new THREE.BoxGeometry(0.32, 0.18, 0.24), this.mat(0x8a5a32, { rough: 0.7 }), 0, 0.12, 0);
    this.mesh(g, new THREE.TorusGeometry(0.1, 0.012, 6, 10), this.wood, 0, 0.26, 0).rotation.x = Math.PI / 2;
    this.mesh(g, new THREE.SphereGeometry(0.05, 8, 6), this.mat(0xea2839, { rough: 0.45 }), -0.06, 0.24, 0.02);
    this.mesh(g, new THREE.SphereGeometry(0.045, 8, 6), this.mat(0x3a6f4a, { rough: 0.5 }), 0.06, 0.23, -0.02);
    this.mesh(g, new THREE.SphereGeometry(0.04, 8, 6), this.mat(0xffd500, { rough: 0.45 }), 0.01, 0.25, 0.06);
    this.group.add(g);
    return g;
  }

  keyMesh() {
    const g = new THREE.Group();
    this.mesh(g, new THREE.TorusGeometry(0.035, 0.008, 6, 10), this.mat(0xc4a35a, { rough: 0.35, metal: 0.6 }), 0, 0.04, 0);
    this.mesh(g, new THREE.BoxGeometry(0.018, 0.09, 0.012), this.mat(0xc4a35a, { rough: 0.35, metal: 0.6 }), 0, -0.04, 0);
    this.group.add(g);
    return g;
  }

  person(opts, x, z, yaw) {
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
      const shoe = this.mesh(hip, new THREE.BoxGeometry(0.07 * s, 0.035 * s, 0.11 * s), this.joint, 0, -0.24 * s, 0.02 * s);
      const shin = new THREE.Group();
      shin.position.set(0, -0.2 * s, 0);
      shin.visible = false;
      this.mesh(shin, new THREE.CapsuleGeometry(0.04 * s, 0.16 * s, 3, 5), opts.skirt ? cloth : pants, 0, -0.12 * s, 0);
      this.mesh(shin, new THREE.BoxGeometry(0.08 * s, 0.035 * s, 0.12 * s), this.joint, 0, -0.26 * s, 0.02 * s);
      hip.add(shin);
      hip.userData.shin = shin;
      hip.userData.shoe = shoe;
      body.add(hip);
      legs.push(hip);
    });
    if (opts.skirt) this.mesh(body, new THREE.ConeGeometry(0.16 * s, 0.28 * s, 8), cloth, 0, 0.42 * s, 0);
    this.mesh(body, new THREE.BoxGeometry(0.28 * s, 0.3 * s, 0.14 * s), cloth, 0, 0.62 * s, 0);
    if (opts.tie) this.mesh(body, new THREE.BoxGeometry(0.03 * s, 0.14 * s, 0.012 * s), this.ink, 0, 0.6 * s, 0.08 * s);
    const arm = new THREE.Group();
    arm.position.set(0.16 * s, 0.72 * s, 0.02 * s);
    this.mesh(arm, new THREE.CapsuleGeometry(0.035 * s, 0.16 * s, 3, 5), cloth, 0.02 * s, -0.12 * s, 0.04 * s);
    const hand = this.mesh(arm, new THREE.SphereGeometry(0.04 * s, 8, 6), skin, 0.02 * s, -0.24 * s, 0.06 * s);
    body.add(arm);
    this.mesh(g, new THREE.SphereGeometry(0.09 * s, 10, 8), skin, 0, 0.86 * s, 0);
    const crown = this.mesh(g, new THREE.SphereGeometry(0.095 * s, 8, 6), hair, 0, 0.92 * s, -0.01 * s);
    crown.scale.y = 0.6;
    if (opts.beard) this.mesh(g, new THREE.SphereGeometry(0.05 * s, 6, 5), hair, 0, 0.8 * s, 0.05 * s);
    g.userData.legs = legs;
    g.userData.body = body;
    g.userData.arm = arm;
    g.userData.hand = hand;
    g.userData.sit = 0;
    g.position.set(x, 0, z);
    g.rotation.y = yaw;
    this.group.add(g);
    return g;
  }

  seat(fig, n) {
    fig.userData.sit = n;
    fig.position.y = n ? 0.16 : 0;
    fig.userData.legs.forEach((hip) => {
      hip.rotation.x = n ? -Math.PI / 2 : 0;
      hip.userData.shin.rotation.x = n ? Math.PI / 2 : 0;
      hip.userData.shin.visible = Boolean(n);
      hip.userData.shoe.visible = !n;
    });
  }

  plaque() {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 280;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f4f5f3";
    ctx.fillRect(0, 0, 1024, 280);
    ctx.fillStyle = "#1a206d";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "700 68px Georgia, serif";
    ctx.fillText("THE OATH", 512, 95);
    ctx.fillStyle = "#5c584f";
    ctx.font = "600 32px Georgia, serif";
    ctx.fillText("The chair does not split.", 512, 178);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    this.geos.push(tex);
    const mat = new THREE.MeshBasicMaterial({ map: tex });
    this.mats.push(mat);
    return mat;
  }

  buildRoom() {
    const floor = this.mesh(this.group, new THREE.PlaneGeometry(5.0, 3.8), this.tile(), 0, -0.02, 0.02);
    floor.rotation.x = -Math.PI / 2;
    this.mesh(this.group, new THREE.BoxGeometry(4.8, 2.05, 0.1), this.shell, 0, 1.1, -1.18);
    this.mesh(this.group, new THREE.PlaneGeometry(2.8, 0.72), this.plaque(), 0, 1.48, -1.11);
    this.flag(-1.85);
    this.flag(1.85);
    this.mesh(this.group, new THREE.BoxGeometry(2.0, 0.07, 0.46), this.wood, 0, 0.46, -0.22);
    this.chairSeat(0, -0.86, 0, -0.22);
    this.chairSeat(-1.28, -0.05, -0.22, 0);
    this.chairSeat(1.28, -0.05, 0.22, 0);
    this.minute = this.mesh(this.group, new THREE.BoxGeometry(0.36, 0.04, 0.26), this.mat(0xf7f4ee, { rough: 0.7 }), 0.28, 0.54, -0.18);
    this.extra = this.mesh(this.group, new THREE.BoxGeometry(0.3, 0.01, 0.2), this.mat(0xf3e2c4, { rough: 0.7 }), 0.42, 0.56, -0.02);
    this.extra.scale.setScalar(0.01);
    this.drawer = this.mesh(this.group, new THREE.BoxGeometry(0.42, 0.12, 0.34), this.wood, 0.78, 0.28, 0.12);
    this.buildDoor();
  }

  chairSeat(x, z, bx, bz) {
    this.mesh(this.group, new THREE.BoxGeometry(0.42, 0.05, 0.42), this.shell, x, 0.4, z);
    this.mesh(this.group, new THREE.BoxGeometry(Math.abs(bx) > 0.05 ? 0.05 : 0.42, 0.34, Math.abs(bz) > 0.05 ? 0.05 : 0.42), this.wood, x + bx, 0.58, z + bz);
  }

  buildDoor() {
    this.mesh(this.group, new THREE.BoxGeometry(0.08, 1.9, 0.07), this.joint, -1.95, 0.98, 0.28);
    this.mesh(this.group, new THREE.BoxGeometry(0.08, 1.9, 0.07), this.joint, -1.95, 0.98, 1.05);
    this.mesh(this.group, new THREE.BoxGeometry(0.08, 0.07, 0.84), this.joint, -1.95, 1.9, 0.66);
    this.hinge = new THREE.Group();
    this.hinge.position.set(-1.95, 0, 0.32);
    this.mesh(this.hinge, new THREE.BoxGeometry(0.04, 1.55, 0.68), this.wood, 0, 0.82, 0.32);
    this.group.add(this.hinge);
  }

  tile() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        ctx.fillStyle = (x + y) % 2 ? "#cfc6ba" : "#e7e1d8";
        ctx.fillRect(x * 32, y * 32, 32, 32);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(5, 4);
    tex.colorSpace = THREE.SRGBColorSpace;
    this.geos.push(tex);
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 });
    this.mats.push(mat);
    return mat;
  }

  flag(x) {
    const g = new THREE.Group();
    this.mesh(g, new THREE.CylinderGeometry(0.03, 0.03, 1.6, 6), this.joint, 0, 0.8, 0);
    [[0, 0xea2839], [1, 0x1a206d], [2, 0xffd500], [3, 0x00a551]].forEach(([i, color]) => {
      this.mesh(g, new THREE.BoxGeometry(0.42, 0.07, 0.02), this.mat(color, { rough: 0.45 }), 0.22, 1.42 - i * 0.07, 0);
    });
    g.position.set(x, 0, -1.08);
    this.group.add(g);
  }

  sync(competition, outcome, correct, marks, active) {
    this.competition = competition;
    this.outcome = outcome;
    this.correct = correct || 0;
    this.marks = marks || {};
    this.active = active || "cousin";
  }

  mode(id) {
    const mark = this.marks[id] || "open";
    if (mark === "held" || mark === "miss") return mark;
    return this.active === id ? "live" : "home";
  }

  face(root, yaw, ease) {
    let dy = yaw - root.rotation.y;
    while (dy > Math.PI) dy -= Math.PI * 2;
    while (dy < -Math.PI) dy += Math.PI * 2;
    root.rotation.y += dy * ease;
  }

  step(fig, x, z, yaw, ease, t, reduced) {
    const dx = x - fig.position.x;
    const dz = z - fig.position.z;
    const moving = Math.hypot(dx, dz) > 0.045;
    fig.position.x += dx * ease;
    fig.position.z += dz * ease;
    this.face(fig, moving ? Math.atan2(dx, dz) : yaw, ease);
    fig.userData.pace = moving && !reduced ? Math.sin(t * 8) * 0.5 : 0;
  }

  sitBlend(fig, sit, ease) {
    fig.userData.sit += (sit - fig.userData.sit) * ease;
    const s = fig.userData.sit;
    const pace = fig.userData.pace || 0;
    fig.position.y += ((s > 0.5 ? 0.16 : 0) - fig.position.y) * ease;
    fig.userData.legs.forEach((hip, i) => {
      const sign = i ? -1 : 1;
      hip.rotation.x = -Math.PI / 2 * s + pace * (1 - s) * sign;
      hip.userData.shin.rotation.x = Math.PI / 2 * s;
      hip.userData.shin.visible = s > 0.35;
      hip.userData.shoe.visible = s < 0.65;
    });
  }

  put(mesh, x, y, z, ease) {
    mesh.position.x += (x - mesh.position.x) * ease;
    mesh.position.y += (y - mesh.position.y) * ease;
    mesh.position.z += (z - mesh.position.z) * ease;
  }

  hand(fig) {
    const p = new THREE.Vector3();
    fig.userData.hand.getWorldPosition(p);
    this.group.worldToLocal(p);
    return p;
  }

  tick(dt, t, reduced) {
    const on = this.competition === "oath";
    this.group.visible = on;
    if (!on) return;
    const ease = reduced ? 1 : 1 - Math.exp(-3.2 * dt);
    const cousin = this.mode("cousin");
    const minute = this.mode("minute");
    const gift = this.mode("gift");
    const silence = this.mode("silence");
    const unread = this.mode("unread");
    const key = this.mode("key");
    const act = this.active;
    const roomEmpty = act === "minute" || minute !== "home";
    const chairLeft = cousin === "held" && act !== "minute" && act !== "unread" && act !== "silence";
    this.step(this.chair, chairLeft ? 1.05 : 0, chairLeft ? 0.42 : -0.86, chairLeft ? Math.PI : 0, ease, t, reduced);
    const chairSit = chairLeft ? 0 : 1;
    this.sitBlend(this.chair, chairSit, ease);
    const lean = ((cousin === "miss" && act === "cousin") || unread === "miss" || (act === "unread" && unread === "live")) ? 0.28 : 0;
    this.chair.userData.body.rotation.x += (lean - this.chair.userData.body.rotation.x) * ease;
    this.step(this.cousin, cousin === "live" || cousin === "miss" ? -0.95 : -1.4, cousin === "live" || cousin === "miss" ? 0.38 : 0.62, cousin === "miss" ? 0.5 : 0.8, ease, t, reduced);
    this.sitBlend(this.cousin, 0, ease);
    const clerkIn = act === "unread" || unread === "live" || unread === "miss" || act === "minute" || minute === "live" || minute === "miss";
    this.step(this.clerk, clerkIn ? 0.72 : 1.2, clerkIn ? 0.28 : 0.52, clerkIn ? -2.4 : -2.0, ease, t, reduced);
    this.sitBlend(this.clerk, 0, ease);
    const memberOut = roomEmpty && act !== "silence" && silence !== "held";
    const memberStand = silence === "held";
    this.step(this.member, memberOut ? -1.55 : -1.28, memberOut ? 0.78 : silence === "held" ? 0.48 : -0.05, memberOut ? 0.3 : memberStand ? 0.2 : 0.45, ease, t, reduced);
    this.sitBlend(this.member, memberOut || memberStand ? 0 : 1, ease);
    this.member.userData.body.rotation.x += (((silence === "miss" || silence === "live") ? 0.35 : 0) - this.member.userData.body.rotation.x) * ease;
    const otherOut = roomEmpty && act !== "silence";
    this.step(this.memberB, otherOut ? 1.45 : 1.28, otherOut ? 0.72 : -0.05, otherOut ? -0.4 : -0.45, ease, t, reduced);
    this.sitBlend(this.memberB, otherOut ? 0 : 1, ease);
    if (act === "silence" && silence === "held") this.face(this.memberB, Math.atan2(-1.28 - this.memberB.position.x, 0.48 - this.memberB.position.z), ease);
    this.step(this.bearer, gift === "live" ? -0.55 : gift === "miss" ? -0.35 : -1.15, gift === "live" ? 0.48 : gift === "miss" ? 0.62 : gift === "held" ? 0.95 : 0.92, gift === "held" ? -0.3 : 0.7, ease, t, reduced);
    this.sitBlend(this.bearer, 0, ease);
    this.step(this.friend, key === "live" ? 1.05 : key === "miss" ? 1.35 : 1.42, key === "live" ? 0.42 : key === "miss" ? 0.85 : 0.72, key === "held" ? 0.5 : -2.0, ease, t, reduced);
    this.sitBlend(this.friend, 0, ease);

    const ch = this.hand(this.cousin);
    const kh = this.hand(this.clerk);
    const bh = this.hand(this.bearer);
    const fh = this.hand(this.friend);
    this.put(this.folder, cousin === "miss" ? 0.05 : ch.x, cousin === "miss" ? 0.56 : ch.y, cousin === "miss" ? -0.18 : ch.z, ease);
    const penDown = minute === "miss";
    this.put(this.pen, penDown ? 0.32 : kh.x, penDown ? 0.58 : kh.y, penDown ? -0.14 : kh.z, ease);
    this.line.scale.setScalar(minute === "miss" ? 1 : 0.01);
    this.put(this.line, 0.3, 0.56, -0.16, ease);
    this.extra.scale.setScalar(this.outcome === "page" || minute === "miss" ? 1 : 0.01);
    const hamperBack = gift === "held" || gift === "home";
    this.put(this.hamper, gift === "miss" ? 0.02 : hamperBack ? bh.x : bh.x, gift === "miss" ? 0.64 : bh.y, gift === "miss" ? -0.12 : bh.z, ease);
    const pageBack = unread === "held" || unread === "home";
    this.put(this.page, pageBack ? kh.x : -0.02, pageBack ? kh.y : 0.56, pageBack ? kh.z : -0.28, ease);
    this.sign.scale.setScalar(unread === "miss" ? 1 : 0.01);
    this.put(this.sign, 0.02, 0.58, -0.26, ease);
    const keyHome = key === "held";
    this.put(this.key, keyHome ? 0.78 : key === "miss" ? fh.x : key === "live" ? 0.7 : 0.72, keyHome ? 0.32 : key === "miss" ? fh.y : 0.58, keyHome ? 0.18 : key === "miss" ? fh.z : -0.05, ease);
    this.drawer.position.z += ((keyHome ? -0.02 : 0.16) - this.drawer.position.z) * ease;
    const sayIt = act === "silence" && silence === "held";
    const refuse = (act === "cousin" && cousin === "held") || (act === "unread" && unread === "held") || (act === "gift" && gift === "held");
    this.chair.userData.arm.rotation.x += (((sayIt || refuse) ? -1.15 : unread === "miss" ? -0.9 : -0.2) - this.chair.userData.arm.rotation.x) * ease;
    this.clerk.userData.arm.rotation.x += (((minute === "miss" || minute === "live" || unread === "live") ? -1.15 : -0.3) - this.clerk.userData.arm.rotation.x) * ease;
    this.cousin.userData.arm.rotation.x += (((cousin === "home" || cousin === "held") ? -0.35 : -1.0) - this.cousin.userData.arm.rotation.x) * ease;
    this.bearer.userData.arm.rotation.x += ((-0.85 - this.bearer.userData.arm.rotation.x) * ease);
    this.friend.userData.arm.rotation.x += (((key === "live" || key === "miss") ? -1.05 : -0.25) - this.friend.userData.arm.rotation.x) * ease;
    this.member.userData.arm.rotation.x += (((silence === "live" || silence === "miss") ? -0.8 : -0.2) - this.member.userData.arm.rotation.x) * ease;
    const doorOpen = gift === "held" || (roomEmpty && act === "minute");
    this.hinge.rotation.y += ((doorOpen ? -1.15 : -0.05) - this.hinge.rotation.y) * ease;
  }

  dispose() {
    this.group.removeFromParent();
    for (const g of this.geos) g.dispose();
    for (const m of this.mats) m.dispose();
  }
}

export { OathScene };
