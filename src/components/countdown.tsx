import { useEffect, useState } from "react";
import { LIVE_DILEMMA } from "@/data/dilemmas";
import { cn } from "@/lib/utils";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    sec: s % 60,
  };
}

export function Countdown({ className }: { className?: string }) {
  const close = new Date(LIVE_DILEMMA.closesAt).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const p = now === null ? { d: 0, h: 0, m: 0, sec: 0 } : parts(close - now);

  return (
    <div className={cn("flex items-end gap-3 font-mono tabular-nums", className)}>
      <Unit n={p.d} label="d" />
      <Unit n={p.h} label="h" />
      <Unit n={p.m} label="m" />
      <Unit n={p.sec} label="s" />
    </div>
  );
}

function Unit({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xl leading-none text-foreground sm:text-2xl">
        {String(n).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted">{label}</span>
    </div>
  );
}
