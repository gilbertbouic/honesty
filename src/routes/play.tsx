import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { GlassHouse } from "@/components/glass-house";
import { SitDown } from "@/components/sit-down";
import { Button } from "@/components/ui/button";
import { BAND_META, SEAT_META, UI } from "@/data/copy";
import { CIRCUITS } from "@/data/circuits";
import { LIVE_DILEMMA } from "@/data/dilemmas";
import type { Band, Seat } from "@/data/types";
import { competitionIsLive, deskIsOpen } from "@/lib/clock";
import { t } from "@/lib/i18n";
import { parseHouseName } from "@/lib/phone";
import { scoreAnswer } from "@/lib/score";
import { useLeague } from "@/lib/store";
import { useStory } from "@/lib/story";
import { cn, wordCount } from "@/lib/utils";
import { variantFor } from "@/lib/variant";

export const Route = createFileRoute("/play")({ component: Play });

const SEATS: Seat[] = ["gallery", "service", "chamber", "mandate"];
const BANDS: Band[] = ["front-line", "middle", "senior"];

function Play() {
  const lang = useLeague((s) => s.lang);
  const seat = useLeague((s) => s.seat);
  const circuitId = useLeague((s) => s.circuitId);
  const band = useLeague((s) => s.band);
  const points = useLeague((s) => s.points);
  const handle = useLeague((s) => s.handle);
  const answers = useLeague((s) => s.answers);
  const setSeat = useLeague((s) => s.setSeat);
  const setCircuit = useLeague((s) => s.setCircuit);
  const setBand = useLeague((s) => s.setBand);
  const recordAnswer = useLeague((s) => s.recordAnswer);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [live, setLive] = useState(false);
  const playStory = useStory("desk", 1400);

  useEffect(() => {
    const tick = () => {
      setOpen(deskIsOpen());
      setLive(competitionIsLive());
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const already = answers.find((a) => a.dilemmaId === LIVE_DILEMMA.id);
  const variant = useMemo(() => variantFor(seat, circuitId), [seat, circuitId]);

  const [choiceId, setChoiceId] = useState(already?.choiceId ?? "");
  const [reason, setReason] = useState(already?.reason ?? "");
  const words = wordCount(reason);

  const circuitsForSeat =
    seat === "mandate"
      ? CIRCUITS.filter((c) => c.family === "mandate" || c.family === "shared")
      : seat === "service"
        ? CIRCUITS.filter((c) => c.family === "service" || c.family === "shared")
        : [];

  function submit() {
    if (!open || !choiceId || !seat || !parseHouseName(handle)) return;
    const scored = scoreAnswer({
      hasChoice: true,
      reason,
      band: seat === "service" || seat === "mandate" ? band : null,
    });
    recordAnswer({
      dilemmaId: LIVE_DILEMMA.id,
      week: LIVE_DILEMMA.week,
      circuitId: circuitId ?? seat,
      choiceId,
      reason,
      points: scored.points,
      at: new Date().toISOString(),
    });
    void navigate({ to: "/houses" });
  }

  return (
    <div className="square grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px]" data-story={playStory ? "live" : "seen"}>
      <div>
        <p className="ink ink-1 text-xs uppercase tracking-[0.2em] text-muted">{t(UI.actDesk, lang)}</p>
        <h1 className="week-headline ink ink-2 mt-2 font-display tracking-tight">{t(LIVE_DILEMMA.headline, lang)}</h1>
        {!open ? (
          <p className="ink ink-3 mt-4 max-w-xl text-sm text-muted">{t(UI.deskLocked, lang)}</p>
        ) : !live ? (
          <p className="ink ink-3 mt-4 max-w-xl text-sm text-muted">{t(UI.rehearsal, lang)}</p>
        ) : null}

        <SitDown />

        <div className="mt-8">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">{t(UI.chooseSeat, lang)}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SEATS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSeat(s)}
                className={cn(
                  "min-h-11 rounded-lg border border-border bg-surface px-3 py-3 text-left transition-colors duration-[var(--motion-quick)]",
                  seat === s && "border-glass-edge",
                )}
              >
                <span className="block font-display text-base">{t(SEAT_META[s].title, lang)}</span>
                <span className="mt-1 block text-xs text-muted">{t(SEAT_META[s].kicker, lang)}</span>
              </button>
            ))}
          </div>
        </div>

        {circuitsForSeat.length > 0 ? (
          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">{t(UI.circuits, lang)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {circuitsForSeat.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCircuit(c.id)}
                  className={cn(
                    "min-h-11 rounded-full border border-border px-3 text-sm text-muted",
                    circuitId === c.id && "border-glass-edge text-foreground",
                  )}
                >
                  {t(c.title, lang)}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {BANDS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBand(b)}
                  className={cn(
                    "min-h-11 rounded-md border border-border px-3 text-xs uppercase tracking-[0.12em] text-muted",
                    band === b && "border-glass-edge text-foreground",
                  )}
                >
                  {t(BAND_META[b], lang)}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {seat ? (
          <section key={`${seat}-${circuitId ?? ""}`} className="desk-sheet mt-10 space-y-6 rounded-xl border border-border bg-surface/90 p-5">
            <p className="max-w-2xl text-lg leading-relaxed text-foreground/90">
              {t(variant.prompt, lang)}
            </p>
            <div className="space-y-2">
              {variant.choices.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setChoiceId(c.id)}
                  className={cn(
                    "choice-in block w-full rounded-lg border border-border bg-background px-4 py-4 text-left text-sm leading-relaxed transition-colors duration-[var(--motion-quick)]",
                    choiceId === c.id && "border-glass-edge",
                  )}
                  style={{ animationDelay: `${120 + i * 90}ms` }}
                >
                  {t(c.label, lang)}
                </button>
              ))}
            </div>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.16em] text-muted">{t(UI.reason, lang)}</span>
              <span className="mt-1 block text-sm text-muted">{t(UI.reasonHint, lang)}</span>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={5}
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-3 text-base leading-relaxed text-foreground outline-none ring-ring focus:ring-2"
              />
              <span className="mt-1 block text-xs tabular-nums text-muted">
                {words} {t(UI.words, lang)} · {t(UI.wordMarks, lang)}
              </span>
            </label>
            <div>
              <Button size="lg" disabled={!open || !choiceId || !parseHouseName(handle)} onClick={submit}>
                {t(open ? UI.publicDesk : UI.weekOpens, lang)}
              </Button>
              {!parseHouseName(handle) ? (
                <p className="mt-2 text-sm text-muted">{t(UI.sitDownNeed, lang)}</p>
              ) : null}
            </div>
            {already ? (
              <p className="text-sm text-muted">
                {t(UI.points, lang)}: {already.points}
              </p>
            ) : null}
          </section>
        ) : null}
      </div>

      <aside className="hidden lg:block">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">{t(UI.yourHouse, lang)}</p>
        <GlassHouse points={points} className="mt-3" thaw />
        <p className="mt-2 font-mono text-sm tabular-nums">{points} HP</p>
        <p className="mt-3 text-xs text-muted">{t(UI.frost, lang)}</p>
      </aside>
    </div>
  );
}
