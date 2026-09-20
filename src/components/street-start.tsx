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

  return (
    <div className="cinema">
      <div className="cinema-stage">
        <div className="cinema-frame" data-lamp={open ? "on" : "off"}>
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

          <div
            className="cinema-alley"
            onPointerEnter={() => setOpen(true)}
            onPointerLeave={() => setOpen(false)}
          >
            <button
              type="button"
              className={open ? "cinema-enter is-out" : "cinema-enter"}
              aria-label={t(UI.enter, lang)}
              onClick={onEnter}
            >
              <span className="cinema-enter-plate">{t(UI.enter, lang)}</span>
            </button>
          </div>
        </div>
      </div>

      <aside className="cinema-card">
        <p className="cinema-kicker">{t(UI.streetKicker, lang)}</p>
        <p>{t(UI.streetHint, lang)}</p>
      </aside>
    </div>
  );
}
