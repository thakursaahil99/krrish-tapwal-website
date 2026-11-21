"use client";

import { useEffect } from "react";

/** Feeds --mx / --my to the `.spot` card under the pointer. Disabled in lite mode and on touch screens. */
export default function Spotlight() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("lite") || !window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    let ev: PointerEvent | null = null;
    const onMove = (e: PointerEvent) => {
      ev = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!ev || root.classList.contains("lite")) return;
        const card = (ev.target as Element | null)?.closest?.(".spot") as HTMLElement | null;
        if (!card) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${ev.clientX - r.left}px`);
        card.style.setProperty("--my", `${ev.clientY - r.top}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
