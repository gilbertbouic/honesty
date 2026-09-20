import { UI } from "@/data/copy";
import { t } from "@/lib/i18n";
import { useLeague } from "@/lib/store";
import { useState } from "react";

const WINDOWS = [
  { id: "1", l: "16.2%", t: "36.2%", w: "7.2%", h: "10.4%" },
  { id: "2", l: "29.0%", t: "36.2%", w: "7.2%", h: "10.4%" },
  { id: "3", l: "16.0%", t: "52.4%", w: "7.4%", h: "12.2%" },
  { id: "4", l: "55.2%", t: "37.6%", w: "7.4%", h: "10.6%" },
  { id: "5", l: "69.4%", t: "37.6%", w: "7.8%", h: "10.6%" },
  { id: "6", l: "55.2%", t: "53.2%", w: "7.4%", h: "12.0%" },
] as const;

type StreetStartProps = {
  onEnter: () => void;
};

export function StreetStart({ onEnter }: StreetStartProps) {
  const lang = useLeague((s) => s.lang);
  const [status, setStatus] = useState(t(UI.streetStatus, lang));
  const [open, setOpen] = useState(false);
  const [sky, setSky] = useState(false);
  const [lamp, setLamp] = useState(false);
  const [cloud, setCloud] = useState({ x: 0, y: 0 });

  return (
    <div className="cinema">
      <div className="cinema-stage">
        <div
          className="cinema-frame"
          data-sky={sky ? "on" : "off"}
          data-lamp={lamp ? "on" : "off"}
          style={{
            ["--cloud-x" as string]: `${cloud.x.toFixed(1)}px`,
            ["--cloud-y" as string]: `${cloud.y.toFixed(1)}px`,
          }}
        >
          <img
            className="cinema-plate"
            src="/brand/street-16x9.jpg"
            alt={t(UI.streetKicker, lang)}
            draggable={false}
          />

          <svg className="cinema-clouds" viewBox="0 0 1600 420" aria-hidden="true">
            <g className="cloud-drift cloud-a">
              <ellipse cx="180" cy="70" rx="140" ry="38" />
              <ellipse cx="280" cy="82" rx="100" ry="32" />
              <ellipse cx="90" cy="88" rx="80" ry="26" />
            </g>
            <g className="cloud-drift cloud-b">
              <ellipse cx="720" cy="48" rx="160" ry="36" />
              <ellipse cx="840" cy="62" rx="110" ry="28" />
              <ellipse cx="640" cy="66" rx="90" ry="24" />
            </g>
            <g className="cloud-drift cloud-c">
              <ellipse cx="1280" cy="80" rx="150" ry="40" />
              <ellipse cx="1400" cy="92" rx="95" ry="30" />
              <ellipse cx="1180" cy="96" rx="88" ry="26" />
            </g>
          </svg>

          <button
            type="button"
            className="cinema-sky"
            aria-label={t(UI.streetSky, lang)}
            onPointerEnter={() => {
              setSky(true);
              setStatus(t(UI.streetSky, lang));
            }}
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setCloud({
                x: ((e.clientX - r.left) / r.width - 0.5) * 80,
                y: ((e.clientY - r.top) / r.height - 0.5) * 28,
              });
            }}
            onPointerLeave={() => {
              setSky(false);
              setCloud({ x: 0, y: 0 });
            }}
          />

          <button type="button" className="cinema-roof cinema-roof-l">
            Honesty
          </button>
          <button type="button" className="cinema-roof cinema-roof-r">
            League
          </button>

          {WINDOWS.map((pane) => (
            <button
              key={pane.id}
              type="button"
              className="cinema-pane"
              style={{ left: pane.l, top: pane.t, width: pane.w, height: pane.h }}
              aria-label={t(UI.streetHover, lang)}
              onPointerEnter={() => setStatus(t(UI.streetHover, lang))}
            />
          ))}

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
