import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Countdown } from "@/components/countdown";
import { GlassHouse } from "@/components/glass-house";
import { Button } from "@/components/ui/button";
import { SEAT_META, UI } from "@/data/copy";
import { LIVE_DILEMMA } from "@/data/dilemmas";
import { HOUSES } from "@/data/houses";
import type { Seat } from "@/data/types";
import { deskIsOpen } from "@/lib/clock";
import { t } from "@/lib/i18n";
import { tiltCard, untiltCard, usePointerField } from "@/lib/pointer";
import { useLeague } from "@/lib/store";
import { useStory } from "@/lib/story";

export const Route = createFileRoute("/")({ component: Arena });

const SEATS: Seat[] = ["gallery", "service", "chamber", "mandate"];

function Arena() {
  const lang = useLeague((s) => s.lang);
  const [open, setOpen] = useState(false);
  const play = useStory("square", 3600);
  const field = usePointerField<HTMLDivElement>();

  useEffect(() => {
    const tick = () => setOpen(deskIsOpen());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div ref={field} className="square" data-story={play ? "live" : "seen"}>
      <div className="daylight" aria-hidden="true" />
      {play ? <div className="veil" aria-hidden="true" /> : null}

      <p className="ink ink-1 text-xs uppercase tracking-[0.28em] text-muted">{t(UI.actSquare, lang)}</p>
      <p className="ink ink-1 mt-2 text-xs uppercase tracking-[0.22em] text-muted">{t(UI.daylight, lang)}</p>
      <p className="ink ink-2 mt-5 max-w-xl font-display text-2xl italic leading-snug text-foreground/80 sm:text-3xl">
        {t(UI.silence, lang)}
      </p>

      <section className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_280px] lg:items-end">
        <div>
          <p className="ink ink-3 text-xs uppercase tracking-[0.22em] text-muted">
            {t(open ? UI.weekLive : UI.weekOpens, lang)}
          </p>
          <h1 className="live-headline ink ink-3 mt-3 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
            {t(LIVE_DILEMMA.headline, lang)}
          </h1>
          <p className="ink ink-4 mt-5 max-w-xl text-lg text-muted">{t(UI.tag, lang)}</p>
          {!open ? (
            <p className="ink ink-4 mt-3 max-w-xl text-sm text-muted">{t(UI.rehearsal, lang)}</p>
          ) : null}
        </div>

        <aside className="ink ink-5 notice relative rounded-xl p-5">
          <div
            className="live-notice"
            onPointerMove={tiltCard}
            onPointerLeave={untiltCard}
          >
          <span className="stamp absolute -right-2 -top-3">{t(open ? UI.stampOpen : UI.stampClosed, lang)}</span>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            {t(open ? UI.closes : UI.opens, lang)}
          </p>
          <Countdown className="mt-4" />
          <p className="mt-4 text-xs text-muted">
            {open ? "Friday 16:00 · Mauritius" : "Friday 25 September · 09:00 Mauritius"}
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
              <div className="mt-4 flex items-end gap-1">
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
      </div>
    </div>
  );
}
