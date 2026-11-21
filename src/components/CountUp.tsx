"use client";

import { useEffect, useRef, useState } from "react";

/** Number that counts up from 0 the first time it scrolls into view. */
export default function CountUp({ value, suffix = "", compact = false, duration = 1800 }: { value: number; suffix?: string; compact?: boolean; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setN(0);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 4);
          setN(Math.round(value * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  const text = compact ? new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(n) : String(n);
  return (
    <span ref={ref} className="tabular-nums">
      {text}
      {suffix}
    </span>
  );
}
