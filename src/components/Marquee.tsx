import type { ReactNode } from "react";

/** Infinite horizontal ticker (pure CSS). Pauses on hover. */
export default function Marquee({ items, reverse = false, className = "", separator }: { items: ReactNode[]; reverse?: boolean; className?: string; separator?: ReactNode }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className="flex shrink-0 items-center">
          {item}
          <span className="mx-6 sm:mx-10" aria-hidden="true">
            {separator ?? "✦"}
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`group flex overflow-hidden ${className}`}>
      <div className={`flex w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"} group-hover:[animation-play-state:paused]`}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
