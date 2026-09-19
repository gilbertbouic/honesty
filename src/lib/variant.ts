import { LIVE_DILEMMA } from "@/data/dilemmas";
import type { DilemmaVariant, Seat } from "@/data/types";

export function variantFor(seat: Seat | null, circuitId: string | null): DilemmaVariant {
  const variants = LIVE_DILEMMA.variants;
  if (seat === "chamber") {
    return variants.find((v) => v.circuitId === "chamber") ?? variants[0];
  }
  if (circuitId) {
    return variants.find((v) => v.circuitId === circuitId) ?? variants[0];
  }
  return variants[0];
}
