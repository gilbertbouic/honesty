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
import { useLeague } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Arena });

const SEATS: Seat[] = ["gallery", "service", "chamber", "mandate"];

function Arena() {
  const lang = useLeague((s) => s.lang);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const tick = () => setOpen(deskIsOpen());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted">
            {t(open ? UI.weekLive : UI.weekOpens, lang)}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
            {t(LIVE_DILEMMA.headline, lang)}
          </h1>
          <p className="mt-4 max-w-xl text-muted">{t(UI.tag, lang)}</p>
          {!open ? <p className="mt-3 max-w-xl text-sm text-muted">{t(UI.rehearsal, lang)}</p> : null}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link to="/play">{t(open ? UI.sit : UI.previewDesk, lang)}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/houses">{t(UI.houses, lang)}</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            {t(open ? UI.closes : UI.opens, lang)}
          </p>
          <Countdown className="mt-4" />
          <p className="mt-4 text-xs text-muted">
            {open ? "Friday 16:00 · Mauritius" : "Friday 25 September · 09:00 Mauritius"}
          </p>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SEATS.map((seat) => {
          const houses = HOUSES.filter((h) => h.seat === seat).slice(0, 3);
          return (
            <div key={seat} className="rounded-xl border border-border bg-surface/60 p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                {t(SEAT_META[seat].kicker, lang)}
              </p>
              <h2 className="mt-1 font-display text-xl">{t(SEAT_META[seat].title, lang)}</h2>
              <div className="mt-4 flex items-end gap-1">
                {houses.map((h) => (
                  <Link key={h.id} to="/houses/$id" params={{ id: h.id }} className="block">
                    <GlassHouse points={h.points} emptyChair={h.emptyChair} compact />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
