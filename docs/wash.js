import * as THREE from "three";

const SHELL = 0xd5d6d2;
const JOINT = 0x1a1c1f;

class WashScene {
  constructor(scene) {
    this.group = new THREE.Group();
    this.geos = [];
    this.mats = [];
    this.floors = [];
    this.competition = "tender";
    this.outcome = "open";
    this.correct = 0;

    const hemi = new THREE.HemisphereLight(0xd5e4f2, 0x3a3428, 0.45);
    const sun = new THREE.DirectionalLight(0xfff3df, 1.05);
    sun.position.set(6, 12, 7);
    this.group.add(hemi, sun);

    this.shell = this.mat(SHELL, { rough: 0.42, metal: 0.12 });
    this.joint = this.mat(JOINT, { rough: 0.45, metal: 0.45 });
    this.glass = this.mat(0xd7e4ea, { rough: 0.12, metal: 0.2, opacity: 0.28 });
    this.pipeMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { uTime: { value: 0 }, uStain: { value: 0.85 } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uStain;
        varying vec2 vUv;
        void main() {
          float flow = sin(vUv.x * 22.0 - uTime * 2.2) * 0.5 + 0.5;
          vec3 sludge = vec3(0.10, 0.09, 0.07);
          vec3 clearc = vec3(0.62, 0.80, 0.84);
          vec3 gold = vec3(0.72, 0.52, 0.16);
          vec3 c = mix(clearc, mix(sludge, gold, 0.4), uStain);
          c += flow * uStain * 0.1;
          gl_FragColor = vec4(c, 0.94);
        }
      `,
    });
    this.mats.push(this.pipeMat);

    this.buildPlaza();
    this.buildSea();
    this.buildPipe();
    this.buildGarden();
    this.buildTown();
    this.buildTower();
    this.buildSign();
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
    const sand = this.mesh(this.group, new THREE.CircleGeometry(9, 40), this.mat(0xd4cbb8, { rough: 1 }), 0, -0.03, 0.6);
    sand.rotation.x = -Math.PI / 2;
    const lawn = this.mesh(this.group, new THREE.CircleGeometry(3.8, 40), this.mat(0x3d8a46, { rough: 0.92 }), 0, 0.02, 0.15);
    lawn.rotation.x = -Math.PI / 2;
  }

  buildSea() {
    const geo = new THREE.PlaneGeometry(18, 8, 28, 12);
    this.geos.push(geo);
    this.seaMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      uniforms: { uTime: { value: 0 }, uClear: { value: 0 } },
      vertexShader: `
        uniform float uTime;
        varying float vH;
        varying float vShore;
        void main() {
          vec3 p = position;
          float roll = sin(p.y * 1.8 - uTime * 1.5);
          float cross = sin(p.x * 0.45 + p.y * 2.4 - uTime * 1.9);
          float wave = roll * 0.05 + cross * 0.028;
          p.z += wave;
          vH = wave;
          vShore = p.y;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uClear;
        varying float vH;
        varying float vShore;
        void main() {
          vec3 dark = vec3(0.05, 0.06, 0.05);
          vec3 clearc = vec3(0.10, 0.48, 0.62);
          float shore = smoothstep(-3.6, -1.2, vShore);
          float crest = smoothstep(0.0, 0.04, vH);
          vec3 col = mix(dark, clearc, uClear);
          vec3 foam = vec3(0.82, 0.93, 0.96);
          col = mix(col, foam, crest * (0.25 + uClear * 0.55) + shore * uClear * 0.35);
          gl_FragColor = vec4(col, 0.88);
        }
      `,
    });
    this.mats.push(this.seaMat);
    const sea = new THREE.Mesh(geo, this.seaMat);
    sea.rotation.x = -Math.PI / 2;
    sea.position.set(0, 0.015, 7.1);
    this.group.add(sea);
  }

  buildPipe() {
    const pipe = this.mesh(this.group, new THREE.CylinderGeometry(0.16, 0.2, 3.4, 12), this.pipeMat, 0, 0.18, 1.85);
    pipe.rotation.x = Math.PI / 2;
    this.mesh(this.group, new THREE.BoxGeometry(0.55, 0.08, 0.7), this.pipeMat, 0, 0.1, 3.35);
  }

  palm(x, z, lean) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.rotation.z = lean;
    const trunk = this.mat(0x6b4a32, { rough: 0.85 });
    this.mesh(g, new THREE.CylinderGeometry(0.07, 0.11, 2.15, 7), trunk, 0, 1.05, 0);
    const leaf = this.mat(0x1f6b34, { rough: 0.7 });
    leaf.side = THREE.DoubleSide;
    for (let i = 0; i < 7; i++) {
      const frond = this.mesh(g, new THREE.PlaneGeometry(0.16, 0.95), leaf, 0, 2.15, 0);
      frond.rotation.y = (i / 7) * Math.PI * 2;
      frond.rotation.z = 1.05;
    }
    const nut = this.mat(0x5a3a22, { rough: 0.6 });
    this.mesh(g, new THREE.SphereGeometry(0.06, 8, 6), nut, 0.08, 2.02, 0.05);
    this.mesh(g, new THREE.SphereGeometry(0.05, 8, 6), nut, -0.06, 1.98, 0.08);
    this.group.add(g);
    return g;
  }

  bush(x, z, bloom) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const green = this.mat(0x246b38, { rough: 0.8 });
    this.mesh(g, new THREE.SphereGeometry(0.2, 8, 6), green, 0, 0.2, 0);
    this.mesh(g, new THREE.SphereGeometry(0.13, 8, 6), green, 0.12, 0.28, 0.04);
    const flower = this.mat(bloom, { rough: 0.5 });
    [[0.05, 0.32, 0.08], [-0.08, 0.26, 0.06], [0.1, 0.22, -0.04], [0, 0.36, 0]].forEach(([px, py, pz]) => {
      this.mesh(g, new THREE.SphereGeometry(0.045, 7, 5), flower, px, py, pz);
    });
    this.group.add(g);
  }

  tropical(x, z) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const leaf = this.mat(0x1b7a42, { rough: 0.65 });
    leaf.side = THREE.DoubleSide;
    for (let i = 0; i < 5; i++) {
      const blade = this.mesh(g, new THREE.PlaneGeometry(0.22, 0.55), leaf, 0, 0.32, 0);
      blade.rotation.y = -0.6 + i * 0.3;
      blade.rotation.x = -0.4;
      blade.position.x = (i - 2) * 0.08;
    }
    this.group.add(g);
  }

  buildGarden() {
    this.palms = [
      this.palm(-2.7, -1.1, 0.08),
      this.palm(2.9, 0.2, -0.1),
      this.palm(-1.5, 2.35, 0.05),
    ];
    this.bush(-1.6, 1.15, 0xc43b4e);
    this.bush(1.15, 1.25, 0xe07a9a);
    this.bush(1.7, -1.15, 0xb4233a);
    this.bush(-2.05, 0.15, 0xd4556a);
    this.tropical(2.15, 1.55);
    this.tropical(-2.2, 1.7);
    this.tropical(0.7, -1.7);
    this.tropical(-0.4, 2.15);
  }

  block(x, z, w, h, d, rot) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.rotation.y = rot;
    this.mesh(g, new THREE.BoxGeometry(w + 0.16, 0.08, d + 0.16), this.joint, 0, 0.04, 0);
    this.mesh(g, new THREE.BoxGeometry(w, h, d), this.shell, 0, h / 2 + 0.06, 0);
    this.mesh(g, new THREE.BoxGeometry(w + 0.12, 0.07, d + 0.12), this.joint, 0, h + 0.1, 0);
    const rows = Math.max(2, Math.round(h / 0.48));
    const cols = Math.max(2, Math.round(w / 0.42));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const wy = 0.38 + r * (h / rows);
        const wx = -w / 2 + (c + 0.5) * (w / cols);
        this.mesh(g, new THREE.PlaneGeometry(0.16, 0.2), this.townWin, wx, wy, d / 2 + 0.01);
      }
    }
    this.mesh(g, new THREE.BoxGeometry(0.28, 0.42, 0.04), this.mat(0x6a5344, { rough: 0.6 }), 0, 0.28, d / 2 + 0.02);
    this.group.add(g);
  }

  buildTown() {
    this.townWin = this.mat(0x1c2830, { rough: 0.25, metal: 0.2, emissive: 0xc9a15a, ei: 0.12 });
    this.block(-3.35, -1.6, 1.15, 1.7, 0.9, 0.25);
    this.block(3.4, -1.35, 1.45, 1.15, 1.05, -0.2);
    this.block(-1.15, -2.55, 0.85, 2.15, 0.75, 0.05);
    this.block(1.35, -2.45, 1.25, 1.45, 0.85, -0.08);
    const roof = this.mesh(this.group, new THREE.ConeGeometry(0.7, 0.38, 4), this.joint, 1.35, 1.7, -2.45);
    roof.rotation.y = Math.PI / 4;
  }

  clerk(parent, x, y, z, scale) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.scale.setScalar(scale);
    const visor = this.mat(0x0c1016, { rough: 0.2, metal: 0.4, emissive: 0x102030, ei: 0.35 });
    this.mesh(g, new THREE.CapsuleGeometry(0.06, 0.22, 3, 6), this.shell, -0.08, 0.2, 0);
    this.mesh(g, new THREE.CapsuleGeometry(0.06, 0.22, 3, 6), this.shell, 0.08, 0.2, 0);
    this.mesh(g, new THREE.CapsuleGeometry(0.12, 0.22, 3, 8), this.shell, 0, 0.52, 0);
    this.mesh(g, new THREE.SphereGeometry(0.11, 10, 8), this.shell, 0, 0.82, 0);
    this.mesh(g, new THREE.BoxGeometry(0.14, 0.03, 0.02), visor, 0, 0.83, 0.09);
    parent.add(g);
    return visor;
  }

  labelMat(draw) {
    const m = new THREE.MeshBasicMaterial({ color: 0xf7f4ee });
    this.mats.push(m);
    if (typeof document === "undefined") return m;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    draw(ctx, canvas);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    this.geos.push(tex);
    m.map = tex;
    m.needsUpdate = true;
    return m;
  }

  buildTower() {
    const marks = ["$", "€", "¥", "£", "₹", "₣"];
    const props = ["case", "paper", "seal", "villa", "card", "watch"];
    props.forEach((kind, i) => {
      const y = 0.55 + i * 0.62;
      const floor = new THREE.Group();
      floor.position.y = y;
      this.group.add(floor);
      const glass = this.mat(0xd7e4ea, { rough: 0.08, metal: 0.15, opacity: 0.62 });
      this.mesh(floor, new THREE.BoxGeometry(1.7, 0.56, 1.15), glass, 0, 0, 0);
      this.mesh(floor, new THREE.BoxGeometry(1.78, 0.04, 1.22), this.joint, 0, 0.28, 0);
      const sludge = this.mat(0x1a1612, { rough: 0.7, opacity: 0.82 });
      this.mesh(floor, new THREE.BoxGeometry(1.4, 0.08, 0.7), sludge, 0, -0.18, 0);
      const visor = this.clerk(floor, 0.55, -0.22, 0.15, 0.55);
      if (kind === "case") {
        this.mesh(floor, new THREE.BoxGeometry(0.34, 0.16, 0.22), this.mat(0x6d5a40, { rough: 0.7 }), -0.35, -0.12, 0);
        this.mesh(floor, new THREE.BoxGeometry(0.28, 0.12, 0.18), this.mat(0x5a4030, { rough: 0.7 }), -0.05, -0.1, 0.08);
      } else if (kind === "paper") {
        this.mesh(floor, new THREE.BoxGeometry(0.28, 0.012, 0.2), this.mat(0xf4f5f3, { rough: 0.8 }), -0.3, -0.1, 0);
        this.mesh(floor, new THREE.BoxGeometry(0.26, 0.012, 0.18), this.mat(0xe7e2d6, { rough: 0.8 }), -0.12, -0.08, 0.06);
      } else if (kind === "seal") {
        const seal = this.mesh(floor, new THREE.TorusGeometry(0.16, 0.035, 8, 16), this.mat(0xc9a15a, { metal: 0.55, rough: 0.3 }), -0.25, -0.02, 0);
        seal.rotation.x = Math.PI / 2;
        this.seal = seal;
      } else if (kind === "villa") {
        this.mesh(floor, new THREE.BoxGeometry(0.36, 0.2, 0.28), this.shell, -0.28, -0.06, 0);
        this.mesh(floor, new THREE.ConeGeometry(0.26, 0.14, 4), this.joint, -0.28, 0.1, 0);
      } else if (kind === "card") {
        this.mesh(floor, new THREE.BoxGeometry(0.22, 0.012, 0.14), this.mat(0xf0c84a, { metal: 0.6, rough: 0.25, emissive: 0x8a6a10, ei: 0.35 }), -0.28, -0.08, 0);
      } else {
        this.mesh(floor, new THREE.TorusGeometry(0.07, 0.02, 6, 12), this.mat(0xf0c84a, { metal: 0.7, rough: 0.25 }), -0.28, -0.04, 0);
      }
      const symbol = marks[i];
      const pane = this.labelMat((ctx) => {
        ctx.fillStyle = "#f7f4ee";
        ctx.fillRect(0, 0, 512, 256);
        ctx.fillStyle = "#1a1614";
        ctx.font = "700 168px Georgia, 'Times New Roman', serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(symbol, 256, 138);
      });
      const win = new THREE.Group();
      win.position.set(-0.15, 0.02, 0.6);
      win.scale.setScalar(0.001);
      this.mesh(win, new THREE.BoxGeometry(0.46, 0.32, 0.03), this.joint, 0, 0, -0.01);
      this.mesh(win, new THREE.PlaneGeometry(0.38, 0.24), pane, 0, 0, 0.02);
      floor.add(win);
      this.floors.push({ sludge, glass, visor, win });
    });
  }

  buildSign() {
    const board = new THREE.Group();
    board.position.set(0, 4.55, 0.15);
    this.mesh(board, new THREE.BoxGeometry(2.7, 0.62, 0.08), this.mat(0xf4f1ea, { rough: 0.6 }), 0, 0, 0);
    this.mesh(board, new THREE.BoxGeometry(2.78, 0.08, 0.1), this.mat(0xb7522d, { rough: 0.5 }), 0, 0.3, 0);
    const face = this.labelMat((ctx, canvas) => {
      ctx.fillStyle = "#f4f1ea";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#1a1614";
      ctx.font = "700 78px Georgia, 'Times New Roman', serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("Mkweli AML", 210, 132);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 28, 18, 150, 220);
        face.map.needsUpdate = true;
      };
      img.src = new URL("./brand/mkweli-mark.png", import.meta.url).href;
    });
    const plate = this.mesh(board, new THREE.PlaneGeometry(2.5, 0.5), face, 0, 0, 0.05);
    plate.castShadow = false;
    this.group.add(board);
  }

  buildWalker() {
    const g = new THREE.Group();
    g.position.set(0.2, 0, 1.45);
    const suit = this.mat(0xf7f4ee, { rough: 0.55 });
    const skin = this.mat(0xd7b39a, { rough: 0.65 });
    const shoe = this.mat(0xf0c030, { rough: 0.4 });
    const tie = this.mat(0xc4302b, { rough: 0.45 });
    const belt = this.mat(0x1a3a8a, { rough: 0.4 });
    const brief = this.mat(0x1f7a3a, { rough: 0.55 });
    const phone = this.mat(0x14181c, { rough: 0.35, metal: 0.4 });
    const leg = (x) => {
      const hip = new THREE.Group();
      hip.position.set(x, 0.48, 0);
      this.mesh(hip, new THREE.CapsuleGeometry(0.06, 0.24, 3, 6), suit, 0, -0.16, 0);
      this.mesh(hip, new THREE.BoxGeometry(0.11, 0.06, 0.18), shoe, 0, -0.34, 0.04);
      g.add(hip);
      return hip;
    };
    this.legL = leg(-0.09);
    this.legR = leg(0.09);
    this.mesh(g, new THREE.BoxGeometry(0.28, 0.04, 0.16), belt, 0, 0.46, 0.02);
    this.mesh(g, new THREE.BoxGeometry(0.32, 0.38, 0.18), suit, 0, 0.68, 0);
    this.mesh(g, new THREE.BoxGeometry(0.05, 0.2, 0.02), tie, 0, 0.7, 0.1);
    this.head = new THREE.Group();
    this.head.position.set(0, 1.02, 0);
    this.mesh(this.head, new THREE.SphereGeometry(0.12, 12, 10), skin, 0, 0, 0);
    const hair = this.mesh(this.head, new THREE.SphereGeometry(0.1, 10, 8), this.mat(0x2a211c, { rough: 0.8 }), 0, 0.08, -0.02);
    hair.scale.set(1.05, 0.55, 0.9);
    g.add(this.head);
    this.briefArm = new THREE.Group();
    this.briefArm.position.set(-0.2, 0.84, 0);
    g.add(this.briefArm);
    this.mesh(this.briefArm, new THREE.CapsuleGeometry(0.045, 0.22, 3, 6), suit, 0, -0.16, 0);
    this.mesh(this.briefArm, new THREE.BoxGeometry(0.16, 0.2, 0.06), brief, 0, -0.36, 0.02);
    const talk = new THREE.Group();
    talk.position.set(0.18, 0.9, 0.02);
    talk.rotation.x = -2.35;
    talk.rotation.z = -0.25;
    g.add(talk);
    this.mesh(talk, new THREE.CapsuleGeometry(0.04, 0.2, 3, 6), suit, 0, -0.14, 0);
    this.mesh(talk, new THREE.BoxGeometry(0.05, 0.09, 0.015), phone, 0.02, -0.28, 0.03);
    this.group.add(g);
    return g;
  }

  sync(competition, outcome, correct) {
    this.competition = competition;
    this.outcome = outcome;
    this.correct = correct;
  }

  tick(dt, t, reduced) {
    const on = this.competition === "wash";
    this.group.visible = on;
    if (!on) return;
    const ease = reduced ? 1 : 1 - Math.exp(-3 * dt);
    const clean = this.outcome === "clean";
    const thin = this.outcome === "thin";
    const washed = this.outcome === "wash";
    this.floors.forEach((floor, i) => {
      const gone = i < this.correct;
      const target = gone ? 0.02 : washed ? 0.92 : 0.75;
      floor.sludge.opacity += (target - floor.sludge.opacity) * ease;
      floor.sludge.color.set(washed && !gone ? 0x6a5420 : 0x1a1612);
      const clearOp = gone ? 0.06 : 0.62;
      floor.glass.opacity += (clearOp - floor.glass.opacity) * ease;
      const winScale = gone ? 1 : 0.001;
      floor.win.scale.x += (winScale - floor.win.scale.x) * ease;
      floor.win.scale.y += (winScale - floor.win.scale.y) * ease;
      floor.win.scale.z += (winScale - floor.win.scale.z) * ease;
      const face = gone || clean;
      floor.visor.color.set(face ? 0xd7b39a : 0x0c1016);
      floor.visor.emissive.set(face ? 0x000000 : 0x102030);
      floor.visor.emissiveIntensity = face ? 0 : 0.35;
    });
    const stain = clean ? 0.04 : washed ? 1 : thin ? 0.55 : Math.max(0.15, 1 - this.correct / 6);
    const cur = this.pipeMat.uniforms.uStain.value;
    this.pipeMat.uniforms.uStain.value = cur + (stain - cur) * ease;
    this.pipeMat.uniforms.uTime.value = reduced ? 0.2 : t;
    if (this.seal) this.seal.rotation.z = reduced ? 0.4 : t * 0.9;
    if (this.seaMat) {
      const clear = clean ? 1 : washed ? 0.08 : thin ? 0.45 : this.correct / 6;
      const curC = this.seaMat.uniforms.uClear.value;
      this.seaMat.uniforms.uClear.value = curC + (clear - curC) * ease;
      this.seaMat.uniforms.uTime.value = reduced ? 0.2 : t;
    }
    if (!reduced) {
      const step = t * 5.5;
      this.legL.rotation.x = Math.sin(step) * 0.55;
      this.legR.rotation.x = Math.sin(step + Math.PI) * 0.55;
      this.briefArm.rotation.x = Math.sin(step + Math.PI) * 0.35;
      this.head.rotation.x = Math.sin(t * 7.5) * 0.06;
      this.head.rotation.y = 0.18 + Math.sin(t * 3.2) * 0.05;
      const trip = (t * 0.22) % 2;
      const leg = trip < 1 ? trip : 2 - trip;
      this.walker.position.x = -1.15 + leg * 2.3;
      this.walker.position.z = 1.45;
      this.walker.position.y = Math.abs(Math.sin(step)) * 0.035;
      this.walker.rotation.y = trip < 1 ? Math.PI / 2 : -Math.PI / 2;
      this.palms.forEach((palm, i) => {
        palm.rotation.z = (i === 1 ? -0.1 : 0.06) + Math.sin(t * 0.7 + i) * 0.03;
      });
    }
    const glow = washed ? 0.85 : clean ? 0.08 : 0.16;
    this.townWin.emissiveIntensity += (glow - this.townWin.emissiveIntensity) * ease;
  }

  dispose() {
    this.group.removeFromParent();
    for (const g of this.geos) g.dispose();
    for (const m of this.mats) m.dispose();
  }
}

export { WashScene };
