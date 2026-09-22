import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const PALETTE = { void: 0x08080c, cyan: 0x00e5ff, green: 0x3dff9a, amber: 0xe07030 };
const DECAY = new THREE.Color(PALETTE.amber);
const CYAN = new THREE.Color(PALETTE.cyan);
const GREEN = new THREE.Color(PALETTE.green);
const NDC = new THREE.Vector2();
const HIT = new THREE.Color();
const SAVE_KEY = "village-grid-save";
const MONTH_MS = (6 * 24 + 14) * 60 * 60 * 1000 + 22 * 60 * 1000;
const SECTOR_LABEL = { public: "Public", civil: "Civil Service", government: "Government" };

const CONTRACTORS = [
  { id: "kuzin", name: "Kuzin", sector: "civil", score: 420, holding: "District Clinic" },
  { id: "cheri", name: "Cheri", sector: "public", score: 310, holding: "Market Shed" },
  { id: "malin", name: "Malin", sector: "government", score: 280, holding: "Civic Hall" },
  { id: "kokin", name: "Kokin", sector: "public", score: 190, holding: "Bus Shelter" },
];

const HOUSES = [
  { id: "cwa-pump", name: "CWA Pump House", hint: "Water Grid Renewal · SPEC-01", variant: "pump", x: 0.2, z: 3.4, cost: 80, renovated: false, owner: null, ownerSector: null },
  { id: "block-a", name: "Terre Rouge Block A", hint: "Cité housing · leaking roofs", variant: "block", x: -4.2, z: 1.6, cost: 60, renovated: false, owner: null, ownerSector: null },
  { id: "block-b", name: "Terre Rouge Block B", hint: "Cité housing · failed wiring", variant: "block", x: 4.3, z: 1.4, cost: 60, renovated: false, owner: null, ownerSector: null },
  { id: "market", name: "Market Shed", hint: "Held by Cheri · Public", variant: "market", x: -3.6, z: -2.1, cost: 50, renovated: true, owner: "Cheri", ownerSector: "public" },
  { id: "clinic", name: "District Clinic", hint: "Held by Kuzin · Civil Service", variant: "clinic", x: 3.9, z: -2.3, cost: 90, renovated: true, owner: "Kuzin", ownerSector: "civil" },
  { id: "school", name: "Primary School", hint: "Pamplemousses zone 3", variant: "school", x: -1.4, z: -4.8, cost: 70, renovated: false, owner: null, ownerSector: null },
  { id: "hall", name: "Civic Hall", hint: "Held by Malin · Government", variant: "hall", x: 1.9, z: -4.9, cost: 85, renovated: true, owner: "Malin", ownerSector: "government" },
  { id: "bus", name: "Bus Shelter", hint: "Held by Kokin · Public", variant: "bus", x: 5.4, z: 3.2, cost: 40, renovated: true, owner: "Kokin", ownerSector: "public" },
  { id: "power", name: "CEB Substation", hint: "Street lighting feed", variant: "power", x: -5.6, z: 3.3, cost: 90, renovated: false, owner: null, ownerSector: null },
  { id: "drain", name: "Drainage Node", hint: "Land Drainage Authority", variant: "drain", x: 0.1, z: 6.0, cost: 50, renovated: false, owner: null, ownerSector: null },
  { id: "light", name: "Street Lighting Mast", hint: "CEB · classified road", variant: "light", x: 6.4, z: -0.4, cost: 40, renovated: false, owner: null, ownerSector: null },
  { id: "community", name: "Community Centre", hint: "Village committee hall", variant: "community", x: -6.2, z: -0.6, cost: 70, renovated: false, owner: null, ownerSector: null },
];

const TENDERS = [
  {
    id: "spec-01", week: 1, spec: "SPEC-01", title: "Water Grid Renewal",
    question: "A subcontractor offers an off-books rebate to expedite materials. Under the transparency framework, how must this be logged?",
    options: [
      { id: "A", text: "Accept it as a CWA facilitation discount and offset it against the Terre Rouge connection fee, keeping the rebate off the tender file." },
      { id: "B", text: "The rebate must not be accepted; it must be fully disclosed and rejected as a compliance violation." },
      { id: "C", text: "Park the sum in a Pamplemousses District Council village-works account and spend it later on informal community improvements." },
      { id: "D", text: "File it as a customary contractor commission under the Public Procurement Act, visible only inside the Ministry of Finance." },
    ],
    correct: "B", rewardMaterial: 100, rewardIntegrity: 50,
  },
  {
    id: "spec-02", week: 2, spec: "SPEC-02", title: "CEB Street Lighting",
    question: "A supplier offers unregistered LED fittings at 40% below the approved schedule of rates, cash-in-hand, if the inspection sheet is signed tonight. What is the lawful action?",
    options: [
      { id: "A", text: "Sign the sheet and record the saving later as a CEB energy-efficiency rebate after the poles are up." },
      { id: "B", text: "Refuse the fittings, disclose the offer in full, and keep the approved schedule of rates." },
      { id: "C", text: "Accept the fittings on cité side streets only and keep approved stock on the classified road." },
      { id: "D", text: "Hold the cash in the village committee safe until the National Audit Office asks for it." },
    ],
    correct: "B", rewardMaterial: 100, rewardIntegrity: 50,
  },
  {
    id: "spec-03", week: 3, spec: "SPEC-03", title: "Monsoon Culverts",
    question: "The contractor proposes using uncertified culvert pipes leftover from a private villa in Grand Baie to beat the monsoon deadline. How must this be handled?",
    options: [
      { id: "A", text: "Approve a variation order and relabel the pipes as National Development Unit emergency stock." },
      { id: "B", text: "Reject the uncertified pipes, disclose the proposal, and keep the specified certified culverts." },
      { id: "C", text: "Use the leftover pipes under the CWA reserve and replace them after cyclone season." },
      { id: "D", text: "Split the lot: certified pipes on the classified road, leftovers inside the cités." },
    ],
    correct: "B", rewardMaterial: 100, rewardIntegrity: 50,
  },
];

const LINE_VERT = `uniform float uTime; uniform float uRenovate; uniform float uSeed;
void main(){ vec3 p=position; float g=1.0-uRenovate; float n=sin(dot(p.xz,vec2(12.1,7.3))+uTime*19.0+uSeed); float spike=step(0.92,n);
p.x+=g*spike*0.14*sin(uTime*47.0); p.y+=g*spike*0.05*sin(uTime*31.0); gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`;
const LINE_FRAG = `uniform float uTime; uniform float uRenovate; uniform vec3 uDecayColor; uniform vec3 uCleanColor;
void main(){ float flicker=1.0-(1.0-uRenovate)*step(0.88,fract(sin(uTime*11.3)*43758.5453))*0.72;
vec3 col=mix(uDecayColor,uCleanColor,uRenovate); gl_FragColor=vec4(col, mix(0.55,1.0,uRenovate)*flicker);}`;
const GRID_VERT = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
const GRID_FRAG = `uniform float uIntegrity; varying vec2 vUv;
void main(){ vec2 p=vUv*2.0-1.0; float dist=length(p); float gx=abs(fract(p.x*14.0)-0.5); float gz=abs(fract(p.y*14.0)-0.5);
float line=1.0-smoothstep(0.0,0.045,min(gx,gz)); vec3 col=mix(vec3(0.88,0.42,0.16),vec3(0.0,0.9,1.0),uIntegrity);
gl_FragColor=vec4(col, line*(1.0-smoothstep(0.42,0.98,dist))*0.42);}`;
const WATER_FRAG = `uniform float uTime; varying vec2 vUv;
void main(){ float w=sin(vUv.x*28.0+uTime*1.8)*0.5+0.5; vec3 col=mix(vec3(0.02,0.18,0.22),vec3(0.0,0.85,1.0),w*0.4); gl_FragColor=vec4(col,0.32);}`;

function hashId(id) { let h = 7; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0; return Math.abs(h); }
function pad(n) { return String(Math.max(0, n)).padStart(2, "0"); }
function formatRemain(ms) {
  const t = Math.max(0, Math.floor(ms / 1000));
  return `${pad(Math.floor(t / 86400))}d ${pad(Math.floor((t % 86400) / 3600))}h ${pad(Math.floor((t % 3600) / 60))}m`;
}

function createLineMat(seed) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 }, uRenovate: { value: 0 }, uSeed: { value: seed },
      uDecayColor: { value: DECAY.clone() }, uCleanColor: { value: CYAN.clone() },
    },
    vertexShader: LINE_VERT, fragmentShader: LINE_FRAG,
  });
}

function addBox(group, geos, lineMat, fillMat, x, y, z, w, h, d) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const edges = new THREE.EdgesGeometry(geo);
  geos.push(geo, edges);
  const fill = new THREE.Mesh(geo, fillMat); fill.position.set(x, y, z);
  const lines = new THREE.LineSegments(edges, lineMat); lines.position.set(x, y, z);
  group.add(fill, lines);
}
function addCyl(group, geos, lineMat, fillMat, x, y, z, r, h, seg = 6) {
  const geo = new THREE.CylinderGeometry(r, r, h, seg);
  const edges = new THREE.EdgesGeometry(geo);
  geos.push(geo, edges);
  const fill = new THREE.Mesh(geo, fillMat); fill.position.set(x, y, z);
  const lines = new THREE.LineSegments(edges, lineMat); lines.position.set(x, y, z);
  group.add(fill, lines);
}
function addCone(group, geos, lineMat, fillMat, x, y, z, r, h, rotY = 0) {
  const geo = new THREE.ConeGeometry(r, h, 4);
  const edges = new THREE.EdgesGeometry(geo);
  geos.push(geo, edges);
  const fill = new THREE.Mesh(geo, fillMat); fill.position.set(x, y, z); fill.rotation.y = rotY;
  const lines = new THREE.LineSegments(edges, lineMat); lines.position.set(x, y, z); lines.rotation.y = rotY;
  group.add(fill, lines);
}

function buildVariant(variant, group, geos, lineMat, fillMat) {
  switch (variant) {
    case "block":
      addBox(group, geos, lineMat, fillMat, 0, 0.7, 0, 1.7, 1.4, 1.25);
      addCone(group, geos, lineMat, fillMat, 0, 1.7, 0, 1.25, 0.65, Math.PI / 4);
      addCyl(group, geos, lineMat, fillMat, 0.45, 2.15, 0.2, 0.12, 0.45, 5);
      return { w: 2.1, h: 2.4, d: 1.7 };
    case "pump":
      addBox(group, geos, lineMat, fillMat, 0, 0.22, 0, 1.6, 0.44, 1.6);
      addCyl(group, geos, lineMat, fillMat, -0.25, 1.15, 0, 0.52, 1.5, 8);
      addBox(group, geos, lineMat, fillMat, 0.55, 0.7, 0, 0.7, 0.9, 0.7);
      addBox(group, geos, lineMat, fillMat, 0.2, 0.55, 0.7, 0.12, 0.12, 1.1);
      return { w: 2.0, h: 2.0, d: 2.0 };
    case "clinic":
      addBox(group, geos, lineMat, fillMat, 0, 0.65, 0, 2.3, 1.3, 1.45);
      addBox(group, geos, lineMat, fillMat, 0, 1.38, 0, 2.4, 0.18, 1.55);
      addBox(group, geos, lineMat, fillMat, 0, 1.85, 0, 0.18, 0.7, 0.18);
      addBox(group, geos, lineMat, fillMat, 0, 1.85, 0, 0.7, 0.18, 0.18);
      return { w: 2.6, h: 2.3, d: 1.8 };
    case "hall":
      addBox(group, geos, lineMat, fillMat, 0, 1.05, 0, 1.9, 2.1, 1.5);
      addCyl(group, geos, lineMat, fillMat, -0.7, 0.7, 0.85, 0.1, 1.4, 5);
      addCyl(group, geos, lineMat, fillMat, 0.7, 0.7, 0.85, 0.1, 1.4, 5);
      addBox(group, geos, lineMat, fillMat, 0, 2.25, 0, 2.1, 0.22, 1.7);
      return { w: 2.4, h: 2.5, d: 1.9 };
    case "school":
      addBox(group, geos, lineMat, fillMat, 0, 0.6, 0, 2.5, 1.2, 1.15);
      addBox(group, geos, lineMat, fillMat, 0, 1.3, 0, 2.6, 0.2, 1.25);
      addCyl(group, geos, lineMat, fillMat, 1.15, 1.7, 0.3, 0.05, 1.1, 4);
      return { w: 2.8, h: 2.5, d: 1.5 };
    case "market":
      addCyl(group, geos, lineMat, fillMat, -0.9, 0.55, -0.55, 0.08, 1.1, 4);
      addCyl(group, geos, lineMat, fillMat, 0.9, 0.55, -0.55, 0.08, 1.1, 4);
      addCyl(group, geos, lineMat, fillMat, -0.9, 0.55, 0.55, 0.08, 1.1, 4);
      addCyl(group, geos, lineMat, fillMat, 0.9, 0.55, 0.55, 0.08, 1.1, 4);
      addBox(group, geos, lineMat, fillMat, 0, 1.2, 0, 2.2, 0.12, 1.5);
      addBox(group, geos, lineMat, fillMat, 0, 0.35, 0, 1.4, 0.35, 0.7);
      return { w: 2.4, h: 1.5, d: 1.8 };
    case "bus":
      addBox(group, geos, lineMat, fillMat, 0, 0.55, -0.35, 1.6, 1.1, 0.12);
      addBox(group, geos, lineMat, fillMat, 0, 1.15, 0, 1.7, 0.1, 1.1);
      addCyl(group, geos, lineMat, fillMat, -0.7, 0.55, 0.4, 0.07, 1.1, 4);
      addCyl(group, geos, lineMat, fillMat, 0.7, 0.55, 0.4, 0.07, 1.1, 4);
      return { w: 1.9, h: 1.4, d: 1.3 };
    case "power":
      addBox(group, geos, lineMat, fillMat, 0, 0.55, 0, 1.3, 1.1, 1.1);
      addCyl(group, geos, lineMat, fillMat, -0.85, 0.55, 0.2, 0.28, 1.1, 6);
      addCyl(group, geos, lineMat, fillMat, 0.85, 0.55, 0.2, 0.28, 1.1, 6);
      return { w: 2.2, h: 1.8, d: 1.4 };
    case "drain":
      addBox(group, geos, lineMat, fillMat, 0, 0.28, 0, 1.8, 0.55, 1.3);
      addCyl(group, geos, lineMat, fillMat, -0.9, 0.22, 0, 0.16, 1.2, 6);
      addCyl(group, geos, lineMat, fillMat, 0.9, 0.22, 0, 0.16, 1.2, 6);
      return { w: 2.2, h: 0.9, d: 1.5 };
    case "light":
      addCyl(group, geos, lineMat, fillMat, 0, 1.4, 0, 0.08, 2.8, 5);
      addBox(group, geos, lineMat, fillMat, 0, 2.85, 0, 0.45, 0.2, 0.45);
      addCone(group, geos, lineMat, fillMat, 0, 2.65, 0, 0.35, 0.25);
      return { w: 1.0, h: 3.1, d: 1.0 };
    default:
      addBox(group, geos, lineMat, fillMat, -0.35, 0.7, 0, 1.8, 1.4, 1.2);
      addBox(group, geos, lineMat, fillMat, 0.85, 0.5, 0.55, 1.1, 1.0, 1.1);
      addBox(group, geos, lineMat, fillMat, 0.1, 1.5, 0.2, 2.2, 0.16, 1.7);
      return { w: 2.6, h: 1.8, d: 2.0 };
  }
}

function makeHouse(house) {
  const group = new THREE.Group();
  group.position.set(house.x, 0, house.z);
  const seed = hashId(house.id) % 1000;
  const lineMat = createLineMat(seed);
  const fillMat = new THREE.MeshBasicMaterial({ color: DECAY, transparent: true, opacity: 0.07, depthWrite: false });
  const geos = [];
  const size = buildVariant(house.variant, group, geos, lineMat, fillMat);

  const sweepGeo = new THREE.BoxGeometry(size.w * 1.05, 0.07, size.d * 1.05);
  geos.push(sweepGeo);
  const sweep = new THREE.Mesh(sweepGeo, new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  sweep.visible = false;
  group.add(sweep);

  const nodeGeo = new THREE.OctahedronGeometry(0.16, 0);
  geos.push(nodeGeo);
  const node = new THREE.Mesh(nodeGeo, new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
  node.position.y = size.h + 0.35;
  group.add(node);

  const ringGeo = new THREE.RingGeometry(size.w * 0.55, size.w * 0.55 + 0.06, 32);
  geos.push(ringGeo);
  const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.03;
  group.add(ring);

  const hitGeo = new THREE.BoxGeometry(size.w, size.h, size.d);
  geos.push(hitGeo);
  const hit = new THREE.Mesh(hitGeo, new THREE.MeshBasicMaterial({ visible: false }));
  hit.position.y = size.h / 2;
  hit.userData.houseId = house.id;
  group.add(hit);

  return { id: house.id, group, hit, lineMat, fillMat, sweep, node, ring, renovate: house.renovated ? 1 : 0, sweepT: house.renovated ? 1 : 0, height: size.h, seed, geos };
}

class VillageEngine {
  constructor(canvas, houses, hooks) {
    this.canvas = canvas;
    this.hooks = hooks;
    this.hoverId = null;
    this.hoveredId = null;
    this.selectedId = null;
    this.integrity = 0.32;
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.pointer = { x: 0, y: 0, inside: false };
    this.houseState = houses;
    this.visuals = new Map();
    this.hits = [];
    this.last = 0;
    this.disposed = false;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
    this.renderer.setClearColor(PALETTE.void, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(PALETTE.void, 24, 52);
    this.scene.background = new THREE.Color(PALETTE.void);
    this.camera = new THREE.PerspectiveCamera(46, 1, 0.1, 80);
    this.camera.position.set(11.2, 7.4, 11.2);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.enablePan = false;
    this.controls.autoRotate = !this.reduced;
    this.controls.autoRotateSpeed = 0.35;
    this.controls.minDistance = 7;
    this.controls.maxDistance = 20;
    this.controls.minPolarAngle = 0.55;
    this.controls.maxPolarAngle = 1.2;
    this.controls.target.set(0, 0.6, 0);

    this.scene.add(new THREE.AmbientLight(0x8a96a4, 0.5));
    this.scene.add(new THREE.HemisphereLight(0x1a3348, 0x1a0c08, 0.55));
    const key = new THREE.DirectionalLight(0x8ad4ff, 0.55);
    key.position.set(8, 14, 4);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xe07030, 0.18);
    fill.position.set(-10, 6, -6);
    this.scene.add(fill);

    this.gridMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uIntegrity: { value: 0.32 } }, vertexShader: GRID_VERT, fragmentShader: GRID_FRAG });
    const ground = new THREE.Mesh(new THREE.CircleGeometry(16, 64), this.gridMat);
    ground.rotation.x = -Math.PI / 2;
    this.scene.add(ground);

    this.waterMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uTime: { value: 0 } }, vertexShader: GRID_VERT, fragmentShader: WATER_FRAG });
    const canal = new THREE.Mesh(new THREE.PlaneGeometry(22, 1.15), this.waterMat);
    canal.rotation.x = -Math.PI / 2;
    canal.position.set(0, 0.02, 4.7);
    this.scene.add(canal);

    const plaza = new THREE.Mesh(new THREE.RingGeometry(1.55, 1.68, 48), new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false }));
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.y = 0.04;
    this.plazaRing = plaza;
    this.scene.add(plaza);

    const rainCount = 420;
    this.rainPositions = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      this.rainPositions[i * 3] = (Math.random() - 0.5) * 36;
      this.rainPositions[i * 3 + 1] = Math.random() * 16;
      this.rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 36;
    }
    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute("position", new THREE.BufferAttribute(this.rainPositions, 3));
    this.rain = new THREE.Points(rainGeo, new THREE.PointsMaterial({ color: 0x7ec8d4, size: 0.035, transparent: true, opacity: 0.45, depthWrite: false }));
    this.rain.visible = !this.reduced;
    this.scene.add(this.rain);

    const skyMat = new THREE.MeshBasicMaterial({ color: 0x101018, transparent: true, opacity: 0.9 });
    const skyLine = new THREE.LineBasicMaterial({ color: PALETTE.amber, transparent: true, opacity: 0.18 });
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2 + 0.2;
      const r = 17 + (i % 3) * 1.4;
      const h = 1.6 + ((i * 17) % 7) * 0.55;
      const w = 1.1 + (i % 4) * 0.35;
      const geo = new THREE.BoxGeometry(w, h, w);
      const mesh = new THREE.Mesh(geo, skyMat);
      mesh.position.set(Math.cos(a) * r, h / 2, Math.sin(a) * r);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), skyLine);
      edges.position.copy(mesh.position);
      this.scene.add(mesh, edges);
    }

    for (const house of houses) {
      const visual = makeHouse(house);
      this.visuals.set(house.id, visual);
      this.scene.add(visual.group);
      this.hits.push(visual.hit);
    }

    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(canvas.parentElement ?? canvas);
    this.resize();
    canvas.addEventListener("pointermove", this.onMove);
    canvas.addEventListener("pointerdown", this.onDown);
    canvas.addEventListener("pointerleave", this.onLeave);
    this.renderer.setAnimationLoop(this.tick);
  }

  sync(next) {
    this.houseState = next.houses;
    this.hoveredId = next.hoveredId;
    this.selectedId = next.selectedId;
    this.integrity = Math.min(1, next.integrity / 180);
    this.reduced = next.reducedMotion;
    this.controls.autoRotate = !next.reducedMotion;
    this.rain.visible = !next.reducedMotion;
  }

  resize = () => {
    const w = Math.max(1, this.canvas.clientWidth);
    const h = Math.max(1, this.canvas.clientHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.setSize(w, h, false);
  };

  onMove = (e) => {
    const r = this.canvas.getBoundingClientRect();
    this.pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    this.pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    this.pointer.inside = true;
  };
  onDown = (e) => { if (e.button === 0) { const id = this.pick(); if (id) this.hooks.onSelect(id); } };
  onLeave = () => {
    this.pointer.inside = false;
    if (this.hoverId) { this.hoverId = null; this.hooks.onHover(null); }
    this.canvas.style.cursor = "default";
  };
  pick() {
    NDC.set(this.pointer.x, this.pointer.y);
    this.raycaster ??= new THREE.Raycaster();
    this.raycaster.setFromCamera(NDC, this.camera);
    const hits = this.raycaster.intersectObjects(this.hits, false);
    const id = hits[0]?.object.userData.houseId;
    return typeof id === "string" ? id : null;
  }

  tick = (time) => {
    const dt = Math.min((time - this.last) / 1000, 0.1) || 0.016;
    this.last = time;
    const t = time * 0.001;
    if (this.pointer.inside) {
      const id = this.pick();
      if (id !== this.hoverId) { this.hoverId = id; this.hooks.onHover(id); }
      this.canvas.style.cursor = id ? "pointer" : "grab";
    }
    this.controls.update();
    this.gridMat.uniforms.uIntegrity.value = this.integrity;
    this.waterMat.uniforms.uTime.value = t;
    this.plazaRing.rotation.z = t * 0.12;
    this.plazaRing.material.opacity = 0.18 + this.integrity * 0.25;
    if (!this.reduced) {
      for (let i = 0; i < this.rainPositions.length; i += 3) {
        this.rainPositions[i + 1] -= 7.5 * dt;
        if (this.rainPositions[i + 1] < 0) this.rainPositions[i + 1] = 16;
      }
      this.rain.geometry.getAttribute("position").needsUpdate = true;
    }
    for (const house of this.houseState) {
      const v = this.visuals.get(house.id);
      if (!v) continue;
      const hovered = this.hoveredId === house.id || this.hoverId === house.id;
      const selected = this.selectedId === house.id;
      const target = house.renovated || hovered ? 1 : 0;
      v.renovate += (target - v.renovate) * (1 - Math.exp(-7 * dt));
      v.lineMat.uniforms.uTime.value = t;
      v.lineMat.uniforms.uRenovate.value = v.renovate;
      v.lineMat.uniforms.uCleanColor.value.copy(house.renovated ? GREEN : CYAN);
      HIT.copy(house.renovated ? GREEN : hovered ? CYAN : DECAY);
      v.fillMat.color.copy(HIT);
      v.fillMat.opacity = 0.05 + v.renovate * 0.22;
      if (hovered || house.renovated) v.sweepT = Math.min(1, v.sweepT + dt * 1.35);
      else v.sweepT = Math.max(0, v.sweepT - dt * 2.2);
      const p = v.sweepT;
      v.sweep.material.color.copy(house.renovated ? GREEN : CYAN);
      v.sweep.visible = p > 0.02 && p < 0.98;
      v.sweep.position.y = 0.1 + p * v.height;
      v.sweep.material.opacity = 0.7 * (1 - Math.abs(p - 0.5) * 1.5);
      v.node.visible = !house.renovated;
      v.node.position.y = v.height + 0.35 + Math.sin(t * 2.4 + v.seed) * 0.08;
      v.node.rotation.y = t * 1.4;
      v.node.material.opacity = hovered ? 1 : 0.55;
      v.ring.material.color.copy(house.renovated ? GREEN : CYAN);
      v.ring.material.opacity = selected ? 0.85 : hovered ? 0.4 : house.renovated ? 0.18 : 0;
      v.ring.rotation.z = t * 0.6;
      if (!house.renovated && !this.reduced && v.renovate < 0.75) {
        const glitch = Math.sin(t * 23 + v.seed) > 0.94;
        v.group.position.x = house.x + (glitch ? Math.sin(t * 90) * 0.045 : 0);
      } else v.group.position.x = house.x;
    }
    this.renderer.render(this.scene, this.camera);
  };
}

function defaultState() {
  return {
    phase: "boot", sector: null, callsign: "OP-NODE", material: 0, integrity: 32, score: 0,
    weekIndex: 0, results: [], houses: HOUSES.map((h) => ({ ...h })),
    hoveredId: null, selectedId: null, mobileTab: "tender", resetAt: Date.now() + MONTH_MS, toast: null,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultState();
    const data = JSON.parse(raw);
    if (data.version !== 1) return defaultState();
    return { ...defaultState(), ...data, hoveredId: null, selectedId: null, toast: null };
  } catch {
    return defaultState();
  }
}

function persist(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      version: 1, phase: state.phase, sector: state.sector, callsign: state.callsign,
      material: state.material, integrity: state.integrity, score: state.score,
      weekIndex: state.weekIndex, results: state.results, houses: state.houses, resetAt: state.resetAt,
    }));
  } catch { /* ignore */ }
}

const state = loadState();
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.getElementById("village");
const engine = new VillageEngine(canvas, state.houses, {
  onHover: (id) => { state.hoveredId = id; renderDock(); engine.sync(syncPayload()); },
  onSelect: (id) => { state.selectedId = id; renderDock(); engine.sync(syncPayload()); },
});
function syncPayload() {
  return { houses: state.houses, hoveredId: state.hoveredId, selectedId: state.selectedId, integrity: state.integrity, reducedMotion: reduced };
}
engine.sync(syncPayload());

const boot = document.getElementById("boot");
const play = document.getElementById("play");
const enterBtn = document.getElementById("enter-btn");
let pickedSector = state.sector;

document.querySelectorAll(".class-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    pickedSector = btn.dataset.sector;
    document.querySelectorAll(".class-btn").forEach((b) => b.classList.toggle("on", b === btn));
    enterBtn.disabled = false;
  });
});
enterBtn.addEventListener("click", () => {
  if (!pickedSector) return;
  state.phase = "play";
  state.sector = pickedSector;
  const tag = pickedSector === "public" ? "PUB" : pickedSector === "civil" ? "CIV" : "GOV";
  state.callsign = `OP-${tag}-07`;
  persist(state);
  showPlay();
});

function showPlay() {
  boot.hidden = true;
  play.hidden = false;
  renderAll();
}

function currentTender() { return TENDERS[Math.min(state.weekIndex, TENDERS.length - 1)]; }
function resultFor(id) { return state.results.find((r) => r.tenderId === id) ?? null; }

function renderTender() {
  const t = currentTender();
  const result = resultFor(t.id);
  const locked = Boolean(result);
  const hasNext = state.weekIndex < TENDERS.length - 1 && locked;
  document.getElementById("tender-panel").innerHTML = `
    <div class="side-head" style="display:flex;gap:.75rem;align-items:flex-start">
      <div style="flex:1;min-width:0">
        <p class="kicker cyan">Infrastructure tender · ${t.spec}</p>
        <h2>${t.title}</h2>
      </div>
      <span class="week">WEEK ${t.week}</span>
    </div>
    <div class="side-body">
      <p class="q">${t.question}</p>
      <ul class="opts">
        ${t.options.map((opt) => {
          const picked = result?.picked === opt.id;
          const good = opt.id === t.correct;
          const cls = picked && result.correct ? "good" : picked && !result.correct ? "bad" : locked && good ? "good" : "";
          return `<li><button type="button" class="opt ${cls}" data-opt="${opt.id}" ${locked ? "disabled" : ""}>
            <span class="letter">${opt.id}</span><span class="txt">${opt.text}</span>
          </button></li>`;
        }).join("")}
      </ul>
    </div>
    <div class="side-foot">
      <p class="kicker mute">Reward badge</p>
      <p class="green" style="margin:.35rem 0 0;font-size:.8rem">+100 Material Points / +50 Village Integrity</p>
      ${result ? `<p style="margin:.5rem 0 0;font-size:.8rem;color:${result.correct ? "var(--green)" : "var(--crimson)"}">${result.correct ? "Logged. Rebate rejected and disclosed. Spend material on decaying nodes." : "Flagged. Off-books rebate paths fail the transparency framework."}</p>` : ""}
      ${hasNext ? `<button type="button" class="cta" id="next-week" style="margin-top:.75rem">Open week ${state.weekIndex + 2} tender</button>` : ""}
    </div>`;
  document.querySelectorAll("[data-opt]").forEach((btn) => {
    btn.addEventListener("click", () => answer(btn.dataset.opt));
  });
  document.getElementById("next-week")?.addEventListener("click", () => {
    state.weekIndex = Math.min(TENDERS.length - 1, state.weekIndex + 1);
    persist(state);
    renderTender();
  });
}

function renderBoard() {
  const holding = state.houses.find((h) => h.owner === state.callsign)?.name ?? "No holding yet";
  const rows = [
    ...CONTRACTORS,
    ...(state.sector ? [{ id: "player", name: state.callsign, sector: state.sector, score: state.score, holding }] : []),
  ].sort((a, b) => b.score - a.score);
  document.getElementById("board-panel").innerHTML = `
    <div class="side-head">
      <p class="kicker cyan">Bid standings</p>
      <h2>Leading contractors</h2>
      <p class="mute" style="margin:.4rem 0 0;font-size:.75rem">Public · Civil Service · Government. Highest score holds the renovation bid.</p>
    </div>
    <div class="side-body">
      ${rows.map((row, i) => `
        <div class="board-row ${row.id === "player" ? "me" : ""}">
          <span class="rank">${i + 1}</span>
          <div class="who"><strong>${row.name}</strong><span>${SECTOR_LABEL[row.sector]} · ${row.holding}</span></div>
          <span class="mono cyan">${row.score}</span>
        </div>`).join("")}
    </div>`;
}

function renderDock() {
  const id = state.selectedId ?? state.hoveredId;
  const house = state.houses.find((h) => h.id === id);
  const dock = document.getElementById("house-dock");
  if (!house) { dock.hidden = true; dock.innerHTML = ""; return; }
  const can = !house.renovated && state.material >= house.cost;
  dock.hidden = false;
  dock.innerHTML = `<div class="panel dock-inner">
    <div style="flex:1;min-width:0">
      <strong>${house.name}</strong>
      <p>${house.renovated ? `Stable · ${house.owner ?? "held"} · ${house.ownerSector ? SECTOR_LABEL[house.ownerSector] : ""}` : house.hint}</p>
    </div>
    ${house.renovated ? "" : `<button type="button" class="reno" id="reno-btn" ${can ? "" : "disabled"}>Renovate · ${house.cost}</button>`}
  </div>`;
  document.getElementById("reno-btn")?.addEventListener("click", () => renovate(house.id));
}

function renderHeader() {
  document.getElementById("stat-material").textContent = String(state.material);
  document.getElementById("stat-integrity").textContent = String(state.integrity);
}

function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { el.hidden = true; }, 2800);
}

function renderAll() {
  renderHeader();
  renderTender();
  renderBoard();
  renderDock();
  engine.sync(syncPayload());
}

function answer(picked) {
  const t = currentTender();
  if (resultFor(t.id)) return;
  const correct = picked === t.correct;
  state.results.push({ tenderId: t.id, picked, correct });
  if (correct) {
    state.material += t.rewardMaterial;
    state.integrity += t.rewardIntegrity;
    state.score += t.rewardMaterial + t.rewardIntegrity;
    showToast(`+${t.rewardMaterial} Material · +${t.rewardIntegrity} Integrity`);
  } else {
    state.integrity = Math.max(0, state.integrity - 20);
    showToast("Integrity flag · rebate path rejected");
  }
  persist(state);
  renderAll();
}

function renovate(houseId) {
  const house = state.houses.find((h) => h.id === houseId);
  if (!house || house.renovated) return;
  if (state.material < house.cost) { showToast(`Need ${house.cost} material points`); return; }
  house.renovated = true;
  house.owner = state.callsign;
  house.ownerSector = state.sector;
  state.material -= house.cost;
  state.integrity += 10;
  state.score += 30;
  state.selectedId = houseId;
  showToast(`${house.name} renovated`);
  persist(state);
  renderAll();
}

document.getElementById("mobile-tabs").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-tab]");
  if (!btn) return;
  const tab = btn.dataset.tab;
  document.querySelectorAll("#mobile-tabs button").forEach((b) => b.classList.toggle("on", b === btn));
  play.classList.toggle("show-tender", tab === "tender");
  play.classList.toggle("show-board", tab === "board");
});
play.classList.add("show-tender");

function tickClock() {
  document.getElementById("reset-clock").textContent = formatRemain(state.resetAt - Date.now());
}
tickClock();
setInterval(tickClock, 1000);

if (state.phase === "play") showPlay();
window.addEventListener("pagehide", () => persist(state));
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") persist(state); });
