"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRightIcon } from "./icons";

/**
 * Horizontal snap-scrolling rail with prev/next buttons and a progress bar.
 * `autoSlide` (ms) moves it one card at a time and wraps back to the start; it pauses
 * while the pointer is over it, while it's touched/focused, and when it's off screen.
 */
export default function Rail({ children, label, autoSlide }: { children: ReactNode; label: string; autoSlide?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });
  const hold = useRef(0); // timestamp until which auto-slide stays paused
  const hovering = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !autoSlide) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.3 });
    io.observe(el);

    const pause = () => (hold.current = Date.now() + 4000);
    const enter = () => (hovering.current = true);
    const leave = () => {
      hovering.current = false;
      pause();
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("focusin", pause);

    const tick = window.setInterval(() => {
      if (!visible || hovering.current || Date.now() < hold.current || document.hidden) return;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= max - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      const card = el.firstElementChild as HTMLElement | null;
      const gap = parseFloat(getComputedStyle(el).columnGap) || 16;
      el.scrollBy({ left: (card?.offsetWidth ?? el.clientWidth / 4) + gap, behavior: "smooth" });
    }, autoSlide);

    return () => {
      clearInterval(tick);
      io.disconnect();
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("focusin", pause);
    };
  }, [autoSlide]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 1);
      setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft > max - 8 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const go = (dir: 1 | -1) => {
    hold.current = Date.now() + 6000; // manual navigation pauses auto-slide for a bit
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  };
  const btn = "glass grid size-12 place-items-center rounded-full transition duration-300 hover:bg-neon hover:text-ink disabled:pointer-events-none disabled:opacity-30";

  return (
    <div>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:scroll-px-8 sm:px-8 lg:scroll-px-[max(3rem,calc((100vw_-_86rem)/2_+_3rem))] lg:px-[max(3rem,calc((100vw_-_86rem)/2_+_3rem))]"
      >
        {children}
      </div>
      <div className="container-x mt-8 flex items-center gap-6">
        <div className="h-px flex-1 overflow-hidden bg-line">
          <div className="h-full origin-left bg-gradient-to-r from-neon to-gold transition-transform duration-300" style={{ transform: `scaleX(${Math.max(0.08, progress)})` }} />
        </div>
        <div className="flex gap-2">
          <button type="button" className={btn} onClick={() => go(-1)} disabled={edges.start} aria-label="Scroll back">
            <ArrowRightIcon width={18} height={18} className="rotate-180" />
          </button>
          <button type="button" className={btn} onClick={() => go(1)} disabled={edges.end} aria-label="Scroll forward">
            <ArrowRightIcon width={18} height={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
