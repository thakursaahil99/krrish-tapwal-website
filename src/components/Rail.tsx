"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRightIcon } from "./icons";

/** Horizontal snap-scrolling rail with prev/next buttons and a progress bar */
export default function Rail({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

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

  const go = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
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
