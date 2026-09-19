import { createFileRoute, Link } from "@tanstack/react-router";
import { UI } from "@/data/copy";
import { CIRCUITS } from "@/data/circuits";
import { HOUSES } from "@/data/houses";
import { t } from "@/lib/i18n";
import { useLeague } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/circuits")({ component: CircuitsPage });

function CircuitsPage() {
  const lang = useLeague((s) => s.lang);
  const setSeat = useLeague((s) => s.setSeat);
  const setCircuit = useLeague((s) => s.setCircuit);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{t(UI.circuits, lang)}</p>
      <h1 className="mt-2 max-w-2xl font-display text-3xl sm:text-4xl">
        {lang === "fr"
          ? "Le risque est dans la fonction, pas dans le titre."
          : "Risk sits in the function, not the job title."}
      </h1>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {CIRCUITS.map((c) => {
          const n = HOUSES.filter((h) => h.circuitId === c.id).length;
          const empty = HOUSES.filter((h) => h.circuitId === c.id && h.emptyChair).length;
          return (
            <li key={c.id}>
              <Link
                to="/play"
                onClick={() => {
                  setSeat(c.family === "mandate" ? "mandate" : "service");
                  setCircuit(c.id);
                }}
                className="block rounded-xl border border-border bg-surface p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted">{c.family}</p>
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      empty ? "bg-danger" : n ? "bg-primary" : "bg-muted",
                    )}
                  />
                </div>
                <h2 className="mt-2 font-display text-xl">{t(c.title, lang)}</h2>
                <p className="mt-2 text-sm text-muted">{t(c.why, lang)}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
