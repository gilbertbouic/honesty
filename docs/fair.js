// src/lib/game/fair-scene.ts
import * as THREE from "three";
var IRIS = new THREE.Color(11766015);
var GREEN = new THREE.Color(4063130);
var CRIMSON = new THREE.Color(16726862);
var PAPER = new THREE.Color(15199986);
var VOID = new THREE.Color(1183256);
var GATE_COLORS = [
  new THREE.Color(12868186),
  new THREE.Color(15123306),
  new THREE.Color(13073919),
  new THREE.Color(12964056),
  new THREE.Color(8308991),
  new THREE.Color(9268042)
];
var FairScene = class {
  group = new THREE.Group();
  geos = [];
  mats = [];
  bars = [];
  barMats = [];
  core;
  coreMat;
  competition = "tender";
  outcome = "open";
  correct = 0;
  constructor(scene) {
    this.buildGrid();
    this.buildGates();
    this.core = this.buildCore();
    this.coreMat = this.core.material;
    this.group.visible = false;
    scene.add(this.group);
  }
  sync(competition, outcome, correct) {
    this.competition = competition;
    this.outcome = outcome;
    this.correct = correct;
  }
  tick(dt, t, reduced) {
    const on = this.competition === "fair";
    this.group.visible = on;
    if (!on) return;
    const fair = this.outcome === "fair";
    const barred = this.outcome === "barred";
    const lit = fair ? 6 : barred ? 0 : this.correct;
    const ease = reduced ? 1 : 1 - Math.exp(-3 * dt);
    this.bars.forEach((bar, i) => {
      const open = i < lit;
      const target = open ? 2.15 : 1.05;
      bar.position.y += (target - bar.position.y) * ease;
      const mat = this.barMats[i];
      mat.color.copy(open ? GREEN : barred ? CRIMSON : GATE_COLORS[i]);
      mat.opacity = open ? 0.35 : 0.92;
    });
    this.coreMat.color.copy(fair ? GREEN : barred ? CRIMSON : IRIS);
    this.coreMat.opacity = fair ? 0.95 : 0.45 + (reduced ? 0 : Math.sin(t * 2) * 0.15);
    this.core.position.y = 1.35 + (reduced ? 0 : Math.sin(t * 1.4) * 0.06);
    this.core.rotation.y = reduced ? 0.4 : t * 0.35;
  }
  dispose() {
    this.group.removeFromParent();
    for (const g of this.geos) g.dispose();
    for (const m of this.mats) m.dispose();
  }
  addBox(x, y, z, w, h, d, color, opacity = 0.55) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const edges = new THREE.EdgesGeometry(geo);
    this.geos.push(geo, edges);
    const fill = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
    const line = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 });
    this.mats.push(fill, line);
    const mesh = new THREE.Mesh(geo, fill);
    const wire = new THREE.LineSegments(edges, line);
    mesh.position.set(x, y, z);
    wire.position.set(x, y, z);
    this.group.add(mesh, wire);
    return mesh;
  }
  buildGrid() {
    const ink = new THREE.Color(3811925);
    for (let i = -3; i <= 3; i++) {
      this.addBox(0, 0.02, i * 1.35, 8.2, 0.025, 0.035, ink, 0.7);
      this.addBox(i * 1.35, 0.02, 0, 0.035, 0.025, 8.2, ink, 0.7);
    }
    this.addBox(0, 0.01, 0, 9.2, 0.02, 9.2, new THREE.Color(1446428), 0.35);
  }
  buildGates() {
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * 3.15;
      const z = Math.sin(a) * 3.15;
      const color = GATE_COLORS[i];
      const post = 0.42;
      this.addBox(x - post, 0.7, z, 0.08, 1.4, 0.08, PAPER, 0.75);
      this.addBox(x + post, 0.7, z, 0.08, 1.4, 0.08, PAPER, 0.75);
      const geo = new THREE.BoxGeometry(0.92, 0.07, 0.08);
      this.geos.push(geo);
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.92 });
      this.mats.push(mat);
      this.barMats.push(mat);
      const bar = new THREE.Mesh(geo, mat);
      bar.position.set(x, 1.05, z);
      bar.rotation.y = -a;
      this.bars.push(bar);
      this.group.add(bar);
      this.addBox(x, 0.04, z, 0.7, 0.04, 0.7, color, 0.4);
    }
  }
  buildCore() {
    const geo = new THREE.BoxGeometry(0.28, 1.5, 0.28);
    this.geos.push(geo);
    const mat = new THREE.MeshBasicMaterial({ color: IRIS, transparent: true, opacity: 0.7 });
    this.mats.push(mat);
    const core = new THREE.Mesh(geo, mat);
    core.position.set(0, 1.35, 0);
    this.group.add(core);
    return core;
  }
};
export {
  FairScene
};
