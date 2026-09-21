import type { Dilemma } from "@/data/types";

const SHARED_CHOICES = [
  {
    id: "award",
    label: {
      en: "Give them the Honesty Street works and move on. Speed matters.",
      fr: "Donnez-leur les travaux d’Honesty Street et avancez. La vitesse compte.",
    },
  },
  {
    id: "recuse",
    label: {
      en: "Step aside. Say you know them. Let someone else decide.",
      fr: "Écartez-vous. Dites que vous les connaissez. Laissez quelqu’un d’autre décider.",
    },
  },
  {
    id: "republish",
    label: {
      en: "Stop. Show the marks. Ask for new bids on Honesty Street.",
      fr: "Arrêtez. Montrez les notes. Demandez de nouvelles offres pour Honesty Street.",
    },
  },
  {
    id: "quiet",
    label: {
      en: "Write the link in a closed note. Still give the works to the friend.",
      fr: "Notez le lien dans un papier fermé. Donnez quand même les travaux à l’ami.",
    },
  },
];

export const DILEMMAS: Dilemma[] = [
  {
    id: "w1-connected-bidder",
    week: 1,
    headline: {
      en: "Who renovates Honesty Street: the cheapest builder, or the friend?",
      fr: "Qui rénove Honesty Street : le bâtisseur le moins cher, ou l’ami ?",
    },
    opensAt: "2026-10-01T09:00:00+04:00",
    closesAt: "2026-10-31T16:00:00+04:00",
    variants: [
      {
        circuitId: "gallery",
        prompt: {
          en: "The State has opened a tender to renovate Honesty Street: the two houses, the roofs, the cobbles, the drains, and the lamps. A builder paid for a party fête last year. He is second cheapest. The cheapest builder failed two safety checks. Your neighbourhood group will be asked what it thinks. What rule will you use next time?",
          fr: "L’État a ouvert un appel d’offres pour rénover Honesty Street : les deux maisons, les toits, les pavés, les drains et les lampes. Un entrepreneur a payé une fête de parti l’an dernier. Il est le deuxième moins cher. Le moins cher a raté deux contrôles de sécurité. Votre groupe de quartier sera demandé. Quelle règle utiliserez-vous la prochaine fois ?",
        },
        choices: SHARED_CHOICES,
      },
      {
        circuitId: "procurement",
        prompt: {
          en: "You chair the bid meeting for the Honesty Street works: houses, roofs, cobbles, drains, and lamps. The second cheapest builder paid for last year’s party fête. The cheapest builder failed two safety checks. What do you do?",
          fr: "Vous présidez la réunion des offres pour les travaux d’Honesty Street : maisons, toits, pavés, drains et lampes. Le deuxième moins cher a payé la fête du parti l’an dernier. Le moins cher a raté deux contrôles de sécurité. Que faites-vous ?",
        },
        choices: SHARED_CHOICES,
      },
      {
        circuitId: "health",
        prompt: {
          en: "A small clinic on Honesty Street is in the same renovation package. The friend offers a “conference” in Lisbon if their firm keeps the clinic works. A cheaper builder has a shorter repair record. You sit on the hospital buying group.",
          fr: "Une petite clinique sur Honesty Street est dans le même lot de rénovation. L’ami offre une « conférence » à Lisbonne si sa firme garde les travaux de la clinique. Un bâtisseur moins cher a moins d’historique de réparation. Vous siégez au groupe d’achat de l’hôpital.",
        },
        choices: [
          {
            id: "award",
            label: {
              en: "Give the clinic works to the friend. Keep the same supplier.",
              fr: "Donnez les travaux de la clinique à l’ami. Gardez le même fournisseur.",
            },
          },
          {
            id: "recuse",
            label: {
              en: "Refuse the trip. Step aside. Show the marks.",
              fr: "Refusez le voyage. Écartez-vous. Montrez les notes.",
            },
          },
          {
            id: "republish",
            label: {
              en: "Start the Honesty Street list again, with a clear conflict rule.",
              fr: "Recommencez la liste d’Honesty Street, avec une règle de conflit claire.",
            },
          },
          {
            id: "quiet",
            label: {
              en: "Refuse the trip in writing. Still give them the clinic works.",
              fr: "Refusez le voyage par écrit. Donnez-leur quand même les travaux de la clinique.",
            },
          },
        ],
      },
      {
        circuitId: "licences",
        prompt: {
          en: "The friend wants the site permit for the Honesty Street works by Friday. The complete file is the cheaper builder. The friend’s file knows a councillor.",
          fr: "L’ami veut le permis de chantier pour Honesty Street pour vendredi. Le dossier complet est celui du bâtisseur moins cher. Le dossier de l’ami connaît un conseiller.",
        },
        choices: [
          {
            id: "award",
            label: {
              en: "Give the Honesty Street permit to the friend. Keep the peace.",
              fr: "Donnez le permis d’Honesty Street à l’ami. Gardez la paix.",
            },
          },
          {
            id: "recuse",
            label: {
              en: "Step aside. Send both files to another officer.",
              fr: "Écartez-vous. Envoyez les deux dossiers à un autre agent.",
            },
          },
          {
            id: "republish",
            label: {
              en: "Publish the rule for who gets the Honesty Street site permit.",
              fr: "Publiez la règle pour qui a le permis de chantier d’Honesty Street.",
            },
          },
          {
            id: "quiet",
            label: {
              en: "Give the permit to the complete file. Tell the councillor later, in private.",
              fr: "Donnez le permis au dossier complet. Dites-le au conseiller plus tard, en privé.",
            },
          },
        ],
      },
      {
        circuitId: "revenue",
        prompt: {
          en: "Materials for the Honesty Street works are in the queue. The friend’s importer is missing a paper. They hint at a “facilitation fee”. Your team is behind on its target.",
          fr: "Les matériaux pour Honesty Street sont dans la file. L’importateur de l’ami n’a pas un papier. Il parle d’un « frais de facilitation ». Votre équipe est en retard sur sa cible.",
        },
        choices: [
          {
            id: "award",
            label: {
              en: "Let the Honesty Street goods through. Collect the paper later.",
              fr: "Laissez passer les biens d’Honesty Street. Prenez le papier plus tard.",
            },
          },
          {
            id: "recuse",
            label: {
              en: "Say no. Write down the offer. Send the file up.",
              fr: "Dites non. Notez l’offre. Envoyez le dossier plus haut.",
            },
          },
          {
            id: "republish",
            label: {
              en: "Hold the goods. Publish the rule for missing papers.",
              fr: "Gardez les biens. Publiez la règle pour les papiers manquants.",
            },
          },
          {
            id: "quiet",
            label: {
              en: "Take no money. Still move their Honesty Street file to the front.",
              fr: "Ne prenez pas d’argent. Avancez quand même leur dossier Honesty Street.",
            },
          },
        ],
      },
      {
        circuitId: "chamber",
        prompt: {
          en: "Cabinet wants the friend’s bid to win the Honesty Street renovation before a by-election. You are the minister who signs. The cheapest builder failed two safety checks.",
          fr: "Le cabinet veut que l’offre de l’ami gagne la rénovation d’Honesty Street avant une élection partielle. Vous êtes le ministre qui signe. Le bâtisseur le moins cher a raté deux contrôles de sécurité.",
        },
        choices: SHARED_CHOICES,
      },
      {
        circuitId: "partners",
        prompt: {
          en: "A grant is paying part of the Honesty Street works. The local partner is the friend’s firm — an old unit of your deputy’s ministry. Only they can spend the rest of the money before year end. They missed two audits.",
          fr: "Un don paie une partie des travaux d’Honesty Street. Le partenaire local est la firme de l’ami — une ancienne unité du ministère de votre adjoint. Eux seuls peuvent dépenser le reste de l’argent avant la fin d’année. Ils ont manqué deux audits.",
        },
        choices: [
          {
            id: "award",
            label: {
              en: "Give the Honesty Street money to the same director. Spending it matters.",
              fr: "Donnez l’argent d’Honesty Street au même directeur. Le dépenser compte.",
            },
          },
          {
            id: "recuse",
            label: {
              en: "Stop. Ask the deputy to step aside. Look for a new partner.",
              fr: "Arrêtez. Demandez à l’adjoint de s’écarter. Cherchez un nouveau partenaire.",
            },
          },
          {
            id: "republish",
            label: {
              en: "Send the money back rather than spend it badly on Honesty Street.",
              fr: "Rendez l’argent plutôt que mal le dépenser sur Honesty Street.",
            },
          },
          {
            id: "quiet",
            label: {
              en: "Rewrite the Honesty Street job so the same director still wins.",
              fr: "Réécrivez le travail d’Honesty Street pour que le même directeur gagne encore.",
            },
          },
        ],
      },
      {
        circuitId: "climate-funds",
        prompt: {
          en: "The Honesty Street drains and cobbles are billed as a climate grant. The only local consultant allowed to take it is the person who wrote the plan.",
          fr: "Les drains et les pavés d’Honesty Street sont facturés comme un don climat. Le seul consultant local autorisé à le prendre est la personne qui a écrit le plan.",
        },
        choices: SHARED_CHOICES,
      },
    ],
  },
];

export const LIVE_DILEMMA = DILEMMAS[0];
