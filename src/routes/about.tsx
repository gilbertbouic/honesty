import { createFileRoute } from "@tanstack/react-router";
import { UI } from "@/data/copy";
import { t } from "@/lib/i18n";
import { useLeague } from "@/lib/store";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  const lang = useLeague((s) => s.lang);

  return (
    <article className="max-w-2xl space-y-6">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{t(UI.about, lang)}</p>
      <h1 className="font-display text-3xl sm:text-4xl">{t(UI.product, lang)}</h1>
      <p>{t(UI.aboutLead, lang)}</p>
      <p className="text-muted">{t(UI.aboutOpen, lang)}</p>
      <p>
        <a href="https://mkweli.tech" className="text-primary">
          mkweli.tech
        </a>
      </p>
    </article>
  );
}
