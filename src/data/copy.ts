import type { Band, Copy, Seat } from "@/data/types";

export const SEAT_META: Record<Seat, { title: Copy; kicker: Copy }> = {
  gallery: {
    title: { en: "Public", fr: "Public" },
    kicker: { en: "People like you", fr: "Les gens comme vous" },
  },
  service: {
    title: { en: "Government", fr: "État" },
    kicker: { en: "People who work for the State", fr: "Les agents de l’État" },
  },
  chamber: {
    title: { en: "Elected", fr: "Élus" },
    kicker: { en: "People we vote for", fr: "Les personnes que nous élisons" },
  },
  mandate: {
    title: { en: "UN", fr: "ONU" },
    kicker: { en: "UN and world bodies", fr: "L’ONU et les organisations mondiales" },
  },
};

export const BAND_META: Record<Band, Copy> = {
  "front-line": { en: "Counter", fr: "Guichet" },
  middle: { en: "Supervisor", fr: "Chef" },
  senior: { en: "Director", fr: "Directeur" },
};

export const FAMILY_META: Record<string, Copy> = {
  shared: { en: "All groups", fr: "Tous les groupes" },
  service: { en: "Government", fr: "État" },
  mandate: { en: "UN", fr: "ONU" },
};

export const UI = {
  product: { en: "Honesty League", fr: "Ligue de l’honnêteté" },
  tag: {
    en: "Same questions for everyone. One public score.",
    fr: "Les mêmes questions pour tous. Un score public.",
  },
  actSquare: { en: "1. Look", fr: "1. Voir" },
  actDesk: { en: "2. Answer", fr: "2. Répondre" },
  actStreet: { en: "3. Scores", fr: "3. Scores" },
  daylight: { en: "We play in the open.", fr: "On joue au grand jour." },
  silence: {
    en: "If you say nothing, your chair stays empty.",
    fr: "Si vous ne dites rien, votre chaise reste vide.",
  },
  stampClosed: { en: "Opens 25 Sep", fr: "Ouvre le 25 sept." },
  stampOpen: { en: "Open now", fr: "Ouvert" },
  mkweli: { en: "Made by Mkweli", fr: "Fait par Mkweli" },
  disclaimer: {
    en: "This is not the government. This is not the UN. Points show what you said. They are not a court case.",
    fr: "Ce n’est pas le gouvernement. Ce n’est pas l’ONU. Les points montrent ce que vous avez dit. Ce n’est pas un procès.",
  },
  sit: { en: "Give your answer", fr: "Donnez votre réponse" },
  arena: { en: "Home", fr: "Accueil" },
  play: { en: "Answer", fr: "Répondre" },
  reveal: { en: "Results", fr: "Résultats" },
  houses: { en: "Scores", fr: "Scores" },
  circuits: { en: "Jobs", fr: "Postes" },
  method: { en: "How it works", fr: "Comment ça marche" },
  about: { en: "About", fr: "À propos" },
  weekLive: { en: "Week 1 is open", fr: "La semaine 1 est ouverte" },
  weekOpens: {
    en: "We open on Friday 25 September",
    fr: "On ouvre vendredi 25 septembre",
  },
  closes: { en: "Answers close", fr: "Les réponses ferment" },
  opens: { en: "Answers open", fr: "Les réponses ouvrent" },
  deskLocked: {
    en: "You can look around. You cannot send an answer before Friday 25 September, 9:00 in Mauritius.",
    fr: "Vous pouvez regarder. Vous ne pouvez pas envoyer de réponse avant vendredi 25 septembre, 9 h 00 à Maurice.",
  },
  rehearsal: {
    en: "These scores are a practice round. The real game starts on 25 September.",
    fr: "Ces scores sont un essai. Le vrai jeu commence le 25 septembre.",
  },
  previewDesk: { en: "See the questions", fr: "Voir les questions" },
  empty: { en: "Empty chair", fr: "Chaise vide" },
  points: { en: "Honesty Points", fr: "Points d’honnêteté" },
  publicDesk: { en: "Publish my answer", fr: "Publier ma réponse" },
  chooseSeat: { en: "Who are you?", fr: "Qui êtes-vous ?" },
  reason: {
    en: "Write the rule you will use next time. Forty words give extra points.",
    fr: "Écrivez la règle que vous utiliserez la prochaine fois. Quarante mots donnent des points en plus.",
  },
  words: { en: "words", fr: "mots" },
  yourHouse: { en: "Your glass house", fr: "Votre maison de verre" },
  frost: {
    en: "White glass means silence. Clear glass means you answered.",
    fr: "Le verre blanc veut dire le silence. Le verre clair veut dire que vous avez répondu.",
  },
  shadow: { en: "Who chose what", fr: "Qui a choisi quoi" },
  honestMark: { en: "Honest mark", fr: "Marque HONEST" },
  honestHint: {
    en: "The three highest scores get a QR code. It is a receipt. It is not a prize for being a good person.",
    fr: "Les trois meilleurs scores reçoivent un code QR. C’est un reçu. Ce n’est pas un prix pour être une bonne personne.",
  },
  jobsTitle: {
    en: "Jobs where money can go wrong",
    fr: "Postes où l’argent peut mal tourner",
  },
  methodTitle: {
    en: "How we give points",
    fr: "Comment on donne les points",
  },
  methodLead: {
    en: "The same answers always get the same score. A computer does not pick a winner. The rules below do.",
    fr: "Les mêmes réponses donnent toujours le même score. Un ordinateur ne choisit pas un gagnant. Les règles ci-dessous le font.",
  },
  methodSteps: [
    {
      en: "You pick a choice. That is 10 points.",
      fr: "Vous choisissez une réponse. Cela fait 10 points.",
    },
    {
      en: "You write why. At least 12 words: +2. At least 40 words: +5.",
      fr: "Vous écrivez pourquoi. Au moins 12 mots : +2. Au moins 40 mots : +5.",
    },
    {
      en: "Every answer is public. We then multiply by 1.5.",
      fr: "Chaque réponse est publique. On multiplie ensuite par 1,5.",
    },
    {
      en: "If you are a supervisor, we multiply by 1.15. If you are a director, by 1.35. A counter job stays at 1.",
      fr: "Si vous êtes chef, on multiplie par 1,15. Si vous êtes directeur, par 1,35. Un poste au guichet reste à 1.",
    },
    {
      en: "If you change your story without saying why: minus 12. If you do not answer: 0 points, and boards go on your house.",
      fr: "Si vous changez d’histoire sans dire pourquoi : moins 12. Si vous ne répondez pas : 0 point, et des planches sur votre maison.",
    },
    {
      en: "The three people with the most points get a QR code. It says “I scored as HONEST with Mkweli”. It is not a medal.",
      fr: "Les trois personnes avec le plus de points reçoivent un code QR. Il dit « I scored as HONEST with Mkweli ». Ce n’est pas une médaille.",
    },
  ] as Copy[],
  aboutLead: {
    en: "Honesty League is a game from Mkweli. Each week, people like you, government workers, elected people, and UN staff answer the same hard question. You get Honesty Points.",
    fr: "La Ligue de l’honnêteté est un jeu de Mkweli. Chaque semaine, les gens comme vous, les agents de l’État, les élus et le personnel de l’ONU répondent à la même question difficile. Vous recevez des points d’honnêteté.",
  },
  aboutFrost: {
    en: "A white house is not a crime. It means you stayed silent, you changed your story, or you did not sit down.",
    fr: "Une maison blanche n’est pas un crime. Cela veut dire que vous avez gardé le silence, changé d’histoire, ou que vous ne vous êtes pas assis.",
  },
  aboutOpen: {
    en: "Season 1. Answers open Friday 25 September 2026, 9:00 in Mauritius. Site: honesty.mkweli.tech.",
    fr: "Saison 1. Les réponses ouvrent vendredi 25 septembre 2026, 9 h 00 à Maurice. Site : honesty.mkweli.tech.",
  },
  revealLead: {
    en: "Here is who answered, and who did not. Empty chairs stay on the page.",
    fr: "Voici qui a répondu, et qui n’a pas répondu. Les chaises vides restent sur la page.",
  },
};
