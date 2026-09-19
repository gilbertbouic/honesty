import { HOUSES } from "@/data/houses";
import type { HouseRecord } from "@/data/types";

export const HONEST_RANKS = 3;
export const HONEST_LINE = "I scored as HONEST with Mkweli";

export function leagueField(self: HouseRecord | null): HouseRecord[] {
  return self ? [self, ...HOUSES.filter((h) => h.id !== self.id)] : HOUSES;
}

export function sittingRanked(field: HouseRecord[]): HouseRecord[] {
  return [...field]
    .filter((h) => !h.emptyChair && h.points > 0)
    .sort((a, b) => b.points - a.points);
}

export function honestCutoff(field: HouseRecord[]): number {
  const ranked = sittingRanked(field);
  if (ranked.length === 0) return Number.POSITIVE_INFINITY;
  const index = Math.min(HONEST_RANKS, ranked.length) - 1;
  return ranked[index].points;
}

export function isHonestMark(house: HouseRecord, field: HouseRecord[]): boolean {
  if (house.emptyChair || house.points <= 0) return false;
  return house.points >= honestCutoff(field);
}

export function honestPayload(house: HouseRecord): string {
  return [HONEST_LINE, house.handle, `${house.points} HP · Honesty League`, "mkweli.tech"].join("\n");
}
