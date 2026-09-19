import { createFileRoute } from "@tanstack/react-router";
import { UI } from "@/data/copy";
import { t } from "@/lib/i18n";
import { useLeague } from "@/lib/store";

export const Route = createFileRoute("/methodology")({ component: Method });

function Method() {
  const lang = useLeague((s) => s.lang);

  return (
    <article className="max-w-2xl space-y-6">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{t(UI.method, lang)}</p>
      <h1 className="font-display text-3xl sm:text-4xl">{t(UI.methodTitle, lang)}</h1>
      <p className="text-muted">{t(UI.methodLead, lang)}</p>
      <ol className="list-decimal space-y-3 pl-5 text-base leading-relaxed">
        {UI.methodSteps.map((step, i) => (
          <li key={i}>{t(step, lang)}</li>
        ))}
      </ol>
      <p className="text-sm text-muted">{t(UI.disclaimer, lang)}</p>
    </article>
  );
}
