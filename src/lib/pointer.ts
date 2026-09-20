import { useEffect, useRef, type PointerEvent } from "react";

const FINE = "(hover: hover) and (pointer: fine)";

function finePointer() {
  return window.matchMedia(FINE).matches;
}

export function usePointerField<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!finePointer()) return;

    el.classList.add("pointer-on");
    const light = el.querySelector<HTMLElement>(".daylight");
    const headline = el.querySelector<HTMLElement>(".live-headline");

    let x = 0.5;
    let y = 0.22;
    let raf = 0;

    const flush = () => {
      raf = 0;
      if (light) {
        light.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
        light.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      }
      if (headline) {
        headline.style.transform = `translate3d(${((x - 0.5) * 18).toFixed(1)}px, ${((y - 0.5) * 8).toFixed(1)}px, 0)`;
      }
    };

    const move = (e: globalThis.PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      if (!raf) raf = window.requestAnimationFrame(flush);
    };

    const leave = () => {
      x = 0.5;
      y = 0.22;
      if (!raf) raf = window.requestAnimationFrame(flush);
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}

export function tiltCard(e: PointerEvent<HTMLElement>) {
  if (!finePointer()) return;
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
