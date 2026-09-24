// src/lib/game/haven-scene.ts
import * as THREE from "three";
var GREEN = new THREE.Color(4063130);
var AMBER = new THREE.Color(14708784);
var ROSE = new THREE.Color(15769800);
var PAPER = new THREE.Color(15199986);
var VOID = new THREE.Color(1314840);
var CYAN = new THREE.Color(58879);
var HOUSE = new THREE.Color(12875834);
var QUIET = { x: -2.2, z: 8.7 };
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
function box(group, geos, parts, x, y, z, w, h, d, color, fill = 0.45) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const edges = new THREE.EdgesGeometry(geo);
  geos.push(geo, edges);
  const fillMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: fill,
    depthWrite: true
  });
  const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 });
  parts.fills.push(fillMat);
  parts.lines.push(lineMat);
  const mesh = new THREE.Mesh(geo, fillMat);
  const line = new THREE.LineSegments(edges, lineMat);
  mesh.position.set(x, y, z);
  line.position.set(x, y, z);
  group.add(mesh, line);
}
var HavenScene = class {
  group = new THREE.Group();
  geos = [];
  shell = { fills: [], lines: [] };
  stones = [];
  stoneMats = [];
  door;
  curtain;
  phone;
  column;
  core;
  beacon;
  ribbon;
  fog;
  fogPos = new Float32Array();
  competition = "tender";
  outcome = "open";
  correct = 0;
  porch = new THREE.Vector3(QUIET.x + 0.05, 0.04, QUIET.z + 1.15);
  stonePos = [];
  constructor(scene) {
    this.buildHouse();
    this.door = this.buildDoor();
    this.curtain = this.buildCurtain();
    this.phone = this.buildPhone();
    this.column = this.buildColumn();
    this.core = this.column.userData.core;
    this.buildStones();
    this.ribbon = this.buildRibbon();
    this.beacon = this.buildBeacon();
    this.fog = this.buildFog();
    this.group.visible = false;
    scene.add(this.group);
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
    const lit = outcome === "line" ? 5 : outcome === "fog" ? 0 : this.correct;
    const shell = outcome === "line" ? GREEN : outcome === "fog" ? VOID : HOUSE;
    paint(this.shell, shell, outcome === "fog" ? 0.82 : 0.78, 0.95);
    const doorTarget = outcome === "line" ? -1.2 : 0;
    const ease = reduced ? 1 : 1 - Math.exp(-3.2 * dt);
    this.door.rotation.y += (doorTarget - this.door.rotation.y) * ease;
    const curtainMat = this.curtain.material;
    const breath = reduced ? 0.34 : 0.28 + Math.sin(t * 1.3) * 0.1;
    curtainMat.opacity = outcome === "line" ? 0.08 : breath;
    curtainMat.color.copy(outcome === "fog" ? VOID : AMBER);
    const phoneMat = this.phone.material;
    const blink = reduced || outcome !== "open" ? 1 : 0.45 + Math.sin(t * 5.5) * 0.55;
    phoneMat.opacity = outcome === "fog" ? 0.15 : 0.35 + blink * 0.65;
    this.column.rotation.y = reduced ? 0.4 : t * 0.22;
    this.column.position.y = reduced ? 0 : Math.sin(t * 1.1) * 0.04;
    const coreMat = this.core.material;
    coreMat.opacity = outcome === "fog" ? 0.95 : 0.55 + Math.sin(t * 2.2) * 0.25;
    for (let i = 0; i < this.stones.length; i++) {
      const onStone = i < lit;
      const mat = this.stoneMats[i];
      mat.color.copy(onStone ? GREEN : VOID);
      mat.opacity = onStone ? 0.9 : 0.18;
      this.stones[i].position.y = onStone && !reduced ? 0.08 + Math.sin(t * 2 + i) * 0.03 : 0.05;
    }
    const ribbonMat = this.ribbon.material;
    if (lit <= 0) {
      this.ribbon.visible = false;
    } else {
      this.ribbon.visible = true;
      const end = this.stonePos[lit - 1];
      const dx = end.x - this.porch.x;
      const dz = end.z - this.porch.z;
      const len = Math.hypot(dx, dz);
      this.ribbon.scale.set(1, 1, len);
      this.ribbon.position.set(this.porch.x + dx / 2, 0.03, this.porch.z + dz / 2);
      this.ribbon.rotation.y = Math.atan2(dx, dz);
      ribbonMat.opacity = outcome === "line" ? 0.85 : 0.45;
    }
    const beaconMat = this.beacon.material;
    beaconMat.opacity = lit >= 5 ? 0.95 : lit / 5 * 0.4;
    this.beacon.rotation.y = t * 0.8;
    this.beacon.position.y = 0.55 + (reduced ? 0 : Math.sin(t * 1.6) * 0.06);
    const fogMat = this.fog.material;
    const fogOp = outcome === "line" ? 0.04 : outcome === "lamp" ? 0.28 : outcome === "fog" ? 0.82 : 0.4;
    fogMat.opacity = fogOp;
    if (!reduced && fogOp > 0.05) {
      for (let i = 0; i < this.fogPos.length; i += 3) {
        this.fogPos[i + 1] += dt * (0.15 + i % 5 * 0.02);
        if (this.fogPos[i + 1] > 1.6) this.fogPos[i + 1] = 0.15;
      }
      this.fog.geometry.getAttribute("position").needsUpdate = true;
    }
  }
  dispose() {
    this.group.removeFromParent();
    for (const g of this.geos) g.dispose();
    for (const m of [...this.shell.fills, ...this.shell.lines, ...this.stoneMats]) m.dispose();
    this.curtain.material.dispose();
    this.phone.material.dispose();
    this.beacon.material.dispose();
    this.ribbon.material.dispose();
    this.fog.material.dispose();
    this.column.traverse((obj) => {
      const mesh = obj;
      if (mesh.material && !Array.isArray(mesh.material)) mesh.material.dispose();
    });
  }
  buildHouse() {
    const x = QUIET.x;
    const z = QUIET.z;
    const W = 2.25;
    const D = 1.8;
    const H = 2.05;
    const wall = 0.12;
    const winW = 0.86;
    const winH = 0.52;
    const winY = 1.52;
    const south = z + D / 2 - wall / 2;
    const side = (W - winW) / 2;
    box(this.group, this.geos, this.shell, x - W / 2 + wall / 2, H / 2, z, wall, H, D, HOUSE, 0.55);
    box(this.group, this.geos, this.shell, x + W / 2 - wall / 2, H / 2, z, wall, H, D, HOUSE, 0.55);
    box(this.group, this.geos, this.shell, x, H / 2, z - D / 2 + wall / 2, W, H, wall, HOUSE, 0.55);
    box(this.group, this.geos, this.shell, x - 0.75, 0.6, south, 0.74, 1.2, wall, HOUSE, 0.7);
    box(this.group, this.geos, this.shell, x + 0.72, 0.6, south, 0.8, 1.2, wall, HOUSE, 0.7);
    box(this.group, this.geos, this.shell, x, 1.28, south, W, 0.12, wall, HOUSE, 0.7);
    const topH = H - (winY + winH / 2);
    box(this.group, this.geos, this.shell, x, winY + winH / 2 + topH / 2, south, W, topH, wall, HOUSE, 0.62);
    box(this.group, this.geos, this.shell, x - winW / 2 - side / 2, winY, south, side, winH, wall, HOUSE, 0.62);
    box(this.group, this.geos, this.shell, x + winW / 2 + side / 2, winY, south, side, winH, wall, HOUSE, 0.62);
    box(this.group, this.geos, this.shell, x, H + 0.08, z, W + 0.24, 0.16, D + 0.2, HOUSE, 0.4);
    box(this.group, this.geos, this.shell, x, 0.06, z + D / 2 + 0.35, 1.5, 0.08, 0.7, HOUSE, 0.35);
  }
  buildDoor() {
    const hinge = new THREE.Group();
    hinge.position.set(QUIET.x - 0.38, 0.62, QUIET.z + 0.98);
    const geo = new THREE.BoxGeometry(0.7, 1.16, 0.06);
    this.geos.push(geo);
    const mat = new THREE.MeshBasicMaterial({
      color: HOUSE,
      transparent: true,
      opacity: 0.8,
      depthWrite: true
    });
    this.shell.fills.push(mat);
    const door = new THREE.Mesh(geo, mat);
    door.position.x = 0.31;
    hinge.add(door);
    this.group.add(hinge);
    return hinge;
  }
  buildCurtain() {
    const geo = new THREE.PlaneGeometry(0.7, 0.4);
    this.geos.push(geo);
    const mat = new THREE.MeshBasicMaterial({
      color: AMBER,
      transparent: true,
      opacity: 0.34,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(QUIET.x, 1.52, QUIET.z + 0.72);
    this.group.add(mesh);
    return mesh;
  }
  buildPhone() {
    const geo = new THREE.BoxGeometry(0.16, 0.035, 0.28);
    this.geos.push(geo);
    const mat = new THREE.MeshBasicMaterial({
      color: CYAN,
      transparent: true,
      opacity: 0.9,
      depthWrite: true
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(QUIET.x + 0.35, 0.14, QUIET.z + 1.28);
    mesh.rotation.x = -0.4;
    this.group.add(mesh);
    return mesh;
  }
  buildColumn() {
    const g = new THREE.Group();
    g.position.set(QUIET.x - 2.25, 0, QUIET.z - 0.15);
    const geos = this.geos;
    const add = (geo, color, y, op = 0.55) => {
      geos.push(geo);
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: op,
        depthWrite: true
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = y;
      g.add(mesh);
      return mesh;
    };
    add(new THREE.CylinderGeometry(0.42, 0.5, 0.08, 6), ROSE, 0.06, 0.7);
    add(new THREE.BoxGeometry(0.46, 0.7, 0.46), PAPER, 0.55, 0.28);
    add(new THREE.BoxGeometry(0.38, 0.62, 0.38), GREEN, 1.28, 0.38);
    add(new THREE.BoxGeometry(0.3, 0.5, 0.3), ROSE, 1.92, 0.45);
    const ringGeo = new THREE.TorusGeometry(0.34, 0.025, 8, 18);
    geos.push(ringGeo);
    const ring = new THREE.Mesh(
      ringGeo,
      new THREE.MeshBasicMaterial({ color: ROSE, transparent: true, opacity: 0.9 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1.28;
    g.add(ring);
    const core = add(new THREE.CylinderGeometry(0.045, 0.045, 2.15, 8), PAPER, 1.15, 0.85);
    const markGeo = new THREE.OctahedronGeometry(0.14, 0);
    geos.push(markGeo);
    const mark = new THREE.Mesh(
      markGeo,
      new THREE.MeshBasicMaterial({ color: PAPER, transparent: true, opacity: 0.95 })
    );
    mark.position.y = 2.45;
    g.add(mark);
    g.userData.core = core;
    this.group.add(g);
    return g;
  }
  buildStones() {
    for (let i = 0; i < 5; i++) {
      const x = QUIET.x + 0.15 + i * 0.92;
      const z = QUIET.z + 0.55 - i * 1.05;
      this.stonePos.push(new THREE.Vector3(x, 0.05, z));
      const geo = new THREE.CylinderGeometry(0.16, 0.18, 0.06, 6);
      this.geos.push(geo);
      const mat = new THREE.MeshBasicMaterial({
        color: VOID,
        transparent: true,
        opacity: 0.18,
        depthWrite: true
      });
      this.stoneMats.push(mat);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, 0.05, z);
      this.stones.push(mesh);
      this.group.add(mesh);
    }
  }
  buildRibbon() {
    const geo = new THREE.BoxGeometry(0.08, 0.02, 1);
    this.geos.push(geo);
    const mat = new THREE.MeshBasicMaterial({
      color: GREEN,
      transparent: true,
      opacity: 0.5,
      depthWrite: false
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.visible = false;
    this.group.add(mesh);
    return mesh;
  }
  buildBeacon() {
    const last = this.stonePos[this.stonePos.length - 1];
    const geo = new THREE.OctahedronGeometry(0.22, 0);
    this.geos.push(geo);
    const mat = new THREE.MeshBasicMaterial({
      color: GREEN,
      transparent: true,
      opacity: 0,
      depthWrite: false
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(last.x, 0.55, last.z);
    this.group.add(mesh);
    return mesh;
  }
  buildFog() {
    const count = 90;
    this.fogPos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = i / count * Math.PI * 2;
      const r = 1.7 + i % 4 * 0.22;
      this.fogPos[i * 3] = QUIET.x + Math.cos(a) * r;
      this.fogPos[i * 3 + 1] = 0.2 + i % 6 * 0.18;
      this.fogPos[i * 3 + 2] = QUIET.z + Math.sin(a) * r * 0.75;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(this.fogPos, 3));
    this.geos.push(geo);
    const pts = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 6969976,
        size: 0.08,
        transparent: true,
        opacity: 0,
        depthWrite: false
      })
    );
    this.group.add(pts);
    return pts;
  }
};
export {
  HavenScene,
  QUIET
};
