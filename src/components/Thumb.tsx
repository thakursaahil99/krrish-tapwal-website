"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * YouTube thumbnail that asks for the HD frame first (maxres / Shorts portrait)
 * and quietly falls back to `hqdefault` — cropped to hide its letterbox bars —
 * when YouTube has no HD version.
 */
export default function Thumb({
  id,
  alt,
  kind = "video",
  sizes,
  className = "",
  preload = false,
}: {
  id: string;
  alt: string;
  kind?: "video" | "short";
  sizes: string;
  className?: string;
  preload?: boolean;
}) {
  const [fallback, setFallback] = useState(false);
  const hd = kind === "short" ? "oardefault" : "maxresdefault";
  const src = `https://i.ytimg.com/vi/${id}/${fallback ? "hqdefault" : hd}.jpg`;
  // hqdefault is 4:3 with black bars: zoom in so a 16:9 frame fills the box
  // (a Short's portrait frame already sits in the centre column, so no zoom needed)
  const crop = fallback && kind === "video" ? "scale-[1.34]" : "";

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      onError={() => setFallback(true)}
      className={`object-cover ${crop} ${className}`}
    />
  );
}
