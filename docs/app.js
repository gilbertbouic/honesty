import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { t as tr, localizeTender, localizeCase, localizeHaven, localizeLand, localizeFair, localizeCrop, localizeWash, localizeStamp, localizeRoll, localizeOath, houseLabel, houseHint, shortLabel, loadLang, LANG_KEY } from "./i18n.js?v=vg99";
import { HavenScene } from "./haven.js?v=vg49";
import { LandScene } from "./land.js?v=vg92";
import { FairScene } from "./fair.js?v=vg71";
import { CropScene } from "./crop.js?v=vg61";
import { WashScene } from "./wash.js?v=vg62";
import { StampScene } from "./stamp.js?v=vg90";
import { RollScene } from "./roll.js?v=vg92";
import { OathScene } from "./oath.js?v=vg92";

let lang = loadLang();
const L = (key, vars) => tr(lang, key, vars);
document.documentElement.lang = lang;

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
const RUST = new THREE.Color(0x8a4b32);
const RUST_DARK = new THREE.Color(0x5c3224);
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
  { id: "cwa-pump", name: "CWA Pump House", hint: "Water Grid Renewal · SPEC-01", variant: "pump", x: -1.55, z: 1.95, cost: 80, renovated: false, owner: null, ownerSector: null },
  { id: "block-a", name: "Village Block A", hint: "Cité roofs · SPEC-04", variant: "block", x: -3.85, z: 0.35, cost: 60, renovated: false, owner: null, ownerSector: null },
  { id: "block-b", name: "Village Block B", hint: "Cité wiring · SPEC-05", variant: "block", x: 4.05, z: 0.35, cost: 60, renovated: false, owner: null, ownerSector: null },
  { id: "market", name: "Market Shed", hint: "Market stalls · SPEC-02", variant: "market", x: -3.6, z: -2.1, cost: 50, renovated: false, owner: null, ownerSector: null },
  { id: "clinic", name: "District Clinic", hint: "Clinic stores · SPEC-03", variant: "clinic", x: 3.9, z: -2.3, cost: 90, renovated: false, owner: null, ownerSector: null },
  { id: "school", name: "Primary School", hint: "School works · SPEC-06", variant: "school", x: -1.4, z: -4.8, cost: 70, renovated: false, owner: null, ownerSector: null },
  { id: "hall", name: "Civic Hall", hint: "Hall hire · SPEC-11", variant: "hall", x: 1.9, z: -4.9, cost: 85, renovated: false, owner: null, ownerSector: null },
  { id: "bus", name: "Bus Shelter", hint: "Shelter panels · SPEC-12", variant: "bus", x: 6.2, z: 2.15, cost: 40, renovated: false, owner: null, ownerSector: null },
  { id: "power", name: "CEB Substation", hint: "Street lighting feed · SPEC-07", variant: "power", x: -6.15, z: 2.05, cost: 90, renovated: false, owner: null, ownerSector: null },
  { id: "drain", name: "Drainage Node", hint: "Land Drainage Authority · SPEC-08", variant: "drain", x: 0.1, z: 6.35, cost: 50, renovated: false, owner: null, ownerSector: null },
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
    question: "Ravi declares Rs 15,000 a month. This week he parks a new SUV worth several million rupees outside the cité. A cousin says stay silent — “it is family business.” What is the lawful action?",
    options: [
      { id: "A", text: "Stay silent. A relative abroad can buy a car, so the village should not open a file." },
      { id: "B", text: "File a suspicious-wealth report with the police / ADSU. The declared wage does not explain the car. Do not take hush money." },
      { id: "C", text: "Accept Rs 20,000 to “watch the car at night” and keep the registration off any village file." },
      { id: "D", text: "Post the number plate on a rumour page and leave it there. No official report, no file." },
    ],
    correct: "B", npcReports: { kuzin: 78, cheri: 61, malin: 84, kokin: 55 } },
  { id: "villa", spec: "CASE-02", title: "Luxury villa",
    question: "Ravi starts a three-storey villa with imported stone and a pool, still on the same declared wage. The mason whispers that the permit is “being arranged.” What is the lawful action?",
    options: [
      { id: "A", text: "Ask for a job on the site and take cash in an envelope at the end of each floor." },
      { id: "B", text: "Stay silent. It is his plot. A man may build as he likes if the neighbours like the look of it." },
      { id: "C", text: "Report the unexplained build. Ask for the building-permit file. The declared wage does not fund this villa." },
      { id: "D", text: "Tell the district councillor privately over a drink and treat a nod as the permit." },
    ],
    correct: "C", npcReports: { kuzin: 66, cheri: 80, malin: 72, kokin: 58 } },
  { id: "boat", spec: "CASE-03", title: "Luxury boat",
    question: "A cabin cruiser appears on a trailer behind the villa. No registry number, cash for fuel, night runs toward the reef. Ravi offers you a free fishing trip if you stay silent. What must you do?",
    options: [
      { id: "A", text: "Take the trip, photograph the sunset, and keep the boat off every file." },
      { id: "B", text: "Report the unregistered vessel and the cash fuel pattern. An undeclared marine asset plus night cash runs is a trafficking flag." },
      { id: "C", text: "Move the trailer behind the market shed so the police patrol does not see it." },
      { id: "D", text: "Stay silent. A coastal worker may keep a boat." },
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
      { id: "A", text: "Stay silent. Guests are private. A host may receive who he likes." },
      { id: "B", text: "Take cash to “look the other way at the gate” and keep the names off every file." },
      { id: "C", text: "Walk into the villa alone at night and order the group to leave, with no police file." },
      { id: "D", text: "Report suspected harbouring and trafficking to the police. Do not stay silent. Do not confront the villa yourself." },
    ],
    correct: "D", npcReports: { kuzin: 70, cheri: 62, malin: 77, kokin: 85 } },
  { id: "cash", spec: "CASE-06", title: "Cash gifts",
    question: "Ravi starts paying neighbours’ shop debts and school fees in cash, still on a declared wage of Rs 15,000. He calls it charity and asks you not to write it down. What is the lawful action?",
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
      { id: "A", text: "Tell them to keep it down. A quiet lane is enough if nobody asks for help." },
      { id: "B", text: "Walk away. What happens indoors is nobody's business, and a neighbour should not step in." },
      { id: "C", text: "If someone may be unsafe, help them reach safety. Do not barge in or film it." },
      { id: "D", text: "Record through the curtain and post it, so the village shames the house tonight." },
    ], correct: "C" },
  { id: "believe", spec: "LINE-02", title: "Believe them",
    question: "Someone you know says their partner hurt them, then asks you not to make a scene. What is the safe answer?",
    options: [
      { id: "A", text: "Sit both of them down tonight and mediate until there is an apology on the table." },
      { id: "B", text: "Tell them to go back and calm the partner down before anyone else is called." },
      { id: "C", text: "Believe them. Do not confront the partner. Help them reach a safe place." },
      { id: "D", text: "Ask what they did to cause it before you take a side or call anyone." },
    ], correct: "C" },
  { id: "control", spec: "LINE-03", title: "Control counts",
    question: "You see no bruise. The partner holds the money, the phone, and who they are allowed to see. Is this domestic violence?",
    options: [
      { id: "A", text: "No. If there is no mark, there is no violence worth a report." },
      { id: "B", text: "Only if they are married. An unmarried partner is still a private row." },
      { id: "C", text: "Yes. Control and cutting off money are abuse, even with no bruise." },
      { id: "D", text: "Only once a neighbour has complained in writing to the council." },
    ], correct: "C" },
  { id: "grok", spec: "LINE-04", title: "What AI refuses",
    question: "Someone asks AI to draft a threat to a partner, or to explain how to follow them home. What does AI do?",
    options: [
      { id: "A", text: "Write the threat, but softer, so it sounds like a joke between friends." },
      { id: "B", text: "Refuse. AI will not help anyone threaten, stalk, or control a partner." },
      { id: "C", text: "Give the tracking steps if they say it is only for their protection." },
      { id: "D", text: "Stay neutral and explain both how to threaten and how to get away." },
    ], correct: "B" },
  { id: "hotline", spec: "LINE-05", title: "Call for help",
    question: "Someone needs help now and cannot talk safely in the house. What do you do?",
    options: [
      { id: "A", text: "Wait for the Saturday market and tell the council once the lane is quiet." },
      { id: "B", text: "Call your local whistle-blower line or the police." },
      { id: "C", text: "Post a message in the village group before you call anyone at all." },
      { id: "D", text: "Call only if a bruise will show in a photo taken tonight." },
    ], correct: "B" },
  { id: "child", spec: "LINE-06", title: "A child is scared",
    question: "A child from the house says they are scared of the shouting and asks you to keep it a secret. What is the safe answer?",
    options: [
      { id: "A", text: "Promise to tell no one, and send the child back inside to see if it has stopped." },
      { id: "B", text: "Ask the child to describe the violence in detail before you decide what to do." },
      { id: "C", text: "A child in danger does not keep that secret. Do not send them back." },
      { id: "D", text: "Wait until a parent invites you in, then mediate between the adults." },
    ], correct: "C" },
];
const HSHORT = { private: "Private", believe: "Believe", control: "Control", grok: "AI", hotline: "Line", child: "Child" };
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
      { id: "A", text: "Leave it. A lease on state land includes the beach in front of the campement." },
      { id: "B", text: "Move the rope at night and say nothing to the district council." },
      { id: "C", text: "The shore and the public path stay open. A campement lease is not the beach." },
      { id: "D", text: "Charge visitors a fee and split it with him at the end of the week." },
    ] },
  { id: "title", spec: "PLOT-02", title: "Sold as freehold", correct: "B",
    question: "An agent offers a beachfront plot “for sale” and says the buyer will own it outright. The plan shows Pas Géométriques. What is the lawful action?",
    options: [
      { id: "A", text: "Take a commission and call the plot a private freehold in the advert." },
      { id: "B", text: "Pas Géométriques are state land. Do not broker the sale. Report the advert." },
      { id: "C", text: "Let the highest bidder take it if the village gets a share of the price." },
      { id: "D", text: "Redraw the plan so the plot looks inland and the sale can proceed." },
    ] },
  { id: "split", spec: "PLOT-03", title: "Under the threshold", correct: "C",
    question: "A promoter wants 20 villas on state coastal land. He splits the file into small lots so each stays under the EIA line, and starts selling off-plan before a Building and Land Use Permit. What is the lawful action?",
    options: [
      { id: "A", text: "Split the file. Under 50 units, no EIA is needed, and sales can start now." },
      { id: "B", text: "Cut the trees first so the site looks ready when the permit arrives." },
      { id: "C", text: "One project is one file. No works and no sale before the EIA and the permit." },
      { id: "D", text: "Ask the council clerk to nod it through after hours, off the register." },
    ] },
  { id: "wetland", spec: "PLOT-04", title: "The filled wetland", correct: "C",
    question: "A contractor dumps fill into the wetland behind the lane so a slab can be poured. He calls it landscaping and says the flood drain can be piped later. What is the lawful action?",
    options: [
      { id: "A", text: "Sign it as landscaping. Wetland soil is spare land once the drain is moved." },
      { id: "B", text: "Pipe the drain under the fill and keep the wetland off the plan." },
      { id: "C", text: "A wetland and its drain are not spare land. Stop the fill and report it." },
      { id: "D", text: "Fill only the edge, so most of the wetland can be said to remain." },
    ] },
  { id: "sign", spec: "PLOT-05", title: "The borrowed signature", correct: "B",
    question: "Someone offers to upload plans on the National Electronic Licensing System using a registered architect’s electronic signature. The architect did not draw them. The house is over 150 m². What is the lawful action?",
    options: [
      { id: "A", text: "Use the signature. The platform only checks that a name is on the file." },
      { id: "B", text: "That is a false document. Refuse. The architect who did the work must sign it." },
      { id: "C", text: "Pay the architect a small fee after the permit and backdate the drawing." },
      { id: "D", text: "Put your own name down as architect. The council will not check the register." },
    ] },
  { id: "idle", spec: "PLOT-06", title: "Idle allocation", correct: "D",
    question: "A relative was given agricultural land by the state and has left it empty. A developer offers cash to pour a slab, call it a shed, and “convert it later”. What is the lawful action?",
    options: [
      { id: "A", text: "Pour the slab. Conversion can be applied for after the house is up." },
      { id: "B", text: "Leave it idle. Allocated land can sit unused as long as the family likes." },
      { id: "C", text: "Take the cash and keep the file marked as crops until the house is sold." },
      { id: "D", text: "Allocated land is for farming. A change of use needs a permit before the slab." },
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
      { id: "B", text: "Refuse the order. Race is protected. The counter stays open to everyone." },
      { id: "C", text: "Serve them at the back door only, and call it a quieter arrangement." },
      { id: "D", text: "Ask them to send someone else from the family to collect the order." },
    ] },
  { id: "creed", spec: "FAIR-02", title: "The empty desk", correct: "C",
    question: "A school keeps a desk empty because the child follows another creed. A teacher says the child can sit if they hide the sign of their faith. What is the lawful action?",
    options: [
      { id: "A", text: "Keep the desk empty. Creed belongs at home, not in a classroom." },
      { id: "B", text: "Tell the child to hide the sign, then let them sit with the others." },
      { id: "C", text: "Creed is protected. The desk stays open. Do not make the child hide their faith." },
      { id: "D", text: "Move the child to a separate class and call it a way to keep the peace." },
    ] },
  { id: "sex", spec: "FAIR-03", title: "Struck from the list", correct: "A",
    question: "A foreman strikes a qualified woman from the night-shift list. He says the work is not for women, and that she might become pregnant. What is the lawful action?",
    options: [
      { id: "A", text: "Put her back on the list. Sex and pregnancy are protected." },
      { id: "B", text: "Offer her a lower-paid day role and call it kindness from the site." },
      { id: "C", text: "Ask her to sign that she will not have children while the job lasts." },
      { id: "D", text: "Leave the list as it is. The foreman knows the work better than you." },
    ] },
  { id: "age", spec: "FAIR-04", title: "Too old for the route", correct: "D",
    question: "A qualified driver of 58 is refused the route. There is no safety rule that sets an age. The note says “too old”. What is the lawful action?",
    options: [
      { id: "A", text: "Agree. After 55 the route is closed, whatever her record says." },
      { id: "B", text: "Rewrite her age on the form so the note goes away before the panel sits." },
      { id: "C", text: "Give her a week unpaid, then decide once the route is quiet." },
      { id: "D", text: "Age alone is not a reason. Restore her application and report the bar." },
    ] },
  { id: "colour", spec: "FAIR-05", title: "Moved down the queue", correct: "C",
    question: "A housing clerk moves a file down the queue because of the applicant’s colour. He says it will “keep the peace”. What is the lawful action?",
    options: [
      { id: "A", text: "Leave the file where he put it. The queue is his to arrange." },
      { id: "B", text: "Move every file of that colour together and call it order." },
      { id: "C", text: "Colour is protected. Put the file back in its place." },
      { id: "D", text: "Tell the applicant to wait a year and apply under another name." },
    ] },
  { id: "notice", spec: "FAIR-06", title: "The barred hall", correct: "B",
    question: "Someone asks you to print a notice that bars a race, a faith, women, or people over a certain age from the village hall. What is the lawful action?",
    options: [
      { id: "A", text: "Print it if the hall committee voted and the booking book is full." },
      { id: "B", text: "Refuse. Do not print it and do not help write it." },
      { id: "C", text: "Print a softer line that says preference instead of barred." },
      { id: "D", text: "Put the notice up for one week, then take it down before anyone complains." },
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
      { id: "A", text: "Use it. A fungicide is a fungicide, and lettuce is close enough to the label." },
      { id: "B", text: "Use half the dose so the residue stays small and the leaves still look clean." },
      { id: "C", text: "Do not use it. A pesticide may be used only on the crop it is listed for." },
      { id: "D", text: "Spray at night so no one sees the label, then wash the leaves at dawn." },
    ] },
  { id: "wait", spec: "CROP-02", title: "The waiting days", correct: "D",
    question: "The lettuce was sprayed this morning. The label says do not harvest for seven days. A buyer is at the gate and will pay cash today. What is the lawful action?",
    options: [
      { id: "A", text: "Cut it. Washing removes the residue before the stall opens." },
      { id: "B", text: "Cut only the outer leaves and sell the heart as the clean part." },
      { id: "C", text: "Tell the buyer it is organic and take the cash today." },
      { id: "D", text: "Wait out the interval on the label. Do not take the cash today." },
    ] },
  { id: "bottle", spec: "CROP-03", title: "The unmarked bottle", correct: "B",
    question: "A seller offers a cheap pesticide in a soft-drink bottle, with no label and no approval for your crop. He says everyone in the field uses it. What is the lawful action?",
    options: [
      { id: "A", text: "Buy it. A lower price is the same chemical, and the field already uses it." },
      { id: "B", text: "Refuse it. Do not store or spray an unmarked bottle." },
      { id: "C", text: "Pour it into your own tank and write the crop name on the bottle yourself." },
      { id: "D", text: "Use it once, on a corner of the field, to see if the leaves hold." },
    ] },
  { id: "cans", spec: "CROP-04", title: "The empty cans", correct: "D",
    question: "After spraying, the empty cans are piled by the canal. Someone says to rinse them into the water, or to burn them behind the shed. What is the lawful action?",
    options: [
      { id: "A", text: "Rinse them into the canal. The water will carry the residue off by morning." },
      { id: "B", text: "Burn them behind the shed. Ash is cleaner than a pile of plastic." },
      { id: "C", text: "Bury them in the bed you will plant next week, under the new soil." },
      { id: "D", text: "Do not rinse them into the canal or burn them. Take them to the collection point." },
    ] },
  { id: "mix", spec: "CROP-05", title: "The mix", correct: "C",
    question: "A grower mixes three pesticides so that each one stays under its own limit. He says the law only checks one chemical at a time. What is the lawful action?",
    options: [
      { id: "A", text: "Mix them. If each stays under its limit, the lot is legal to sell." },
      { id: "B", text: "Mix them, then add water until the colour looks light enough for the stall." },
      { id: "C", text: "Do not mix them to dodge the limit. Use only the product listed for that crop." },
      { id: "D", text: "Mix them on the imported lot only. Local lots must stay a single product." },
    ] },
  { id: "stall", spec: "CROP-06", title: "The lot already eaten", correct: "C",
    question: "A lot of coriander fails the test: the pesticide was not recommended for that crop. The result is late. The stallholder says sell what is left, because people have already eaten the rest. What is the lawful action?",
    options: [
      { id: "A", text: "Sell the rest. The damage is already done, and people have eaten from the lot." },
      { id: "B", text: "Move it to another stall and do not mention the test to the buyers." },
      { id: "C", text: "Do not sell the rest. A failed lot stays off the stall. Keep the spray record." },
      { id: "D", text: "Sell it cooked. Heat removes the residue before it reaches the plate." },
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
      { id: "A", text: "File it. A company with no staff is normal for a holding shelf." },
      { id: "B", text: "Put your own name as director so the file looks local." },
      { id: "C", text: "A company with no trade and a hidden official is not a client. Refuse it." },
      { id: "D", text: "Change the invoices so they name a different port." },
    ] },
  { id: "desk", spec: "WASH-02", title: "The silent desk", correct: "D",
    question: "A private banker is told to receive a large sum from a foreign foundation, then send it the same day to Dubai and a luxury estate agent. The customer will not say where the money came from. What is the lawful action?",
    options: [
      { id: "A", text: "Process it. Speed is a service the desk is paid to give." },
      { id: "B", text: "Take the fee, then send a note to compliance tomorrow." },
      { id: "C", text: "Split the sum across three accounts so no single transfer looks large." },
      { id: "D", text: "Do not complete the transfer. No source of funds, no transfer." },
    ] },
  { id: "deed", spec: "WASH-03", title: "The deed", correct: "C",
    question: "An estate agent is offered cash for a villa in a friend's name, plus a residence permit if the sale completes this week. The buyer has no work here and already owns three empty houses. What is the lawful action?",
    options: [
      { id: "A", text: "Sign. Property is clean once it has a title and a buyer." },
      { id: "B", text: "Take the cash but write a smaller price on the deed." },
      { id: "C", text: "A title does not clean the money. Refuse the cash sale." },
      { id: "D", text: "Rent the villa to the buyer first so it looks lived in." },
    ] },
  { id: "loop", spec: "WASH-04", title: "The loop", correct: "C",
    question: "A promoter wants a local company to invest in his own group at home. The money left that country last year as a loan to a shell here. Now it comes back as foreign investment, with a claim to pay almost no tax. What is the lawful action?",
    options: [
      { id: "A", text: "Sign the treaty form. The loop is just an efficient structure." },
      { id: "B", text: "Change the loan into a gift so the trail breaks before it comes home." },
      { id: "C", text: "Money that leaves and comes home is not foreign. Do not certify the claim." },
      { id: "D", text: "Use two extra shells so the path is longer and harder to follow." },
    ] },
  { id: "bid", spec: "WASH-05", title: "The bid", correct: "D",
    question: "A state fuel contract is about to be awarded on an unsolicited offer. A local director is asked to invoice advisory fees to a party close to the award, then move the fee to a watch dealer. What is the lawful action?",
    options: [
      { id: "A", text: "Invoice it as consultancy. Procurement is politics, and the fee is advice." },
      { id: "B", text: "Wait until the contract is signed, then take the fee as a success charge." },
      { id: "C", text: "Pay the fee in cash so there is no transfer on the file." },
      { id: "D", text: "A kickback dressed as a fee is still a kickback. Do not invoice it." },
    ] },
  { id: "name", spec: "WASH-06", title: "The name", correct: "C",
    question: "A nominee is asked to sit on five companies. He will never see the books. He is told the owner is a family office. A note on the desk names a person under international sanctions. What is the lawful action?",
    options: [
      { id: "A", text: "Sign. A nominee is not liable if he never reads the file." },
      { id: "B", text: "Sign only four of the five and leave the last for another clerk." },
      { id: "C", text: "A nominee who hides the owner is part of the wash. Do not lend your name." },
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

const STAMP_CORRECT = 100;
const STAMP_WRONG = 20;
const STAMP_CASES = [
  { id: "envelope", spec: "STAMP-01", title: "The envelope", correct: "C",
    question: "A man slides an envelope under the glass with his trade-licence file. He says the posted fee is only for people who like to wait, and that this is how the counter works after lunch. What is the lawful action?",
    options: [
      { id: "A", text: "Take the envelope. The posted fee is for people who can wait." },
      { id: "B", text: "Take half, put a note in the file, and stamp it today." },
      { id: "C", text: "Refuse the envelope. The fee on the wall is the only fee." },
      { id: "D", text: "Stamp first, then send him to the cashier later if anyone asks." },
    ] },
  { id: "kin", spec: "STAMP-02", title: "The cousin", correct: "B",
    question: "Your cousin is at the window. Two papers are missing from the trade-licence file. She says you know the shop, you know the family, and a family should not be treated like a stranger. What is the lawful action?",
    options: [
      { id: "A", text: "Stamp it. A cousin is not a member of the public." },
      { id: "B", text: "Do not stamp it. A cousin at the window is still the public." },
      { id: "C", text: "Stamp it for three months so she can bring the papers later." },
      { id: "D", text: "Pass the file to the desk behind you and pretend you never saw it." },
    ] },
  { id: "plate", spec: "STAMP-03", title: "The plate", correct: "D",
    question: "A driver wants a public-service vehicle stamp. The fitness certificate is expired. He says the van is the same van as last year, the inspector is a friend, and the school run starts at dawn. What is the lawful action?",
    options: [
      { id: "A", text: "Stamp it. Last year's van is this year's van if the school run is waiting." },
      { id: "B", text: "Stamp it and tell him to do the fitness next week." },
      { id: "C", text: "Call the inspector and ask him to sign from home." },
      { id: "D", text: "Do not stamp it. An expired certificate is not a certificate." },
    ] },
  { id: "slab", spec: "STAMP-04", title: "The slab", correct: "C",
    question: "A builder wants the Building and Land Use Permit stamped today. The file has no approved plan and no neighbour notice. He says the slab is already poured, the workers are on site, and stopping now will cost him. What is the lawful action?",
    options: [
      { id: "A", text: "Stamp it. A poured slab means the permit is only paperwork." },
      { id: "B", text: "Ask him to pour the rest after dark so the file can catch up." },
      { id: "C", text: "Do not stamp it. Works before a permit do not create the permit." },
      { id: "D", text: "Stamp a smaller building than the one on site so the file looks modest." },
    ] },
  { id: "calendar", spec: "STAMP-05", title: "The calendar", correct: "B",
    question: "A food-premises licence expired last month. The inspection is not booked. The stallholder says stamp the renewal now and put the inspection on next month's calendar, because the bazaar cannot wait. What is the lawful action?",
    options: [
      { id: "A", text: "Stamp the renewal. An inspection can follow a busy week at the bazaar." },
      { id: "B", text: "Do not stamp it. No inspection, no licence." },
      { id: "C", text: "Stamp it and write inspection pending in pencil." },
      { id: "D", text: "Let him trade at the back of the bazaar, away from the main aisle." },
    ] },
  { id: "listing", spec: "STAMP-06", title: "The listing", correct: "C",
    question: "A villa is already on a booking site. Guests arrive tonight. The file has no Tourist Enterprise Licence and no Building and Land Use Permit in the applicant's name. The holder says the rooms have always been the family's, and that a private sum will move the old card into a nephew's name under the glass. What is the lawful action?",
    options: [
      { id: "A", text: "Stamp the old card into the nephew's name. A family villa is already a guesthouse." },
      { id: "B", text: "Stamp it for this weekend only, so the guests are not turned away." },
      { id: "C", text: "Do not stamp it. A booked night is not a licence. He applies in his own name." },
      { id: "D", text: "Change only the first name on the old card and leave the house number as it is." },
    ] },
];
const STAMPSHORT = { envelope: "Envelope", kin: "Kin", plate: "Plate", slab: "Slab", calendar: "Date", listing: "Listing" };
function roundSevenCleared(results) {
  return results.length >= WASH_CASES.length && results.every((r) => r.correct);
}
function stampCaseById(id) { return STAMP_CASES.find((c) => c.id === id) ?? STAMP_CASES[0]; }
function firstOpenStampId(results) {
  const done = new Set(results.map((r) => r.caseId));
  return STAMP_CASES.find((c) => !done.has(c.id))?.id ?? STAMP_CASES[0].id;
}
function stampOutcomeOf(score, answered) {
  if (answered < STAMP_CASES.length) return "open";
  if (score >= 500) return "click";
  if (score >= 280) return "smear";
  return "shut";
}
const ROLL_CORRECT = 100;
const ROLL_WRONG = 20;
const ROLL_CASES = [
  { id: "after", spec: "ROLL-01", title: "After the close", correct: "C",
    question: "A neighbour comes after the register has closed. His name is not on it. He says you know the house, the street, and that one line in pencil will not hurt the count. What is the lawful action?",
    options: [
      { id: "A", text: "Add the name. A neighbour is already an elector, so the line is a formality." },
      { id: "B", text: "Add him on a second sheet and keep that sheet in the drawer." },
      { id: "C", text: "Do not add him. The register closed. A line after the close is not an elector." },
      { id: "D", text: "Let him vote if he promises to register tomorrow morning." },
    ] },
  { id: "twice", spec: "ROLL-02", title: "Two lists", correct: "B",
    question: "A cousin is on the roll here and on the roll in another place. She says she will vote only once, and that you should pick the shorter queue for her. What is the lawful action?",
    options: [
      { id: "A", text: "Cross her off one list yourself and let her choose the queue." },
      { id: "B", text: "One person, one roll, one vote. Report the double entry." },
      { id: "C", text: "Let her vote here. The other list is another station's problem." },
      { id: "D", text: "Tear the page out so the double name never existed." },
    ] },
  { id: "envelope", spec: "ROLL-03", title: "The envelope", correct: "D",
    question: "A man puts an envelope in your hand outside the station. He says it is for the people who vote the right way, and that you only have to point them to the right mark. What is the lawful action?",
    options: [
      { id: "A", text: "Hold the envelope until the count, then return what is left." },
      { id: "B", text: "Point, but do not touch the money, so the offer stays his." },
      { id: "C", text: "Share it with the staff so no one person is to blame." },
      { id: "D", text: "Do not take it. Money for a mark is not a campaign." },
    ] },
  { id: "ride", spec: "ROLL-04", title: "The ride", correct: "C",
    question: "A van is at the gate. The driver says the ride is free if the passenger shows him the marked paper before going in. The passenger is tired and the hill is steep. What is the lawful action?",
    options: [
      { id: "A", text: "Let the van stay. A tired voter is still a voter." },
      { id: "B", text: "Let them show the paper, then fold it again before they board." },
      { id: "C", text: "Stop it. A ride paid by a shown ballot is a purchase." },
      { id: "D", text: "Send the van around the back, where the queue cannot see the bargain." },
    ] },
  { id: "photo", spec: "ROLL-05", title: "The photo", correct: "A",
    question: "Inside the booth, a voter lifts a phone over the paper. She says her brother must see the mark before he pays the fare home. What is the lawful action?",
    options: [
      { id: "A", text: "Stop the photo. The ballot is secret. Call the presiding officer." },
      { id: "B", text: "Let her take one photo if she deletes it after the fare is paid." },
      { id: "C", text: "Look away. The booth is private, so the phone is private too." },
      { id: "D", text: "Take the photo yourself, so the family can be sure of the mark." },
    ] },
  { id: "lift", spec: "ROLL-06", title: "The lift", correct: "B",
    question: "The box is sealed. A helper says his van is closer than the official car, the rain is starting, and the box only needs a lift to the count. What is the lawful action?",
    options: [
      { id: "A", text: "Let him take it. A sealed box is safe in any van." },
      { id: "B", text: "Do not hand it over. A sealed box moves only with the officers." },
      { id: "C", text: "Break the seal, count it here, and send him with the totals." },
      { id: "D", text: "Send the box with him and keep the seal in your pocket." },
    ] },
];
const ROLLSHORT = { after: "Close", twice: "Lists", envelope: "Cash", ride: "Ride", photo: "Photo", lift: "Lift" };
function roundEightCleared(results) {
  return results.length >= STAMP_CASES.length && results.every((r) => r.correct);
}
function rollCaseById(id) { return ROLL_CASES.find((c) => c.id === id) ?? ROLL_CASES[0]; }
function firstOpenRollId(results) {
  const done = new Set(results.map((r) => r.caseId));
  return ROLL_CASES.find((c) => !done.has(c.id))?.id ?? ROLL_CASES[0].id;
}
function rollOutcomeOf(score, answered) {
  if (answered < ROLL_CASES.length) return "open";
  if (score >= 500) return "list";
  if (score >= 280) return "sheet";
  return "van";
}
const OATH_CORRECT = 100;
const OATH_WRONG = 20;
const OATH_CASES = [
  { id: "cousin", spec: "OATH-01", title: "The cousin", correct: "C",
    question: "You hold the chair. The next item awards a contract to a firm your cousin runs. Someone says you may stay if you do not speak. What is the lawful action?",
    options: [
      { id: "A", text: "Stay, and vote. The chair is above the family." },
      { id: "B", text: "Stay silent. Not speaking is the same as leaving the decision." },
      { id: "C", text: "Say the interest before the vote, then leave the decision." },
      { id: "D", text: "Ask your cousin to use another name on the paper, then stay." },
    ] },
  { id: "minute", spec: "OATH-02", title: "After the room", correct: "B",
    question: "The vote is over and the room is empty. An officer asks you to add one line to the minute: that the award was unanimous. It was not. What is the lawful action?",
    options: [
      { id: "A", text: "Add it. A tidy minute is a kinder minute." },
      { id: "B", text: "Do not add it. The minute is what was said." },
      { id: "C", text: "Add it in pencil, so it can be rubbed out if anyone asks." },
      { id: "D", text: "Initial the new line and keep the old page in your drawer." },
    ] },
  { id: "gift", spec: "OATH-03", title: "The gift", correct: "D",
    question: "The award is signed. That evening a hamper arrives at your door. The card says it is only a thank-you from the village, and that the decision is already done. What is the lawful action?",
    options: [
      { id: "A", text: "Keep it. A thank-you after the signature is not a bribe." },
      { id: "B", text: "Keep the food and return the card, so the gift is only hospitality." },
      { id: "C", text: "Give it to the office kitchen so it becomes public." },
      { id: "D", text: "Do not keep it. A gift after an award is still for the award." },
    ] },
  { id: "silence", spec: "OATH-04", title: "The silence", correct: "A",
    question: "You learn before the vote that another member will gain from the item. He has not said so. He asks you to leave it, because the room is tired and the matter is small. What is the lawful action?",
    options: [
      { id: "A", text: "Say it in the room, before the vote. He declares it or he steps out." },
      { id: "B", text: "Tell him privately after the vote, so the minute stays clean." },
      { id: "C", text: "Abstain yourself and let his vote stand, so the room can finish." },
      { id: "D", text: "Mention it only if his side loses, and keep it out of the minute." },
    ] },
  { id: "unread", spec: "OATH-05", title: "The unread page", correct: "C",
    question: "A page is put in front of you at the end of the meeting. You have not read it. The clerk says the bus is waiting, the date is today, and a chair who delays is a chair who fails. What is the lawful action?",
    options: [
      { id: "A", text: "Sign it. The bus is a deadline, and a chair who delays fails the room." },
      { id: "B", text: "Sign it and read it in the morning, once the date is safe." },
      { id: "C", text: "Do not sign it. What you have not read is not yet yours." },
      { id: "D", text: "Sign the last page only. The rest can be assumed." },
    ] },
  { id: "key", spec: "OATH-06", title: "The key", correct: "B",
    question: "A friend asks for the key you were told to log and return. He says he only needs the room on Sunday, and that an empty drawer will not be noticed until Monday. What is the lawful action?",
    options: [
      { id: "A", text: "Lend it. Sunday is not a working day, and the drawer will be full again on Monday." },
      { id: "B", text: "Do not lend it. The key is the office, not a favour. It is logged and returned." },
      { id: "C", text: "Lend it if he promises not to open the cabinet." },
      { id: "D", text: "Leave it under the mat and say you lost it on the way back." },
    ] },
];
const OATHSHORT = { cousin: "Cousin", minute: "Minute", gift: "Gift", silence: "Silence", unread: "Page", key: "Key" };
function roundNineCleared(results) {
  return results.length >= ROLL_CASES.length && results.every((r) => r.correct);
}
function roundTenCleared(results) {
  return results.length >= OATH_CASES.length && results.every((r) => r.correct);
}
function allStagesCorrect(state) {
  return roundOneCleared(state.results, state.contractorId)
    && roundTwoCleared(state.whistleResults)
    && roundThreeCleared(state.havenResults)
    && roundFourCleared(state.landResults)
    && roundFiveCleared(state.fairResults)
    && roundSixCleared(state.cropResults)
    && roundSevenCleared(state.washResults)
    && roundEightCleared(state.stampResults)
    && roundNineCleared(state.rollResults)
    && roundTenCleared(state.oathResults);
}
function oathCaseById(id) { return OATH_CASES.find((c) => c.id === id) ?? OATH_CASES[0]; }
function firstOpenOathId(results) {
  const done = new Set(results.map((r) => r.caseId));
  return OATH_CASES.find((c) => !done.has(c.id))?.id ?? OATH_CASES[0].id;
}
function oathOutcomeOf(score, answered) {
  if (answered < OATH_CASES.length) return "open";
  if (score >= 500) return "whole";
  if (score >= 280) return "page";
  return "lost";
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
    this.scene.fog = new THREE.Fog(0x8ea4b8, 36, 62);
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
    this.stamp = new StampScene(this.scene);
    this.roll = new RollScene(this.scene);
    this.oath = new OathScene(this.scene);
    this.havenOutcome = "open";
    this.havenCorrect = 0;
    this.landOutcome = "open";
    this.landCorrect = 0;

    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(canvas.parentElement ?? canvas);
    this.resize();
    canvas.addEventListener("pointermove", this.onMove);
    canvas.addEventListener("pointerdown", this.onDown);
    canvas.addEventListener("pointerup", this.onUp);
    canvas.addEventListener("pointercancel", this.onCancel);
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
    this.stampOutcome = next.stampOutcome || "open";
    this.stampCorrect = next.stampCorrect || 0;
    this.rollOutcome = next.rollOutcome || "open";
    this.rollCorrect = next.rollCorrect || 0;
    this.oathOutcome = next.oathOutcome || "open";
    this.oathCorrect = next.oathCorrect || 0;
    this.prizeOpen = Boolean(next.prizeOpen);
    this.fairHeld = next.fairHeld || [];
    this.haven.sync(this.competition, this.havenOutcome, this.havenCorrect);
    this.land.sync(this.competition, this.landOutcome, this.landCorrect, next.landHeld, next.landActive, next.landSeen);
    this.fair.sync(this.competition, this.fairOutcome, this.fairCorrect, this.fairHeld);
    this.crop.sync(this.competition, this.cropOutcome, this.cropCorrect);
    this.wash.sync(this.competition, this.washOutcome, this.washCorrect);
    this.stamp.sync(this.competition, this.stampOutcome, this.stampCorrect, next.stampDesks, next.stampActive);
    this.roll.sync(this.competition, this.rollOutcome, this.rollCorrect, next.rollMarks, next.rollActive);
    this.oath.sync(this.competition, this.oathOutcome, this.oathCorrect, next.oathMarks, next.oathActive);
    const solo = this.competition !== "tender";
    if (this.village) this.village.visible = !solo;
    if (this.wGroup) this.wGroup.visible = this.competition === "whistle";
    const mobile = this.canvas.clientWidth < 900 || this.canvas.clientHeight > this.canvas.clientWidth;
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
    const mobile = this.canvas.clientWidth < 900 || this.canvas.clientHeight > this.canvas.clientWidth;
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
    this.controls.minAzimuthAngle = -Infinity;
    this.controls.maxAzimuthAngle = Infinity;
    this.controls.minPolarAngle = 0.2;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
    if (!mobile) return;
    this.controls.autoRotate = false;
  }

  frameCompetition() {
    const fog = this.scene.fog;
    const view = new THREE.Vector3(0.4, 4.6, 11);
    if (this.competition === "oath") {
      fog.color.set(0x8ea4b8);
      this.scene.background = new THREE.Color(0x8ea4b8);
      const phone = this.canvas.clientWidth < 900 || this.canvas.clientHeight > this.canvas.clientWidth;
      this.aimStage(new THREE.Vector3(0, phone ? 1.18 : 1.08, phone ? -0.08 : -0.02), phone ? new THREE.Vector3(0.15, 6.4, 8.2) : view, phone ? 2.05 : 2.32);
      return;
    }
    if (this.competition === "roll") {
      fog.color.set(0x8ea4b8);
      this.scene.background = new THREE.Color(0x8ea4b8);
      const phone = this.canvas.clientWidth < 900 || this.canvas.clientHeight > this.canvas.clientWidth;
      this.aimStage(new THREE.Vector3(phone ? -0.7 : -1.05, phone ? 1.12 : 1.02, phone ? 0.25 : 0.4), phone ? new THREE.Vector3(0.15, 5.2, 9) : view, phone ? 3.0 : 3.45);
      return;
    }
    if (this.competition === "stamp") {
      fog.color.set(0x8ea4b8);
      this.scene.background = new THREE.Color(0x8ea4b8);
      this.aimStage(new THREE.Vector3(0, 0.95, 0.85), view, 3.3);
      return;
    }
    if (this.competition === "wash") {
      fog.color.set(0x8ea4b8);
      this.scene.background = new THREE.Color(0x8ea4b8);
      this.aimStage(new THREE.Vector3(0.05, 2.05, 0.75), view, 2.3);
      return;
    }
    if (this.competition === "crop") {
      fog.color.set(0x8ea4b8);
      this.scene.background = new THREE.Color(0x8ea4b8);
      this.aimStage(new THREE.Vector3(0, 0.8, 0), view, 2.2);
      return;
    }
    if (this.competition === "fair") {
      fog.color.set(0x8ea4b8);
      this.scene.background = new THREE.Color(0x8ea4b8);
      this.aimStage(new THREE.Vector3(0.05, 1.15, 0.35), view, 1.7);
      return;
    }
    if (this.competition === "land") {
      fog.color.set(0x9aa8b0);
      this.scene.background = new THREE.Color(0x9aa8b0);
      this.aimStage(new THREE.Vector3(0.3, 1.0, 1.7), view, 2.8);
      return;
    }
    if (this.competition === "haven") {
      fog.color.set(0x8ea4b8);
      this.scene.background = new THREE.Color(0x8ea4b8);
      this.aimStage(new THREE.Vector3(0, 1.05, 0.2), view, 2.2);
      return;
    }
    if (this.competition !== "whistle") {
      fog.color.set(0x8ea4b8);
      this.scene.background = new THREE.Color(0x8ea4b8);
      this.aimStage(new THREE.Vector3(0.2, 1.05, 0.7), view, 3.2);
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
    this.aimStage(new THREE.Vector3(5.2, 1.55, 6.7), view, 4.15);
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
    return fill;
  }

  addCorrugatedFace(parts, x, y, z, w, h, d, axis, opts = {}) {
    const rust = { fill: opts.fill ?? 0.92, depth: true, color: opts.color ?? 0x8a4b32 };
    this.addWBox(this.wGroup, this.wGeos, parts, x, y, z, w, h, d, rust);
    const along = axis === "x" ? w : d;
    const n = Math.max(4, Math.round(along / 0.16));
    const rib = { fill: rust.fill, depth: true, color: opts.rib ?? 0x6a3824 };
    for (let i = 0; i < n; i++) {
      const u = -along / 2 + (i + 0.5) * (along / n);
      if (axis === "x") this.addWBox(this.wGroup, this.wGeos, parts, x + u, y, z + d * 0.52, 0.04, h * 0.94, 0.03, rib);
      else this.addWBox(this.wGroup, this.wGeos, parts, x + w * 0.52, y, z + u, 0.03, h * 0.94, 0.04, rib);
    }
  }

  addRustyShack(parts, x, z, scale = 1) {
    const s = scale;
    const W = 1.12 * s, D = 0.9 * s, H = 1.05 * s;
    const rust = { fill: 0.94, depth: true, color: 0x8a4b32 };
    const dark = { fill: 0.94, depth: true, color: 0x4a2a1c };
    this.addCorrugatedFace(parts, x, H / 2, z + D / 2, W, H, 0.07 * s, "x", rust);
    this.addCorrugatedFace(parts, x, H / 2, z - D / 2, W, H, 0.07 * s, "x", rust);
    this.addCorrugatedFace(parts, x + W / 2, H / 2, z, 0.07 * s, H, D, "z", rust);
    this.addCorrugatedFace(parts, x - W / 2, H / 2, z, 0.07 * s, H, D, "z", rust);
    this.addWBox(this.wGroup, this.wGeos, parts, x - 0.16 * s, 0.4 * s, z + D / 2 + 0.01, 0.26 * s, 0.7 * s, 0.04 * s, dark);
    const roof = this.addWBox(this.wGroup, this.wGeos, parts, x, H + 0.07 * s, z, W + 0.16 * s, 0.055 * s, D + 0.2 * s, { fill: 0.94, depth: true, color: 0x6e3a26 });
    roof.rotation.z = 0.09;
    for (let i = 0; i < 5; i++) {
      const u = -W / 2 + (i + 0.5) * (W / 5);
      this.addWBox(this.wGroup, this.wGeos, parts, x + u, H + 0.11 * s, z, 0.035 * s, 0.028 * s, D + 0.16 * s, { fill: 0.94, depth: true, color: 0x5a2e1c });
    }
  }

  addCiteTree(x, z, scale = 1) {
    const g = new THREE.Group();
    const bark = new THREE.MeshStandardMaterial({ color: 0x4a3424, roughness: 0.86 });
    const leaf = new THREE.MeshStandardMaterial({ color: 0x2f5a32, roughness: 0.78 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07 * scale, 0.1 * scale, 1.15 * scale, 6), bark);
    trunk.position.y = 0.55 * scale;
    trunk.castShadow = true;
    g.add(trunk);
    [[0, 1.45, 0, 0.55], [0.28, 1.28, 0.12, 0.38], [-0.22, 1.22, -0.16, 0.34]].forEach(([px, py, pz, r]) => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(r * scale, 8, 6), leaf);
      mesh.position.set(px * scale, py * scale, pz * scale);
      mesh.castShadow = true;
      g.add(mesh);
    });
    g.position.set(x, 0, z);
    this.wGroup.add(g);
    return g;
  }

  addLowWallRun(parts, ax, az, bx, bz, h = 0.56, thick = 0.1) {
    const dx = bx - ax, dz = bz - az;
    const len = Math.hypot(dx, dz);
    if (len < 0.05) return;
    const stone = { fill: 0.92, depth: true, color: 0xb7b1a4 };
    const cap = { fill: 0.92, depth: true, color: 0x9a9488 };
    const cx = (ax + bx) / 2, cz = (az + bz) / 2;
    const yaw = Math.atan2(dx, dz);
    const wall = this.addWBox(this.wGroup, this.wGeos, parts, cx, h / 2, cz, thick, h, len, stone);
    wall.rotation.y = yaw;
    const top = this.addWBox(this.wGroup, this.wGeos, parts, cx, h + 0.03, cz, thick + 0.04, 0.06, len + 0.04, cap);
    top.rotation.y = yaw;
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
    return fill;
  }

  addFloorShell(parts, cx, cy, cz, w, h, d) {
    const wall = 0.1;
    const winW = Math.min(w * 0.46, 1.2);
    const winH = Math.min(h * 0.48, 0.5);
    const sill = 0.22;
    const glass = { fill: 0.2, depth: false, color: 0x7ec8d4 };
    const stone = { fill: 0.5, depth: true };
    this.addWBox(this.wGroup, this.wGeos, parts, cx, cy - h / 2 + 0.05, cz, w - 0.04, 0.1, d - 0.04, stone);
    this.addWBox(this.wGroup, this.wGeos, parts, cx, cy + h / 2 - 0.04, cz, w, 0.08, d, stone);
    const faceX = (pos) => {
      const side = (d - winW) / 2;
      this.addWBox(this.wGroup, this.wGeos, parts, pos, cy, cz - winW / 2 - side / 2, wall, h, Math.max(0.12, side), stone);
      this.addWBox(this.wGroup, this.wGeos, parts, pos, cy, cz + winW / 2 + side / 2, wall, h, Math.max(0.12, side), stone);
      this.addWBox(this.wGroup, this.wGeos, parts, pos, cy - h / 2 + sill / 2, cz, wall, sill, winW + 0.04, stone);
      const topH = Math.max(0.12, h - sill - winH);
      this.addWBox(this.wGroup, this.wGeos, parts, pos, cy + h / 2 - topH / 2, cz, wall, topH, winW + 0.04, stone);
      this.addWBox(this.wGroup, this.wGeos, this.villaGlass, pos, cy - h / 2 + sill + winH / 2, cz, 0.03, winH, winW, glass);
    };
    const faceZ = (pos) => {
      const side = (w - winW) / 2;
      this.addWBox(this.wGroup, this.wGeos, parts, cx - winW / 2 - side / 2, cy, pos, Math.max(0.12, side), h, wall, stone);
      this.addWBox(this.wGroup, this.wGeos, parts, cx + winW / 2 + side / 2, cy, pos, Math.max(0.12, side), h, wall, stone);
      this.addWBox(this.wGroup, this.wGeos, parts, cx, cy - h / 2 + sill / 2, pos, winW + 0.04, sill, wall, stone);
      const topH = Math.max(0.12, h - sill - winH);
      this.addWBox(this.wGroup, this.wGeos, parts, cx, cy + h / 2 - topH / 2, pos, winW + 0.04, topH, wall, stone);
      this.addWBox(this.wGroup, this.wGeos, this.villaGlass, cx, cy - h / 2 + sill + winH / 2, pos, winW, winH, 0.03, glass);
    };
    faceX(cx - w / 2 + wall / 2);
    faceX(cx + w / 2 - wall / 2);
    faceZ(cz - d / 2 + wall / 2);
    faceZ(cz + d / 2 - wall / 2);
  }

  addLady(x, z, scale, look) {
    const g = new THREE.Group();
    const skin = new THREE.MeshStandardMaterial({ color: look.skin, roughness: 0.72, transparent: true, opacity: 1 });
    const hair = new THREE.MeshStandardMaterial({ color: look.hair, roughness: 0.55, transparent: true, opacity: 1 });
    const lockMat = new THREE.MeshStandardMaterial({ color: look.lock ?? look.hair, roughness: 0.58, transparent: true, opacity: 1 });
    const suit = new THREE.MeshStandardMaterial({ color: look.suit, roughness: 0.38, metalness: 0.08, transparent: true, opacity: 1 });
    const frame = new THREE.MeshStandardMaterial({ color: 0x2a2c30, roughness: 0.4, metalness: 0.35, transparent: true, opacity: 1 });
    const cloth = new THREE.MeshStandardMaterial({ color: 0xe7d7b8, roughness: 0.7, transparent: true, opacity: 1 });
    const glass = new THREE.MeshStandardMaterial({ color: 0xd7eef6, roughness: 0.12, metalness: 0.2, transparent: true, opacity: 0.32 });
    const layers = look.drink ?? [0xea2839, 0xf0c030, 0x00a551, 0x2d6bff];
    const drinkMats = layers.map((color) => new THREE.MeshStandardMaterial({ color, roughness: 0.28, transparent: true, opacity: 0.92 }));
    const put = (parent, geo, material, px, y, pz) => {
      this.wGeos.push(geo);
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.set(px, y, pz);
      mesh.castShadow = true;
      parent.add(mesh);
      return mesh;
    };
    const s = scale;
    const chair = new THREE.Group();
    put(chair, new THREE.BoxGeometry(0.46 * s, 0.05 * s, 0.72 * s), cloth, 0, 0.2 * s, 0.22 * s);
    put(chair, new THREE.BoxGeometry(0.46 * s, 0.05 * s, 0.55 * s), cloth, 0, 0.42 * s, -0.32 * s);
    put(chair, new THREE.BoxGeometry(0.05 * s, 0.16 * s, 0.78 * s), frame, -0.21 * s, 0.16 * s, 0.2 * s);
    put(chair, new THREE.BoxGeometry(0.05 * s, 0.16 * s, 0.78 * s), frame, 0.21 * s, 0.16 * s, 0.2 * s);
    put(chair, new THREE.BoxGeometry(0.05 * s, 0.42 * s, 0.05 * s), frame, -0.21 * s, 0.36 * s, -0.18 * s);
    put(chair, new THREE.BoxGeometry(0.05 * s, 0.42 * s, 0.05 * s), frame, 0.21 * s, 0.36 * s, -0.18 * s);
    chair.children[1].rotation.x = -0.72;
    chair.children[1].position.set(0, 0.38 * s, -0.28 * s);
    g.add(chair);
    const hips = new THREE.Group();
    hips.position.set(0, 0.26 * s, 0.16 * s);
    const legs = new THREE.Group();
    legs.rotation.x = 1.22;
    put(legs, new THREE.CapsuleGeometry(0.045 * s, 0.3 * s, 3, 6), skin, -0.07 * s, 0.16 * s, 0);
    put(legs, new THREE.CapsuleGeometry(0.045 * s, 0.3 * s, 3, 6), skin, 0.07 * s, 0.16 * s, 0);
    hips.add(legs);
    put(hips, new THREE.BoxGeometry(0.2 * s, 0.1 * s, 0.16 * s), suit, 0, 0.08 * s, 0);
    const torso = new THREE.Group();
    torso.position.set(0, 0.12 * s, -0.02 * s);
    torso.rotation.x = -0.72;
    put(torso, new THREE.BoxGeometry(0.2 * s, 0.26 * s, 0.12 * s), skin, 0, 0.16 * s, 0);
    put(torso, new THREE.BoxGeometry(0.18 * s, 0.07 * s, 0.12 * s), suit, 0, 0.22 * s, 0.01 * s);
    const arm = new THREE.Group();
    arm.position.set(0.15 * s, 0.2 * s, 0.02 * s);
    arm.rotation.x = -1.15;
    arm.rotation.z = -0.35;
    put(arm, new THREE.CapsuleGeometry(0.03 * s, 0.22 * s, 3, 5), skin, 0, -0.12 * s, 0);
    put(arm, new THREE.CylinderGeometry(0.008 * s, 0.012 * s, 0.07 * s, 6), glass, 0.02 * s, 0.02 * s, 0.09 * s);
    put(arm, new THREE.CylinderGeometry(0.038 * s, 0.02 * s, 0.09 * s, 8), glass, 0.02 * s, 0.09 * s, 0.09 * s);
    drinkMats.forEach((mat, i) => {
      put(arm, new THREE.CylinderGeometry(0.03 * s - i * 0.002, 0.026 * s - i * 0.002, 0.018 * s, 8), mat, 0.02 * s, 0.06 * s + i * 0.018 * s, 0.09 * s);
    });
    torso.add(arm);
    put(torso, new THREE.CapsuleGeometry(0.03 * s, 0.2 * s, 3, 5), skin, -0.15 * s, 0.12 * s, 0.04 * s);
    const head = put(torso, new THREE.SphereGeometry(0.09 * s, 12, 10), skin, 0, 0.38 * s, 0.02 * s);
    put(torso, new THREE.SphereGeometry(0.095 * s, 12, 8), hair, 0, 0.43 * s, -0.02 * s);
    if (look.locks) {
      for (let i = 0; i < 10; i++) {
        const side = i < 5 ? -1 : 1;
        const lock = put(torso, new THREE.CapsuleGeometry(0.016 * s, 0.22 * s, 3, 5), i % 3 === 0 ? lockMat : hair, side * (0.06 + (i % 5) * 0.018) * s, 0.28 * s, -0.06 * s);
        lock.rotation.x = 0.55 + (i % 4) * 0.12;
        lock.rotation.z = side * (0.25 + (i % 5) * 0.08);
      }
    } else {
      put(torso, new THREE.BoxGeometry(0.16 * s, 0.28 * s, 0.06 * s), hair, 0, 0.26 * s, -0.08 * s);
      put(torso, new THREE.BoxGeometry(0.12 * s, 0.34 * s, 0.05 * s), hair, 0.02 * s, 0.18 * s, -0.1 * s);
    }
    hips.add(torso);
    g.add(hips);
    g.position.set(x, 0, z);
    g.userData.lounge = true;
    g.userData.mats = [suit, skin, hair, lockMat, frame, cloth, ...drinkMats];
    g.userData.homeColors = g.userData.mats.map((m) => m.color.clone());
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
      new THREE.BoxGeometry(16.5, 0.04, 1.8),
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
    const shell = new THREE.MeshStandardMaterial({ color: 0xf4f5f3, roughness: 0.32, metalness: 0.22 });
    const joint = new THREE.MeshStandardMaterial({ color: 0x1a1c1f, roughness: 0.45, metalness: 0.4 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x14181c, roughness: 0.12, metalness: 0.55, emissive: 0x1a2830, emissiveIntensity: 0.2 });
    const put = (geo, material, x, y, z) => {
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      root.add(mesh);
      return mesh;
    };
    put(new THREE.BoxGeometry(0.52, 0.28, 1.35), shell, 0, 0.36, 0);
    put(new THREE.BoxGeometry(0.5, 0.22, 0.72), shell, 0, 0.58, -0.18);
    put(new THREE.BoxGeometry(0.46, 0.16, 0.28), glass, 0, 0.56, 0.52);
    put(new THREE.BoxGeometry(0.5, 0.1, 0.7), glass, 0, 0.6, -0.18);
    put(new THREE.BoxGeometry(0.54, 0.03, 1.42), joint, 0, 0.7, 0);
    put(new THREE.BoxGeometry(0.48, 0.04, 1.28), joint, 0, 0.24, 0);
    const stripe = [0xea2839, 0x1a206d, 0xffd500, 0x00a551];
    stripe.forEach((color, i) => {
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.15 });
      put(new THREE.BoxGeometry(0.02, 0.035, 0.28), mat, 0.27, 0.4, -0.48 + i * 0.3);
      put(new THREE.BoxGeometry(0.02, 0.035, 0.28), mat, -0.27, 0.4, -0.48 + i * 0.3);
    });
    const wheels = [];
    [-0.42, 0.46].forEach((z) => {
      [-0.26, 0.26].forEach((x) => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.07, 12), joint);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x, 0.14, z);
        root.add(wheel);
        const hub = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.05, 0.08, 8),
          new THREE.MeshStandardMaterial({ color: 0xd5d6d2, roughness: 0.3, metalness: 0.6 })
        );
        hub.rotation.z = Math.PI / 2;
        hub.position.set(x, 0.14, z);
        root.add(hub);
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
    this.villaGlass = { fills: [], lines: [] };
    this.car = { fills: [], lines: [] };
    this.carTrim = { fills: [], lines: [] };
    this.boat = { fills: [], lines: [] };
    this.boatHull = { fills: [], lines: [] };
    this.lodging = { fills: [], lines: [] };
    this.pool = { fills: [], lines: [] };
    this.floors = [{ fills: [], lines: [] }, { fills: [], lines: [] }, { fills: [], lines: [] }];
    this.lodgeSteps = [];
    this.figures = [];
    this.figureHome = [];
    const x = COMPOUND.x, z = COMPOUND.z;
    const solid = { fill: 0.34, depth: true };
    const f0 = this.floors[0], f1 = this.floors[1], f2 = this.floors[2];
    this.interior = { fills: [], lines: [] };
    this.addFloorShell(f0, x, 0.66, z, 3.3, 1.24, 2.35);
    this.addFloorShell(f1, x, 1.82, z, 3.15, 1.08, 2.2);
    this.addFloorShell(f2, x - 0.15, 2.86, z, 2.7, 0.98, 1.95);
    this.addWBox(this.wGroup, this.wGeos, f2, x - 0.15, 3.4, z, 2.9, 0.14, 2.15, solid);
    this.addWBox(this.wGroup, this.wGeos, f1, x + 0.05, 1.28, z + 1.22, 2.2, 0.1, 0.55, solid);
    this.addWCyl(this.wGroup, this.wGeos, f0, x - 1.45, 1.15, z + 1.05, 0.08, 2.3, 6, solid);
    this.addWCyl(this.wGroup, this.wGeos, f0, x + 1.45, 1.15, z + 1.05, 0.08, 2.3, 6, solid);
    const wood = { fill: 0.92, depth: true, color: 0x6d4c32 };
    const dark = { fill: 0.92, depth: true, color: 0x1a1c1f };
    const cream = { fill: 0.92, depth: true, color: 0xe7d7b8 };
    const tvGlow = { fill: 0.85, depth: true, color: 0x1a2838 };
    this.addWBox(this.wGroup, this.wGeos, this.interior, x - 0.35, 0.32, z + 0.15, 1.15, 0.28, 0.42, cream);
    this.addWBox(this.wGroup, this.wGeos, this.interior, x - 0.35, 0.48, z - 0.02, 1.15, 0.12, 0.1, cream);
    this.addWBox(this.wGroup, this.wGeos, this.interior, x + 0.45, 0.22, z + 0.05, 0.55, 0.12, 0.55, wood);
    this.addWBox(this.wGroup, this.wGeos, this.interior, x + 1.28, 0.55, z - 0.15, 0.06, 0.72, 1.05, dark);
    this.addWBox(this.wGroup, this.wGeos, this.interior, x + 1.24, 0.55, z - 0.15, 0.03, 0.62, 0.92, tvGlow);
    this.addWCyl(this.wGroup, this.wGeos, this.interior, x - 0.7, 0.22, z + 0.62, 0.38, 0.2, 10, { fill: 0.92, depth: true, color: 0xd5d6d2 });
    this.addWCyl(this.wGroup, this.wGeos, this.interior, x - 0.7, 0.3, z + 0.62, 0.3, 0.08, 10, { fill: 0.7, depth: true, color: 0x3ec8ff });
    this.addWBox(this.wGroup, this.wGeos, this.interior, x - 0.2, 1.48, z + 0.1, 0.9, 0.22, 0.38, cream);
    this.addWBox(this.wGroup, this.wGeos, this.interior, x + 0.55, 1.42, z - 0.2, 0.4, 0.1, 0.4, wood);
    this.addWBox(this.wGroup, this.wGeos, this.interior, x - 0.15, 2.52, z, 0.7, 0.18, 0.32, cream);
    this.addWBox(this.wGroup, this.wGeos, this.pool, x + 0.15, 0.05, z + 2.05, 2.5, 0.08, 1.35, { fill: 0.5, depth: true, color: CYAN });
    this.addWBox(this.wGroup, this.wGeos, this.pool, x + 0.15, 0.1, z + 2.05, 2.7, 0.06, 1.55, solid);
    const cx = x + 3.45, cz = z - 0.35;
    const carS = { fill: 0.94, depth: true, color: 0x1b3a32 };
    const carDark = { fill: 0.94, depth: true, color: 0x1a1c1f };
    const carGlass = { fill: 0.32, depth: true, color: 0x1a2428 };
    const carSeat = { fill: 0.94, depth: true, color: 0xc45c26 };
    const carCal = { fill: 0.94, depth: true, color: 0xf0c030 };
    this.addWBox(this.wGroup, this.wGeos, this.car, cx, 0.22, cz, 2.28, 0.2, 0.98, carS);
    this.addWBox(this.wGroup, this.wGeos, this.car, cx + 0.42, 0.34, cz, 1.22, 0.16, 0.92, carS);
    this.addWBox(this.wGroup, this.wGeos, this.car, cx + 0.92, 0.28, cz, 0.55, 0.12, 0.78, carS);
    this.addWBox(this.wGroup, this.wGeos, this.car, cx - 0.78, 0.3, cz, 0.62, 0.16, 0.9, carS);
    this.addWBox(this.wGroup, this.wGeos, this.car, cx - 0.12, 0.52, cz, 1.05, 0.22, 0.82, carS);
    this.addWBox(this.wGroup, this.wGeos, this.car, cx - 0.08, 0.66, cz, 0.85, 0.08, 0.72, carS);
    const wind = this.addWBox(this.wGroup, this.wGeos, this.carTrim, cx + 0.28, 0.56, cz, 0.04, 0.26, 0.76, carGlass);
    wind.rotation.z = 0.48;
    this.addWBox(this.wGroup, this.wGeos, this.carTrim, cx - 0.12, 0.54, cz + 0.4, 0.7, 0.16, 0.03, carGlass);
    this.addWBox(this.wGroup, this.wGeos, this.carTrim, cx - 0.12, 0.54, cz - 0.4, 0.7, 0.16, 0.03, carGlass);
    this.addWBox(this.wGroup, this.wGeos, this.carTrim, cx - 0.18, 0.36, cz + 0.18, 0.32, 0.12, 0.26, carSeat);
    this.addWBox(this.wGroup, this.wGeos, this.carTrim, cx - 0.18, 0.36, cz - 0.18, 0.32, 0.12, 0.26, carSeat);
    [[-0.7, 0.48], [0.58, 0.48], [-0.7, -0.48], [0.58, -0.48]].forEach(([wx, wz]) => {
      const wheel = this.addWCyl(this.wGroup, this.wGeos, this.carTrim, cx + wx, 0.18, cz + wz, 0.18, 0.11, 12, carDark);
      wheel.rotation.x = Math.PI / 2;
      this.addWBox(this.wGroup, this.wGeos, this.carTrim, cx + wx, 0.18, cz + wz + (wz > 0 ? 0.08 : -0.08), 0.08, 0.12, 0.04, carCal);
    });
    const lamp = this.addWCyl(this.wGroup, this.wGeos, this.carTrim, cx + 1.12, 0.3, cz + 0.28, 0.05, 0.03, 10, { fill: 0.9, depth: true, color: 0xf4f5f3 });
    const lamp2 = this.addWCyl(this.wGroup, this.wGeos, this.carTrim, cx + 1.12, 0.3, cz - 0.28, 0.05, 0.03, 10, { fill: 0.9, depth: true, color: 0xf4f5f3 });
    lamp.rotation.z = Math.PI / 2;
    lamp2.rotation.z = Math.PI / 2;
    const bx = x + 3.55, bz = z + 1.35;
    const trailS = { fill: 0.92, depth: true, color: 0x3a3d42 };
    const whiteS = { fill: 0.94, depth: true, color: 0xf4f5f3 };
    const blackS = { fill: 0.94, depth: true, color: 0x14161c };
    const stripeS = { fill: 0.94, depth: true, color: 0xf4f5f3 };
    this.addWBox(this.wGroup, this.wGeos, this.boatHull, bx, 0.18, bz, 0.7, 0.08, 2.7, trailS);
    this.addWBox(this.wGroup, this.wGeos, this.boatHull, bx, 0.22, bz - 1.48, 0.16, 0.1, 0.55, trailS);
    [[-0.38, 0.9], [0.38, 0.9], [-0.38, -0.6], [0.38, -0.6]].forEach(([wx, wz]) => {
      const wheel = this.addWCyl(this.wGroup, this.wGeos, this.boatHull, bx + wx, 0.18, bz + wz, 0.17, 0.1, 10, { fill: 0.92, depth: true, color: 0x1a1c1f });
      wheel.rotation.z = Math.PI / 2;
    });
    this.addWBox(this.wGroup, this.wGeos, this.boatHull, bx, 0.4, bz + 0.08, 0.78, 0.22, 2.05, blackS);
    this.addWBox(this.wGroup, this.wGeos, this.boat, bx, 0.58, bz + 0.08, 0.78, 0.16, 2.05, whiteS);
    this.addWBox(this.wGroup, this.wGeos, this.boat, bx, 0.5, bz + 0.08, 0.8, 0.025, 2.08, stripeS);
    this.addWBox(this.wGroup, this.wGeos, this.boatHull, bx, 0.38, bz + 1.22, 0.52, 0.18, 0.36, blackS);
    this.addWBox(this.wGroup, this.wGeos, this.boat, bx, 0.56, bz + 1.22, 0.52, 0.14, 0.36, whiteS);
    this.addWBox(this.wGroup, this.wGeos, this.boatHull, bx, 0.36, bz + 1.44, 0.3, 0.14, 0.26, blackS);
    this.addWBox(this.wGroup, this.wGeos, this.boat, bx, 0.52, bz + 1.44, 0.3, 0.12, 0.26, whiteS);
    this.addWBox(this.wGroup, this.wGeos, this.boatHull, bx, 0.34, bz + 1.62, 0.14, 0.1, 0.18, blackS);
    this.addWBox(this.wGroup, this.wGeos, this.boat, bx, 0.48, bz + 1.62, 0.14, 0.1, 0.18, whiteS);
    this.addWBox(this.wGroup, this.wGeos, this.boat, bx, 0.68, bz + 0.55, 0.62, 0.04, 0.9, { fill: 0.94, depth: true, color: 0xd4c4a0 });
    const glassS = { fill: 0.28, depth: true, color: 0x1a2428 };
    const screen = this.addWBox(this.wGroup, this.wGeos, this.boatHull, bx, 0.86, bz - 0.05, 0.7, 0.28, 0.04, glassS);
    screen.rotation.x = -0.35;
    this.addWBox(this.wGroup, this.wGeos, this.boat, bx, 0.82, bz - 0.22, 0.68, 0.22, 0.55, whiteS);
    this.addWBox(this.wGroup, this.wGeos, this.boat, bx, 1.18, bz - 0.18, 0.72, 0.04, 1.05, whiteS);
    this.addWBox(this.wGroup, this.wGeos, this.boat, bx + 0.3, 0.98, bz - 0.55, 0.03, 0.38, 0.03, whiteS);
    this.addWBox(this.wGroup, this.wGeos, this.boat, bx - 0.3, 0.98, bz - 0.55, 0.03, 0.38, 0.03, whiteS);
    this.addWBox(this.wGroup, this.wGeos, this.boat, bx + 0.3, 1.02, bz + 0.22, 0.03, 0.32, 0.03, whiteS);
    this.addWBox(this.wGroup, this.wGeos, this.boat, bx - 0.3, 1.02, bz + 0.22, 0.03, 0.32, 0.03, whiteS);
    this.addWBox(this.wGroup, this.wGeos, this.boatHull, bx + 0.28, 0.72, bz + 0.7, 0.015, 0.16, 0.7, { fill: 0.9, depth: true, color: 0xb7c0c6 });
    this.addWBox(this.wGroup, this.wGeos, this.boatHull, bx - 0.28, 0.72, bz + 0.7, 0.015, 0.16, 0.7, { fill: 0.9, depth: true, color: 0xb7c0c6 });
    this.addWBox(this.wGroup, this.wGeos, this.boatHull, bx, 0.78, bz - 1.12, 0.22, 0.36, 0.28, blackS);
    this.addWBox(this.wGroup, this.wGeos, this.boatHull, bx, 0.48, bz - 1.12, 0.12, 0.28, 0.14, blackS);
    const prop = this.addWCyl(this.wGroup, this.wGeos, this.boatHull, bx, 0.26, bz - 1.12, 0.13, 0.04, 8, blackS);
    prop.rotation.x = Math.PI / 2;
    this.cite = { fills: [], lines: [] };
    this.compoundWall = { fills: [], lines: [] };
    const west = x - 2.7, eastWall = x + 4.9, south = z - 1.85, north = z + 4.15;
    const gateZ = z - 0.95, gateHalf = 0.42;
    this.addLowWallRun(this.compoundWall, west, south, eastWall, south);
    this.addLowWallRun(this.compoundWall, eastWall, south, eastWall, north);
    this.addLowWallRun(this.compoundWall, eastWall, north, west + 0.9, north);
    this.addLowWallRun(this.compoundWall, west, north, west, gateZ + gateHalf);
    this.addLowWallRun(this.compoundWall, west, gateZ - gateHalf, west, south);
    const postS = { fill: 0.94, depth: true, color: 0x2a2c30 };
    this.addWBox(this.wGroup, this.wGeos, this.compoundWall, west, 0.72, gateZ + gateHalf, 0.12, 1.44, 0.12, postS);
    this.addWBox(this.wGroup, this.wGeos, this.compoundWall, west, 0.72, gateZ - gateHalf, 0.12, 1.44, 0.12, postS);
    this.addWBox(this.wGroup, this.wGeos, this.compoundWall, west, 1.46, gateZ, 0.08, 0.08, gateHalf * 2, postS);
    const leafS = { fill: 0.94, depth: true, color: 0x3a3d42 };
    const leftLeaf = this.addWBox(this.wGroup, this.wGeos, this.compoundWall, west - 0.02, 0.62, gateZ + 0.22, 0.05, 1.12, 0.38, leafS);
    leftLeaf.rotation.y = 0.55;
    const rightLeaf = this.addWBox(this.wGroup, this.wGeos, this.compoundWall, west - 0.02, 0.62, gateZ - 0.22, 0.05, 1.12, 0.38, leafS);
    rightLeaf.rotation.y = -0.6;
    const alleyZ = gateZ;
    const alleyLen0 = west - 3.4;
    const alleyStart = west - alleyLen0 * 3;
    this.addWBox(this.wGroup, this.wGeos, this.cite, (alleyStart + west) / 2, 0.03, alleyZ, west - alleyStart, 0.05, 1.15, { fill: 0.95, depth: true, color: 0x6a6660 });
    const alleyWallH = 1.18;
    this.addLowWallRun(this.cite, alleyStart, alleyZ - 0.62, west, alleyZ - 0.62, alleyWallH, 0.09);
    this.addLowWallRun(this.cite, alleyStart, alleyZ + 0.62, west - 0.15, alleyZ + 0.62, alleyWallH, 0.09);
    const shackXs = [0.2, 0.48, 0.76].map((t) => alleyStart + (west - alleyStart) * t);
    shackXs.forEach((hx) => this.addRustyShack(this.cite, hx, alleyZ - 1.32, 0.92));
    shackXs.forEach((hx) => this.addRustyShack(this.cite, hx, alleyZ + 1.32, 0.92));
    const roadX = alleyStart - 1.05;
    this.addWBox(this.wGroup, this.wGeos, this.cite, roadX, 0.025, alleyZ + 0.4, 1.7, 0.05, 14.5, { fill: 0.95, depth: true, color: 0x3a3c40 });
    for (let i = -5; i <= 5; i++) {
      this.addWBox(this.wGroup, this.wGeos, this.cite, roadX, 0.055, alleyZ + i * 1.15, 0.08, 0.02, 0.45, { fill: 0.95, depth: true, color: 0xd5d6d2 });
    }
    this.buildPoliceCar(roadX, alleyZ, west - 1.15);
    this.addCiteTree(west - 0.55, alleyZ - 0.95, 1.12);
    this.addCiteTree(west - 0.35, alleyZ + 0.88, 1.28);
    this.addCiteTree(west - 1.15, alleyZ - 0.22, 0.95);
    const lx = LODGING.x, lz = LODGING.z;
    const lodS = { fill: 0.92, depth: true, color: 0x8a4b32 };
    const W = 2.15, D = 1.75, H = 1.05, wall = 0.1, winW = 0.78, winH = 0.52, winY = 0.58;
    const east = lx + W / 2 - wall / 2;
    const side = (D - winW) / 2;
    this.addCorrugatedFace(this.lodging, lx - W / 2 + wall / 2, H / 2, lz, wall, H, D, "z", lodS);
    this.addCorrugatedFace(this.lodging, lx, H / 2, lz + D / 2 - wall / 2, W, H, wall, "x", lodS);
    this.addCorrugatedFace(this.lodging, lx, H / 2, lz - D / 2 + wall / 2, W, H, wall, "x", lodS);
    this.addWBox(this.wGroup, this.wGeos, this.lodging, east, (winY - winH / 2) / 2, lz, wall, winY - winH / 2, D, lodS);
    const topH = H - (winY + winH / 2);
    this.addWBox(this.wGroup, this.wGeos, this.lodging, east, winY + winH / 2 + topH / 2, lz, wall, topH, D, lodS);
    this.addWBox(this.wGroup, this.wGeos, this.lodging, east, winY, lz + winW / 2 + side / 2, wall, winH, side, lodS);
    this.addWBox(this.wGroup, this.wGeos, this.lodging, east, winY, lz - winW / 2 - side / 2, wall, winH, side, lodS);
    const roof = this.addWBox(this.wGroup, this.wGeos, this.lodging, lx, H + 0.08, lz, W + 0.28, 0.07, D + 0.26, { fill: 0.92, depth: true, color: 0x6e3a26 });
    roof.rotation.z = 0.06;
    for (let i = 0; i < 8; i++) {
      const u = -W / 2 + (i + 0.5) * (W / 8);
      this.addWBox(this.wGroup, this.wGeos, this.lodging, lx + u, H + 0.13, lz, 0.05, 0.03, D + 0.22, { fill: 0.92, depth: true, color: 0x5a2e1c });
    }
    for (let i = 0; i < 6; i++) {
      const step = { fills: [], lines: [] };
      this.lodgeSteps.push(step);
      this.addWBox(this.wGroup, this.wGeos, step, lx - 0.42, 0.14 + i * 0.155, lz, 1.05, 0.13, 1.15, { fill: 0.04, depth: true, color: GREEN });
    }
    const glassGeo = new THREE.BoxGeometry(0.04, 0.5, 0.72);
    this.wGeos.push(glassGeo);
    this.glass = new THREE.Mesh(glassGeo, new THREE.MeshBasicMaterial({ color: 0xd7eef6, transparent: true, opacity: 0.18, depthWrite: false }));
    this.glass.position.set(lx + 1.02, 0.58, lz);
    this.glass.renderOrder = 6;
    this.wGroup.add(this.glass);
    this.watcher = this.addWhistleblower(lx + 0.8, lz, 0.52);
    this.watcher.position.y = 0.28;
    this.watcher.rotation.y = Math.PI / 2;
    this.watcher.renderOrder = 4;
    this.watcher.traverse((obj) => { obj.renderOrder = 4; });
    this.watcherHome = this.watcher.position.clone();
    const forestRing = [];
    for (let fx = roadX - 4.2; fx <= eastWall + 3.8; fx += 1.35) {
      forestRing.push([fx, south - 2.4], [fx + 0.45, north + 2.6], [fx - 0.3, south - 3.5], [fx + 0.2, north + 3.8]);
    }
    for (let fz = south - 3.2; fz <= north + 4.0; fz += 1.4) {
      forestRing.push([roadX - 2.6, fz], [roadX - 3.8, fz + 0.5], [eastWall + 2.4, fz], [eastWall + 3.6, fz - 0.4]);
    }
    forestRing.forEach(([tx, tz], i) => {
      const inAlley = tx > alleyStart - 0.4 && tx < west + 0.3 && Math.abs(tz - alleyZ) < 1.7;
      const inYard = tx > west - 0.2 && tx < eastWall + 0.3 && tz > south - 0.2 && tz < north + 0.3;
      const inLodge = Math.hypot(tx - lx, tz - lz) < 1.8;
      const inRoad = Math.abs(tx - roadX) < 1.1 && Math.abs(tz - alleyZ) < 7.4;
      const inSight = tx > lx && tx < x && tz < lz + 0.4 && tz > z - 0.2;
      if (inAlley || inYard || inLodge || inRoad || inSight) return;
      this.addCiteTree(tx, tz, 0.85 + (i % 5) * 0.18);
    });
    const spots = [
      { x: x - 1.35, z: z + 2.05, s: 1.04, yaw: Math.PI / 2, look: { skin: 0x3d2314, hair: 0x1a120c, lock: 0x4a2a14, locks: true, suit: 0xea2839, drink: [0xea2839, 0xf0c030, 0x00a551, 0x2d6bff] } },
      { x: x + 0.15, z: z + 3.05, s: 1.06, yaw: Math.PI, look: { skin: 0x8d5524, hair: 0x14110e, suit: 0x1a206d, drink: [0xf0c030, 0xea2839, 0x2d6bff, 0x00a551] } },
      { x: x + 1.55, z: z + 2.05, s: 1.03, yaw: -Math.PI / 2, look: { skin: 0xf0d2b0, hair: 0xe8c878, suit: 0xc45b78, drink: [0x00a551, 0x2d6bff, 0xf0c030, 0xea2839] } },
    ];
    for (const spot of spots) {
      const fig = this.addLady(spot.x, spot.z, spot.s, spot.look);
      fig.rotation.y = spot.yaw;
      this.figures.push(fig);
      this.figureHome.push(new THREE.Vector3(spot.x, 0, spot.z));
    }
    const bottleS = { fill: 0.92, depth: true, color: 0x1f4a32 };
    const foilS = { fill: 0.92, depth: true, color: 0xc4a35a };
    [[x - 0.55, z + 2.55], [x + 0.85, z + 2.58]].forEach(([px, pz]) => {
      this.addWCyl(this.wGroup, this.wGeos, this.pool, px, 0.22, pz, 0.045, 0.32, 8, bottleS);
      this.addWCyl(this.wGroup, this.wGeos, this.pool, px, 0.4, pz, 0.03, 0.1, 8, foilS);
    });
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
      this.paintParts(this.car, seized ?? new THREE.Color(0x1b3a32), 0.92 * show, 0.92 * show);
      this.paintParts(this.boat, seized ?? new THREE.Color(0xf4f5f3), 0.9 * show, 0.9 * show);
      this.paintParts(this.boatHull, seized ?? new THREE.Color(0x14161c), 0.9 * show, 0.9 * show);
      this.paintParts(this.pool, seized ?? POOL, 0.72 * show, 0.4 * show);
      this.paintParts(this.villaGlass, new THREE.Color(0x7ec8d4), 0.18 * show, 0);
      this.paintParts(this.lodging, outcome === "burn" ? new THREE.Color(0x1a1210) : CRIMSON, 0.88 * show, 0.95 * show);
      this.lodgeSteps.forEach((step) => this.paintParts(step, outcome === "burn" ? new THREE.Color(0x1a1210) : CRIMSON, 0.15 * show, 0.2 * show));
    } else {
      this.floors.forEach((floor, i) => this.paintParts(floor, n > i ? CRIMSON : GOLD, 0.55 * show, 0.95 * show));
      this.paintParts(this.boat, n >= 4 ? CRIMSON : new THREE.Color(0xf4f5f3), 0.9 * show, 0.9 * show);
      this.paintParts(this.boatHull, n >= 4 ? CRIMSON : new THREE.Color(0x14161c), 0.9 * show, 0.9 * show);
      this.paintParts(this.pool, n >= 5 ? CRIMSON : POOL, 0.72 * show, 0.4 * show);
      this.paintParts(this.car, n >= 6 ? CRIMSON : new THREE.Color(0x1b3a32), 0.92 * show, 0.92 * show);
      if (n >= 6) {
        this.paintParts(this.lodging, new THREE.Color(0x121212), 0.9 * show, 0.35 * show);
        const flag = [FLAG_GREEN, FLAG_GREEN, FLAG_YELLOW, FLAG_BLUE, FLAG_RED, FLAG_RED];
        this.lodgeSteps.forEach((step, i) => this.paintParts(step, flag[i], 0.94 * show, 1 * show));
      } else {
        const house = RUST.clone().lerp(GREEN, n / 6);
        this.paintParts(this.lodging, house, 0.88 * show, 0.95 * show);
        this.lodgeSteps.forEach((step, i) => this.paintParts(step, GREEN, (n > i ? 0.82 : 0.04) * show, (n > i ? 0.95 : 0.08) * show));
      }
    }
    this.paintParts(this.villaGlass, new THREE.Color(0x7ec8d4), 0.16 * show, 0);
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
        if (fig.userData.lounge) {
          fig.position.x = home.x;
          fig.position.z = home.z;
          fig.rotation.z = Math.sin(t * 0.9 + i) * 0.012;
        } else {
          fig.position.x = home.x + Math.sin(t * 0.8 + i) * 0.08;
          fig.position.z = home.z + Math.cos(t * 0.55 + i) * 0.05;
          fig.rotation.z = Math.sin(t * 1.3 + i) * 0.04;
        }
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
    this.tickPolice(dt, t);
  }

  buildPoliceCar(roadX, alleyZ, gateX) {
    const root = new THREE.Group();
    const body = new THREE.MeshStandardMaterial({ color: 0xf2f4f6, roughness: 0.38, metalness: 0.18 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x1a1c22, roughness: 0.42, metalness: 0.28 });
    const stripe = new THREE.MeshStandardMaterial({ color: 0x1a3d9c, roughness: 0.4, metalness: 0.12 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x1a2830, roughness: 0.12, metalness: 0.55, emissive: 0x152028, emissiveIntensity: 0.18 });
    const put = (geo, mat, x, y, z, rx = 0) => {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      if (rx) mesh.rotation.x = rx;
      mesh.castShadow = true;
      root.add(mesh);
      return mesh;
    };
    put(new THREE.BoxGeometry(0.58, 0.28, 1.18), body, 0, 0.32, 0);
    put(new THREE.BoxGeometry(0.54, 0.22, 0.58), body, 0, 0.52, -0.08);
    put(new THREE.BoxGeometry(0.5, 0.16, 0.22), glass, 0, 0.54, 0.38);
    put(new THREE.BoxGeometry(0.5, 0.14, 0.42), glass, 0, 0.55, -0.12);
    put(new THREE.BoxGeometry(0.6, 0.06, 0.16), stripe, 0, 0.36, 0);
    put(new THREE.BoxGeometry(0.42, 0.05, 1.12), dark, 0, 0.2, 0);
    put(new THREE.BoxGeometry(0.46, 0.06, 0.28), dark, 0, 0.66, -0.08);
    const lampL = put(new THREE.BoxGeometry(0.16, 0.07, 0.12), new THREE.MeshStandardMaterial({ color: 0x2d6bff, emissive: 0x2d6bff, emissiveIntensity: 0.2, roughness: 0.25 }), -0.12, 0.73, -0.08);
    const lampR = put(new THREE.BoxGeometry(0.16, 0.07, 0.12), new THREE.MeshStandardMaterial({ color: 0x7ec8ff, emissive: 0x7ec8ff, emissiveIntensity: 0.2, roughness: 0.25 }), 0.12, 0.73, -0.08);
    const wheels = [];
    [-0.38, 0.4].forEach((z) => {
      [-0.28, 0.28].forEach((x) => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.08, 12), dark);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x, 0.13, z);
        root.add(wheel);
        wheels.push(wheel);
      });
    });
    root.visible = false;
    root.position.set(roadX, 0, alleyZ - 6.2);
    this.wGroup.add(root);
    this.police = { root, wheels, lamps: [lampL, lampR], clock: -1, roadX, alleyZ, gateX };
  }

  tickPolice(dt, t) {
    const p = this.police;
    if (!p) return;
    const run = this.competition === "whistle" && this.whistleOutcome === "jail";
    p.root.visible = run;
    if (!run) {
      p.clock = -1;
      p.root.position.set(p.roadX, 0, p.alleyZ - 6.2);
      p.root.rotation.y = 0;
      return;
    }
    if (p.clock < 0) p.clock = 0;
    if (this.reduced) p.clock = 20;
    else p.clock += dt;
    const tRoad = 2.7;
    const tAlley = 3.3;
    const ease = (k) => { const u = Math.max(0, Math.min(1, k)); return u * u * (3 - 2 * u); };
    let x = p.gateX;
    let z = p.alleyZ;
    let yaw = -Math.PI / 2;
    let moving = false;
    if (p.clock < tRoad) {
      const e = ease(p.clock / tRoad);
      x = p.roadX;
      z = p.alleyZ - 6.2 + 6.2 * e;
      yaw = 0;
      moving = e < 0.995;
    } else if (p.clock < tRoad + tAlley) {
      const e = ease((p.clock - tRoad) / tAlley);
      x = p.roadX + (p.gateX - p.roadX) * e;
      z = p.alleyZ;
      yaw = -Math.PI / 2;
      moving = e < 0.995;
    }
    p.root.position.set(x, 0, z);
    p.root.rotation.y = yaw;
    const on = Math.sin(t * 16) > 0;
    p.lamps[0].material.emissiveIntensity = on ? 2.6 : 0.12;
    p.lamps[1].material.emissiveIntensity = on ? 0.12 : 2.6;
    if (moving) p.wheels.forEach((wheel) => { wheel.rotation.x += dt * 9; });
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
  onDown = (e) => {
    if (e.button !== 0) return;
    this.onMove(e);
    this.press = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };
  onUp = (e) => {
    const press = this.press;
    this.press = null;
    if (!press || e.pointerId !== press.id || e.button !== 0) return;
    // A drag rotates the village. Only a tap may open a house, so the question stays put.
    if (Math.hypot(e.clientX - press.x, e.clientY - press.y) > 10) return;
    this.onMove(e);
    if (this.pickPrize()) {
      if (this.prizeOpen) window.open("https://forms.gle/XYYsW2awXsab9uVc6", "_blank", "noopener");
      else this.hooks.onPrizeLocked?.();
      return;
    }
    const id = this.pick();
    if (id) this.hooks.onSelect(id);
  };
  onCancel = () => { this.press = null; };
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

  pickPrize() {
    if (this.competition !== "wash" || !this.wash?.prizeHits?.length) return false;
    NDC.set(this.pointer.x, this.pointer.y);
    this.raycaster ??= new THREE.Raycaster();
    this.raycaster.setFromCamera(NDC, this.camera);
    return this.raycaster.intersectObjects(this.wash.prizeHits, false).length > 0;
  }

  tick = (time) => {
    const dt = Math.min((time - this.last) / 1000, 0.1) || 0.016;
    this.last = time;
    const t = time * 0.001;
    if (this.pointer.inside) {
      const prize = this.pickPrize();
      const id = this.pick();
      if (id !== this.hoverId) { this.hoverId = id; this.hooks.onHover(id); }
      this.canvas.style.cursor = (prize && this.prizeOpen) || id ? "pointer" : "grab";
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
    this.stamp.tick(dt, t, this.reduced);
    this.roll.tick(dt, t, this.reduced);
    this.oath.tick(dt, t, this.reduced);
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
    stampResults: [], activeStampId: STAMP_CASES[0].id, stampScore: 0, stampOutcome: "open",
    rollResults: [], activeRollId: ROLL_CASES[0].id, rollScore: 0, rollOutcome: "open",
    oathResults: [], activeOathId: OATH_CASES[0].id, oathScore: 0, oathOutcome: "open",
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultState();
    const data = JSON.parse(raw);
    if (data.version !== SAVE_VERSION) return defaultState();
    const loaded = { ...defaultState(), ...claimAsYou(data), hoveredId: null, selectedId: null, toast: null };
    loaded.houses = (loaded.houses || []).map((h) => {
      const src = HOUSES.find((s) => s.id === h.id);
      return src ? { ...h, x: src.x, z: src.z } : h;
    });
    return loaded;
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
      stampResults: state.stampResults, activeStampId: state.activeStampId,
      stampScore: state.stampScore, stampOutcome: state.stampOutcome,
      rollResults: state.rollResults, activeRollId: state.activeRollId,
      rollScore: state.rollScore, rollOutcome: state.rollOutcome,
      oathResults: state.oathResults, activeOathId: state.activeOathId,
      oathScore: state.oathScore, oathOutcome: state.oathOutcome,
    }));
  } catch { /* ignore */ }
}

const state = loadState();
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.getElementById("village");
const engine = new VillageEngine(canvas, state.houses, {
  onHover: (id) => { state.hoveredId = id; renderDock(); engine.sync(syncPayload()); },
  onSelect: (id) => {
    if (id && tenderForHouse(id) && state.competition === "tender" && id !== state.activeHouseId) {
      showToast(L("toastStay"), "info");
      return;
    }
    state.selectedId = id;
    if (id && tenderForHouse(id) && state.competition === "tender") {
      state.mobileTab = "tender";
      play.classList.add("show-tender");
      play.classList.remove("show-board");
      document.querySelectorAll("#mobile-tabs button[data-tab]").forEach((b) => b.classList.toggle("on", b.dataset.tab === "tender"));
      renderCase();
    }
    renderDock();
    engine.sync(syncPayload());
  },
  onPrizeLocked: () => showToast(L("toastPrizeLock"), "info"),
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
    landHeld: (state.landResults || []).filter((r) => r.correct).map((r) => r.caseId),
    landActive: state.activeLandId,
    landSeen: (state.landResults || []).map((r) => r.caseId),
    fairOutcome: state.fairOutcome,
    fairCorrect: (state.fairResults || []).filter((r) => r.correct).length,
    fairHeld: (state.fairResults || []).filter((r) => r.correct).map((r) => r.caseId),
    cropOutcome: state.cropOutcome,
    cropCorrect: (state.cropResults || []).filter((r) => r.correct).length,
    washOutcome: state.washOutcome,
    washCorrect: (state.washResults || []).filter((r) => r.correct).length,
    stampOutcome: state.stampOutcome,
    stampCorrect: (state.stampResults || []).filter((r) => r.correct).length,
    stampDesks: STAMP_CASES.map((c) => {
      const hit = (state.stampResults || []).find((r) => r.caseId === c.id);
      if (!hit) return "open";
      return hit.correct ? "held" : "miss";
    }),
    stampActive: Math.max(0, STAMP_CASES.findIndex((c) => c.id === state.activeStampId)),
    rollOutcome: state.rollOutcome,
    rollCorrect: (state.rollResults || []).filter((r) => r.correct).length,
    rollMarks: Object.fromEntries(ROLL_CASES.map((c) => {
      const hit = (state.rollResults || []).find((r) => r.caseId === c.id);
      return [c.id, hit ? (hit.correct ? "held" : "miss") : "open"];
    })),
    rollActive: state.activeRollId,
    oathOutcome: state.oathOutcome,
    oathCorrect: (state.oathResults || []).filter((r) => r.correct).length,
    oathMarks: Object.fromEntries(OATH_CASES.map((c) => {
      const hit = (state.oathResults || []).find((r) => r.caseId === c.id);
      return [c.id, hit ? (hit.correct ? "held" : "miss") : "open"];
    })),
    oathActive: state.activeOathId,
    prizeOpen: allStagesCorrect(state),
  };
}
engine.sync(syncPayload());

const boot = document.getElementById("boot");
const play = document.getElementById("play");
const howtoPane = document.getElementById("howto-pane");
const enterPane = document.getElementById("enter-pane");
const enterBtn = document.getElementById("enter-btn");
function showHowTo() {
  howtoPane.hidden = false;
  enterPane.hidden = true;
}
function showEnterGate() {
  howtoPane.hidden = true;
  enterPane.hidden = false;
}
document.getElementById("howto-btn").addEventListener("click", showEnterGate);
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
  showHowTo();
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
  if (state.competition === "oath") {
    state.oathResults = [];
    state.activeOathId = OATH_CASES[0].id;
    state.oathScore = 0;
    state.oathOutcome = "open";
  } else if (state.competition === "roll") {
    state.rollResults = [];
    state.activeRollId = ROLL_CASES[0].id;
    state.rollScore = 0;
    state.rollOutcome = "open";
  } else if (state.competition === "stamp") {
    state.stampResults = [];
    state.activeStampId = STAMP_CASES[0].id;
    state.stampScore = 0;
    state.stampOutcome = "open";
  } else if (state.competition === "wash") {
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
  root.innerHTML = ["en", "fr", "pt"].map((id) => `<button type="button" data-lang="${id}" class="${lang === id ? "on" : ""}">${id}</button>`).join("");
  root.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
}

function setLang(next) {
  lang = next === "fr" || next === "pt" ? next : "en";
  try { localStorage.setItem(LANG_KEY, lang); } catch { /* ignore */ }
  document.documentElement.lang = lang;
  document.title = L("title");
  renderBoot();
  if (!play.hidden) renderAll();
}

function renderBoot() {
  document.getElementById("aim-kicker").textContent = L("aimKicker");
  document.getElementById("aim-title").textContent = L("aimTitle");
  document.getElementById("aim-lead").textContent = L("aimLead");
  document.getElementById("howto-kicker").textContent = L("howtoKicker");
  document.getElementById("howto-title").textContent = L("howtoTitle");
  document.getElementById("howto-lead").textContent = L("howtoLead");
  document.getElementById("howto-steps").innerHTML = ["howtoScore", "howtoOutcomes", "howtoOrder", "howtoCap"]
    .map((key) => `<li>${L(key)}</li>`)
    .join("");
  document.getElementById("howto-btn").textContent = L("howtoNext");
  document.getElementById("boot-title").textContent = L("title");
  document.getElementById("boot-goal").textContent = L("goal");
  document.getElementById("enter-btn").textContent = L("enter");
  document.getElementById("boot-stages").innerHTML = ["stage1", "stage2", "stage3", "stage4", "stage5", "stage6", "stage7", "stage8", "stage9", "stage10"]
    .map((key) => `<li>${L(key)}</li>`)
    .join("");
  paintLang(document.getElementById("boot-lang"));
  paintLang(document.getElementById("play-lang"));
  paintLang(document.getElementById("play-lang-mobile"));
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
  const stamp = state.competition === "stamp";
  const roll = state.competition === "roll";
  const oath = state.competition === "oath";
  document.getElementById("phase-kicker").textContent = L("projectPhase");
  document.querySelectorAll(".comp-switch").forEach((bar) => {
    bar.querySelector('[data-comp="tender"]').textContent = L("tenders");
    bar.querySelector('[data-comp="whistle"]').textContent = L("whistle");
    bar.querySelector('[data-comp="haven"]').textContent = L("haven");
    bar.querySelector('[data-comp="land"]').textContent = L("land");
    bar.querySelector('[data-comp="fair"]').textContent = L("fair");
    bar.querySelector('[data-comp="crop"]').textContent = L("crop");
    bar.querySelector('[data-comp="wash"]').textContent = L("wash");
    bar.querySelector('[data-comp="stamp"]').textContent = L("stamp");
    bar.querySelector('[data-comp="roll"]').textContent = L("roll");
    bar.querySelector('[data-comp="oath"]').textContent = L("oath");
  });
  document.getElementById("phase-title").textContent = oath ? L("phaseOath") : roll ? L("phaseRoll") : stamp ? L("phaseStamp") : wash ? L("phaseWash") : crop ? L("phaseCrop") : fair ? L("phaseFair") : land ? L("phaseLand") : haven ? L("phaseHaven") : whistle ? L("phaseWhistle") : L("phaseTender");
  document.getElementById("stat-label").textContent = oath ? L("oathScore") : roll ? L("rollScore") : stamp ? L("stampScore") : wash ? L("washScore") : crop ? L("cropScore") : fair ? L("fairScore") : land ? L("landScore") : haven ? L("havenScore") : whistle ? L("whistleScore") : L("contractsWon");
  const won = state.results.filter((r) => r.winnerId === "you").length;
  const stat = document.getElementById("stat-won");
  stat.textContent = oath ? `${state.oathScore}/${OATH_CASES.length * 100}` : roll ? `${state.rollScore}/${ROLL_CASES.length * 100}` : stamp ? `${state.stampScore}/${STAMP_CASES.length * 100}` : wash ? `${state.washScore}/${WASH_CASES.length * 100}` : crop ? `${state.cropScore}/${CROP_CASES.length * 100}` : fair ? `${state.fairScore}/${FAIR_CASES.length * 100}` : land ? `${state.landScore}/${LAND_CASES.length * 100}` : haven ? `${state.havenScore}/${HAVEN_CASES.length * 100}` : whistle ? `${state.whistleScore}/${WHISTLE_CASES.length * 100}` : `${won}/${TENDERS.length}`;
  stat.className = "mono";
  stat.style.color = oath ? "#00a551" : roll ? "#2a6f8f" : stamp ? "#ea2839" : wash ? "#c9a15a" : crop ? "#6fbf73" : fair ? "#b388ff" : land ? "#e6c36a" : "";
  if (haven) stat.className = "mono rose";
  if (whistle) stat.className = "mono amber";
  if (!oath && !roll && !stamp && !wash && !crop && !fair && !land && !haven && !whistle) stat.className = "mono green";
  const swept = roundOneCleared(state.results, state.contractorId);
  const lineOpen = roundTwoCleared(state.whistleResults);
  const landOpen = roundThreeCleared(state.havenResults);
  const fairOpen = roundFourCleared(state.landResults);
  const cropOpen = roundFiveCleared(state.fairResults);
  const washOpen = roundSixCleared(state.cropResults);
  const stampOpen = roundSevenCleared(state.washResults);
  const rollOpen = roundEightCleared(state.stampResults);
  const oathOpen = roundNineCleared(state.rollResults);
  document.querySelectorAll(".comp-switch button").forEach((b) => {
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
    if (b.dataset.comp === "stamp") {
      b.classList.toggle("locked", !stampOpen);
      b.title = stampOpen ? L("stampHint") : L("lockStamp");
    }
    if (b.dataset.comp === "roll") {
      b.classList.toggle("locked", !rollOpen);
      b.title = rollOpen ? L("rollHint") : L("lockRoll");
    }
    if (b.dataset.comp === "oath") {
      b.classList.toggle("locked", !oathOpen);
      b.title = oathOpen ? L("oathHint") : L("lockOath");
    }
  });
  const qcount = document.getElementById("qcount");
  qcount.textContent = oath
    ? `${state.oathResults.length}/${OATH_CASES.length}`
    : roll
    ? `${state.rollResults.length}/${ROLL_CASES.length}`
    : stamp
    ? `${state.stampResults.length}/${STAMP_CASES.length}`
    : wash
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
  qcount.style.color = oath ? "#00a551" : roll ? "#2a6f8f" : stamp ? "#ea2839" : wash ? "#c9a15a" : crop ? "#6fbf73" : fair ? "#b388ff" : land ? "#e6c36a" : "";
  document.getElementById("tab-case").textContent = oath || roll || stamp || wash || crop || fair || land || haven || whistle ? L("case") : L("tender");
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
              : state.competition === "wash" && stampOpen
                ? L("stamp")
                : state.competition === "stamp" && rollOpen
                  ? L("roll")
                  : state.competition === "roll" && oathOpen
                    ? L("oath")
                    : L("tenders");
  document.querySelectorAll("#mobile-tabs button[data-tab]").forEach((b) => {
    b.classList.toggle("whistle", whistle && b.classList.contains("on"));
    b.classList.toggle("haven", haven && b.classList.contains("on"));
  });
  document.getElementById("contractor-chips").innerHTML = `
    <span class="kicker mute">${oath
      ? L("seatsHeld", { n: state.oathResults.filter((r) => r.correct).length, total: OATH_CASES.length })
      : roll
      ? L("namesHeld", { n: state.rollResults.filter((r) => r.correct).length, total: ROLL_CASES.length })
      : stamp
      ? L("filesHeld", { n: state.stampResults.filter((r) => r.correct).length, total: STAMP_CASES.length })
      : wash
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
        ${remaining ? `<button type="button" class="cta" id="next-week" style="margin-top:.75rem">${L("nextReno")}</button>` : (roundOneCleared(state.results, state.contractorId) ? `<button type="button" class="cta open-next" id="open-whistle">${L("openBrief")}</button>` : `<p style="margin:.5rem 0 0;font-size:.8rem;color:var(--crimson)">${L("noSweep")}</p>`)}
      ` : ""}
    </div>`;
  document.querySelectorAll("[data-house]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.house !== state.activeHouseId) {
        showToast(L("toastStay"), "info");
        return;
      }
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
      <p class="rose" style="font-size:.8rem">${L("hotlineNote")}</p>
      ${result && remaining ? `<button type="button" class="cta" id="next-haven" style="margin-top:.75rem">${L("nextSignal")}</button>` : ""}
      ${result && !remaining ? `<p class="kicker ${state.havenOutcome === "line" ? "green" : state.havenOutcome === "lamp" ? "amber" : "crimson"}" style="margin:.5rem 0 0">${
        state.havenOutcome === "line" ? L("doneLine") : state.havenOutcome === "lamp" ? L("doneLamp") : L("doneFog")
      }</p>${roundThreeCleared(state.havenResults) ? `<button type="button" class="cta open-next" id="open-land">${L("openLand")}</button>` : ""}` : ""}
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
      ${result && remaining ? `<button type="button" class="cta" id="next-land" style="margin-top:.75rem;background:#e6c36a">${L("nextPlot")}</button>` : ""}
      ${result && !remaining ? `<p class="kicker" style="margin:.5rem 0 0;color:${state.landOutcome === "held" ? "var(--green)" : state.landOutcome === "shift" ? "#e6c36a" : "var(--crimson)"}">${
        state.landOutcome === "held" ? L("doneHeld") : state.landOutcome === "shift" ? L("doneShift") : L("doneLost")
      }</p>${roundFourCleared(state.landResults) ? `<button type="button" class="cta open-next" id="open-fair">${L("openFair")}</button>` : ""}` : ""}
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
      ${result && remaining ? `<button type="button" class="cta" id="next-fair" style="margin-top:.75rem;background:#b388ff">${L("nextGate")}</button>` : ""}
      ${result && !remaining ? `<p class="kicker" style="margin:.5rem 0 0;color:${state.fairOutcome === "fair" ? "var(--green)" : state.fairOutcome === "half" ? "#b388ff" : "var(--crimson)"}">${
        state.fairOutcome === "fair" ? L("doneFair") : state.fairOutcome === "half" ? L("doneHalf") : L("doneBarred")
      }</p>${roundFiveCleared(state.fairResults) ? `<button type="button" class="cta open-next" id="open-crop">${L("openCrop")}</button>` : ""}` : ""}
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
      ${result && remaining ? `<button type="button" class="cta" id="next-crop" style="margin-top:.75rem;background:#6fbf73">${L("nextRow")}</button>` : ""}
      ${result && !remaining ? `<p class="kicker" style="margin:.5rem 0 0;color:${state.cropOutcome === "grown" ? "var(--green)" : state.cropOutcome === "thin" ? "#6fbf73" : "var(--crimson)"}">${
        state.cropOutcome === "grown" ? L("doneGrown") : state.cropOutcome === "thin" ? L("doneThin") : L("doneBare")
      }</p>${roundSixCleared(state.cropResults) ? `<button type="button" class="cta open-next" id="open-wash">${L("openWash")}</button>` : ""}` : ""}
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
  document.getElementById("open-wash")?.addEventListener("click", () => {
    if (!roundSixCleared(state.cropResults)) return;
    state.competition = "wash";
    state.mobileTab = "tender";
    state.showOutcome = false;
    play.classList.add("show-tender");
    play.classList.remove("show-board");
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
      ${result && remaining ? `<button type="button" class="cta" id="next-wash" style="margin-top:.75rem;background:#c9a15a">${L("nextFloor")}</button>` : ""}
      ${result && !remaining ? `<p class="kicker" style="margin:.5rem 0 0;color:${state.washOutcome === "clean" ? "var(--green)" : state.washOutcome === "thin" ? "#c9a15a" : "var(--crimson)"}">${
        state.washOutcome === "clean" ? L("doneClean") : state.washOutcome === "thin" ? L("doneWashThin") : L("doneWash")
      }</p>${roundSevenCleared(state.washResults) ? `<button type="button" class="cta open-next" id="open-stamp">${L("openStamp")}</button>` : ""}` : ""}
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
  document.getElementById("open-stamp")?.addEventListener("click", () => {
    if (!roundSevenCleared(state.washResults)) return;
    state.competition = "stamp";
    state.mobileTab = "tender";
    state.showOutcome = false;
    play.classList.add("show-tender");
    play.classList.remove("show-board");
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


function renderStamp() {
  const raw = stampCaseById(state.activeStampId);
  const item = localizeStamp(raw, lang);
  const result = state.stampResults.find((r) => r.caseId === item.id);
  const locked = Boolean(result);
  const remaining = STAMP_CASES.some((c) => !state.stampResults.some((r) => r.caseId === c.id));
  const held = Boolean(result?.correct);
  const panel = document.getElementById("tender-panel");
  panel.classList.toggle("award", held);
  panel.classList.toggle("reject", locked && !held);
  panel.innerHTML = `
    <div class="side-head">
      <p class="kicker" style="color:#ea2839">${L("briefStamp")} · ${item.spec}</p>
      <h2>${item.title}</h2>
      <p class="mono mute">${state.stampResults.length}/${STAMP_CASES.length}</p>
    </div>

    <div class="side-body">
      <p>${item.question}</p>
      <div class="opts">
        ${item.options.map((opt) => {
          const picked = result?.picked === opt.id;
          const isCorrect = opt.id === item.correct;
          const cls = picked && held ? "correct" : picked && locked ? "wrong" : locked && isCorrect ? "correct" : "";
          return `<button type="button" class="opt ${cls}" data-sopt="${opt.id}" ${locked ? "disabled" : ""}><span>${opt.id}</span><span>${opt.text}</span></button>`;
        }).join("")}
      </div>
      <p class="kicker mute" style="margin-top:.8rem">${result ? (held ? L("holdsStamp") : L("missStamp")) : L("scoring")}</p>
      <p style="font-size:.8rem">${L("stampRule")}</p>
      ${result && remaining ? `<button type="button" class="cta" id="next-stamp" style="margin-top:.75rem;background:#ea2839">${L("nextFile")}</button>` : ""}
      ${result && !remaining ? `<p class="kicker" style="margin:.5rem 0 0;color:${state.stampOutcome === "click" ? "var(--green)" : state.stampOutcome === "smear" ? "#ea2839" : "var(--crimson)"}">${
        state.stampOutcome === "click" ? L("doneClick") : state.stampOutcome === "smear" ? L("doneSmear") : L("doneShut")
      }</p>${roundEightCleared(state.stampResults) ? `<button type="button" class="cta open-next" id="open-roll">${L("openRoll")}</button>` : ""}` : ""}
    </div>`;
  panel.querySelectorAll("[data-stamp]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!roundSevenCleared(state.washResults)) {
        showToast(L("toastLockStamp"), "info");
        return;
      }
      state.activeStampId = btn.dataset.stamp;
      state.competition = "stamp";
      persist(state);
      renderAll();
    });
  });
  panel.querySelectorAll("[data-sopt]").forEach((btn) => btn.addEventListener("click", () => answerStamp(btn.dataset.sopt)));
  document.getElementById("next-stamp")?.addEventListener("click", () => {
    if (state.stampOutcome !== "open") return;
    state.activeStampId = firstOpenStampId(state.stampResults);
    persist(state);
    renderAll();
  });
  document.getElementById("open-roll")?.addEventListener("click", () => {
    if (!roundEightCleared(state.stampResults)) return;
    state.competition = "roll";
    state.mobileTab = "tender";
    state.showOutcome = false;
    play.classList.add("show-tender");
    play.classList.remove("show-board");
    persist(state);
    renderAll();
  });
}

function answerStamp(picked) {
  if (!state.contractorId || !roundSevenCleared(state.washResults)) return;
  const item = stampCaseById(state.activeStampId);
  if (state.stampResults.some((r) => r.caseId === item.id)) return;
  const correct = picked === item.correct;
  state.stampResults.push({ caseId: item.id, picked, correct, playerScore: correct ? STAMP_CORRECT : STAMP_WRONG });
  state.stampScore += correct ? STAMP_CORRECT : STAMP_WRONG;
  state.stampOutcome = stampOutcomeOf(state.stampScore, state.stampResults.length);
  if (state.stampOutcome !== "open") {
    state.showOutcome = true;
    showToast(state.stampOutcome === "click" ? L("toastClick") : state.stampOutcome === "smear" ? L("toastSmear") : L("toastShut"), state.stampOutcome);
  } else showToast(correct ? L("toastFile") : L("toastSlipFile"), correct ? "award" : "reject");
  persist(state);
  renderAll();
  renderOutcome();
}

function renderRoll() {
  const raw = rollCaseById(state.activeRollId);
  const item = localizeRoll(raw, lang);
  const result = state.rollResults.find((r) => r.caseId === item.id);
  const locked = Boolean(result);
  const remaining = ROLL_CASES.some((c) => !state.rollResults.some((r) => r.caseId === c.id));
  const held = Boolean(result?.correct);
  const panel = document.getElementById("tender-panel");
  panel.classList.toggle("award", held);
  panel.classList.toggle("reject", locked && !held);
  panel.innerHTML = `
    <div class="side-head">
      <p class="kicker" style="color:#2a6f8f">${L("briefRoll")} · ${item.spec}</p>
      <h2>${item.title}</h2>
      <p class="mono mute">${state.rollResults.length}/${ROLL_CASES.length}</p>
    </div>

    <div class="side-body">
      <p>${item.question}</p>
      <div class="opts">
        ${item.options.map((opt) => {
          const picked = result?.picked === opt.id;
          const isCorrect = opt.id === item.correct;
          const cls = picked && held ? "correct" : picked && locked ? "wrong" : locked && isCorrect ? "correct" : "";
          return `<button type="button" class="opt ${cls}" data-ropt="${opt.id}" ${locked ? "disabled" : ""}><span>${opt.id}</span><span>${opt.text}</span></button>`;
        }).join("")}
      </div>
      <p class="kicker mute" style="margin-top:.8rem">${result ? (held ? L("holdsRoll") : L("missRoll")) : L("scoring")}</p>
      <p style="font-size:.8rem">${L("rollRule")}</p>
      ${result && remaining ? `<button type="button" class="cta" id="next-roll" style="margin-top:.75rem;background:#2a6f8f">${L("nextName")}</button>` : ""}
      ${result && !remaining ? `<p class="kicker" style="margin:.5rem 0 0;color:${state.rollOutcome === "list" ? "var(--green)" : state.rollOutcome === "sheet" ? "#2a6f8f" : "var(--crimson)"}">${
        state.rollOutcome === "list" ? L("doneList") : state.rollOutcome === "sheet" ? L("doneSheet") : L("doneVan")
      }</p>${roundNineCleared(state.rollResults) ? `<button type="button" class="cta open-next" id="open-oath">${L("openOath")}</button>` : ""}` : ""}
    </div>`;
  panel.querySelectorAll("[data-roll]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!roundEightCleared(state.stampResults)) {
        showToast(L("toastLockRoll"), "info");
        return;
      }
      state.activeRollId = btn.dataset.roll;
      state.competition = "roll";
      persist(state);
      renderAll();
    });
  });
  panel.querySelectorAll("[data-ropt]").forEach((btn) => btn.addEventListener("click", () => answerRoll(btn.dataset.ropt)));
  document.getElementById("next-roll")?.addEventListener("click", () => {
    if (state.rollOutcome !== "open") return;
    state.activeRollId = firstOpenRollId(state.rollResults);
    persist(state);
    renderAll();
  });
  document.getElementById("open-oath")?.addEventListener("click", () => {
    if (!roundNineCleared(state.rollResults)) return;
    state.competition = "oath";
    state.mobileTab = "tender";
    state.showOutcome = false;
    play.classList.add("show-tender");
    play.classList.remove("show-board");
    persist(state);
    renderAll();
  });
}

function answerRoll(picked) {
  if (!state.contractorId || !roundEightCleared(state.stampResults)) return;
  const item = rollCaseById(state.activeRollId);
  if (state.rollResults.some((r) => r.caseId === item.id)) return;
  const correct = picked === item.correct;
  state.rollResults.push({ caseId: item.id, picked, correct, playerScore: correct ? ROLL_CORRECT : ROLL_WRONG });
  state.rollScore += correct ? ROLL_CORRECT : ROLL_WRONG;
  state.rollOutcome = rollOutcomeOf(state.rollScore, state.rollResults.length);
  if (state.rollOutcome !== "open") {
    state.showOutcome = true;
    showToast(state.rollOutcome === "list" ? L("toastList") : state.rollOutcome === "sheet" ? L("toastSheet") : L("toastVan"), state.rollOutcome);
  } else showToast(correct ? L("toastName") : L("toastSlipName"), correct ? "award" : "reject");
  persist(state);
  renderAll();
  renderOutcome();
}

function renderOath() {
  const raw = oathCaseById(state.activeOathId);
  const item = localizeOath(raw, lang);
  const result = state.oathResults.find((r) => r.caseId === item.id);
  const locked = Boolean(result);
  const remaining = OATH_CASES.some((c) => !state.oathResults.some((r) => r.caseId === c.id));
  const held = Boolean(result?.correct);
  const panel = document.getElementById("tender-panel");
  panel.classList.toggle("award", held);
  panel.classList.toggle("reject", locked && !held);
  panel.innerHTML = `
    <div class="side-head">
      <p class="kicker" style="color:#00a551">${L("briefOath")} · ${item.spec}</p>
      <h2>${item.title}</h2>
      <p class="mono mute">${state.oathResults.length}/${OATH_CASES.length}</p>
    </div>

    <div class="side-body">
      <p>${item.question}</p>
      <div class="opts">
        ${item.options.map((opt) => {
          const picked = result?.picked === opt.id;
          const isCorrect = opt.id === item.correct;
          const cls = picked && held ? "correct" : picked && locked ? "wrong" : locked && isCorrect ? "correct" : "";
          return `<button type="button" class="opt ${cls}" data-oopt="${opt.id}" ${locked ? "disabled" : ""}><span>${opt.id}</span><span>${opt.text}</span></button>`;
        }).join("")}
      </div>
      <p class="kicker mute" style="margin-top:.8rem">${result ? (held ? L("holdsOath") : L("missOath")) : L("scoring")}</p>
      <p style="font-size:.8rem">${L("oathRule")}</p>
      ${result && remaining ? `<button type="button" class="cta" id="next-oath" style="margin-top:.75rem;background:#00a551">${L("nextSeat")}</button>` : ""}
      ${result && !remaining ? `<p class="kicker" style="margin:.5rem 0 0;color:${state.oathOutcome === "whole" ? "var(--green)" : state.oathOutcome === "page" ? "#00a551" : "var(--crimson)"}">${
        state.oathOutcome === "whole" ? L("prizeWin") : state.oathOutcome === "page" ? L("donePage") : L("doneKey")
      }</p>` : ""}
    </div>`;
  panel.querySelectorAll("[data-oath]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!roundNineCleared(state.rollResults)) {
        showToast(L("toastLockOath"), "info");
        return;
      }
      state.activeOathId = btn.dataset.oath;
      state.competition = "oath";
      persist(state);
      renderAll();
    });
  });
  panel.querySelectorAll("[data-oopt]").forEach((btn) => btn.addEventListener("click", () => answerOath(btn.dataset.oopt)));
  document.getElementById("next-oath")?.addEventListener("click", () => {
    if (state.oathOutcome !== "open") return;
    state.activeOathId = firstOpenOathId(state.oathResults);
    persist(state);
    renderAll();
  });
}

function answerOath(picked) {
  if (!state.contractorId || !roundNineCleared(state.rollResults)) return;
  const item = oathCaseById(state.activeOathId);
  if (state.oathResults.some((r) => r.caseId === item.id)) return;
  const correct = picked === item.correct;
  state.oathResults.push({ caseId: item.id, picked, correct, playerScore: correct ? OATH_CORRECT : OATH_WRONG });
  state.oathScore += correct ? OATH_CORRECT : OATH_WRONG;
  state.oathOutcome = oathOutcomeOf(state.oathScore, state.oathResults.length);
  if (state.oathOutcome !== "open") {
    state.showOutcome = true;
    showToast(state.oathOutcome === "whole" ? L("toastWhole") : state.oathOutcome === "page" ? L("toastPage") : L("toastKey"), state.oathOutcome);
  } else showToast(correct ? L("toastSeat") : L("toastSlipSeat"), correct ? "award" : "reject");
  persist(state);
  renderAll();
  renderOutcome();
}

function renderCase() {
  if (state.competition === "oath") return renderOath();
  if (state.competition === "roll") return renderRoll();
  if (state.competition === "stamp") return renderStamp();
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
            }</p>${roundTwoCleared(state.whistleResults) ? `<button type="button" class="cta open-next" id="open-haven">${L("openLine")}</button>` : ""}`}
      ` : `
        <p class="kicker mute">${L("scoring")}</p>
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
  const stamp = state.competition === "stamp";
  const roll = state.competition === "roll";
  const oath = state.competition === "oath";
  const outcome = oath ? state.oathOutcome : roll ? state.rollOutcome : stamp ? state.stampOutcome : wash ? state.washOutcome : crop ? state.cropOutcome : fair ? state.fairOutcome : land ? state.landOutcome : haven ? state.havenOutcome : state.whistleOutcome;
  if (!state.showOutcome || state.competition === "tender" || outcome === "open") { el.hidden = true; return; }
  const copy = oath ? {
    whole: { kicker: L("topScore"), title: L("wholeTitle"), body: L("wholeBody"), cls: "award" },
    page: { kicker: L("midScore"), title: L("pageTitle"), body: L("pageBody"), cls: "burn" },
    lost: { kicker: L("lowScore"), title: L("keyTitle"), body: L("keyBody"), cls: "reject" },
  }[state.oathOutcome] : roll ? {
    list: { kicker: L("topScore"), title: L("listTitle"), body: L("listBody"), cls: "award" },
    sheet: { kicker: L("midScore"), title: L("sheetTitle"), body: L("sheetBody"), cls: "burn" },
    van: { kicker: L("lowScore"), title: L("vanTitle"), body: L("vanBody"), cls: "reject" },
  }[state.rollOutcome] : stamp ? {
    click: { kicker: L("topScore"), title: L("clickTitle"), body: L("clickBody"), cls: "award" },
    smear: { kicker: L("midScore"), title: L("smearTitle"), body: L("smearBody"), cls: "burn" },
    shut: { kicker: L("lowScore"), title: L("shutTitle"), body: L("shutBody"), cls: "reject" },
  }[state.stampOutcome] : wash ? {
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
  document.getElementById("outcome-score").textContent = oath
    ? L("scoreOath", { score: state.oathScore })
    : roll
    ? L("scoreRoll", { score: state.rollScore })
    : stamp
    ? L("scoreStamp", { score: state.stampScore })
    : wash
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
  document.getElementById("outcome-dismiss").textContent = oath && state.oathOutcome === "whole" ? L("prizeWin") : L("watchGrid");
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
  if (state.competition === "oath") {
    const seats = state.oathResults.filter((r) => r.correct).length;
    board.innerHTML = `
      <div class="side-head">
        <p class="kicker" style="color:#00a551">${L("boardOath")}</p>
        <h2>${L("notRanking")}</h2>
      </div>
      <div class="side-body">
        <p style="font-size:.8rem">${L("oathRule")}</p>
        <p class="mono green">${L("seatsHeld", { n: seats, total: OATH_CASES.length })}</p>
      </div>`;
    return;
  }
  if (state.competition === "roll") {
    const names = state.rollResults.filter((r) => r.correct).length;
    board.innerHTML = `
      <div class="side-head">
        <p class="kicker" style="color:#2a6f8f">${L("boardRoll")}</p>
        <h2>${L("notRanking")}</h2>
      </div>
      <div class="side-body">
        <p style="font-size:.8rem">${L("rollRule")}</p>
        <p class="mono green">${L("namesHeld", { n: names, total: ROLL_CASES.length })}</p>
      </div>`;
    return;
  }
  if (state.competition === "stamp") {
    const files = state.stampResults.filter((r) => r.correct).length;
    board.innerHTML = `
      <div class="side-head">
        <p class="kicker" style="color:#ea2839">${L("boardStamp")}</p>
        <h2>${L("notRanking")}</h2>
      </div>
      <div class="side-body">
        <p style="font-size:.8rem">${L("stampRule")}</p>
        <p class="mono green">${L("filesHeld", { n: files, total: STAMP_CASES.length })}</p>
      </div>`;
    return;
  }
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
        <p style="font-size:.85rem">${L("hotlineNote")}</p>
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
  if (state.competition === "oath") {
    dock.hidden = false;
    dock.innerHTML = `<div class="panel dock-inner"><p style="margin:0;letter-spacing:.16em;text-transform:uppercase;font-family:var(--display);font-size:10px;color:#00a551">${L("dockOath")}</p></div>`;
    return;
  }
  if (state.competition === "roll") {
    dock.hidden = false;
    dock.innerHTML = `<div class="panel dock-inner"><p style="margin:0;letter-spacing:.16em;text-transform:uppercase;font-family:var(--display);font-size:10px;color:#2a6f8f">${L("dockRoll")}</p></div>`;
    return;
  }
  if (state.competition === "stamp") {
    dock.hidden = false;
    dock.innerHTML = `<div class="panel dock-inner"><p style="margin:0;letter-spacing:.16em;text-transform:uppercase;font-family:var(--display);font-size:10px;color:#ea2839">${L("dockStamp")}</p></div>`;
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
    if (house.id !== state.activeHouseId) {
      showToast(L("toastStay"), "info");
      return;
    }
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
      last: false,
    };
  }
  if (comp === "stamp") {
    return {
      answered: state.stampResults.some((r) => r.caseId === state.activeStampId),
      n: state.stampResults.length,
      total: STAMP_CASES.length,
      score: state.stampScore,
      perfect: state.stampResults.length >= STAMP_CASES.length && state.stampResults.every((r) => r.correct),
      last: false,
    };
  }
  if (comp === "roll") {
    return {
      answered: state.rollResults.some((r) => r.caseId === state.activeRollId),
      n: state.rollResults.length,
      total: ROLL_CASES.length,
      score: state.rollScore,
      perfect: state.rollResults.length >= ROLL_CASES.length && state.rollResults.every((r) => r.correct),
      last: false,
    };
  }
  if (comp === "oath") {
    return {
      answered: state.oathResults.some((r) => r.caseId === state.activeOathId),
      n: state.oathResults.length,
      total: OATH_CASES.length,
      score: state.oathScore,
      perfect: state.oathResults.length >= OATH_CASES.length && state.oathResults.every((r) => r.correct),
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
  const openKey = { tender: "openBrief", whistle: "openLine", haven: "openLand", land: "openFair", fair: "openCrop", crop: "openWash", wash: "openStamp", stamp: "openRoll", roll: "openOath" }[state.competition];
  go.textContent = mode === "continue" ? L("continue") : mode === "next" ? L(openKey || "nextStage") : L("resetStage");
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
  else if (state.competition === "stamp") state.activeStampId = firstOpenStampId(state.stampResults);
  else if (state.competition === "roll") state.activeRollId = firstOpenRollId(state.rollResults);
  else if (state.competition === "oath") state.activeOathId = firstOpenOathId(state.oathResults);
  else state.activeHouseId = firstOpenHouseId(state.results);
  state.selectedId = state.activeHouseId;
  persist(state);
  renderAll();
}
function goNextStage() {
  const order = ["tender", "whistle", "haven", "land", "fair", "crop", "wash", "stamp", "roll", "oath"];
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

document.querySelectorAll(".comp-switch").forEach((bar) => bar.addEventListener("click", (e) => {
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
  if (btn.dataset.comp === "stamp" && !roundSevenCleared(state.washResults)) {
    showToast(L("toastLockStamp"), "info");
    return;
  }
  if (btn.dataset.comp === "roll" && !roundEightCleared(state.stampResults)) {
    showToast(L("toastLockRoll"), "info");
    return;
  }
  if (btn.dataset.comp === "oath" && !roundNineCleared(state.rollResults)) {
    showToast(L("toastLockOath"), "info");
    return;
  }
  state.showOutcome = false;
  state.competition = btn.dataset.comp;
  state.mobileTab = "tender";
  play.classList.add("show-tender");
  play.classList.remove("show-board");
  persist(state);
  renderAll();
}));
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
  else if (state.competition === "wash" && roundSevenCleared(state.washResults)) next = "stamp";
  else if (state.competition === "stamp" && roundEightCleared(state.stampResults)) next = "roll";
  else if (state.competition === "roll" && roundNineCleared(state.rollResults)) next = "oath";
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
  if (next === "stamp" && !roundSevenCleared(state.washResults)) {
    showToast(L("toastLockStamp"), "info");
    return;
  }
  if (next === "roll" && !roundEightCleared(state.stampResults)) {
    showToast(L("toastLockRoll"), "info");
    return;
  }
  if (next === "oath" && !roundNineCleared(state.rollResults)) {
    showToast(L("toastLockOath"), "info");
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
if ((state.stampResults || []).length < STAMP_CASES.length) state.stampOutcome = "open";
if ((state.rollResults || []).length < ROLL_CASES.length) state.rollOutcome = "open";
if ((state.oathResults || []).length < OATH_CASES.length) state.oathOutcome = "open";
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
if (!roundSevenCleared(state.washResults) && state.competition === "stamp") {
  state.competition = roundSixCleared(state.cropResults) ? "wash" : "crop";
}
if (!roundEightCleared(state.stampResults) && state.competition === "roll") {
  state.competition = roundSevenCleared(state.washResults) ? "stamp" : "wash";
}
if (!roundNineCleared(state.rollResults) && state.competition === "oath") {
  state.competition = roundEightCleared(state.stampResults) ? "roll" : "stamp";
}
renderBoot();
if (state.phase === "play") showPlay();
window.addEventListener("pagehide", () => persist(state));
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") persist(state); });
