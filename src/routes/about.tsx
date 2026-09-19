import { createFileRoute } from "@tanstack/react-router";
import { UI } from "@/data/copy";
import { t } from "@/lib/i18n";
import { useLeague } from "@/lib/store";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  const lang = useLeague((s) => s.lang);
  const fr = lang === "fr";

  return (
    <article className="max-w-2xl space-y-6">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{t(UI.about, lang)}</p>
      <h1 className="font-display text-3xl sm:text-4xl">{t(UI.product, lang)}</h1>
      <p>
        {fr
          ? "Un jeu civique de Mkweli. Les citoyens, les agents publics, les élus et les fonctionnaires internationaux répondent à la même dilemme, chaque semaine, et accumulent des points d’honnêteté."
          : "A Mkweli civic game. Citizens, civil servants, elected officials and international staff answer the same weekly dilemma and accumulate Honesty Points."}
      </p>
      <p className="text-muted">
        {fr
          ? "Le givre sur la maison de verre n’est pas un verdict pénal. C’est le silence, la contradiction, ou le refus de s’asseoir."
          : "Frost on the glass house is not a criminal verdict. It is silence, contradiction, or a refusal to sit."}
      </p>
      <p className="text-muted">
        {fr
          ? "Saison 1. Destination prévue : honesty.mkweli.tech. Le registre public est le dépôt GitHub."
          : "Season 1. Intended home: honesty.mkweli.tech. The public ledger is the GitHub repository."}
      </p>
      <p>
        <a href="https://mkweli.tech" className="text-primary">
          mkweli.tech
        </a>
      </p>
    </article>
  );
}
