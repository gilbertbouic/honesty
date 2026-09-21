import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Countdown } from "@/components/countdown";
import { GlassHouse } from "@/components/glass-house";
import { StreetStart } from "@/components/street-start";
import { Button } from "@/components/ui/button";
import { SEAT_META, UI } from "@/data/copy";
import { LIVE_DILEMMA } from "@/data/dilemmas";
import { HOUSES } from "@/data/houses";
import type { Seat } from "@/data/types";
import { competitionIsLive, deskIsOpen } from "@/lib/clock";
import { t } from "@/lib/i18n";
import { tiltCard, untiltCard, usePointerField } from "@/lib/pointer";
import { useLeague } from "@/lib/store";
import { useStory } from "@/lib/story";

export const Route = createFileRoute("/")({ component: Arena });

const SEATS: Seat[] = ["gallery", "service", "chamber", "mandate"];

function Arena() {
  const lang = useLeague((s) => s.lang);
  const [open, setOpen] = useState(false);
  const [live, setLive] = useState(false);
  const [showStreet, setShowStreet] = useState(true);
  const play = useStory("square", 3600);
  const field = usePointerField<HTMLDivElement>();
  const [veilOn, setVeilOn] = useState(false);

  useEffect(() => {
    const tick = () => {
      setOpen(deskIsOpen());
      setLive(competitionIsLive());
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("honesty-street-v2") === "1") setShowStreet(false);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!play) return;
    setVeilOn(true);
    const id = window.setTimeout(() => setVeilOn(false), 1500);
    return () => window.clearTimeout(id);
  }, [play]);

  if (showStreet) {
    return (
      <StreetStart
        onEnter={() => {
          try {
            sessionStorage.setItem("honesty-street-v2", "1");
          } catch {
            /* ignore */
          }
          setShowStreet(false);
        }}
      />
    );
  }

  return (
    <div ref={field} className="square" data-story={play ? "live" : "seen"}>
      <div className="daylight" aria-hidden="true" />
      {veilOn ? <div className="veil" aria-hidden="true" /> : null}

      <p className="ink ink-1 text-xs uppercase tracking-[0.28em] text-muted">{t(UI.actSquare, lang)}</p>
      <p className="ink ink-1 mt-2 text-xs uppercase tracking-[0.22em] text-muted">{t(UI.daylight, lang)}</p>
      <p className="objective ink ink-2 mt-5 text-foreground/90">
        {t(UI.objective, lang)}
      </p>

      <section className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_280px] lg:items-end">
        <div>
          <p className="ink ink-3 text-xs uppercase tracking-[0.22em] text-muted">
            {t(live ? UI.weekLive : UI.weekOpens, lang)}
          </p>
          <h1 className="week-headline live-headline ink ink-3 mt-3 max-w-3xl font-display tracking-tight">
            {t(LIVE_DILEMMA.headline, lang)}
          </h1>
          {open && !live ? (
            <p className="ink ink-4 mt-5 max-w-xl text-sm text-muted">{t(UI.rehearsal, lang)}</p>
          ) : null}
        </div>

        <aside className="ink ink-5 notice relative rounded-xl p-5">
          <div
            className="live-notice"
            onPointerMove={tiltCard}
            onPointerLeave={untiltCard}
          >
          <span className="stamp absolute right-2 top-2 sm:-right-2 sm:-top-3">
            {t(live ? UI.stampOpen : open ? UI.stampPractice : UI.stampClosed, lang)}
          </span>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            {t(live ? UI.closes : UI.opens, lang)}
          </p>
          <Countdown className="mt-4" />
          <p className="mt-4 text-xs text-muted">
            {t(live ? UI.closeWhen : UI.openWhen, lang)}
          </p>
          </div>
        </aside>
      </section>

      <section className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SEATS.map((seat, i) => {
          const houses = HOUSES.filter((h) => h.seat === seat).slice(0, 3);
          return (
            <div
              key={seat}
              className="seat-rise"
              style={{ animationDelay: `calc(var(--beat) * ${2200 + i * 160}ms)` }}
            >
              <div
                className="live-card rounded-xl border border-border bg-surface/80 p-4"
                onPointerMove={tiltCard}
                onPointerLeave={untiltCard}
              >
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                {t(SEAT_META[seat].kicker, lang)}
              </p>
              <h2 className="mt-1 font-display text-xl">{t(SEAT_META[seat].title, lang)}</h2>
              <div className="mt-4 flex min-w-0 items-end gap-1">
                {houses.map((h, hi) => (
                  <Link
                    key={h.id}
                    to="/houses/$id"
                    params={{ id: h.id }}
                    className="live-house block"
                  >
                    <GlassHouse
                      points={h.points}
                      emptyChair={h.emptyChair}
                      compact
                      thaw
                      thawDelay={`calc(var(--beat) * ${2680 + i * 160 + hi * 90}ms)`}
                    />
                  </Link>
                ))}
              </div>
              </div>
            </div>
          );
        })}
      </section>

      <div className="ink ink-6 mt-10 flex flex-wrap items-center gap-3">
        <Button asChild size="lg">
          <Link to="/play">{t(open ? UI.sit : UI.previewDesk, lang)}</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/houses">{t(UI.houses, lang)}</Link>
        </Button>
        <Link
          to="/methodology"
          className="text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
        >
          {t(UI.method, lang)}
        </Link>
      </div>
    </div>
  );
}
