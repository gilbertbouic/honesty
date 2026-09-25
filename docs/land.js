// src/lib/game/land-scene.ts
import * as THREE from "three";
var SAND = new THREE.Color(15123306);
var SEA = new THREE.Color(1746631);
var GREEN = new THREE.Color(4063130);
var CRIMSON = new THREE.Color(16726862);
var VOID = new THREE.Color(1315084);
var PAPER = new THREE.Color(15199986);
var WET = new THREE.Color(1323048);
var FILL = new THREE.Color(6965810);
var HOUSE = new THREE.Color(12875834);
var WINDOW = new THREE.Color(16757082);
function paint(parts, color, fillOp, lineOp) {
  for (const m of parts.fills) {
    m.color.copy(color);
    m.opacity = fillOp;
  }
  for (const m of parts.lines) {
    m.color.copy(color);
    m.opacity = lineOp;
  }
}
function box(group, geos, parts, x, y, z, w, h, d, color, fill = 0.5) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const edges = new THREE.EdgesGeometry(geo);
  geos.push(geo, edges);
  const fillMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: fill, depthWrite: true });
  const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 });
  parts.fills.push(fillMat);
  parts.lines.push(lineMat);
  const mesh = new THREE.Mesh(geo, fillMat);
  const line = new THREE.LineSegments(edges, lineMat);
  mesh.position.set(x, y, z);
  line.position.set(x, y, z);
  group.add(mesh, line);
  return mesh;
}
var LandScene = class {
  group = new THREE.Group();
  geos = [];
  shore = { fills: [], lines: [] };
  pegs = [];
  pegMats = [];
  fills = [];
  rope;
  ropeMat;
  wetMat;
  windows = [];
  competition = "tender";
  outcome = "open";
  correct = 0;
  constructor(scene) {
    this.buildDistantVillage();
    this.buildShore();
    this.buildWetland();
    this.buildPath();
    this.rope = this.buildRope();
    this.ropeMat = this.rope.material;
    this.buildPermit();
    this.group.visible = false;
    scene.add(this.group);
  }
  sync(competition, outcome, correct) {
    this.competition = competition;
    this.outcome = outcome;
    this.correct = correct;
  }
  tick(dt, t, reduced) {
    const on = this.competition === "land";
    this.group.visible = on;
    if (!on) return;
    const held = this.outcome === "held";
    const lost = this.outcome === "lost";
    const lit = held ? 6 : lost ? 0 : this.correct;
    const ease = reduced ? 1 : 1 - Math.exp(-3 * dt);
    for (let i = 0; i < this.pegs.length; i++) {
      const onPeg = i < lit;
      const mat = this.pegMats[i];
      mat.color.copy(onPeg ? GREEN : lost ? CRIMSON : SAND);
      mat.opacity = onPeg ? 0.95 : 0.35;
      const bob = onPeg && !reduced ? Math.sin(t * 2 + i) * 0.04 : 0;
      this.pegs[i].position.y += (0.55 + bob - this.pegs[i].position.y) * ease;
    }
    const ropeTarget = held ? 0.08 : this.outcome === "shift" ? 0.42 : 0.86;
    this.rope.position.y += (ropeTarget - this.rope.position.y) * ease;
    this.ropeMat.color.copy(held ? GREEN : lost ? CRIMSON : SAND);
    this.ropeMat.opacity = held ? 0.25 : 0.9;
    this.fills.forEach((mesh, i) => {
      const bury = lit >= 4 ? -0.45 : lit >= 2 && i > 0 ? -0.2 : lost ? 0.35 : 0.12;
      mesh.position.y += (bury - mesh.position.y) * ease;
      const mat = mesh.material;
      mat.color.copy(lit >= 4 ? WET : FILL);
      mat.opacity = lit >= 4 ? 0.15 : 0.8;
    });
    this.wetMat.color.copy(lost ? CRIMSON : held ? SEA : WET);
    this.wetMat.opacity = lost ? 0.55 : 0.72;
    const glow = held ? 0.9 : 0.25 + (reduced ? 0 : Math.sin(t * 1.4) * 0.08);
    for (const mat of this.windows) mat.opacity = glow;
    paint(this.shore, held ? SAND : lost ? VOID : SAND, held ? 0.55 : 0.4, 0.85);
  }
  dispose() {
    this.group.removeFromParent();
    for (const g of this.geos) g.dispose();
    for (const m of [...this.shore.fills, ...this.shore.lines, ...this.pegMats, ...this.windows, this.ropeMat, this.wetMat]) {
      m.dispose();
    }
    for (const mesh of this.fills) mesh.material.dispose();
  }
  buildDistantVillage() {
    const spots = [-7.2, -5.2, -3.4, -1.6, 0.2, 2, 3.8, 5.6, 7.2];
    spots.forEach((x, i) => {
      const h = 0.7 + i % 3 * 0.28;
      const z = -16.5 - i % 2 * 1.4;
      box(this.group, this.geos, this.shore, x, h / 2, z, 1.15, h, 0.9, HOUSE, 0.35);
      const win = new THREE.Mesh(
        new THREE.PlaneGeometry(0.28, 0.22),
        new THREE.MeshBasicMaterial({ color: WINDOW, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
      );
      this.geos.push(win.geometry);
      this.windows.push(win.material);
      win.position.set(x, h * 0.62, z + 0.46);
      this.group.add(win);
    });
  }
  buildShore() {
    box(this.group, this.geos, this.shore, 0, -0.08, 2.2, 18, 0.08, 14, SAND, 0.28);
    const seaGeo = new THREE.PlaneGeometry(20, 6);
    this.geos.push(seaGeo);
    const sea = new THREE.Mesh(
      seaGeo,
      new THREE.MeshBasicMaterial({ color: SEA, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
    );
    sea.rotation.x = -Math.PI / 2;
    sea.position.set(0, -0.02, 8.2);
    this.group.add(sea);
  }
  buildWetland() {
    const geo = new THREE.CircleGeometry(2.1, 28);
    this.geos.push(geo);
    this.wetMat = new THREE.MeshBasicMaterial({
      color: WET,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide
    });
    const wet = new THREE.Mesh(geo, this.wetMat);
    wet.rotation.x = -Math.PI / 2;
    wet.position.set(-4.2, 0.03, 1.4);
    this.group.add(wet);
    [-0.7, 0.15, 0.9].forEach((x, i) => {
      const g = new THREE.BoxGeometry(0.7, 0.28, 0.55);
      this.geos.push(g);
      const mat = new THREE.MeshBasicMaterial({ color: FILL, transparent: true, opacity: 0.8 });
      const mesh = new THREE.Mesh(g, mat);
      mesh.position.set(-4.2 + x, 0.12, 1.2 + i * 0.15);
      this.fills.push(mesh);
      this.group.add(mesh);
    });
  }
  buildPath() {
    for (let i = 0; i < 6; i++) {
      const geo = new THREE.BoxGeometry(0.08, 0.7, 0.08);
      this.geos.push(geo);
      const mat = new THREE.MeshBasicMaterial({ color: SAND, transparent: true, opacity: 0.4 });
      this.pegMats.push(mat);
      const peg = new THREE.Mesh(geo, mat);
      peg.position.set(1.6 + i % 2 * 0.7, 0.35, 0.4 + i * 1.15);
      this.pegs.push(peg);
      this.group.add(peg);
      const cap = new THREE.BoxGeometry(0.55, 0.06, 0.7);
      this.geos.push(cap);
      const stone = new THREE.Mesh(
        cap,
        new THREE.MeshBasicMaterial({ color: PAPER, transparent: true, opacity: 0.35 })
      );
      stone.position.set(0.2, 0.04, 0.6 + i * 1.05);
      this.group.add(stone);
    }
  }
  buildRope() {
    const post = { fills: [], lines: [] };
    box(this.group, this.geos, post, -0.85, 0.55, 6.4, 0.08, 1.1, 0.08, PAPER, 0.7);
    box(this.group, this.geos, post, 1.15, 0.55, 6.4, 0.08, 1.1, 0.08, PAPER, 0.7);
    const geo = new THREE.BoxGeometry(2.05, 0.045, 0.045);
    this.geos.push(geo);
    const mat = new THREE.MeshBasicMaterial({ color: SAND, transparent: true, opacity: 0.9 });
    const rope = new THREE.Mesh(geo, mat);
    rope.position.set(0.15, 0.86, 6.4);
    this.group.add(rope);
    return rope;
  }
  buildPermit() {
    const board = { fills: [], lines: [] };
    box(this.group, this.geos, board, 4.6, 0.85, 2.2, 0.08, 1.3, 0.9, PAPER, 0.55);
    box(this.group, this.geos, board, 4.6, 0.35, 2.2, 0.06, 0.7, 0.06, SAND, 0.8);
  }
};
export {
  LandScene
};
