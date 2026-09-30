// src/lib/game/i18n.ts
var LANG_KEY = "village-grid-lang";
var UI = {
  en: {
    title: "Integrity Village",
    goal: "Obtain max scores in all 10 stages to win an integrity cap.",
    stage1: "Stage 1 \xB7 Public tenders",
    stage2: "Stage 2 \xB7 Whistle-blower",
    dev: "In development",
    stage3: "Stage 3 \xB7 Domestic violence",
    stage4: "Stage 4 \xB7 Land use",
    stage5: "Stage 5 \xB7 Discrimination",
    stage6: "Stage 6 \xB7 Agriculture",
    stage7: "Stage 7 \xB7 Financial crime",
    choose: "Choose your character",
    enter: "Enter",
    howtoKicker: "How to play",
    howtoTitle: "Instructions",
    howtoLead: "Read this page before you enter the village. The file is public. The room shows the outcome.",
    howtoScore: "Most stages have six questions. A hold scores +100. A slip scores +20.",
    howtoOutcomes: "Three pictures close each file. The village rule is one line.",
    howtoOrder: "Stages unlock in order. Answer every question on a stage before the next door opens.",
    howtoCap: "Obtain max scores on all ten stages to win an integrity cap.",
    howtoNext: "Continue to enter",
    portrait: "Portrait",
    landscape: "Landscape",
    langLabel: "Language",
    projectPhase: "Project phase",
    phaseTender: "Stage 1 \xB7 Public tenders",
    phaseWhistle: "Stage 2 \xB7 Whistle-blower",
    tenders: "Stage 1",
    whistle: "Stage 2",
    playingAs: "Playing as",
    contractsWon: "Stage 1 score",
    whistleScore: "Stage 2 score",
    reset: "Reset",
    resetStage: "Reset stage",
    resetGame: "Reset game",
    continue: "Continue",
    nextStage: "Next stage",
    confirmReset: "Confirm reset",
    sheetMeta: "{n}/{total} \xB7 {score}",
    activeBidders: "Committee",
    casesFiled: "Cases \xB7 {n}/{total} filed",
    you: "you",
    youName: "You",
    seatName: "Committee",
    questions: "Questions {n} of {total}",
    tender: "Tender",
    case: "Case",
    grid: "Grid",
    lockHint: "Hold every award with a correct committee decision to unlock stage 2",
    whistleHint: "Whistle-blower brief",
    backTenders: "Back to tenders",
    infra: "Stage 1 \xB7 Public tenders",
    brief: "Stage 2 \xB7 Whistle-blower",
    awardedGreen: "Award held \xB7 house turns green",
    rejectedRed: "Award refused \xB7 house turns red",
    awardRule: "Committee rule",
    awardBody: "A correct decision turns the house green. A wrong decision is refused and turns red. Hold all {n} to unlock stage 2.",
    nextReno: "Next tender",
    openBrief: "Open stage 2",
    noSweep: "No clean sweep. Reset and hold every award to unlock stage 2.",
    reportHolds: "Report holds \xB7 +100",
    weakFile: "Weak file \xB7 +20",
    scoring: "Scoring",
    scoringBody: "4\u20135 correct: {name} jailed, assets seized. 2\u20133: he burns your lodging. 0\u20131: you are chased out of the village.",
    nextCase: "Next case",
    doneJail: "Brief complete \xB7 trafficker jailed",
    doneBurn: "Brief complete \xB7 lodging burned",
    doneExile: "Brief complete \xB7 you are exiled",
    openLine: "Open stage 3",
    bidStandings: "Committee file",
    reportStandings: "Report standings",
    leading: "Your score",
    stronger: "Who filed the stronger brief",
    awardedN: "{n} awarded",
    refusedN: "{n} refused",
    specsN: "{n} specs.",
    noAward: "No award yet",
    awardsHeldN: "{n} awards held",
    jailed: "{name} jailed",
    burned: "lodging burned",
    exiled: "exiled",
    fileOpen: "file still open",
    boardTender: "Stage 1 \xB7 Public tenders",
    boardWhistle: "Stage 2 \xB7 Whistle-blower",
    topScore: "Top score",
    midScore: "Mid score",
    lowScore: "Low score",
    jailTitle: "{name} jailed",
    jailBody: "The file held. Police remand the dive master. Villa, car and boat are seized. The entourage is taken off the compound.",
    burnTitle: "Your lodging is burning",
    burnBody: "The file was too thin. Ravi\u2019s crew torch the lodging you sleep in. The villa still stands.",
    exileTitle: "Chased out of the village",
    exileBody: "You stayed too quiet. Ravi\u2019s crew run you off the village. Do not come back on this round.",
    scoreLine: "Stage 2 score \xB7 {score}/600",
    watchGrid: "Continue",
    openSpec: "Spec",
    bids: "Decision",
    dockAward: "Green \xB7 held",
    dockReject: "Red",
    dockWhistle: "Watcher \xB7 mansion",
    dockHaven: "Stage 3 \xB7 139",
    toastLock: "Stage 2 is locked. Hold every award with a correct committee decision first.",
    toastAward: "Award held \xB7 {house}",
    toastReject: "Award refused. Only a correct decision turns the house green.",
    toastSweep: "Clean sweep. Whistle-blower brief unlocked.",
    toastNoSweep: "Stage 1 closed without max scores. Reset and hold every award to unlock stage 2.",
    toastJail: "Top score. Ravi is jailed. Villa, car and boat seized.",
    toastBurn: "Mid score. Ravi torches your lodging.",
    toastExile: "Low score. Ravi's crew run you out of the village.",
    toastFiled: "Report filed. Keep going.",
    toastWeak: "Weak file. That answer will not hold.",
    theContract: "the award",
    awardedTag: "held",
    rejectedTag: "rejected",
    wage: "Rs 15,000 / month",
    job: "Dive master",
    foot: "",
    resetRound: "Reset round",
    toastStage: "Stage reset.",
    phaseHaven: "Stage 3 \xB7 Domestic violence",
    haven: "Stage 3",
    havenScore: "Stage 3 score",
    havenHint: "Stage 3 \xB7 Domestic violence",
    lockHaven: "Win every whistle-blower case to open stage 3",
    briefHaven: "Stage 3 \xB7 Domestic violence",
    holds: "This holds \xB7 +100",
    looksAway: "That looks away \xB7 +20",
    scoringHaven: "4\u20135 correct: the door opens and the path reaches safety. 2\u20133: a lamp stays on. 0\u20131: the silence closes. The column does not leave.",
    hotlineNote: "In danger now, in Mauritius: call 139, free, day and night. A child in danger: 113. The Lespwar app can alert the police with your location.",
    nextSignal: "Next signal",
    doneLine: "The line is open",
    doneLamp: "A lamp, not a way out",
    doneFog: "The silence closed",
    lineTitle: "The line is open",
    lineBody: "The answers held. The door opens from the inside. Light runs from the step to safety. AI stays outside the house: it does not step in, and it will not help anyone do harm.",
    lampTitle: "A lamp, not a way out",
    lampBody: "Some answers held. A lamp stays on the step. The door does not open. Do not send someone back to calm an abuser down.",
    fogTitle: "The silence closed",
    fogBody: "Too many answers looked away. The fog thickens. The listening column does not leave. Looking away is not neutral.",
    scoreHaven: "Stage 3 score \xB7 {score}/600",
    toastLockHaven: "Stage 3 is locked. File every whistle-blower case correctly first.",
    toastPerfect: "Perfect file. Stage 3, domestic violence, is open.",
    toastLine: "The line is open. The door opens from the inside.",
    toastLamp: "A lamp stays on. The door does not open.",
    toastFog: "The silence closed. The column does not leave.",
    toastSignal: "Signal held. Keep the line.",
    toastMiss: "That answer looks away.",
    boardHaven: "Stage 3 \xB7 Domestic violence",
    notRanking: "Not a ranking",
    grokRefuse: "AI will not help anyone harm, threaten, stalk, or control a partner. It will help the person in danger get safe.",
    hotlineBig: "139",
    hotlineCaption: "Free, day and night. Domestic violence hotline, Mauritius.",
    childLine: "A child in danger: 113",
    lespwar: "Lespwar can alert the police with a location.",
    signalsHeld: "{n}/{total} signals held",
    phaseLand: "Stage 4 \xB7 Land use",
    land: "Stage 4",
    landScore: "Stage 4 score",
    landHint: "Stage 4 \xB7 Land use",
    lockLand: "Answer every domestic-violence question to open stage 4",
    briefLand: "Stage 4 \xB7 Land use",
    holdsLand: "Line holds \xB7 +100",
    missLand: "Line slips \xB7 +20",
    scoringLand: "Five or six correct: the path opens. Two to four: the rope stays half up. None or one: the fill stays.",
    nextPlot: "Next plot",
    doneHeld: "File complete \xB7 the path is open",
    doneShift: "File complete \xB7 the rope still hangs",
    doneLost: "File complete \xB7 the wetland stays filled",
    heldTitle: "The path stays open",
    heldBody: "The rope comes down. The wetland is left wet. The pegs match the public file. The village stays in the distance, and the shore stays for everyone.",
    shiftTitle: "The rope still hangs",
    shiftBody: "Some pegs are true and some are not. The path is only half clear. The fill has not all gone back.",
    lostTitle: "The fill stays",
    lostBody: "The file did not hold. The rope stays up, and the wetland stays buried. Reset the stage and walk the questions again.",
    scoreLand: "Stage 4 score \xB7 {score}/600",
    toastLockLand: "Stage 4 is locked. Answer every domestic-violence question first.",
    toastHeld: "The path is open. The shore stays public.",
    toastShift: "The rope still hangs. The file is only half clear.",
    toastLost: "The fill stays. The wetland is still buried.",
    toastPlot: "Plot held. Keep the public line.",
    toastSlip: "That answer lets the line slip.",
    boardLand: "Stage 4 \xB7 Land use",
    landRule: "Pas G\xE9om\xE9triques stay state land. A lease is not the beach. A wetland is not spare soil.",
    plotsHeld: "{n}/{total} plots held",
    openLand: "Open stage 4",
    dockLand: "Stage 4 \xB7 shore",
    phaseFair: "Stage 5 \xB7 Discrimination",
    fair: "Stage 5",
    fairScore: "Stage 5 score",
    fairHint: "Stage 5 \xB7 Discrimination",
    lockFair: "Answer every land-use question to open stage 5",
    briefFair: "Stage 5 \xB7 Discrimination",
    holdsFair: "The line holds \xB7 +100",
    missFair: "The line slips \xB7 +20",
    scoringFair: "Five or six correct: the gates lift. Two to four: the square stays half shut. None or one: the bars stay down.",
    nextGate: "Next gate",
    doneFair: "File complete \xB7 the square is open",
    doneHalf: "File complete \xB7 the square is half shut",
    doneBarred: "File complete \xB7 the bars stay down",
    fairTitle: "The square stays open",
    fairBody: "The six bars lift. Race, creed, sex, age and colour do not close a door. The hall stays for everyone.",
    halfTitle: "The square is half shut",
    halfBody: "Some gates lift and some do not. A bar still closes part of the square. The file is not finished.",
    barredTitle: "The bars stay down",
    barredBody: "The file did not hold. The gates stay shut. Reset the stage and walk the questions again.",
    scoreFair: "Stage 5 score \xB7 {score}/600",
    toastLockFair: "Stage 5 is locked. Answer every land-use question first.",
    toastFair: "The square is open. The gates stay up.",
    toastHalf: "The square is only half open.",
    toastBarred: "The bars stay down.",
    toastGate: "Gate held. Keep the square open.",
    toastBar: "That answer lets a bar stay down.",
    boardFair: "Stage 5 \xB7 Discrimination",
    fairRule: "The Equal Opportunities Act protects age, caste, colour, creed, ethnic origin, race and sex. A shop, a school, a job and a hall stay open.",
    gatesHeld: "{n}/{total} gates held",
    openFair: "Open stage 5",
    dockFair: "Stage 5 \xB7 gates",
    phaseCrop: "Stage 6 \xB7 Agriculture",
    crop: "Stage 6",
    cropScore: "Stage 6 score",
    cropHint: "Stage 6 \xB7 Agriculture",
    lockCrop: "Answer every discrimination question to open stage 6",
    briefCrop: "Stage 6 \xB7 Agriculture",
    holdsCrop: "The row holds \xB7 +100",
    missCrop: "The row slips \xB7 +20",
    scoringCrop: "Five or six correct: the rows grow. Two to four: the field stays thin. None or one: the beds stay bare.",
    nextRow: "Next row",
    doneGrown: "File complete \xB7 the field is grown",
    doneThin: "File complete \xB7 the field stays thin",
    doneBare: "File complete \xB7 the beds stay bare",
    grownTitle: "The rows are grown",
    grownBody: "Lettuce, tomato, chilli, herbs, cabbage and cucumber fill the beds. The spray matched the crop, and the canal stayed clean.",
    thinTitle: "The field stays thin",
    thinBody: "Some rows grew and some did not. A bed is still small. The file is not finished.",
    bareTitle: "The beds stay bare",
    bareBody: "The file did not hold. The vegetables stay small. Reset the stage and walk the questions again.",
    scoreCrop: "Stage 6 score \xB7 {score}/600",
    toastLockCrop: "Stage 6 is locked. Answer every discrimination question first.",
    toastGrown: "The field is grown. The rows stayed lawful.",
    toastThin: "The field is only half grown.",
    toastBare: "The beds stay bare.",
    toastRow: "Row held. The crop grows.",
    toastWilt: "That answer keeps the row small.",
    boardCrop: "Stage 6 \xB7 Agriculture",
    cropRule: "A pesticide is allowed only on the crop named for it. Do not sell before the waiting days. Do not rinse cans into the canal.",
    rowsHeld: "{n}/{total} rows held",
    openCrop: "Open stage 6",
    dockCrop: "Stage 6 \xB7 rows",
    phaseWash: "Stage 7 \xB7 Financial crime",
    wash: "Stage 7",
    washScore: "Stage 7 score",
    washHint: "Stage 7 \xB7 Financial crime",
    lockWash: "Answer every agriculture question to open stage 7",
    briefWash: "Stage 7 \xB7 Financial crime",
    holdsWash: "The floor holds \xB7 +100",
    missWash: "The floor stains \xB7 +20",
    scoringWash: "Five or six correct: the pipe runs clear. Two to four: gold still shows. None or one: the tower stays washed.",
    nextFloor: "Next floor",
    doneClean: "File complete \xB7 the pipe runs clear",
    doneWashThin: "File complete \xB7 gold still shows",
    doneWash: "File complete \xB7 the tower stays washed",
    cleanTitle: "The pipe runs clear",
    cleanBody: "The suitcases stay shut. The seal stops. The villa stays dark. A hidden owner is not a client.",
    washThinTitle: "Gold still shows",
    washThinBody: "Some floors drained and some did not. A watch is still on the wrist. The file is not finished.",
    washTitle: "The tower stays washed",
    washBody: "The file did not hold. The pipe stays dark and the villa lights. Reset the stage and walk the questions again.",
    scoreWash: "Stage 7 score \xB7 {score}/600",
    toastLockWash: "Stage 7 is locked. Answer every agriculture question first.",
    toastClean: "The pipe runs clear. The floors stayed lawful.",
    toastWashThin: "Gold still shows through the glass.",
    toastWash: "The tower stays washed.",
    toastFloor: "Floor held. The sludge drops.",
    toastSludge: "That answer keeps the floor dark.",
    boardWash: "Stage 7 \xB7 Financial crime",
    washRule: "Refuse a company with no trade and a hidden owner. Do not move money you cannot explain. A title, a permit and a nominee name do not clean it.",
    floorsHeld: "{n}/{total} floors held",
    openWash: "Open stage 7",
    dockWash: "Stage 7 \xB7 the wash",
    stage8: "Stage 8 \xB7 The stamp",
    phaseStamp: "Stage 8 \xB7 The stamp",
    stamp: "Stage 8",
    stampScore: "Stage 8 score",
    stampHint: "Stage 8 \xB7 The stamp",
    lockStamp: "Answer every financial-crime question to open stage 8",
    briefStamp: "Stage 8 \xB7 The stamp",
    holdsStamp: "The file holds \xB7 +100",
    missStamp: "The file slips \xB7 +20",
    scoringStamp: "Five or six correct: the stamp clicks and the queue moves. Two to four: ink smears; one folder still waits under the desk. None or one: the window shuts; the stamp stays in the drawer.",
    nextFile: "Next file",
    doneClick: "File complete \xB7 the stamp clicks",
    doneSmear: "File complete \xB7 the ink smears",
    doneShut: "File complete \xB7 the window shuts",
    clickTitle: "The stamp clicks",
    clickBody: "The six files land square. The fee on the wall is the only fee. The queue moves.",
    smearTitle: "The ink smears",
    smearBody: "Some files are stamped and some are not. One folder still waits under the desk. The file is not finished.",
    shutTitle: "The window shuts",
    shutBody: "The file did not hold. The shutter comes down and the stamp stays in the drawer. Reset the stage and walk the questions again.",
    scoreStamp: "Stage 8 score \xB7 {score}/600",
    toastLockStamp: "Stage 8 is locked. Answer every financial-crime question first.",
    toastClick: "The stamp clicks. The queue moves.",
    toastSmear: "The ink smears. One folder is still under the desk.",
    toastShut: "The window shuts. The stamp stays in the drawer.",
    toastFile: "File held. The stamp lands.",
    toastSlipFile: "That answer lets the file slip.",
    boardStamp: "Stage 8 \xB7 The stamp",
    stampRule: "A fee on the wall is the only fee. A cousin at the window is still a member of the public. A missing paper is a no, not a price.",
    filesHeld: "{n}/{total} files held",
    openStamp: "Open stage 8",
    dockStamp: "Stage 8 \xB7 the counter",
    stage9: "Stage 9 \xB7 The roll",
    phaseRoll: "Stage 9 \xB7 The roll",
    roll: "Stage 9",
    rollScore: "Stage 9 score",
    rollHint: "Stage 9 \xB7 The roll",
    lockRoll: "Answer every stamp question to open stage 9",
    briefRoll: "Stage 9 \xB7 The roll",
    holdsRoll: "The roll holds \xB7 +100",
    missRoll: "The roll slips \xB7 +20",
    scoringRoll: "Five or six correct: the roll stays one list. Two to four: a second sheet is still in the drawer. None or one: the box leaves in a private van.",
    nextName: "Next name",
    doneList: "File complete \xB7 the roll is one list",
    doneSheet: "File complete \xB7 a second sheet remains",
    doneVan: "File complete \xB7 the box leaves",
    listTitle: "The roll is one list",
    listBody: "The pencil stays off the book. The envelope stays in his hand. The box stays with the officers.",
    sheetTitle: "A second sheet remains",
    sheetBody: "Some names held and some did not. A second sheet is still in the drawer. The roll is not one list.",
    vanTitle: "The box leaves",
    vanBody: "The file did not hold. The sealed box goes in a private van. Reset the stage and walk the questions again.",
    scoreRoll: "Stage 9 score \xB7 {score}/600",
    toastLockRoll: "Stage 9 is locked. Answer every stamp question first.",
    toastList: "The roll stays one list.",
    toastSheet: "A second sheet is still in the drawer.",
    toastVan: "The box leaves in a private van.",
    toastName: "Name held. The roll stays shut.",
    toastSlipName: "That answer opens a second list.",
    boardRoll: "Stage 9 \xB7 The roll",
    rollRule: "The register closes. One person, one roll, one vote. A ballot is secret. A sealed box moves only with the officers.",
    namesHeld: "{n}/{total} names held",
    openRoll: "Open stage 9",
    dockRoll: "Stage 9 \xB7 the station",
    stage10: "Stage 10 \xB7 The oath",
    phaseOath: "Stage 10 \xB7 The oath",
    oath: "Stage 10",
    oathScore: "Stage 10 score",
    oathHint: "Stage 10 \xB7 The oath",
    lockOath: "Answer every roll question to open stage 10",
    briefOath: "Stage 10 \xB7 The oath",
    holdsOath: "The chair holds \xB7 +100",
    missOath: "The chair splits \xB7 +20",
    scoringOath: "Five or six correct: the chair stays whole. Two to four: the minute has a second page. None or one: the key is gone and the hamper stays.",
    nextSeat: "Next seat",
    doneWhole: "File complete \xB7 the chair stays whole",
    donePage: "File complete \xB7 the minute has a second page",
    doneKey: "File complete \xB7 the key is gone",
    wholeTitle: "The chair stays whole",
    wholeBody: "The cousin is declared. The minute is what was said. The hamper goes back. The key is logged.",
    pageTitle: "The minute has a second page",
    pageBody: "Some seats held and some did not. A line was added after the room emptied. The oath is not whole.",
    keyTitle: "The key is gone",
    keyBody: "The file did not hold. The hamper stays and the key leaves the drawer. Reset the stage and walk the questions again.",
    scoreOath: "Stage 10 score \xB7 {score}/600",
    toastLockOath: "Stage 10 is locked. Answer every roll question first.",
    toastWhole: "The chair stays whole.",
    toastPage: "The minute has a second page.",
    toastKey: "The key is gone. The hamper stays.",
    toastSeat: "Seat held. The chair does not split.",
    toastSlipSeat: "That answer splits the chair.",
    boardOath: "Stage 10 \xB7 The oath",
    oathRule: "Say the interest and leave the decision. The minute is what was said. A gift after an award is still a gift. Do not sign what you have not read. The key is the office.",
    seatsHeld: "{n}/{total} seats held",
    openOath: "Open stage 10",
    dockOath: "Stage 10 \xB7 the chair"
  },
  fr: {
    title: "Village Int\xE9grit\xE9",
    goal: "Obtiens le score maximum aux dix \xE9tapes pour gagner une casquette d'int\xE9grit\xE9.",
    stage1: "\xC9tape 1 \xB7 March\xE9s publics",
    stage2: "\xC9tape 2 \xB7 Lanceur d'alerte",
    dev: "En d\xE9veloppement",
    stage3: "\xC9tape 3 \xB7 Violences domestiques",
    stage4: "\xC9tape 4 \xB7 Utilisation des terres",
    stage5: "\xC9tape 5 \xB7 Discrimination",
    stage6: "\xC9tape 6 \xB7 Agriculture",
    stage7: "\xC9tape 7 \xB7 Crime financier",
    choose: "Choisis ton personnage",
    enter: "Entrer",
    howtoKicker: "Mode d'emploi",
    howtoTitle: "Instructions",
    howtoLead: "Lis cette page avant d'entrer dans le village. Le dossier est public. La salle montre l'issue.",
    howtoScore: "La plupart des \xE9tapes ont six questions. Une tenue vaut +100. Un glissement vaut +20.",
    howtoOutcomes: "Trois images ferment chaque dossier. La r\xE8gle du village tient en une ligne.",
    howtoOrder: "Les \xE9tapes s'ouvrent dans l'ordre. R\xE9ponds \xE0 chaque question d'une \xE9tape avant que la porte suivante s'ouvre.",
    howtoCap: "Obtiens le score maximum aux dix \xE9tapes pour gagner une casquette d'int\xE9grit\xE9.",
    howtoNext: "Continuer vers l'entr\xE9e",
    portrait: "Portrait",
    landscape: "Paysage",
    langLabel: "Langue",
    projectPhase: "Phase du projet",
    phaseTender: "\xC9tape 1 \xB7 March\xE9s publics",
    phaseWhistle: "\xC9tape 2 \xB7 Lanceur d'alerte",
    tenders: "\xC9tape 1",
    whistle: "\xC9tape 2",
    playingAs: "Tu joues",
    contractsWon: "Score \xB7 \xE9tape 1",
    whistleScore: "Score \xB7 \xE9tape 2",
    reset: "Recommencer",
    resetStage: "Recommencer l'\xE9tape",
    resetGame: "Recommencer la partie",
    continue: "Continuer",
    nextStage: "\xC9tape suivante",
    confirmReset: "Confirmer",
    sheetMeta: "{n}/{total} \xB7 {score}",
    activeBidders: "Comit\xE9",
    casesFiled: "Dossiers \xB7 {n}/{total} d\xE9pos\xE9s",
    you: "toi",
    youName: "Toi",
    seatName: "Comit\xE9",
    questions: "Questions {n} sur {total}",
    tender: "March\xE9",
    case: "Dossier",
    grid: "Grille",
    lockHint: "Obtiens chaque march\xE9 par une d\xE9cision correcte du comit\xE9 pour ouvrir l'\xE9tape 2",
    whistleHint: "Dossier du lanceur d'alerte",
    backTenders: "Retour aux march\xE9s",
    infra: "\xC9tape 1 \xB7 March\xE9s publics",
    brief: "\xC9tape 2 \xB7 Lanceur d'alerte",
    awardedGreen: "March\xE9 obtenu \xB7 la maison passe au vert",
    rejectedRed: "March\xE9 refus\xE9 \xB7 la maison passe au rouge",
    awardRule: "R\xE8gle du comit\xE9",
    awardBody: "Une d\xE9cision correcte passe la maison au vert. Une mauvaise d\xE9cision est refus\xE9e et passe au rouge. Obtiens les {n} pour ouvrir l'\xE9tape 2.",
    nextReno: "March\xE9 suivant",
    openBrief: "Ouvrir l'\xE9tape 2",
    noSweep: "Pas de sans-faute. Recommence et obtiens chaque march\xE9 pour ouvrir l'\xE9tape 2.",
    reportHolds: "Bonne r\xE9ponse \xB7 +100",
    weakFile: "Mauvaise r\xE9ponse \xB7 +20",
    scoring: "Bar\xE8me",
    scoringBody: "4\u20135 justes : {name} en prison, biens saisis. 2\u20133 : il br\xFBle ton logement. 0\u20131 : tu es chass\xE9 du village.",
    nextCase: "Dossier suivant",
    doneJail: "Dossier clos \xB7 trafiquant emprisonn\xE9",
    doneBurn: "Dossier clos \xB7 logement br\xFBl\xE9",
    doneExile: "Dossier clos \xB7 tu es exil\xE9",
    openLine: "Ouvrir l'\xE9tape 3",
    bidStandings: "Dossier du comit\xE9",
    reportStandings: "Classement des signalements",
    leading: "Ton score",
    stronger: "Qui a d\xE9pos\xE9 le meilleur dossier",
    awardedN: "{n} retenues",
    refusedN: "{n} refus\xE9es",
    specsN: "{n} cahiers.",
    noAward: "Aucune attribution",
    awardsHeldN: "{n} attributions tenues",
    jailed: "{name} en prison",
    burned: "logement br\xFBl\xE9",
    exiled: "exil\xE9",
    fileOpen: "dossier encore ouvert",
    boardTender: "\xC9tape 1 \xB7 March\xE9s publics",
    boardWhistle: "\xC9tape 2 \xB7 Lanceur d'alerte",
    topScore: "Score max",
    midScore: "Score moyen",
    lowScore: "Score bas",
    jailTitle: "{name} en prison",
    jailBody: "Le dossier est solide. La police place le moniteur de plong\xE9e en d\xE9tention. La villa, la voiture et le bateau sont saisis. L'entourage quitte le domaine.",
    burnTitle: "Ton logement br\xFBle",
    burnBody: "Le dossier \xE9tait trop mince. L'\xE9quipe de Ravi incendie le logement o\xF9 tu dors. La villa est encore debout.",
    exileTitle: "Chass\xE9 du village",
    exileBody: "Tu es rest\xE9 trop silencieux. L'\xE9quipe de Ravi te chasse du village. Ne reviens pas sur cette manche.",
    scoreLine: "Score \xB7 \xE9tape 2 \xB7 {score}/600",
    watchGrid: "Continuer",
    openSpec: "Cahier",
    bids: "D\xE9cision",
    dockAward: "Verte \xB7 tenue",
    dockReject: "Rouge",
    dockWhistle: "Guetteur \xB7 villa",
    dockHaven: "\xC9tape 3 \xB7 139",
    toastLock: "L'\xE9tape 2 est verrouill\xE9e. Obtiens d'abord chaque march\xE9 par une d\xE9cision correcte du comit\xE9.",
    toastAward: "March\xE9 obtenu \xB7 {house}",
    toastReject: "March\xE9 refus\xE9. Seule une d\xE9cision correcte passe la maison au vert.",
    toastSweep: "Sans-faute. Dossier du lanceur d'alerte ouvert.",
    toastNoSweep: "L'\xE9tape 1 est finie sans le score maximum. Recommence et obtiens chaque march\xE9 pour ouvrir l'\xE9tape 2.",
    toastJail: "Score max. Ravi est en prison. Villa, voiture et bateau saisis.",
    toastBurn: "Score moyen. Ravi incendie ton logement.",
    toastExile: "Score bas. L'\xE9quipe de Ravi te chasse du village.",
    toastFiled: "Signalement d\xE9pos\xE9. Continue.",
    toastWeak: "Mauvaise r\xE9ponse. Elle ne comptera pas.",
    theContract: "l'attribution",
    awardedTag: "tenue",
    rejectedTag: "refus\xE9e",
    wage: "Rs 15 000 / mois",
    job: "Moniteur de plong\xE9e",
    foot: "",
    resetRound: "R\xE9initialiser",
    toastStage: "\xC9tape r\xE9initialis\xE9e.",
    phaseHaven: "\xC9tape 3 \xB7 Violences domestiques",
    haven: "\xC9tape 3",
    havenScore: "Score \xB7 \xE9tape 3",
    havenHint: "\xC9tape 3 \xB7 Violences domestiques",
    lockHaven: "Gagne chaque dossier d'alerte pour ouvrir l'\xE9tape 3",
    briefHaven: "\xC9tape 3 \xB7 Violences domestiques",
    holds: "Bonne r\xE9ponse \xB7 +100",
    looksAway: "Mauvaise r\xE9ponse \xB7 +20",
    scoringHaven: "4\u20135 justes : la porte s'ouvre et le chemin m\xE8ne \xE0 l'abri. 2\u20133 : une lampe reste allum\xE9e. 0\u20131 : le silence se referme. La colonne ne part pas.",
    hotlineNote: "En danger maintenant, \xE0 Maurice : appelle le 139, gratuit, jour et nuit. Un enfant en danger : 113. L'application Lespwar peut alerter la police avec ta position.",
    nextSignal: "Signal suivant",
    doneLine: "La ligne est ouverte",
    doneLamp: "Une lampe, pas une sortie",
    doneFog: "Le silence s'est referm\xE9",
    lineTitle: "La ligne est ouverte",
    lineBody: "Les r\xE9ponses tiennent. La porte s'ouvre de l'int\xE9rieur. La lumi\xE8re va du seuil vers l'abri. L'IA reste dehors : elle n'entre pas, et elle n'aide personne \xE0 faire du mal.",
    lampTitle: "Une lampe, pas une sortie",
    lampBody: "Certaines r\xE9ponses tiennent. Une lampe reste sur le seuil. La porte ne s'ouvre pas. N'envoie personne \xAB calmer \xBB celui qui fait du mal.",
    fogTitle: "Le silence s'est referm\xE9",
    fogBody: "Trop de r\xE9ponses ont d\xE9tourn\xE9 le regard. Le brouillard \xE9paissit. La colonne qui \xE9coute ne part pas. D\xE9tourner le regard n'est pas neutre.",
    scoreHaven: "Score \xB7 \xE9tape 3 \xB7 {score}/600",
    toastLockHaven: "L'\xE9tape 3 est verrouill\xE9e. D\xE9pose d'abord chaque dossier d'alerte correctement.",
    toastPerfect: "Dossier parfait. L'\xE9tape 3, violences domestiques, est ouverte.",
    toastLine: "La ligne est ouverte. La porte s'ouvre de l'int\xE9rieur.",
    toastLamp: "Une lampe reste allum\xE9e. La porte ne s'ouvre pas.",
    toastFog: "Le silence s'est referm\xE9. La colonne ne part pas.",
    toastSignal: "Bonne r\xE9ponse. Continue.",
    toastMiss: "Mauvaise r\xE9ponse.",
    boardHaven: "\xC9tape 3 \xB7 Violences domestiques",
    notRanking: "Pas un classement",
    grokRefuse: "L'IA n'aide personne \xE0 blesser, menacer, suivre ou contr\xF4ler un partenaire. Elle aide la personne en danger \xE0 se mettre en s\xFBret\xE9.",
    hotlineBig: "139",
    hotlineCaption: "Gratuit, jour et nuit. Ligne des violences domestiques, Maurice.",
    childLine: "Un enfant en danger : 113",
    lespwar: "Lespwar peut alerter la police avec une position.",
    signalsHeld: "{n}/{total} bonnes r\xE9ponses",
    phaseLand: "\xC9tape 4 \xB7 Utilisation des terres",
    land: "\xC9tape 4",
    landScore: "Score \xB7 \xE9tape 4",
    landHint: "\xC9tape 4 \xB7 Utilisation des terres",
    lockLand: "R\xE9ponds juste \xE0 chaque question sur les violences domestiques pour ouvrir l'\xE9tape 4",
    briefLand: "\xC9tape 4 \xB7 Utilisation des terres",
    holdsLand: "Bonne r\xE9ponse \xB7 +100",
    missLand: "Mauvaise r\xE9ponse \xB7 +20",
    scoringLand: "Cinq ou six justes : le chemin s'ouvre. Deux \xE0 quatre : la corde reste \xE0 mi-hauteur. Z\xE9ro ou un : le remblai reste.",
    nextPlot: "Parcelle suivante",
    doneHeld: "Dossier clos \xB7 le chemin est ouvert",
    doneShift: "Dossier clos \xB7 la corde pend encore",
    doneLost: "Dossier clos \xB7 le marais reste remblay\xE9",
    heldTitle: "Le chemin reste ouvert",
    heldBody: "La corde tombe. Le marais reste humide. Les piquets suivent le dossier public. Le village reste au loin, et le rivage reste \xE0 tout le monde.",
    shiftTitle: "La corde pend encore",
    shiftBody: "Certains piquets sont justes, d'autres non. Le chemin n'est qu'\xE0 moiti\xE9 libre. Le remblai n'est pas tout reparti.",
    lostTitle: "Le remblai reste",
    lostBody: "Le dossier ne tient pas. La corde reste haute, et la zone humide reste ensevelie. Recommence l'\xE9tape et reprends les questions.",
    scoreLand: "Score \xB7 \xE9tape 4 \xB7 {score}/600",
    toastLockLand: "L'\xE9tape 4 est verrouill\xE9e. R\xE9ponds d'abord juste \xE0 chaque question sur les violences domestiques.",
    toastHeld: "Le chemin est ouvert. Le rivage reste public.",
    toastShift: "La corde pend encore. Le dossier n'est qu'\xE0 moiti\xE9 clair.",
    toastLost: "Le remblai reste. Le marais est encore enseveli.",
    toastPlot: "Bonne r\xE9ponse. La parcelle est retenue.",
    toastSlip: "Mauvaise r\xE9ponse.",
    boardLand: "\xC9tape 4 \xB7 Utilisation des terres",
    landRule: "Les Pas G\xE9om\xE9triques restent des terres de l'\xC9tat. Un bail n'est pas la plage. Une zone humide n'est pas un terrain \xE0 remblayer.",
    plotsHeld: "{n}/{total} parcelles justes",
    openLand: "Ouvrir l'\xE9tape 4",
    dockLand: "\xC9tape 4 \xB7 rivage",
    phaseFair: "\xC9tape 5 \xB7 Discrimination",
    fair: "\xC9tape 5",
    fairScore: "Score \xB7 \xE9tape 5",
    fairHint: "\xC9tape 5 \xB7 Discrimination",
    lockFair: "R\xE9ponds juste \xE0 chaque question sur les terres pour ouvrir l'\xE9tape 5",
    briefFair: "\xC9tape 5 \xB7 Discrimination",
    holdsFair: "Bonne r\xE9ponse \xB7 +100",
    missFair: "Mauvaise r\xE9ponse \xB7 +20",
    scoringFair: "Cinq ou six justes : les portes se l\xE8vent. Deux \xE0 quatre : la place reste \xE0 moiti\xE9 ferm\xE9e. Z\xE9ro ou un : les barres restent basses.",
    nextGate: "Porte suivante",
    doneFair: "Dossier clos \xB7 la place est ouverte",
    doneHalf: "Dossier clos \xB7 la place est \xE0 moiti\xE9 ferm\xE9e",
    doneBarred: "Dossier clos \xB7 les barres restent basses",
    fairTitle: "La place reste ouverte",
    fairBody: "Les six barres se l\xE8vent. La race, la croyance, le sexe, l'\xE2ge et la couleur ne ferment pas une porte. La salle reste \xE0 tout le monde.",
    halfTitle: "La place est \xE0 moiti\xE9 ferm\xE9e",
    halfBody: "Certaines portes se l\xE8vent, d'autres non. Une barre ferme encore une part de la place. Le dossier n'est pas tenu.",
    barredTitle: "Les barres restent basses",
    barredBody: "Le dossier ne tient pas. Les portes restent ferm\xE9es. Recommence l'\xE9tape et reprends les questions.",
    scoreFair: "Score \xB7 \xE9tape 5 \xB7 {score}/600",
    toastLockFair: "L'\xE9tape 5 est verrouill\xE9e. R\xE9ponds d'abord juste \xE0 chaque question sur l'utilisation des terres.",
    toastFair: "La place est ouverte. Les portes restent hautes.",
    toastHalf: "La place n'est qu'\xE0 moiti\xE9 ouverte.",
    toastBarred: "Les barres restent basses.",
    toastGate: "Bonne r\xE9ponse. La porte s'ouvre.",
    toastBar: "Mauvaise r\xE9ponse.",
    boardFair: "\xC9tape 5 \xB7 Discrimination",
    fairRule: "L'Equal Opportunities Act prot\xE8ge l'\xE2ge, la caste, la couleur, la croyance, l'origine ethnique, la race et le sexe. Une boutique, une \xE9cole, un emploi et une salle restent ouverts.",
    gatesHeld: "{n}/{total} portes ouvertes",
    openFair: "Ouvrir l'\xE9tape 5",
    dockFair: "\xC9tape 5 \xB7 portes",
    phaseCrop: "\xC9tape 6 \xB7 Agriculture",
    crop: "\xC9tape 6",
    cropScore: "Score \xB7 \xE9tape 6",
    cropHint: "\xC9tape 6 \xB7 Agriculture",
    lockCrop: "R\xE9ponds juste \xE0 chaque question sur la discrimination pour ouvrir l'\xE9tape 6",
    briefCrop: "\xC9tape 6 \xB7 Agriculture",
    holdsCrop: "Bonne r\xE9ponse \xB7 +100",
    missCrop: "Mauvaise r\xE9ponse \xB7 +20",
    scoringCrop: "Cinq ou six justes : les rangs poussent. Deux \xE0 quatre : le champ reste maigre. Z\xE9ro ou un : les planches restent nues.",
    nextRow: "Rang suivant",
    doneGrown: "Dossier clos \xB7 le champ a pouss\xE9",
    doneThin: "Dossier clos \xB7 le champ reste maigre",
    doneBare: "Dossier clos \xB7 les planches restent nues",
    grownTitle: "Les rangs ont pouss\xE9",
    grownBody: "Laitue, tomate, piment, herbes, chou et concombre remplissent les planches. Le produit correspondait \xE0 la culture, et le canal est rest\xE9 propre.",
    thinTitle: "Le champ reste maigre",
    thinBody: "Certains rangs ont pouss\xE9, d'autres non. Une planche est encore petite. Le dossier n'est pas tenu.",
    bareTitle: "Les planches restent nues",
    bareBody: "Le dossier ne tient pas. Les l\xE9gumes restent petits. Recommence l'\xE9tape et reprends les questions.",
    scoreCrop: "Score \xB7 \xE9tape 6 \xB7 {score}/600",
    toastLockCrop: "L'\xE9tape 6 est verrouill\xE9e. R\xE9ponds d'abord juste \xE0 chaque question sur la discrimination.",
    toastGrown: "Le champ a pouss\xE9. Les rangs sont rest\xE9s licites.",
    toastThin: "Le champ n'a pouss\xE9 qu'\xE0 moiti\xE9.",
    toastBare: "Les planches restent nues.",
    toastRow: "Bonne r\xE9ponse. La culture pousse.",
    toastWilt: "Mauvaise r\xE9ponse. Le rang reste petit.",
    boardCrop: "\xC9tape 6 \xB7 Agriculture",
    cropRule: "Un pesticide n'est permis que sur la culture pour laquelle il est autoris\xE9. Ne vends pas avant la fin du d\xE9lai d'attente. Ne rince pas les bidons dans le canal.",
    rowsHeld: "{n}/{total} rangs justes",
    openCrop: "Ouvrir l'\xE9tape 6",
    dockCrop: "\xC9tape 6 \xB7 rangs",
    phaseWash: "\xC9tape 7 \xB7 Crime financier",
    wash: "\xC9tape 7",
    washScore: "Score \xB7 \xE9tape 7",
    washHint: "\xC9tape 7 \xB7 Crime financier",
    lockWash: "R\xE9ponds juste \xE0 chaque question d'agriculture pour ouvrir l'\xE9tape 7",
    briefWash: "\xC9tape 7 \xB7 Crime financier",
    holdsWash: "Bonne r\xE9ponse \xB7 +100",
    missWash: "Mauvaise r\xE9ponse \xB7 +20",
    scoringWash: "Cinq ou six justes : le tuyau redevient clair. Deux \xE0 quatre : l'or se voit encore. Z\xE9ro ou un : la tour reste lav\xE9e.",
    nextFloor: "\xC9tage suivant",
    doneClean: "Dossier clos \xB7 le tuyau est clair",
    doneWashThin: "Dossier clos \xB7 l'or se voit encore",
    doneWash: "Dossier clos \xB7 la tour reste lav\xE9e",
    cleanTitle: "Le tuyau redevient clair",
    cleanBody: "Les valises restent ferm\xE9es. Le sceau s'arr\xEAte. La villa reste sombre. Un propri\xE9taire cach\xE9 n'est pas un client.",
    washThinTitle: "L'or se voit encore",
    washThinBody: "Certains \xE9tages se vident, d'autres non. Une montre est encore au poignet. Le dossier n'est pas tenu.",
    washTitle: "La tour reste lav\xE9e",
    washBody: "Le dossier ne tient pas. Le tuyau reste noir et la villa s'allume. Recommence l'\xE9tape et reprends les questions.",
    scoreWash: "Score \xB7 \xE9tape 7 \xB7 {score}/600",
    toastLockWash: "L'\xE9tape 7 est verrouill\xE9e. R\xE9ponds d'abord juste \xE0 chaque question d'agriculture.",
    toastClean: "Le tuyau est clair. Les \xE9tages sont rest\xE9s licites.",
    toastWashThin: "L'or se voit encore derri\xE8re le verre.",
    toastWash: "La tour reste lav\xE9e.",
    toastFloor: "Bonne r\xE9ponse. La boue baisse.",
    toastSludge: "Mauvaise r\xE9ponse. L'\xE9tage reste sombre.",
    boardWash: "\xC9tape 7 \xB7 Crime financier",
    washRule: "Refuse une soci\xE9t\xE9 sans activit\xE9 et \xE0 propri\xE9taire cach\xE9. Ne fais pas circuler un argent que tu ne peux pas expliquer. Un titre, un permis et un nom pr\xEAte ne lavent rien.",
    floorsHeld: "{n}/{total} \xE9tages tenus",
    openWash: "Ouvrir l'\xE9tape 7",
    dockWash: "\xC9tape 7 \xB7 le lavage",
    stage8: "\xC9tape 8 \xB7 Le tampon",
    phaseStamp: "\xC9tape 8 \xB7 Le tampon",
    stamp: "\xC9tape 8",
    stampScore: "Score \xB7 \xE9tape 8",
    stampHint: "\xC9tape 8 \xB7 Le tampon",
    lockStamp: "R\xE9ponds juste \xE0 chaque question de crime financier pour ouvrir l'\xE9tape 8",
    briefStamp: "\xC9tape 8 \xB7 Le tampon",
    holdsStamp: "Bonne r\xE9ponse \xB7 +100",
    missStamp: "Mauvaise r\xE9ponse \xB7 +20",
    scoringStamp: "Cinq ou six justes : le tampon clique et la file avance. Deux \xE0 quatre : l'encre bave ; un dossier attend encore sous le bureau. Z\xE9ro ou un : le guichet se ferme ; le tampon reste dans le tiroir.",
    nextFile: "Dossier suivant",
    doneClick: "Dossier clos \xB7 le tampon clique",
    doneSmear: "Dossier clos \xB7 l'encre bave",
    doneShut: "Dossier clos \xB7 le guichet se ferme",
    clickTitle: "Le tampon clique",
    clickBody: "Les six dossiers tombent droit. Le tarif au mur est le seul tarif. La file avance.",
    smearTitle: "L'encre bave",
    smearBody: "Certains dossiers sont tamponn\xE9s, d'autres non. Un dossier attend encore sous le bureau. Le dossier n'est pas tenu.",
    shutTitle: "Le guichet se ferme",
    shutBody: "Le dossier ne tient pas. Le volet descend et le tampon reste dans le tiroir. Recommence l'\xE9tape et reprends les questions.",
    scoreStamp: "Score \xB7 \xE9tape 8 \xB7 {score}/600",
    toastLockStamp: "L'\xE9tape 8 est verrouill\xE9e. R\xE9ponds d'abord juste \xE0 chaque question de crime financier.",
    toastClick: "Le tampon clique. La file avance.",
    toastSmear: "L'encre bave. Un dossier est encore sous le bureau.",
    toastShut: "Le guichet se ferme. Le tampon reste dans le tiroir.",
    toastFile: "Bonne r\xE9ponse. Le tampon tombe.",
    toastSlipFile: "Mauvaise r\xE9ponse. Le dossier glisse.",
    boardStamp: "\xC9tape 8 \xB7 Le tampon",
    stampRule: "Le tarif au mur est le seul tarif. Un cousin au guichet reste un membre du public. Un papier manquant est un non, pas un prix.",
    filesHeld: "{n}/{total} dossiers tenus",
    openStamp: "Ouvrir l'\xE9tape 8",
    dockStamp: "\xC9tape 8 \xB7 le guichet",
    stage9: "\xC9tape 9 \xB7 La liste",
    phaseRoll: "\xC9tape 9 \xB7 La liste",
    roll: "\xC9tape 9",
    rollScore: "Score \xB7 \xE9tape 9",
    rollHint: "\xC9tape 9 \xB7 La liste",
    lockRoll: "R\xE9ponds juste \xE0 chaque question du tampon pour ouvrir l'\xE9tape 9",
    briefRoll: "\xC9tape 9 \xB7 La liste",
    holdsRoll: "Bonne r\xE9ponse \xB7 +100",
    missRoll: "Mauvaise r\xE9ponse \xB7 +20",
    scoringRoll: "Cinq ou six justes : la liste reste une. Deux \xE0 quatre : une seconde feuille est encore dans le tiroir. Z\xE9ro ou un : l'urne part dans une camionnette priv\xE9e.",
    nextName: "Nom suivant",
    doneList: "Dossier clos \xB7 la liste est une",
    doneSheet: "Dossier clos \xB7 une seconde feuille reste",
    doneVan: "Dossier clos \xB7 l'urne part",
    listTitle: "La liste est une",
    listBody: "Le crayon reste hors du registre. L'enveloppe reste dans sa main. L'urne reste avec les officiers.",
    sheetTitle: "Une seconde feuille reste",
    sheetBody: "Certains noms tiennent, d'autres non. Une seconde feuille est encore dans le tiroir. La liste n'est pas une.",
    vanTitle: "L'urne part",
    vanBody: "Le dossier ne tient pas. L'urne scell\xE9e part dans une camionnette priv\xE9e. Recommence l'\xE9tape et reprends les questions.",
    scoreRoll: "Score \xB7 \xE9tape 9 \xB7 {score}/600",
    toastLockRoll: "L'\xE9tape 9 est verrouill\xE9e. R\xE9ponds d'abord juste \xE0 chaque question du tampon.",
    toastList: "La liste reste une.",
    toastSheet: "Une seconde feuille est encore dans le tiroir.",
    toastVan: "L'urne part dans une camionnette priv\xE9e.",
    toastName: "Bonne r\xE9ponse. Le registre reste ferm\xE9.",
    toastSlipName: "Mauvaise r\xE9ponse. Une seconde liste s'ouvre.",
    boardRoll: "\xC9tape 9 \xB7 La liste",
    rollRule: "Le registre se ferme. Une personne, une liste, un vote. Le bulletin est secret. Une urne scell\xE9e ne bouge qu'avec les officiers.",
    namesHeld: "{n}/{total} noms tenus",
    openRoll: "Ouvrir l'\xE9tape 9",
    dockRoll: "\xC9tape 9 \xB7 le bureau",
    stage10: "\xC9tape 10 \xB7 Le serment",
    phaseOath: "\xC9tape 10 \xB7 Le serment",
    oath: "\xC9tape 10",
    oathScore: "Score \xB7 \xE9tape 10",
    oathHint: "\xC9tape 10 \xB7 Le serment",
    lockOath: "R\xE9ponds juste \xE0 chaque question de la liste pour ouvrir l'\xE9tape 10",
    briefOath: "\xC9tape 10 \xB7 Le serment",
    holdsOath: "Bonne r\xE9ponse \xB7 +100",
    missOath: "Mauvaise r\xE9ponse \xB7 +20",
    scoringOath: "Cinq ou six justes : le fauteuil reste entier. Deux \xE0 quatre : le proc\xE8s-verbal a une seconde page. Z\xE9ro ou un : la cl\xE9 est partie et le panier reste.",
    nextSeat: "Si\xE8ge suivant",
    doneWhole: "Dossier clos \xB7 le fauteuil reste entier",
    donePage: "Dossier clos \xB7 le proc\xE8s-verbal a une seconde page",
    doneKey: "Dossier clos \xB7 la cl\xE9 est partie",
    wholeTitle: "Le fauteuil reste entier",
    wholeBody: "Le cousin est d\xE9clar\xE9. Le proc\xE8s-verbal est ce qui a \xE9t\xE9 dit. Le panier repart. La cl\xE9 est not\xE9e.",
    pageTitle: "Le proc\xE8s-verbal a une seconde page",
    pageBody: "Certains si\xE8ges tiennent, d'autres non. Une ligne a \xE9t\xE9 ajout\xE9e apr\xE8s que la salle s'est vid\xE9e. Le serment n'est pas entier.",
    keyTitle: "La cl\xE9 est partie",
    keyBody: "Le dossier ne tient pas. Le panier reste et la cl\xE9 quitte le tiroir. Recommence l'\xE9tape et reprends les questions.",
    scoreOath: "Score \xB7 \xE9tape 10 \xB7 {score}/600",
    toastLockOath: "L'\xE9tape 10 est verrouill\xE9e. R\xE9ponds d'abord juste \xE0 chaque question de la liste.",
    toastWhole: "Le fauteuil reste entier.",
    toastPage: "Le proc\xE8s-verbal a une seconde page.",
    toastKey: "La cl\xE9 est partie. Le panier reste.",
    toastSeat: "Bonne r\xE9ponse. Le fauteuil ne se divise pas.",
    toastSlipSeat: "Mauvaise r\xE9ponse. Le fauteuil se divise.",
    boardOath: "\xC9tape 10 \xB7 Le serment",
    oathRule: "Dis l'int\xE9r\xEAt et quitte la d\xE9cision. Le proc\xE8s-verbal est ce qui a \xE9t\xE9 dit. Un cadeau apr\xE8s une attribution reste un cadeau. Ne signe pas ce que tu n'as pas lu. La cl\xE9 est la fonction.",
    seatsHeld: "{n}/{total} si\xE8ges tenus",
    openOath: "Ouvrir l'\xE9tape 10",
    dockOath: "\xC9tape 10 \xB7 le fauteuil"
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
    question: "Un sous-traitant propose une ristourne sans facture pour acc\xE9l\xE9rer les mat\xE9riaux. Pour rester transparent, comment faut-il l'enregistrer ?",
    options: {
      A: "L'accepter comme remise CWA et la d\xE9duire des frais de raccordement du village, hors dossier d'appel d'offres.",
      B: "La ristourne ne doit pas \xEAtre accept\xE9e ; elle doit \xEAtre enti\xE8rement divulgu\xE9e et rejet\xE9e comme manquement.",
      C: "Placer la somme sur un compte de travaux du conseil de district de Pamplemousses pour des am\xE9nagements informels plus tard.",
      D: "La classer comme commission occulte au titre du Public Procurement Act, visible seulement au minist\xE8re des Finances."
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
      A: "Commencer \xE0 21 h et poser les c\xF4nes toi-m\xEAme.",
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
      D: "Autoriser le liquide seulement pour les habitants du village, re\xE7us pour les autres."
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
    question: "Un groupe tournant de femmes \xE9trang\xE8res loge maintenant \xE0 la villa. Aucune n'a de famille au village, aucune ne montre de permis de travail, et elles ne prennent jamais le bus de jour. Ravi dit de se taire ou de perdre ton toit. Que dois-tu faire ?",
    options: {
      A: "Se taire. Les invit\xE9s sont priv\xE9s. Un moniteur peut recevoir qui il veut.",
      B: "Prendre de l'argent pour \xAB regarder ailleurs \xE0 la grille \xBB et garder les noms hors de tout dossier.",
      C: "Entrer seul dans la villa la nuit et ordonner au groupe de partir, sans dossier de police.",
      D: "Signaler un h\xE9bergement et un trafic suspects \xE0 la police. Ne pas se taire. Ne pas affronter la villa soi-m\xEAme."
    }
  },
  cash: {
    title: "Dons en liquide",
    question: "Ravi se met \xE0 payer en liquide les dettes de boutique et les frais d'\xE9cole des voisins, toujours avec un salaire de moniteur de Rs 15 000. Il appelle \xE7a de la charit\xE9 et te demande de ne rien \xE9crire. Quelle est l'action licite ?",
    options: {
      A: "Se taire. Payer les frais d'un voisin est une gentillesse. Un village ne contr\xF4le pas un don.",
      B: "Prendre une part du liquide pour tes propres frais et laisser le reste hors dossier.",
      C: "Joindre ces dons en liquide inexpliqu\xE9s au signalement de richesse suspecte. Un salaire de Rs 15 000 ne finance pas la cit\xE9. Ne prends pas de part.",
      D: "Le remercier dans le groupe du village pour que les dons paraissent publics et que le dossier se ferme."
    }
  }
};
var HOUSE_FR = {
  "cwa-pump": { name: "Station de pompage CWA", hint: "R\xE9seau d'eau \xB7 SPEC-01" },
  "block-a": { name: "Bloc A du village", hint: "Toitures de cit\xE9 \xB7 SPEC-04" },
  "block-b": { name: "Bloc B du village", hint: "C\xE2blage de cit\xE9 \xB7 SPEC-05" },
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
  entourage: "Entourage",
  cash: "Liquide",
  private: "Priv\xE9",
  believe: "Croire",
  control: "Contr\xF4le",
  grok: "AI",
  hotline: "139",
  child: "Enfant",
  shore: "Rivage",
  title: "Titre",
  split: "D\xE9coupe",
  wetland: "Marais",
  sign: "Signature",
  idle: "Friche",
  race: "Race",
  creed: "Croyance",
  sex: "Sexe",
  age: "\xC2ge",
  colour: "Couleur",
  notice: "Avis",
  spray: "Spray",
  wait: "Attente",
  bottle: "Fiole",
  cans: "Bidons",
  mix: "M\xE9lange",
  stall: "\xC9tal",
  shelf: "\xC9tag\xE8re",
  desk: "Guichet",
  deed: "Titre",
  loop: "Boucle",
  bid: "Offre",
  name: "Nom"
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
var HAVEN_FR = {
  private: {
    title: "Pas une affaire priv\xE9e",
    question: "Des cris viennent de la maison au bout de la ruelle. Un voisin dit que c'est juste entre un couple. Que fait l'int\xE9grit\xE9 ?",
    options: {
      A: "Leur dire de baisser le ton pour que la ruelle dorme.",
      B: "Partir. Ce qui se passe \xE0 l'int\xE9rieur ne regarde personne.",
      C: "Si quelqu'un peut \xEAtre en danger, ce n'est pas priv\xE9. N'entre pas de force. Ne filme pas. Aide-les \xE0 atteindre un lieu s\xFBr.",
      D: "Filmer \xE0 travers le rideau et publier, pour que le village humilie la maison."
    }
  },
  believe: {
    title: "Les croire",
    question: "Quelqu'un que tu connais dit que son partenaire lui a fait du mal, puis te demande de ne pas faire d'histoire. Quelle est la r\xE9ponse s\xFBre ?",
    options: {
      A: "Les asseoir tous les deux ce soir et jouer les m\xE9diateurs jusqu'\xE0 des excuses.",
      B: "Leur dire de rentrer calmer le partenaire.",
      C: "Les croire. Ne confronte pas le partenaire. Aide-les \xE0 rejoindre un lieu s\xFBr, et appelle le 139 \u2014 gratuit, jour et nuit.",
      D: "Demander ce qu'ils ont fait pour le provoquer avant de choisir un camp."
    }
  },
  control: {
    title: "Le contr\xF4le compte",
    question: "Tu ne vois pas de bleu. Le partenaire contr\xF4le l'argent, le t\xE9l\xE9phone, et qui a le droit de voir qui. Est-ce de la violence domestique ?",
    options: {
      A: "Non. Sans marque, il n'y a pas de violence.",
      B: "Seulement s'ils sont mari\xE9s.",
      C: "Oui. Le contr\xF4le, l'isolement, les menaces et couper l'argent sont des violences, m\xEAme sans blessure visible.",
      D: "Seulement quand un voisin a port\xE9 plainte par \xE9crit."
    }
  },
  grok: {
    title: "Ce que l'IA refuse",
    question: "Quelqu'un demande \xE0 l'IA d'\xE9crire une menace contre un partenaire, ou d'expliquer comment le suivre jusque chez lui. Que fait l'IA ?",
    options: {
      A: "\xC9crire la menace, mais plus douce, pour que \xE7a ressemble \xE0 une blague.",
      B: "Refuser. L'IA n'aide personne \xE0 blesser, menacer, suivre ou contr\xF4ler un partenaire. Elle aide la personne en danger \xE0 se mettre en s\xFBret\xE9.",
      C: "Donner les \xE9tapes de pistage s'ils disent que c'est pour prot\xE9ger.",
      D: "Rester neutre et expliquer \xE0 la fois comment menacer et comment partir."
    }
  },
  hotline: {
    title: "Appeler le 139",
    question: "Il est tard au village. Quelqu'un a besoin d'aide maintenant et ne peut pas parler en s\xFBret\xE9 dans la maison. Quelle est la ligne gratuite, 24 heures sur 24, contre la violence domestique \xE0 Maurice ?",
    options: {
      A: "Attendre le march\xE9 de samedi et le dire au conseil.",
      B: "Le 139.",
      C: "Publier d'abord un message dans le groupe du village.",
      D: "Appeler seulement si un bleu se verra sur une photo."
    }
  },
  child: {
    title: "Un enfant a peur",
    question: "Un enfant de la maison dit qu'il a peur des cris et te demande de garder le secret. Quelle est la r\xE9ponse s\xFBre ?",
    options: {
      A: "Promettre de ne rien dire, et renvoyer l'enfant voir si \xE7a s'est arr\xEAt\xE9.",
      B: "Demander \xE0 l'enfant de d\xE9crire la violence en d\xE9tail avant de d\xE9cider.",
      C: "Un enfant en danger ne garde pas ce secret. Ne le renvoie pas. Appelle le 113. Si un adulte est aussi en danger, appelle le 139.",
      D: "Attendre qu'un parent t'invite, puis jouer les m\xE9diateurs entre les adultes."
    }
  }
};
function localizeHaven(item, lang) {
  const fr = lang === "fr" ? HAVEN_FR[item.id] : void 0;
  if (!fr) return item;
  return {
    ...item,
    title: fr.title,
    question: fr.question,
    options: item.options.map((opt) => ({ ...opt, text: fr.options[opt.id] ?? opt.text }))
  };
}
var LAND_FR = {
  shore: {
    title: "Le chemin ferm\xE9",
    question: "Un voisin barre avec une corde le chemin que le village emprunte vers la mer et cloue un panneau : \xAB Plage priv\xE9e \xBB. Il dit que son bail de campement comprend le sable. Quelle est l'action licite ?",
    options: {
      A: "Laisser faire. Un bail sur une terre de l'\xC9tat comprend la plage devant.",
      B: "D\xE9placer la corde la nuit et ne rien dire.",
      C: "Le rivage et le chemin public restent ouverts. Un bail de campement n'est pas un titre sur la plage. Demande au minist\xE8re du Logement et des Terres et au conseil de district d'enlever l'obstacle.",
      D: "Faire payer les visiteurs et partager avec lui."
    }
  },
  title: {
    title: "Vendu comme pleine propri\xE9t\xE9",
    question: "Un agent propose un terrain en bord de mer \xAB \xE0 vendre \xBB et dit que l'acheteur en sera pleinement propri\xE9taire. Le plan montre des Pas G\xE9om\xE9triques. Quelle est l'action licite ?",
    options: {
      A: "Prendre une commission et appeler \xE7a une pleine propri\xE9t\xE9 priv\xE9e.",
      B: "Les Pas G\xE9om\xE9triques sont des terres de l'\xC9tat. Elles ne se vendent pas comme un bien priv\xE9. Ne sers pas d'interm\xE9diaire. Signale l'annonce au minist\xE8re du Logement et des Terres.",
      C: "Laisser le plus offrant prendre le terrain si le village a une part.",
      D: "Redessiner le plan pour que la parcelle paraisse \xE0 l'int\xE9rieur des terres et que la vente se fasse."
    }
  },
  split: {
    title: "Sous le seuil",
    question: "Un promoteur veut 20 villas sur une terre c\xF4ti\xE8re de l'\xC9tat. Il d\xE9coupe le dossier en petits lots pour rester sous le seuil de l'EIA, et commence \xE0 vendre sur plan avant un permis de construire et d'utilisation des terres. Quelle est l'action licite ?",
    options: {
      A: "D\xE9couper le dossier. Sous 50 unit\xE9s, pas d'EIA, et les ventes peuvent commencer.",
      B: "Couper les arbres d'abord pour que le site paraisse pr\xEAt quand le permis arrivera.",
      C: "Un projet, un dossier. Ni travaux ni vente sur plan avant l'EIA et le permis. Ne d\xE9coupe pas le projet pour \xE9viter l'\xE9tude.",
      D: "Demander au commis du conseil de l'approuver apr\xE8s les heures."
    }
  },
  wetland: {
    title: "Le marais remblay\xE9",
    question: "Un entrepreneur d\xE9verse du remblai dans le marais derri\xE8re la ruelle pour couler une dalle. Il appelle \xE7a de l'am\xE9nagement et dit que le drain pourra \xEAtre bus\xE9 plus tard. Quelle est l'action licite ?",
    options: {
      A: "Signer comme am\xE9nagement. Le sol d'un marais est un terrain en trop.",
      B: "Buser le drain sous le remblai et garder le marais hors du plan.",
      C: "Un marais et son drain ne sont pas un terrain en trop. Arr\xEAte le remblai. Signale-le. Un marais remblay\xE9 envoie la crue sur les maisons en aval.",
      D: "Ne remblayer que le bord, pour que \xAB l'essentiel \xBB du marais reste."
    }
  },
  sign: {
    title: "La signature emprunt\xE9e",
    question: "Quelqu'un propose de t\xE9l\xE9verser des plans sur le National Electronic Licensing System avec la signature \xE9lectronique d'un architecte inscrit. L'architecte ne les a pas dessin\xE9s. La maison d\xE9passe 150 m\xB2. Quelle est l'action licite ?",
    options: {
      A: "Utiliser la signature. La plateforme v\xE9rifie seulement qu'un nom est sur le dossier.",
      B: "C'est un faux document. Refuse. Les plans de cette taille doivent \xEAtre pr\xE9par\xE9s et sign\xE9s par l'architecte qui a fait le travail. Signale l'offre.",
      C: "Payer une petite somme \xE0 l'architecte apr\xE8s le permis et antidater le dessin.",
      D: "Mettre ton propre nom comme architecte. Le conseil ne v\xE9rifiera pas le registre."
    }
  },
  idle: {
    title: "Allocation en friche",
    question: "Un proche a re\xE7u une terre agricole de l'\xC9tat et l'a laiss\xE9e vide. Un promoteur offre du liquide pour couler une dalle, l'appeler un hangar, et \xAB convertir plus tard \xBB. Quelle est l'action licite ?",
    options: {
      A: "Couler la dalle. La conversion peut \xEAtre demand\xE9e une fois la maison debout.",
      B: "Laisser en friche. Une terre allou\xE9e peut rester inutilis\xE9e aussi longtemps que la famille veut.",
      C: "Prendre le liquide et garder le dossier marqu\xE9 \xAB cultures \xBB.",
      D: "Une terre allou\xE9e est pour l'agriculture. Les parcelles en friche peuvent \xEAtre reprises. Un changement d'usage exige un permis de conversion avant toute dalle. Ne prends pas le liquide."
    }
  }
};
function localizeLand(item, lang) {
  const fr = lang === "fr" ? LAND_FR[item.id] : void 0;
  if (!fr) return item;
  return {
    ...item,
    title: fr.title,
    question: fr.question,
    options: item.options.map((opt) => ({ ...opt, text: fr.options[opt.id] ?? opt.text }))
  };
}
var FAIR_FR = {
  race: {
    title: "Le comptoir ferm\xE9",
    question: "Un commer\xE7ant te dit de refuser un client \xE0 cause de sa race. Il dit que la boutique est \xE0 lui, et que la porte est \xE0 lui de fermer. Quelle est l'action licite ?",
    options: {
      A: "Faire comme il dit. Une boutique priv\xE9e peut choisir ses clients selon la race.",
      B: "Refuser l'ordre. La race est un statut prot\xE9g\xE9 par l'Equal Opportunities Act. Le comptoir reste ouvert. Une plainte \xE9crite peut aller \xE0 l'Equal Opportunities Commission.",
      C: "Les servir seulement \xE0 la porte de derri\xE8re.",
      D: "Leur demander d'envoyer quelqu'un d'autre de la famille."
    }
  },
  creed: {
    title: "Le pupitre vide",
    question: "Une \xE9cole laisse un pupitre vide parce que l'enfant suit une autre croyance. Un enseignant dit que l'enfant peut s'asseoir s'il cache le signe de sa foi. Quelle est l'action licite ?",
    options: {
      A: "Laisser le pupitre vide. La croyance appartient \xE0 la maison.",
      B: "Dire \xE0 l'enfant de cacher le signe, puis le laisser s'asseoir.",
      C: "La croyance est prot\xE9g\xE9e. Le pupitre reste ouvert. Ne force pas un enfant \xE0 cacher sa foi. Signale l'interdiction \xE0 l'Equal Opportunities Commission.",
      D: "Mettre l'enfant dans une classe \xE0 part \xAB pour la paix \xBB."
    }
  },
  sex: {
    title: "Ray\xE9e de la liste",
    question: "Un contrema\xEEtre raye une femme qualifi\xE9e de la liste de nuit. Il dit que le travail n'est pas pour les femmes, et qu'elle pourrait devenir enceinte. Quelle est l'action licite ?",
    options: {
      A: "La remettre sur la liste. Le sexe, la grossesse et la responsabilit\xE9 familiale sont prot\xE9g\xE9s. Ne transmets pas cet ordre.",
      B: "Lui offrir un poste de jour moins pay\xE9 et appeler \xE7a de la gentillesse.",
      C: "Lui demander de signer qu'elle n'aura pas d'enfants.",
      D: "Laisser la liste. Le contrema\xEEtre conna\xEEt le travail."
    }
  },
  age: {
    title: "Trop \xE2g\xE9e pour la ligne",
    question: "Une conductrice qualifi\xE9e de 58 ans est refus\xE9e sur la ligne. Aucune r\xE8gle de s\xE9curit\xE9 ne fixe un \xE2ge. La note dit \xAB trop \xE2g\xE9e \xBB. Quelle est l'action licite ?",
    options: {
      A: "\xCAtre d'accord. Apr\xE8s 55 ans la ligne est ferm\xE9e.",
      B: "R\xE9\xE9crire son \xE2ge sur le formulaire pour que la note disparaisse.",
      C: "Lui donner une semaine non pay\xE9e, puis d\xE9cider.",
      D: "L'\xE2ge seul n'est pas une raison. R\xE9tablis sa demande. Si l'\xE2ge n'est pas une vraie condition, signale-le \xE0 l'Equal Opportunities Commission."
    }
  },
  colour: {
    title: "Descendu dans la file",
    question: "Un commis au logement descend un dossier dans la file \xE0 cause de la couleur du demandeur. Il dit que \xE7a \xAB gardera la paix \xBB. Quelle est l'action licite ?",
    options: {
      A: "Laisser le dossier l\xE0 o\xF9 il l'a mis. La file est \xE0 lui.",
      B: "Regrouper tous les dossiers de cette couleur et appeler \xE7a de l'ordre.",
      C: "La couleur est prot\xE9g\xE9e. Remets le dossier \xE0 sa place. Ne te tais pas. D\xE9pose une plainte \xE9crite \xE0 l'Equal Opportunities Commission.",
      D: "Dire au demandeur d'attendre un an et de refaire la demande sous un autre nom."
    }
  },
  notice: {
    title: "La salle interdite",
    question: "Quelqu'un te demande d'imprimer un avis qui interdit une race, une foi, les femmes, ou les personnes au-del\xE0 d'un certain \xE2ge dans la salle du village. Quelle est l'action licite ?",
    options: {
      A: "L'imprimer si le comit\xE9 de la salle a vot\xE9.",
      B: "Refuser. Ne l'imprime pas et n'aide pas \xE0 l'\xE9crire. Une salle ne peut pas \xEAtre ferm\xE9e sur ces motifs. Signale la demande.",
      C: "Imprimer une ligne plus douce qui dit \xAB pr\xE9f\xE9rence \xBB au lieu d'\xAB interdit \xBB.",
      D: "Afficher l'avis une semaine, puis le retirer."
    }
  }
};
function localizeFair(item, lang) {
  const fr = lang === "fr" ? FAIR_FR[item.id] : void 0;
  if (!fr) return item;
  return {
    ...item,
    title: fr.title,
    question: fr.question,
    options: item.options.map((opt) => ({ ...opt, text: fr.options[opt.id] ?? opt.text }))
  };
}
var CROP_FR = {
  spray: {
    title: "Le mauvais produit",
    question: "Un voisin dit que le fongicide qu'il met sur les tomates ira pour ta laitue. L'\xE9tiquette ne cite pas la laitue. Quelle est l'action licite ?",
    options: {
      A: "L'utiliser. Un fongicide est un fongicide.",
      B: "Mettre la moiti\xE9 de la dose pour que le r\xE9sidu reste petit.",
      C: "Ne l'utilise pas. Sous la Use of Pesticides Act, un pesticide ne s'emploie sur une culture que s'il est celui permis pour cette culture. Demande au FAREI quel produit est pr\xE9vu pour la laitue.",
      D: "Pulv\xE9riser la nuit pour que personne ne voie l'\xE9tiquette."
    }
  },
  wait: {
    title: "Les jours d'attente",
    question: "La laitue a \xE9t\xE9 trait\xE9e ce matin. L'\xE9tiquette dit de ne pas r\xE9colter avant sept jours. Un acheteur est \xE0 la barri\xE8re et paie comptant aujourd'hui. Quelle est l'action licite ?",
    options: {
      A: "La couper. Le lavage enl\xE8ve le r\xE9sidu.",
      B: "Couper seulement les feuilles du dehors et vendre le c\u0153ur.",
      C: "Dire \xE0 l'acheteur que c'est bio et prendre l'argent.",
      D: "Attendre le d\xE9lai de l'\xE9tiquette. Vendre avant, c'est comme \xE7a que le r\xE9sidu d\xE9passe la limite. Ne prends pas l'argent aujourd'hui."
    }
  },
  bottle: {
    title: "La fiole sans \xE9tiquette",
    question: "Un vendeur propose un pesticide bon march\xE9 dans une bouteille de boisson, sans \xE9tiquette et sans autorisation pour ta culture. Il dit que tout le champ l'utilise. Quelle est l'action licite ?",
    options: {
      A: "L'acheter. Un prix plus bas, c'est le m\xEAme produit.",
      B: "Le refuser. Ne le stocke pas et ne le pulv\xE9rise pas. N'utilise qu'un produit \xE9tiquet\xE9, permis pour cette culture. Signale la fiole au Pesticides Regulatory Office.",
      C: "Le verser dans ton propre r\xE9servoir et \xE9crire le nom de la culture toi-m\xEAme.",
      D: "L'essayer une fois, dans un coin du champ."
    }
  },
  cans: {
    title: "Les bidons vides",
    question: "Apr\xE8s la pulv\xE9risation, les bidons vides sont empil\xE9s pr\xE8s du canal. Quelqu'un dit de les rincer dans l'eau, ou de les br\xFBler derri\xE8re le hangar. Quelle est l'action licite ?",
    options: {
      A: "Les rincer dans le canal. L'eau emportera le produit.",
      B: "Les br\xFBler. La cendre est plus propre que le plastique.",
      C: "Les enterrer dans la planche que tu planteras la semaine prochaine.",
      D: "Ne les verse pas dans le canal et ne les br\xFBle pas. Rince-les trois fois dans la cuve, puis porte les vides au point de collecte du Pesticides Code of Practice. Le canal n'est pas un \xE9gout pour les produits."
    }
  },
  mix: {
    title: "Le m\xE9lange",
    question: "Un planteur m\xE9lange trois pesticides pour que chacun reste sous sa propre limite. Il dit que la loi ne v\xE9rifie qu'un produit \xE0 la fois. Quelle est l'action licite ?",
    options: {
      A: "Les m\xE9langer. Si chacun reste sous sa limite, le lot est licite.",
      B: "Les m\xE9langer, puis ajouter de l'eau jusqu'\xE0 ce que la couleur soit claire.",
      C: "Ne les m\xE9lange pas pour contourner la limite. N'utilise que le produit permis pour cette culture, \xE0 la dose de l'\xE9tiquette. Un cocktail n'est pas un moyen de contourner la Use of Pesticides Act.",
      D: "Les m\xE9langer seulement sur le lot import\xE9. Les lots locaux restent simples."
    }
  },
  stall: {
    title: "Le lot d\xE9j\xE0 mang\xE9",
    question: "Un lot de coriandre \xE9choue au test : le pesticide n'\xE9tait pas recommand\xE9 pour cette culture. Le r\xE9sultat arrive tard. Le marchand dit de vendre le reste, parce que les gens ont d\xE9j\xE0 mang\xE9 le d\xE9but. Quelle est l'action licite ?",
    options: {
      A: "Vendre le reste. Le mal est d\xE9j\xE0 fait.",
      B: "Le d\xE9placer sur un autre \xE9tal et ne pas parler du test.",
      C: "Ne vends pas le reste. Un lot \xE9chou\xE9 reste hors de l'\xE9tal. Garde le registre de pulv\xE9risation et pr\xE9viens le Pesticides Regulatory Office. Un r\xE9sultat tardif n'est pas un permis de liquider le stock.",
      D: "Le vendre cuit. La chaleur enl\xE8ve le r\xE9sidu."
    }
  }
};
const WASH_FR = {
  shelf: {
    title: "L'\xE9tag\xE8re vide",
    question: "Une soci\xE9t\xE9 de gestion doit cr\xE9er une soci\xE9t\xE9 dans la journ\xE9e. Elle n'a pas de personnel, pas de bureau, pas d'activit\xE9. Les factures citent des marchandises qui n'ont jamais quitt\xE9 le port. Le propri\xE9taire est un agent public d'un autre pays, et les honoraires sont \xE9lev\xE9s si personne ne pose de question. Quelle est l'action licite ?",
    options: {
      A: "La constituer. Une soci\xE9t\xE9 sans personnel est normale.",
      B: "Mettre ton nom comme administrateur pour que le dossier paraisse local.",
      C: "Une soci\xE9t\xE9 sans activit\xE9 et \xE0 agent public cach\xE9 n'est pas un client. Refuse. D\xE9pose une d\xE9claration de transaction suspecte aupr\xE8s de la FIU. Ne sois pas pr\xEAte-nom.",
      D: "Change les factures pour qu'elles citent un autre port."
    }
  },
  desk: {
    title: "Le guichet silencieux",
    question: "Un banquier priv\xE9 doit recevoir une grosse somme d'une fondation \xE9trang\xE8re, puis l'envoyer le jour m\xEAme \xE0 Duba\xEF et \xE0 un agent immobilier de luxe. Le client ne dit pas d'o\xF9 vient l'argent. Quelle est l'action licite ?",
    options: {
      A: "Ex\xE9cuter. La vitesse est un service.",
      B: "Prendre les honoraires, puis \xE9crire \xE0 la conformit\xE9 demain.",
      C: "Couper la somme en trois comptes pour qu'aucun transfert ne paraisse gros.",
      D: "N'ex\xE9cute pas le transfert. Garde les fonds que tu peux. D\xE9pose une d\xE9claration de transaction suspecte. Une entr\xE9e et une sortie le m\xEAme jour, sans origine des fonds, est un lavage."
    }
  },
  deed: {
    title: "L'acte",
    question: "Un agent immobilier se voit offrir du liquide pour une villa au nom d'un ami, plus un permis de r\xE9sidence si la vente se fait cette semaine. L'acheteur n'a pas de travail ici et poss\xE8de d\xE9j\xE0 trois maisons vides. Quelle est l'action licite ?",
    options: {
      A: "Signer. Un bien est propre d\xE8s qu'il a un titre.",
      B: "Prendre le liquide mais \xE9crire un prix plus bas sur l'acte.",
      C: "Un titre ne lave pas l'argent. Refuse la vente en liquide. Signale-la. Un permis de r\xE9sidence n'est pas un lavage.",
      D: "Louer d'abord la villa \xE0 l'acheteur pour qu'elle paraisse habit\xE9e."
    }
  },
  loop: {
    title: "La boucle",
    question: "Un promoteur veut qu'une soci\xE9t\xE9 locale investisse dans son propre groupe au pays. L'argent est sorti l'an dernier comme pr\xEAt vers une coquille ici. Il revient comme investissement \xE9tranger, avec une demande de ne presque pas payer d'imp\xF4t. Quelle est l'action licite ?",
    options: {
      A: "Signer le formulaire de trait\xE9. La boucle n'est qu'une structure efficace.",
      B: "Transformer le pr\xEAt en don pour couper la piste.",
      C: "L'argent qui sort et revient comme investissement \xE9tranger n'est pas \xE9tranger. Ne certifie pas la demande de trait\xE9. Signale la boucle.",
      D: "Ajouter deux coquilles pour allonger le chemin."
    }
  },
  bid: {
    title: "L'offre",
    question: "Un contrat public de carburant va \xEAtre attribu\xE9 sur une offre non sollicit\xE9e. On demande \xE0 un administrateur local de facturer des honoraires de conseil \xE0 une partie proche de l'attribution, puis d'envoyer les honoraires \xE0 un marchand de montres. Quelle est l'action licite ?",
    options: {
      A: "Facturer cela comme du conseil. La commande publique, c'est de la politique.",
      B: "Attendre la signature du contrat, puis prendre les honoraires.",
      C: "Payer en liquide pour qu'il n'y ait pas de virement.",
      D: "Un pot-de-vin habill\xE9 en honoraires de conseil reste un pot-de-vin. Ne facture pas. Signale-le \xE0 la Financial Crimes Commission. L'argent public n'est pas un compte client."
    }
  },
  name: {
    title: "Le nom",
    question: "On demande \xE0 un pr\xEAte-nom de si\xE9ger dans cinq soci\xE9t\xE9s. Il ne verra jamais les comptes. On lui dit que le propri\xE9taire est un family office. Une note sur le bureau nomme une personne sous sanctions internationales. Quelle est l'action licite ?",
    options: {
      A: "Signer. Un pr\xEAte-nom n'est pas responsable s'il ne lit pas le dossier.",
      B: "N'en signer que quatre sur cinq.",
      C: "Un pr\xEAte-nom qui cache un propri\xE9taire sanctionn\xE9 fait partie du lavage. D\xE9missionne. Pr\xE9viens la Financial Services Commission et la Financial Crimes Commission. Ne pr\xEAte pas ton nom.",
      D: "D\xE9placer les soci\xE9t\xE9s vers un autre cabinet et se taire."
    }
  }
};

const STAMP_FR = {
  envelope: {
    title: "L'enveloppe",
    question: "Un homme glisse une enveloppe sous la vitre avec son dossier de licence commerciale. Il dit que le tarif affich\xE9 est pour ceux qui aiment attendre, et que le guichet marche ainsi apr\xE8s le d\xE9jeuner. Quelle est l'action licite ?",
    options: {
      A: "Prendre l'enveloppe. Le tarif affich\xE9 est pour ceux qui peuvent attendre.",
      B: "En prendre la moiti\xE9, noter le dossier, et tamponner aujourd'hui.",
      C: "Refuse l'enveloppe. Remets-la de son c\xF4t\xE9 de la vitre. Une licence commerciale n'est d\xE9livr\xE9e que si le dossier est complet et que le tarif au mur est pay\xE9 \xE0 la caisse. Une enveloppe sous le comptoir n'est pas un tarif. Signale-la.",
      D: "Tamponner d'abord, puis l'envoyer \xE0 la caisse plus tard si quelqu'un demande."
    }
  },
  kin: {
    title: "La cousine",
    question: "Ta cousine est au guichet. Deux papiers manquent au dossier de licence commerciale. Elle dit que tu connais la boutique, que tu connais la famille, et qu'une famille ne doit pas \xEAtre trait\xE9e comme une \xE9trang\xE8re. Quelle est l'action licite ?",
    options: {
      A: "Tamponner. Une cousine n'est pas un membre du public.",
      B: "Ne tamponne pas. Une cousine au guichet reste un membre du public. Un papier manquant est un non. Dis-lui quels papiers manquent et prends la personne suivante.",
      C: "Tamponner pour trois mois, le temps qu'elle apporte les papiers.",
      D: "Passer le dossier au bureau derri\xE8re toi et faire comme si tu n'avais rien vu."
    }
  },
  plate: {
    title: "La plaque",
    question: "Un chauffeur veut le tampon d'un v\xE9hicule de service public. Le certificat de visite est expir\xE9. Il dit que la camionnette est la m\xEAme que l'an dernier, que l'inspecteur est un ami, et que la tourn\xE9e scolaire commence \xE0 l'aube. Quelle est l'action licite ?",
    options: {
      A: "Tamponner. La camionnette de l'an dernier est celle de cette ann\xE9e.",
      B: "Tamponner et lui dire de faire la visite la semaine prochaine.",
      C: "Appeler l'inspecteur et lui demander de signer de chez lui.",
      D: "Ne tamponne pas. Un certificat expir\xE9 n'est pas un certificat. Une plaque de service public ne se d\xE9livre pas sur une promesse. Envoie-le \xE0 la visite licite. La tourn\xE9e scolaire ne r\xE9\xE9crit pas le dossier."
    }
  },
  slab: {
    title: "La dalle",
    question: "Un entrepreneur veut le permis de construire et d'usage des terres tamponn\xE9 aujourd'hui. Le dossier n'a pas de plan approuv\xE9 ni d'avis aux voisins. Il dit que la dalle est d\xE9j\xE0 coul\xE9e, que les ouvriers sont sur le site, et qu'arr\xEAter maintenant lui co\xFBte. Quelle est l'action licite ?",
    options: {
      A: "Tamponner. Une dalle coul\xE9e veut dire que le permis n'est que du papier.",
      B: "Lui dire de couler le reste apr\xE8s la nuit pour que le dossier rattrape.",
      C: "Ne tamponne pas. Des travaux avant un Building and Land Use Permit ne cr\xE9ent pas un droit au permis. Un plan manquant et un avis manquant restent manquants. Note les travaux non autoris\xE9s et ne les r\xE9gularise pas au guichet.",
      D: "Tamponner un b\xE2timent plus petit que celui du site pour que le dossier paraisse modeste."
    }
  },
  calendar: {
    title: "Le calendrier",
    question: "Une licence de local alimentaire a expir\xE9 le mois dernier. La visite n'est pas prise. Le marchand dit de tamponner le renouvellement maintenant et de mettre la visite au calendrier du mois prochain, parce que le bazar ne peut pas attendre. Quelle est l'action licite ?",
    options: {
      A: "Tamponner le renouvellement. Une visite peut suivre une semaine charg\xE9e.",
      B: "Ne tamponne pas. Un renouvellement n'est pas un autocollant neuf sur une vieille date. Pas de visite, pas de licence. Prends la visite. L'\xE9tal reste ferm\xE9 tant que le dossier n'est pas entier.",
      C: "Tamponner et \xE9crire visite en attente au crayon.",
      D: "Le laisser vendre au fond du bazar, loin de l'all\xE9e principale."
    }
  },
  listing: {
    title: "L'annonce",
    question: "Une villa est d\xE9j\xE0 sur un site de r\xE9servation. Les h\xF4tes arrivent ce soir. Le dossier n'a pas de Tourist Enterprise Licence ni de Building and Land Use Permit au nom du demandeur. Le titulaire dit que les chambres ont toujours \xE9t\xE9 \xE0 la famille, et qu'une somme priv\xE9e fera passer l'ancienne carte au nom d'un neveu, sous la vitre. Quelle est l'action licite ?",
    options: {
      A: "Tamponner l'ancienne carte au nom du neveu. Une villa de famille est d\xE9j\xE0 une maison d'h\xF4tes.",
      B: "Tamponner pour ce week-end seulement, pour ne pas renvoyer les h\xF4tes.",
      C: "Ne tamponne pas. Une annonce et une nuit r\xE9serv\xE9e ne cr\xE9ent pas une Tourist Enterprise Licence. La Tourism Authority d\xE9livre cette licence sur un dossier complet, pas sur une somme priv\xE9e au guichet. Le neveu demande en son nom. Des h\xF4tes d\xE9j\xE0 en route ne font pas bouger le tampon.",
      D: "Ne changer que le pr\xE9nom sur l'ancienne carte et laisser le num\xE9ro de maison."
    }
  }
};
function localizeStamp(item, lang) {
  const fr = lang === "fr" ? STAMP_FR[item.id] : void 0;
  if (!fr) return item;
  return {
    ...item,
    title: fr.title,
    question: fr.question,
    options: item.options.map((opt) => ({ ...opt, text: fr.options[opt.id] ?? opt.text }))
  };
}
function localizeRoll(item, lang) {
  return item;
}
function localizeOath(item, lang) {
  return item;
}
function localizeWash(item, lang) {
  const fr = lang === "fr" ? WASH_FR[item.id] : void 0;
  if (!fr) return item;
  return {
    ...item,
    title: fr.title,
    question: fr.question,
    options: item.options.map((opt) => ({ ...opt, text: fr.options[opt.id] ?? opt.text }))
  };
}
function localizeCrop(item, lang) {
  const fr = lang === "fr" ? CROP_FR[item.id] : void 0;
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
  localizeCrop,
  localizeStamp,
  localizeRoll,
  localizeOath,
  localizeWash,
  localizeFair,
  localizeHaven,
  localizeLand,
  localizeTender,
  shortLabel,
  t
};
