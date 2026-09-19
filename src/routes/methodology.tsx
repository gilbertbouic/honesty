import { createFileRoute } from "@tanstack/react-router";
import { UI } from "@/data/copy";
import { t } from "@/lib/i18n";
import { useLeague } from "@/lib/store";

export const Route = createFileRoute("/methodology")({ component: Method });

function Method() {
  const lang = useLeague((s) => s.lang);
  const fr = lang === "fr";

  return (
    <article className="max-w-2xl space-y-6">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{t(UI.method, lang)}</p>
      <h1 className="font-display text-3xl sm:text-4xl">
        {fr ? "Les points mesurent le processus, pas l’idéologie." : "Points measure process, not ideology."}
      </h1>
      <p className="text-muted">
        {fr
          ? "Le scoreur est déterministe. Deux personnes qui relancent la même fonction sur les mêmes fichiers obtiennent le même résultat."
          : "The scorer is deterministic. Two people running the same function on the same files get the same result."}
      </p>
      <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed">
        <li>
          {fr
            ? "Règle déclarée plus un choix : 10."
            : "Declared rule plus a choice: 10."}
        </li>
        <li>
          {fr
            ? "Raison écrite d’au moins 40 mots : +5. Douze mots : +2."
            : "Written reason of at least 40 words: +5. Twelve words: +2."}
        </li>
        <li>
          {fr
            ? "Toute réponse est publique. Multiplicateur du pupitre : × 1,5."
            : "Every answer is public. Desk multiplier: × 1.5."}
        </li>
        <li>
          {fr
            ? "Bande : première ligne × 1, milieu × 1,15, senior × 1,35."
            : "Band: front line × 1, middle × 1.15, senior × 1.35."}
        </li>
        <li>
          {fr
            ? "Contradiction sans amendement : −12. Chaise vide : 0, et des planches sur la maison."
            : "Contradiction without amendment: −12. Empty Chair: 0, and boards on the house."}
        </li>
        <li>
          {fr
            ? "Marque HONEST : les trois maisons assises en tête reçoivent un QR public. Le texte scanné est « I scored as HONEST with Mkweli », plus le nom et les points. Ce n’est pas un certificat de vertu."
            : "Honest mark: the top three sitting houses receive a public QR. The scanned text is “I scored as HONEST with Mkweli”, plus handle and points. It is not a certificate of virtue."}
        </li>
      </ol>
      <p className="text-sm text-muted">{t(UI.disclaimer, lang)}</p>
    </article>
  );
}
