"use client";

import { useState } from "react";
import { categoryLabels, type Video, type VideoCategory } from "@/data/videos";
import { VideoCard } from "./ui";

export default function VideoGrid({ videos }: { videos: Video[] }) {
  const [filter, setFilter] = useState<VideoCategory | "all">("all");
  const cats = (Object.keys(categoryLabels) as VideoCategory[]).filter((c) => videos.some((v) => v.category === c));
  const shown = filter === "all" ? videos : videos.filter((v) => v.category === filter);
  const count = (c: VideoCategory | "all") => (c === "all" ? videos.length : videos.filter((v) => v.category === c).length);

  const chip = (active: boolean) =>
    `inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition duration-300 ${
      active ? "bg-neon text-ink shadow-[0_0_30px_rgb(255_122_47/0.35)]" : "glass text-snow/80 hover:text-snow hover:bg-snow/10"
    }`;

  return (
    <>
      <div className="no-scrollbar -mx-5 mb-12 flex gap-2 overflow-x-auto px-5" role="toolbar" aria-label="Filter videos by category">
        {(["all", ...cats] as const).map((c) => (
          <button key={c} type="button" className={chip(filter === c)} aria-pressed={filter === c} onClick={() => setFilter(c)}>
            {c === "all" ? "All" : categoryLabels[c]}
            <span className={`hud !text-[0.65rem] ${filter === c ? "text-ink/60" : "text-stone"}`}>{String(count(c)).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
      {/* key forces a fresh reveal animation whenever the filter changes */}
      <div key={filter} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((v, i) => (
          <VideoCard key={v.id} video={v} delay={(i % 3) * 80} />
        ))}
      </div>
    </>
  );
}
