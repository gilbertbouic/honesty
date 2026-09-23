// src/lib/game/i18n.ts
var LANG_KEY = "village-grid-lang";
var UI = {
  en: {
    title: "Integrity Village",
    goal: "Obtain max scores in all 6 stages to win an integrity cap.",
    stage1: "Stage 1: Public Tenders",
    stage2: "Stage 2: Whistle-blower",
    dev: "In development",
    stage3: "Stage 3: Domestic Violence",
    stage4: "Stage 4: Land",
    stage5: "Stage 5: Agriculture",
    stage6: "Stage 6: Elections",
    choose: "Choose your character",
    enter: "Enter",
    langLabel: "Language",
    projectPhase: "Project phase",
    phaseTender: "Public Tenders",
    phaseWhistle: "Whistle-blower \xB7 unexplained wealth",
    tenders: "Tenders",
    whistle: "Whistle",
    playingAs: "Playing as",
    contractsWon: "Contracts won",
    whistleScore: "Whistle score",
    reset: "Reset",
    activeBidders: "Active characters \xB7 4 bidding",
    casesFiled: "Cases \xB7 {n}/{total} filed",
    you: "you",
    questions: "Questions {n} of {total}",
    tender: "Tender",
    case: "Case",
    grid: "Grid",
    lockHint: "Win every renovation with a correct top-score bid to unlock stage 2",
    whistleHint: "Whistle-blower brief",
    backTenders: "Back to tenders",
    infra: "Infrastructure tender",
    brief: "Whistle-blower brief",
    awardedGreen: "Bid awarded \xB7 house turns green",
    rejectedRed: "Bid rejected \xB7 house turns red",
    awardRule: "Award rule",
    awardBody: "Correct top score turns the house green. Anything else is refused and turns red. Win all {n} to unlock stage 2.",
    nextReno: "Next renovation",
    openBrief: "Open whistle-blower brief",
    noSweep: "No clean sweep. Reset and win every contract to unlock stage 2.",
    reportHolds: "Report holds \xB7 +100",
    weakFile: "Weak file \xB7 +20",
    scoring: "Scoring",
    scoringBody: "4\u20135 correct: {name} jailed, assets seized. 2\u20133: he burns your lodging. 0\u20131: you are chased out of the village.",
    nextCase: "Next case",
    doneJail: "Brief complete \xB7 trafficker jailed",
    doneBurn: "Brief complete \xB7 lodging burned",
    doneExile: "Brief complete \xB7 you are exiled",
    bidStandings: "Bid standings",
    reportStandings: "Report standings",
    leading: "Leading characters",
    stronger: "Who filed the stronger brief",
    awardedN: "{n} awarded",
    refusedN: "{n} refused",
    specsN: "{n} specs.",
    jailed: "{name} jailed",
    burned: "lodging burned",
    exiled: "exiled",
    fileOpen: "file still open",
    boardTender: "Contractor leaderboard",
    boardWhistle: "Whistle-blower file",
    topScore: "Top score",
    midScore: "Mid score",
    lowScore: "Low score",
    jailTitle: "{name} jailed",
    jailBody: "The file held. Police remand the dive master. Villa, car and boat are seized. The entourage is taken off the compound.",
    burnTitle: "Your lodging is burning",
    burnBody: "The file was too thin. Ravi\u2019s crew torch the lodging you sleep in. The villa still stands.",
    exileTitle: "Chased out of the village",
    exileBody: "You stayed too quiet. Ravi\u2019s crew run you off the Terre Rouge grid. Do not come back on this round.",
    scoreLine: "Whistle score \xB7 {score}/500",
    watchGrid: "Watch the grid",
    openSpec: "Open spec",
    bids: "Bids",
    dockAward: "Awarded \xB7 house green \xB7 {owner}",
    dockReject: "Bid rejected \xB7 house closed in red",
    toastLock: "Stage 2 is locked. Win every renovation with a correct top-score bid first.",
    toastAward: "{name} takes {house} \xB7 bid {score}",
    toastReject: "Bid rejected. Only a correct top score awards the renovation.",
    toastSweep: "Clean sweep. Whistle-blower brief unlocked.",
    toastNoSweep: "Stage 1 closed without max scores. Reset and win every contract to unlock stage 2.",
    toastJail: "Top score. Ravi is jailed. Villa, car and boat seized.",
    toastBurn: "Mid score. Ravi torches your lodging.",
    toastExile: "Low score. Ravi's crew run you out of the village.",
    toastFiled: "Report filed. Keep going.",
    toastWeak: "Weak file. That answer will not hold.",
    theContract: "the contract",
    awardedTag: "awarded",
    rejectedTag: "rejected",
    wage: "Rs 15,000 / month",
    job: "Dive master",
    foot: "Six stages. Not a court.",
    resetRound: "Reset round"
  },
  fr: {
    title: "Village Int\xE9grit\xE9",
    goal: "Obtiens le score maximum aux 6 \xE9tapes pour gagner une casquette int\xE9grit\xE9.",
    stage1: "\xC9tape 1 : March\xE9s publics",
    stage2: "\xC9tape 2 : Lanceur d'alerte",
    dev: "En d\xE9veloppement",
    stage3: "\xC9tape 3 : Violence domestique",
    stage4: "\xC9tape 4 : Terrain",
    stage5: "\xC9tape 5 : Agriculture",
    stage6: "\xC9tape 6 : \xC9lections",
    choose: "Choisis ton personnage",
    enter: "Entrer",
    langLabel: "Langue",
    projectPhase: "Phase du projet",
    phaseTender: "March\xE9s publics",
    phaseWhistle: "Lanceur d'alerte \xB7 richesse inexpliqu\xE9e",
    tenders: "March\xE9s",
    whistle: "Alerte",
    playingAs: "Tu joues",
    contractsWon: "Contrats gagn\xE9s",
    whistleScore: "Score alerte",
    reset: "R\xE9init.",
    activeBidders: "Personnages actifs \xB7 4 en lice",
    casesFiled: "Dossiers \xB7 {n}/{total} d\xE9pos\xE9s",
    you: "toi",
    questions: "Questions {n} sur {total}",
    tender: "March\xE9",
    case: "Dossier",
    grid: "Grille",
    lockHint: "Gagne chaque r\xE9novation avec une offre correcte au score max pour ouvrir l'\xE9tape 2",
    whistleHint: "Dossier du lanceur d'alerte",
    backTenders: "Retour aux march\xE9s",
    infra: "Appel d'offres",
    brief: "Dossier du lanceur d'alerte",
    awardedGreen: "Offre retenue \xB7 la maison passe au vert",
    rejectedRed: "Offre refus\xE9e \xB7 la maison passe au rouge",
    awardRule: "R\xE8gle d'attribution",
    awardBody: "Un score maximal correct passe la maison au vert. Tout le reste est refus\xE9 et passe au rouge. Gagne les {n} pour ouvrir l'\xE9tape 2.",
    nextReno: "R\xE9novation suivante",
    openBrief: "Ouvrir le dossier d'alerte",
    noSweep: "Pas de sans-faute. R\xE9initialise et gagne chaque contrat pour ouvrir l'\xE9tape 2.",
    reportHolds: "Signalement tenu \xB7 +100",
    weakFile: "Dossier faible \xB7 +20",
    scoring: "Bar\xE8me",
    scoringBody: "4\u20135 justes : {name} en prison, biens saisis. 2\u20133 : il br\xFBle ton logement. 0\u20131 : tu es chass\xE9 du village.",
    nextCase: "Dossier suivant",
    doneJail: "Dossier clos \xB7 trafiquant emprisonn\xE9",
    doneBurn: "Dossier clos \xB7 logement br\xFBl\xE9",
    doneExile: "Dossier clos \xB7 tu es exil\xE9",
    bidStandings: "Classement des offres",
    reportStandings: "Classement des signalements",
    leading: "Personnages en t\xEAte",
    stronger: "Qui a d\xE9pos\xE9 le meilleur dossier",
    awardedN: "{n} retenues",
    refusedN: "{n} refus\xE9es",
    specsN: "{n} cahiers.",
    jailed: "{name} en prison",
    burned: "logement br\xFBl\xE9",
    exiled: "exil\xE9",
    fileOpen: "dossier encore ouvert",
    boardTender: "Classement des personnages",
    boardWhistle: "Dossier du lanceur d'alerte",
    topScore: "Score max",
    midScore: "Score moyen",
    lowScore: "Score bas",
    jailTitle: "{name} en prison",
    jailBody: "Le dossier tient. La police place le moniteur de plong\xE9e en d\xE9tention. Villa, voiture et bateau sont saisis. L'entourage quitte le domaine.",
    burnTitle: "Ton logement br\xFBle",
    burnBody: "Le dossier \xE9tait trop mince. L'\xE9quipe de Ravi incendie le logement o\xF9 tu dors. La villa tient encore.",
    exileTitle: "Chass\xE9 du village",
    exileBody: "Tu es rest\xE9 trop silencieux. L'\xE9quipe de Ravi te chasse de la grille de Terre Rouge. Ne reviens pas sur cette manche.",
    scoreLine: "Score alerte \xB7 {score}/500",
    watchGrid: "Voir la grille",
    openSpec: "Ouvrir le cahier",
    bids: "Offres",
    dockAward: "Retenue \xB7 maison verte \xB7 {owner}",
    dockReject: "Offre refus\xE9e \xB7 maison ferm\xE9e en rouge",
    toastLock: "L'\xE9tape 2 est verrouill\xE9e. Gagne d'abord chaque r\xE9novation avec une offre correcte au score max.",
    toastAward: "{name} remporte {house} \xB7 offre {score}",
    toastReject: "Offre refus\xE9e. Seul un score maximal correct attribue la r\xE9novation.",
    toastSweep: "Sans-faute. Dossier du lanceur d'alerte ouvert.",
    toastNoSweep: "\xC9tape 1 close sans scores max. R\xE9initialise et gagne chaque contrat pour ouvrir l'\xE9tape 2.",
    toastJail: "Score max. Ravi est en prison. Villa, voiture et bateau saisis.",
    toastBurn: "Score moyen. Ravi incendie ton logement.",
    toastExile: "Score bas. L'\xE9quipe de Ravi te chasse du village.",
    toastFiled: "Signalement d\xE9pos\xE9. Continue.",
    toastWeak: "Dossier faible. Cette r\xE9ponse ne tiendra pas.",
    theContract: "le contrat",
    awardedTag: "retenue",
    rejectedTag: "refus\xE9e",
    wage: "Rs 15 000 / mois",
    job: "Moniteur de plong\xE9e",
    foot: "Six \xE9tapes. Pas un tribunal.",
    resetRound: "R\xE9initialiser"
  }
};
function loadLang() {
  if (typeof window === "undefined") return "en";
  try {
    const raw = localStorage.getItem(LANG_KEY);
    return raw === "fr" ? "fr" : "en";
  } catch {
    return "en";
  }
}
function t(lang, key, vars = {}) {
  let s = UI[lang][key] ?? UI.en[key];
  for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}
var TENDER_FR = {
  "spec-01": {
    title: "Renouvellement du r\xE9seau d'eau",
    question: "Un sous-traitant propose une ristourne hors livres pour acc\xE9l\xE9rer les mat\xE9riaux. Dans le cadre de transparence, comment faut-il l'enregistrer ?",
    options: {
      A: "L'accepter comme remise CWA et la d\xE9duire des frais de raccordement de Terre Rouge, hors dossier d'appel d'offres.",
      B: "La ristourne ne doit pas \xEAtre accept\xE9e ; elle doit \xEAtre enti\xE8rement divulgu\xE9e et rejet\xE9e comme manquement.",
      C: "Placer la somme sur un compte de travaux du conseil de district de Pamplemousses pour des am\xE9nagements informels plus tard.",
      D: "La classer comme commission coutumi\xE8re au titre du Public Procurement Act, visible seulement au minist\xE8re des Finances."
    }
  },
  "spec-02": {
    title: "Registre des \xE9tals",
    question: "Un commer\xE7ant propose une enveloppe chaque semaine pour que son emplacement reste hors de la liste officielle. Comment faut-il l'enregistrer ?",
    options: {
      A: "Prendre l'enveloppe et garder l'\xE9tal comme extension informelle du march\xE9.",
      B: "Refuser l'enveloppe, la divulguer, et garder chaque emplacement sur la liste officielle.",
      C: "Mettre l'argent dans la caisse th\xE9 du comit\xE9 du march\xE9 pour acheter des b\xE2ches.",
      D: "L'accepter comme frais de raccordement CWA pour le robinet de l'\xE9tal."
    }
  },
  "spec-03": {
    title: "Appel d'offres du dispensaire",
    question: "Un fournisseur propose des tests paludisme p\xE9rim\xE9s \xE0 moiti\xE9 prix si le num\xE9ro de lot est r\xE9\xE9crit sur le bon de r\xE9ception. Quelle est l'action licite ?",
    options: {
      A: "R\xE9\xE9crire le bon et n'\xE9mettre les tests qu'au poste avanc\xE9.",
      B: "Accepter le lot pour la r\xE9serve et le remplacer apr\xE8s la saison cyclonique.",
      C: "Refuser les tests, divulguer l'offre, et garder le stock en date pr\xE9vu.",
      D: "Le classer comme don d'urgence du minist\xE8re de la Sant\xE9."
    }
  },
  "spec-04": {
    title: "Toitures de la cit\xE9",
    question: "Un fournisseur propose une membrane de toit non certifi\xE9e \xE0 moiti\xE9 prix si la photo d'inspection est prise depuis la cour, pas du toit. Quelle est l'action licite ?",
    options: {
      A: "L'accepter seulement pour les blocs arri\xE8re et garder le stock certifi\xE9 sur la fa\xE7ade rue.",
      B: "Classer l'\xE9conomie comme ristourne d'\xE9tanch\xE9it\xE9 CWA une fois les t\xF4les pos\xE9es.",
      C: "Refuser la membrane, divulguer l'offre, et garder le syst\xE8me certifi\xE9 pr\xE9vu.",
      D: "Poser la membrane bon march\xE9 maintenant et la remplacer apr\xE8s la saison cyclonique."
    }
  },
  "spec-05": {
    title: "C\xE2blage du bloc B",
    question: "L'\xE9lectricien retenu est pris trois semaines. Un cousin propose de mettre le bloc B sous tension ce soir sans fiche d'essai CEB. Comment traiter cela ?",
    options: {
      A: "Refuser. Garder l'\xE9lectricien pr\xE9vu et attendre une fiche d'essai CEB sign\xE9e.",
      B: "Mettre sous tension seulement l'escalier commun et le noter comme \xE9clairage d'urgence.",
      C: "Laisser le cousin travailler si un membre du comit\xE9 de village regarde.",
      D: "Payer un commis CEB en liquide pour antidater la fiche d'essai."
    }
  },
  "spec-06": {
    title: "Travaux de l'\xE9cole primaire",
    question: "Le tr\xE9sorier de l'APE propose une enveloppe pour sauter l'attente du certificat incendie et rouvrir lundi. Que dois-tu faire ?",
    options: {
      A: "Prendre l'enveloppe, rouvrir, et classer le certificat plus tard.",
      B: "Rouvrir seulement le rez-de-chauss\xE9e et garder l'\xE9tage ferm\xE9.",
      C: "Garder l'argent dans le coffre de l'\xE9cole jusqu'\xE0 ce que le minist\xE8re de l'\xC9ducation le demande.",
      D: "Refuser l'enveloppe, la divulguer, et attendre le certificat incendie licite."
    }
  },
  "spec-07": {
    title: "Sous-station CEB",
    question: "Les travaux de nuit peuvent commencer 48 heures plus t\xF4t si tu sautes l'arr\xEAt\xE9 de d\xE9viation de la Traffic Management and Road Safety Unit. Quelle est l'action licite ?",
    options: {
      A: "Commencer \xE0 21 h et poser les c\xF4nes vous-m\xEAmes.",
      B: "Commencer seulement dans les ruelles de la cit\xE9 et garder la route class\xE9e ferm\xE9e.",
      C: "Ne pas ouvrir le chantier tant que l'arr\xEAt\xE9 de d\xE9viation sign\xE9 n'est pas au dossier.",
      D: "Appeler le conseiller de district et traiter un accord verbal comme l'arr\xEAt\xE9."
    }
  },
  "spec-08": {
    title: "Dalots de mousson",
    question: "L'entrepreneur propose des buses non certifi\xE9es, restes d'une villa priv\xE9e \xE0 Grand Baie, pour battre l'\xE9ch\xE9ance de mousson. Comment traiter cela ?",
    options: {
      A: "Approuver un avenant et rebaptiser les buses stock d'urgence de la National Development Unit.",
      B: "Rejeter les buses non certifi\xE9es, divulguer la proposition, et garder les dalots certifi\xE9s pr\xE9vus.",
      C: "Utiliser les restes sous la r\xE9serve CWA et les remplacer apr\xE8s la saison cyclonique.",
      D: "Partager le lot : buses certifi\xE9es sur la route class\xE9e, restes dans les cit\xE9s."
    }
  },
  "spec-09": {
    title: "\xC9clairage public CEB",
    question: "Un fournisseur propose des luminaires LED non homologu\xE9s \xE0 40 % sous le bordereau, en liquide, si la fiche d'inspection est sign\xE9e ce soir. Quelle est l'action licite ?",
    options: {
      A: "Signer la fiche et noter l'\xE9conomie plus tard comme ristourne d'efficacit\xE9 \xE9nerg\xE9tique CEB.",
      B: "Accepter les luminaires seulement dans les rues de cit\xE9 et garder le stock homologu\xE9 sur la route class\xE9e.",
      C: "Garder le liquide dans le coffre du comit\xE9 jusqu'\xE0 ce que le National Audit Office le demande.",
      D: "Refuser les luminaires, divulguer l'offre, et garder le bordereau homologu\xE9."
    }
  },
  "spec-10": {
    title: "Centre communautaire",
    question: "Le tr\xE9sorier du comit\xE9 demande de scinder la r\xE9novation de la salle en trois factures pour rester sous le seuil du Public Procurement Act. Comment l'enregistrer ?",
    options: {
      A: "Garder un seul contrat. Ne pas scinder les travaux pour \xE9chapper au seuil.",
      B: "Scinder et attribuer une facture \xE0 chaque entrepreneur ami.",
      C: "Scinder seulement la peinture et l'\xE9lectricit\xE9, garder le toit en un lot.",
      D: "Parquer deux factures sur le compte d'aide sociale et une sur le dossier de la salle."
    }
  },
  "spec-11": {
    title: "Location de la salle civique",
    question: "Le commis dit que la location du week-end peut se passer de re\xE7u si l'argent lui est vers\xE9 apr\xE8s les heures. Comment traiter cela ?",
    options: {
      A: "Prendre le liquide et le noter plus tard comme don du comit\xE9 de village.",
      B: "\xC9mettre un re\xE7u num\xE9rot\xE9, verser la location en banque, et garder la r\xE9servation au dossier.",
      C: "Partager : moiti\xE9 au commis, moiti\xE9 au compte d'aide sociale.",
      D: "Autoriser le liquide seulement pour les habitants de Terre Rouge, re\xE7us pour les autres."
    }
  },
  "spec-12": {
    title: "Panneaux d'abribus",
    question: "Un annonceur propose de poser les panneaux gratuitement si le contrat est attribu\xE9 hors appel d'offres et pay\xE9 en liquide. Quelle est l'action licite ?",
    options: {
      A: "Accepter les panneaux gratuits et noter le liquide comme ristourne d'\xE9clairage CEB.",
      B: "L'attribuer de vive voix si le conseiller de district est d'accord.",
      C: "Poser les panneaux maintenant et lancer l'appel d'offres apr\xE8s la saison cyclonique.",
      D: "Refuser le march\xE9 hors appel d'offres, divulguer l'offre, et garder la proc\xE9dure publi\xE9e."
    }
  }
};
var CASE_FR = {
  car: {
    title: "Voiture de luxe",
    question: "Ravi est moniteur de plong\xE9e \xE0 Rs 15 000 par mois. Cette semaine il gare un SUV neuf de plusieurs millions de roupies devant la cit\xE9. Un cousin dit de se taire \u2014 \xAB c'est une affaire de famille \xBB. Quelle est l'action licite ?",
    options: {
      A: "Se taire. Un moniteur peut avoir un oncle riche en Italie et le village ne doit pas fouiller un garage.",
      B: "D\xE9poser un signalement de richesse suspecte \xE0 la police / l'ADSU. Un salaire de Rs 15 000 n'explique pas une voiture de plusieurs millions. Ne prends pas d'argent du silence.",
      C: "Accepter Rs 20 000 pour \xAB surveiller la voiture la nuit \xBB et garder l'immatriculation hors de tout dossier.",
      D: "Publier la plaque sur une page de rumeurs et s'arr\xEAter l\xE0. Ni rapport officiel, ni dossier."
    }
  },
  villa: {
    title: "Villa de luxe",
    question: "Ravi commence une villa de trois \xE9tages en pierre import\xE9e avec piscine, toujours au salaire de moniteur. Le ma\xE7on murmure que le permis \xAB s'arrange \xBB. Restes-tu silencieux ?",
    options: {
      A: "Demander un travail sur le chantier et prendre une enveloppe \xE0 la fin de chaque \xE9tage.",
      B: "Se taire. C'est son terrain. Un homme peut b\xE2tir comme il veut si les voisins aiment le rendu.",
      C: "Signaler le chantier inexpliqu\xE9. Exiger le dossier de permis. Un salaire de Rs 15 000 ne finance pas une villa.",
      D: "Le dire en priv\xE9 au conseiller de district autour d'un verre et traiter un hochement comme le permis."
    }
  },
  boat: {
    title: "Bateau de luxe",
    question: "Un cabin-cruiser appara\xEEt sur une remorque derri\xE8re la villa. Pas de num\xE9ro d'immatriculation, carburant en liquide, sorties de nuit vers le r\xE9cif. Ravi t'offre une partie de p\xEAche si tu te tais. Que dois-tu faire ?",
    options: {
      A: "Accepter la sortie, photographier le coucher de soleil, et garder le bateau hors de tout dossier.",
      B: "Signaler le navire non immatricul\xE9 et le carburant en liquide. Un bien marin inexpliqu\xE9 sur un salaire de moniteur est un signal de trafic.",
      C: "D\xE9placer la remorque derri\xE8re le hangar du march\xE9 pour que la patrouille ne la voie pas.",
      D: "Se taire. Les bateaux sont un loisir c\xF4tier. Un moniteur de plong\xE9e est cens\xE9 en avoir un."
    }
  },
  clothes: {
    title: "V\xEAtements de marque",
    question: "Ravi porte soudain des chemises de marque, une montre en or, et des sacs qui co\xFBtent plus de trois mois de salaire. Il rit : \xAB les clients donnent des pourboires en euros. \xBB Un voisin te demande de te taire. Quelle est l'action licite ?",
    options: {
      A: "Se taire. Les v\xEAtements sont priv\xE9s. Un homme peut s'habiller comme il veut apr\xE8s une bonne saison.",
      B: "Emprunter la montre pour un mariage et la rendre sans note au dossier.",
      C: "Noter le train de vie inexpliqu\xE9 face au salaire d\xE9clar\xE9 et le joindre au m\xEAme signalement de richesse suspecte.",
      D: "Lui demander de payer une tourn\xE9e \xE0 la boutique et traiter cela comme preuve que l'argent est propre."
    }
  },
  entourage: {
    title: "L'entourage",
    question: "Un groupe tournant de femmes \xE9trang\xE8res loge maintenant \xE0 la villa. Aucune n'a de famille \xE0 Terre Rouge, aucune ne montre de permis de travail, et elles ne prennent jamais le bus de jour. Ravi dit de se taire ou de perdre ton toit. Que dois-tu faire ?",
    options: {
      A: "Se taire. Les invit\xE9s sont priv\xE9s. Un moniteur peut recevoir qui il veut.",
      B: "Prendre de l'argent pour \xAB regarder ailleurs \xE0 la grille \xBB et garder les noms hors de tout dossier.",
      C: "Entrer seul dans la villa la nuit et ordonner au groupe de partir, sans dossier de police.",
      D: "Signaler un h\xE9bergement et un trafic suspects \xE0 la police. Ne pas se taire. Ne pas affronter la villa soi-m\xEAme."
    }
  }
};
var HOUSE_FR = {
  "cwa-pump": { name: "Station de pompage CWA", hint: "R\xE9seau d'eau \xB7 SPEC-01" },
  "block-a": { name: "Bloc A de Terre Rouge", hint: "Toitures de cit\xE9 \xB7 SPEC-04" },
  "block-b": { name: "Bloc B de Terre Rouge", hint: "C\xE2blage de cit\xE9 \xB7 SPEC-05" },
  market: { name: "Hangar du march\xE9", hint: "\xC9tals \xB7 SPEC-02" },
  clinic: { name: "Dispensaire de district", hint: "R\xE9serves \xB7 SPEC-03" },
  school: { name: "\xC9cole primaire", hint: "Travaux scolaires \xB7 SPEC-06" },
  hall: { name: "Salle civique", hint: "Location \xB7 SPEC-11" },
  bus: { name: "Abribus", hint: "Panneaux \xB7 SPEC-12" },
  power: { name: "Sous-station CEB", hint: "Alimentation \xE9clairage \xB7 SPEC-07" },
  drain: { name: "N\u0153ud de drainage", hint: "Land Drainage Authority \xB7 SPEC-08" },
  light: { name: "M\xE2t d'\xE9clairage", hint: "Route class\xE9e CEB \xB7 SPEC-09" },
  community: { name: "Centre communautaire", hint: "Salle du comit\xE9 \xB7 SPEC-10" }
};
var SHORT_FR = {
  "cwa-pump": "CWA",
  market: "March\xE9",
  clinic: "Clinique",
  "block-a": "Bloc A",
  "block-b": "Bloc B",
  school: "\xC9cole",
  power: "CEB",
  drain: "Drain",
  light: "Lumi\xE8re",
  community: "Centre",
  hall: "Civique",
  bus: "Bus",
  car: "Voiture",
  villa: "Villa",
  boat: "Bateau",
  clothes: "V\xEAtements",
  entourage: "Entourage"
};
function shortLabel(id, lang, fallback) {
  if (lang === "fr" && SHORT_FR[id]) return SHORT_FR[id];
  return fallback;
}
function houseLabel(house, lang) {
  if (!house) return t(lang, "theContract");
  if (lang === "fr" && HOUSE_FR[house.id]) return HOUSE_FR[house.id].name;
  return house.name;
}
function houseHint(house, lang) {
  if (lang === "fr" && HOUSE_FR[house.id]) return HOUSE_FR[house.id].hint;
  return house.hint;
}
function localizeTender(tender, lang) {
  const fr = lang === "fr" ? TENDER_FR[tender.id] : void 0;
  if (!fr) return tender;
  return {
    ...tender,
    title: fr.title,
    question: fr.question,
    options: tender.options.map((opt) => ({ ...opt, text: fr.options[opt.id] ?? opt.text }))
  };
}
function localizeCase(item, lang) {
  const fr = lang === "fr" ? CASE_FR[item.id] : void 0;
  if (!fr) return item;
  return {
    ...item,
    title: fr.title,
    question: fr.question,
    options: item.options.map((opt) => ({ ...opt, text: fr.options[opt.id] ?? opt.text }))
  };
}
export {
  LANG_KEY,
  houseHint,
  houseLabel,
  loadLang,
  localizeCase,
  localizeTender,
  shortLabel,
  t
};
