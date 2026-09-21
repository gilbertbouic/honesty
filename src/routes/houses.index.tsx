import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { GlassHouse } from "@/components/glass-house";
import { SEAT_META, UI } from "@/data/copy";
import type { HouseRecord, Seat } from "@/data/types";
import { t } from "@/lib/i18n";
import { isHonestMark, leagueField } from "@/lib/honest-mark";
import { competitionIsLive, deskIsOpen } from "@/lib/clock";
import { useLeague } from "@/lib/store";
import { useStory } from "@/lib/story";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/houses/")({ component: HousesPage });

function HousesPage() {
  const lang = useLeague((s) => s.lang);
  const points = useLeague((s) => s.points);
  const seat = useLeague((s) => s.seat);
  const handle = useLeague((s) => s.handle);
  const answers = useLeague((s) => s.answers);
  const [filter, setFilter] = useState<Seat | "all">("all");
  const [open, setOpen] = useState(true);
  const [live, setLive] = useState(false);
  const playStory = useStory("street", 1600);

  useEffect(() => {
    const tick = () => {
      setOpen(deskIsOpen());
      setLive(competitionIsLive());
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const field = useMemo(() => {
    const self: HouseRecord | null =
      answers.length || points
        ? {
            id: "self",
            handle: handle || (lang === "fr" ? "Vous" : "You"),
            seat: seat ?? "gallery",
            points,
            emptyChair: false,
          }
        : null;
    return leagueField(self);
  }, [answers.length, handle, lang, points, seat]);

  const list = useMemo(() => {
    const filtered = filter === "all" ? field : field.filter((h) => h.seat === filter);
    return [...filtered].sort((a, b) => b.points - a.points);
  }, [field, filter]);

  return (
    <div className="square" data-story={playStory ? "live" : "seen"}>
      <p className="ink ink-1 text-xs uppercase tracking-[0.2em] text-muted">{t(UI.actStreet, lang)}</p>
      <h1 className="ink ink-2 mt-2 font-display text-3xl sm:text-4xl">{t(UI.points, lang)}</h1>
      <p className="ink ink-3 mt-3 max-w-xl text-sm text-muted">{t(UI.honestHint, lang)}</p>
      {open && !live ? <p className="ink ink-3 mt-2 max-w-xl text-sm text-muted">{t(UI.rehearsal, lang)}</p> : null}
      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", "gallery", "service", "chamber", "mandate"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={cn(
              "min-h-11 rounded-full border border-border px-3 text-sm text-muted",
              filter === s && "border-glass-edge text-foreground",
            )}
          >
            {s === "all" ? (lang === "fr" ? "Tous" : "All") : t(SEAT_META[s].title, lang)}
          </button>
        ))}
      </div>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((h, i) => {
          const honest = isHonestMark(h, field);
          return (
            <li
              key={h.id}
              className="seat-rise"
              style={{ animationDelay: `calc(var(--beat) * ${400 + i * 70}ms)` }}
            >
              <Link
                to="/houses/$id"
                params={{ id: h.id }}
                className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4"
              >
                <GlassHouse
                  points={h.points}
                  emptyChair={h.emptyChair}
                  compact
                  thaw
                  thawDelay={`calc(var(--beat) * ${520 + i * 70}ms)`}
                />
                <div className="min-w-0">
                  <p className="truncate font-display text-lg">{h.handle}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted">
                    {t(SEAT_META[h.seat].title, lang)}
                    {h.emptyChair ? ` · ${t(UI.empty, lang)}` : ""}
                    {honest ? ` · ${t(UI.honestMark, lang)}` : ""}
                  </p>
                  <p className="mt-1 font-mono text-sm tabular-nums">{h.points} HP</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
