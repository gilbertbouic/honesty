const UI = {
  product: { en: "Honesty League", fr: "Ligue de l’honnêteté" },
  tag: { en: "Same questions. Four seats. One public score.", fr: "Les mêmes questions. Quatre sièges. Un score public." },
  mkweli: { en: "A Mkweli product", fr: "Un produit Mkweli" },
  disclaimer: {
    en: "Not an official government or United Nations service. Honesty Points are declared principle, not a finding of misconduct.",
    fr: "Ce n’est pas un service officiel de l’État ni des Nations Unies. Les points d’honnêteté sont un principe déclaré, non une constatation de faute.",
  },
  sit: { en: "Sit at the desk", fr: "S’asseoir au pupitre" },
  arena: { en: "Arena", fr: "Arène" },
  play: { en: "Desk", fr: "Pupitre" },
  reveal: { en: "Reveal", fr: "Révélation" },
  houses: { en: "Houses", fr: "Maisons" },
  circuits: { en: "Circuits", fr: "Circuits" },
  method: { en: "Method", fr: "Méthode" },
  about: { en: "About", fr: "À propos" },
  weekLive: { en: "Week 1 is live", fr: "La semaine 1 est ouverte" },
  weekOpens: {
    en: "Season 1 opens Friday 25 September",
    fr: "La saison 1 ouvre vendredi 25 septembre",
  },
  closes: { en: "Public Desk closes", fr: "Le pupitre public ferme" },
  opens: { en: "Public Desk opens", fr: "Le pupitre public ouvre" },
  deskLocked: {
    en: "The public desk opens Friday 25 September, 09:00 Mauritius. Walk the houses. Publishing waits.",
    fr: "Le pupitre public ouvre vendredi 25 septembre, 09 h 00 Maurice. Parcourez les maisons. La publication attend.",
  },
  rehearsal: {
    en: "Rehearsal field until the desk opens. These scores are not the public season.",
    fr: "Champ de répétition jusqu’à l’ouverture. Ces scores ne sont pas la saison publique.",
  },
  previewDesk: { en: "Walk the desk", fr: "Parcourir le pupitre" },
  empty: { en: "Empty Chair", fr: "Chaise vide" },
  points: { en: "Honesty Points", fr: "Points d’honnêteté" },
  publicDesk: { en: "Publish this rule", fr: "Publier cette règle" },
  chooseSeat: { en: "Choose a seat", fr: "Choisir un siège" },
  reason: {
    en: "State the rule you will reuse. Forty words earns the written-reason mark.",
    fr: "Nommez la règle que vous réutiliserez. Quarante mots valent la mention écrite.",
  },
  words: { en: "words", fr: "mots" },
  yourHouse: { en: "Your glass house", fr: "Votre maison de verre" },
  frost: { en: "Frost is silence and contradiction.", fr: "Le givre est le silence et la contradiction." },
  shadow: { en: "Divergence", fr: "Divergence" },
  honestMark: { en: "Honest mark", fr: "Marque HONEST" },
  honestHint: {
    en: "Issued to the top three sitting houses. A scan is a public receipt, not a certificate of virtue.",
    fr: "Délivrée aux trois maisons assises en tête. Un scan est un reçu public, pas un certificat de vertu.",
  },
};

const SEATS = ["gallery", "service", "chamber", "mandate"];
const BANDS = ["front-line", "middle", "senior"];
const HONEST_RANKS = 3;
const HONEST_LINE = "I scored as HONEST with Mkweli";
const KEY = "honesty-league";

const state = {
  lang: "en",
  seat: null,
  circuitId: null,
  band: null,
  handle: "",
  answers: [],
  points: 0,
  choiceId: "",
  reason: "",
  filter: "all",
};

let DATA = { seats: [], circuits: [], houses: [], week: null };

function t(copy) {
  if (!copy) return "";
  if (typeof copy === "string") return copy;
  return copy[state.lang] || copy.en || "";
}

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function scoreAnswer(hasChoice, reason, band) {
  if (!hasChoice) return 0;
  let base = 10;
  const words = wordCount(reason);
  if (words >= 40) base += 5;
  else if (words >= 12) base += 2;
  const bandMod = band === "senior" ? 1.35 : band === "middle" ? 1.15 : 1;
  return Math.max(0, Math.round(base * 1.5 * bandMod * 10) / 10);
}

function frostFromPoints(points, empty) {
  if (empty) return 0.92;
  const clamped = Math.min(100, Math.max(0, points));
  return 1 - clamped / 100;
}

function loadLocal() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!raw) return;
    Object.assign(state, {
      lang: raw.lang || "en",
      seat: raw.seat || null,
      circuitId: raw.circuitId || null,
      band: raw.band || null,
      handle: raw.handle || "",
      answers: raw.answers || [],
      points: raw.points || 0,
    });
  } catch {
    /* ignore */
  }
}

function saveLocal() {
  localStorage.setItem(
    KEY,
    JSON.stringify({
      lang: state.lang,
      seat: state.seat,
      circuitId: state.circuitId,
      band: state.band,
      handle: state.handle,
      answers: state.answers,
      points: state.points,
    }),
  );
}

function selfHouse() {
  if (!state.answers.length && !state.points) return null;
  const last = state.answers.at(-1);
  return {
    id: "self",
    handle: state.handle || (state.lang === "fr" ? "Vous" : "You"),
    seat: state.seat || "gallery",
    circuitId: state.circuitId || undefined,
    points: state.points,
    lastChoice: last?.choiceId,
    lastReason: last ? { en: last.reason, fr: last.reason } : undefined,
  };
}

function field() {
  const me = selfHouse();
  return me ? [me, ...DATA.houses.filter((h) => h.id !== me.id)] : DATA.houses.slice();
}

function honestCutoff(houses) {
  const ranked = houses.filter((h) => !h.emptyChair && h.points > 0).sort((a, b) => b.points - a.points);
  if (!ranked.length) return Infinity;
  return ranked[Math.min(HONEST_RANKS, ranked.length) - 1].points;
}

function isHonest(house, houses) {
  if (house.emptyChair || house.points <= 0) return false;
  return house.points >= honestCutoff(houses);
}

function variantFor() {
  const variants = DATA.week?.variants || [];
  if (state.seat === "chamber") return variants.find((v) => v.circuitId === "chamber") || variants[0];
  if (state.circuitId) return variants.find((v) => v.circuitId === state.circuitId) || variants[0];
  return variants[0];
}

function circuitsForSeat() {
  if (state.seat === "mandate") return DATA.circuits.filter((c) => c.family === "mandate" || c.family === "shared");
  if (state.seat === "service") return DATA.circuits.filter((c) => c.family === "service" || c.family === "shared");
  return [];
}

function seatMeta(id) {
  return DATA.seats.find((s) => s.id === id) || { title: { en: id }, who: { en: "" } };
}

function route() {
  const hash = (location.hash || "#/").replace(/^#/, "") || "/";
  const parts = hash.split("/").filter(Boolean);
  return { path: "/" + parts.join("/"), parts };
}

function go(to) {
  location.hash = to.startsWith("#") ? to : "#" + to;
}

function glass(points, empty, compact) {
  const frost = frostFromPoints(points, empty);
  const clear = 1 - frost;
  const uid = "g" + Math.random().toString(36).slice(2, 8);
  const w = compact ? 88 : 140;
  const boarded = empty
    ? `<g stroke="#8a9a92" stroke-width="1.2" fill="none"><rect x="34" y="78" width="12" height="8"/><line x1="36" y1="78" x2="36" y2="92"/><line x1="44" y1="78" x2="44" y2="92"/></g>`
    : "";
  const win = (x) =>
    empty
      ? `<g><rect x="${x}" y="48" width="12" height="14" fill="none" stroke="#b8d4c8" stroke-width="1"/><line x1="${x}" y1="48" x2="${x + 12}" y2="62" stroke="#8a9a92"/><line x1="${x + 12}" y1="48" x2="${x}" y2="62" stroke="#8a9a92"/></g>`
      : `<rect x="${x}" y="48" width="12" height="14" fill="none" stroke="#b8d4c8" stroke-width="1" opacity="${0.45 + clear * 0.5}"/>`;
  return `<svg viewBox="0 0 80 108" width="${w}" height="${w * 1.35}" aria-hidden="true">
    <defs><linearGradient id="${uid}" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#b8d4c8" stop-opacity="${0.2 + clear * 0.55}"/>
      <stop offset="100%" stop-color="#b8d4c8" stop-opacity="${0.06 + clear * 0.25}"/>
    </linearGradient></defs>
    <polygon points="8,40 40,10 72,40" fill="none" stroke="#d7e4dc" stroke-width="1.4"/>
    <rect x="14" y="40" width="52" height="50" fill="url(#${uid})" stroke="#d7e4dc" stroke-width="1.4"/>
    <rect x="14" y="40" width="52" height="50" fill="#d7e4dc" opacity="${frost * 0.72}"/>
    ${win(22)}${win(46)}
    <rect x="36" y="70" width="8" height="20" fill="none" stroke="#d7e4dc" stroke-width="1.2"/>
    ${boarded}
  </svg>`;
}

function opensAt() {
  return DATA.week?.opensAt ? new Date(DATA.week.opensAt).getTime() : Date.now();
}
function closesAt() {
  return DATA.week?.closesAt ? new Date(DATA.week.closesAt).getTime() : Date.now();
}
function deskOpen() {
  return Date.now() >= opensAt();
}

function countdownHtml() {
  const target = deskOpen() ? closesAt() : opensAt();
  const left = Math.max(0, target - Date.now());
  const d = Math.floor(left / 86400000);
  const h = Math.floor((left % 86400000) / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const pad = (n) => String(n).padStart(2, "0");
  return `<div class="clock" id="clock">
    <div><b>${pad(d)}</b><span>days</span></div>
    <div><b>${pad(h)}</b><span>hrs</span></div>
    <div><b>${pad(m)}</b><span>min</span></div>
  </div>`;
}

function navHtml() {
  const r = route().path;
  const items = [
    ["/", UI.arena],
    ["/play", UI.play],
    ["/reveal", UI.reveal],
    ["/houses", UI.houses],
    ["/circuits", UI.circuits],
    ["/methodology", UI.method],
    ["/about", UI.about],
  ];
  return items
    .map(([href, copy]) => {
      const active = href === "/" ? r === "/" : r.startsWith(href);
      return `<a href="#${href}" class="${active ? "active" : ""}">${t(copy)}</a>`;
    })
    .join("");
}

function pageArena() {
  const week = DATA.week;
  const open = deskOpen();
  return `<section class="hero">
    <div>
      <p class="kicker">${t(open ? UI.weekLive : UI.weekOpens)}</p>
      <h1>${t(week.headline)}</h1>
      <p class="muted">${t(UI.tag)}</p>
      ${open ? "" : `<p class="muted" style="margin-top:1rem">${t(UI.rehearsal)}</p>`}
      <div class="row">
        <a class="btn" href="#/play">${t(open ? UI.sit : UI.previewDesk)}</a>
        <a class="btn ghost" href="#/houses">${t(UI.houses)}</a>
      </div>
    </div>
    <div class="card">
      <p class="kicker">${t(open ? UI.closes : UI.opens)}</p>
      ${countdownHtml()}
      <p class="muted" style="margin-top:1rem;font-size:.75rem">${open ? "Friday 16:00 · Mauritius" : "Friday 25 September · 09:00 Mauritius"}</p>
    </div>
  </section>
  <section class="seats">
    ${SEATS.map((seat) => {
      const meta = seatMeta(seat);
      const houses = DATA.houses.filter((h) => h.seat === seat).slice(0, 3);
      return `<div class="card">
        <p class="kicker">${t(meta.who)}</p>
        <h2>${t(meta.title)}</h2>
        <div class="houses">${houses.map((h) => `<a href="#/houses/${h.id}">${glass(h.points, h.emptyChair, true)}</a>`).join("")}</div>
      </div>`;
    }).join("")}
  </section>`;
}

function pagePlay() {
  const week = DATA.week;
  const circuits = circuitsForSeat();
  const variant = variantFor();
  const already = state.answers.find((a) => a.dilemmaId === week.id);
  const words = wordCount(state.reason);
  const open = deskOpen();
  return `<div class="play-grid">
    <div>
      <p class="kicker">${t(UI.play)}</p>
      <h1>${t(week.headline)}</h1>
      ${open ? "" : `<p class="muted" style="margin-top:1rem;max-width:36rem">${t(UI.deskLocked)}</p>`}
      <p class="kicker" style="margin-top:2rem">${t(UI.chooseSeat)}</p>
      <div class="seats" style="grid-template-columns:repeat(2,1fr);margin-top:.75rem">
        ${SEATS.map((s) => {
          const meta = seatMeta(s);
          return `<button type="button" class="seat-btn ${state.seat === s ? "on" : ""}" data-seat="${s}"><b>${t(meta.title)}</b><span>${t(meta.who)}</span></button>`;
        }).join("")}
      </div>
      ${
        circuits.length
          ? `<div style="margin-top:1.5rem">
              <p class="kicker">${t(UI.circuits)}</p>
              <div class="row">${circuits.map((c) => `<button type="button" class="chip ${state.circuitId === c.id ? "on" : ""}" data-circuit="${c.id}">${t(c.title)}</button>`).join("")}</div>
              <div class="row">${BANDS.map((b) => `<button type="button" class="chip ${state.band === b ? "on" : ""}" data-band="${b}">${b}</button>`).join("")}</div>
            </div>`
          : ""
      }
      ${
        state.seat && variant
          ? `<section style="margin-top:2.5rem">
              <p>${t(variant.prompt)}</p>
              <div class="stack" style="margin-top:1rem">${variant.choices
                .map(
                  (c) =>
                    `<button type="button" class="choice ${state.choiceId === c.id ? "on" : ""}" data-choice="${c.id}">${t(c.label)}</button>`,
                )
                .join("")}</div>
              <label style="display:block;margin-top:1.25rem">
                <span class="kicker">${t(UI.reason)}</span>
                <textarea id="reason">${state.reason}</textarea>
                <span class="muted" style="font-size:.75rem">${words} ${t(UI.words)}</span>
              </label>
              <div class="row"><button type="button" class="btn" id="publish" ${open && state.choiceId ? "" : "disabled"}>${t(open ? UI.publicDesk : UI.weekOpens)}</button></div>
              ${already ? `<p class="muted" style="margin-top:1rem">${t(UI.points)} this week: ${already.points}</p>` : ""}
            </section>`
          : ""
      }
    </div>
    <aside class="aside">
      <p class="kicker">${t(UI.yourHouse)}</p>
      ${glass(state.points, false, false)}
      <p class="mono">${state.points} HP</p>
      <p class="muted" style="font-size:.75rem;margin-top:.75rem">${t(UI.frost)}</p>
    </aside>
  </div>`;
}

function pageReveal() {
  const week = DATA.week;
  const sitting = field().filter((h) => !h.emptyChair && h.lastChoice);
  const groups = {};
  for (const h of sitting) {
    (groups[h.lastChoice] ||= []).push(h);
  }
  const ids = Object.keys(groups);
  return `<p class="kicker">${t(UI.reveal)}</p>
    <h1>${t(week.headline)}</h1>
    <p class="muted">${t(UI.shadow)}</p>
    <div class="stack" style="margin-top:2rem;max-width:40rem">
      ${
        ids.length
          ? ids
              .map((id) => `<div class="card"><p class="mono">${id}</p><p class="muted">${groups[id].map((h) => h.handle).join(" · ")}</p></div>`)
              .join("")
          : `<p class="muted">${state.lang === "fr" ? "Les chaises vides parlent aussi." : "Empty chairs speak too."}</p>`
      }
    </div>`;
}

function pageHouses() {
  const all = field();
  const list = (state.filter === "all" ? all : all.filter((h) => h.seat === state.filter)).slice().sort((a, b) => b.points - a.points);
  const open = deskOpen();
  return `<p class="kicker">${t(UI.houses)}</p>
    <h1>${t(UI.points)}</h1>
    <p class="muted" style="max-width:36rem">${t(UI.honestHint)}</p>
    ${open ? "" : `<p class="muted" style="max-width:36rem;margin-top:.75rem">${t(UI.rehearsal)}</p>`}
    <div class="row" style="margin-top:1.5rem">
      ${["all", ...SEATS]
        .map((s) => {
          const label = s === "all" ? (state.lang === "fr" ? "Tous" : "All") : t(seatMeta(s).title);
          return `<button type="button" class="chip ${state.filter === s ? "on" : ""}" data-filter="${s}">${label}</button>`;
        })
        .join("")}
    </div>
    <ul class="house-list" style="list-style:none;padding:0">
      ${list
        .map((h) => {
          const honest = isHonest(h, all);
          const meta = seatMeta(h.seat);
          return `<li><a class="house-link card" href="#/houses/${h.id}">
            ${glass(h.points, h.emptyChair, true)}
            <div>
              <p style="font-family:var(--display);font-size:1.1rem;margin:0">${h.handle}</p>
              <p class="kicker">${t(meta.title)}${h.emptyChair ? " · " + t(UI.empty) : ""}${honest ? " · " + t(UI.honestMark) : ""}</p>
              <p class="mono" style="margin:.25rem 0 0">${h.points} HP</p>
            </div>
          </a></li>`;
        })
        .join("")}
    </ul>`;
}

function pageHouse(id) {
  const all = field();
  const house = all.find((h) => h.id === id);
  if (!house) return `<h1>Unknown house</h1><a class="muted" href="#/houses">${t(UI.houses)}</a>`;
  const circuit = DATA.circuits.find((c) => c.id === house.circuitId);
  const honest = isHonest(house, all);
  const reason = house.lastReason ? `<blockquote style="margin:1.5rem 0 0;padding-left:1rem;border-left:1px solid #d7e4dc;max-width:36rem">${t(house.lastReason)}</blockquote>` : house.emptyChair ? `<p class="muted">${t(UI.empty)}</p>` : "";
  return `<div style="display:grid;gap:2rem">
    <div style="display:flex;flex-wrap:wrap;gap:2rem;align-items:flex-start">
      ${glass(house.points, house.emptyChair, false)}
      <div>
        <p class="kicker">${t(seatMeta(house.seat).title)}${house.emptyChair ? " · " + t(UI.empty) : ""}${honest ? " · " + t(UI.honestMark) : ""}</p>
        <h1>${house.handle}</h1>
        ${house.body ? `<p class="muted">${house.body}</p>` : ""}
        ${circuit ? `<p class="muted">${t(circuit.title)}</p>` : ""}
        <p class="mono" style="font-size:1.75rem;margin-top:1.25rem">${house.points} HP</p>
        ${reason}
        ${honest ? `<div class="paper" id="qr-card"><p class="kicker">${t(UI.honestMark)}</p><p style="font-family:var(--display);font-size:1.25rem;margin:.5rem 0 0">${HONEST_LINE}</p><canvas id="qr" width="160" height="160"></canvas><p class="mono">${house.handle} · ${house.points} HP</p><p class="hint">${t(UI.honestHint)}</p></div>` : ""}
        <p style="margin-top:2rem"><a class="muted" href="#/houses">${t(UI.houses)}</a></p>
      </div>
    </div>
  </div>`;
}

function pageCircuits() {
  return `<p class="kicker">${t(UI.circuits)}</p>
    <h1>${state.lang === "fr" ? "Fonctions à risque" : "Functions at risk"}</h1>
    <div class="house-list two" style="list-style:none;padding:0">
      ${DATA.circuits
        .map(
          (c) => `<article class="card"><p class="kicker">${c.family}</p><h2>${t(c.title)}</h2><p class="muted">${t(c.why)}</p></article>`,
        )
        .join("")}
    </div>`;
}

function pageMethod() {
  const fr = state.lang === "fr";
  return `<article class="method">
    <p class="kicker">${t(UI.method)}</p>
    <h1>${fr ? "Les points mesurent le processus, pas l’idéologie." : "Points measure process, not ideology."}</h1>
    <p class="muted">${fr ? "Le scoreur est déterministe. Deux personnes qui relancent la même fonction sur les mêmes fichiers obtiennent le même résultat." : "The scorer is deterministic. Two people running the same function on the same files get the same result."}</p>
    <ol>
      <li>${fr ? "Règle déclarée plus un choix : 10." : "Declared rule plus a choice: 10."}</li>
      <li>${fr ? "Raison écrite d’au moins 40 mots : +5. Douze mots : +2." : "Written reason of at least 40 words: +5. Twelve words: +2."}</li>
      <li>${fr ? "Toute réponse est publique. Multiplicateur du pupitre : × 1,5." : "Every answer is public. Desk multiplier: × 1.5."}</li>
      <li>${fr ? "Bande : première ligne × 1, milieu × 1,15, senior × 1,35." : "Band: front line × 1, middle × 1.15, senior × 1.35."}</li>
      <li>${fr ? "Contradiction sans amendement : −12. Chaise vide : 0, et des planches sur la maison." : "Contradiction without amendment: −12. Empty Chair: 0, and boards on the house."}</li>
      <li>${fr ? "Marque HONEST : les trois maisons assises en tête reçoivent un QR public. Le texte scanné est « I scored as HONEST with Mkweli »." : "Honest mark: the top three sitting houses receive a public QR. The scanned text is “I scored as HONEST with Mkweli”."}</li>
    </ol>
    <p class="muted">${t(UI.disclaimer)}</p>
  </article>`;
}

function pageAbout() {
  const fr = state.lang === "fr";
  return `<article class="method">
    <p class="kicker">${t(UI.about)}</p>
    <h1>${t(UI.product)}</h1>
    <p>${fr ? "Un jeu civique de Mkweli. Les citoyens, les agents publics, les élus et les fonctionnaires internationaux répondent à la même dilemme, chaque semaine, et accumulent des points d’honnêteté." : "A Mkweli civic game. Citizens, civil servants, elected officials and international staff answer the same weekly dilemma and accumulate Honesty Points."}</p>
    <p class="muted">${fr ? "Le givre sur la maison de verre n’est pas un verdict pénal. C’est le silence, la contradiction, ou le refus de s’asseoir." : "Frost on the glass house is not a criminal verdict. It is silence, contradiction, or a refusal to sit."}</p>
    <p class="muted">${fr ? "Saison 1. Le pupitre public ouvre vendredi 25 septembre 2026, 09 h 00 Maurice." : "Season 1. The public desk opens Friday 25 September 2026, 09:00 Mauritius."}</p>
    <p><a href="https://mkweli.tech" style="color:var(--primary)">mkweli.tech</a></p>
  </article>`;
}

function renderPage() {
  const { parts } = route();
  if (parts[0] === "play") return pagePlay();
  if (parts[0] === "reveal") return pageReveal();
  if (parts[0] === "houses" && parts[1]) return pageHouse(parts[1]);
  if (parts[0] === "houses") return pageHouses();
  if (parts[0] === "circuits") return pageCircuits();
  if (parts[0] === "methodology") return pageMethod();
  if (parts[0] === "about") return pageAbout();
  return pageArena();
}

function paint() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll("[data-nav]").forEach((n) => {
    n.innerHTML = navHtml();
  });
  document.getElementById("lang-btn").textContent = state.lang === "en" ? "FR" : "EN";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(UI[el.dataset.i18n]);
  });
  document.getElementById("app").innerHTML = renderPage();
  bind();
  const qr = document.getElementById("qr");
  if (qr && window.QRCode) {
    const { parts } = route();
    const house = field().find((h) => h.id === parts[1]);
    if (house) {
      const payload = [HONEST_LINE, house.handle, `${house.points} HP · Honesty League`, "mkweli.tech"].join("\n");
      window.QRCode.toCanvas(qr, payload, { width: 160, margin: 1, color: { dark: "#0b100f", light: "#e8efe9" } });
    }
  }
}

function bind() {
  document.querySelectorAll("[data-seat]").forEach((btn) => {
    btn.onclick = () => {
      state.seat = btn.dataset.seat;
      state.circuitId = state.seat === "gallery" || state.seat === "chamber" ? state.seat : null;
      saveLocal();
      paint();
    };
  });
  document.querySelectorAll("[data-circuit]").forEach((btn) => {
    btn.onclick = () => {
      state.circuitId = btn.dataset.circuit;
      saveLocal();
      paint();
    };
  });
  document.querySelectorAll("[data-band]").forEach((btn) => {
    btn.onclick = () => {
      state.band = btn.dataset.band;
      saveLocal();
      paint();
    };
  });
  document.querySelectorAll("[data-choice]").forEach((btn) => {
    btn.onclick = () => {
      state.choiceId = btn.dataset.choice;
      paint();
    };
  });
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.onclick = () => {
      state.filter = btn.dataset.filter;
      paint();
    };
  });
  const reason = document.getElementById("reason");
  if (reason) {
    reason.oninput = () => {
      state.reason = reason.value;
    };
  }
  const publish = document.getElementById("publish");
  if (publish) {
    publish.onclick = () => {
      if (!deskOpen() || !state.choiceId || !state.seat) return;
      const points = scoreAnswer(true, state.reason, state.seat === "service" || state.seat === "mandate" ? state.band : null);
      const answer = {
        dilemmaId: DATA.week.id,
        week: DATA.week.week,
        circuitId: state.circuitId || state.seat,
        choiceId: state.choiceId,
        reason: state.reason,
        points,
        at: new Date().toISOString(),
      };
      state.answers = [...state.answers.filter((a) => a.dilemmaId !== answer.dilemmaId), answer];
      state.points = Math.round((state.points + points) * 10) / 10;
      saveLocal();
      go("/houses/self");
    };
  }
}

document.getElementById("lang-btn").onclick = () => {
  state.lang = state.lang === "en" ? "fr" : "en";
  saveLocal();
  paint();
};

window.addEventListener("hashchange", paint);

async function boot() {
  loadLocal();
  const [seats, circuits, houses, week] = await Promise.all([
    fetch("./ledger/seats.json").then((r) => r.json()),
    fetch("./ledger/circuits.json").then((r) => r.json()),
    fetch("./ledger/houses.json").then((r) => r.json()),
    fetch("./ledger/season-1/week-1.json").then((r) => r.json()),
  ]);
  DATA = { seats: seats.seats, circuits: circuits.circuits, houses: houses.houses, week };
  paint();
}

boot().catch((err) => {
  document.getElementById("app").innerHTML = `<p class="muted">Could not load the public ledger.</p><pre>${err}</pre>`;
});
