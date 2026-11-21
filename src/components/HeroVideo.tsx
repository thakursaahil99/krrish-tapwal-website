"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Faded, muted, looping YouTube video behind the hero.
 * - The HD thumbnail shows instantly as a poster.
 * - The player loads right after the page settles and is told to play through the
 *   YouTube IFrame API (mute + play), retried a few times.
 * - If the browser still holds it back, the first click / scroll / touch / key press
 *   anywhere on the page starts it ("auto click").
 * - Only Data Saver skips the video (poster stays) so phones on mobile data don't pay for it.
 */
export default function HeroVideo({ id, start = 0 }: { id: string; start?: number }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [mount, setMount] = useState(false);
  const [visible, setVisible] = useState(false);
  const playingRef = useRef(false);

  // Send a command to the YouTube player inside the iframe
  const command = useCallback((func: string, args: unknown[] = []) => {
    frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), "*");
  }, []);
  const play = useCallback(() => {
    command("mute");
    command("playVideo");
  }, [command]);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    const t = window.setTimeout(() => setMount(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mount) return;

    // Keep nudging the player until it really plays (it can take a while to boot)
    let tries = 0;
    const kicker = window.setInterval(() => {
      if (playingRef.current || ++tries > 40) return clearInterval(kicker);
      play();
    }, 1500);

    // "Auto click": the first user gesture anywhere also starts it
    const gestures = ["pointerdown", "touchstart", "keydown", "scroll", "wheel"] as const;
    const onGesture = () => play();
    gestures.forEach((g) => window.addEventListener(g, onGesture, { passive: true, once: true }));

    // Listen to the player: fade in once it is really playing
    const onMessage = (e: MessageEvent) => {
      // only this hero's own player (reels on the page talk on the same channel)
      if (e.source !== frame.current?.contentWindow || typeof e.data !== "string") return;
      try {
        const msg = JSON.parse(e.data);
        const state = msg?.info?.playerState ?? (msg.event === "onStateChange" ? msg.info : undefined);
        if (state === 1) {
          playingRef.current = true; // 1 = playing
          setVisible(true);
        }
        if (state === 0) {
          // ended → loop from `start` (not from 0:00)
          command("seekTo", [start, true]);
          play();
        }
        if (state === 2 || state === 5 || state === -1) play(); // paused / cued / unstarted → play
      } catch {
        /* not a player message */
      }
    };
    window.addEventListener("message", onMessage);

    return () => {
      clearInterval(kicker);
      gestures.forEach((g) => window.removeEventListener(g, onGesture));
      window.removeEventListener("message", onMessage);
    };
  }, [mount, play, command, start]);

  const onLoad = () => {
    // Subscribe to player events, then start it
    frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: "hero-bg" }), "*");
    play();
    // Fallback fade-in even if no state message arrives
    window.setTimeout(() => setVisible(true), 2500);
  };

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    // No `loop`/`playlist` here: YouTube's own loop restarts at 0:00. We loop from `start` ourselves.
    controls: "0",
    start: String(start),
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    iv_load_policy: "3",
    disablekb: "1",
    fs: "0",
    enablejsapi: "1",
    ...(typeof window !== "undefined" ? { origin: window.location.origin } : {}),
  });

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
      <Image src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`} alt="" fill preload sizes="100vw" className="object-cover opacity-45 blur-[2px] saturate-[1.2]" />
      {mount && (
        <iframe
          ref={frame}
          src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
          title="Background video"
          tabIndex={-1}
          allow="autoplay; encrypted-media; picture-in-picture"
          onLoad={onLoad}
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
