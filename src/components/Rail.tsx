"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRightIcon } from "./icons";

/**
 * Horizontal rail with prev/next buttons and a progress bar.
 *
 * `autoScroll` (pixels per second) turns it into an endless conveyor belt: the cards
 * glide continuously and repeat forever (a second copy follows the first, and the
 * position wraps invisibly). It keeps moving under the mouse; a touch/drag, focus or
 * the arrow buttons pause it briefly, and it rests while off screen. Without it the rail snaps per card.
 */
export default function Rail({ children, label, autoScroll }: { children: ReactNode; label: string; autoScroll?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });
  const hold = useRef(0); // timestamp until which auto-scroll stays paused
  const loopWidth = useRef(0); // distance after which the content repeats
  const looping = Boolean(autoScroll);

  // Endless auto-scroll
  useEffect(() => {
    const el = ref.current;
    if (!el || !autoScroll) return;

    const measure = () => {
      const first = el.firstElementChild as HTMLElement | null;
      const repeat = copy.current?.firstElementChild as HTMLElement | null;
      if (first && repeat) loopWidth.current = repeat.getBoundingClientRect().left - first.getBoundingClientRect().left;
    };
    measure();
    window.addEventListener("resize", measure);

    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.2 });
    io.observe(el);

    // Keeps gliding even with the mouse over it or reels playing; only a touch/drag
    // or keyboard focus pauses it for a moment.
    const pause = (ms = 3000) => (hold.current = Math.max(hold.current, Date.now() + ms));
    const touch = () => pause(2500);
    const focus = () => pause(4000);
    el.addEventListener("pointerdown", touch, { passive: true });
    el.addEventListener("touchstart", touch, { passive: true });
    el.addEventListener("focusin", focus);

    let pos = el.scrollLeft;
    let last = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const loop = loopWidth.current;
      // follow manual scrolling (trackpad / drag / buttons)
      if (Math.abs(el.scrollLeft - pos) > 2) pos = el.scrollLeft;
      if (visible && Date.now() >= hold.current && !document.hidden && loop > 0) {
        pos += autoScroll * dt;
        if (pos >= loop) pos -= loop; // invisible wrap: the copy looks identical
        el.scrollLeft = pos;
      } else if (loop > 0 && el.scrollLeft >= loop) {
        pos = el.scrollLeft - loop;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", measure);
      el.removeEventListener("pointerdown", touch);
      el.removeEventListener("touchstart", touch);
      el.removeEventListener("focusin", focus);
    };
  }, [autoScroll]);

  // Progress bar + arrow states
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      if (looping) {
        const loop = loopWidth.current || el.scrollWidth / 2;
        setProgress(((el.scrollLeft % loop) + loop) % loop / loop);
        return;
      }
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
  }, [looping]);

  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    hold.current = Date.now() + 2500; // arrow click pauses the belt briefly
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    let target = el.scrollLeft + dir * step;
    // in loop mode going back from the very start jumps into the copy first
    if (looping && target < 0 && loopWidth.current) {
      el.scrollLeft += loopWidth.current;
      target += loopWidth.current;
    }
    el.scrollTo({ left: target, behavior: "smooth" });
  };
  const btn = "glass grid size-12 place-items-center rounded-full transition duration-300 hover:bg-neon hover:text-ink disabled:pointer-events-none disabled:opacity-30";

  return (
    <div>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={`no-scrollbar flex gap-4 overflow-x-auto px-5 pb-2 sm:px-8 lg:px-[max(3rem,calc((100vw_-_86rem)/2_+_3rem))] ${
          looping ? "" : "snap-x snap-mandatory scroll-px-5 sm:scroll-px-8 lg:scroll-px-[max(3rem,calc((100vw_-_86rem)/2_+_3rem))]"
        }`}
      >
        {children}
        {/* identical second set so the belt can wrap without a visible jump */}
        {looping && (
          <div ref={copy} className="contents" aria-hidden="true" inert>
            {children}
          </div>
        )}
      </div>
      <div className="container-x mt-8 flex items-center gap-6">
        <div className="h-px flex-1 overflow-hidden bg-line">
          <div className="h-full origin-left bg-gradient-to-r from-neon to-gold" style={{ transform: `scaleX(${Math.max(0.04, progress)})` }} />
        </div>
        <div className="flex gap-2">
          <button type="button" className={btn} onClick={() => go(-1)} disabled={!looping && edges.start} aria-label="Scroll back">
            <ArrowRightIcon width={18} height={18} className="rotate-180" />
          </button>
          <button type="button" className={btn} onClick={() => go(1)} disabled={!looping && edges.end} aria-label="Scroll forward">
            <ArrowRightIcon width={18} height={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
