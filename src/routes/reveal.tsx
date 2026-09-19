import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassHouse } from "@/components/glass-house";
import { SEAT_META, UI } from "@/data/copy";
import { HOUSES } from "@/data/houses";
import { LIVE_DILEMMA } from "@/data/dilemmas";
import type { Seat } from "@/data/types";
import { t } from "@/lib/i18n";
import { useLeague } from "@/lib/store";

export const Route = createFileRoute("/reveal")({ component: Reveal });

const ORDER: Seat[] = ["gallery", "service", "chamber", "mandate"];

function Reveal() {
  const lang = useLeague((s) => s.lang);
  const answers = useLeague((s) => s.answers);
  const mine = answers.find((a) => a.dilemmaId === LIVE_DILEMMA.id);

  const bySeat = ORDER.map((seat) => {
    const list = HOUSES.filter((h) => h.seat === seat);
    const empty = list.filter((h) => h.emptyChair).length;
    const avg = list.length
      ? Math.round(list.reduce((s, h) => s + h.points, 0) / list.length)
      : 0;
    return { seat, empty, avg, sample: list[0] };
  });

  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted">{t(UI.reveal, lang)}</p>
        <h1 className="mt-2 font-display text-3xl sm:text-5xl">{t(LIVE_DILEMMA.headline, lang)}</h1>
        <p className="mt-3 max-w-xl text-muted">{t(UI.revealLead, lang)}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {bySeat.map((row) => (
          <div key={row.seat} className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              {t(SEAT_META[row.seat].title, lang)}
            </p>
            <p className="mt-2 font-mono text-3xl tabular-nums">{row.avg}</p>
            <p className="text-xs text-muted">
              {row.empty} {t(UI.empty, lang).toLowerCase()}
            </p>
            {row.sample ? (
              <GlassHouse
                points={row.sample.points}
                emptyChair={row.sample.emptyChair}
                compact
                className="mt-2"
              />
            ) : null}
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-border p-5">
        <h2 className="font-display text-2xl">{t(UI.shadow, lang)}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          {lang === "fr"
            ? "Les gens comme vous ont souvent demandé un nouvel appel d’offres. Le bureau PNUD s’est retiré du dossier. Le ministre des Travaux n’a pas répondu."
            : "People like you often asked for a new call for bids. The UNDP office stepped aside. The Minister of Works did not answer."}
        </p>
        {mine ? (
          <p className="mt-4 text-sm">
            {lang === "fr" ? "Votre règle cette semaine :" : "Your rule this week:"}{" "}
            <span className="text-foreground">{mine.choiceId}</span> · {mine.points} HP
          </p>
        ) : (
          <Link to="/play" className="mt-4 inline-block text-sm text-primary">
            {t(UI.sit, lang)}
          </Link>
        )}
      </section>
    </div>
  );
}
