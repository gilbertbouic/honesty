// src/lib/game/fair-scene.ts
import * as THREE from "three";
var IRIS = new THREE.Color(11766015);
var GREEN = new THREE.Color(4063130);
var CRIMSON = new THREE.Color(16726862);
var PAPER = new THREE.Color(15199986);
var SKIN = new THREE.Color(14132602);
var SKIN_DEEP = new THREE.Color(4860954);
var SKIN_WARM = new THREE.Color(13010538);
var HAIR_DARK = new THREE.Color(1708558);
var HAIR_GREY = new THREE.Color(12041412);
var CLOTH = new THREE.Color(2371652);
var DRESS = new THREE.Color(12868216);
var VEIL = new THREE.Color(1920649);
var GOLD = new THREE.Color(15779914);
var RAINBOW = [
  new THREE.Color(14942979),
  new THREE.Color(16747520),
  new THREE.Color(16772352),
  new THREE.Color(32806),
  new THREE.Color(2375822),
  new THREE.Color(7547266)
];
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
  addBox(x, y, z, w, h, d, color, opacity = 0.9, parent = this.group) {
    const geo = new THREE.BoxGeometry(w, h, d);
    this.geos.push(geo);
    const fill = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
    this.mats.push(fill);
    const mesh = new THREE.Mesh(geo, fill);
    mesh.position.set(x, y, z);
    parent.add(mesh);
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
    const kinds = ["black", "woman", "star", "elder", "veil", "pride"];
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * Math.PI * 2 - Math.PI / 2;
      const gate = new THREE.Group();
      gate.position.set(Math.cos(a) * 3.15, 0, Math.sin(a) * 3.15);
      gate.rotation.y = Math.PI / 2 - a;
      this.group.add(gate);
      const color = GATE_COLORS[i];
      this.addBox(-0.42, 0.7, 0, 0.08, 1.4, 0.08, PAPER, 0.75, gate);
      this.addBox(0.42, 0.7, 0, 0.08, 1.4, 0.08, PAPER, 0.75, gate);
      const geo = new THREE.BoxGeometry(0.92, 0.07, 0.08);
      this.geos.push(geo);
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.92 });
      this.mats.push(mat);
      this.barMats.push(mat);
      const bar = new THREE.Mesh(geo, mat);
      bar.position.set(0, 1.05, 0);
      this.bars.push(bar);
      gate.add(bar);
      this.addBox(0, 0.04, 0, 0.7, 0.04, 0.7, color, 0.4, gate);
      this.placePerson(gate, kinds[i]);
    }
  }
  placePerson(gate, kind) {
    const person = new THREE.Group();
    person.position.set(0, 0, 0.36);
    gate.add(person);
    const put = (x, y, z, w, h, d, color) => this.addBox(x, y, z, w, h, d, color, 0.96, person);
    if (kind === "black") {
      put(0, 0.28, 0, 0.16, 0.4, 0.12, CLOTH);
      put(0, 0.72, 0, 0.32, 0.42, 0.18, new THREE.Color(2767445));
      put(0, 1.12, 0, 0.2, 0.2, 0.18, SKIN_DEEP);
      put(0, 1.24, -0.02, 0.22, 0.1, 0.2, HAIR_DARK);
    } else if (kind === "woman") {
      put(0, 0.22, 0, 0.46, 0.28, 0.28, DRESS);
      put(0, 0.48, 0, 0.34, 0.28, 0.2, DRESS);
      put(0, 0.78, 0, 0.28, 0.28, 0.16, DRESS);
      put(0, 1.12, 0.02, 0.18, 0.18, 0.16, SKIN_WARM);
      put(0, 1.2, -0.04, 0.22, 0.22, 0.18, HAIR_DARK);
      put(0, 0.92, -0.1, 0.16, 0.36, 0.1, HAIR_DARK);
    } else if (kind === "star") {
      put(-0.08, 0.28, 0, 0.1, 0.42, 0.1, CLOTH);
      put(0.08, 0.28, 0, 0.1, 0.42, 0.1, CLOTH);
      put(0, 0.74, 0, 0.32, 0.4, 0.16, new THREE.Color(1981023));
      put(0, 1.12, 0.02, 0.18, 0.18, 0.16, SKIN);
      put(0, 1.24, -0.02, 0.2, 0.08, 0.18, HAIR_DARK);
      const geo = new THREE.ConeGeometry(0.07, 0.13, 3);
      this.geos.push(geo);
      const mat = new THREE.MeshBasicMaterial({ color: GOLD });
      this.mats.push(mat);
      const up = new THREE.Mesh(geo, mat);
      up.position.set(0, 0.8, 0.1);
      const down = new THREE.Mesh(geo, mat);
      down.position.set(0, 0.74, 0.1);
      down.rotation.x = Math.PI;
      person.add(up, down);
    } else if (kind === "elder") {
      person.scale.setScalar(0.86);
      person.position.y = 0;
      put(-0.07, 0.26, 0, 0.1, 0.4, 0.1, CLOTH);
      put(0.07, 0.26, 0, 0.1, 0.4, 0.1, CLOTH);
      put(0, 0.7, 0, 0.32, 0.4, 0.18, new THREE.Color(4871520));
      put(0, 1.1, 0.02, 0.18, 0.18, 0.16, new THREE.Color(13808794));
      put(0, 1.22, -0.02, 0.22, 0.12, 0.2, HAIR_GREY);
      put(0, 1, 0.1, 0.14, 0.12, 0.08, HAIR_GREY);
    } else if (kind === "veil") {
      put(0, 0.28, 0, 0.4, 0.5, 0.26, VEIL);
      put(0, 0.72, 0, 0.34, 0.36, 0.2, VEIL);
      put(0, 1.08, -0.02, 0.36, 0.16, 0.24, VEIL);
      put(0, 1.24, -0.02, 0.26, 0.18, 0.26, VEIL);
      put(0, 1.14, 0.1, 0.12, 0.12, 0.06, SKIN_WARM);
    } else {
      put(-0.08, 0.28, 0, 0.1, 0.4, 0.1, CLOTH);
      put(0.08, 0.28, 0, 0.1, 0.4, 0.1, CLOTH);
      RAINBOW.forEach((color, s) => put(0, 0.58 + s * 0.07, 0, 0.32, 0.07, 0.18, color));
      put(0, 1.12, 0.02, 0.18, 0.18, 0.16, SKIN_WARM);
      put(0, 1.24, -0.02, 0.2, 0.1, 0.18, new THREE.Color(5909098));
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
