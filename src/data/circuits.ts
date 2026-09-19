import type { Circuit } from "@/data/types";

export const CIRCUITS: Circuit[] = [
  {
    id: "procurement",
    family: "shared",
    title: { en: "Procurement and supply", fr: "Passation des marchés" },
    why: {
      en: "Specifications, bid evaluation, and store issue can be written for one name.",
      fr: "Les spécifications, l’évaluation des offres et les stocks peuvent être taillés pour un nom.",
    },
  },
  {
    id: "contracts",
    family: "service",
    title: { en: "Contract works and overtime", fr: "Travaux et heures supplémentaires" },
    why: {
      en: "Variation orders and site measurement quietly rewrite the signed contract.",
      fr: "Les avenants et les métrés réécrivent le contrat déjà signé.",
    },
  },
  {
    id: "revenue",
    family: "service",
    title: { en: "Revenue, tax and customs", fr: "Recettes, fiscalité et douanes" },
    why: {
      en: "High discretion next to immediate money.",
      fr: "Un fort pouvoir discrétionnaire, collé à l’argent immédiat.",
    },
  },
  {
    id: "licences",
    family: "service",
    title: { en: "Licences, permits and allocations", fr: "Licences, permis et attributions" },
    why: {
      en: "The desk sells access to a scarce legal benefit.",
      fr: "Le guichet vend l’accès à un droit rare.",
    },
  },
  {
    id: "land",
    family: "service",
    title: { en: "Land, housing and valuation", fr: "Foncier, logement et évaluation" },
    why: {
      en: "State land and valuation are high-value, low-frequency decisions.",
      fr: "Le domaine de l’État et l’évaluation sont des décisions rares et lourdes.",
    },
  },
  {
    id: "enforcement",
    family: "service",
    title: { en: "Law enforcement and custody", fr: "Forces de l’ordre et détention" },
    why: {
      en: "Force plus discretion plus contact with illicit markets.",
      fr: "La force, le pouvoir discrétionnaire et le contact avec les marchés illicites.",
    },
  },
  {
    id: "justice",
    family: "service",
    title: { en: "Justice and registries", fr: "Justice et greffes" },
    why: {
      en: "Listing, file movement, and bail can be sold without a judgment.",
      fr: "Le rôle, le dossier et la caution peuvent se vendre sans jugement.",
    },
  },
  {
    id: "health",
    family: "service",
    title: { en: "Health", fr: "Santé" },
    why: {
      en: "Scarce beds, lists, and devices invite kickbacks.",
      fr: "Lits, listes et dispositifs rares ouvrent la porte aux rétrocommissions.",
    },
  },
  {
    id: "education",
    family: "service",
    title: { en: "Education and examinations", fr: "Éducation et examens" },
    why: {
      en: "Grades, transfers, and school works are a second market.",
      fr: "Notes, mutations et travaux scolaires forment un second marché.",
    },
  },
  {
    id: "people",
    family: "shared",
    title: { en: "People, payroll and recruitment", fr: "Personnel, paie et recrutement" },
    why: {
      en: "Jobs and acting allowances are themselves a market.",
      fr: "Les postes et les intérims sont eux-mêmes un marché.",
    },
  },
  {
    id: "grants",
    family: "shared",
    title: { en: "Grants, subsidies and stalls", fr: "Subventions, aides et emplacements" },
    why: {
      en: "Eligibility can be stretched; lists can be padded.",
      fr: "L’éligibilité se dilate ; les listes s’allongent.",
    },
  },
  {
    id: "soe",
    family: "service",
    title: { en: "State enterprises and boards", fr: "Entreprises publiques et conseils" },
    why: {
      en: "Boards can route a contract around open tender.",
      fr: "Un conseil peut contourner l’appel d’offres ouvert.",
    },
  },
  {
    id: "partners",
    family: "mandate",
    title: { en: "Implementing partners", fr: "Partenaires d’exécution" },
    why: {
      en: "UN and fund money often meets local patronage at the partner.",
      fr: "L’argent onusien rencontre souvent le clientélisme chez le partenaire.",
    },
  },
  {
    id: "earmarks",
    family: "mandate",
    title: { en: "Assessed and earmarked finance", fr: "Contributions et fonds affectés" },
    why: {
      en: "Core budget, trust funds, and a donor’s favourite project can be shuffled.",
      fr: "Budget de base, fonds fiduciaires et projet-chouchou d’un donateur se mélangent.",
    },
  },
  {
    id: "immunity",
    family: "mandate",
    title: { en: "Immunity and referral", fr: "Immunité et renvoi" },
    why: {
      en: "A case can be waived, handled in-house, or allowed to lapse.",
      fr: "Une affaire peut être levée, traitée en interne, ou laissée mourir.",
    },
  },
  {
    id: "mission",
    family: "mandate",
    title: { en: "Mission and field economy", fr: "Économie de mission" },
    why: {
      en: "Fuel, rations, and compound vendors are a known peacekeeping risk.",
      fr: "Carburant, rations et fournisseurs de camp sont un risque connu du maintien de la paix.",
    },
  },
  {
    id: "quota",
    family: "mandate",
    title: { en: "Nationality, quota and secondment", fr: "Nationalité, quotas et détachement" },
    why: {
      en: "Posts can be filled to satisfy a capital rather than a competency.",
      fr: "Un poste peut servir une capitale plutôt qu’une compétence.",
    },
  },
  {
    id: "climate-funds",
    family: "mandate",
    title: { en: "Climate and vertical funds", fr: "Fonds climat et fonds verticaux" },
    why: {
      en: "Accreditation and readiness grants sit between a proposal and a built thing.",
      fr: "L’accréditation et les dons de préparation séparent la proposition de l’ouvrage.",
    },
  },
];
