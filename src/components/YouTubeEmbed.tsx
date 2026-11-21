"use client";

import Image from "next/image";
import { useState } from "react";
import { PlayIcon } from "./icons";

/**
 * Featured video in a glass "screen" frame (lite embed).
 * The real YouTube player only loads after a click, which keeps the page fast.
 */
export default function YouTubeEmbed({
  id,
  title,
  preload = false,
  className = "",
  label = "Now playing",
}: {
  id: string;
  title: string;
  preload?: boolean;
  className?: string;
  label?: string;
}) {
  const [active, setActive] = useState(false);
  const [hd, setHd] = useState(true);

  return (
    <div className={`glass glow-border relative rounded-[2rem] p-2 sm:p-3 ${className}`}>
      <div className="relative aspect-video w-full overflow-hidden rounded-[1.5rem] bg-panel-2">
        {active ? (
          <iframe
            className="absolute inset-0 size-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setActive(true)} className="group absolute inset-0 size-full cursor-pointer" aria-label={`Play video: ${title}`}>
            <Image
              src={`https://i.ytimg.com/vi/${id}/${hd ? "maxresdefault" : "hqdefault"}.jpg`}
              alt={title}
              fill
              onError={() => setHd(false)}
              preload={preload}
              sizes="(min-width: 1024px) 66vw, 100vw"
              className={`object-cover transition duration-1000 group-hover:scale-[1.03] ${hd ? "" : "scale-[1.34]"}`}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-ink/30" />
            {/* scan line */}
            <span className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
              <span className="absolute inset-x-0 h-1/3 animate-scan bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
            </span>
            <span className="hud absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-ink/70 px-3 py-1.5 text-snow backdrop-blur sm:left-6 sm:top-6">
              <span className="size-2 animate-pulse rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" /> {label}
            </span>
            <span className="absolute inset-0 grid place-items-center">
              <span className="relative grid size-20 place-items-center sm:size-24">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-neon" />
                <span className="relative grid size-full place-items-center rounded-full bg-neon text-ink shadow-[0_0_50px_rgb(255_122_47/0.6)] transition duration-500 group-hover:scale-110">
                  <PlayIcon width={30} height={30} className="translate-x-[6%]" />
                </span>
              </span>
            </span>
            <span className="absolute inset-x-0 bottom-0 p-5 text-left sm:p-8">
              <span className="line-clamp-2 max-w-3xl font-display text-xl font-bold leading-tight tracking-tight sm:text-3xl">{title}</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
