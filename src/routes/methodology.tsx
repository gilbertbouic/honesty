import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassHouse } from "@/components/glass-house";
import { UI } from "@/data/copy";
import { t } from "@/lib/i18n";
import { useLeague } from "@/lib/store";

export const Route = createFileRoute("/methodology")({ component: Method });

function Method() {
  const lang = useLeague((s) => s.lang);

  return (
    <article className="max-w-2xl space-y-10">
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">{t(UI.method, lang)}</p>
        <h1 className="font-display text-3xl sm:text-4xl">{t(UI.method, lang)}</h1>
        <h2 className="font-display text-2xl">{t(UI.methodLeagueTitle, lang)}</h2>
        {UI.methodLeague.map((step, i) => (
          <p key={i}>{t(step, lang)}</p>
        ))}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <GlassHouse points={48} compact thaw />
            <p className="mt-3 text-sm text-muted">{t(UI.methodHouseClear, lang)}</p>
          </div>
          <div>
            <GlassHouse points={0} emptyChair compact thaw />
            <p className="mt-3 text-sm text-muted">{t(UI.methodHouseBoards, lang)}</p>
          </div>
        </div>
        <p className="text-muted">{t(UI.aboutFrost, lang)}</p>
        <p>
          <Link to="/houses" className="text-primary">
            {t(UI.methodStreet, lang)}
          </Link>
        </p>
      </div>
      <div className="space-y-6">
        <h2 className="font-display text-2xl">{t(UI.methodTitle, lang)}</h2>
        <p className="text-muted">{t(UI.methodLead, lang)}</p>
        <ol className="list-decimal space-y-3 pl-5 text-base leading-relaxed">
          {UI.methodSteps.map((step, i) => (
            <li key={i}>{t(step, lang)}</li>
          ))}
        </ol>
        <p className="text-sm text-muted">{t(UI.disclaimer, lang)}</p>
      </div>
    </article>
  );
}
