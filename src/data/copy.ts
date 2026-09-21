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
  objective: {
    en: "Each month the public, government, elected people, and people in world offices answer the same question in the open. You get Honesty Points. If you say nothing, your chair stays empty.",
    fr: "Chaque mois, le public, l’État, les élus et les gens dans les bureaux mondiaux répondent à la même question, au grand jour. Vous recevez des points d’honnêteté. Si vous ne dites rien, votre chaise reste vide.",
  },
  actSquare: { en: "1. Look", fr: "1. Voir" },
  actDesk: { en: "2. Answer", fr: "2. Répondre" },
  actStreet: { en: "3. Scores", fr: "3. Scores" },
  daylight: { en: "We play in the open.", fr: "On joue au grand jour." },
  silence: {
    en: "If you say nothing, your chair stays empty.",
    fr: "Si vous ne dites rien, votre chaise reste vide.",
  },
  stampClosed: { en: "Closed", fr: "Fermé" },
  stampOpen: { en: "Open now", fr: "Ouvert" },
  stampPractice: { en: "Practice", fr: "Essai" },
  mkweli: { en: "Made by Mkweli", fr: "Fait par Mkweli" },
  disclaimer: {
    en: "This is not the government. This is not the UN. Points show what you said. They are not a court case.",
    fr: "Ce n’est pas le gouvernement. Ce n’est pas l’ONU. Les points montrent ce que vous avez dit. Ce n’est pas un procès.",
  },
  sit: { en: "Give your answer", fr: "Donnez votre réponse" },
  enter: { en: "Enter", fr: "Entrer" },
  streetKicker: { en: "Honesty street", fr: "Honesty street" },
  streetHint: {
    en: "Find the Enter button",
    fr: "Trouvez le bouton Entrer",
  },
  arena: { en: "Home", fr: "Accueil" },
  play: { en: "Answer", fr: "Répondre" },
  reveal: { en: "Results", fr: "Résultats" },
  houses: { en: "Scores", fr: "Scores" },
  circuits: { en: "Jobs", fr: "Postes" },
  method: { en: "How it works", fr: "Comment ça marche" },
  about: { en: "About", fr: "À propos" },
  weekLive: { en: "Month 1 is open", fr: "Le mois 1 est ouvert" },
  weekOpens: {
    en: "Testers can play now. Month 1 starts 1 October.",
    fr: "Les testeurs peuvent jouer maintenant. Le mois 1 commence le 1er octobre.",
  },
  closes: { en: "Answers close", fr: "Les réponses ferment" },
  opens: { en: "Month 1 opens", fr: "Le mois 1 ouvre" },
  closeWhen: {
    en: "31 October · 16:00 Mauritius",
    fr: "31 octobre · 16 h 00 à Maurice",
  },
  openWhen: {
    en: "1 October · 09:00 Mauritius",
    fr: "1er octobre · 9 h 00 à Maurice",
  },
  deskLocked: {
    en: "Month 1 is closed. The next month opens 1 November, 9:00 in Mauritius.",
    fr: "Le mois 1 est fermé. Le prochain mois ouvre le 1er novembre, 9 h 00 à Maurice.",
  },
  rehearsal: {
    en: "These scores are practice. League scoring for Month 1 starts 1 October.",
    fr: "Ces scores sont un essai. Le score de la ligue pour le mois 1 commence le 1er octobre.",
  },
  previewDesk: { en: "See the questions", fr: "Voir les questions" },
  empty: { en: "Empty chair", fr: "Chaise vide" },
  points: { en: "Honesty Points", fr: "Points d’honnêteté" },
  publicDesk: { en: "Publish my answer", fr: "Publier ma réponse" },
  chooseSeat: { en: "Who are you?", fr: "Qui êtes-vous ?" },
  reason: {
    en: "Why this choice?",
    fr: "Pourquoi ce choix ?",
  },
  reasonHint: {
    en: "Write it as a rule you can use again. Twelve words: extra points. Forty words: more.",
    fr: "Écrivez-le comme une règle que vous pourrez réutiliser. Douze mots : points en plus. Quarante mots : davantage.",
  },
  words: { en: "words", fr: "mots" },
  wordMarks: {
    en: "12 extra · 40 more",
    fr: "12 en plus · 40 davantage",
  },
  yourHouseStreet: {
    en: "Your house is on the street.",
    fr: "Votre maison est dans la rue.",
  },
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
  methodLeagueTitle: { en: "The league", fr: "La ligue" },
  methodLeague: [
    {
      en: "One multiple-choice question each month, plus a written why.",
      fr: "Une question à choix chaque mois, plus un pourquoi écrit.",
    },
    {
      en: "The same question for the public, government, elected people, and people in world offices.",
      fr: "La même question pour le public, l’État, les élus, et les gens dans les bureaux mondiaux.",
    },
    {
      en: "You sit down with your name. Your phone stays private. Then you answer.",
      fr: "Vous vous asseyez avec votre nom. Votre téléphone reste privé. Ensuite vous répondez.",
    },
  ] as Copy[],
  methodHouseClear: {
    en: "Your score builds a glass house on the street. Clear glass means you answered.",
    fr: "Votre score construit une maison de verre dans la rue. Le verre clair veut dire que vous avez répondu.",
  },
  methodHouseBoards: {
    en: "If you do not answer, boards go on the house and the chair stays empty.",
    fr: "Si vous ne répondez pas, des planches vont sur la maison et la chaise reste vide.",
  },
  methodStreet: { en: "See the street", fr: "Voir la rue" },
  sitDown: { en: "Sit down", fr: "S’asseoir" },
  sitDownLead: {
    en: "Your name is on the house. Your phone stays private.",
    fr: "Votre nom est sur la maison. Votre téléphone reste privé.",
  },
  sitDownName: { en: "Name on the house", fr: "Nom sur la maison" },
  sitDownPhone: { en: "Phone", fr: "Téléphone" },
  sitDownHint: {
    en: "Mauritius number. We do not show it.",
    fr: "Numéro de Maurice. On ne l’affiche pas.",
  },
  sitDownNeed: {
    en: "Sit down with your name before you publish a score.",
    fr: "Asseyez-vous avec votre nom avant de publier un score.",
  },
  sitDownError: {
    en: "Write your name and a Mauritius phone number.",
    fr: "Écrivez votre nom et un numéro de Maurice.",
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
    en: "Honesty League is a game from Mkweli, made in Mauritius. Neighbours, people who work for the State, people we vote for, and people in world offices answer the same monthly question. It is not the government. It is not the UN.",
    fr: "La Ligue de l’honnêteté est un jeu de Mkweli, fait à Maurice. Les voisins, les agents de l’État, les personnes que nous élisons, et les gens dans les bureaux mondiaux répondent à la même question chaque mois. Ce n’est pas le gouvernement. Ce n’est pas l’ONU.",
  },
  aboutFrost: {
    en: "A white house is not a crime. It means you stayed silent, you changed your story, or you did not sit down.",
    fr: "Une maison blanche n’est pas un crime. Cela veut dire que vous avez gardé le silence, changé d’histoire, ou que vous ne vous êtes pas assis.",
  },
  aboutOpen: {
    en: "Season 1. Testers can play now. Month 1 scoring starts 1 October 2026, 9:00 in Mauritius, and runs to 31 October. Then a new question each month. Site: honesty.mkweli.tech.",
    fr: "Saison 1. Les testeurs peuvent jouer maintenant. Le score du mois 1 commence le 1er octobre 2026, 9 h 00 à Maurice, jusqu’au 31 octobre. Ensuite une nouvelle question chaque mois. Site : honesty.mkweli.tech.",
  },
  revealLead: {
    en: "Here is who answered, and who did not. Empty chairs stay on the page.",
    fr: "Voici qui a répondu, et qui n’a pas répondu. Les chaises vides restent sur la page.",
  },
};
