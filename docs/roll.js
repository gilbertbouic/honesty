// Stage 9. The roll is one list. Each question is a person the room can see.
import * as THREE from "three";

const PEARL = 0xf4f5f3;
const INK = 0x1a1c1f;
const RED = 0xea2839;

class RollScene {
  constructor(scene) {
    this.group = new THREE.Group();
    this.geos = [];
    this.mats = [];
    this.queue = [];
    this.marks = {};
    this.active = "after";
    this.outcome = "open";
    this.competition = "tender";
    const hemi = new THREE.HemisphereLight(0xd5e4f2, 0x3a3428, 0.55);
    const sun = new THREE.DirectionalLight(0xfff3df, 1.05);
    sun.position.set(4, 10, 6);
    this.group.add(hemi, sun);
    this.shell = this.mat(PEARL, { rough: 0.32, metal: 0.22 });
    this.joint = this.mat(INK, { rough: 0.45, metal: 0.4 });
    this.ink = this.mat(RED, { rough: 0.4 });
    this.wood = this.mat(0x6d4c32, { rough: 0.72 });
    this.buildHall();
    this.officer = this.person({ skin: 0xd7b39a, cloth: 0x1a2744, pants: 0x1a1c22, hair: 0x2a1810, tie: true }, -0.4, -0.82, 0);
    this.escort = this.person({ skin: 0x8d5524, cloth: 0x1a2744, pants: 0x1c242c, hair: 0x1a120c, tie: true }, 0.62, -0.42, 0);
    this.neighbour = this.person({ skin: 0xc48a62, cloth: 0xc45c26, pants: 0x1c242c, hair: 0x1a120c, cap: this.mat(0xf0c030, { rough: 0.5 }), beard: true }, -1.12, 0.88, Math.PI);
    this.cousin = this.person({ skin: 0xf0c7a0, cloth: 0x245c8a, pants: 0x1c2430, hair: 0x3a2418, skirt: true }, -0.4, 0.96, Math.PI);
    this.payer = this.person({ skin: 0x5c3317, cloth: 0x3a3148, pants: 0x1a1c22, hair: 0x14120e, beard: true }, -1.32, 1.0, Math.PI);
    this.voter = this.person({ skin: 0xe8c4a8, cloth: 0x3f6f62, pants: 0x2c241c, hair: 0x6b4423 }, 0.18, 0.96, Math.PI);
    this.driver = this.person({ skin: 0x3d2314, cloth: 0x1a1c22, pants: 0x243044, hair: 0x0e0c0a, cap: this.mat(0x14161c, { rough: 0.45 }) }, -1.22, 0.52, 0.9);
    this.boothVoter = this.person({ skin: 0xa86b45, cloth: 0xc45b78, pants: 0xc45b78, hair: 0x2a1810, skirt: true }, 1.12, 0.0, Math.PI);
    this.helper = this.person({ skin: 0xc48a62, cloth: 0x4a5560, pants: 0x2c3138, hair: 0xd5d3cc, scale: 0.96 }, 0.88, 0.52, -2.4);
    this.buildQueue();
    this.pencil = this.prop(0.018, 0.18, 0.018, 0xf0c030);
    this.sheetA = this.prop(0.18, 0.01, 0.24, 0xf7f4ee);
    this.sheetB = this.prop(0.18, 0.01, 0.24, 0xb9d4ea);
    this.envelope = this.prop(0.2, 0.014, 0.12, 0xf4e7c3);
    this.phone = this.prop(0.07, 0.12, 0.016, 0x14181c);
    this.ballot = this.prop(0.13, 0.008, 0.17, 0xf7f4ee);
    this.mark = this.prop(0.16, 0.012, 0.018, RED);
    this.mark.scale.setScalar(0.01);
    this.slip = this.prop(0.2, 0.01, 0.26, 0xf3e2c4);
    this.slip.scale.setScalar(0.01);
    this.photoCard = this.prop(0.1, 0.07, 0.008, 0xfff6df);
    this.photoCard.scale.setScalar(0.01);
    this.flash = new THREE.PointLight(0xfff1c9, 0, 2.6);
    this.flash.position.set(1.15, 1.2, 0.12);
    this.group.add(this.flash);
    this.group.visible = false;
    scene.add(this.group);
  }

  mat(color, opts = {}) {
    const m = new THREE.MeshStandardMaterial({
      color,
      roughness: opts.rough ?? 0.6,
      metalness: opts.metal ?? 0.05,
      emissive: opts.emissive ?? 0x000000,
      emissiveIntensity: opts.ei ?? 1,
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
    return this.mesh(this.group, new THREE.BoxGeometry(w, h, d), this.mat(color, { rough: 0.55 }), 0, 0.2, 0);
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
      this.mesh(hip, new THREE.BoxGeometry(0.07 * s, 0.035 * s, 0.11 * s), this.joint, 0, -0.24 * s, 0.02 * s);
      body.add(hip);
      legs.push(hip);
    });
    if (opts.skirt) this.mesh(body, new THREE.ConeGeometry(0.16 * s, 0.28 * s, 8), cloth, 0, 0.42 * s, 0);
    this.mesh(body, new THREE.BoxGeometry(0.26 * s, 0.28 * s, 0.14 * s), cloth, 0, 0.62 * s, 0);
    if (opts.tie) this.mesh(body, new THREE.BoxGeometry(0.03 * s, 0.14 * s, 0.012 * s), this.ink, 0, 0.6 * s, 0.08 * s);
    const arm = new THREE.Group();
    arm.position.set(0.16 * s, 0.72 * s, 0.02 * s);
    this.mesh(arm, new THREE.CapsuleGeometry(0.035 * s, 0.16 * s, 3, 5), cloth, 0.02 * s, -0.12 * s, 0.04 * s);
    const hand = this.mesh(arm, new THREE.SphereGeometry(0.04 * s, 8, 6), skin, 0.02 * s, -0.24 * s, 0.06 * s);
    body.add(arm);
    this.mesh(g, new THREE.SphereGeometry(0.09 * s, 10, 8), skin, 0, 0.86 * s, 0);
    const crown = this.mesh(g, new THREE.SphereGeometry(0.095 * s, 8, 6), opts.cap ? cloth : hair, 0, 0.92 * s, -0.01 * s);
    crown.scale.y = 0.6;
    if (opts.beard) this.mesh(g, new THREE.SphereGeometry(0.05 * s, 6, 5), hair, 0, 0.8 * s, 0.05 * s);
    if (opts.cap) this.mesh(g, new THREE.CylinderGeometry(0.07 * s, 0.08 * s, 0.04 * s, 8), opts.cap, 0, 0.96 * s, 0);
    g.userData.legs = legs;
    g.userData.body = body;
    g.userData.arm = arm;
    g.userData.hand = hand;
    g.position.set(x, 0, z);
    g.rotation.y = yaw;
    this.group.add(g);
    return g;
  }

  sign(title, sub) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f4f5f3";
    ctx.fillRect(0, 0, 1024, 256);
    ctx.fillStyle = "#1a206d";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "700 72px Georgia, serif";
    ctx.fillText(title, 512, 96);
    ctx.fillStyle = "#5c584f";
    ctx.font = "600 36px Georgia, serif";
    ctx.fillText(sub, 512, 176);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    this.geos.push(tex);
    const mat = new THREE.MeshBasicMaterial({ map: tex });
    this.mats.push(mat);
    return mat;
  }

  buildHall() {
    const floor = this.mesh(this.group, new THREE.PlaneGeometry(5.2, 4.0), this.tile(), 0, -0.02, 0.08);
    floor.rotation.x = -Math.PI / 2;
    this.mesh(this.group, new THREE.BoxGeometry(4.9, 2.05, 0.1), this.shell, 0, 1.1, -1.12);
    this.mesh(this.group, new THREE.PlaneGeometry(3.1, 0.72), this.sign("POLLING STATION", "One roll. One vote."), 0, 1.5, -1.05);
    this.flag(-1.85);
    this.flag(1.85);
    this.mesh(this.group, new THREE.BoxGeometry(1.25, 0.07, 0.58), this.wood, -0.38, 0.7, -0.55);
    this.book = this.mesh(this.group, new THREE.BoxGeometry(0.42, 0.06, 0.28), this.mat(0x1a2744, { rough: 0.5 }), -0.32, 0.78, -0.52);
    this.mesh(this.book, new THREE.BoxGeometry(0.44, 0.018, 0.05), this.ink, 0, 0.035, 0.08);
    this.mesh(this.group, new THREE.BoxGeometry(0.36, 0.52, 0.36), this.joint, 0.32, 0.28, -0.08);
    this.box = this.mesh(this.group, new THREE.BoxGeometry(0.34, 0.24, 0.34), this.mat(0xf4f1ea, { rough: 0.45 }), 0.32, 0.66, -0.08);
    this.seal = this.mesh(this.box, new THREE.BoxGeometry(0.14, 0.03, 0.14), this.ink, 0, 0.14, 0);
    this.mesh(this.group, new THREE.BoxGeometry(0.07, 1.4, 0.07), this.shell, 0.82, 0.74, -0.32);
    this.mesh(this.group, new THREE.BoxGeometry(0.07, 1.4, 0.7), this.shell, 0.82, 0.74, 0.05);
    this.mesh(this.group, new THREE.BoxGeometry(0.07, 1.4, 0.7), this.mat(0x1a206d, { rough: 0.55 }), 1.48, 0.74, 0.05);
    this.mesh(this.group, new THREE.BoxGeometry(0.07, 0.07, 0.74), this.shell, 1.15, 1.4, 0.05);
    this.post(-1.0, 0.62);
    this.post(0.42, 0.62);
    this.mesh(this.group, new THREE.BoxGeometry(1.42, 0.02, 0.02), this.ink, -0.29, 0.68, 0.62);
    this.buildDoor();
    this.buildVan();
  }

  post(x, z) {
    this.mesh(this.group, new THREE.CylinderGeometry(0.03, 0.03, 0.78, 6), this.joint, x, 0.39, z);
  }

  buildDoor() {
    this.mesh(this.group, new THREE.BoxGeometry(0.07, 1.9, 0.7), this.shell, -1.95, 0.98, -0.15);
    this.mesh(this.group, new THREE.BoxGeometry(0.08, 1.9, 0.07), this.joint, -1.95, 0.98, 0.55);
    this.mesh(this.group, new THREE.BoxGeometry(0.08, 1.9, 0.07), this.joint, -1.95, 0.98, 1.22);
    this.mesh(this.group, new THREE.BoxGeometry(0.08, 0.07, 0.74), this.joint, -1.95, 1.9, 0.88);
    this.hinge = new THREE.Group();
    this.hinge.position.set(-1.95, 0, 0.58);
    this.mesh(this.hinge, new THREE.BoxGeometry(0.04, 1.55, 0.62), this.wood, 0, 0.82, 0.3);
    this.group.add(this.hinge);
  }

  buildVan() {
    this.van = new THREE.Group();
    const body = this.mat(0xd8dde2, { rough: 0.4, metal: 0.28 });
    const glass = this.mat(0x9ec4de, { rough: 0.15, metal: 0.25 });
    this.mesh(this.van, new THREE.BoxGeometry(1.05, 0.58, 0.55), body, 0, 0.48, 0);
    this.mesh(this.van, new THREE.BoxGeometry(0.36, 0.32, 0.5), glass, 0.3, 0.64, 0);
    this.mesh(this.van, new THREE.BoxGeometry(0.03, 0.4, 0.5), this.ink, -0.5, 0.5, 0);
    [-0.3, 0.3].forEach((x) => {
      [-0.22, 0.22].forEach((z) => {
        const wheel = this.mesh(this.van, new THREE.CylinderGeometry(0.11, 0.11, 0.06, 8), this.joint, x, 0.12, z);
        wheel.rotation.x = Math.PI / 2;
      });
    });
    this.van.position.set(-1.38, 0, 0.58);
    this.group.add(this.van);
  }

  tile() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        ctx.fillStyle = (x + y) % 2 ? "#d7cbb8" : "#eee6d8";
        ctx.fillRect(x * 32, y * 32, 32, 32);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 5);
    tex.colorSpace = THREE.SRGBColorSpace;
    this.geos.push(tex);
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 });
    this.mats.push(mat);
    return mat;
  }

  flag(x) {
    const g = new THREE.Group();
    this.mesh(g, new THREE.CylinderGeometry(0.03, 0.03, 1.7, 6), this.joint, 0, 0.85, 0);
    [[0, 0xea2839], [1, 0x1a206d], [2, 0xffd500], [3, 0x00a551]].forEach(([i, color]) => {
      this.mesh(g, new THREE.BoxGeometry(0.46, 0.08, 0.02), this.mat(color, { rough: 0.45 }), 0.24, 1.48 - i * 0.08, 0);
    });
    g.position.set(x, 0, -1.02);
    this.group.add(g);
  }

  buildQueue() {
    const people = [
      { skin: 0xf3d2b5, cloth: 0x8d3a2f, pants: 0x2c3138, hair: 0x3a2418, skirt: true },
      { skin: 0x6b3a22, cloth: 0x1a2744, pants: 0x1a1c22, hair: 0x14120e, beard: true },
      { skin: 0xd7b39a, cloth: 0x2a6f7f, pants: 0x243044, hair: 0x6b4423 },
      { skin: 0x3d2314, cloth: 0xf4f1ea, pants: 0x1c242c, hair: 0x0e0c0a },
    ];
    people.forEach((person, i) => {
      this.queue.push(this.person(person, -0.32 + (i % 2) * 0.52, 0.78 + Math.floor(i / 2) * 0.36, Math.PI));
    });
  }

  sync(competition, outcome, correct, marks, active) {
    this.competition = competition;
    this.outcome = outcome;
    this.correct = correct || 0;
    this.marks = marks || {};
    this.active = active || "after";
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
    const moving = Math.hypot(dx, dz) > 0.05;
    fig.position.x += dx * ease;
    fig.position.z += dz * ease;
    this.face(fig, moving ? Math.atan2(dx, dz) : yaw, ease);
    const pace = moving && !reduced ? Math.sin(t * 9) * 0.55 : 0;
    fig.userData.legs[0].rotation.x = pace;
    fig.userData.legs[1].rotation.x = -pace;
    if (!moving && !reduced) fig.userData.body.rotation.z = Math.sin(t * 1.4 + x) * 0.03;
    else fig.userData.body.rotation.z *= 0.8;
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

  arm(fig, x, ease) {
    fig.userData.arm.rotation.x += (x - fig.userData.arm.rotation.x) * ease;
  }

  tick(dt, t, reduced) {
    const on = this.competition === "roll";
    this.group.visible = on;
    if (!on) return;
    const ease = reduced ? 1 : 1 - Math.exp(-3.3 * dt);
    const after = this.mode("after");
    const twice = this.mode("twice");
    const cash = this.mode("envelope");
    const ride = this.mode("ride");
    const photo = this.mode("photo");
    const lift = this.mode("lift");
    const act = this.active;

    this.step(this.neighbour, after === "live" || after === "miss" ? -0.12 : -1.12, after === "live" ? 0.08 : after === "miss" ? 0.18 : 0.88, after === "held" ? 0.2 : Math.PI, ease, t, reduced);
    this.step(this.cousin, twice === "miss" ? 0.78 : twice === "live" ? -0.48 : -0.38, twice === "miss" ? 0.38 : twice === "live" ? 0.12 : 0.96, twice === "miss" ? 0.35 : Math.PI, ease, t, reduced);
    this.step(this.payer, cash === "live" ? 0.02 : cash === "held" ? -1.62 : cash === "miss" ? -0.85 : -1.32, cash === "live" ? 0.22 : cash === "held" ? 0.92 : cash === "miss" ? 0.48 : 1.0, cash === "held" ? -0.5 : Math.PI, ease, t, reduced);
    this.step(this.voter, ride === "live" || ride === "miss" ? -1.05 : 0.22, ride === "live" || ride === "miss" ? 0.58 : 0.96, ride === "held" ? Math.PI : 0.6, ease, t, reduced);
    this.step(this.driver, ride === "held" ? -1.62 : -1.22, ride === "held" ? 0.72 : 0.52, ride === "held" ? -1.1 : 0.7, ease, t, reduced);
    this.step(this.boothVoter, 1.12, 0.0, Math.PI, ease, t, reduced);
    this.step(this.helper, lift === "miss" ? -1.02 : lift === "live" ? 0.42 : 0.88, lift === "miss" ? 0.48 : lift === "live" ? 0.08 : 0.55, lift === "miss" ? -1.0 : -2.1, ease, t, reduced);
    const officerAtBooth = act === "photo" || (photo === "held" && act !== "lift" && act !== "after" && act !== "envelope" && act !== "twice" && act !== "ride");
    const officerAtBox = act === "lift" || (lift === "held" && act !== "photo");
    this.step(this.officer, officerAtBooth ? 0.78 : officerAtBox ? 0.02 : -0.4, officerAtBooth ? 0.38 : officerAtBox ? 0.12 : -0.82, officerAtBooth ? 0.45 : officerAtBox ? 0.35 : 0, ease, t, reduced);
    this.step(this.escort, lift === "miss" ? 0.55 : lift === "live" || lift === "held" ? 0.58 : 0.62, lift === "miss" ? 0.08 : lift === "held" || lift === "live" ? 0.12 : -0.42, lift === "held" ? -0.7 : 0.15, ease, t, reduced);

    const block = (act === "after" && after === "held") || (act === "envelope" && cash === "held") || (act === "lift" && lift === "held") || (act === "photo" && photo === "held");
    this.arm(this.officer, block ? -1.25 : act === "photo" && photo !== "held" ? -0.7 : -0.25, ease);
    this.arm(this.neighbour, after === "held" || after === "home" ? -0.25 : -1.15, ease);
    this.arm(this.cousin, twice === "held" ? -0.35 : -0.95, ease);
    this.arm(this.payer, cash === "held" ? -0.9 : cash === "home" ? -0.35 : -1.15, ease);
    this.arm(this.voter, ride === "miss" || ride === "live" ? -1.25 : -0.3, ease);
    this.arm(this.driver, ride === "miss" ? -1.05 : -0.25, ease);
    this.arm(this.boothVoter, photo === "held" || photo === "home" ? -0.25 : -1.45, ease);
    this.arm(this.helper, lift === "held" || lift === "home" ? -0.25 : -1.05, ease);
    this.arm(this.escort, lift === "held" ? -0.85 : -0.2, ease);
    this.driver.userData.body.rotation.x += (((ride === "live" || ride === "miss") ? 0.35 : 0) - this.driver.userData.body.rotation.x) * ease;

    const nh = this.hand(this.neighbour);
    const ch = this.hand(this.cousin);
    const ph = this.hand(this.payer);
    const oh = this.hand(this.officer);
    const bh = this.hand(this.boothVoter);
    const hh = this.hand(this.helper);
    const vh = this.hand(this.voter);
    this.put(this.pencil, after === "miss" ? -0.3 : nh.x, after === "miss" ? 0.86 : nh.y, after === "miss" ? -0.46 : nh.z, ease);
    this.put(this.sheetA, twice === "held" ? oh.x : ch.x, twice === "held" ? oh.y : ch.y, twice === "held" ? oh.z : ch.z, ease);
    const drop = twice === "held";
    this.sheetB.scale.setScalar(drop ? 0.15 : 1);
    this.put(this.sheetB, drop ? -0.55 : ch.x + 0.08, drop ? 0.06 : ch.y + 0.02, drop ? 0.35 : ch.z + 0.04, ease);
    this.put(this.envelope, cash === "miss" ? oh.x : ph.x, cash === "miss" ? oh.y : ph.y, cash === "miss" ? oh.z : ph.z, ease);
    this.put(this.phone, bh.x, photo === "held" || photo === "home" ? bh.y - 0.16 : bh.y + 0.16, bh.z + 0.02, ease);
    const showMark = ride === "miss";
    this.put(this.ballot, showMark ? -1.15 : vh.x, showMark ? 0.95 : ride === "held" || ride === "home" ? vh.y - 0.2 : vh.y + 0.08, showMark ? 0.62 : vh.z, ease);
    const boxFollow = this.outcome === "van" || lift === "miss";
    this.put(this.box, boxFollow ? (lift === "miss" && this.outcome !== "van" ? hh.x : -1.15) : 0.32, boxFollow ? (lift === "miss" && this.outcome !== "van" ? 0.62 : 0.58) : 0.66, boxFollow ? (lift === "miss" && this.outcome !== "van" ? hh.z : 0.55) : -0.08, ease);
    this.mark.scale.setScalar(after === "miss" ? 1 : 0.01);
    this.put(this.mark, -0.3, 0.84, -0.5, ease);
    this.slip.scale.setScalar(this.outcome === "sheet" ? 1 : 0.01);
    this.put(this.slip, 0.08, 0.78, -0.42, ease);
    this.photoCard.scale.setScalar(photo === "miss" ? 1 : 0.01);
    this.put(this.photoCard, 1.12, 1.05, 0.32, ease);
    this.flash.intensity = photo === "miss" && !reduced ? 1.6 + Math.sin(t * 8) * 1.3 : photo === "live" ? 0.35 : 0;
    const vanX = ride === "held" ? -1.72 : this.outcome === "van" ? -1.15 : -1.38;
    const vanZ = ride === "held" ? 0.82 : this.outcome === "van" ? 0.48 : 0.58;
    this.van.position.x += (vanX - this.van.position.x) * ease;
    this.van.position.z += (vanZ - this.van.position.z) * ease;
    const doorOpen = cash === "held" || this.outcome === "list";
    this.hinge.rotation.y += ((doorOpen ? -1.15 : -0.08) - this.hinge.rotation.y) * ease;

    const watch = act === "photo" ? this.boothVoter.position : act === "ride" ? this.van.position : act === "lift" ? this.box.position : act === "envelope" ? this.payer.position : act === "twice" ? this.cousin.position : this.book.position;
    this.queue.forEach((person, i) => {
      const called = this.outcome === "list" && Math.floor(t * 0.45) % 4 === i;
      const gx = called ? -0.48 : -0.35 + (i % 2) * 0.52;
      const gz = called ? 0.28 : 0.8 + Math.floor(i / 2) * 0.36;
      const yaw = called ? Math.PI : Math.atan2(watch.x - person.position.x, watch.z - person.position.z);
      this.step(person, gx, gz, yaw, ease, t, reduced);
    });
  }

  dispose() {
    this.group.removeFromParent();
    for (const g of this.geos) g.dispose();
    for (const m of this.mats) m.dispose();
  }
}

export { RollScene };
