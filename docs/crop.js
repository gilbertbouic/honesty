import * as THREE from "three";

const SHELL = 0xd5d6d2;
const JOINT = 0x1a1c1f;
const VISOR = 0x0c1016;
const WILT = new THREE.Color(0x8a6a42);
const RIVER = [
  [-5.2, -2.15],
  [-2.6, -1.45],
  [-0.4, -0.15],
  [1.6, 0.55],
  [3.4, 1.45],
  [5.15, 2.25],
];

class CropScene {
  constructor(scene) {
    this.group = new THREE.Group();
    this.field = this.group;
    this.geos = [];
    this.mats = [];
    this.plots = [];
    this.competition = "tender";
    this.outcome = "open";
    this.correct = 0;
    this.look = new THREE.Vector3();
    this.world = new THREE.Vector3();
    this.nozzle = new THREE.Object3D();
    this.puffs = [];

    const hemi = new THREE.HemisphereLight(0xd5e4f2, 0x5a4328, 0.35);
    const sun = new THREE.DirectionalLight(0xfff3df, 1.15);
    sun.position.set(7.5, 11, 5.5);
    const fill = new THREE.DirectionalLight(0xb7c6de, 0.7);
    fill.position.set(-6, 4, -3);
    this.group.add(hemi, sun, fill);

    this.riverMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { uTime: { value: 0 }, uStain: { value: 0.15 } },
      vertexShader: `
        varying float vFlow;
        void main() {
          vFlow = position.x;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uStain;
        varying float vFlow;
        void main() {
          float rip = sin(vFlow * 8.0 - uTime * 1.8) * 0.5 + 0.5;
          vec3 water = mix(vec3(0.55, 0.78, 0.84), vec3(0.72, 0.74, 0.28), uStain);
          water += rip * 0.08;
          water += pow(rip, 8.0) * 0.18;
          gl_FragColor = vec4(water, 0.92);
        }
      `,
    });
    this.mats.push(this.riverMat);

    this.buildGround();
    this.buildRiver();
    this.tree(-5.6, 0.55, 0.85);
    this.tree(-1.55, -2.35, 1.25);
    this.tree(5.35, -1.55, 0.9);
    this.shed();
    this.plots = [
      this.lettuce(-4.2, 1.15),
      this.tomato(-2.45, -0.7),
      this.chilli(-0.7, 1.35),
      this.herb(1.05, -0.85),
      this.cabbage(2.7, 1.05),
      this.cucumber(4.35, -0.45),
    ];
    this.sprayer = this.buildUnit("spray");
    this.sprayer.root.position.set(-3.4, 0, 1.7);
    this.bearer = this.buildUnit("bear");
    this.bearer.root.position.set(3.55, 0, 2.15);
    this.group.add(this.sprayer.root, this.bearer.root);
    this.sprayer.armR.add(this.nozzle);
    this.nozzle.position.set(0, -0.62, 0.08);
    this.mist = new THREE.Group();
    const puffMat = this.std(0xdfe7c8, { rough: 1, opacity: 0.45 });
    for (let i = 0; i < 8; i++) {
      const puff = new THREE.Mesh(this.geo(new THREE.SphereGeometry(0.06, 8, 6)), puffMat);
      this.mist.add(puff);
      this.puffs.push(puff);
    }
    this.group.add(this.mist);
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
    this.reduced = !!reduced;
    const grown = this.outcome === "grown";
    const bare = this.outcome === "bare";
    const thin = this.outcome === "thin";
    const lit = grown ? 6 : bare ? 0 : this.correct;
    const ease = this.reduced ? 1 : 1 - Math.exp(-2.6 * dt);

    this.plots.forEach((plot, i) => {
      const open = i < lit;
      const target = open ? 1 : 0.26;
      const s = plot.group.scale.x + (target - plot.group.scale.x) * ease;
      plot.group.scale.set(s, s, s);
      const wilt = !open && bare ? 1 : 0;
      for (const mat of plot.mats) {
        const base = mat.userData.base ;
        mat.color.copy(base).lerp(WILT, wilt);
      }
      const pipOn = open ? 1 : 0;
      const pipNow = plot.pip.emissiveIntensity + (pipOn - plot.pip.emissiveIntensity) * ease;
      plot.pip.emissiveIntensity = pipNow;
      plot.pip.color.set(open ? 0x3f9a55 : 0x2a2c28);
    });

    const idx = Math.min(5, Math.max(0, lit));
    const plot = this.plots[idx];
    const goalX = grown ? 0.2 : plot.x + 0.85;
    const goalZ = grown ? 1.85 : plot.z + 0.55;
    this.sprayer.root.position.x += (goalX - this.sprayer.root.position.x) * ease;
    this.sprayer.root.position.z += (goalZ - this.sprayer.root.position.z) * ease;
    const bob = this.reduced ? 0 : Math.sin(t * 2.2) * 0.02;
    this.sprayer.root.position.y = bob;
    this.look.set(plot.x, this.sprayer.root.position.y, plot.z);
    if (!grown) this.sprayer.root.lookAt(this.look);
    else this.sprayer.root.rotation.y += (0.4 - this.sprayer.root.rotation.y) * ease;

    const spraying = !grown && !bare;
    const arm = spraying ? -1.15 : -0.35;
    const swing = this.reduced || !spraying ? 0 : Math.sin(t * 3.2) * 0.08;
    this.sprayer.armR.rotation.x += (arm + swing - this.sprayer.armR.rotation.x) * ease;
    this.sprayer.armL.rotation.x += (-0.25 - this.sprayer.armL.rotation.x) * ease;
    this.bearer.armR.rotation.x += (-0.55 - this.bearer.armR.rotation.x) * ease;
    this.bearer.armL.rotation.x += (-0.2 - this.bearer.armL.rotation.x) * ease;

    const drift = grown ? 0.04 : bare ? 1 : thin ? 0.7 : 0.35;
    const pull = this.nearestRiver(plot.x, plot.z);
    this.nozzle.getWorldPosition(this.world);
    this.field.worldToLocal(this.world);
    const mx = this.world.x + (pull[0] - this.world.x) * drift * 0.65;
    const mz = this.world.z + (pull[1] - this.world.z) * drift * 0.65;
    this.mist.position.x += ((grown ? plot.x : mx) - this.mist.position.x) * ease;
    this.mist.position.z += ((grown ? plot.z : mz) - this.mist.position.z) * ease;
    this.mist.position.y = grown ? 0.45 : 0.85;
    const ms = grown ? 0.25 : bare ? 1.4 : thin ? 1 : 0.85;
    const mnow = this.mist.scale.x + (ms - this.mist.scale.x) * ease;
    this.mist.scale.setScalar(mnow);
    this.puffs.forEach((puff, i) => {
      const ang = t * 1.4 + i;
      puff.position.set(Math.cos(ang) * (0.12 + (i % 3) * 0.08), (i % 4) * 0.06, Math.sin(ang * 0.8) * 0.16);
    });

    const stain = grown ? 0 : bare ? 1 : thin ? 0.55 : (1 - this.correct / 6) * 0.22;
    const cur = this.riverMat.uniforms.uStain.value ;
    this.riverMat.uniforms.uStain.value = cur + (stain - cur) * ease;
    this.riverMat.uniforms.uTime.value = this.reduced ? 0 : t;

    const pour = (bare || thin) && this.outcome !== "open" ? 1.25 : 0;
    if (this.bearer.can) this.bearer.can.rotation.z += (pour - this.bearer.can.rotation.z) * ease;
    if (this.bearer.cap) this.bearer.cap.visible = pour < 0.4;

    const led = grown ? 0x3dff86 : bare ? 0xff2a2a : thin ? 0xe0a030 : 0x7ec8ff;
    const pulse = this.reduced ? 0.7 : 0.45 + Math.sin(t * 3) * 0.25;
    for (const unit of [this.sprayer, this.bearer]) {
      unit.led.color.set(led);
      unit.led.emissive.set(led);
      unit.led.emissiveIntensity = grown ? 1.1 : pulse;
      unit.visor.emissive.set(grown ? 0x123028 : bare ? 0x3a1014 : 0x102030);
      unit.visor.emissiveIntensity = grown ? 0.7 : 0.45;
    }

    const face = bare ? -0.4 : 0.35;
    this.bearer.root.rotation.y += (face - this.bearer.root.rotation.y) * ease;
    if (!this.reduced) this.bearer.root.position.y = Math.sin(t * 1.6 + 1) * 0.015;
  }

  dispose() {
    this.group.removeFromParent();
    for (const g of this.geos) g.dispose();
    for (const m of this.mats) m.dispose();
  }

  nearestRiver(x, z) {
    let best = RIVER[0];
    let dist = Infinity;
    for (const p of RIVER) {
      const d = (p[0] - x) ** 2 + (p[1] - z) ** 2;
      if (d < dist) {
        dist = d;
        best = p;
      }
    }
    return best;
  }

  geo(geometry) {
    this.geos.push(geometry);
    return geometry;
  }

  std(
    color,
    opts = {},
  ) {
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: opts.rough ?? 0.46,
      metalness: opts.metal ?? 0.06,
      emissive: opts.emissive ?? 0x000000,
      emissiveIntensity: opts.ei ?? 1,
      transparent: (opts.opacity ?? 1) < 1,
      opacity: opts.opacity ?? 1,
    });
    mat.userData.base = new THREE.Color(color);
    this.mats.push(mat);
    return mat;
  }

  mesh(
    parent,
    geometry,
    material,
    x,
    y,
    z,
    cast = false,
  ) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = cast;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  buildGround() {
    const grass = this.std(0x3c5a34, { rough: 1 });
    const pad = this.mesh(this.field, this.geo(new THREE.CircleGeometry(16, 40)), grass, 0, -0.04, 0);
    pad.rotation.x = -Math.PI / 2;
    pad.receiveShadow = true;
    const soil = this.std(0x4a3424, { rough: 0.95 });
    const tilled = this.mesh(this.field, this.geo(new THREE.BoxGeometry(13.2, 0.08, 6.8)), soil, 0, 0.02, 0.1);
    tilled.receiveShadow = true;
    const furrowMat = this.std(0x3a2818, { rough: 1 });
    for (let i = -3; i <= 3; i++) {
      this.mesh(this.field, this.geo(new THREE.BoxGeometry(12.2, 0.02, 0.045)), furrowMat, 0, 0.07, i * 0.72);
    }
  }

  buildRiver() {
    const bankMat = this.std(0x6d5a40, { rough: 0.9 });
    for (let i = 0; i < RIVER.length - 1; i++) {
      const [x0, z0] = RIVER[i];
      const [x1, z1] = RIVER[i + 1];
      const dx = x1 - x0;
      const dz = z1 - z0;
      const len = Math.hypot(dx, dz);
      const yRot = -Math.atan2(dz, dx);
      const bank = this.mesh(
        this.field,
        this.geo(new THREE.BoxGeometry(len + 0.25, 0.06, 0.86)),
        bankMat,
        (x0 + x1) / 2,
        0.06,
        (z0 + z1) / 2,
      );
      const water = this.mesh(
        this.field,
        this.geo(new THREE.BoxGeometry(len, 0.06, 0.46)),
        this.riverMat,
        (x0 + x1) / 2,
        0.1,
        (z0 + z1) / 2,
      );
      bank.rotation.y = yRot;
      water.rotation.y = yRot;
    }
  }

  tree(x, z, scale) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.scale.setScalar(scale);
    const trunk = this.std(0x5a3a24, { rough: 0.85 });
    this.mesh(g, this.geo(new THREE.CylinderGeometry(0.12, 0.16, 1.15, 8)), trunk, 0, 0.58, 0, true);
    const greens = [0x245c32, 0x2f7a40, 0x3d8f4c];
    greens.forEach((hex, i) => {
      const cap = this.mesh(
        g,
        this.geo(new THREE.SphereGeometry(0.72 - i * 0.14, 10, 8)),
        this.std(hex, { rough: 0.8 }),
        0,
        1.25 + i * 0.32,
        0,
        true,
      );
      cap.scale.y = 0.72;
    });
    this.field.add(g);
  }

  shed() {
    const shell = this.std(SHELL, { rough: 0.4, metal: 0.08 });
    const dark = this.std(JOINT, { rough: 0.6, metal: 0.2 });
    const g = new THREE.Group();
    g.position.set(-6.15, 0, -2.15);
    this.mesh(g, this.geo(new THREE.BoxGeometry(1.7, 1.15, 1.25)), shell, 0, 0.7, 0, true);
    this.mesh(g, this.geo(new THREE.BoxGeometry(1.9, 0.12, 1.45)), dark, 0, 1.32, 0, true);
    this.mesh(g, this.geo(new THREE.BoxGeometry(0.46, 0.72, 0.06)), dark, 0.35, 0.48, 0.62);
    this.field.add(g);
  }

  bed(x, z) {
    const soil = this.std(0x5c4030, { rough: 1 });
    this.mesh(this.field, this.geo(new THREE.BoxGeometry(1.45, 0.14, 1.15)), soil, x, 0.1, z);
    const pip = this.std(0x2a2c28, { emissive: 0x3f9a55, ei: 0, rough: 0.4 });
    const mark = this.mesh(this.field, this.geo(new THREE.SphereGeometry(0.05, 8, 6)), pip, x - 0.55, 0.2, z - 0.4);
    mark.castShadow = false;
    return pip;
  }

  plant(x, z, build) {
    const pip = this.bed(x, z);
    const group = new THREE.Group();
    group.position.set(x, 0.18, z);
    group.scale.setScalar(0.38);
    const mats = [];
    build(group, mats);
    this.field.add(group);
    return { group, mats, pip, x, z };
  }

  put(
    parent,
    geometry,
    color,
    x,
    y,
    z,
    mats,
    opts,
  ) {
    const mat = this.std(color, opts);
    mats.push(mat);
    return this.mesh(parent, geometry, mat, x, y, z);
  }

  lettuce(x, z) {
    return this.plant(x, z, (g, mats) => {
      for (let i = 0; i < 5; i++) {
        const leaf = this.put(g, this.geo(new THREE.SphereGeometry(0.42 - i * 0.04, 10, 8)), i % 2 ? 0x3f9a55 : 0x2f7a40, 0, 0.12 + i * 0.07, 0, mats, { rough: 0.7 });
        leaf.scale.set(1, 0.38, 0.82);
        leaf.rotation.y = i * 0.7;
      }
    });
  }

  tomato(x, z) {
    return this.plant(x, z, (g, mats) => {
      this.put(g, this.geo(new THREE.CylinderGeometry(0.04, 0.05, 0.7, 6)), 0x2f6b34, 0, 0.38, 0, mats);
      for (const [px, py, pz] of [[-0.16, 0.55, 0.05], [0.16, 0.48, -0.04], [0.02, 0.72, 0.08]] ) {
        const fruit = this.put(g, this.geo(new THREE.SphereGeometry(0.16, 10, 8)), 0xd24b3a, px, py, pz, mats, { rough: 0.35 });
        const cap = this.put(g, this.geo(new THREE.SphereGeometry(0.06, 6, 5)), 0x2f7a40, px, py + 0.12, pz, mats);
        cap.scale.y = 0.4;
        fruit.scale.y = 0.9;
      }
    });
  }

  chilli(x, z) {
    return this.plant(x, z, (g, mats) => {
      for (let i = 0; i < 4; i++) {
        const pod = this.put(
          g,
          this.geo(new THREE.CapsuleGeometry(0.045, 0.38, 4, 6)),
          i === 2 ? 0x8fb56a : 0xc4312e,
          (i - 1.5) * 0.18,
          0.42,
          0,
          mats,
          { rough: 0.4 },
        );
        pod.rotation.z = (i - 1.5) * 0.4;
      }
    });
  }

  herb(x, z) {
    return this.plant(x, z, (g, mats) => {
      for (let i = 0; i < 8; i++) {
        const h = 0.42 + (i % 3) * 0.08;
        this.put(
          g,
          this.geo(new THREE.CylinderGeometry(0.015, 0.02, h, 5)),
          0x3f8f4a,
          ((i % 4) - 1.5) * 0.16,
          h / 2,
          ((i % 3) - 1) * 0.12,
          mats,
        );
        this.put(
          g,
          this.geo(new THREE.SphereGeometry(0.05, 6, 5)),
          0x6fbf73,
          ((i % 4) - 1.5) * 0.16,
          h + 0.02,
          ((i % 3) - 1) * 0.12,
          mats,
        );
      }
    });
  }

  cabbage(x, z) {
    return this.plant(x, z, (g, mats) => {
      const ball = this.put(g, this.geo(new THREE.SphereGeometry(0.38, 12, 10)), 0x8fb56a, 0, 0.32, 0, mats, { rough: 0.55 });
      ball.scale.y = 0.82;
      for (let i = 0; i < 4; i++) {
        const leaf = this.put(g, this.geo(new THREE.SphereGeometry(0.28, 8, 6)), 0x3f8f4a, Math.cos(i) * 0.22, 0.18, Math.sin(i) * 0.22, mats);
        leaf.scale.set(1.2, 0.28, 0.7);
        leaf.rotation.y = i;
      }
    });
  }

  cucumber(x, z) {
    return this.plant(x, z, (g, mats) => {
      const vine = this.put(g, this.geo(new THREE.CapsuleGeometry(0.03, 0.9, 3, 6)), 0x2f6b34, 0, 0.12, 0, mats);
      vine.rotation.z = Math.PI / 2;
      vine.rotation.y = 0.4;
      const cuke = this.put(g, this.geo(new THREE.CapsuleGeometry(0.08, 0.48, 4, 8)), 0x3d8f3a, 0.12, 0.22, 0.05, mats, { rough: 0.4 });
      cuke.rotation.z = Math.PI / 2.4;
      const cuke2 = this.put(g, this.geo(new THREE.CapsuleGeometry(0.07, 0.36, 4, 8)), 0x4f9a45, -0.18, 0.18, -0.08, mats);
      cuke2.rotation.z = Math.PI / 2;
      cuke2.rotation.y = 0.6;
    });
  }

  buildUnit(role) {
    const root = new THREE.Group();
    const shell = this.std(SHELL, { rough: 0.38, metal: 0.08 });
    const joint = this.std(JOINT, { rough: 0.5, metal: 0.45 });
    const visor = this.std(VISOR, { rough: 0.12, metal: 0.72, emissive: 0x102030, ei: 0.45 });
    const led = this.std(0x7ec8ff, { emissive: 0x7ec8ff, ei: 0.8, rough: 0.3, metal: 0.2 });

    const add = (geo, mat, x, y, z, parent = root) =>
      this.mesh(parent, geo, mat, x, y, z, true);

    const leg = (side) => {
      add(this.geo(new THREE.BoxGeometry(0.18, 0.08, 0.3)), joint, side * 0.12, 0.05, 0.03);
      add(this.geo(new THREE.CapsuleGeometry(0.07, 0.28, 4, 8)), shell, side * 0.12, 0.28, 0);
      add(this.geo(new THREE.SphereGeometry(0.075, 10, 8)), joint, side * 0.12, 0.48, 0);
      add(this.geo(new THREE.CapsuleGeometry(0.08, 0.3, 4, 8)), shell, side * 0.12, 0.7, 0);
    };
    leg(-1);
    leg(1);

    add(this.geo(new THREE.BoxGeometry(0.42, 0.16, 0.22)), shell, 0, 0.92, 0);
    add(this.geo(new THREE.SphereGeometry(0.09, 10, 8)), joint, 0, 0.92, 0);
    const torso = add(this.geo(new THREE.CapsuleGeometry(0.2, 0.34, 6, 12)), shell, 0, 1.24, 0);
    torso.scale.set(1.05, 1, 0.78);
    add(this.geo(new THREE.BoxGeometry(0.22, 0.015, 0.02)), joint, 0, 1.22, 0.16);
    add(this.geo(new THREE.SphereGeometry(0.035, 8, 6)), led, 0, 1.08, 0.16);

    add(this.geo(new THREE.CylinderGeometry(0.055, 0.06, 0.08, 10)), joint, 0, 1.52, 0);
    const head = add(this.geo(new THREE.SphereGeometry(0.16, 18, 14)), shell, 0, 1.72, 0);
    head.scale.set(1.12, 1.02, 0.86);
    const face = add(this.geo(new THREE.BoxGeometry(0.22, 0.09, 0.03)), visor, 0, 1.7, 0.12);
    face.castShadow = false;
    const brow = add(this.geo(new THREE.BoxGeometry(0.2, 0.02, 0.04)), joint, 0, 1.76, 0.12);
    brow.castShadow = false;

    const arm = (side) => {
      const pivot = new THREE.Group();
      pivot.position.set(side * 0.28, 1.42, 0);
      root.add(pivot);
      add(this.geo(new THREE.SphereGeometry(0.07, 10, 8)), joint, 0, 0, 0, pivot);
      add(this.geo(new THREE.CapsuleGeometry(0.055, 0.22, 4, 8)), shell, 0, -0.18, 0, pivot);
      add(this.geo(new THREE.SphereGeometry(0.055, 8, 8)), joint, 0, -0.34, 0, pivot);
      add(this.geo(new THREE.CapsuleGeometry(0.045, 0.2, 4, 8)), shell, 0, -0.5, 0, pivot);
      const hand = add(this.geo(new THREE.BoxGeometry(0.08, 0.1, 0.05)), joint, 0, -0.66, 0.01, pivot);
      for (let f = 0; f < 3; f++) {
        add(this.geo(new THREE.BoxGeometry(0.016, 0.05, 0.016)), joint, (f - 1) * 0.022, -0.73, 0.02, pivot);
      }
      hand.castShadow = true;
      return pivot;
    };

    const armL = arm(-1);
    const armR = arm(1);
    armL.rotation.x = -0.25;
    armR.rotation.x = role === "spray" ? -1.05 : -0.55;

    let can;
    let cap;
    if (role === "spray") {
      const tank = add(this.geo(new THREE.CapsuleGeometry(0.11, 0.28, 4, 10)), shell, 0, 1.22, -0.18);
      tank.scale.set(0.85, 1, 0.7);
      add(this.geo(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 6)), joint, 0.16, 1.05, -0.05);
      const wand = add(this.geo(new THREE.CylinderGeometry(0.015, 0.015, 0.42, 6)), joint, 0, -0.78, 0.12, armR);
      wand.rotation.x = Math.PI / 2.4;
    } else {
      const canMat = this.std(0xd4a017, { rough: 0.35, metal: 0.25 });
      const group = new THREE.Group();
      group.position.set(0.02, -0.78, 0.08);
      armR.add(group);
      this.mesh(group, this.geo(new THREE.CylinderGeometry(0.09, 0.09, 0.28, 12)), canMat, 0, 0, 0, true);
      const band = this.std(0xf4f5f3, { rough: 0.5 });
      this.mesh(group, this.geo(new THREE.CylinderGeometry(0.072, 0.072, 0.05, 12)), band, 0, 0.02, 0);
      cap = this.mesh(group, this.geo(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 10)), joint, 0, 0.13, 0);
      can = group;
    }

    root.scale.setScalar(1.22);
    return { root, armR, armL, visor, led, can, cap };
  }

}

export { CropScene };
