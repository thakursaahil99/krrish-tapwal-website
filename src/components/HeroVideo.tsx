"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Faded, muted, looping YouTube video behind the hero.
 * - The HD thumbnail shows instantly as a poster.
 * - The player only loads after the page is idle, and fades in once it's playing.
 * - Skipped entirely in lite mode, with Data Saver, or with reduced motion
 *   (the poster stays), so weak devices and phones on data don't pay for it.
 */
export default function HeroVideo({ id, start = 0 }: { id: string; start?: number }) {
  const [mount, setMount] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (root.classList.contains("lite") || conn?.saveData || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const handle = idle(() => setMount(true));
    return () => (window.cancelIdleCallback ? window.cancelIdleCallback(handle as number) : clearTimeout(handle as number));
  }, []);

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: id,
    controls: "0",
    start: String(start),
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    iv_load_policy: "3",
    disablekb: "1",
    fs: "0",
  });

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
      <Image src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`} alt="" fill preload sizes="100vw" className="object-cover opacity-45 blur-[2px] saturate-[1.2]" />
      {mount && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
          title="Background video"
          tabIndex={-1}
          allow="autoplay; encrypted-media"
          onLoad={() => window.setTimeout(() => setVisible(true), 1800)}
          className={`pointer-events-none absolute left-1/2 top-1/2 h-[max(100%,56.25vw)] w-[max(100%,177.78svh)] -translate-x-1/2 -translate-y-1/2 scale-[1.2] border-0 transition-opacity duration-[2000ms] ${
            visible ? "opacity-60" : "opacity-0"
          }`}
        />
      )}
      {/* fade into the page: sunset tint, vignette and a soft bottom edge */}
      <div className="absolute inset-0 bg-ink/25" />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo/15 via-transparent to-neon/10 mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,transparent_35%,var(--color-ink)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink to-transparent" />
    </div>
  );
}
