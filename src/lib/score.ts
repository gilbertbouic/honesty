import { wordCount } from "@/lib/utils";
import type { Band } from "@/data/types";

const BAND_MOD: Record<Band, number> = {
  "front-line": 1,
  middle: 1.15,
  senior: 1.35,
};

const PUBLIC = 1.5;

export type ScoreInput = {
  hasChoice: boolean;
  reason: string;
  band?: Band | null;
  contradicted?: boolean;
};

export type ScoreResult = {
  points: number;
  breakdown: { label: string; value: number }[];
};

export function scoreAnswer(input: ScoreInput): ScoreResult {
  const breakdown: { label: string; value: number }[] = [];
  if (!input.hasChoice) {
    return { points: 0, breakdown: [{ label: "No rule named", value: 0 }] };
  }

  let base = 10;
  breakdown.push({ label: "Declared rule", value: 10 });

  const words = wordCount(input.reason);
  if (words >= 40) {
    base += 5;
    breakdown.push({ label: "Written reason", value: 5 });
  } else if (words >= 12) {
    base += 2;
    breakdown.push({ label: "Short reason", value: 2 });
  }

  breakdown.push({ label: "Public desk", value: PUBLIC });

  const band = input.band ? BAND_MOD[input.band] : 1;
  if (input.band && band !== 1) {
    breakdown.push({ label: `Band ${input.band}`, value: band });
  }

  let points = base * PUBLIC * band;
  if (input.contradicted) {
    points -= 12;
    breakdown.push({ label: "Unexplained contradiction", value: -12 });
  }

  return { points: Math.max(0, Math.round(points * 10) / 10), breakdown };
}

export function frostFromPoints(points: number): number {
  const clamped = Math.min(100, Math.max(0, points));
  return 1 - clamped / 100;
}
