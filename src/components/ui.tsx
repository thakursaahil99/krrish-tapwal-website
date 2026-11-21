import HeroVideo from "./HeroVideo";
import AutoPlayer from "./AutoPlayer";
import ShortPlayer from "./ShortPlayer";
import { site } from "@/data/site";
import type { CSSProperties, ReactNode } from "react";
import { categoryLabels, type Short, type Video } from "@/data/videos";
import { compactNumber, formatDate } from "@/lib/format";
import { shortUrl, watchUrl } from "@/lib/youtube";
import { ArrowUpRightIcon, PlayIcon } from "./icons";
import Reveal from "./Reveal";
import Thumb from "./Thumb";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** HUD eyebrow + big heading + intro, used to open every section */
export function SectionHeading({
  eyebrow,
  index,
  children,
  id,
  intro,
  as: H = "h2",
  align = "left",
  action,
}: {
  eyebrow?: ReactNode;
  index?: string;
  children: ReactNode;
  id?: string;
  intro?: ReactNode;
  as?: "h1" | "h2";
  align?: "left" | "center";
  action?: ReactNode;
}) {
  const center = align === "center";
  return (
    <div className={`mb-12 flex flex-col gap-8 md:mb-16 ${center ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}>
      <div className="max-w-3xl">
        {(eyebrow || index) && (
          <Reveal className={`flex items-center gap-4 ${center ? "justify-center" : ""}`}>
            {index && <span className="hud text-stone">[{index}]</span>}
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          </Reveal>
        )}
        <Reveal delay={80} variant="blur">
          <H id={id} className="display-lg mt-6">
            {children}
          </H>
        </Reveal>
        {intro && (
          <Reveal delay={160}>
            <p className={`mt-6 max-w-xl text-base leading-relaxed text-stone sm:text-lg ${center ? "mx-auto" : ""}`}>{intro}</p>
          </Reveal>
        )}
      </div>
      {action && (
        <Reveal delay={200} className="shrink-0">
          {action}
        </Reveal>
      )}
    </div>
  );
}

/** Full-bleed photo header for the inner pages */
export function PageHero({
  eyebrow,
  title,
  video,
  children,
  aside,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  /** Faded background video for this page (see `site.backgroundVideos`) */
  video: { id: string; start?: number };
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="relative isolate flex min-h-[80svh] items-end overflow-hidden pb-16 pt-36 md:pb-24">
      <HeroVideo {...video} />
      <div className="grid-bg absolute inset-0 -z-10" aria-hidden="true" />
      <div className="container-x grid w-full items-end gap-12 lg:grid-cols-[1.5fr_1fr]">
        <div>
          {eyebrow && (
            <p className="eyebrow fade-in" style={d(100)}>
              {eyebrow}
            </p>
          )}
          <h1 className="display-xl mt-6 !text-[clamp(2.8rem,8.5vw,7.5rem)]">
            <span className="line-mask">
              <span style={d(150)}>{title}</span>
            </span>
          </h1>
          {children && (
            <div className="fade-in mt-8 max-w-2xl text-lg leading-relaxed text-snow/75" style={d(500)}>
              {children}
            </div>
          )}
        </div>
        {aside && (
          <div className="fade-in" style={d(700)}>
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}

/** Round pulsing neon play button */
export function PlayBadge({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = { sm: "size-12", md: "size-16", lg: "size-24" }[size];
  const icon = { sm: 15, md: 20, lg: 30 }[size];
  return (
    <span className={`relative grid ${s} place-items-center`}>
      <span className="absolute inset-0 animate-pulse-ring rounded-full bg-neon" />
      <span className="relative grid size-full place-items-center rounded-full bg-neon text-ink shadow-[0_0_40px_rgb(255_122_47/0.6)] transition duration-500 group-hover:scale-110">
        <PlayIcon width={icon} height={icon} className="translate-x-[6%]" />
      </span>
    </span>
  );
}

/** Stat tile with HUD label */
export function StatTile({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`glass glow-border spot rounded-2xl p-5 ${className}`}>
      <dt className="hud text-stone">{label}</dt>
      <dd className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{children}</dd>
    </div>
  );
}

/** Video card: HD thumbnail in a glass frame, category chip, duration, title + meta */
export function VideoCard({ video, delay = 0, size = "md" }: { video: Video; delay?: number; size?: "md" | "lg" }) {
  return (
    <Reveal delay={delay} as="article" className="group h-full">
      <a href={watchUrl(video.id)} target="_blank" rel="noopener noreferrer" className="glass glow-border spot card-zoom flex h-full flex-col rounded-3xl p-2.5">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-panel-2">
          <Thumb id={video.id} alt={video.title} sizes={size === "lg" ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"} />
          <AutoPlayer id={video.id} start={site.videoPreviewStart} />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          <span className="absolute inset-0 grid scale-75 place-items-center opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100">
            <PlayBadge size="sm" />
          </span>
          <span className="glass hud absolute left-3 top-3 rounded-full px-3 py-1.5 !text-[0.62rem] text-snow">{categoryLabels[video.category]}</span>
          {video.duration && <span className="hud absolute bottom-3 right-3 rounded-md bg-ink/85 px-2 py-1 text-snow">{video.duration}</span>}
        </div>
        <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
          <h3 className={`line-clamp-2 font-sans font-semibold leading-snug tracking-tight transition-colors duration-300 group-hover:text-neon ${size === "lg" ? "text-2xl sm:text-3xl" : "text-lg"}`}>
            {video.title}
          </h3>
          <p className="hud mt-auto flex items-center justify-between gap-3 pt-4 text-stone">
            <span>
              {video.views ? `${compactNumber(video.views)} views · ` : ""}
              <time dateTime={video.publishedAt}>{formatDate(video.publishedAt)}</time>
            </span>
            <ArrowUpRightIcon width={16} height={16} className="shrink-0 transition duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neon" />
          </p>
        </div>
      </a>
    </Reveal>
  );
}

/** Portrait Short card */
export function ShortCard({ short, className = "" }: { short: Short; className?: string }) {
  return (
    <a
      href={shortUrl(short.id)}
      target="_blank"
      rel="noopener noreferrer"
      className={`glow-border card-zoom group relative block aspect-[9/16] shrink-0 snap-start overflow-hidden rounded-[1.75rem] bg-panel-2 ${className}`}
    >
      <Thumb id={short.id} kind="short" alt={short.title} sizes="(min-width: 1024px) 20vw, 60vw" />
      <ShortPlayer id={short.id} />
      <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
      <span className="glass hud absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 !text-[0.6rem]">
        <PlayIcon width={9} height={9} className="text-neon" /> Short
      </span>
      <span className="absolute right-3 top-3 grid size-9 -rotate-45 place-items-center rounded-full bg-neon text-ink opacity-0 transition duration-500 group-hover:rotate-0 group-hover:opacity-100">
        <ArrowUpRightIcon width={16} height={16} />
      </span>
      <span className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <span className="line-clamp-3 text-base font-semibold leading-snug">{short.title}</span>
        {short.views ? <span className="hud mt-2 block text-neon">{compactNumber(short.views)} views</span> : null}
      </span>
    </a>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
