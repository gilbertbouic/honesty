import { useId } from "react";
import { frostFromPoints } from "@/lib/score";
import { cn } from "@/lib/utils";

type Props = {
  points: number;
  emptyChair?: boolean;
  compact?: boolean;
  className?: string;
};

export function GlassHouse({ points, emptyChair, compact, className }: Props) {
  const uid = useId().replace(/:/g, "");
  const frost = emptyChair ? 0.92 : frostFromPoints(points);
  const clear = 1 - frost;
  const size = compact ? 88 : 140;

  return (
    <svg
      viewBox="0 0 80 108"
      width={size}
      height={size * 1.35}
      className={cn("overflow-visible", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-pane`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--color-glass)" stopOpacity={0.2 + clear * 0.55} />
          <stop offset="100%" stopColor="var(--color-glass)" stopOpacity={0.06 + clear * 0.25} />
        </linearGradient>
      </defs>
      <polygon
        points="8,40 40,10 72,40"
        fill="none"
        stroke="var(--color-glass-edge)"
        strokeWidth="1.4"
      />
      <rect
        x="14"
        y="40"
        width="52"
        height="50"
        fill={`url(#${uid}-pane)`}
        stroke="var(--color-glass-edge)"
        strokeWidth="1.4"
      />
      <rect
        x="14"
        y="40"
        width="52"
        height="50"
        fill="var(--color-fog)"
        opacity={frost * 0.72}
        style={{ transition: "opacity var(--motion-slow) var(--ease-smooth-out)" }}
      />
      <Window x={22} y={48} boarded={emptyChair} frost={frost} />
      <Window x={46} y={48} boarded={emptyChair} frost={frost} />
      <rect
        x="36"
        y="70"
        width="8"
        height="20"
        fill="none"
        stroke="var(--color-glass-edge)"
        strokeWidth="1.2"
      />
      {emptyChair ? (
        <g stroke="var(--color-muted)" strokeWidth="1.2" fill="none">
          <rect x="34" y="78" width="12" height="8" />
          <line x1="36" y1="78" x2="36" y2="92" />
          <line x1="44" y1="78" x2="44" y2="92" />
        </g>
      ) : null}
    </svg>
  );
}

function Window({
  x,
  y,
  boarded,
  frost,
}: {
  x: number;
  y: number;
  boarded?: boolean;
  frost: number;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width="12"
        height="14"
        fill="var(--color-glass)"
        fillOpacity={0.15 + (1 - frost) * 0.4}
        stroke="var(--color-glass-edge)"
        strokeWidth="0.9"
      />
      {boarded ? (
        <g stroke="var(--color-muted)" strokeWidth="1">
          <line x1={x} y1={y} x2={x + 12} y2={y + 14} />
          <line x1={x + 12} y1={y} x2={x} y2={y + 14} />
        </g>
      ) : null}
    </g>
  );
}
