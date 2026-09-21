import { LIVE_DILEMMA } from "@/data/dilemmas";

export function opensAtMs() {
  return new Date(LIVE_DILEMMA.opensAt).getTime();
}

export function closesAtMs() {
  return new Date(LIVE_DILEMMA.closesAt).getTime();
}

export function competitionIsLive(now = Date.now()) {
  return now >= opensAtMs() && now < closesAtMs();
}

/** Testers can answer now; the month 1 window ends at close. */
export function deskIsOpen(now = Date.now()) {
  return now < closesAtMs();
}

export function countdownTarget(now = Date.now()) {
  return now < opensAtMs() ? opensAtMs() : closesAtMs();
}
