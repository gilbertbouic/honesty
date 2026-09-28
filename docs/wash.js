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
    this.buildPipe();
    this.buildTower();
    this.buildVilla();
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
    const disc = this.mesh(this.group, new THREE.CircleGeometry(7.2, 48), this.mat(0xc8c2b6, { rough: 1 }), 0, 0, 0);
    disc.rotation.x = -Math.PI / 2;
  }

  buildPipe() {
    const pipe = this.mesh(this.group, new THREE.CylinderGeometry(0.22, 0.28, 5.2, 12), this.pipeMat, -3.3, 0.35, 0.2);
    pipe.rotation.z = Math.PI / 2;
    this.mesh(this.group, new THREE.CylinderGeometry(0.1, 0.1, 1.4, 8), this.joint, -5.6, 0.15, 0.2);
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

  buildTower() {
    const props = ["case", "paper", "seal", "villa", "card", "watch"];
    props.forEach((kind, i) => {
      const y = 0.55 + i * 0.62;
      const floor = new THREE.Group();
      floor.position.y = y;
      this.group.add(floor);
      this.mesh(floor, new THREE.BoxGeometry(1.7, 0.56, 1.15), this.glass, 0, 0, 0);
      this.mesh(floor, new THREE.BoxGeometry(1.78, 0.04, 1.22), this.joint, 0, 0.28, 0);
      const sludge = this.mat(0x1a1612, { rough: 0.7, opacity: 0.82 });
      const pool = this.mesh(floor, new THREE.BoxGeometry(1.4, 0.08, 0.7), sludge, 0, -0.18, 0);
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
      this.floors.push({ sludge, pool, visor });
    });
  }

  buildVilla() {
    const g = new THREE.Group();
    g.position.set(3.5, 0, -0.6);
    this.mesh(g, new THREE.BoxGeometry(1.5, 0.9, 1.2), this.shell, 0, 0.45, 0);
    this.mesh(g, new THREE.ConeGeometry(1.15, 0.55, 4), this.joint, 0, 1.1, 0).rotation.y = Math.PI / 4;
    this.villaWin = this.mat(0x1c2830, { rough: 0.3, metal: 0.3, emissive: 0xc9a15a, ei: 0.15 });
    this.mesh(g, new THREE.BoxGeometry(0.7, 0.28, 0.04), this.villaWin, 0, 0.5, 0.61);
    this.group.add(g);
  }

  buildWalker() {
    const g = new THREE.Group();
    g.position.set(2.1, 0, 1.5);
    const visor = this.mat(0x0c1016, { rough: 0.2, metal: 0.4, emissive: 0x102030, ei: 0.4 });
    this.mesh(g, new THREE.CapsuleGeometry(0.07, 0.28, 3, 6), this.shell, -0.09, 0.24, 0);
    this.mesh(g, new THREE.CapsuleGeometry(0.07, 0.28, 3, 6), this.shell, 0.09, 0.24, 0);
    this.mesh(g, new THREE.CapsuleGeometry(0.14, 0.26, 4, 8), this.shell, 0, 0.62, 0);
    this.mesh(g, new THREE.SphereGeometry(0.13, 12, 10), this.shell, 0, 0.98, 0);
    this.mesh(g, new THREE.BoxGeometry(0.16, 0.035, 0.02), visor, 0, 0.99, 0.11);
    this.mesh(g, new THREE.TorusGeometry(0.05, 0.014, 6, 10), this.mat(0xf0c84a, { metal: 0.7, rough: 0.25, emissive: 0x8a6a10, ei: 0.3 }), 0.16, 0.7, 0.08);
    this.walkerVisor = visor;
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
    const walkX = washed ? 4.4 : 2.1;
    this.walker.position.x += (walkX - this.walker.position.x) * ease;
    const face = clean;
    this.walkerVisor.color.set(face ? 0xd7b39a : 0x0c1016);
    this.walkerVisor.emissive.set(washed ? 0x8a6a10 : 0x102030);
    const glow = washed ? 0.85 : clean ? 0.02 : 0.18;
    this.villaWin.emissiveIntensity += (glow - this.villaWin.emissiveIntensity) * ease;
  }

  dispose() {
    this.group.removeFromParent();
    for (const g of this.geos) g.dispose();
    for (const m of this.mats) m.dispose();
  }
}

export { WashScene };
