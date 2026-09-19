import { LIVE_DILEMMA } from "@/data/dilemmas";

export function opensAtMs() {
  return new Date(LIVE_DILEMMA.opensAt).getTime();
}

export function closesAtMs() {
  return new Date(LIVE_DILEMMA.closesAt).getTime();
}

export function deskIsOpen(now = Date.now()) {
  return now >= opensAtMs();
}

export function countdownTarget(now = Date.now()) {
  return now < opensAtMs() ? opensAtMs() : closesAtMs();
}
