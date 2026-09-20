import { UI } from "@/data/copy";
import { t } from "@/lib/i18n";
import { useLeague } from "@/lib/store";
import { useState } from "react";

type StreetStartProps = {
  onEnter: () => void;
};

export function StreetStart({ onEnter }: StreetStartProps) {
  const lang = useLeague((s) => s.lang);
  const [status, setStatus] = useState(t(UI.streetStatus, lang));
  const [open, setOpen] = useState(false);
  const [lamp, setLamp] = useState(false);

  return (
    <div className="cinema">
      <div className="cinema-stage">
        <div className="cinema-frame" data-lamp={lamp ? "on" : "off"}>
          <img
            className="cinema-plate"
            src="/brand/street-16x9.jpg"
            alt={t(UI.streetKicker, lang)}
            draggable={false}
          />

          <button type="button" className="cinema-roof cinema-roof-l">
            Honesty
          </button>
          <button type="button" className="cinema-roof cinema-roof-r">
            League
          </button>

          <div className="cinema-lamp-glow" aria-hidden="true" />
          <button
            type="button"
            className="cinema-lamp"
            aria-label={t(UI.streetLamp, lang)}
            onPointerEnter={() => {
              setLamp(true);
              setStatus(t(UI.streetLamp, lang));
            }}
            onPointerLeave={() => setLamp(false)}
          />

          <div
            className="cinema-hut"
            onPointerEnter={() => {
              setOpen(true);
              setLamp(true);
              setStatus(t(UI.streetReady, lang));
            }}
            onPointerLeave={() => {
              setOpen(false);
              setLamp(false);
            }}
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

      <p className="cinema-caption">{status}</p>
    </div>
  );
}
