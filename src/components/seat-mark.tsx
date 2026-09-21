import type { Seat } from "@/data/types";

const MARKS: Record<Exclude<Seat, "gallery" | "mandate">, string[]> = {
  service: ["M5 11 h22 v12 h-22 z", "M5 16 h22", "M16 11 v12"],
  chamber: ["M11 6 h10 v8 h-10 z", "M8 14 h16 v6 h-16 z", "M11 20 v6", "M21 20 v6"],
};

export function SeatMark({
  seat,
  delay,
}: {
  seat: Seat;
  delay?: string;
}) {
  return (
    <svg
      className="seat-mark"
      viewBox="0 0 32 32"
      width="32"
      height="32"
      aria-hidden="true"
      style={{ animationDelay: delay }}
    >
      {seat === "gallery" ? (
        <>
          <circle pathLength="1" cx="8" cy="10" r="2.2" />
          <path pathLength="1" d="M5 22 Q8 14 11 22" />
          <circle pathLength="1" cx="16" cy="9" r="2.5" />
          <path pathLength="1" d="M12 22 Q16 13 20 22" />
          <circle pathLength="1" cx="24" cy="10" r="2.2" />
          <path pathLength="1" d="M21 22 Q24 14 27 22" />
        </>
      ) : seat === "mandate" ? (
        <>
          <circle pathLength="1" cx="16" cy="16" r="8" />
          <path pathLength="1" d="M16 6 v3" />
          <path pathLength="1" d="M16 23 v3" />
          <path pathLength="1" d="M6 16 h3" />
          <path pathLength="1" d="M23 16 h3" />
        </>
      ) : (
        MARKS[seat].map((d) => <path key={d} pathLength="1" d={d} />)
      )}
    </svg>
  );
}
