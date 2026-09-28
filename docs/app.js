import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { t as tr, localizeTender, localizeCase, localizeHaven, localizeLand, localizeFair, localizeCrop, localizeWash, houseLabel, houseHint, shortLabel, loadLang, LANG_KEY } from "./i18n.js?v=vg56";
import { HavenScene } from "./haven.js?v=vg48";
import { LandScene } from "./land.js?v=vg61";
import { FairScene } from "./fair.js?v=vg62";
import { CropScene } from "./crop.js?v=vg61";
import { WashScene } from "./wash.js?v=vg61";

let lang = loadLang();
const L = (key, vars) => tr(lang, key, vars);
const ORIENT_KEY = "village-orient";
function readOrient() {
  try {
    const saved = localStorage.getItem(ORIENT_KEY);
    if (saved === "portrait" || saved === "landscape") return saved;
  } catch { /* ignore */ }
  return window.innerHeight > window.innerWidth ? "portrait" : "landscape";
}
let orient = readOrient();
document.documentElement.dataset.orient = orient;

const PALETTE = { void: 0x08080c, cyan: 0x00e5ff, green: 0x3dff9a, amber: 0xe07030, crimson: 0xff3b4e };
const DECAY = new THREE.Color(PALETTE.amber);
const CYAN = new THREE.Color(PALETTE.cyan);
const GREEN = new THREE.Color(PALETTE.green);
const CRIMSON = new THREE.Color(PALETTE.crimson);
const GOLD = new THREE.Color(0xc4a35a);
const CHAR = new THREE.Color(0x1a1210);
const PAPER = new THREE.Color(0xe7eef2);
const PINK = new THREE.Color(0xff4d93);
const BLUSH = new THREE.Color(0xff8ec0);
const SKIN = new THREE.Color(0xf2c7a5);
const HAIR = new THREE.Color(0x3a242c);
const HOUSE = new THREE.Color(0xd4894a);
const POOL = new THREE.Color(0x3ec8ff);
const FLAG_RED = new THREE.Color(0xff3b4e);
const FLAG_BLUE = new THREE.Color(0x2d6bff);
const FLAG_YELLOW = new THREE.Color(0xffd428);
const FLAG_GREEN = new THREE.Color(0x2ee86a);
const FLAG_COLORS = [FLAG_RED, FLAG_BLUE, FLAG_YELLOW, FLAG_GREEN];
const COMPOUND = { x: 8.4, z: 6.2 };
const LODGING = { x: 2.35, z: 8.35 };
const NDC = new THREE.Vector2();
const HIT = new THREE.Color();
const SAVE_KEY = "village-grid-save";
const SAVE_VERSION = 5;
const SECTOR_LABEL = { public: "Public", civil: "Civil Service", government: "Government" };
const PLAYER_BID_CORRECT = 100;
const PLAYER_BID_WRONG = 30;
const WHISTLE_CORRECT = 100;
const WHISTLE_WRONG = 20;
const HAVEN_CORRECT = 100;
const HAVEN_WRONG = 20;
const LAND_CORRECT = 100;
const LAND_WRONG = 20;
const SHORT = { "cwa-pump": "CWA", "block-a": "Blk A", "block-b": "Blk B", school: "School", power: "CEB", drain: "Drain", light: "Light", community: "Hall", market: "Mkt", clinic: "Clinic", hall: "Civic", bus: "Bus" };
const WSHORT = { car: "Car", villa: "Villa", boat: "Boat", clothes: "Clothes", entourage: "Entourage", cash: "Cash" };

const CONTRACTORS = [
  { id: "kuzin", name: "Kuzin", sector: "civil", score: 0, holding: "District Clinic" },
  { id: "cheri", name: "Cheri", sector: "public", score: 0, holding: "Market Shed" },
  { id: "malin", name: "Malin", sector: "government", score: 0, holding: "Civic Hall" },
  { id: "kokin", name: "Kokin", sector: "public", score: 0, holding: "Bus Shelter" },
];

const HOUSES = [
  { id: "cwa-pump", name: "CWA Pump House", hint: "Water Grid Renewal · SPEC-01", variant: "pump", x: 0.2, z: 3.4, cost: 80, renovated: false, owner: null, ownerSector: null },
  { id: "block-a", name: "Village Block A", hint: "Cité roofs · SPEC-04", variant: "block", x: -4.2, z: 1.6, cost: 60, renovated: false, owner: null, ownerSector: null },
  { id: "block-b", name: "Village Block B", hint: "Cité wiring · SPEC-05", variant: "block", x: 4.3, z: 1.4, cost: 60, renovated: false, owner: null, ownerSector: null },
  { id: "market", name: "Market Shed", hint: "Market stalls · SPEC-02", variant: "market", x: -3.6, z: -2.1, cost: 50, renovated: false, owner: null, ownerSector: null },
  { id: "clinic", name: "District Clinic", hint: "Clinic stores · SPEC-03", variant: "clinic", x: 3.9, z: -2.3, cost: 90, renovated: false, owner: null, ownerSector: null },
  { id: "school", name: "Primary School", hint: "School works · SPEC-06", variant: "school", x: -1.4, z: -4.8, cost: 70, renovated: false, owner: null, ownerSector: null },
  { id: "hall", name: "Civic Hall", hint: "Hall hire · SPEC-11", variant: "hall", x: 1.9, z: -4.9, cost: 85, renovated: false, owner: null, ownerSector: null },
  { id: "bus", name: "Bus Shelter", hint: "Shelter panels · SPEC-12", variant: "bus", x: 5.4, z: 3.2, cost: 40, renovated: false, owner: null, ownerSector: null },
  { id: "power", name: "CEB Substation", hint: "Street lighting feed · SPEC-07", variant: "power", x: -5.6, z: 3.3, cost: 90, renovated: false, owner: null, ownerSector: null },
  { id: "drain", name: "Drainage Node", hint: "Land Drainage Authority · SPEC-08", variant: "drain", x: 0.1, z: 6.0, cost: 50, renovated: false, owner: null, ownerSector: null },
  { id: "light", name: "Street Lighting Mast", hint: "CEB classified road · SPEC-09", variant: "light", x: 6.4, z: -0.4, cost: 40, renovated: false, owner: null, ownerSector: null },
  { id: "community", name: "Community Centre", hint: "Village committee hall · SPEC-10", variant: "community", x: -6.2, z: -0.6, cost: 70, renovated: false, owner: null, ownerSector: null },
];

const TENDERS = [
  { id: "spec-01", houseId: "cwa-pump", spec: "SPEC-01", title: "Water Grid Renewal",
    question: "A subcontractor offers an off-books rebate to expedite materials. Under the transparency framework, how must this be logged?",
    options: [
      { id: "A", text: "Accept it as a CWA facilitation discount and offset it against the village connection fee, keeping the rebate off the tender file." },
      { id: "B", text: "The rebate must not be accepted; it must be fully disclosed and rejected as a compliance violation." },
      { id: "C", text: "Park the sum in a Pamplemousses District Council village-works account and spend it later on informal community improvements." },
      { id: "D", text: "File it as a customary contractor commission under the Public Procurement Act, visible only inside the Ministry of Finance." },
    ],
    correct: "B", npcBids: { kuzin: 82, cheri: 64, malin: 71, kokin: 88 } },
  { id: "spec-02", houseId: "market", spec: "SPEC-02", title: "Market Stall Register",
    question: "A stallholder offers a weekly envelope so their pitch stays off the official allocation list. How must this be logged?",
    options: [
      { id: "A", text: "Take the envelope and keep the stall as an informal extension of the market." },
      { id: "B", text: "Refuse the envelope, disclose it, and keep every pitch on the official allocation list." },
      { id: "C", text: "Park the cash in the market committee tea fund and spend it on tarpaulins." },
      { id: "D", text: "Accept it as a CWA connection fee for the stall's water tap." },
    ],
    correct: "B", npcBids: { kuzin: 61, cheri: 86, malin: 72, kokin: 68 } },
  { id: "spec-03", houseId: "clinic", spec: "SPEC-03", title: "Clinic Store Tender",
    question: "A supplier offers expired malaria tests at half price if the batch number is rewritten on the goods-received note. What is the lawful action?",
    options: [
      { id: "A", text: "Rewrite the note and issue the tests to the outpost only." },
      { id: "B", text: "Accept the lot for the storeroom and replace it after cyclone season." },
      { id: "C", text: "Refuse the tests, disclose the offer, and keep the specified in-date stock." },
      { id: "D", text: "File it as a Ministry of Health emergency donation." },
    ],
    correct: "C", npcBids: { kuzin: 87, cheri: 58, malin: 76, kokin: 64 } },
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
  { id: "spec-11", houseId: "hall", spec: "SPEC-11", title: "Civic Hall Hire",
    question: "The hall clerk says weekend hire can skip the receipt if the cash is paid to him after hours. How must this be handled?",
    options: [
      { id: "A", text: "Take the cash and log it as a village-committee donation later." },
      { id: "B", text: "Issue a numbered receipt, bank the hire, and keep the booking on the hall file." },
      { id: "C", text: "Split the cash: half to the clerk, half to the social-welfare account." },
      { id: "D", text: "Allow cash-only hire for residents of the village, receipts for outsiders." },
    ],
    correct: "B", npcBids: { kuzin: 66, cheri: 73, malin: 85, kokin: 54 } },
  { id: "spec-12", houseId: "bus", spec: "SPEC-12", title: "Bus Shelter Panels",
    question: "An advertiser offers to fit the shelter panels for free if the contract is awarded off-tender and the fee is paid in cash. What is the lawful action?",
    options: [
      { id: "A", text: "Accept the free panels and record the cash as a CEB lighting rebate." },
      { id: "B", text: "Award it verbally if the district councillor agrees." },
      { id: "C", text: "Fit the panels now and run a tender after cyclone season." },
      { id: "D", text: "Refuse the off-tender deal, disclose the offer, and keep the advertised procurement." },
    ],
    correct: "D", npcBids: { kuzin: 70, cheri: 62, malin: 79, kokin: 88 } },
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
    question: "A rotating group of foreign women now stay at the villa. None have family in the village, none show a work permit, and they are never on the daytime bus. Ravi says stay silent or lose the roof over your head. What must you do?",
    options: [
      { id: "A", text: "Stay silent. Guests are private. A dive master may host whoever he likes." },
      { id: "B", text: "Take cash to “look the other way at the gate” and keep the names off every file." },
      { id: "C", text: "Walk into the villa alone at night and order the group to leave, with no police file." },
      { id: "D", text: "Report suspected harbouring and trafficking to the police. Do not stay silent. Do not confront the villa yourself." },
    ],
    correct: "D", npcReports: { kuzin: 70, cheri: 62, malin: 77, kokin: 85 } },
  { id: "cash", spec: "CASE-06", title: "Cash gifts",
    question: "Ravi starts paying neighbours’ shop debts and school fees in cash, still on a dive-master wage of Rs 15,000. He calls it charity and asks you not to write it down. What is the lawful action?",
    options: [
      { id: "A", text: "Stay silent. Paying a neighbour’s fee is kindness. A village should not audit a gift." },
      { id: "B", text: "Take a share of the cash for your own fees and leave the rest off the file." },
      { id: "C", text: "File the unexplained cash gifts with the suspicious-wealth report. A Rs 15,000 wage does not fund the lane. Do not take a cut." },
      { id: "D", text: "Thank him in the village group so the gifts look public and the file can close." },
    ],
    correct: "C", npcReports: { kuzin: 74, cheri: 68, malin: 57, kokin: 83 } },
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
function roundTwoCleared(results) {
  return results.length >= WHISTLE_CASES.length && results.every((r) => r.correct);
}
const HAVEN_CASES = [
  { id: "private", spec: "LINE-01", title: "Not a private matter",
    question: "Shouting comes from the house at the end of the lane. A neighbour says it is just between a couple. What does integrity do?",
    options: [
      { id: "A", text: "Tell them to keep it down so the lane can sleep." },
      { id: "B", text: "Walk away. What happens indoors is nobody's business." },
      { id: "C", text: "If someone may be unsafe, it is not a private matter. Do not barge in. Do not film it. Help them reach safety." },
      { id: "D", text: "Record through the curtain and post it so the village shames the house." },
    ], correct: "C" },
  { id: "believe", spec: "LINE-02", title: "Believe them",
    question: "Someone you know says their partner hurt them, then asks you not to make a scene. What is the safe answer?",
    options: [
      { id: "A", text: "Sit both of them down tonight and mediate until there is an apology." },
      { id: "B", text: "Tell them to go back and calm the partner down." },
      { id: "C", text: "Believe them. Do not confront the partner. Help them reach a safe place, and call 139 — free, day and night." },
      { id: "D", text: "Ask what they did to cause it before you take a side." },
    ], correct: "C" },
  { id: "control", spec: "LINE-03", title: "Control counts",
    question: "You see no bruise. The partner holds the money, the phone, and who they are allowed to see. Is this domestic violence?",
    options: [
      { id: "A", text: "No. If there is no mark, there is no violence." },
      { id: "B", text: "Only if they are married." },
      { id: "C", text: "Yes. Control, isolation, threats, and cutting off money are abuse, even with no visible injury." },
      { id: "D", text: "Only once a neighbour has complained in writing." },
    ], correct: "C" },
  { id: "grok", spec: "LINE-04", title: "What AI refuses",
    question: "Someone asks AI to draft a threat to a partner, or to explain how to follow them home. What does AI do?",
    options: [
      { id: "A", text: "Write the threat, but softer, so it sounds like a joke." },
      { id: "B", text: "Refuse. AI will not help anyone harm, threaten, stalk, or control a partner. It will help the person in danger get safe." },
      { id: "C", text: "Give the tracking steps if they say it is for protection." },
      { id: "D", text: "Stay neutral and explain both how to threaten and how to get away." },
    ], correct: "B" },
  { id: "hotline", spec: "LINE-05", title: "Call 139",
    question: "It is late in the village. Someone needs help now and cannot talk safely inside the house. Which line is the free, 24-hour domestic violence hotline in Mauritius?",
    options: [
      { id: "A", text: "Wait for the Saturday market and tell the council." },
      { id: "B", text: "139." },
      { id: "C", text: "Post a message in the village group first." },
      { id: "D", text: "Call only if a bruise will show in a photo." },
    ], correct: "B" },
  { id: "child", spec: "LINE-06", title: "A child is scared",
    question: "A child from the house says they are scared of the shouting and asks you to keep it a secret. What is the safe answer?",
    options: [
      { id: "A", text: "Promise to tell no one, and send the child back inside to see if it has stopped." },
      { id: "B", text: "Ask the child to describe the violence in detail before you decide." },
      { id: "C", text: "A child in danger does not keep that secret. Do not send them back in. Call 113. If an adult is also unsafe, call 139." },
      { id: "D", text: "Wait until a parent invites you in, then mediate between the adults." },
    ], correct: "C" },
];
const HSHORT = { private: "Private", believe: "Believe", control: "Control", grok: "AI", hotline: "139", child: "Child" };
function havenCaseById(id) { return HAVEN_CASES.find((c) => c.id === id) ?? HAVEN_CASES[0]; }
function firstOpenHavenId(results) {
  const done = new Set(results.map((r) => r.caseId));
  return HAVEN_CASES.find((c) => !done.has(c.id))?.id ?? HAVEN_CASES[0].id;
}
function havenOutcomeOf(score, answered) {
  if (answered < HAVEN_CASES.length) return "open";
  if (score >= 400) return "line";
  if (score >= 200) return "lamp";
  return "fog";
}
const LAND_CASES = [
  { id: "shore", spec: "PLOT-01", title: "The closed path", correct: "C",
    question: "A neighbour ropes off the path the village uses to the sea and nails up a board: “Private beach”. He says his campement lease includes the sand. What is the lawful action?",
    options: [
      { id: "A", text: "Leave it. A lease on state land includes the beach in front." },
      { id: "B", text: "Move the rope at night and say nothing." },
      { id: "C", text: "The shore and the public path stay open. A campement lease is not a title to the beach. Ask Housing and Lands and the district council to clear the obstruction." },
      { id: "D", text: "Charge visitors a fee and split it with him." },
    ] },
  { id: "title", spec: "PLOT-02", title: "Sold as freehold", correct: "B",
    question: "An agent offers a beachfront plot “for sale” and says the buyer will own it outright. The plan shows Pas Géométriques. What is the lawful action?",
    options: [
      { id: "A", text: "Take a commission and call it a private freehold." },
      { id: "B", text: "Pas Géométriques are state land. They are not sold as private property. Do not broker the deal. Report the advert to the Ministry of Housing and Lands." },
      { id: "C", text: "Let the highest bidder take it if the village gets a share." },
      { id: "D", text: "Redraw the plan so the plot looks inland and the sale can proceed." },
    ] },
  { id: "split", spec: "PLOT-03", title: "Under the threshold", correct: "C",
    question: "A promoter wants 20 villas on state coastal land. He splits the file into small lots so each stays under the EIA line, and starts selling off-plan before a Building and Land Use Permit. What is the lawful action?",
    options: [
      { id: "A", text: "Split the file. Under 50 units, no EIA is needed, and sales can start now." },
      { id: "B", text: "Cut the trees first so the site looks ready when the permit arrives." },
      { id: "C", text: "One project is one file. No works and no off-plan sale before the EIA and the permit. Do not split the scheme to dodge the study." },
      { id: "D", text: "Ask the council clerk to nod it through after hours." },
    ] },
  { id: "wetland", spec: "PLOT-04", title: "The filled wetland", correct: "C",
    question: "A contractor dumps fill into the wetland behind the lane so a slab can be poured. He calls it landscaping and says the flood drain can be piped later. What is the lawful action?",
    options: [
      { id: "A", text: "Sign it as landscaping. Wetland soil is spare land." },
      { id: "B", text: "Pipe the drain under the fill and keep the wetland off the plan." },
      { id: "C", text: "A wetland and its drain are not spare land. Stop the fill. Report it. A filled wetland sends the flood onto the houses downstream." },
      { id: "D", text: "Fill only the edge, so most of the wetland “remains”." },
    ] },
  { id: "sign", spec: "PLOT-05", title: "The borrowed signature", correct: "B",
    question: "Someone offers to upload plans on the National Electronic Licensing System using a registered architect’s electronic signature. The architect did not draw them. The house is over 150 m². What is the lawful action?",
    options: [
      { id: "A", text: "Use the signature. The platform only checks that a name is on the file." },
      { id: "B", text: "That is a false document. Refuse. Plans of that size must be prepared and signed by the architect who did the work. Report the offer." },
      { id: "C", text: "Pay the architect a small fee after the permit and backdate the drawing." },
      { id: "D", text: "Put your own name down as architect. The council will not check the register." },
    ] },
  { id: "idle", spec: "PLOT-06", title: "Idle allocation", correct: "D",
    question: "A relative was given agricultural land by the state and has left it empty. A developer offers cash to pour a slab, call it a shed, and “convert it later”. What is the lawful action?",
    options: [
      { id: "A", text: "Pour the slab. Conversion can be applied for after the house is up." },
      { id: "B", text: "Leave it idle. Allocated land can sit unused as long as the family likes." },
      { id: "C", text: "Take the cash and keep the file marked as crops." },
      { id: "D", text: "Allocated land is for farming. Idle plots can be taken back. A change of use needs a land-conversion permit before any slab. Do not take the cash." },
    ] },
];
const LSHORT = { shore: "Shore", title: "Title", split: "Split", wetland: "Wetland", sign: "Sign", idle: "Idle" };
function roundThreeCleared(results) {
  return results.length >= HAVEN_CASES.length && results.every((r) => r.correct);
}
function landCaseById(id) { return LAND_CASES.find((c) => c.id === id) ?? LAND_CASES[0]; }
function firstOpenLandId(results) {
  const done = new Set(results.map((r) => r.caseId));
  return LAND_CASES.find((c) => !done.has(c.id))?.id ?? LAND_CASES[0].id;
}
function landOutcomeOf(score, answered) {
  if (answered < LAND_CASES.length) return "open";
  if (score >= 500) return "held";
  if (score >= 280) return "shift";
  return "lost";
}
const FAIR_CORRECT = 100;
const FAIR_WRONG = 20;
const FAIR_CASES = [
  { id: "race", spec: "FAIR-01", title: "The closed counter", correct: "B",
    question: "A shop owner tells you to refuse a customer because of their race. He says the shop is his, and the door is his to close. What is the lawful action?",
    options: [
      { id: "A", text: "Do as he says. A private shop can choose its customers by race." },
      { id: "B", text: "Refuse the order. Race is a protected status under the Equal Opportunities Act. The counter stays open. A written complaint can go to the Equal Opportunities Commission." },
      { id: "C", text: "Serve them at the back door only." },
      { id: "D", text: "Ask them to send someone else from the family." },
    ] },
  { id: "creed", spec: "FAIR-02", title: "The empty desk", correct: "C",
    question: "A school keeps a desk empty because the child follows another creed. A teacher says the child can sit if they hide the sign of their faith. What is the lawful action?",
    options: [
      { id: "A", text: "Keep the desk empty. Creed belongs at home." },
      { id: "B", text: "Tell the child to hide the sign, then let them sit." },
      { id: "C", text: "Creed is protected. The desk stays open. Do not make a child hide their faith. Report the bar to the Equal Opportunities Commission." },
      { id: "D", text: "Move the child to a separate class “for peace”." },
    ] },
  { id: "sex", spec: "FAIR-03", title: "Struck from the list", correct: "A",
    question: "A foreman strikes a qualified woman from the night-shift list. He says the work is not for women, and that she might become pregnant. What is the lawful action?",
    options: [
      { id: "A", text: "Put her back on the list. Sex, pregnancy and family responsibility are protected. Do not pass that instruction on." },
      { id: "B", text: "Offer her a lower-paid day role and call it kindness." },
      { id: "C", text: "Ask her to sign that she will not have children." },
      { id: "D", text: "Leave the list. The foreman knows the work." },
    ] },
  { id: "age", spec: "FAIR-04", title: "Too old for the route", correct: "D",
    question: "A qualified driver of 58 is refused the route. There is no safety rule that sets an age. The note says “too old”. What is the lawful action?",
    options: [
      { id: "A", text: "Agree. After 55 the route is closed." },
      { id: "B", text: "Rewrite her age on the form so the note goes away." },
      { id: "C", text: "Give her a week unpaid, then decide." },
      { id: "D", text: "Age alone is not a reason. Restore her application. Where age is not a real qualification, report it to the Equal Opportunities Commission." },
    ] },
  { id: "colour", spec: "FAIR-05", title: "Moved down the queue", correct: "C",
    question: "A housing clerk moves a file down the queue because of the applicant’s colour. He says it will “keep the peace”. What is the lawful action?",
    options: [
      { id: "A", text: "Leave the file where he put it. The queue is his." },
      { id: "B", text: "Move every file of that colour together and call it order." },
      { id: "C", text: "Colour is protected. Put the file back in its place. Do not stay quiet. Lodge a written complaint with the Equal Opportunities Commission." },
      { id: "D", text: "Tell the applicant to wait a year and apply under another name." },
    ] },
  { id: "notice", spec: "FAIR-06", title: "The barred hall", correct: "B",
    question: "Someone asks you to print a notice that bars a race, a faith, women, or people over a certain age from the village hall. What is the lawful action?",
    options: [
      { id: "A", text: "Print it if the hall committee voted." },
      { id: "B", text: "Refuse. Do not print it and do not help write it. A hall cannot be closed on those grounds. Report the request." },
      { id: "C", text: "Print a softer line that says “preference” instead of “barred”." },
      { id: "D", text: "Put the notice up for one week, then take it down." },
    ] },
];
const FSHORT = { race: "Race", creed: "Creed", sex: "Sex", age: "Age", colour: "Colour", notice: "Notice" };
function roundFourCleared(results) {
  return results.length >= LAND_CASES.length && results.every((r) => r.correct);
}
function fairCaseById(id) { return FAIR_CASES.find((c) => c.id === id) ?? FAIR_CASES[0]; }
function firstOpenFairId(results) {
  const done = new Set(results.map((r) => r.caseId));
  return FAIR_CASES.find((c) => !done.has(c.id))?.id ?? FAIR_CASES[0].id;
}
function fairOutcomeOf(score, answered) {
  if (answered < FAIR_CASES.length) return "open";
  if (score >= 500) return "fair";
  if (score >= 280) return "half";
  return "barred";
}
const CROP_CORRECT = 100;
const CROP_WRONG = 20;
const CROP_CASES = [
  { id: "spray", spec: "CROP-01", title: "The wrong spray", correct: "C",
    question: "A neighbour says the fungicide he uses on tomatoes will do for your lettuce. The label does not list lettuce. What is the lawful action?",
    options: [
      { id: "A", text: "Use it. A fungicide is a fungicide." },
      { id: "B", text: "Use half the dose so the residue stays small." },
      { id: "C", text: "Do not use it. Under the Use of Pesticides Act a pesticide may be used on a crop only if it is the one allowed for that crop. Ask FAREI which product is listed for lettuce." },
      { id: "D", text: "Spray at night so no one sees the label." },
    ] },
  { id: "wait", spec: "CROP-02", title: "The waiting days", correct: "D",
    question: "The lettuce was sprayed this morning. The label says do not harvest for seven days. A buyer is at the gate and will pay cash today. What is the lawful action?",
    options: [
      { id: "A", text: "Cut it. Washing removes the residue." },
      { id: "B", text: "Cut only the outer leaves and sell the heart." },
      { id: "C", text: "Tell the buyer it is organic and take the cash." },
      { id: "D", text: "Wait out the interval on the label. Selling before then is how residue goes over the limit. Do not take the cash today." },
    ] },
  { id: "bottle", spec: "CROP-03", title: "The unmarked bottle", correct: "B",
    question: "A seller offers a cheap pesticide in a soft-drink bottle, with no label and no approval for your crop. He says everyone in the field uses it. What is the lawful action?",
    options: [
      { id: "A", text: "Buy it. A lower price is the same chemical." },
      { id: "B", text: "Refuse it. Do not store it and do not spray it. Use only a labelled product that is allowed on that crop. Report the unmarked bottle to the Pesticides Regulatory Office." },
      { id: "C", text: "Pour it into your own tank and write the crop name on the bottle yourself." },
      { id: "D", text: "Use it once, on a corner of the field, to test it." },
    ] },
  { id: "cans", spec: "CROP-04", title: "The empty cans", correct: "D",
    question: "After spraying, the empty cans are piled by the canal. Someone says to rinse them into the water, or to burn them behind the shed. What is the lawful action?",
    options: [
      { id: "A", text: "Rinse them into the canal. The water will carry it off." },
      { id: "B", text: "Burn them. Ash is cleaner than plastic." },
      { id: "C", text: "Bury them in the bed you will plant next week." },
      { id: "D", text: "Do not pour them into the canal and do not burn them. Triple-rinse into the spray tank, then take the empties to the collection point in the Pesticides Code of Practice. The canal is not a drain for chemicals." },
    ] },
  { id: "mix", spec: "CROP-05", title: "The mix", correct: "C",
    question: "A grower mixes three pesticides so that each one stays under its own limit. He says the law only checks one chemical at a time. What is the lawful action?",
    options: [
      { id: "A", text: "Mix them. If each stays under its limit, the lot is legal." },
      { id: "B", text: "Mix them, then add water until the colour looks light." },
      { id: "C", text: "Do not mix them to dodge the limit. Use only the product allowed for that crop, at the dose on the label. A cocktail is not a way around the Use of Pesticides Act." },
      { id: "D", text: "Mix them on the imported lot only. Local lots must stay single." },
    ] },
  { id: "stall", spec: "CROP-06", title: "The lot already eaten", correct: "C",
    question: "A lot of coriander fails the test: the pesticide was not recommended for that crop. The result is late. The stallholder says sell what is left, because people have already eaten the rest. What is the lawful action?",
    options: [
      { id: "A", text: "Sell the rest. The damage is already done." },
      { id: "B", text: "Move it to another stall and do not mention the test." },
      { id: "C", text: "Do not sell the rest. A failed lot stays off the stall. Keep the spray record and tell the Pesticides Regulatory Office. A late result is not a licence to clear the stock." },
      { id: "D", text: "Sell it cooked. Heat removes the residue." },
    ] },
];
const CSHORT = { spray: "Spray", wait: "Wait", bottle: "Bottle", cans: "Cans", mix: "Mix", stall: "Stall" };
function roundFiveCleared(results) {
  return results.length >= FAIR_CASES.length && results.every((r) => r.correct);
}
function cropCaseById(id) { return CROP_CASES.find((c) => c.id === id) ?? CROP_CASES[0]; }
function firstOpenCropId(results) {
  const done = new Set(results.map((r) => r.caseId));
  return CROP_CASES.find((c) => !done.has(c.id))?.id ?? CROP_CASES[0].id;
}
function cropOutcomeOf(score, answered) {
  if (answered < CROP_CASES.length) return "open";
  if (score >= 500) return "grown";
  if (score >= 280) return "thin";
  return "bare";
}
const WASH_CORRECT = 100;
const WASH_WRONG = 20;
const WASH_CASES = [
  { id: "shelf", spec: "WASH-01", title: "The empty shelf", correct: "C",
    question: "A management company is asked to incorporate a company in a day. It has no staff, no office and no trade. The invoices name goods that never left the port. The owner is a public official from another country, and the fee is large if nobody asks. What is the lawful action?",
    options: [
      { id: "A", text: "File it. A company with no staff is normal." },
      { id: "B", text: "Put your own name as director so the file looks local." },
      { id: "C", text: "A company with no trade and a hidden public official is not a client. Refuse it. File a suspicious transaction report with the FIU. Do not act as nominee." },
      { id: "D", text: "Change the invoices so they name a different port." },
    ] },
  { id: "desk", spec: "WASH-02", title: "The silent desk", correct: "D",
    question: "A private banker is told to receive a large sum from a foreign foundation, then send it the same day to Dubai and a luxury estate agent. The customer will not say where the money came from. What is the lawful action?",
    options: [
      { id: "A", text: "Process it. Speed is a service." },
      { id: "B", text: "Take the fee, then send a note to compliance tomorrow." },
      { id: "C", text: "Split the sum across three accounts so no single transfer looks large." },
      { id: "D", text: "Do not complete the transfer. Hold the funds you can. File a suspicious transaction report. A same-day in-and-out with no source of funds is a wash." },
    ] },
  { id: "deed", spec: "WASH-03", title: "The deed", correct: "C",
    question: "An estate agent is offered cash for a villa in a friend's name, plus a residence permit if the sale completes this week. The buyer has no work here and already owns three empty houses. What is the lawful action?",
    options: [
      { id: "A", text: "Sign. Property is clean once it has a title." },
      { id: "B", text: "Take the cash but write a smaller price on the deed." },
      { id: "C", text: "A title does not clean the money. Refuse the cash sale. Report it. A residence permit is not a wash." },
      { id: "D", text: "Rent the villa to the buyer first so it looks lived in." },
    ] },
  { id: "loop", spec: "WASH-04", title: "The loop", correct: "C",
    question: "A promoter wants a local company to invest in his own group at home. The money left that country last year as a loan to a shell here. Now it comes back as foreign investment, with a claim to pay almost no tax. What is the lawful action?",
    options: [
      { id: "A", text: "Sign the treaty form. The loop is just an efficient structure." },
      { id: "B", text: "Change the loan into a gift so the trail breaks." },
      { id: "C", text: "Money that leaves and comes home as foreign investment is not foreign. Do not certify the treaty claim. Report the loop." },
      { id: "D", text: "Use two extra shells so the path is longer." },
    ] },
  { id: "bid", spec: "WASH-05", title: "The bid", correct: "D",
    question: "A state fuel contract is about to be awarded on an unsolicited offer. A local director is asked to invoice advisory fees to a party close to the award, then move the fee to a watch dealer. What is the lawful action?",
    options: [
      { id: "A", text: "Invoice it as consultancy. Procurement is politics." },
      { id: "B", text: "Wait until the contract is signed, then take the fee." },
      { id: "C", text: "Pay the fee in cash so there is no transfer." },
      { id: "D", text: "A kickback dressed as an advisory fee is still a kickback. Do not invoice. Report it to the Financial Crimes Commission. Public money is not a client account." },
    ] },
  { id: "name", spec: "WASH-06", title: "The name", correct: "C",
    question: "A nominee is asked to sit on five companies. He will never see the books. He is told the owner is a family office. A note on the desk names a person under international sanctions. What is the lawful action?",
    options: [
      { id: "A", text: "Sign. A nominee is not liable if he never reads the file." },
      { id: "B", text: "Sign only four of the five." },
      { id: "C", text: "A nominee who hides a sanctioned owner is part of the wash. Resign. Tell the Financial Services Commission and the Financial Crimes Commission. Do not lend your name." },
      { id: "D", text: "Move the companies to another firm and stay silent." },
    ] },
];
const WASHSHORT = { shelf: "Shelf", desk: "Desk", deed: "Deed", loop: "Loop", bid: "Bid", name: "Name" };
function roundSixCleared(results) {
  return results.length >= CROP_CASES.length && results.every((r) => r.correct);
}
function washCaseById(id) { return WASH_CASES.find((c) => c.id === id) ?? WASH_CASES[0]; }
function firstOpenWashId(results) {
  const done = new Set(results.map((r) => r.caseId));
  return WASH_CASES.find((c) => !done.has(c.id))?.id ?? WASH_CASES[0].id;
}
function washOutcomeOf(score, answered) {
  if (answered < WASH_CASES.length) return "open";
  if (score >= 500) return "clean";
  if (score >= 280) return "thin";
  return "wash";
}
function winnerOf(bids) { return Object.entries(bids).sort((a, b) => b[1] - a[1])[0][0]; }
function holdingsLabel(name, houses) {
  const owned = houses.filter((h) => h.owner === name);
  if (owned.length === 0) return L("noAward");
  if (owned.length === 1) return owned[0].name;
  return L("awardsHeldN", { n: owned.length });
}

const LINE_VERT = `uniform float uTime; uniform float uRenovate; uniform float uSeed;
void main(){ vec3 p=position; float g=1.0-uRenovate; float n=sin(dot(p.xz,vec2(12.1,7.3))+uTime*19.0+uSeed); float spike=step(0.92,n);
p.x+=g*spike*0.14*sin(uTime*47.0); p.y+=g*spike*0.05*sin(uTime*31.0); gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`;
const LINE_FRAG = `uniform float uTime; uniform float uRenovate; uniform vec3 uDecayColor; uniform vec3 uCleanColor;
void main(){ float flicker=1.0-(1.0-uRenovate)*step(0.88,fract(sin(uTime*11.3)*43758.5453))*0.72;
vec3 col=mix(uDecayColor,uCleanColor,uRenovate); gl_FragColor=vec4(col, mix(0.55,1.0,uRenovate)*flicker);}`;
const GRID_VERT = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
const GRID_FRAG = `uniform float uIntegrity; varying vec2 vUv;
void main(){ vec2 p=vUv*2.0-1.0; float dist=length(p);
vec3 soil=vec3(0.34,0.26,0.18); vec3 lawn=vec3(0.29,0.42,0.26);
vec3 col=mix(soil,lawn,clamp(uIntegrity,0.0,1.0));
gl_FragColor=vec4(col, 1.0-smoothstep(0.72,1.0,dist));}`;
const WATER_FRAG = `uniform float uTime; varying vec2 vUv;
void main(){ float w=sin(vUv.x*18.0+uTime*1.2)*0.5+0.5;
vec3 col=mix(vec3(0.45,0.66,0.7),vec3(0.82,0.9,0.9),w*0.45);
gl_FragColor=vec4(col,0.9);}`;

function hashId(id) { let h = 7; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0; return Math.abs(h); }

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

function addBox(group, geos, lineMat, fillMat, x, y, z, w, h, d, material) {
  const geo = new THREE.BoxGeometry(w, h, d);
  geos.push(geo);
  const fill = new THREE.Mesh(geo, material || fillMat);
  fill.position.set(x, y, z);
  fill.castShadow = true;
  fill.receiveShadow = true;
  group.add(fill);
  return fill;
}
function addCyl(group, geos, lineMat, fillMat, x, y, z, r, h, seg = 6) {
  const geo = new THREE.CylinderGeometry(r, r, h, seg);
  geos.push(geo);
  const fill = new THREE.Mesh(geo, fillMat);
  fill.position.set(x, y, z);
  fill.castShadow = true;
  fill.receiveShadow = true;
  group.add(fill);
}
function addCone(group, geos, lineMat, fillMat, x, y, z, r, h, rotY = 0) {
  const geo = new THREE.ConeGeometry(r, h, 4);
  geos.push(geo);
  const fill = new THREE.Mesh(geo, fillMat);
  fill.position.set(x, y, z);
  fill.rotation.y = rotY;
  fill.castShadow = true;
  group.add(fill);
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
    case "clinic": {
      addBox(group, geos, lineMat, fillMat, 0, 0.65, 0, 2.3, 1.3, 1.45);
      addBox(group, geos, lineMat, fillMat, 0, 1.38, 0, 2.4, 0.18, 1.55);
      const cross = new THREE.MeshStandardMaterial({ color: 0xc4312e, roughness: 0.4, metalness: 0.08, emissive: 0x8a1a16, emissiveIntensity: 0.45 });
      addBox(group, geos, lineMat, fillMat, 0, 1.92, 0, 0.16, 0.72, 0.16, cross);
      addBox(group, geos, lineMat, fillMat, 0, 1.98, 0, 0.62, 0.16, 0.16, cross);
      return { w: 2.6, h: 2.3, d: 1.8 };
    }
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
  const fillMat = new THREE.MeshStandardMaterial({ color: 0x6e6256, roughness: 0.78, metalness: 0.06 });
  const lineMat = fillMat;
  const geos = [];
  const size = buildVariant(house.variant, group, geos, lineMat, fillMat);

  const sweepGeo = new THREE.BoxGeometry(size.w * 1.02, 0.045, size.d * 1.02);
  geos.push(sweepGeo);
  const sweep = new THREE.Mesh(sweepGeo, new THREE.MeshStandardMaterial({ color: 0xf4f5f3, emissive: 0xd5d6d2, emissiveIntensity: 0.4, transparent: true, opacity: 0, roughness: 0.3 }));
  sweep.visible = false;
  group.add(sweep);

  const nodeGeo = new THREE.SphereGeometry(0.08, 10, 8);
  geos.push(nodeGeo);
  const node = new THREE.Mesh(nodeGeo, new THREE.MeshStandardMaterial({ color: 0x7ec8ff, emissive: 0x7ec8ff, emissiveIntensity: 0.7, roughness: 0.35, transparent: true, opacity: 0.9 }));
  node.position.y = size.h + 0.28;
  group.add(node);

  const ringGeo = new THREE.RingGeometry(size.w * 0.5, size.w * 0.5 + 0.05, 32);
  geos.push(ringGeo);
  const ring = new THREE.Mesh(ringGeo, new THREE.MeshStandardMaterial({ color: 0xd5d6d2, emissive: 0x9aa8a0, emissiveIntensity: 0.2, transparent: true, opacity: 0, roughness: 0.4, side: THREE.DoubleSide }));
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
    this.renderer.setClearColor(0x8ea4b8, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x8ea4b8, 28, 58);
    this.scene.background = new THREE.Color(0x8ea4b8);
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
    this.holdOrbit = false;
    this.controls.addEventListener("start", () => {
      this.holdOrbit = true;
      this.controls.autoRotate = false;
    });

    this.scene.add(new THREE.AmbientLight(0xc5d0dc, 0.45));
    this.scene.add(new THREE.HemisphereLight(0xd5e4f2, 0x5a4328, 0.7));
    const key = new THREE.DirectionalLight(0xfff3df, 1.55);
    key.position.set(8, 14, 6);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xb7c6de, 0.4);
    fill.position.set(-10, 6, -6);
    this.scene.add(fill);

    this.gridMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uIntegrity: { value: 0.32 } }, vertexShader: GRID_VERT, fragmentShader: GRID_FRAG });
    this.village = new THREE.Group();
    const ground = new THREE.Mesh(new THREE.CircleGeometry(16, 64), this.gridMat);
    ground.rotation.x = -Math.PI / 2;
    this.ground = ground;
    this.village.add(ground);

    this.waterMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uTime: { value: 0 } }, vertexShader: GRID_VERT, fragmentShader: WATER_FRAG });
    const canal = new THREE.Mesh(new THREE.PlaneGeometry(22, 1.15), this.waterMat);
    canal.rotation.x = -Math.PI / 2;
    canal.position.set(0, 0.02, 4.7);
    this.canal = canal;
    this.village.add(canal);

    const plaza = new THREE.Mesh(new THREE.RingGeometry(1.55, 1.78, 48), new THREE.MeshStandardMaterial({ color: 0xd5d6d2, roughness: 0.7, metalness: 0.04 }));
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.y = 0.04;
    this.plazaRing = plaza;
    this.village.add(plaza);
    this.buildRoad();
    this.bus = this.buildBus();
    this.village.add(this.bus.root);

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

    for (const house of houses) {
      const visual = makeHouse(house);
      this.visuals.set(house.id, visual);
      this.village.add(visual.group);
      this.hits.push(visual.hit);
    }
    this.scene.add(this.village);


    this.competition = "tender";
    this.whistleOutcome = "open";
    this.buildWhistle();
    this.haven = new HavenScene(this.scene);
    this.land = new LandScene(this.scene);
    this.fair = new FairScene(this.scene);
    this.crop = new CropScene(this.scene);
    this.wash = new WashScene(this.scene);
    this.havenOutcome = "open";
    this.havenCorrect = 0;
    this.landOutcome = "open";
    this.landCorrect = 0;

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
    this.whistleCorrect = next.whistleCorrect || 0;
    this.havenOutcome = next.havenOutcome || "open";
    this.havenCorrect = next.havenCorrect || 0;
    this.landOutcome = next.landOutcome || "open";
    this.landCorrect = next.landCorrect || 0;
    this.fairOutcome = next.fairOutcome || "open";
    this.fairCorrect = next.fairCorrect || 0;
    this.cropOutcome = next.cropOutcome || "open";
    this.cropCorrect = next.cropCorrect || 0;
    this.washOutcome = next.washOutcome || "open";
    this.washCorrect = next.washCorrect || 0;
    this.fairHeld = next.fairHeld || [];
    this.haven.sync(this.competition, this.havenOutcome, this.havenCorrect);
    this.land.sync(this.competition, this.landOutcome, this.landCorrect);
    this.fair.sync(this.competition, this.fairOutcome, this.fairCorrect, this.fairHeld);
    this.crop.sync(this.competition, this.cropOutcome, this.cropCorrect);
    this.wash.sync(this.competition, this.washOutcome, this.washCorrect);
    const solo = this.competition !== "tender";
    if (this.village) this.village.visible = !solo;
    if (this.wGroup) this.wGroup.visible = this.competition === "whistle";
    const mobile = this.canvas.clientWidth < 900 || this.canvas.clientHeight > this.canvas.clientWidth || document.documentElement.dataset.orient === "portrait";
    this.controls.autoRotate = !mobile && !this.holdOrbit && !next.reducedMotion && this.competition !== "haven" && !solo && this.whistleOutcome !== "exile";
    this.rain.visible = !next.reducedMotion && this.competition === "tender";
    if (switched) this.holdOrbit = false;
    if (switched || this.whistleOutcome !== "open" || this.havenOutcome !== "open") this.frameCompetition();
  }

  openBand() {
    const canvas = this.canvas.getBoundingClientRect();
    let left = canvas.left, top = canvas.top, right = canvas.right, bottom = canvas.bottom;
    const cut = (el) => {
      if (!el || el.hidden) return;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") return;
      const r = el.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) return;
      if (r.width > canvas.width * 0.6 && r.top > canvas.top + canvas.height * 0.22) bottom = Math.min(bottom, r.top);
      else if (r.height > canvas.height * 0.3 && r.left > canvas.left + canvas.width * 0.35) right = Math.min(right, r.left);
      else if (r.height > canvas.height * 0.3 && r.right < canvas.left + canvas.width * 0.65) left = Math.max(left, r.right);
      else if (r.width > canvas.width * 0.55 && r.bottom < canvas.top + canvas.height * 0.45) top = Math.max(top, r.bottom);
    };
    cut(document.querySelector(".side.left"));
    cut(document.querySelector(".side.right"));
    cut(document.querySelector(".header"));
    cut(document.getElementById("mobile-sheet-foot"));
    if (right - left < 80) { left = canvas.left; right = canvas.right; }
    if (bottom - top < 72) { top = canvas.top; bottom = canvas.bottom; }
    return { left: left - canvas.left, top: top - canvas.top, right: right - canvas.left, bottom: bottom - canvas.top, w: Math.max(1, canvas.width), h: Math.max(1, canvas.height) };
  }

  aimStage(focus, view, radius) {
    const mobile = this.canvas.clientWidth < 900 || this.canvas.clientHeight > this.canvas.clientWidth || document.documentElement.dataset.orient === "portrait";
    if (this.holdOrbit && mobile) return;
    const band = this.openBand();
    const fracW = Math.max(0.35, (band.right - band.left) / band.w);
    const fracH = Math.max(0.28, (band.bottom - band.top) / band.h);
    const ndcX = ((band.left + band.right) / 2 / band.w) * 2 - 1;
    const ndcY = -(((band.top + band.bottom) / 2 / band.h) * 2 - 1);
    const fov = band.h / band.w >= 1.05 ? 50 : 46;
    const vFov = (fov * Math.PI) / 180;
    const aspect = band.w / band.h;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const dist = Math.max(radius / Math.tan((vFov * fracH * 0.62) / 2), radius / Math.tan((hFov * fracW * 0.7) / 2), 7);
    const dir = view.clone().normalize();
    const pos = focus.clone().addScaledVector(dir, dist);
    pos.y += dist * 0.05;
    const target = focus.clone();
    this.camera.fov = fov;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    for (let i = 0; i < 12; i++) {
      this.camera.position.copy(pos);
      this.camera.up.set(0, 1, 0);
      this.camera.lookAt(target);
      this.camera.updateMatrixWorld();
      const p = focus.clone().project(this.camera);
      const ex = ndcX - p.x, ey = ndcY - p.y;
      if (Math.hypot(ex, ey) < 0.02) break;
      const forward = target.clone().sub(this.camera.position).normalize();
      const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
      const up = new THREE.Vector3().crossVectors(right, forward).normalize();
      const reach = this.camera.position.distanceTo(target) * Math.tan(vFov / 2);
      target.addScaledVector(right, -ex * reach * aspect);
      target.addScaledVector(up, -ey * reach);
    }
    this.controls.target.copy(target);
    this.controls.minDistance = Math.max(5, dist * 0.55);
    this.controls.maxDistance = dist * 1.85;
    this.camera.updateProjectionMatrix();
    this.controls.update();
    if (!mobile) {
      this.controls.minAzimuthAngle = -Infinity;
      this.controls.maxAzimuthAngle = Infinity;
      this.controls.minPolarAngle = 0.55;
      this.controls.maxPolarAngle = 1.2;
      return;
    }
    this.controls.autoRotate = false;
    const az = this.controls.getAzimuthalAngle();
    this.controls.minAzimuthAngle = az - Math.PI / 2;
    this.controls.maxAzimuthAngle = az + Math.PI / 2;
    this.controls.minPolarAngle = 0.2;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
  }

  frameCompetition() {
    const fog = this.scene.fog;
    if (this.competition === "wash") {
      fog.color.set(0x8ea4b8);
      this.scene.background = new THREE.Color(0x8ea4b8);
      this.aimStage(new THREE.Vector3(0, 1.45, 1.1), new THREE.Vector3(0.4, 5.6, 13.2), 5.2);
      return;
    }
    if (this.competition === "crop") {
      fog.color.set(0x8ea4b8);
      this.scene.background = new THREE.Color(0x8ea4b8);
      this.aimStage(new THREE.Vector3(0, 0.8, 0), new THREE.Vector3(0.4, 4.6, 11), 2.2);
      return;
    }
    if (this.competition === "fair") {
      fog.color.set(0x8ea4b8);
      this.scene.background = new THREE.Color(0x8ea4b8);
      this.aimStage(new THREE.Vector3(0, 1.2, 0), new THREE.Vector3(0.4, 5.3, 10.4), 3.6);
      return;
    }
    if (this.competition === "land") {
      fog.color.set(0x9aa8b0);
      this.scene.background = new THREE.Color(0x9aa8b0);
      this.aimStage(new THREE.Vector3(0.8, 1.2, 2.2), new THREE.Vector3(0, 4, 12.2), 4.4);
      return;
    }
    if (this.competition === "haven") {
      fog.color.set(0x8ea4b8);
      this.scene.background = new THREE.Color(0x8ea4b8);
      this.aimStage(new THREE.Vector3(0, 1.1, -0.2), new THREE.Vector3(0.2, 3.6, 8.2), 4.4);
      return;
    }
    if (this.competition !== "whistle") {
      fog.color.set(0x8ea4b8);
      this.scene.background = new THREE.Color(0x8ea4b8);
      this.aimStage(new THREE.Vector3(0, 1.2, 0), new THREE.Vector3(11.2, 6.8, 11.2), 5.2);
      return;
    }
    if (this.whistleOutcome === "exile") {
      fog.color.set(0x8a6e74);
      this.scene.background = new THREE.Color(0x8a6e74);
    } else if (this.whistleOutcome === "burn") {
      fog.color.set(0x8a7564);
      this.scene.background = new THREE.Color(0x8a7564);
    } else if (this.whistleOutcome === "jail") {
      fog.color.set(0x7f9488);
      this.scene.background = new THREE.Color(0x7f9488);
    } else {
      fog.color.set(0x8ea4b8);
      this.scene.background = new THREE.Color(0x8ea4b8);
    }
    this.aimStage(new THREE.Vector3(5.2, 1.8, 6), new THREE.Vector3(9, 7, 11), 4.2);
  }

  paintParts(parts, color, fillOp = 0.22, lineOp = 0.85) {
    const solid = fillOp >= 0.2;
    for (const m of parts.fills) {
      m.color.copy(color);
      m.opacity = solid ? 1 : fillOp;
      m.transparent = !solid;
      m.depthWrite = solid;
    }
    for (const m of parts.lines) {
      m.color.set(0x1a1c1f);
      m.opacity = solid ? Math.min(0.35, lineOp) : 0;
    }
  }

  addWBox(group, geos, parts, x, y, z, w, h, d, opts = {}) {
    const geo = new THREE.BoxGeometry(w, h, d);
    geos.push(geo);
    const fillMat = new THREE.MeshStandardMaterial({
      color: opts.color ?? 0xd5d6d2, roughness: 0.5, metalness: 0.12,
      transparent: true, opacity: opts.fill ?? 0.9, depthWrite: opts.depth ?? true,
    });
    parts.fills.push(fillMat);
    const fill = new THREE.Mesh(geo, fillMat); fill.position.set(x, y, z);
    fill.castShadow = true;
    fill.receiveShadow = true;
    group.add(fill);
  }

  addWCyl(group, geos, parts, x, y, z, r, h, seg = 8, opts = {}) {
    const geo = new THREE.CylinderGeometry(r, r, h, seg);
    geos.push(geo);
    const fillMat = new THREE.MeshStandardMaterial({
      color: opts.color ?? 0xd5d6d2, roughness: 0.5, metalness: 0.12,
      transparent: true, opacity: opts.fill ?? 0.9, depthWrite: opts.depth ?? true,
    });
    parts.fills.push(fillMat);
    const fill = new THREE.Mesh(geo, fillMat); fill.position.set(x, y, z);
    fill.castShadow = true;
    group.add(fill);
  }

  addLady(x, z, scale, dressHex) {
    const g = new THREE.Group();
    const skin = new THREE.MeshStandardMaterial({ color: 0xd7b39a, roughness: 0.72, transparent: true, opacity: 1 });
    const hair = new THREE.MeshStandardMaterial({ color: dressHex === 0xc9a24a ? 0x3a2418 : 0x1a1214, roughness: 0.55, transparent: true, opacity: 1 });
    const dress = new THREE.MeshStandardMaterial({ color: dressHex, roughness: 0.42, metalness: 0.06, transparent: true, opacity: 1 });
    const heel = new THREE.MeshStandardMaterial({ color: 0x1a1c1f, roughness: 0.35, metalness: 0.2, transparent: true, opacity: 1 });
    const put = (geo, material, px, y, pz) => {
      this.wGeos.push(geo);
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.set(px, y, pz);
      mesh.castShadow = true;
      g.add(mesh);
      return mesh;
    };
    const s = scale;
    put(new THREE.BoxGeometry(0.07 * s, 0.08 * s, 0.11 * s), heel, -0.07 * s, 0.04 * s, 0.01 * s);
    put(new THREE.BoxGeometry(0.07 * s, 0.08 * s, 0.11 * s), heel, 0.07 * s, 0.04 * s, 0.01 * s);
    const skirt = put(new THREE.ConeGeometry(0.22 * s, 0.48 * s, 12), dress, 0, 0.32 * s, 0);
    skirt.geometry.rotateX(0);
    put(new THREE.BoxGeometry(0.16 * s, 0.22 * s, 0.12 * s), dress, 0, 0.58 * s, 0);
    put(new THREE.CapsuleGeometry(0.035 * s, 0.16 * s, 3, 6), skin, -0.12 * s, 0.58 * s, 0);
    put(new THREE.CapsuleGeometry(0.035 * s, 0.16 * s, 3, 6), skin, 0.12 * s, 0.58 * s, 0);
    put(new THREE.SphereGeometry(0.09 * s, 12, 10), skin, 0, 0.78 * s, 0);
    put(new THREE.SphereGeometry(0.1 * s, 12, 8), hair, 0, 0.84 * s, -0.02 * s);
    put(new THREE.BoxGeometry(0.08 * s, 0.1 * s, 0.06 * s), hair, 0.02 * s, 0.7 * s, -0.06 * s);
    put(new THREE.TorusGeometry(0.045 * s, 0.008 * s, 6, 10), dress, 0, 0.7 * s, 0.07 * s);
    g.position.set(x, 0, z);
    g.rotation.y = 0.5;
    g.userData.mats = [dress, skin, hair, heel];
    g.userData.homeColors = [dress.color.clone(), skin.color.clone(), hair.color.clone(), heel.color.clone()];
    this.wGroup.add(g);
    return g;
  }

  addWhistleblower(x, z, scale) {
    const g = new THREE.Group();
    const shell = new THREE.MeshStandardMaterial({ color: 0xd5d6d2, roughness: 0.4, metalness: 0.08, transparent: true });
    const bands = [FLAG_RED, FLAG_BLUE, FLAG_YELLOW, FLAG_GREEN].map((color) => new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.1, emissive: color, emissiveIntensity: 0.15, transparent: true }));
    const put = (geo, material, y) => {
      this.wGeos.push(geo);
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.y = y;
      g.add(mesh);
    };
    put(new THREE.CapsuleGeometry(0.07 * scale, 0.24 * scale, 3, 6), shell, 0.22 * scale);
    put(new THREE.CapsuleGeometry(0.12 * scale, 0.22 * scale, 4, 8), shell, 0.52 * scale);
    put(new THREE.SphereGeometry(0.1 * scale, 12, 10), shell, 0.82 * scale);
    bands.forEach((mat, i) => {
      const geo = new THREE.BoxGeometry(0.16 * scale, 0.035 * scale, 0.02 * scale);
      this.wGeos.push(geo);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, (0.48 - i * 0.04) * scale, 0.12 * scale);
      g.add(mesh);
    });
    g.position.set(x, 0, z);
    g.userData.mats = [shell, ...bands];
    g.userData.flagColors = [new THREE.Color(0xd5d6d2), ...FLAG_COLORS.map((c) => c.clone())];
    this.wGroup.add(g);
    return g;
  }

  buildRoad() {
    const road = new THREE.Mesh(
      new THREE.BoxGeometry(16.5, 0.04, 1.35),
      new THREE.MeshStandardMaterial({ color: 0x3a3d42, roughness: 0.92 })
    );
    road.position.set(0, 0.03, 4.05);
    road.receiveShadow = true;
    this.village.add(road);
    const paint = new THREE.MeshStandardMaterial({ color: 0xf4f1ea, roughness: 0.6 });
    for (let i = -6; i <= 6; i++) {
      const dash = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.02, 0.06), paint);
      dash.position.set(i * 1.15, 0.06, 4.05);
      this.village.add(dash);
    }
  }

  buildBus() {
    const root = new THREE.Group();
    const band = (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.48, metalness: 0.08 });
    const put = (geo, material, x, y, z) => {
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      root.add(mesh);
      return mesh;
    };
    const colors = [0xea2839, 0x1a206d, 0xffd500, 0x00a551];
    colors.forEach((color, i) => {
      put(new THREE.BoxGeometry(0.55, 0.72, 1.15), band(color), 0, 0.62, -1.7 + i * 1.15);
    });
    put(new THREE.BoxGeometry(1.15, 0.42, 1.15), band(0xea2839), 0, 0.95, 1.72);
    put(new THREE.BoxGeometry(1.05, 0.08, 4.7), band(0x1a1c1f), 0, 1.18, 0);
    put(new THREE.BoxGeometry(0.92, 0.28, 3.3), new THREE.MeshStandardMaterial({ color: 0x142028, roughness: 0.25, metalness: 0.35, emissive: 0x1c3040, emissiveIntensity: 0.25 }), 0, 0.95, -0.15);
    const wheels = [];
    [-1.55, 1.45].forEach((z) => {
      [-0.48, 0.48].forEach((x) => {
        const wheel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.22, 0.22, 0.12, 10),
          new THREE.MeshStandardMaterial({ color: 0x1a1c1f, roughness: 0.7 })
        );
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x, 0.22, z);
        root.add(wheel);
        wheels.push(wheel);
      });
    });
    root.position.set(5.4, 0, 4.05);
    return { root, wheels, dir: 1 };
  }

  tickBus(t) {
    if (!this.bus) return;
    const show = this.competition === "tender";
    this.bus.root.visible = show;
    if (!show) return;
    if (this.reduced) {
      this.bus.root.position.set(5.4, 0, 4.05);
      this.bus.root.rotation.y = -Math.PI / 2;
      return;
    }
    const legs = [
      { from: -7.2, to: 5.4, dur: 5.4 },
      { from: 5.4, to: 5.4, dur: 2.2 },
      { from: 5.4, to: 7.5, dur: 1.15 },
      { from: 7.5, to: 5.4, dur: 1.15 },
      { from: 5.4, to: 5.4, dur: 2.2 },
      { from: 5.4, to: -7.2, dur: 5.4 },
      { from: -7.2, to: -7.2, dur: 0.7 },
    ];
    const total = legs.reduce((sum, leg) => sum + leg.dur, 0);
    let u = ((t % total) + total) % total;
    let x = 5.4;
    let dir = this.bus.dir;
    let moving = false;
    for (const leg of legs) {
      if (u <= leg.dur) {
        const k = leg.dur === 0 ? 1 : u / leg.dur;
        const e = k * k * (3 - 2 * k);
        x = leg.from + (leg.to - leg.from) * e;
        if (leg.to !== leg.from) dir = leg.to > leg.from ? 1 : -1;
        moving = leg.to !== leg.from;
        break;
      }
      u -= leg.dur;
    }
    this.bus.dir = dir;
    this.bus.root.position.set(x, 0, 4.05);
    this.bus.root.rotation.y = dir > 0 ? -Math.PI / 2 : Math.PI / 2;
    if (moving) {
      this.bus.wheels.forEach((wheel) => { wheel.rotation.x += dir * 0.35; });
    }
  }

  buildWhistle() {
    this.wGroup = new THREE.Group();
    this.wGeos = [];
    this.villa = { fills: [], lines: [] };
    this.car = { fills: [], lines: [] };
    this.boat = { fills: [], lines: [] };
    this.lodging = { fills: [], lines: [] };
    this.pool = { fills: [], lines: [] };
    this.floors = [{ fills: [], lines: [] }, { fills: [], lines: [] }, { fills: [], lines: [] }];
    this.lodgeSteps = [];
    this.figures = [];
    this.figureHome = [];
    const x = COMPOUND.x, z = COMPOUND.z;
    const solid = { fill: 0.34, depth: true };
    const f0 = this.floors[0], f1 = this.floors[1], f2 = this.floors[2];
    this.addWBox(this.wGroup, this.wGeos, f0, x, 0.62, z, 3.3, 1.24, 2.35, solid);
    this.addWBox(this.wGroup, this.wGeos, f1, x, 1.78, z, 3.15, 1.08, 2.2, solid);
    this.addWBox(this.wGroup, this.wGeos, f2, x - 0.15, 2.82, z, 2.7, 0.98, 1.95, solid);
    this.addWBox(this.wGroup, this.wGeos, f2, x - 0.15, 3.38, z, 2.9, 0.16, 2.15, solid);
    this.addWBox(this.wGroup, this.wGeos, f1, x + 0.05, 1.28, z + 1.22, 2.2, 0.1, 0.55, solid);
    this.addWCyl(this.wGroup, this.wGeos, f0, x - 1.45, 1.15, z + 1.05, 0.08, 2.3, 6, solid);
    this.addWCyl(this.wGroup, this.wGeos, f0, x + 1.45, 1.15, z + 1.05, 0.08, 2.3, 6, solid);
    this.addWBox(this.wGroup, this.wGeos, this.pool, x + 0.15, 0.05, z + 2.05, 2.5, 0.08, 1.35, { fill: 0.5, depth: true, color: CYAN });
    this.addWBox(this.wGroup, this.wGeos, this.pool, x + 0.15, 0.1, z + 2.05, 2.7, 0.06, 1.55, solid);
    const cx = x - 3.35, cz = z - 0.85;
    const carS = { fill: 0.4, depth: true, color: GOLD };
    this.addWBox(this.wGroup, this.wGeos, this.car, cx, 0.38, cz, 2.05, 0.52, 1.05, carS);
    this.addWBox(this.wGroup, this.wGeos, this.car, cx + 0.05, 0.78, cz, 1.25, 0.42, 1.0, carS);
    this.addWBox(this.wGroup, this.wGeos, this.car, cx + 0.08, 0.86, cz, 0.85, 0.22, 0.92, { fill: 0.28, depth: true, color: CYAN });
    this.addWCyl(this.wGroup, this.wGeos, this.car, cx - 0.62, 0.2, cz + 0.52, 0.2, 0.12, 8, carS);
    this.addWCyl(this.wGroup, this.wGeos, this.car, cx + 0.62, 0.2, cz + 0.52, 0.2, 0.12, 8, carS);
    this.addWCyl(this.wGroup, this.wGeos, this.car, cx - 0.62, 0.2, cz - 0.52, 0.2, 0.12, 8, carS);
    this.addWCyl(this.wGroup, this.wGeos, this.car, cx + 0.62, 0.2, cz - 0.52, 0.2, 0.12, 8, carS);
    const bx = x + 3.7, bz = z + 0.15;
    const boatS = { fill: 0.4, depth: true, color: CYAN };
    this.addWBox(this.wGroup, this.wGeos, this.boat, bx, 0.22, bz, 2.9, 0.32, 0.85, boatS);
    this.addWBox(this.wGroup, this.wGeos, this.boat, bx - 0.15, 0.58, bz, 1.35, 0.42, 0.62, boatS);
    this.addWBox(this.wGroup, this.wGeos, this.boat, bx + 1.15, 0.28, bz, 0.7, 0.16, 0.55, boatS);
    this.addWCyl(this.wGroup, this.wGeos, this.boat, bx + 0.85, 0.85, bz, 0.035, 1.25, 5, boatS);
    const lx = LODGING.x, lz = LODGING.z;
    const lodS = { fill: 0.5, depth: true, color: HOUSE };
    const W = 2.15, D = 1.75, H = 2.2, wall = 0.12, winW = 1.02, winH = 1.15, winY = 1.28;
    const east = lx + W / 2 - wall / 2;
    const side = (D - winW) / 2;
    this.addWBox(this.wGroup, this.wGeos, this.lodging, lx - W / 2 + wall / 2, H / 2, lz, wall, H, D, lodS);
    this.addWBox(this.wGroup, this.wGeos, this.lodging, lx, H / 2, lz + D / 2 - wall / 2, W, H, wall, lodS);
    this.addWBox(this.wGroup, this.wGeos, this.lodging, lx, H / 2, lz - D / 2 + wall / 2, W, H, wall, lodS);
    this.addWBox(this.wGroup, this.wGeos, this.lodging, east, (winY - winH / 2) / 2, lz, wall, winY - winH / 2, D, lodS);
    const topH = H - (winY + winH / 2);
    this.addWBox(this.wGroup, this.wGeos, this.lodging, east, winY + winH / 2 + topH / 2, lz, wall, topH, D, lodS);
    this.addWBox(this.wGroup, this.wGeos, this.lodging, east, winY, lz + winW / 2 + side / 2, wall, winH, side, lodS);
    this.addWBox(this.wGroup, this.wGeos, this.lodging, east, winY, lz - winW / 2 - side / 2, wall, winH, side, lodS);
    this.addWBox(this.wGroup, this.wGeos, this.lodging, lx, H + 0.09, lz, W + 0.22, 0.18, D + 0.22, lodS);
    for (let i = 0; i < 6; i++) {
      const step = { fills: [], lines: [] };
      this.lodgeSteps.push(step);
      this.addWBox(this.wGroup, this.wGeos, step, lx - 0.42, 0.28 + i * 0.36, lz, 1.05, 0.28, 1.15, { fill: 0.04, depth: true, color: GREEN });
    }
    const glassGeo = new THREE.BoxGeometry(0.04, 1.08, 0.96);
    this.wGeos.push(glassGeo);
    this.glass = new THREE.Mesh(glassGeo, new THREE.MeshBasicMaterial({ color: 0xd7eef6, transparent: true, opacity: 0.18, depthWrite: false }));
    this.glass.position.set(lx + 1.02, 1.28, lz);
    this.glass.renderOrder = 6;
    this.wGroup.add(this.glass);
    this.watcher = this.addWhistleblower(lx + 0.8, lz, 1.02);
    this.watcher.position.y = 0.74;
    this.watcher.rotation.y = Math.PI / 2;
    this.watcher.renderOrder = 4;
    this.watcher.traverse((obj) => { obj.renderOrder = 4; });
    this.watcherHome = this.watcher.position.clone();
    const spots = [
      [x - 0.9, z + 3.15, 1.45, 0xe24b8a],
      [x + 0.15, z + 3.35, 1.62, 0xc9a24a],
      [x + 1.15, z + 3.05, 1.38, 0x7a3e8a],
    ];
    for (const [fx, fz, fs, dress] of spots) {
      const fig = this.addLady(fx, fz, fs, dress);
      this.figures.push(fig);
      this.figureHome.push(new THREE.Vector3(fx, 0, fz));
    }
    const ringGeo = new THREE.RingGeometry(2.55, 2.72, 40);
    this.wGeos.push(ringGeo);
    this.seize = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }));
    this.seize.rotation.x = -Math.PI / 2;
    this.seize.position.set(COMPOUND.x, 0.04, COMPOUND.z);
    this.seize.visible = false;
    this.wGroup.add(this.seize);
    const count = 140;
    this.firePos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      this.firePos[i * 3] = COMPOUND.x + (Math.random() - 0.5) * 2.4;
      this.firePos[i * 3 + 1] = Math.random() * 2.8;
      this.firePos[i * 3 + 2] = COMPOUND.z + (Math.random() - 0.5) * 1.8;
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
    const idle = outcome === "burn" ? new THREE.Color(PALETTE.amber) : GOLD;
    const seized = outcome === "jail" ? GREEN : outcome === "exile" ? CRIMSON : null;
    const show = whistle ? 1 : 0;
    const n = Math.max(0, Math.min(6, this.whistleCorrect || 0));
    if (outcome === "burn" || outcome === "exile") {
      this.paintParts(this.villa, seized ?? idle, 0.5 * show, 0.9 * show);
      this.floors.forEach((floor) => this.paintParts(floor, seized ?? idle, 0.5 * show, 0.9 * show));
      this.paintParts(this.car, seized ?? GOLD, 0.52 * show, 0.92 * show);
      this.paintParts(this.boat, seized ?? CYAN, 0.5 * show, 0.9 * show);
      this.paintParts(this.pool, seized ?? POOL, 0.72 * show, 0.4 * show);
      this.paintParts(this.lodging, outcome === "burn" ? new THREE.Color(0x1a1210) : CRIMSON, 0.88 * show, 0.95 * show);
      this.lodgeSteps.forEach((step) => this.paintParts(step, outcome === "burn" ? new THREE.Color(0x1a1210) : CRIMSON, 0.15 * show, 0.2 * show));
    } else {
      this.floors.forEach((floor, i) => this.paintParts(floor, n > i ? CRIMSON : GOLD, 0.55 * show, 0.95 * show));
      this.paintParts(this.boat, n >= 4 ? CRIMSON : CYAN, 0.5 * show, 0.9 * show);
      this.paintParts(this.pool, n >= 5 ? CRIMSON : POOL, 0.72 * show, 0.4 * show);
      this.paintParts(this.car, n >= 6 ? CRIMSON : GOLD, 0.52 * show, 0.92 * show);
      if (n >= 6) {
        this.paintParts(this.lodging, new THREE.Color(0x121212), 0.9 * show, 0.35 * show);
        const flag = [FLAG_GREEN, FLAG_GREEN, FLAG_YELLOW, FLAG_BLUE, FLAG_RED, FLAG_RED];
        this.lodgeSteps.forEach((step, i) => this.paintParts(step, flag[i], 0.94 * show, 1 * show));
      } else {
        const house = HOUSE.clone().lerp(GREEN, n / 6);
        this.paintParts(this.lodging, house, 0.88 * show, 0.95 * show);
        this.lodgeSteps.forEach((step, i) => this.paintParts(step, GREEN, (n > i ? 0.82 : 0.04) * show, (n > i ? 0.95 : 0.08) * show));
      }
    }
    this.glass.visible = whistle;
    this.glass.material.opacity = whistle ? 0.2 : 0;
    this.seize.visible = outcome === "jail";
    this.seize.rotation.y = t * 0.25;
    const burning = outcome === "burn";
    this.fire.material.opacity = burning ? 0.85 : 0;
    this.fire.visible = burning && !this.reduced;
    if (burning && !this.reduced) {
      for (let i = 0; i < this.firePos.length; i += 3) {
        this.firePos[i + 1] += (1.8 + (i % 5) * 0.15) * dt;
        if (this.firePos[i + 1] > 2.6) {
          this.firePos[i] = COMPOUND.x + (Math.random() - 0.5) * 2.4;
          this.firePos[i + 1] = 0.1;
          this.firePos[i + 2] = COMPOUND.z + (Math.random() - 0.5) * 1.8;
        }
      }
      this.fire.geometry.getAttribute("position").needsUpdate = true;
    }
    for (let i = 0; i < this.figures.length; i++) {
      const fig = this.figures[i];
      const home = this.figureHome[i];
      fig.visible = whistle;
      const mats = fig.userData.mats;
      if (outcome === "jail") { for (const m of mats) { m.color.copy(GREEN); m.opacity = 0.16; } }
      else if (outcome === "exile") {
        for (const m of mats) { m.color.copy(CRIMSON); m.opacity = 0.8; }
        fig.position.x = home.x + Math.sin(t * 0.8 + i) * 0.08;
        fig.position.z = home.z + (Math.sin(t * 0.35) * 0.5 + 0.6);
      } else {
        const homes = fig.userData.homeColors;
        mats.forEach((m, mi) => { m.color.copy(homes?.[mi] ?? PINK); m.opacity = 0.94; });
        fig.position.x = home.x + Math.sin(t * 0.8 + i) * 0.08;
        fig.position.z = home.z + Math.cos(t * 0.55 + i) * 0.05;
        fig.rotation.z = Math.sin(t * 1.3 + i) * 0.04;
      }
    }
    this.watcher.visible = whistle;
    const kept = this.watcher.userData.flagColors;
    this.watcher.userData.mats.forEach((m, i) => {
      m.color.copy(kept[i] ?? FLAG_RED);
      m.opacity = 1;
    });
    this.watcher.position.x = this.watcherHome.x;
    this.watcher.position.z = this.watcherHome.z;
    this.watcher.position.y = this.watcherHome.y + Math.sin(t * 1.4) * 0.012;
    this.watcher.rotation.y = Math.PI / 2;
  }

  resize = () => {
    const w = Math.max(1, this.canvas.clientWidth);
    const h = Math.max(1, this.canvas.clientHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.setSize(w, h, false);
    const band = this.openBand();
    const key = [Math.round(band.w / 24), Math.round(band.h / 24), Math.round(band.bottom / 24), Math.round(band.right / 24), Math.round(band.top / 24)].join(":");
    if (key !== this.bandKey) {
      this.bandKey = key;
      this.frameCompetition();
    }
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
    const showHouse = this.competition === "tender";
    for (const v of this.visuals.values()) v.group.visible = showHouse;
    for (const house of this.houseState) {
      const v = this.visuals.get(house.id);
      if (!v || !showHouse) continue;
      const hovered = this.hoveredId === house.id || this.hoverId === house.id;
      const selected = this.selectedId === house.id;
      const target = house.renovated || hovered ? 1 : 0;
      v.renovate += (target - v.renovate) * (1 - Math.exp(-7 * dt));
      const held = new THREE.Color(house.renovated ? 0xc5d2c8 : 0xd5d6d2);
      v.fillMat.color.set(0x6e6256).lerp(held, v.renovate);
      if (hovered) v.fillMat.color.lerp(new THREE.Color(0xf7f4ee), 0.4);
      if (hovered || house.renovated) v.sweepT = Math.min(1, v.sweepT + dt * 1.35);
      else v.sweepT = Math.max(0, v.sweepT - dt * 2.2);
      const p = v.sweepT;
      v.sweep.material.color.set(house.renovated ? 0xc5d2c8 : 0xf4f5f3);
      v.sweep.material.emissive.set(house.renovated ? 0x3f9a55 : 0xd5d6d2);
      v.sweep.visible = p > 0.02 && p < 0.98;
      v.sweep.position.y = 0.1 + p * v.height;
      v.sweep.material.opacity = 0.55 * (1 - Math.abs(p - 0.5) * 1.5);
      v.node.visible = !house.renovated;
      v.node.position.y = v.height + 0.28 + Math.sin(t * 2.4 + v.seed) * 0.06;
      v.node.material.emissive.set(hovered ? 0xd7ecff : 0x7ec8ff);
      v.node.material.opacity = hovered ? 1 : 0.7;
      v.ring.material.color.set(house.renovated ? 0x3f9a55 : 0xd5d6d2);
      v.ring.material.emissive.set(house.renovated ? 0x1a5a28 : 0x9aa8a0);
      v.ring.material.opacity = selected ? 0.9 : hovered ? 0.45 : house.renovated ? 0.28 : 0;
      v.group.position.x = house.x;
    }
    this.tickWhistle(dt, t);
    this.haven.tick(dt, t, this.reduced);
    this.land.tick(dt, t, this.reduced);
    this.fair.tick(dt, t, this.reduced);
    this.crop.tick(dt, t, this.reduced);
    this.wash.tick(dt, t, this.reduced);
    this.tickBus(t);
    this.renderer.render(this.scene, this.camera);
  };
}

function defaultState() {
  return {
    phase: "boot", contractorId: null, competition: "tender", integrity: 32, results: [],
    houses: HOUSES.map((h) => ({ ...h })),
    contractors: CONTRACTORS.map((c) => ({ ...c })),
    activeHouseId: TENDERS[0].houseId, hoveredId: null, selectedId: null,
    mobileTab: "tender", toast: null, toastKind: null,
    whistleResults: [], activeCaseId: WHISTLE_CASES[0].id, whistleScore: 0,
    whistleOutcome: "open", showOutcome: false,
    havenResults: [], activeHavenId: HAVEN_CASES[0].id, havenScore: 0, havenOutcome: "open",
    landResults: [], activeLandId: LAND_CASES[0].id, landScore: 0, landOutcome: "open",
    fairResults: [], activeFairId: FAIR_CASES[0].id, fairScore: 0, fairOutcome: "open",
    cropResults: [], activeCropId: CROP_CASES[0].id, cropScore: 0, cropOutcome: "open",
    washResults: [], activeWashId: WASH_CASES[0].id, washScore: 0, washOutcome: "open",
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultState();
    const data = JSON.parse(raw);
    if (data.version !== SAVE_VERSION) return defaultState();
    return { ...defaultState(), ...claimAsYou(data), hoveredId: null, selectedId: null, toast: null };
  } catch {
    return defaultState();
  }
}

function claimAsYou(data) {
  const old = data.contractorId;
  if (!old || old === "you") return { ...data, contractorId: old === "you" ? "you" : null };
  const oldName = CONTRACTORS.find((c) => c.id === old)?.name;
  return {
    ...data,
    contractorId: "you",
    results: (data.results || []).map((r) => {
      const tender = TENDERS.find((t) => t.houseId === r.houseId);
      return {
        ...r,
        bids: tender ? { ...tender.npcBids } : r.bids,
        winnerId: r.winnerId === old ? "you" : r.winnerId,
      };
    }),
    whistleResults: (data.whistleResults || []).map((w) => {
      const item = WHISTLE_CASES.find((c) => c.id === w.caseId);
      return { ...w, reports: item ? { ...item.npcReports } : w.reports };
    }),
    houses: (data.houses || []).map((h) => (h.owner === oldName ? { ...h, owner: "You" } : h)),
    contractors: CONTRACTORS.map((c) => ({ ...c })),
  };
}

function persist(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      version: SAVE_VERSION, phase: state.phase, contractorId: state.contractorId,
      competition: state.competition, integrity: state.integrity, results: state.results, houses: state.houses,
      contractors: state.contractors, activeHouseId: state.activeHouseId,
      whistleResults: state.whistleResults, activeCaseId: state.activeCaseId,
      whistleScore: state.whistleScore, whistleOutcome: state.whistleOutcome,
      havenResults: state.havenResults, activeHavenId: state.activeHavenId,
      havenScore: state.havenScore, havenOutcome: state.havenOutcome,
      landResults: state.landResults, activeLandId: state.activeLandId,
      landScore: state.landScore, landOutcome: state.landOutcome,
      fairResults: state.fairResults, activeFairId: state.activeFairId,
      fairScore: state.fairScore, fairOutcome: state.fairOutcome,
      cropResults: state.cropResults, activeCropId: state.activeCropId,
      cropScore: state.cropScore, cropOutcome: state.cropOutcome,
      washResults: state.washResults, activeWashId: state.activeWashId,
      washScore: state.washScore, washOutcome: state.washOutcome,
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
      document.querySelectorAll("#mobile-tabs button[data-tab]").forEach((b) => b.classList.toggle("on", b.dataset.tab === "tender"));
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
    whistleCorrect: (state.whistleResults || []).filter((r) => r.correct).length,
    havenOutcome: state.havenOutcome,
    havenCorrect: (state.havenResults || []).filter((r) => r.correct).length,
    landOutcome: state.landOutcome,
    landCorrect: (state.landResults || []).filter((r) => r.correct).length,
    fairOutcome: state.fairOutcome,
    fairCorrect: (state.fairResults || []).filter((r) => r.correct).length,
    fairHeld: (state.fairResults || []).filter((r) => r.correct).map((r) => r.caseId),
    cropOutcome: state.cropOutcome,
    cropCorrect: (state.cropResults || []).filter((r) => r.correct).length,
    washOutcome: state.washOutcome,
    washCorrect: (state.washResults || []).filter((r) => r.correct).length,
  };
}
engine.sync(syncPayload());

const boot = document.getElementById("boot");
const play = document.getElementById("play");
const enterBtn = document.getElementById("enter-btn");
enterBtn.addEventListener("click", () => {
  state.phase = "play";
  state.contractorId = "you";
  state.activeHouseId = firstOpenHouseId(state.results);
  persist(state);
  showPlay();
});

function resetGame() {
  try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ }
  Object.assign(state, defaultState());
  boot.hidden = false;
  play.hidden = true;
  engine.sync(syncPayload());
  renderBoot();
}
function resetStage() {
  state.showOutcome = false;
  state.mobileTab = "tender";
  state.hoveredId = null;
  state.selectedId = null;
  if (state.competition === "wash") {
    state.washResults = [];
    state.activeWashId = WASH_CASES[0].id;
    state.washScore = 0;
    state.washOutcome = "open";
  } else if (state.competition === "crop") {
    state.cropResults = [];
    state.activeCropId = CROP_CASES[0].id;
    state.cropScore = 0;
    state.cropOutcome = "open";
  } else if (state.competition === "fair") {
    state.fairResults = [];
    state.activeFairId = FAIR_CASES[0].id;
    state.fairScore = 0;
    state.fairOutcome = "open";
  } else if (state.competition === "land") {
    state.landResults = [];
    state.activeLandId = LAND_CASES[0].id;
    state.landScore = 0;
    state.landOutcome = "open";
  } else if (state.competition === "haven") {
    state.havenResults = [];
    state.activeHavenId = HAVEN_CASES[0].id;
    state.havenScore = 0;
    state.havenOutcome = "open";
  } else if (state.competition === "whistle") {
    state.whistleResults = [];
    state.activeCaseId = WHISTLE_CASES[0].id;
    state.whistleScore = 0;
    state.whistleOutcome = "open";
  } else {
    state.competition = "tender";
    state.results = [];
    state.houses = HOUSES.map((h) => ({ ...h }));
    state.contractors = CONTRACTORS.map((c) => ({ ...c }));
    state.integrity = 32;
    state.activeHouseId = TENDERS[0].houseId;
  }
  showToast(L("toastStage"), "info");
  persist(state);
  play.classList.add("show-tender");
  play.classList.remove("show-board");
  renderAll();
}
document.getElementById("reset-stage").addEventListener("click", resetStage);
document.getElementById("reset-game").addEventListener("click", resetGame);
document.getElementById("tab-reset-stage").addEventListener("click", resetStage);
document.getElementById("tab-reset-game").addEventListener("click", resetGame);

function showPlay() {
  boot.hidden = true;
  play.hidden = false;
  renderAll();
  requestAnimationFrame(() => engine.frameCompetition());
}

function paintLang(root) {
  if (!root) return;
  root.innerHTML = ["en", "fr"].map((id) => `<button type="button" data-lang="${id}" class="${lang === id ? "on" : ""}">${id}</button>`).join("");
  root.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
}

function setLang(next) {
  lang = next === "fr" ? "fr" : "en";
  try { localStorage.setItem(LANG_KEY, lang); } catch { /* ignore */ }
  document.documentElement.lang = lang;
  document.title = L("title");
  renderBoot();
  if (!play.hidden) renderAll();
}

function renderBoot() {
  document.getElementById("boot-title").textContent = L("title");
  document.getElementById("boot-goal").textContent = L("goal");
  document.getElementById("enter-btn").textContent = L("enter");
  document.getElementById("boot-stages").innerHTML = ["stage1", "stage2", "stage3", "stage4", "stage5", "stage6", "stage7"]
    .map((key) => `<li>${L(key)}</li>`)
    .join("");
  paintLang(document.getElementById("boot-lang"));
  paintLang(document.getElementById("play-lang"));
  paintLang(document.getElementById("play-lang-mobile"));
  const orientRoot = document.getElementById("boot-orient");
  if (orientRoot) {
    orientRoot.innerHTML = ["portrait", "landscape"].map((id) => `<button type="button" data-orient="${id}" class="${orient === id ? "on" : ""}">${L(id)}</button>`).join("");
    orientRoot.querySelectorAll("[data-orient]").forEach((btn) => {
      btn.addEventListener("click", () => {
        orient = btn.dataset.orient === "landscape" ? "landscape" : "portrait";
        try { localStorage.setItem(ORIENT_KEY, orient); } catch { /* ignore */ }
        document.documentElement.dataset.orient = orient;
        renderBoot();
        engine.frameCompetition();
      });
    });
  }
  document.getElementById("reset-stage").textContent = L("resetStage");
  document.getElementById("reset-game").textContent = L("resetGame");
  document.getElementById("tab-reset-stage").textContent = L("resetStage");
  document.getElementById("tab-reset-game").textContent = L("resetGame");
  document.getElementById("tab-grid").textContent = L("grid");
}

function resultFor(houseId) { return state.results.find((r) => r.houseId === houseId) ?? null; }

function renderHeader() {
  const whistle = state.competition === "whistle";
  const haven = state.competition === "haven";
  const land = state.competition === "land";
  const fair = state.competition === "fair";
  const crop = state.competition === "crop";
  const wash = state.competition === "wash";
  document.getElementById("phase-kicker").textContent = L("projectPhase");
  document.querySelector('#comp-switch [data-comp="tender"]').textContent = L("tenders");
  document.querySelector('#comp-switch [data-comp="whistle"]').textContent = L("whistle");
  document.querySelector('#comp-switch [data-comp="haven"]').textContent = L("haven");
  document.querySelector('#comp-switch [data-comp="land"]').textContent = L("land");
  document.querySelector('#comp-switch [data-comp="fair"]').textContent = L("fair");
  document.querySelector('#comp-switch [data-comp="crop"]').textContent = L("crop");
  document.querySelector('#comp-switch [data-comp="wash"]').textContent = L("wash");
  document.getElementById("phase-title").textContent = wash ? L("phaseWash") : crop ? L("phaseCrop") : fair ? L("phaseFair") : land ? L("phaseLand") : haven ? L("phaseHaven") : whistle ? L("phaseWhistle") : L("phaseTender");
  document.getElementById("stat-label").textContent = wash ? L("washScore") : crop ? L("cropScore") : fair ? L("fairScore") : land ? L("landScore") : haven ? L("havenScore") : whistle ? L("whistleScore") : L("contractsWon");
  const won = state.results.filter((r) => r.winnerId === "you").length;
  const stat = document.getElementById("stat-won");
  stat.textContent = wash ? `${state.washScore}/${WASH_CASES.length * 100}` : crop ? `${state.cropScore}/${CROP_CASES.length * 100}` : fair ? `${state.fairScore}/${FAIR_CASES.length * 100}` : land ? `${state.landScore}/${LAND_CASES.length * 100}` : haven ? `${state.havenScore}/${HAVEN_CASES.length * 100}` : whistle ? `${state.whistleScore}/${WHISTLE_CASES.length * 100}` : `${won}/${TENDERS.length}`;
  stat.className = "mono";
  stat.style.color = wash ? "#c9a15a" : crop ? "#6fbf73" : fair ? "#b388ff" : land ? "#e6c36a" : "";
  if (haven) stat.className = "mono rose";
  if (whistle) stat.className = "mono amber";
  if (!wash && !crop && !fair && !land && !haven && !whistle) stat.className = "mono green";
  const swept = roundOneCleared(state.results, state.contractorId);
  const lineOpen = roundTwoCleared(state.whistleResults);
  const landOpen = roundThreeCleared(state.havenResults);
  const fairOpen = roundFourCleared(state.landResults);
  const cropOpen = roundFiveCleared(state.fairResults);
  const washOpen = roundSixCleared(state.cropResults);
  document.querySelectorAll("#comp-switch button").forEach((b) => {
    b.classList.toggle("on", b.dataset.comp === state.competition);
    if (b.dataset.comp === "whistle") {
      b.classList.toggle("locked", !swept);
      b.title = swept ? L("whistleHint") : L("lockHint");
    }
    if (b.dataset.comp === "haven") {
      b.classList.toggle("locked", !lineOpen);
      b.title = lineOpen ? L("havenHint") : L("lockHaven");
    }
    if (b.dataset.comp === "land") {
      b.classList.toggle("locked", !landOpen);
      b.title = landOpen ? L("landHint") : L("lockLand");
    }
    if (b.dataset.comp === "fair") {
      b.classList.toggle("locked", !fairOpen);
      b.title = fairOpen ? L("fairHint") : L("lockFair");
    }
    if (b.dataset.comp === "crop") {
      b.classList.toggle("locked", !cropOpen);
      b.title = cropOpen ? L("cropHint") : L("lockCrop");
    }
    if (b.dataset.comp === "wash") {
      b.classList.toggle("locked", !washOpen);
      b.title = washOpen ? L("washHint") : L("lockWash");
    }
  });
  const qcount = document.getElementById("qcount");
  qcount.textContent = wash
    ? `${state.washResults.length}/${WASH_CASES.length}`
    : crop
    ? `${state.cropResults.length}/${CROP_CASES.length}`
    : fair
      ? `${state.fairResults.length}/${FAIR_CASES.length}`
      : land
        ? `${state.landResults.length}/${LAND_CASES.length}`
        : haven
          ? `${state.havenResults.length}/${HAVEN_CASES.length}`
          : whistle
            ? `${state.whistleResults.length}/${WHISTLE_CASES.length}`
            : `${state.results.length}/${TENDERS.length}`;
  qcount.className = haven ? "qcount rose" : whistle ? "qcount amber" : "qcount green";
  qcount.style.color = wash ? "#c9a15a" : crop ? "#6fbf73" : fair ? "#b388ff" : land ? "#e6c36a" : "";
  document.getElementById("tab-case").textContent = wash || crop || fair || land || haven || whistle ? L("case") : L("tender");
  document.getElementById("tab-round").textContent = state.competition === "tender"
    ? L("whistle")
    : state.competition === "whistle" && lineOpen
      ? L("haven")
      : state.competition === "haven" && landOpen
        ? L("land")
        : state.competition === "land" && fairOpen
          ? L("fair")
          : state.competition === "fair" && cropOpen
            ? L("crop")
            : state.competition === "crop" && washOpen
              ? L("wash")
              : L("tenders");
  document.querySelectorAll("#mobile-tabs button[data-tab]").forEach((b) => {
    b.classList.toggle("whistle", whistle && b.classList.contains("on"));
    b.classList.toggle("haven", haven && b.classList.contains("on"));
  });
  document.getElementById("contractor-chips").innerHTML = `
    <span class="kicker mute">${wash
      ? L("floorsHeld", { n: state.washResults.filter((r) => r.correct).length, total: WASH_CASES.length })
      : crop
      ? L("rowsHeld", { n: state.cropResults.filter((r) => r.correct).length, total: CROP_CASES.length })
      : fair
      ? L("gatesHeld", { n: state.fairResults.filter((r) => r.correct).length, total: FAIR_CASES.length })
      : land
        ? L("plotsHeld", { n: state.landResults.filter((r) => r.correct).length, total: LAND_CASES.length })
      : haven
        ? L("signalsHeld", { n: state.havenResults.filter((r) => r.correct).length, total: HAVEN_CASES.length })
        : whistle
          ? L("casesFiled", { n: state.whistleResults.length, total: WHISTLE_CASES.length })
          : L("awardedN", { n: state.results.filter((r) => r.winnerId === "you").length })}</span>
  `;
}

function renderTender() {
  const raw = tenderForHouse(state.activeHouseId) ?? TENDERS[0];
  const tender = localizeTender(raw, lang);
  const house = state.houses.find((h) => h.id === tender.houseId);
  const result = resultFor(tender.houseId);
  const locked = Boolean(result);
  const remaining = TENDERS.some((t) => !resultFor(t.houseId));
  const bidRows = result
    ? `<div class="bid-row${result.winnerId === "you" ? " win" : " rejected"} me"><span class="who">${L("seatName")}${result.winnerId === "you" ? ` · ${L("awardedTag")}` : ` · ${L("rejectedTag")}`}</span><span class="mono">${result.playerScore}</span></div>`
    : "";
  document.getElementById("tender-panel").innerHTML = `
    <div class="side-head" style="display:flex;gap:.75rem;align-items:flex-start">
      <div style="flex:1;min-width:0">
        <p class="kicker cyan">${L("infra")} · ${tender.spec}</p>
        <h2>${tender.title}</h2>
        <p class="mute" style="margin:.25rem 0 0;font-size:11px">${houseLabel(house, lang)}</p>
      </div>
      <span class="week">${state.results.length}/${TENDERS.length}</span>
    </div>
    <div class="spec-nav">
      ${TENDERS.map((t) => {
        const done = Boolean(resultFor(t.houseId));
        const on = t.houseId === tender.houseId;
        const won = done && resultFor(t.houseId).winnerId === "you";
        const rejected = done && !resultFor(t.houseId).winnerId;
        return `<button type="button" data-house="${t.houseId}" class="${on ? "on" : won ? "won" : rejected ? "rejected" : ""}">${shortLabel(t.houseId, lang, SHORT[t.houseId] ?? t.spec)}</button>`;
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
        ${bidRows}
        ${remaining ? `<button type="button" class="cta" id="next-week" style="margin-top:.75rem">${L("nextReno")}</button>` : (roundOneCleared(state.results, state.contractorId) ? `<button type="button" class="cta" id="open-whistle" style="margin-top:.75rem;background:var(--amber)">${L("openBrief")}</button>` : `<p style="margin:.5rem 0 0;font-size:.8rem;color:var(--crimson)">${L("noSweep")}</p>`)}
      ` : ""}
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
      showToast(L("toastLock"), "info");
      return;
    }
    state.competition = "whistle";
    state.mobileTab = "tender";
    persist(state);
    renderAll();
  });
}


function whistleResultFor(caseId) { return state.whistleResults.find((r) => r.caseId === caseId) ?? null; }

function renderHaven() {
  const raw = havenCaseById(state.activeHavenId);
  const item = localizeHaven(raw, lang);
  const result = state.havenResults.find((r) => r.caseId === item.id) ?? null;
  const locked = Boolean(result);
  const remaining = HAVEN_CASES.some((c) => !state.havenResults.some((r) => r.caseId === c.id));
  const held = Boolean(result?.correct);
  const panel = document.getElementById("tender-panel");
  panel.classList.toggle("award", held);
  panel.classList.toggle("reject", locked && !held);
  panel.innerHTML = `
    <div class="side-head">
      <p class="kicker rose">${L("briefHaven")} · ${item.spec}</p>
      <h2>${item.title}</h2>
      <p class="mono mute">${state.havenResults.length}/${HAVEN_CASES.length}</p>
    </div>
    <div class="spec-nav">
      ${HAVEN_CASES.map((c) => {
        const done = state.havenResults.some((r) => r.caseId === c.id);
        const hit = state.havenResults.find((r) => r.caseId === c.id);
        const on = c.id === item.id;
        const won = done && hit?.correct;
        const lost = done && !hit?.correct;
        return `<button type="button" data-haven="${c.id}" class="${on && !done ? "haven-on" : ""} ${won ? "won" : ""} ${lost ? "rejected" : ""}">${shortLabel(c.id, lang, HSHORT[c.id])}</button>`;
      }).join("")}
    </div>
    <div class="side-body">
      <p>${item.question}</p>
      <div class="opts">
        ${item.options.map((opt) => {
          const picked = result?.picked === opt.id;
          const isCorrect = opt.id === item.correct;
          const cls = picked && held ? "correct" : picked && locked ? "wrong" : locked && isCorrect ? "correct" : "";
          return `<button type="button" class="opt ${cls}" data-hopt="${opt.id}" ${locked ? "disabled" : ""}><span>${opt.id}</span><span>${opt.text}</span></button>`;
        }).join("")}
      </div>
      <p class="kicker mute" style="margin-top:.8rem">${result ? (held ? L("holds") : L("looksAway")) : L("scoring")}</p>
      <p style="font-size:.8rem">${L("scoringHaven")}</p>
      <p class="rose" style="font-size:.8rem">${L("hotlineNote")}</p>
      ${result && remaining ? `<button type="button" class="cta" id="next-haven" style="margin-top:.75rem">${L("nextSignal")}</button>` : ""}
      ${result && !remaining ? `<p class="kicker ${state.havenOutcome === "line" ? "green" : state.havenOutcome === "lamp" ? "amber" : "crimson"}" style="margin:.5rem 0 0">${
        state.havenOutcome === "line" ? L("doneLine") : state.havenOutcome === "lamp" ? L("doneLamp") : L("doneFog")
      }</p>${roundThreeCleared(state.havenResults) ? `<button type="button" class="cta" id="open-land" style="margin-top:.75rem;background:#e6c36a">${L("openLand")}</button>` : ""}` : ""}
    </div>`;
  panel.querySelectorAll("[data-haven]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!roundTwoCleared(state.whistleResults)) {
        showToast(L("toastLockHaven"), "info");
        return;
      }
      state.activeHavenId = btn.dataset.haven;
      state.competition = "haven";
      persist(state);
      renderAll();
    });
  });
  panel.querySelectorAll("[data-hopt]").forEach((btn) => {
    btn.addEventListener("click", () => answerHaven(btn.dataset.hopt));
  });
  document.getElementById("next-haven")?.addEventListener("click", () => {
    if (state.havenOutcome !== "open") return;
    state.activeHavenId = firstOpenHavenId(state.havenResults);
    persist(state);
    renderAll();
  });
  document.getElementById("open-land")?.addEventListener("click", () => {
    if (!roundThreeCleared(state.havenResults)) return;
    state.competition = "land";
    state.mobileTab = "tender";
    state.showOutcome = false;
    play.classList.add("show-tender");
    play.classList.remove("show-board");
    persist(state);
    renderAll();
  });
}

function answerHaven(picked) {
  if (!state.contractorId || !roundTwoCleared(state.whistleResults)) return;
  const item = havenCaseById(state.activeHavenId);
  if (state.havenResults.some((r) => r.caseId === item.id)) return;
  const correct = picked === item.correct;
  const playerScore = correct ? HAVEN_CORRECT : HAVEN_WRONG;
  state.havenResults.push({ caseId: item.id, picked, correct, playerScore });
  state.havenScore += playerScore;
  state.havenOutcome = havenOutcomeOf(state.havenScore, state.havenResults.length);
  const finished = state.havenOutcome !== "open";
  if (finished) {
    state.showOutcome = true;
    showToast(
      state.havenOutcome === "line" ? L("toastLine") : state.havenOutcome === "lamp" ? L("toastLamp") : L("toastFog"),
      state.havenOutcome
    );
  } else {
    showToast(correct ? L("toastSignal") : L("toastMiss"), correct ? "award" : "reject");
  }
  persist(state);
  renderAll();
  renderOutcome();
}

function renderLand() {
  const raw = landCaseById(state.activeLandId);
  const item = localizeLand(raw, lang);
  const result = state.landResults.find((r) => r.caseId === item.id);
  const locked = Boolean(result);
  const remaining = LAND_CASES.some((c) => !state.landResults.some((r) => r.caseId === c.id));
  const held = Boolean(result?.correct);
  const panel = document.getElementById("tender-panel");
  panel.classList.toggle("award", held);
  panel.classList.toggle("reject", locked && !held);
  panel.innerHTML = `
    <div class="side-head">
      <p class="kicker" style="color:#e6c36a">${L("briefLand")} · ${item.spec}</p>
      <h2>${item.title}</h2>
      <p class="mono mute">${state.landResults.length}/${LAND_CASES.length}</p>
    </div>
    <div class="spec-nav">
      ${LAND_CASES.map((c) => {
        const done = state.landResults.some((r) => r.caseId === c.id);
        const hit = state.landResults.find((r) => r.caseId === c.id);
        const on = c.id === item.id;
        const won = done && hit?.correct;
        const lost = done && !hit?.correct;
        return `<button type="button" data-land="${c.id}" class="${on && !done ? "haven-on" : ""} ${won ? "won" : ""} ${lost ? "rejected" : ""}">${shortLabel(c.id, lang, LSHORT[c.id])}</button>`;
      }).join("")}
    </div>
    <div class="side-body">
      <p>${item.question}</p>
      <div class="opts">
        ${item.options.map((opt) => {
          const picked = result?.picked === opt.id;
          const isCorrect = opt.id === item.correct;
          const cls = picked && held ? "correct" : picked && locked ? "wrong" : locked && isCorrect ? "correct" : "";
          return `<button type="button" class="opt ${cls}" data-lopt="${opt.id}" ${locked ? "disabled" : ""}><span>${opt.id}</span><span>${opt.text}</span></button>`;
        }).join("")}
      </div>
      <p class="kicker mute" style="margin-top:.8rem">${result ? (held ? L("holdsLand") : L("missLand")) : L("scoring")}</p>
      <p style="font-size:.8rem">${L("scoringLand")}</p>
      ${result && remaining ? `<button type="button" class="cta" id="next-land" style="margin-top:.75rem;background:#e6c36a">${L("nextPlot")}</button>` : ""}
      ${result && !remaining ? `<p class="kicker" style="margin:.5rem 0 0;color:${state.landOutcome === "held" ? "var(--green)" : state.landOutcome === "shift" ? "#e6c36a" : "var(--crimson)"}">${
        state.landOutcome === "held" ? L("doneHeld") : state.landOutcome === "shift" ? L("doneShift") : L("doneLost")
      }</p>${roundFourCleared(state.landResults) ? `<button type="button" class="cta" id="open-fair" style="margin-top:.75rem;background:#b388ff">${L("openFair")}</button>` : ""}` : ""}
    </div>`;
  panel.querySelectorAll("[data-land]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!roundThreeCleared(state.havenResults)) {
        showToast(L("toastLockLand"), "info");
        return;
      }
      state.activeLandId = btn.dataset.land;
      state.competition = "land";
      persist(state);
      renderAll();
    });
  });
  panel.querySelectorAll("[data-lopt]").forEach((btn) => {
    btn.addEventListener("click", () => answerLand(btn.dataset.lopt));
  });
  document.getElementById("next-land")?.addEventListener("click", () => {
    if (state.landOutcome !== "open") return;
    state.activeLandId = firstOpenLandId(state.landResults);
    persist(state);
    renderAll();
  });
  document.getElementById("open-fair")?.addEventListener("click", () => {
    if (!roundFourCleared(state.landResults)) return;
    state.competition = "fair";
    state.mobileTab = "tender";
    state.showOutcome = false;
    play.classList.add("show-tender");
    play.classList.remove("show-board");
    persist(state);
    renderAll();
  });
}

function answerLand(picked) {
  if (!state.contractorId || !roundThreeCleared(state.havenResults)) return;
  const item = landCaseById(state.activeLandId);
  if (state.landResults.some((r) => r.caseId === item.id)) return;
  const correct = picked === item.correct;
  const playerScore = correct ? LAND_CORRECT : LAND_WRONG;
  state.landResults.push({ caseId: item.id, picked, correct, playerScore });
  state.landScore += playerScore;
  state.landOutcome = landOutcomeOf(state.landScore, state.landResults.length);
  const finished = state.landOutcome !== "open";
  if (finished) {
    state.showOutcome = true;
    showToast(
      state.landOutcome === "held" ? L("toastHeld") : state.landOutcome === "shift" ? L("toastShift") : L("toastLost"),
      state.landOutcome
    );
  } else {
    showToast(correct ? L("toastPlot") : L("toastSlip"), correct ? "award" : "reject");
  }
  persist(state);
  renderAll();
  renderOutcome();
}

function renderFair() {
  const raw = fairCaseById(state.activeFairId);
  const item = localizeFair(raw, lang);
  const result = state.fairResults.find((r) => r.caseId === item.id);
  const locked = Boolean(result);
  const remaining = FAIR_CASES.some((c) => !state.fairResults.some((r) => r.caseId === c.id));
  const held = Boolean(result?.correct);
  const panel = document.getElementById("tender-panel");
  panel.classList.toggle("award", held);
  panel.classList.toggle("reject", locked && !held);
  panel.innerHTML = `
    <div class="side-head">
      <p class="kicker" style="color:#b388ff">${L("briefFair")} · ${item.spec}</p>
      <h2>${item.title}</h2>
      <p class="mono mute">${state.fairResults.length}/${FAIR_CASES.length}</p>
    </div>
    <div class="spec-nav">
      ${FAIR_CASES.map((c) => {
        const done = state.fairResults.some((r) => r.caseId === c.id);
        const hit = state.fairResults.find((r) => r.caseId === c.id);
        const on = c.id === item.id;
        return `<button type="button" data-fair="${c.id}" class="${on && !done ? "haven-on" : ""} ${done && hit?.correct ? "won" : ""} ${done && hit && !hit.correct ? "rejected" : ""}">${shortLabel(c.id, lang, FSHORT[c.id])}</button>`;
      }).join("")}
    </div>
    <div class="side-body">
      <p>${item.question}</p>
      <div class="opts">
        ${item.options.map((opt) => {
          const picked = result?.picked === opt.id;
          const isCorrect = opt.id === item.correct;
          const cls = picked && held ? "correct" : picked && locked ? "wrong" : locked && isCorrect ? "correct" : "";
          return `<button type="button" class="opt ${cls}" data-fopt="${opt.id}" ${locked ? "disabled" : ""}><span>${opt.id}</span><span>${opt.text}</span></button>`;
        }).join("")}
      </div>
      <p class="kicker mute" style="margin-top:.8rem">${result ? (held ? L("holdsFair") : L("missFair")) : L("scoring")}</p>
      <p style="font-size:.8rem">${L("scoringFair")}</p>
      ${result && remaining ? `<button type="button" class="cta" id="next-fair" style="margin-top:.75rem;background:#b388ff">${L("nextGate")}</button>` : ""}
      ${result && !remaining ? `<p class="kicker" style="margin:.5rem 0 0;color:${state.fairOutcome === "fair" ? "var(--green)" : state.fairOutcome === "half" ? "#b388ff" : "var(--crimson)"}">${
        state.fairOutcome === "fair" ? L("doneFair") : state.fairOutcome === "half" ? L("doneHalf") : L("doneBarred")
      }</p>${roundFiveCleared(state.fairResults) ? `<button type="button" class="cta" id="open-crop" style="margin-top:.75rem;background:#6fbf73">${L("openCrop")}</button>` : ""}` : ""}
    </div>`;
  panel.querySelectorAll("[data-fair]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!roundFourCleared(state.landResults)) {
        showToast(L("toastLockFair"), "info");
        return;
      }
      state.activeFairId = btn.dataset.fair;
      state.competition = "fair";
      persist(state);
      renderAll();
    });
  });
  panel.querySelectorAll("[data-fopt]").forEach((btn) => btn.addEventListener("click", () => answerFair(btn.dataset.fopt)));
  document.getElementById("next-fair")?.addEventListener("click", () => {
    if (state.fairOutcome !== "open") return;
    state.activeFairId = firstOpenFairId(state.fairResults);
    persist(state);
    renderAll();
  });
  document.getElementById("open-crop")?.addEventListener("click", () => {
    if (!roundFiveCleared(state.fairResults)) return;
    state.competition = "crop";
    state.mobileTab = "tender";
    state.showOutcome = false;
    play.classList.add("show-tender");
    play.classList.remove("show-board");
    persist(state);
    renderAll();
  });
}

function answerFair(picked) {
  if (!state.contractorId || !roundFourCleared(state.landResults)) return;
  const item = fairCaseById(state.activeFairId);
  if (state.fairResults.some((r) => r.caseId === item.id)) return;
  const correct = picked === item.correct;
  state.fairResults.push({ caseId: item.id, picked, correct, playerScore: correct ? FAIR_CORRECT : FAIR_WRONG });
  state.fairScore += correct ? FAIR_CORRECT : FAIR_WRONG;
  state.fairOutcome = fairOutcomeOf(state.fairScore, state.fairResults.length);
  if (state.fairOutcome !== "open") {
    state.showOutcome = true;
    showToast(state.fairOutcome === "fair" ? L("toastFair") : state.fairOutcome === "half" ? L("toastHalf") : L("toastBarred"), state.fairOutcome);
  } else showToast(correct ? L("toastGate") : L("toastBar"), correct ? "award" : "reject");
  persist(state);
  renderAll();
  renderOutcome();
}

function renderCrop() {
  const raw = cropCaseById(state.activeCropId);
  const item = localizeCrop(raw, lang);
  const result = state.cropResults.find((r) => r.caseId === item.id);
  const locked = Boolean(result);
  const remaining = CROP_CASES.some((c) => !state.cropResults.some((r) => r.caseId === c.id));
  const held = Boolean(result?.correct);
  const panel = document.getElementById("tender-panel");
  panel.classList.toggle("award", held);
  panel.classList.toggle("reject", locked && !held);
  panel.innerHTML = `
    <div class="side-head">
      <p class="kicker" style="color:#6fbf73">${L("briefCrop")} · ${item.spec}</p>
      <h2>${item.title}</h2>
      <p class="mono mute">${state.cropResults.length}/${CROP_CASES.length}</p>
    </div>
    <div class="spec-nav">
      ${CROP_CASES.map((c) => {
        const done = state.cropResults.some((r) => r.caseId === c.id);
        const hit = state.cropResults.find((r) => r.caseId === c.id);
        const on = c.id === item.id;
        return `<button type="button" data-crop="${c.id}" class="${on && !done ? "haven-on" : ""} ${done && hit?.correct ? "won" : ""} ${done && hit && !hit.correct ? "rejected" : ""}">${shortLabel(c.id, lang, CSHORT[c.id])}</button>`;
      }).join("")}
    </div>
    <div class="side-body">
      <p>${item.question}</p>
      <div class="opts">
        ${item.options.map((opt) => {
          const picked = result?.picked === opt.id;
          const isCorrect = opt.id === item.correct;
          const cls = picked && held ? "correct" : picked && locked ? "wrong" : locked && isCorrect ? "correct" : "";
          return `<button type="button" class="opt ${cls}" data-copt="${opt.id}" ${locked ? "disabled" : ""}><span>${opt.id}</span><span>${opt.text}</span></button>`;
        }).join("")}
      </div>
      <p class="kicker mute" style="margin-top:.8rem">${result ? (held ? L("holdsCrop") : L("missCrop")) : L("scoring")}</p>
      <p style="font-size:.8rem">${L("scoringCrop")}</p>
      ${result && remaining ? `<button type="button" class="cta" id="next-crop" style="margin-top:.75rem;background:#6fbf73">${L("nextRow")}</button>` : ""}
      ${result && !remaining ? `<p class="kicker" style="margin:.5rem 0 0;color:${state.cropOutcome === "grown" ? "var(--green)" : state.cropOutcome === "thin" ? "#6fbf73" : "var(--crimson)"}">${
        state.cropOutcome === "grown" ? L("doneGrown") : state.cropOutcome === "thin" ? L("doneThin") : L("doneBare")
      }</p>` : ""}
    </div>`;
  panel.querySelectorAll("[data-crop]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!roundFiveCleared(state.fairResults)) {
        showToast(L("toastLockCrop"), "info");
        return;
      }
      state.activeCropId = btn.dataset.crop;
      state.competition = "crop";
      persist(state);
      renderAll();
    });
  });
  panel.querySelectorAll("[data-copt]").forEach((btn) => btn.addEventListener("click", () => answerCrop(btn.dataset.copt)));
  document.getElementById("next-crop")?.addEventListener("click", () => {
    if (state.cropOutcome !== "open") return;
    state.activeCropId = firstOpenCropId(state.cropResults);
    persist(state);
    renderAll();
  });
}

function answerCrop(picked) {
  if (!state.contractorId || !roundFiveCleared(state.fairResults)) return;
  const item = cropCaseById(state.activeCropId);
  if (state.cropResults.some((r) => r.caseId === item.id)) return;
  const correct = picked === item.correct;
  state.cropResults.push({ caseId: item.id, picked, correct, playerScore: correct ? CROP_CORRECT : CROP_WRONG });
  state.cropScore += correct ? CROP_CORRECT : CROP_WRONG;
  state.cropOutcome = cropOutcomeOf(state.cropScore, state.cropResults.length);
  if (state.cropOutcome !== "open") {
    state.showOutcome = true;
    showToast(state.cropOutcome === "grown" ? L("toastGrown") : state.cropOutcome === "thin" ? L("toastThin") : L("toastBare"), state.cropOutcome);
  } else showToast(correct ? L("toastRow") : L("toastWilt"), correct ? "award" : "reject");
  persist(state);
  renderAll();
  renderOutcome();
}

function renderWash() {
  const raw = washCaseById(state.activeWashId);
  const item = localizeWash(raw, lang);
  const result = state.washResults.find((r) => r.caseId === item.id);
  const locked = Boolean(result);
  const remaining = WASH_CASES.some((c) => !state.washResults.some((r) => r.caseId === c.id));
  const held = Boolean(result?.correct);
  const panel = document.getElementById("tender-panel");
  panel.classList.toggle("award", held);
  panel.classList.toggle("reject", locked && !held);
  panel.innerHTML = `
    <div class="side-head">
      <p class="kicker" style="color:#c9a15a">${L("briefWash")} · ${item.spec}</p>
      <h2>${item.title}</h2>
      <p class="mono mute">${state.washResults.length}/${WASH_CASES.length}</p>
    </div>
    <div class="spec-nav">
      ${WASH_CASES.map((c) => {
        const done = state.washResults.some((r) => r.caseId === c.id);
        const hit = state.washResults.find((r) => r.caseId === c.id);
        const on = c.id === item.id;
        return `<button type="button" data-wash="${c.id}" class="${on && !done ? "haven-on" : ""} ${done && hit?.correct ? "won" : ""} ${done && hit && !hit.correct ? "rejected" : ""}">${shortLabel(c.id, lang, WASHSHORT[c.id])}</button>`;
      }).join("")}
    </div>
    <div class="side-body">
      <p>${item.question}</p>
      <div class="opts">
        ${item.options.map((opt) => {
          const picked = result?.picked === opt.id;
          const isCorrect = opt.id === item.correct;
          const cls = picked && held ? "correct" : picked && locked ? "wrong" : locked && isCorrect ? "correct" : "";
          return `<button type="button" class="opt ${cls}" data-wopt2="${opt.id}" ${locked ? "disabled" : ""}><span>${opt.id}</span><span>${opt.text}</span></button>`;
        }).join("")}
      </div>
      <p class="kicker mute" style="margin-top:.8rem">${result ? (held ? L("holdsWash") : L("missWash")) : L("scoring")}</p>
      <p style="font-size:.8rem">${L("scoringWash")}</p>
      ${result && remaining ? `<button type="button" class="cta" id="next-wash" style="margin-top:.75rem;background:#c9a15a">${L("nextFloor")}</button>` : ""}
      ${result && !remaining ? `<p class="kicker" style="margin:.5rem 0 0;color:${state.washOutcome === "clean" ? "var(--green)" : state.washOutcome === "thin" ? "#c9a15a" : "var(--crimson)"}">${
        state.washOutcome === "clean" ? L("doneClean") : state.washOutcome === "thin" ? L("doneWashThin") : L("doneWash")
      }</p>` : ""}
    </div>`;
  panel.querySelectorAll("[data-wash]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!roundSixCleared(state.cropResults)) {
        showToast(L("toastLockWash"), "info");
        return;
      }
      state.activeWashId = btn.dataset.wash;
      state.competition = "wash";
      persist(state);
      renderAll();
    });
  });
  panel.querySelectorAll("[data-wopt2]").forEach((btn) => btn.addEventListener("click", () => answerWash(btn.dataset.wopt2)));
  document.getElementById("next-wash")?.addEventListener("click", () => {
    if (state.washOutcome !== "open") return;
    state.activeWashId = firstOpenWashId(state.washResults);
    persist(state);
    renderAll();
  });
}

function answerWash(picked) {
  if (!state.contractorId || !roundSixCleared(state.cropResults)) return;
  const item = washCaseById(state.activeWashId);
  if (state.washResults.some((r) => r.caseId === item.id)) return;
  const correct = picked === item.correct;
  state.washResults.push({ caseId: item.id, picked, correct, playerScore: correct ? WASH_CORRECT : WASH_WRONG });
  state.washScore += correct ? WASH_CORRECT : WASH_WRONG;
  state.washOutcome = washOutcomeOf(state.washScore, state.washResults.length);
  if (state.washOutcome !== "open") {
    state.showOutcome = true;
    showToast(state.washOutcome === "clean" ? L("toastClean") : state.washOutcome === "thin" ? L("toastWashThin") : L("toastWash"), state.washOutcome);
  } else showToast(correct ? L("toastFloor") : L("toastSludge"), correct ? "award" : "reject");
  persist(state);
  renderAll();
  renderOutcome();
}

function renderCase() {
  if (state.competition === "wash") return renderWash();
  if (state.competition === "crop") return renderCrop();
  if (state.competition === "fair") return renderFair();
  if (state.competition === "land") return renderLand();
  if (state.competition === "haven") return renderHaven();
  if (state.competition !== "whistle") return renderTender();
  const raw = whistleCaseById(state.activeCaseId);
  const item = localizeCase(raw, lang);
  const result = whistleResultFor(item.id);
  const locked = Boolean(result);
  const remaining = WHISTLE_CASES.some((c) => !whistleResultFor(c.id));
  const awarded = Boolean(result?.correct);
  const panel = document.getElementById("tender-panel");
  panel.classList.toggle("award", awarded);
  panel.classList.toggle("reject", locked && !awarded);
  const rows = result
    ? `<div class="bid-row${awarded ? " win" : " rejected"}"><span class="who">${L("youName")}</span><span class="mono">${result.playerScore}</span></div>`
    : "";
  panel.innerHTML = `
    <div class="side-head" style="display:flex;gap:.75rem;align-items:flex-start">
      <div style="flex:1;min-width:0">
        <p class="kicker amber">${L("brief")} · ${item.spec}</p>
        <h2>${item.title}</h2>
        <p class="mute" style="margin:.25rem 0 0;font-size:11px">Ravi · ${L("job")} · ${L("wage")}</p>
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
        return `<button type="button" data-case="${c.id}" class="${on && !done ? "whistle-on" : on ? (won ? "won" : "rejected") : won ? "won" : lost ? "rejected" : ""}">${shortLabel(c.id, lang, WSHORT[c.id])}</button>`;
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
        <p class="kicker ${awarded ? "cyan" : "mute"}">${awarded ? L("reportHolds") : L("weakFile")}</p>
        ${rows}
        ${remaining ? `<button type="button" class="cta" id="next-case" style="margin-top:.75rem;background:var(--amber)">${L("nextCase")}</button>`
          : `<p class="kicker ${state.whistleOutcome === "jail" ? "cyan" : ""}" style="margin:.5rem 0 0">${
              state.whistleOutcome === "jail" ? L("doneJail")
              : state.whistleOutcome === "burn" ? L("doneBurn")
              : L("doneExile")
            }</p>${roundTwoCleared(state.whistleResults) ? `<button type="button" class="cta" id="open-haven" style="margin-top:.75rem;background:var(--rose)">${L("openLine")}</button>` : ""}`}
      ` : `
        <p class="kicker mute">${L("scoring")}</p>
        <p style="margin:.35rem 0 0;font-size:.8rem">${L("scoringBody", { name: "Ravi" })}</p>
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
  document.getElementById("open-haven")?.addEventListener("click", () => {
    if (!roundTwoCleared(state.whistleResults)) return;
    state.competition = "haven";
    state.mobileTab = "tender";
    state.showOutcome = false;
    play.classList.add("show-tender");
    play.classList.remove("show-board");
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
  const reports = { ...item.npcReports };
  state.whistleResults.push({ caseId: item.id, picked, correct, playerScore, reports });
  state.whistleScore += playerScore;
  state.whistleOutcome = whistleOutcomeOf(state.whistleScore, state.whistleResults.length);
  const finished = state.whistleOutcome !== "open";
  if (finished) {
    state.showOutcome = true;
    showToast(
      state.whistleOutcome === "jail" && state.whistleScore >= WHISTLE_CASES.length * 100 ? L("toastPerfect")
      : state.whistleOutcome === "jail" ? L("toastJail")
      : state.whistleOutcome === "burn" ? L("toastBurn")
      : L("toastExile"),
      state.whistleOutcome
    );
  } else {
    showToast(correct ? L("toastFiled") : L("toastWeak"), correct ? "award" : "reject");
  }
  persist(state);
  renderAll();
  renderOutcome();
}

function renderOutcome() {
  const el = document.getElementById("outcome");
  const card = document.getElementById("outcome-card");
  const haven = state.competition === "haven";
  const land = state.competition === "land";
  const fair = state.competition === "fair";
  const wash = state.competition === "wash";
  const crop = state.competition === "crop";
  const outcome = wash ? state.washOutcome : crop ? state.cropOutcome : fair ? state.fairOutcome : land ? state.landOutcome : haven ? state.havenOutcome : state.whistleOutcome;
  if (!state.showOutcome || state.competition === "tender" || outcome === "open") { el.hidden = true; return; }
  const copy = wash ? {
    clean: { kicker: L("topScore"), title: L("cleanTitle"), body: L("cleanBody"), cls: "award" },
    thin: { kicker: L("midScore"), title: L("washThinTitle"), body: L("washThinBody"), cls: "burn" },
    wash: { kicker: L("lowScore"), title: L("washTitle"), body: L("washBody"), cls: "reject" },
  }[state.washOutcome] : crop ? {
    grown: { kicker: L("topScore"), title: L("grownTitle"), body: L("grownBody"), cls: "award" },
    thin: { kicker: L("midScore"), title: L("thinTitle"), body: L("thinBody"), cls: "burn" },
    bare: { kicker: L("lowScore"), title: L("bareTitle"), body: L("bareBody"), cls: "reject" },
  }[state.cropOutcome] : fair ? {
    fair: { kicker: L("topScore"), title: L("fairTitle"), body: L("fairBody"), cls: "award" },
    half: { kicker: L("midScore"), title: L("halfTitle"), body: L("halfBody"), cls: "burn" },
    barred: { kicker: L("lowScore"), title: L("barredTitle"), body: L("barredBody"), cls: "reject" },
  }[state.fairOutcome] : land ? {
    held: { kicker: L("topScore"), title: L("heldTitle"), body: L("heldBody"), cls: "award" },
    shift: { kicker: L("midScore"), title: L("shiftTitle"), body: L("shiftBody"), cls: "burn" },
    lost: { kicker: L("lowScore"), title: L("lostTitle"), body: L("lostBody"), cls: "reject" },
  }[state.landOutcome] : haven ? {
    line: { kicker: L("topScore"), title: L("lineTitle"), body: L("lineBody"), cls: "award" },
    lamp: { kicker: L("midScore"), title: L("lampTitle"), body: L("lampBody"), cls: "burn" },
    fog: { kicker: L("lowScore"), title: L("fogTitle"), body: L("fogBody"), cls: "reject" },
  }[state.havenOutcome] : {
    jail: { kicker: L("topScore"), title: L("jailTitle", { name: "Ravi" }), body: L("jailBody"), cls: "award" },
    burn: { kicker: L("midScore"), title: L("burnTitle"), body: L("burnBody"), cls: "burn" },
    exile: { kicker: L("lowScore"), title: L("exileTitle"), body: L("exileBody"), cls: "reject" },
  }[state.whistleOutcome];
  document.getElementById("outcome-kicker").textContent = copy.kicker;
  document.getElementById("outcome-title").textContent = copy.title;
  document.getElementById("outcome-body").textContent = copy.body;
  document.getElementById("outcome-score").textContent = wash
    ? L("scoreWash", { score: state.washScore })
    : crop
    ? L("scoreCrop", { score: state.cropScore })
    : fair
    ? L("scoreFair", { score: state.fairScore })
    : land
    ? L("scoreLand", { score: state.landScore })
    : haven
      ? L("scoreHaven", { score: state.havenScore }) + " · " + L("hotlineNote")
      : L("scoreLine", { score: state.whistleScore });
  document.getElementById("outcome-dismiss").textContent = L("watchGrid");
  card.className = "panel boot-card " + copy.cls;
  el.hidden = false;
}

function renderBoard() {
  const board = document.getElementById("board-panel");
  if (state.competition === "whistle") {
    board.hidden = true;
    board.innerHTML = "";
    return;
  }
  board.hidden = false;
  if (state.competition === "wash") {
    const floors = state.washResults.filter((r) => r.correct).length;
    board.innerHTML = `
      <div class="side-head">
        <p class="kicker" style="color:#c9a15a">${L("boardWash")}</p>
        <h2>${L("notRanking")}</h2>
      </div>
      <div class="side-body">
        <p style="font-size:.8rem">${L("washRule")}</p>
        <p class="mono green">${L("floorsHeld", { n: floors, total: WASH_CASES.length })}</p>
      </div>`;
    return;
  }
  if (state.competition === "crop") {
    const rows = state.cropResults.filter((r) => r.correct).length;
    board.innerHTML = `
      <div class="side-head">
        <p class="kicker" style="color:#6fbf73">${L("boardCrop")}</p>
        <h2>${L("notRanking")}</h2>
      </div>
      <div class="side-body">
        <p style="font-size:.8rem">${L("cropRule")}</p>
        <p class="mono green">${L("rowsHeld", { n: rows, total: CROP_CASES.length })}</p>
      </div>`;
    return;
  }
  if (state.competition === "fair") {
    const gates = state.fairResults.filter((r) => r.correct).length;
    board.innerHTML = `
      <div class="side-head">
        <p class="kicker" style="color:#b388ff">${L("boardFair")}</p>
        <h2>${L("notRanking")}</h2>
      </div>
      <div class="side-body">
        <p style="font-size:.8rem">${L("fairRule")}</p>
        <p class="mono green">${L("gatesHeld", { n: gates, total: FAIR_CASES.length })}</p>
      </div>`;
    return;
  }
  if (state.competition === "land") {
    const plots = state.landResults.filter((r) => r.correct).length;
    board.innerHTML = `
      <div class="side-head">
        <p class="kicker" style="color:#e6c36a">${L("boardLand")}</p>
        <h2>${L("notRanking")}</h2>
      </div>
      <div class="side-body">
        <p style="font-size:.8rem">${L("landRule")}</p>
        <p class="mono green">${L("plotsHeld", { n: plots, total: LAND_CASES.length })}</p>
      </div>`;
    return;
  }
  if (state.competition === "haven") {
    const held = state.havenResults.filter((r) => r.correct).length;
    document.getElementById("board-panel").innerHTML = `
      <div class="side-head">
        <p class="kicker rose">${L("boardHaven")}</p>
        <h2>${L("notRanking")}</h2>
        <p style="margin:.4rem 0 0;font-size:.8rem">${L("grokRefuse")}</p>
      </div>
      <div class="side-body">
        <p class="rose" style="font-family:var(--display);font-size:2rem;letter-spacing:.12em;margin:0">${L("hotlineBig")}</p>
        <p style="font-size:.8rem">${L("hotlineCaption")}</p>
        <p style="font-size:.8rem">${L("childLine")}</p>
        <p class="mute" style="font-size:.75rem">${L("lespwar")}</p>
        <p class="mono green">${L("signalsHeld", { n: held, total: HAVEN_CASES.length })}</p>
      </div>`;
    return;
  }
  const playerWins = state.results.filter((r) => r.winnerId === "you").length;
  document.getElementById("board-panel").innerHTML = `
    <div class="side-head">
      <p class="kicker cyan">${L("bidStandings")}</p>
      <h2>${L("seatName")}</h2>
      <p class="mute" style="margin:.4rem 0 0;font-size:.75rem">${L("awardedN", { n: playerWins })}</p>
    </div>
    <div class="side-body">
      <div class="board-row me">
        <div class="who"><strong>${L("seatName")}</strong><span>${holdingsLabel("You", state.houses)}</span></div>
        <span class="mono cyan">${playerWins * 100}</span>
      </div>
    </div>`;
}

function renderDock() {
  const dock = document.getElementById("house-dock");
  if (state.competition === "whistle") {
    dock.hidden = false;
    dock.innerHTML = `<div class="panel dock-inner"><p class="amber" style="margin:0;letter-spacing:.16em;text-transform:uppercase;font-family:var(--display);font-size:10px">${L("dockWhistle")}</p></div>`;
    return;
  }
  if (state.competition === "haven") {
    dock.hidden = false;
    dock.innerHTML = `<div class="panel dock-inner"><p class="rose" style="margin:0;letter-spacing:.16em;text-transform:uppercase;font-family:var(--display);font-size:10px">${L("dockHaven")}</p></div>`;
    return;
  }
  if (state.competition === "land") {
    dock.hidden = false;
    dock.innerHTML = `<div class="panel dock-inner"><p style="margin:0;letter-spacing:.16em;text-transform:uppercase;font-family:var(--display);font-size:10px;color:#e6c36a">${L("dockLand")}</p></div>`;
    return;
  }
  if (state.competition === "fair") {
    dock.hidden = false;
    dock.innerHTML = `<div class="panel dock-inner"><p style="margin:0;letter-spacing:.16em;text-transform:uppercase;font-family:var(--display);font-size:10px;color:#b388ff">${L("dockFair")}</p></div>`;
    return;
  }
  if (state.competition === "wash") {
    dock.hidden = false;
    dock.innerHTML = `<div class="panel dock-inner"><p style="margin:0;letter-spacing:.16em;text-transform:uppercase;font-family:var(--display);font-size:10px;color:#c9a15a">${L("dockWash")}</p></div>`;
    return;
  }
  if (state.competition === "crop") {
    dock.hidden = false;
    dock.innerHTML = `<div class="panel dock-inner"><p style="margin:0;letter-spacing:.16em;text-transform:uppercase;font-family:var(--display);font-size:10px;color:#6fbf73">${L("dockCrop")}</p></div>`;
    return;
  }
  const id = state.selectedId ?? state.hoveredId;
  const house = state.houses.find((h) => h.id === id);
  if (!house) { dock.hidden = true; dock.innerHTML = ""; return; }
  const tender = tenderForHouse(house.id);
  const result = resultFor(house.id);
  const status = result
    ? result.winnerId
      ? L("dockAward", { owner: house.owner === "You" ? L("youName") : (house.owner ?? "") })
      : L("dockReject")
    : houseHint(house, lang);
  dock.hidden = false;
  dock.innerHTML = `<div class="panel dock-inner">
    <div style="flex:1;min-width:0">
      <strong>${houseLabel(house, lang)}</strong>
      <p>${status}</p>
    </div>
    ${tender ? `<button type="button" class="reno" id="open-spec">${result ? L("bids") : L("openSpec")}</button>` : ""}
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
  renderMobileFoot();
  renderOutcome();
  engine.sync(syncPayload());
}

let resetArmed = false;
function sheetState() {
  const comp = state.competition;
  if (comp === "whistle") {
    return {
      answered: Boolean(whistleResultFor(state.activeCaseId)),
      n: state.whistleResults.length,
      total: WHISTLE_CASES.length,
      score: state.whistleScore,
      perfect: roundTwoCleared(state.whistleResults),
      last: false,
    };
  }
  if (comp === "haven") {
    return {
      answered: state.havenResults.some((r) => r.caseId === state.activeHavenId),
      n: state.havenResults.length,
      total: HAVEN_CASES.length,
      score: state.havenScore,
      perfect: roundThreeCleared(state.havenResults),
      last: false,
    };
  }
  if (comp === "land") {
    return {
      answered: state.landResults.some((r) => r.caseId === state.activeLandId),
      n: state.landResults.length,
      total: LAND_CASES.length,
      score: state.landScore,
      perfect: roundFourCleared(state.landResults),
      last: false,
    };
  }
  if (comp === "fair") {
    return {
      answered: state.fairResults.some((r) => r.caseId === state.activeFairId),
      n: state.fairResults.length,
      total: FAIR_CASES.length,
      score: state.fairScore,
      perfect: roundFiveCleared(state.fairResults),
      last: false,
    };
  }
  if (comp === "crop") {
    return {
      answered: state.cropResults.some((r) => r.caseId === state.activeCropId),
      n: state.cropResults.length,
      total: CROP_CASES.length,
      score: state.cropScore,
      perfect: state.cropResults.length >= CROP_CASES.length && state.cropResults.every((r) => r.correct),
      last: false,
    };
  }
  if (comp === "wash") {
    return {
      answered: state.washResults.some((r) => r.caseId === state.activeWashId),
      n: state.washResults.length,
      total: WASH_CASES.length,
      score: state.washScore,
      perfect: state.washResults.length >= WASH_CASES.length && state.washResults.every((r) => r.correct),
      last: true,
    };
  }
  return {
    answered: Boolean(resultFor(state.activeHouseId)),
    n: state.results.length,
    total: TENDERS.length,
    score: state.results.reduce((sum, r) => sum + r.playerScore, 0),
    perfect: roundOneCleared(state.results, state.contractorId),
    last: false,
  };
}
function renderMobileFoot() {
  const foot = sheetState();
  const remaining = foot.n < foot.total;
  const mode = !foot.answered ? "" : remaining ? "continue" : foot.perfect && !foot.last ? "next" : foot.perfect ? "" : "reset";
  const meta = document.getElementById("mobile-meta");
  const go = document.getElementById("mobile-go");
  const wipe = document.getElementById("mobile-reset-game");
  if (!meta || !go || !wipe) return;
  meta.textContent = L("sheetMeta", { n: foot.n, total: foot.total, score: foot.score });
  go.hidden = !mode;
  go.dataset.mode = mode;
  go.textContent = mode === "continue" ? L("continue") : mode === "next" ? L("nextStage") : L("resetStage");
  go.style.background = mode === "reset" ? "var(--crimson)" : mode === "next" ? "var(--green)" : "var(--cyan)";
  go.style.color = mode === "reset" ? "var(--paper)" : "var(--void)";
  if (!resetArmed) {
    wipe.textContent = L("resetGame");
    wipe.classList.remove("armed");
  }
  const later = state.competition !== "tender";
  const row = document.getElementById("stage-resets");
  const stageBtn = document.getElementById("sheet-reset-stage");
  const stageWipe = document.getElementById("sheet-reset-game");
  if (row && stageBtn && stageWipe) {
    row.hidden = !later;
    wipe.hidden = later;
    stageBtn.textContent = L("resetStage");
    if (!resetArmed) {
      stageWipe.textContent = L("resetGame");
      stageWipe.classList.remove("armed");
    }
  }
}
function advanceQuestion() {
  if (state.competition === "whistle") state.activeCaseId = firstOpenWhistleId(state.whistleResults);
  else if (state.competition === "haven") state.activeHavenId = firstOpenHavenId(state.havenResults);
  else if (state.competition === "land") state.activeLandId = firstOpenLandId(state.landResults);
  else if (state.competition === "fair") state.activeFairId = firstOpenFairId(state.fairResults);
  else if (state.competition === "crop") state.activeCropId = firstOpenCropId(state.cropResults);
  else if (state.competition === "wash") state.activeWashId = firstOpenWashId(state.washResults);
  else state.activeHouseId = firstOpenHouseId(state.results);
  state.selectedId = state.activeHouseId;
  persist(state);
  renderAll();
}
function goNextStage() {
  const order = ["tender", "whistle", "haven", "land", "fair", "crop", "wash"];
  const next = order[order.indexOf(state.competition) + 1];
  if (!next) return;
  state.competition = next;
  state.mobileTab = "tender";
  state.showOutcome = false;
  persist(state);
  renderAll();
}

function answer(picked) {
  if (!state.contractorId) return;
  const tender = tenderForHouse(state.activeHouseId);
  if (!tender || resultFor(tender.houseId)) return;
  const correct = picked === tender.correct;
  const playerScore = correct ? PLAYER_BID_CORRECT : PLAYER_BID_WRONG;
  const bids = { ...tender.npcBids };
  const topNpc = Math.max(...Object.values(bids));
  const awarded = correct && playerScore > topNpc;
  const winnerId = awarded ? "you" : null;
  const house = state.houses.find((h) => h.id === tender.houseId);
  state.results.push({ houseId: tender.houseId, picked, correct, playerScore, bids, winnerId });
  if (awarded && house) {
    house.renovated = true;
    house.owner = "You";
    house.ownerSector = null;
    state.integrity += 12;
  } else if (house) {
    house.renovated = false;
    house.rejected = true;
    house.owner = null;
    house.ownerSector = null;
  }
  state.selectedId = tender.houseId;
  showToast(awarded
    ? L("toastAward", { name: L("youName"), house: houseLabel(house, lang), score: playerScore })
    : L("toastReject"), awarded ? "award" : "reject");
  persist(state);
  renderAll();
}

document.getElementById("comp-switch").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-comp]");
  if (!btn) return;
  if (btn.dataset.comp === "whistle" && !roundOneCleared(state.results, state.contractorId)) {
    showToast(L("toastLock"), "info");
    return;
  }
  if (btn.dataset.comp === "haven" && !roundTwoCleared(state.whistleResults)) {
    showToast(L("toastLockHaven"), "info");
    return;
  }
  if (btn.dataset.comp === "land" && !roundThreeCleared(state.havenResults)) {
    showToast(L("toastLockLand"), "info");
    return;
  }
  if (btn.dataset.comp === "fair" && !roundFourCleared(state.landResults)) {
    showToast(L("toastLockFair"), "info");
    return;
  }
  if (btn.dataset.comp === "crop" && !roundFiveCleared(state.fairResults)) {
    showToast(L("toastLockCrop"), "info");
    return;
  }
  if (btn.dataset.comp === "wash" && !roundSixCleared(state.cropResults)) {
    showToast(L("toastLockWash"), "info");
    return;
  }
  state.showOutcome = false;
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
document.getElementById("mobile-go").addEventListener("click", () => {
  resetArmed = false;
  const mode = document.getElementById("mobile-go").dataset.mode;
  if (mode === "continue") advanceQuestion();
  else if (mode === "next") goNextStage();
  else if (mode === "reset") resetStage();
});
document.getElementById("mobile-reset-game").addEventListener("click", () => {
  const wipe = document.getElementById("mobile-reset-game");
  if (!resetArmed) {
    resetArmed = true;
    wipe.textContent = L("confirmReset");
    wipe.classList.add("armed");
    return;
  }
  resetArmed = false;
  resetGame();
});
document.getElementById("sheet-reset-stage")?.addEventListener("click", () => {
  resetArmed = false;
  resetStage();
});
document.getElementById("sheet-reset-game")?.addEventListener("click", () => {
  const wipe = document.getElementById("sheet-reset-game");
  if (!resetArmed) {
    resetArmed = true;
    wipe.textContent = L("confirmReset");
    wipe.classList.add("armed");
    return;
  }
  resetArmed = false;
  resetGame();
});
document.getElementById("mobile-tabs").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-tab]");
  if (!btn) return;
  const tab = btn.dataset.tab;
  document.querySelectorAll("#mobile-tabs button[data-tab]").forEach((b) => b.classList.toggle("on", b === btn));
  play.classList.toggle("show-tender", tab === "tender");
  play.classList.toggle("show-board", tab === "board");
});
document.getElementById("tab-round").addEventListener("click", () => {
  let next = "tender";
  if (state.competition === "tender") next = "whistle";
  else if (state.competition === "whistle" && roundTwoCleared(state.whistleResults)) next = "haven";
  else if (state.competition === "haven" && roundThreeCleared(state.havenResults)) next = "land";
  else if (state.competition === "land" && roundFourCleared(state.landResults)) next = "fair";
  else if (state.competition === "fair" && roundFiveCleared(state.fairResults)) next = "crop";
  else if (state.competition === "crop" && roundSixCleared(state.cropResults)) next = "wash";
  if (next === "whistle" && !roundOneCleared(state.results, state.contractorId)) {
    showToast(L("toastLock"), "info");
    return;
  }
  if (next === "haven" && !roundTwoCleared(state.whistleResults)) {
    showToast(L("toastLockHaven"), "info");
    return;
  }
  if (next === "land" && !roundThreeCleared(state.havenResults)) {
    showToast(L("toastLockLand"), "info");
    return;
  }
  if (next === "fair" && !roundFourCleared(state.landResults)) {
    showToast(L("toastLockFair"), "info");
    return;
  }
  if (next === "crop" && !roundFiveCleared(state.fairResults)) {
    showToast(L("toastLockCrop"), "info");
    return;
  }
  if (next === "wash" && !roundSixCleared(state.cropResults)) {
    showToast(L("toastLockWash"), "info");
    return;
  }
  state.competition = next;
  state.showOutcome = false;
  state.mobileTab = "tender";
  play.classList.add("show-tender");
  play.classList.remove("show-board");
  persist(state);
  renderAll();
});
play.classList.add("show-tender");

if ((state.whistleResults || []).length < WHISTLE_CASES.length) state.whistleOutcome = "open";
if ((state.havenResults || []).length < HAVEN_CASES.length) state.havenOutcome = "open";
if ((state.landResults || []).length < LAND_CASES.length) state.landOutcome = "open";
if ((state.fairResults || []).length < FAIR_CASES.length) state.fairOutcome = "open";
if ((state.cropResults || []).length < CROP_CASES.length) state.cropOutcome = "open";
if ((state.washResults || []).length < WASH_CASES.length) state.washOutcome = "open";
for (const id of ["market", "clinic", "hall", "bus"]) {
  if (state.results.some((r) => r.houseId === id)) continue;
  const h = state.houses.find((x) => x.id === id);
  if (h && h.owner && h.owner !== "You") {
    h.renovated = false;
    h.rejected = false;
    h.owner = null;
    h.ownerSector = null;
  }
}
if (!roundOneCleared(state.results, state.contractorId) && state.competition === "whistle") state.competition = "tender";
if (!roundTwoCleared(state.whistleResults) && state.competition === "haven") {
  state.competition = roundOneCleared(state.results, state.contractorId) ? "whistle" : "tender";
}
if (!roundThreeCleared(state.havenResults) && state.competition === "land") {
  state.competition = roundTwoCleared(state.whistleResults) ? "haven" : (roundOneCleared(state.results, state.contractorId) ? "whistle" : "tender");
}
if (!roundFourCleared(state.landResults) && state.competition === "fair") {
  state.competition = roundThreeCleared(state.havenResults) ? "land" : "haven";
}
if (!roundFiveCleared(state.fairResults) && state.competition === "crop") {
  state.competition = roundFourCleared(state.landResults) ? "fair" : "land";
}
if (!roundSixCleared(state.cropResults) && state.competition === "wash") {
  state.competition = roundFiveCleared(state.fairResults) ? "crop" : "fair";
}
renderBoot();
if (state.phase === "play") showPlay();
window.addEventListener("pagehide", () => persist(state));
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") persist(state); });
