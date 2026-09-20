import { UI } from "@/data/copy";
import { t } from "@/lib/i18n";
import { useLeague } from "@/lib/store";
import { useState } from "react";

const WINDOWS = [
  { id: "1", l: "13.6%", t: "33.4%", w: "8.4%", h: "11.2%" },
  { id: "2", l: "26.8%", t: "33.4%", w: "8.6%", h: "11.2%" },
  { id: "3", l: "13.8%", t: "51.8%", w: "8.6%", h: "13.6%" },
  { id: "4", l: "54.6%", t: "35.8%", w: "8.4%", h: "11.0%" },
  { id: "5", l: "68.0%", t: "35.8%", w: "8.8%", h: "11.0%" },
  { id: "6", l: "54.6%", t: "52.6%", w: "8.4%", h: "13.2%" },
] as const;

type StreetStartProps = {
  onEnter: () => void;
};

export function StreetStart({ onEnter }: StreetStartProps) {
  const lang = useLeague((s) => s.lang);
  const [status, setStatus] = useState(t(UI.streetStatus, lang));
  const [open, setOpen] = useState(false);

  return (
    <div className="cinema">
      <div className="cinema-stage">
        <div className="cinema-frame">
          <img
            className="cinema-plate"
            src="/brand/street-16x9.jpg"
            alt={t(UI.streetKicker, lang)}
          />
          <div className="cinema-grade" aria-hidden="true" />

          {WINDOWS.map((pane) => (
            <button
              key={pane.id}
              type="button"
              className="cinema-pane"
              style={{ left: pane.l, top: pane.t, width: pane.w, height: pane.h }}
              aria-label={`${t(UI.streetHover, lang)} ${pane.id}`}
              onPointerEnter={() => setStatus(t(UI.streetHover, lang))}
            />
          ))}

          <div
            className="cinema-pane cinema-enter-pane"
            style={{ left: "27.6%", top: "49.4%", width: "9.2%", height: "22.4%" }}
            onPointerEnter={() => {
              setOpen(true);
              setStatus(t(UI.streetReady, lang));
            }}
            onPointerLeave={() => setOpen(false)}
          >
            <button
              type="button"
              className={open ? "cinema-enter is-out" : "cinema-enter"}
              onClick={onEnter}
            >
              <span className="cinema-enter-plate">{t(UI.enter, lang)}</span>
            </button>
          </div>
        </div>
      </div>

      <aside className="cinema-card">
        <p className="cinema-kicker">{t(UI.streetKicker, lang)}</p>
        <h1>{t(UI.streetLead, lang)}</h1>
        <p>{t(UI.streetFrost, lang)}</p>
        <p>{t(UI.streetDoor, lang)}</p>
        <p className="cinema-status">{status}</p>
      </aside>
    </div>
  );
}
