"use client";

import { useEffect, useState } from "react";

/** Cycles through words with a slide-up swap, e.g. Explorer → Engineer → … */
export default function RotatingWord({ words, interval = 2200, className = "" }: { words: readonly string[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);

  return (
    <span className={`relative inline-grid overflow-hidden align-bottom ${className}`} aria-live="polite">
      {words.map((w, idx) => (
        <span
          key={w}
          aria-hidden={idx !== i}
          className={`col-start-1 row-start-1 whitespace-nowrap transition duration-700 ease-[var(--ease-out-expo)] ${
            idx === i ? "translate-y-0 opacity-100 blur-0" : idx === (i - 1 + words.length) % words.length ? "-translate-y-full opacity-0 blur-sm" : "translate-y-full opacity-0 blur-sm"
          }`}
        >
          {w}
        </span>
      ))}
    </span>
  );
}
