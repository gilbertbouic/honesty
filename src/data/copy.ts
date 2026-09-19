import type { Copy, Seat } from "@/data/types";

export const SEAT_META: Record<
  Seat,
  { title: Copy; kicker: Copy }
> = {
  gallery: {
    title: { en: "Gallery", fr: "Galerie" },
    kicker: { en: "Laypeople", fr: "Citoyens" },
  },
  service: {
    title: { en: "Service", fr: "Service" },
    kicker: { en: "Civil service circuits", fr: "Circuits de la fonction publique" },
  },
  chamber: {
    title: { en: "Chamber", fr: "Chambre" },
    kicker: { en: "Elected office", fr: "Mandat électif" },
  },
  mandate: {
    title: { en: "Mandate", fr: "Mandat" },
    kicker: { en: "UN system and treaty bodies", fr: "Système ONU et organes conventionnels" },
  },
};

export const UI = {
  product: { en: "Honesty League", fr: "Ligue de l’honnêteté" },
  tag: {
    en: "Same questions. Four seats. One public score.",
    fr: "Les mêmes questions. Quatre sièges. Un score public.",
  },
  actSquare: { en: "I · The square", fr: "I · La place" },
  actDesk: { en: "II · The desk", fr: "II · Le pupitre" },
  actStreet: { en: "III · The street", fr: "III · La rue" },
  daylight: { en: "Daylight is the point.", fr: "Le jour est le principe." },
  silence: { en: "Silence is an Empty Chair.", fr: "Le silence est une chaise vide." },
  stampClosed: { en: "Opens 25 Sep", fr: "Ouvre le 25 sept." },
  stampOpen: { en: "Desk open", fr: "Pupitre ouvert" },
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
