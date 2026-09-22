import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const PALETTE = { void: 0x08080c, cyan: 0x00e5ff, green: 0x3dff9a, amber: 0xe07030, crimson: 0xff3b4e };
const DECAY = new THREE.Color(PALETTE.amber);
const CYAN = new THREE.Color(PALETTE.cyan);
const GREEN = new THREE.Color(PALETTE.green);
const CRIMSON = new THREE.Color(PALETTE.crimson);
const GOLD = new THREE.Color(0xc4a35a);
const CHAR = new THREE.Color(0x1a1210);
const COMPOUND = { x: 8.4, z: 6.2 };
const LODGING = { x: -2.6, z: 0.9 };
const NDC = new THREE.Vector2();
const HIT = new THREE.Color();
const SAVE_KEY = "village-grid-save";
const SAVE_VERSION = 5;
const MONTH_MS = (6 * 24 + 14) * 60 * 60 * 1000 + 22 * 60 * 1000;
const SECTOR_LABEL = { public: "Public", civil: "Civil Service", government: "Government" };
const PLAYER_BID_CORRECT = 100;
const PLAYER_BID_WRONG = 30;
const WHISTLE_CORRECT = 100;
const WHISTLE_WRONG = 20;
const SHORT = { "cwa-pump": "CWA", "block-a": "Blk A", "block-b": "Blk B", school: "School", power: "CEB", drain: "Drain", light: "Light", community: "Hall", market: "Mkt", clinic: "Clinic", hall: "Civic", bus: "Bus" };
const WSHORT = { car: "Car", villa: "Villa", boat: "Boat", clothes: "Clothes", entourage: "Entourage" };

const CONTRACTORS = [
  { id: "kuzin", name: "Kuzin", sector: "civil", score: 0, holding: "District Clinic" },
  { id: "cheri", name: "Cheri", sector: "public", score: 0, holding: "Market Shed" },
  { id: "malin", name: "Malin", sector: "government", score: 0, holding: "Civic Hall" },
  { id: "kokin", name: "Kokin", sector: "public", score: 0, holding: "Bus Shelter" },
];

const HOUSES = [
  { id: "cwa-pump", name: "CWA Pump House", hint: "Water Grid Renewal · SPEC-01", variant: "pump", x: 0.2, z: 3.4, cost: 80, renovated: false, owner: null, ownerSector: null },
  { id: "block-a", name: "Terre Rouge Block A", hint: "Cité roofs · SPEC-04", variant: "block", x: -4.2, z: 1.6, cost: 60, renovated: false, owner: null, ownerSector: null },
  { id: "block-b", name: "Terre Rouge Block B", hint: "Cité wiring · SPEC-05", variant: "block", x: 4.3, z: 1.4, cost: 60, renovated: false, owner: null, ownerSector: null },
  { id: "market", name: "Market Shed", hint: "Held by Cheri · Public", variant: "market", x: -3.6, z: -2.1, cost: 50, renovated: true, owner: "Cheri", ownerSector: "public" },
  { id: "clinic", name: "District Clinic", hint: "Held by Kuzin · Civil Service", variant: "clinic", x: 3.9, z: -2.3, cost: 90, renovated: true, owner: "Kuzin", ownerSector: "civil" },
  { id: "school", name: "Primary School", hint: "School works · SPEC-06", variant: "school", x: -1.4, z: -4.8, cost: 70, renovated: false, owner: null, ownerSector: null },
  { id: "hall", name: "Civic Hall", hint: "Held by Malin · Government", variant: "hall", x: 1.9, z: -4.9, cost: 85, renovated: true, owner: "Malin", ownerSector: "government" },
  { id: "bus", name: "Bus Shelter", hint: "Held by Kokin · Public", variant: "bus", x: 5.4, z: 3.2, cost: 40, renovated: true, owner: "Kokin", ownerSector: "public" },
  { id: "power", name: "CEB Substation", hint: "Street lighting feed · SPEC-07", variant: "power", x: -5.6, z: 3.3, cost: 90, renovated: false, owner: null, ownerSector: null },
  { id: "drain", name: "Drainage Node", hint: "Land Drainage Authority · SPEC-08", variant: "drain", x: 0.1, z: 6.0, cost: 50, renovated: false, owner: null, ownerSector: null },
  { id: "light", name: "Street Lighting Mast", hint: "CEB classified road · SPEC-09", variant: "light", x: 6.4, z: -0.4, cost: 40, renovated: false, owner: null, ownerSector: null },
  { id: "community", name: "Community Centre", hint: "Village committee hall · SPEC-10", variant: "community", x: -6.2, z: -0.6, cost: 70, renovated: false, owner: null, ownerSector: null },
];

const TENDERS = [
  { id: "spec-01", houseId: "cwa-pump", spec: "SPEC-01", title: "Water Grid Renewal",
    question: "A subcontractor offers an off-books rebate to expedite materials. Under the transparency framework, how must this be logged?",
    options: [
      { id: "A", text: "Accept it as a CWA facilitation discount and offset it against the Terre Rouge connection fee, keeping the rebate off the tender file." },
      { id: "B", text: "The rebate must not be accepted; it must be fully disclosed and rejected as a compliance violation." },
      { id: "C", text: "Park the sum in a Pamplemousses District Council village-works account and spend it later on informal community improvements." },
      { id: "D", text: "File it as a customary contractor commission under the Public Procurement Act, visible only inside the Ministry of Finance." },
    ],
    correct: "B", npcBids: { kuzin: 82, cheri: 64, malin: 71, kokin: 88 } },
  { id: "spec-04", houseId: "block-a", spec: "SPEC-04", title: "Cité Roof Renewal",
    question: "A supplier offers an uncertified roof membrane at half the schedule if the inspection photo is taken from the courtyard, not the roof. What is the lawful action?",
    options: [
      { id: "A", text: "Accept it for rear blocks only and keep certified stock on the street elevation." },
      { id: "B", text: "File the saving as a CWA waterproofing rebate after the sheets are up." },
      { id: "C", text: "Refuse the membrane, disclose the offer, and keep the specified certified system." },
      { id: "D", text: "Fit the cheap membrane now and replace it after cyclone season." },
    ],
    correct: "C", npcBids: { kuzin: 77, cheri: 85, malin: 58, kokin: 69 } },
  { id: "spec-05", houseId: "block-b", spec: "SPEC-05", title: "Block B Wiring",
    question: "The nominated electrician is booked for three weeks. A cousin offers to energise Block B tonight without a CEB test sheet. How must this be handled?",
    options: [
      { id: "A", text: "Decline. Keep the specified electrician and wait for a signed CEB test sheet." },
      { id: "B", text: "Energise the common stair only and log it as emergency lighting." },
      { id: "C", text: "Let the cousin work if a village committee member watches." },
      { id: "D", text: "Pay a CEB clerk cash to backdate the test sheet." },
    ],
    correct: "A", npcBids: { kuzin: 88, cheri: 61, malin: 74, kokin: 55 } },
  { id: "spec-06", houseId: "school", spec: "SPEC-06", title: "Primary School Works",
    question: "The PTA treasurer offers a cash envelope to skip the fire-certificate wait so classes reopen on Monday. What must you do?",
    options: [
      { id: "A", text: "Take the envelope, reopen, and file the certificate later." },
      { id: "B", text: "Reopen the ground floor only and keep the upper floor locked." },
      { id: "C", text: "Hold the cash in the school safe until the Ministry of Education asks." },
      { id: "D", text: "Refuse the envelope, disclose it, and wait for the lawful fire certificate." },
    ],
    correct: "D", npcBids: { kuzin: 70, cheri: 79, malin: 66, kokin: 84 } },
  { id: "spec-07", houseId: "power", spec: "SPEC-07", title: "CEB Substation",
    question: "Night works can start 48 hours early if you skip the Traffic Management and Road Safety Unit diversion order. What is the lawful action?",
    options: [
      { id: "A", text: "Start at 21:00 and put cones out yourselves." },
      { id: "B", text: "Start on cité lanes only and keep the classified road closed." },
      { id: "C", text: "Do not open the ground until the signed diversion order is on the file." },
      { id: "D", text: "Phone the district councillor and treat a verbal go-ahead as the order." },
    ],
    correct: "C", npcBids: { kuzin: 86, cheri: 52, malin: 73, kokin: 67 } },
  { id: "spec-08", houseId: "drain", spec: "SPEC-08", title: "Monsoon Culverts",
    question: "The contractor proposes using uncertified culvert pipes leftover from a private villa in Grand Baie to beat the monsoon deadline. How must this be handled?",
    options: [
      { id: "A", text: "Approve a variation order and relabel the pipes as National Development Unit emergency stock." },
      { id: "B", text: "Reject the uncertified pipes, disclose the proposal, and keep the specified certified culverts." },
      { id: "C", text: "Use the leftover pipes under the CWA reserve and replace them after cyclone season." },
      { id: "D", text: "Split the lot: certified pipes on the classified road, leftovers inside the cités." },
    ],
    correct: "B", npcBids: { kuzin: 63, cheri: 70, malin: 81, kokin: 76 } },
  { id: "spec-09", houseId: "light", spec: "SPEC-09", title: "CEB Street Lighting",
    question: "A supplier offers unregistered LED fittings at 40% below the approved schedule of rates, cash-in-hand, if the inspection sheet is signed tonight. What is the lawful action?",
    options: [
      { id: "A", text: "Sign the sheet and record the saving later as a CEB energy-efficiency rebate after the poles are up." },
      { id: "B", text: "Accept the fittings on cité side streets only and keep approved stock on the classified road." },
      { id: "C", text: "Hold the cash in the village committee safe until the National Audit Office asks for it." },
      { id: "D", text: "Refuse the fittings, disclose the offer, and keep the approved schedule of rates." },
    ],
    correct: "D", npcBids: { kuzin: 59, cheri: 74, malin: 68, kokin: 87 } },
  { id: "spec-10", houseId: "community", spec: "SPEC-10", title: "Community Centre",
    question: "The committee treasurer asks to split the hall refurbishment into three invoices so each stays under the Public Procurement Act threshold. How must this be logged?",
    options: [
      { id: "A", text: "Keep it as one contract. Do not split works to evade the threshold." },
      { id: "B", text: "Split it and award one invoice to each friendly contractor." },
      { id: "C", text: "Split only the paint and electrical, keep the roof as one lot." },
      { id: "D", text: "Park two invoices in the social-welfare account and one on the hall file." },
    ],
    correct: "A", npcBids: { kuzin: 75, cheri: 88, malin: 80, kokin: 60 } },
];


const WHISTLE_CASES = [
  { id: "car", spec: "CASE-01", title: "Luxury car",
    question: "Ravi works as a dive master on Rs 15,000 a month. This week he parks a brand-new SUV worth several million rupees outside the cité. A cousin says stay silent — “it is family business.” What is the lawful action?",
    options: [
      { id: "A", text: "Stay silent. A dive master can have a rich uncle in Italy and the village should not poke into a man’s garage." },
      { id: "B", text: "File a suspicious-wealth report with the police / ADSU. A Rs 15,000 wage cannot explain a multi-million car. Do not take hush money." },
      { id: "C", text: "Accept Rs 20,000 to “watch the car at night” and keep the registration off any village file." },
      { id: "D", text: "Post the number plate on a rumour page and leave it there. No official report, no file." },
    ],
    correct: "B", npcReports: { kuzin: 78, cheri: 61, malin: 84, kokin: 55 } },
  { id: "villa", spec: "CASE-02", title: "Luxury villa",
    question: "Ravi starts a three-storey villa with imported stone and a pool, still on the same dive-master wage. The mason whispers that the permit is “being arranged.” Do you stay silent?",
    options: [
      { id: "A", text: "Ask for a job on the site and take cash in an envelope at the end of each floor." },
      { id: "B", text: "Stay silent. It is his plot. A man may build as he likes if the neighbours like the look of it." },
      { id: "C", text: "Report the unexplained build. Demand the building-permit file. A Rs 15,000 wage does not fund a villa." },
      { id: "D", text: "Tell the district councillor privately over a drink and treat a nod as the permit." },
    ],
    correct: "C", npcReports: { kuzin: 66, cheri: 80, malin: 72, kokin: 58 } },
  { id: "boat", spec: "CASE-03", title: "Luxury boat",
    question: "A cabin cruiser appears on a trailer behind the villa. No registry number, cash for fuel, night runs toward the reef. Ravi offers you a free fishing trip if you stay silent. What must you do?",
    options: [
      { id: "A", text: "Take the trip, photograph the sunset, and keep the boat off every file." },
      { id: "B", text: "Report the unregistered vessel and the cash fuel pattern. Unexplained marine assets on a dive-master wage are a trafficking flag." },
      { id: "C", text: "Move the trailer behind the market shed so the police patrol does not see it." },
      { id: "D", text: "Stay silent. Boats are a coastal hobby. A dive master is expected to own one." },
    ],
    correct: "B", npcReports: { kuzin: 82, cheri: 54, malin: 69, kokin: 76 } },
  { id: "clothes", spec: "CASE-04", title: "Designer clothes",
    question: "Ravi is suddenly in designer shirts, a gold watch, and shopping bags that cost more than three months of his wage. He laughs and says “clients tip in euros.” A neighbour asks you to stay silent. What is the lawful action?",
    options: [
      { id: "A", text: "Stay silent. Clothes are private. A man may dress as he likes after a good season." },
      { id: "B", text: "Borrow the watch for a wedding and return it without a note on the file." },
      { id: "C", text: "Log the unexplained lifestyle against the declared wage and file it with the same suspicious-wealth report." },
      { id: "D", text: "Ask him to buy a round at the shop and treat that as proof the money is clean." },
    ],
    correct: "C", npcReports: { kuzin: 59, cheri: 73, malin: 81, kokin: 64 } },
  { id: "entourage", spec: "CASE-05", title: "The entourage",
    question: "A rotating group of foreign women now stay at the villa. None have family in Terre Rouge, none show a work permit, and they are never on the daytime bus. Ravi says stay silent or lose the roof over your head. What must you do?",
    options: [
      { id: "A", text: "Stay silent. Guests are private. A dive master may host whoever he likes." },
      { id: "B", text: "Take cash to “look the other way at the gate” and keep the names off every file." },
      { id: "C", text: "Walk into the villa alone at night and order the group to leave, with no police file." },
      { id: "D", text: "Report suspected harbouring and trafficking to the police. Do not stay silent. Do not confront the villa yourself." },
    ],
    correct: "D", npcReports: { kuzin: 70, cheri: 62, malin: 77, kokin: 85 } },
];
function whistleCaseById(id) { return WHISTLE_CASES.find((c) => c.id === id) ?? WHISTLE_CASES[0]; }
function firstOpenWhistleId(results) {
  const done = new Set(results.map((r) => r.caseId));
  return WHISTLE_CASES.find((c) => !done.has(c.id))?.id ?? WHISTLE_CASES[0].id;
}
function whistleOutcomeOf(score, answered) {
  if (answered < WHISTLE_CASES.length) return "open";
  if (score >= 400) return "jail";
  if (score >= 200) return "burn";
  return "exile";
}
function whistleTotal(id, results) { return results.reduce((sum, r) => sum + (r.reports[id] ?? 0), 0); }

function contractorById(id) { return CONTRACTORS.find((c) => c.id === id) ?? CONTRACTORS[0]; }
function tenderForHouse(houseId) { return TENDERS.find((t) => t.houseId === houseId) ?? null; }
function firstOpenHouseId(results) {
  const done = new Set(results.map((r) => r.houseId));
  return TENDERS.find((t) => !done.has(t.houseId))?.houseId ?? TENDERS[0].houseId;
}
function roundOneCleared(results, contractorId) {
  if (!contractorId) return false;
  if (results.length < TENDERS.length) return false;
  const byHouse = new Map(results.map((r) => [r.houseId, r]));
  return TENDERS.every((t) => byHouse.get(t.houseId)?.winnerId === contractorId);
}
function winnerOf(bids) { return Object.entries(bids).sort((a, b) => b[1] - a[1])[0][0]; }
function holdingsLabel(name, houses) {
  const owned = houses.filter((h) => h.owner === name);
  if (owned.length === 0) return "No holding";
  if (owned.length === 1) return owned[0].name;
  return `${owned.length} contracts`;
}

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


    this.competition = "tender";
    this.whistleOutcome = "open";
    this.buildWhistle();

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
    const switched = next.competition !== this.competition;
    this.competition = next.competition || "tender";
    this.whistleOutcome = next.whistleOutcome || "open";
    this.controls.autoRotate = !next.reducedMotion && this.whistleOutcome !== "exile";
    this.rain.visible = !next.reducedMotion;
    if (switched || this.whistleOutcome !== "open") this.frameCompetition();
  }

  frameCompetition() {
    const fog = this.scene.fog;
    if (this.competition !== "whistle") {
      this.camera.position.set(11.2, 7.4, 11.2);
      this.controls.target.set(0, 0.6, 0);
      fog.color.set(PALETTE.void);
      this.scene.background = new THREE.Color(PALETTE.void);
      return;
    }
    if (this.whistleOutcome === "exile") {
      this.camera.position.set(20, 14, 18);
      this.controls.target.set(LODGING.x, 0.2, LODGING.z);
      fog.color.set(PALETTE.crimson);
      this.scene.background = new THREE.Color(0x1a080c);
      return;
    }
    if (this.whistleOutcome === "burn") {
      this.camera.position.set(8.5, 6.2, 9.4);
      this.controls.target.set(LODGING.x, 0.4, LODGING.z);
      fog.color.set(0x2a140c);
      this.scene.background = new THREE.Color(0x140c08);
      return;
    }
    this.camera.position.set(16.4, 8.6, 12.2);
    this.controls.target.set(COMPOUND.x, 0.5, COMPOUND.z);
    if (this.whistleOutcome === "jail") {
      fog.color.set(0x102818);
      this.scene.background = new THREE.Color(0x0c1c14);
    } else {
      fog.color.set(PALETTE.void);
      this.scene.background = new THREE.Color(PALETTE.void);
    }
  }

  paintParts(parts, color, fillOp = 0.22, lineOp = 0.85) {
    for (const m of parts.fills) { m.color.copy(color); m.opacity = fillOp; }
    for (const m of parts.lines) { m.color.copy(color); m.opacity = lineOp; }
  }

  addWBox(group, geos, parts, x, y, z, w, h, d) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const edges = new THREE.EdgesGeometry(geo);
    geos.push(geo, edges);
    const fillMat = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.16, depthWrite: false });
    const lineMat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.8 });
    parts.fills.push(fillMat); parts.lines.push(lineMat);
    const fill = new THREE.Mesh(geo, fillMat); fill.position.set(x, y, z);
    const line = new THREE.LineSegments(edges, lineMat); line.position.set(x, y, z);
    group.add(fill, line);
  }

  addWCyl(group, geos, parts, x, y, z, r, h, seg = 8) {
    const geo = new THREE.CylinderGeometry(r, r, h, seg);
    const edges = new THREE.EdgesGeometry(geo);
    geos.push(geo, edges);
    const fillMat = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.16, depthWrite: false });
    const lineMat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.8 });
    parts.fills.push(fillMat); parts.lines.push(lineMat);
    const fill = new THREE.Mesh(geo, fillMat); fill.position.set(x, y, z);
    const line = new THREE.LineSegments(edges, lineMat); line.position.set(x, y, z);
    group.add(fill, line);
  }

  buildWhistle() {
    this.wGroup = new THREE.Group();
    this.wGeos = [];
    this.villa = { fills: [], lines: [] };
    this.car = { fills: [], lines: [] };
    this.boat = { fills: [], lines: [] };
    this.lodging = { fills: [], lines: [] };
    this.figures = [];
    this.figureHome = [];
    this.addWBox(this.wGroup, this.wGeos, this.villa, COMPOUND.x, 0.85, COMPOUND.z, 3.2, 1.7, 2.2);
    this.addWBox(this.wGroup, this.wGeos, this.villa, COMPOUND.x, 1.85, COMPOUND.z, 3.4, 0.18, 2.4);
    this.addWBox(this.wGroup, this.wGeos, this.villa, COMPOUND.x + 1.1, 0.55, COMPOUND.z + 1.4, 1.2, 1.1, 1.1);
    const cx = COMPOUND.x - 2.6, cz = COMPOUND.z + 0.2;
    this.addWBox(this.wGroup, this.wGeos, this.car, cx, 0.32, cz, 1.8, 0.38, 0.9);
    this.addWBox(this.wGroup, this.wGeos, this.car, cx + 0.1, 0.62, cz, 1.1, 0.32, 0.85);
    this.addWBox(this.wGroup, this.wGeos, this.boat, 6.2, 0.18, 4.7, 2.6, 0.28, 0.7);
    this.addWBox(this.wGroup, this.wGeos, this.boat, 6.0, 0.48, 4.7, 1.2, 0.35, 0.5);
    this.addWBox(this.wGroup, this.wGeos, this.lodging, LODGING.x, 0.55, LODGING.z, 1.5, 1.1, 1.2);
    this.addWBox(this.wGroup, this.wGeos, this.lodging, LODGING.x, 1.2, LODGING.z, 1.7, 0.16, 1.35);
    const spots = [[COMPOUND.x + 2.2, COMPOUND.z + 0.4], [COMPOUND.x + 2.6, COMPOUND.z - 0.3], [COMPOUND.x + 1.8, COMPOUND.z - 0.8], [COMPOUND.x + 2.9, COMPOUND.z + 0.9]];
    for (const [x, z] of spots) {
      const g = new THREE.Group();
      const bodyGeo = new THREE.CapsuleGeometry(0.12, 0.42, 3, 6);
      const headGeo = new THREE.SphereGeometry(0.11, 8, 8);
      this.wGeos.push(bodyGeo, headGeo);
      const mat = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.7, depthWrite: false });
      const headMat = mat.clone();
      const body = new THREE.Mesh(bodyGeo, mat); body.position.y = 0.45;
      const head = new THREE.Mesh(headGeo, headMat); head.position.y = 0.82;
      g.add(body, head);
      g.position.set(x, 0, z);
      g.userData.mats = [mat, headMat];
      this.figures.push(g);
      this.figureHome.push(new THREE.Vector3(x, 0, z));
      this.wGroup.add(g);
    }
    const ringGeo = new THREE.RingGeometry(2.4, 2.55, 40);
    this.wGeos.push(ringGeo);
    this.seize = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }));
    this.seize.rotation.x = -Math.PI / 2;
    this.seize.position.set(COMPOUND.x, 0.04, COMPOUND.z);
    this.seize.visible = false;
    this.wGroup.add(this.seize);
    const count = 140;
    this.firePos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      this.firePos[i * 3] = LODGING.x + (Math.random() - 0.5) * 1.6;
      this.firePos[i * 3 + 1] = Math.random() * 2.2;
      this.firePos[i * 3 + 2] = LODGING.z + (Math.random() - 0.5) * 1.2;
    }
    const fireGeo = new THREE.BufferGeometry();
    fireGeo.setAttribute("position", new THREE.BufferAttribute(this.firePos, 3));
    this.wGeos.push(fireGeo);
    this.fire = new THREE.Points(fireGeo, new THREE.PointsMaterial({ color: 0xff5a2a, size: 0.09, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.wGroup.add(this.fire);
    this.scene.add(this.wGroup);
  }

  tickWhistle(dt, t) {
    const whistle = this.competition === "whistle";
    const outcome = this.whistleOutcome;
    const idle = outcome === "jail" ? GREEN : outcome === "burn" ? new THREE.Color(PALETTE.amber) : outcome === "exile" ? CRIMSON : GOLD;
    this.paintParts(this.villa, outcome === "jail" ? GREEN : outcome === "exile" ? CRIMSON : idle, whistle ? 0.24 : 0.08);
    this.paintParts(this.car, outcome === "jail" ? GREEN : GOLD, whistle ? 0.28 : 0.08);
    this.paintParts(this.boat, outcome === "jail" ? GREEN : CYAN, whistle ? 0.26 : 0.08);
    if (outcome === "burn") this.paintParts(this.lodging, CHAR, 0.45, 0.4);
    else if (outcome === "exile") this.paintParts(this.lodging, CRIMSON, 0.3);
    else this.paintParts(this.lodging, whistle ? CYAN : GOLD, whistle ? 0.2 : 0.07);
    this.seize.visible = outcome === "jail";
    this.seize.rotation.y = t * 0.25;
    const burning = outcome === "burn";
    this.fire.material.opacity = burning ? 0.85 : 0;
    this.fire.visible = burning && !this.reduced;
    if (burning && !this.reduced) {
      for (let i = 0; i < this.firePos.length; i += 3) {
        this.firePos[i + 1] += (1.8 + (i % 5) * 0.15) * dt;
        if (this.firePos[i + 1] > 2.6) {
          this.firePos[i] = LODGING.x + (Math.random() - 0.5) * 1.6;
          this.firePos[i + 1] = 0.1;
          this.firePos[i + 2] = LODGING.z + (Math.random() - 0.5) * 1.2;
        }
      }
      this.fire.geometry.getAttribute("position").needsUpdate = true;
    }
    for (let i = 0; i < this.figures.length; i++) {
      const fig = this.figures[i];
      const home = this.figureHome[i];
      fig.visible = whistle;
      const mats = fig.userData.mats;
      if (outcome === "jail") { for (const m of mats) { m.color.copy(GREEN); m.opacity = 0.15; } }
      else if (outcome === "exile") {
        for (const m of mats) { m.color.copy(CRIMSON); m.opacity = 0.85; }
        const u = Math.min(1, (t % 20) / 8);
        fig.position.x = home.x + (LODGING.x - home.x) * u;
        fig.position.z = home.z + (LODGING.z - home.z) * u;
      } else {
        for (const m of mats) { m.color.copy(GOLD); m.opacity = 0.7; }
        fig.position.x = home.x + Math.sin(t * 0.8 + i) * 0.15;
        fig.position.z = home.z;
      }
    }
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
    this.tickWhistle(dt, t);
    this.renderer.render(this.scene, this.camera);
  };
}

function defaultState() {
  return {
    phase: "boot", contractorId: null, competition: "tender", integrity: 32, results: [],
    houses: HOUSES.map((h) => ({ ...h })),
    contractors: CONTRACTORS.map((c) => ({ ...c })),
    activeHouseId: TENDERS[0].houseId, hoveredId: null, selectedId: null,
    mobileTab: "tender", resetAt: Date.now() + MONTH_MS, toast: null, toastKind: null,
    whistleResults: [], activeCaseId: WHISTLE_CASES[0].id, whistleScore: 0,
    whistleOutcome: "open", showOutcome: false,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultState();
    const data = JSON.parse(raw);
    if (data.version !== SAVE_VERSION) return defaultState();
    return { ...defaultState(), ...data, hoveredId: null, selectedId: null, toast: null };
  } catch {
    return defaultState();
  }
}

function persist(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      version: SAVE_VERSION, phase: state.phase, contractorId: state.contractorId,
      competition: state.competition, integrity: state.integrity, results: state.results, houses: state.houses,
      contractors: state.contractors, activeHouseId: state.activeHouseId, resetAt: state.resetAt,
      whistleResults: state.whistleResults, activeCaseId: state.activeCaseId,
      whistleScore: state.whistleScore, whistleOutcome: state.whistleOutcome,
    }));
  } catch { /* ignore */ }
}

const state = loadState();
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.getElementById("village");
const engine = new VillageEngine(canvas, state.houses, {
  onHover: (id) => { state.hoveredId = id; renderDock(); engine.sync(syncPayload()); },
  onSelect: (id) => {
    state.selectedId = id;
    if (id && tenderForHouse(id) && state.competition === "tender") {
      state.activeHouseId = id;
      state.mobileTab = "tender";
      play.classList.add("show-tender");
      play.classList.remove("show-board");
      document.querySelectorAll("#mobile-tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === "tender"));
      renderCase();
    }
    renderDock();
    engine.sync(syncPayload());
  },
});
function syncPayload() {
  return {
    houses: state.houses, hoveredId: state.hoveredId, selectedId: state.selectedId,
    integrity: state.integrity, reducedMotion: reduced,
    competition: state.competition, whistleOutcome: state.whistleOutcome,
  };
}
engine.sync(syncPayload());

const boot = document.getElementById("boot");
const play = document.getElementById("play");
const enterBtn = document.getElementById("enter-btn");
let pickedId = state.contractorId;

document.querySelectorAll(".class-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    pickedId = btn.dataset.id;
    document.querySelectorAll(".class-btn").forEach((b) => b.classList.toggle("on", b === btn));
    enterBtn.disabled = false;
  });
});
enterBtn.addEventListener("click", () => {
  if (!pickedId) return;
  state.phase = "play";
  state.contractorId = pickedId;
  state.activeHouseId = firstOpenHouseId(state.results);
  persist(state);
  showPlay();
});

document.getElementById("reset-btn").addEventListener("click", () => {
  try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ }
  Object.assign(state, defaultState());
  state.resetAt = Date.now() + MONTH_MS;
  pickedId = null;
  document.querySelectorAll(".class-btn").forEach((b) => b.classList.remove("on"));
  enterBtn.disabled = true;
  boot.hidden = false;
  play.hidden = true;
  engine.sync(syncPayload());
});

function showPlay() {
  boot.hidden = true;
  play.hidden = false;
  renderAll();
}

function resultFor(houseId) { return state.results.find((r) => r.houseId === houseId) ?? null; }

function renderHeader() {
  const you = contractorById(state.contractorId);
  const whistle = state.competition === "whistle";
  document.getElementById("stat-name").textContent = you?.name ?? "—";
  document.getElementById("phase-title").textContent = whistle
    ? "Whistle-blower · unexplained wealth"
    : "Village Infrastructure Overhaul";
  document.getElementById("stat-label").textContent = whistle ? "Whistle score" : "Contracts won";
  const won = state.results.filter((r) => r.winnerId === state.contractorId).length;
  const wscore = whistleTotal(state.contractorId, state.whistleResults);
  const stat = document.getElementById("stat-won");
  stat.textContent = whistle ? `${wscore}/500` : `${won}/${TENDERS.length}`;
  stat.className = whistle ? "mono amber" : "mono green";
  const swept = roundOneCleared(state.results, state.contractorId);
  document.querySelectorAll("#comp-switch button").forEach((b) => {
    b.classList.toggle("on", b.dataset.comp === state.competition);
    if (b.dataset.comp === "whistle") {
      b.classList.toggle("locked", !swept);
      b.title = swept ? "Whistle-blower brief" : "Win every renovation with a correct top-score bid to unlock round 2";
    }
  });
  document.getElementById("tab-case").textContent = whistle ? "Case" : "Tender";
  document.getElementById("tab-board").textContent = whistle ? "File" : "Bids";
  document.querySelectorAll("#mobile-tabs button").forEach((b) => {
    b.classList.toggle("whistle", whistle && b.classList.contains("on"));
  });
  document.getElementById("contractor-chips").innerHTML = `
    <span class="kicker mute">${whistle ? `Cases · ${state.whistleResults.length}/${WHISTLE_CASES.length} filed` : "Active contractors · 4 bidding"}</span>
    ${CONTRACTORS.map((c) => `<span class="chip${c.id === state.contractorId ? " you" : ""}">${c.name}${c.id === state.contractorId ? " · you" : ""}</span>`).join("")}
  `;
}

function renderTender() {
  const tender = tenderForHouse(state.activeHouseId) ?? TENDERS[0];
  const house = state.houses.find((h) => h.id === tender.houseId);
  const result = resultFor(tender.houseId);
  const locked = Boolean(result);
  const remaining = TENDERS.some((t) => !resultFor(t.houseId));
  const bidRows = result
    ? Object.entries(result.bids).sort((a, b) => b[1] - a[1]).map(([id, score], i) => {
        const name = contractorById(id).name;
        const win = id === result.winnerId;
        const me = id === state.contractorId;
        const rejected = me && !win;
        return `<div class="bid-row${win ? " win" : ""}${me ? " me" : ""}${rejected ? " rejected" : ""}"><span class="rank">${i + 1}</span><span class="who">${name}${me ? " · you" : ""}${win ? " · awarded" : ""}${rejected ? " · rejected" : ""}</span><span class="mono">${score}</span></div>`;
      }).join("")
    : "";
  document.getElementById("tender-panel").innerHTML = `
    <div class="side-head" style="display:flex;gap:.75rem;align-items:flex-start">
      <div style="flex:1;min-width:0">
        <p class="kicker cyan">Infrastructure tender · ${tender.spec}</p>
        <h2>${tender.title}</h2>
        <p class="mute" style="margin:.25rem 0 0;font-size:11px">${house?.name ?? ""}</p>
      </div>
      <span class="week">${state.results.length}/${TENDERS.length}</span>
    </div>
    <div class="spec-nav">
      ${TENDERS.map((t) => {
        const done = Boolean(resultFor(t.houseId));
        const on = t.houseId === tender.houseId;
        const won = done && resultFor(t.houseId).winnerId === state.contractorId;
        const rejected = done && !resultFor(t.houseId).winnerId;
        return `<button type="button" data-house="${t.houseId}" class="${on ? "on" : won ? "won" : rejected ? "rejected" : ""}">${SHORT[t.houseId] ?? t.spec}</button>`;
      }).join("")}
    </div>
    <div class="side-body">
      <p class="q">${tender.question}</p>
      <ul class="opts">
        ${tender.options.map((opt) => {
          const picked = result?.picked === opt.id;
          const good = opt.id === tender.correct;
          const cls = picked && result.correct ? "good" : picked && !result.correct ? "bad" : locked && good ? "good" : "";
          return `<li><button type="button" class="opt ${cls}" data-opt="${opt.id}" ${locked ? "disabled" : ""}>
            <span class="letter">${opt.id}</span><span class="txt">${opt.text}</span>
          </button></li>`;
        }).join("")}
      </ul>
    </div>
    <div class="side-foot">
      ${result ? `
        <p class="kicker mute">${result.winnerId ? "Bid awarded · correct top score" : "Bid rejected · need a correct top score"}</p>
        ${bidRows}
        ${remaining ? `<button type="button" class="cta" id="next-week" style="margin-top:.75rem">Next renovation</button>` : (roundOneCleared(state.results, state.contractorId) ? `<button type="button" class="cta" id="open-whistle" style="margin-top:.75rem;background:var(--amber)">Open whistle-blower brief</button>` : `<p style="margin:.5rem 0 0;font-size:.8rem;color:var(--crimson)">No clean sweep. Reset and win every contract to unlock round 2.</p>`)}
      ` : `
        <p class="kicker mute">Award rule</p>
        <p class="green" style="margin:.35rem 0 0;font-size:.8rem">Only a correct top-score bid awards the renovation. Win every contract to unlock round 2.</p>
      `}
    </div>`;
  document.querySelectorAll("[data-house]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeHouseId = btn.dataset.house;
      state.selectedId = btn.dataset.house;
      persist(state);
      renderAll();
    });
  });
  document.querySelectorAll("[data-opt]").forEach((btn) => {
    btn.addEventListener("click", () => answer(btn.dataset.opt));
  });
  document.getElementById("next-week")?.addEventListener("click", () => {
    const remainingNow = TENDERS.some((t) => !resultFor(t.houseId));
    if (!remainingNow) return;
    state.activeHouseId = firstOpenHouseId(state.results);
    state.selectedId = state.activeHouseId;
    persist(state);
    renderAll();
  });
  document.getElementById("open-whistle")?.addEventListener("click", () => {
    if (!roundOneCleared(state.results, state.contractorId)) {
      showToast("Round 2 is locked. Win every renovation with a correct top-score bid first.", "info");
      return;
    }
    state.competition = "whistle";
    state.mobileTab = "tender";
    persist(state);
    renderAll();
  });
}


function whistleResultFor(caseId) { return state.whistleResults.find((r) => r.caseId === caseId) ?? null; }

function renderCase() {
  if (state.competition !== "whistle") return renderTender();
  const item = whistleCaseById(state.activeCaseId);
  const result = whistleResultFor(item.id);
  const locked = Boolean(result);
  const remaining = WHISTLE_CASES.some((c) => !whistleResultFor(c.id));
  const awarded = Boolean(result?.correct);
  const panel = document.getElementById("tender-panel");
  panel.classList.toggle("award", awarded);
  panel.classList.toggle("reject", locked && !awarded);
  const rows = result
    ? Object.entries(result.reports).sort((a, b) => b[1] - a[1]).map(([id, score], i) => {
        const name = contractorById(id).name;
        const me = id === state.contractorId;
        return `<div class="bid-row${i === 0 && me && awarded ? " win" : ""}${me && !awarded ? " rejected" : ""}"><span class="rank">${i + 1}</span><span class="who">${name}${me ? " · you" : ""}</span><span class="mono">${score}</span></div>`;
      }).join("")
    : "";
  panel.innerHTML = `
    <div class="side-head" style="display:flex;gap:.75rem;align-items:flex-start">
      <div style="flex:1;min-width:0">
        <p class="kicker amber">Whistle-blower · ${item.spec}</p>
        <h2>${item.title}</h2>
        <p class="mute" style="margin:.25rem 0 0;font-size:11px">Ravi · Dive master · Rs 15,000 / month</p>
      </div>
      <span class="week">${state.whistleResults.length}/${WHISTLE_CASES.length}</span>
    </div>
    <div class="spec-nav">
      ${WHISTLE_CASES.map((c) => {
        const done = Boolean(whistleResultFor(c.id));
        const on = c.id === item.id;
        const hit = whistleResultFor(c.id);
        const won = done && hit?.correct;
        const lost = done && !hit?.correct;
        return `<button type="button" data-case="${c.id}" class="${on && !done ? "whistle-on" : on ? (won ? "won" : "rejected") : won ? "won" : lost ? "rejected" : ""}">${WSHORT[c.id]}</button>`;
      }).join("")}
    </div>
    <div class="side-body">
      <p class="q">${item.question}</p>
      <ul class="opts">
        ${item.options.map((opt) => {
          const picked = result?.picked === opt.id;
          const good = opt.id === item.correct;
          const cls = picked && result.correct ? "good" : picked && !result.correct ? "bad" : locked && good ? "good" : "";
          return `<li><button type="button" class="opt ${cls}" data-wopt="${opt.id}" ${locked ? "disabled" : ""}>
            <span class="letter">${opt.id}</span><span class="txt">${opt.text}</span>
          </button></li>`;
        }).join("")}
      </ul>
    </div>
    <div class="side-foot">
      ${result ? `
        <p class="kicker ${awarded ? "cyan" : "mute"}">${awarded ? "Report holds · +100" : "Weak file · +20"}</p>
        ${rows}
        ${remaining ? `<button type="button" class="cta" id="next-case" style="margin-top:.75rem;background:var(--amber)">Next case</button>`
          : `<p class="kicker ${state.whistleOutcome === "jail" ? "cyan" : ""}" style="margin:.5rem 0 0">${
              state.whistleOutcome === "jail" ? "Brief complete · trafficker jailed"
              : state.whistleOutcome === "burn" ? "Brief complete · lodging burned"
              : "Brief complete · you are exiled"
            }</p>`}
      ` : `
        <p class="kicker mute">Scoring</p>
        <p style="margin:.35rem 0 0;font-size:.8rem">4–5 correct: Ravi jailed, assets seized. 2–3: he burns your lodging. 0–1: you are chased out of the village.</p>
      `}
    </div>`;
  document.querySelectorAll("[data-case]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeCaseId = btn.dataset.case;
      persist(state);
      renderAll();
    });
  });
  document.querySelectorAll("[data-wopt]").forEach((btn) => {
    btn.addEventListener("click", () => answerWhistle(btn.dataset.wopt));
  });
  document.getElementById("next-case")?.addEventListener("click", () => {
    if (state.whistleOutcome !== "open") return;
    state.activeCaseId = firstOpenWhistleId(state.whistleResults);
    persist(state);
    renderAll();
  });
}

function answerWhistle(picked) {
  if (!state.contractorId) return;
  if (!roundOneCleared(state.results, state.contractorId)) return;
  const item = whistleCaseById(state.activeCaseId);
  if (whistleResultFor(item.id)) return;
  const correct = picked === item.correct;
  const playerScore = correct ? WHISTLE_CORRECT : WHISTLE_WRONG;
  const reports = { ...item.npcReports, [state.contractorId]: playerScore };
  state.whistleResults.push({ caseId: item.id, picked, correct, playerScore, reports });
  state.whistleScore += playerScore;
  state.whistleOutcome = whistleOutcomeOf(state.whistleScore, state.whistleResults.length);
  const finished = state.whistleOutcome !== "open";
  if (finished) {
    state.showOutcome = true;
    showToast(
      state.whistleOutcome === "jail" ? "Top score. Ravi is jailed. Villa, car and boat seized."
      : state.whistleOutcome === "burn" ? "Mid score. Ravi torches your lodging."
      : "Low score. Ravi's crew run you out of the village.",
      state.whistleOutcome
    );
  } else {
    showToast(correct ? "Report filed. Keep going." : "Weak file. That answer will not hold.", correct ? "award" : "reject");
  }
  persist(state);
  renderAll();
  renderOutcome();
}

function renderOutcome() {
  const el = document.getElementById("outcome");
  const card = document.getElementById("outcome-card");
  if (!state.showOutcome || state.whistleOutcome === "open") { el.hidden = true; return; }
  const copy = {
    jail: { kicker: "Top score", title: "Ravi jailed", body: "The file held. Police remand the dive master. Villa, car and boat are seized.", cls: "award" },
    burn: { kicker: "Mid score", title: "Your lodging is burning", body: "The file was too thin. Ravi’s crew torch the lodging you sleep in. The villa still stands.", cls: "burn" },
    exile: { kicker: "Low score", title: "Chased out of the village", body: "You stayed too quiet. Ravi’s crew run you off the Terre Rouge grid.", cls: "reject" },
  }[state.whistleOutcome];
  document.getElementById("outcome-kicker").textContent = copy.kicker;
  document.getElementById("outcome-title").textContent = copy.title;
  document.getElementById("outcome-body").textContent = copy.body;
  document.getElementById("outcome-score").textContent = `Whistle score · ${state.whistleScore}/500`;
  card.className = "panel boot-card " + copy.cls;
  el.hidden = false;
}

function renderBoard() {
  const rows = [...state.contractors]
    .map((row) => ({
      ...row,
      wins: state.results.filter((r) => r.winnerId === row.id).length,
      holding: holdingsLabel(row.name, state.houses),
    }))
    .map((row) => ({ ...row, report: whistleTotal(row.id, state.whistleResults) }))
    .sort((a, b) => state.competition === "whistle" ? b.report - a.report || b.score - a.score : b.score - a.score || b.wins - a.wins);
  document.getElementById("board-panel").innerHTML = `
    <div class="side-head">
      <p class="kicker cyan">${state.competition === "whistle" ? "Report standings" : "Bid standings"}</p>
      <h2>${state.competition === "whistle" ? "Who filed the stronger brief" : "Leading contractors"}</h2>
      <p class="mute" style="margin:.4rem 0 0;font-size:.75rem">${state.competition === "whistle"
        ? `${state.whistleResults.length}/${WHISTLE_CASES.length} cases · ${state.whistleOutcome === "open" ? "file still open" : state.whistleOutcome}`
        : `Only a correct top-score bid awards the renovation. ${state.results.filter((r) => r.winnerId).length}/${TENDERS.length} awarded.`}</p>
    </div>
    <div class="side-body">
      ${rows.map((row, i) => `
        <div class="board-row ${row.id === state.contractorId ? "me" : ""}">
          <span class="rank">${i + 1}</span>
          <div class="who"><strong>${row.name}${row.id === state.contractorId ? " · you" : ""}</strong><span>${SECTOR_LABEL[row.sector]} · ${row.holding}</span></div>
          <span class="mono ${state.competition === "whistle" ? "amber" : "cyan"}">${state.competition === "whistle" ? row.report : row.score}</span>
        </div>`).join("")}
    </div>`;
}

function renderDock() {
  const id = state.selectedId ?? state.hoveredId;
  const house = state.houses.find((h) => h.id === id);
  const dock = document.getElementById("house-dock");
  if (!house) { dock.hidden = true; dock.innerHTML = ""; return; }
  const tender = tenderForHouse(house.id);
  const result = resultFor(house.id);
  const status = result
    ? result.winnerId
      ? `Awarded to ${house.owner}`
      : "Bid rejected · house still decaying"
    : house.renovated
      ? `Held by ${house.owner ?? "contractor"} · ${house.ownerSector ? SECTOR_LABEL[house.ownerSector] : ""}`
      : house.hint;
  dock.hidden = false;
  dock.innerHTML = `<div class="panel dock-inner">
    <div style="flex:1;min-width:0">
      <strong>${house.name}</strong>
      <p>${status}</p>
    </div>
    ${tender ? `<button type="button" class="reno" id="open-spec">${result ? "Bids" : "Open spec"}</button>` : ""}
  </div>`;
  document.getElementById("open-spec")?.addEventListener("click", () => {
    state.activeHouseId = house.id;
    state.selectedId = house.id;
    persist(state);
    renderAll();
  });
}

function showToast(msg, kind) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = "toast" + (kind ? " " + kind : "");
  el.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { el.hidden = true; }, 3200);
}

function renderAll() {
  renderHeader();
  renderCase();
  renderBoard();
  renderDock();
  renderOutcome();
  engine.sync(syncPayload());
}

function answer(picked) {
  if (!state.contractorId) return;
  const tender = tenderForHouse(state.activeHouseId);
  if (!tender || resultFor(tender.houseId)) return;
  const correct = picked === tender.correct;
  const playerScore = correct ? PLAYER_BID_CORRECT : PLAYER_BID_WRONG;
  const bids = { ...tender.npcBids, [state.contractorId]: playerScore };
  const topId = winnerOf(bids);
  const awarded = correct && topId === state.contractorId;
  const winnerId = awarded ? state.contractorId : null;
  const winner = awarded ? contractorById(state.contractorId) : null;
  const house = state.houses.find((h) => h.id === tender.houseId);
  state.results.push({ houseId: tender.houseId, picked, correct, playerScore, bids, winnerId });
  if (awarded && house && winner) {
    house.renovated = true;
    house.owner = winner.name;
    house.ownerSector = winner.sector;
    state.contractors = state.contractors.map((c) => ({
      ...c,
      score: c.id === winnerId ? c.score + 100 : c.score,
      holding: holdingsLabel(c.name, state.houses),
    }));
    state.integrity += 12;
  }
  state.selectedId = tender.houseId;
  showToast(awarded
    ? `${winner.name} takes ${house?.name ?? "the contract"} · bid ${playerScore}`
    : "Bid rejected. Only a correct top score awards the renovation.", awarded ? "award" : "reject");
  persist(state);
  renderAll();
}

document.getElementById("comp-switch").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-comp]");
  if (!btn) return;
  if (btn.dataset.comp === "whistle" && !roundOneCleared(state.results, state.contractorId)) {
    showToast("Round 2 is locked. Win every renovation with a correct top-score bid first.", "info");
    return;
  }
  state.competition = btn.dataset.comp;
  state.mobileTab = "tender";
  play.classList.add("show-tender");
  play.classList.remove("show-board");
  persist(state);
  renderAll();
});
document.getElementById("outcome-dismiss").addEventListener("click", () => {
  state.showOutcome = false;
  document.getElementById("outcome").hidden = true;
});
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

if (!roundOneCleared(state.results, state.contractorId) && state.competition === "whistle") state.competition = "tender";
if (state.phase === "play") showPlay();
window.addEventListener("pagehide", () => persist(state));
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") persist(state); });
