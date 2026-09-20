import { UI } from "@/data/copy";
import { t } from "@/lib/i18n";
import { useLeague } from "@/lib/store";
import { useState } from "react";

type StreetStartProps = {
  onEnter: () => void;
};

export function StreetStart({ onEnter }: StreetStartProps) {
  const lang = useLeague((s) => s.lang);
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
            aria-label={t(UI.streetKicker, lang)}
            onPointerEnter={() => setLamp(true)}
            onPointerLeave={() => setLamp(false)}
          />

          <button
            type="button"
            className="cinema-dog"
            aria-label={t(UI.enter, lang)}
            onPointerEnter={() => setOpen(true)}
            onPointerLeave={() => setOpen(false)}
            onClick={onEnter}
          >
            <span className={open ? "cinema-enter is-out" : "cinema-enter"}>
              <span className="cinema-enter-plate">{t(UI.enter, lang)}</span>
            </span>
          </button>
        </div>
      </div>

      <p className="cinema-caption">{t(UI.streetHint, lang)}</p>
    </div>
  );
}
