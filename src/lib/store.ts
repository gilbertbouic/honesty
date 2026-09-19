import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Band, Lang, SavedAnswer, Seat } from "@/data/types";

type State = {
  lang: Lang;
  seat: Seat | null;
  circuitId: string | null;
  band: Band | null;
  handle: string;
  answers: SavedAnswer[];
  points: number;
  setLang: (lang: Lang) => void;
  setSeat: (seat: Seat) => void;
  setCircuit: (id: string | null) => void;
  setBand: (band: Band | null) => void;
  setHandle: (handle: string) => void;
  recordAnswer: (answer: SavedAnswer) => void;
  resetPlay: () => void;
};

export const useLeague = create<State>()(
  persist(
    (set) => ({
      lang: "en",
      seat: null,
      circuitId: null,
      band: null,
      handle: "",
      answers: [],
      points: 0,
      setLang: (lang) => set({ lang }),
      setSeat: (seat) =>
        set({
          seat,
          circuitId: seat === "gallery" || seat === "chamber" ? seat : null,
        }),
      setCircuit: (circuitId) => set({ circuitId }),
      setBand: (band) => set({ band }),
      setHandle: (handle) => set({ handle }),
      recordAnswer: (answer) =>
        set((s) => ({
          answers: [...s.answers.filter((a) => a.dilemmaId !== answer.dilemmaId), answer],
          points: Math.round((s.points + answer.points) * 10) / 10,
        })),
      resetPlay: () =>
        set({
          seat: null,
          circuitId: null,
          band: null,
          answers: [],
          points: 0,
        }),
    }),
    { name: "honesty-league", skipHydration: true },
  ),
);

export function rehydrateLeague() {
  void useLeague.persist.rehydrate();
}
