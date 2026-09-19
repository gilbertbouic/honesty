import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassHouse } from "@/components/glass-house";
import { HonestQr } from "@/components/honest-qr";
import { SEAT_META, UI } from "@/data/copy";
import { CIRCUITS } from "@/data/circuits";
import type { HouseRecord } from "@/data/types";
import { t } from "@/lib/i18n";
import { isHonestMark, leagueField } from "@/lib/honest-mark";
import { useLeague } from "@/lib/store";

export const Route = createFileRoute("/houses/$id")({ component: HouseDetail });

function HouseDetail() {
  const { id } = Route.useParams();
  const lang = useLeague((s) => s.lang);
  const points = useLeague((s) => s.points);
  const seat = useLeague((s) => s.seat);
  const handle = useLeague((s) => s.handle);
  const answers = useLeague((s) => s.answers);
  const circuitId = useLeague((s) => s.circuitId);

  const last = answers.at(-1);
  const self: HouseRecord | null =
    answers.length || points
      ? {
          id: "self",
          handle: handle || (lang === "fr" ? "Vous" : "You"),
          seat: seat ?? "gallery",
          circuitId: circuitId ?? undefined,
          points,
          lastChoice: last?.choiceId,
          lastReason: last ? { en: last.reason, fr: last.reason } : undefined,
        }
      : null;

  const field = leagueField(self);
  const house = field.find((h) => h.id === id);
  if (!house) {
    return (
      <div>
        <h1 className="font-display text-3xl">Unknown house</h1>
        <Link to="/houses" className="mt-4 inline-block text-sm text-muted">
          {t(UI.houses, lang)}
        </Link>
      </div>
    );
  }

  const circuit = CIRCUITS.find((c) => c.id === house.circuitId);
  const honest = isHonestMark(house, field);

  return (
    <div className="grid gap-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
      <GlassHouse points={house.points} emptyChair={house.emptyChair} />
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          {t(SEAT_META[house.seat].title, lang)}
          {house.emptyChair ? ` · ${t(UI.empty, lang)}` : ""}
          {honest ? ` · ${t(UI.honestMark, lang)}` : ""}
        </p>
        <h1 className="mt-2 font-display text-4xl">{house.handle}</h1>
        {house.body ? <p className="mt-2 text-muted">{house.body}</p> : null}
        {circuit ? <p className="mt-1 text-sm text-muted">{t(circuit.title, lang)}</p> : null}
        <p className="mt-6 font-mono text-3xl tabular-nums">{house.points} HP</p>
        {house.lastReason ? (
          <blockquote className="mt-6 max-w-xl border-l border-glass-edge pl-4 text-sm leading-relaxed text-foreground/85">
            {t(house.lastReason, lang)}
          </blockquote>
        ) : house.emptyChair ? (
          <p className="mt-6 text-sm text-muted">{t(UI.empty, lang)}</p>
        ) : null}
        {honest ? <HonestQr house={house} lang={lang} /> : null}
        <Link to="/houses" className="mt-8 inline-block text-sm text-muted hover:text-foreground">
          {t(UI.houses, lang)}
        </Link>
      </div>
    </div>
  );
}
