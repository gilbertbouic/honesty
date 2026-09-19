import { useEffect, useRef, type PointerEvent } from "react";

export function usePointerField<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    el.classList.add("pointer-on");

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      el.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
      el.style.setProperty("--mxn", x.toFixed(3));
      el.style.setProperty("--myn", y.toFixed(3));
    };

    const leave = () => {
      el.style.setProperty("--mx", "50%");
      el.style.setProperty("--my", "22%");
      el.style.setProperty("--mxn", "0.5");
      el.style.setProperty("--myn", "0.22");
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return ref;
}

export function tiltCard(e: PointerEvent<HTMLElement>) {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.setProperty("--rx", `${(-y * 9).toFixed(2)}deg`);
  el.style.setProperty("--ry", `${(x * 11).toFixed(2)}deg`);
  el.style.setProperty("--hx", `${((x + 0.5) * 100).toFixed(1)}%`);
  el.style.setProperty("--hy", `${((y + 0.5) * 100).toFixed(1)}%`);
}

export function untiltCard(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  el.style.setProperty("--rx", "0deg");
  el.style.setProperty("--ry", "0deg");
}
