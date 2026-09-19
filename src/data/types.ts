export type Lang = "en" | "fr";
export type Seat = "gallery" | "service" | "chamber" | "mandate";
export type Band = "front-line" | "middle" | "senior";

export type Copy = { en: string; fr: string };

export type Circuit = {
  id: string;
  family: "service" | "mandate" | "shared";
  title: Copy;
  why: Copy;
};

export type Choice = { id: string; label: Copy };

export type DilemmaVariant = {
  circuitId: string;
  prompt: Copy;
  choices: Choice[];
};

export type Dilemma = {
  id: string;
  week: number;
  headline: Copy;
  opensAt: string;
  closesAt: string;
  variants: DilemmaVariant[];
};

export type HouseRecord = {
  id: string;
  handle: string;
  seat: Seat;
  circuitId?: string;
  band?: Band;
  body?: string;
  points: number;
  emptyChair?: boolean;
  lastChoice?: string;
  lastReason?: Copy;
};

export type SavedAnswer = {
  dilemmaId: string;
  week: number;
  circuitId: string;
  choiceId: string;
  reason: string;
  points: number;
  at: string;
};
