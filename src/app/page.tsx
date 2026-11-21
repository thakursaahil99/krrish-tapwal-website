import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import CountUp from "@/components/CountUp";
import HeroVideo from "@/components/HeroVideo";
import Marquee from "@/components/Marquee";
import ProductCard from "@/components/ProductCard";
import Rail from "@/components/Rail";
import Reveal from "@/components/Reveal";
import RotatingWord from "@/components/RotatingWord";
import Thumb from "@/components/Thumb";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { ArrowUpRightIcon, BikeIcon, ChartIcon, CodeIcon, CompassIcon, InstagramIcon, MapPinIcon, PlayIcon, YouTubeIcon } from "@/components/icons";
import { JsonLd, PlayBadge, SectionHeading, ShortCard } from "@/components/ui";
import { gallery } from "@/data/gallery";
import { products } from "@/data/shop";
import { site } from "@/data/site";
import { garage, places, timeline } from "@/data/videos";
import { formatDate } from "@/lib/format";
import { graph, profilePageSchema, videoSchema } from "@/lib/schema";
import { getChannelContent, getChannelProfileImage, getChannelStats, watchUrl } from "@/lib/youtube";

// Har 15 minute mein YouTube se nayi videos + stats refresh (ISR)
export const revalidate = 900;

export const metadata: Metadata = {
  title: "Himachal Explorer, CSE Engineer & Data Scientist",
  description:
    "Explore Himachal with Krrish Tapwal, a CSE engineer and data scientist — discover hidden trails, historic temples, mountain journeys, and stories on XploreWithKrrish.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    title: "Krrish Tapwal — Himachal Travel Vlogs & Adventures",
    description: "Hidden trails, sacred temples, old forts and mountain rides across Himachal Pradesh with XploreWithKrrish.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krrish Tapwal — Himachali Explorer",
    description: "Explore hidden places and real stories from Himachal Pradesh.",
  },
};

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
const identityIcons = [CompassIcon, CodeIcon, ChartIcon, BikeIcon];

export default async function HomePage() {
  const [{ videos, shorts }, live, profileImage] = await Promise.all([getChannelContent(), getChannelStats(), getChannelProfileImage()]);
  const [featured, ...rest] = videos;
  const instaHandle = site.socials.instagram ? `@${site.socials.instagram.replace(/\/+$/, "").split("/").pop()}` : site.youtube.handle;
  const roles = site.identities.map((i) => i.title);
  const merch = products.slice(0, 4);

  return (
    <>
      <JsonLd data={graph(profilePageSchema("/", `${site.name} — Official Website`), ...videos.slice(0, 6).map(videoSchema))} />

      {/* ================= HERO ================= */}
      <section className="relative isolate overflow-hidden pb-20 pt-32 md:pt-36 lg:min-h-[100svh] lg:pb-24" aria-labelledby="hero-title">
        <HeroVideo {...site.backgroundVideos.home} />
        <div className="container-x grid items-center gap-16 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
          {/* Copy */}
          <div className="relative z-10">
            <div className="fade-in flex flex-wrap items-center gap-3" style={d(50)}>
              <span className="glass hud inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-snow">
                <span className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-neon" />
                  <span className="relative size-2 rounded-full bg-neon" />
                </span>
                Live · {new Intl.NumberFormat("en-IN").format(live.subscribers)} subscribers
              </span>
              <span className="hud hidden text-stone sm:inline">{site.hero.kicker}</span>
            </div>

            <h1 id="hero-title" className="display-xl mt-8 uppercase lg:!text-[clamp(4rem,8.4vw,8.4rem)]">
              <span className="line-mask">
                <span style={d(120)}>{site.firstName}</span>
              </span>
              <span className="line-mask">
                <span style={d(220)} className="text-glow">
                  {site.lastName}
                </span>
              </span>
            </h1>

            <p className="fade-in mt-8 font-display text-xl font-semibold tracking-tight sm:text-3xl" style={d(450)}>
              <span className="text-stone">I&apos;m a </span>
              <RotatingWord words={roles} className="text-neon" />
            </p>

            <p className="fade-in mt-6 max-w-xl text-lg leading-relaxed text-snow/70" style={d(550)}>
              {site.hero.lead}
            </p>

            <div className="fade-in mt-10 flex flex-wrap gap-3" style={d(650)}>
              <a href="#latest" className="btn btn-primary">
                <PlayIcon width={14} height={14} /> Watch latest drop
              </a>
              <a href={site.youtube.subscribeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <YouTubeIcon width={18} height={18} /> Subscribe
              </a>
            </div>

            <dl className="fade-in mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-line pt-8" style={d(750)}>
              <div>
                <dt className="hud text-stone">Views</dt>
                <dd className="mt-2 font-display text-2xl font-bold sm:text-4xl">
                  <CountUp value={live.views} compact />+
                </dd>
              </div>
              <div>
                <dt className="hud text-stone">Uploads</dt>
                <dd className="mt-2 font-display text-2xl font-bold sm:text-4xl">
                  <CountUp value={live.videos} />+
                </dd>
              </div>
              <div>
                <dt className="hud text-stone">Since</dt>
                <dd className="mt-2 font-display text-2xl font-bold sm:text-4xl">{site.stats.since}</dd>
              </div>
            </dl>
          </div>

          {/* Visual */}
          <div className="fade-in relative mx-auto w-full max-w-lg lg:max-w-none" style={d(300)}>
            <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-neon/40 via-rose/25 to-indigo/45 opacity-70 blur-3xl" aria-hidden="true" />
            <div className="glass glow-border relative rounded-[2.75rem] p-3">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.25rem]">
                <Image
                  src={profileImage}
                  alt={`${site.name}, Himachal explorer and creator of ${site.brand}`}
                  fill
                  preload
                  quality={90}
                  sizes="(min-width: 1024px) 48vw, 92vw"
                  className="animate-kenburns object-cover object-[44%_center]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/10" />
                <span className="pointer-events-none absolute inset-0 overflow-hidden opacity-50" aria-hidden="true">
                  <span className="absolute inset-x-0 h-1/3 animate-scan bg-gradient-to-b from-transparent via-neon/10 to-transparent" />
                </span>
                {/* HUD corners */}
                {["left-4 top-4 border-l border-t", "right-4 top-4 border-r border-t", "bottom-4 left-4 border-b border-l", "bottom-4 right-4 border-b border-r"].map((c) => (
                  <span key={c} className={`absolute size-6 border-neon/80 ${c}`} aria-hidden="true" />
                ))}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                  <p className="hud text-snow/80">
                    <MapPinIcon width={12} height={12} className="mr-1.5 inline text-neon" />
                    {site.location.area}
                    <br />
                    <span className="text-stone">31.7°N · 76.7°E</span>
                  </p>
                  <p className="hud text-right text-stone">
                    REC
                    <span className="ml-2 inline-block size-2 animate-blink rounded-full bg-red-500" />
                  </p>
                </div>
              </div>
            </div>

            {/* Floating latest-video card */}
            {featured && (
              <a
                href="#latest"
                className="glass group absolute -left-4 top-10 hidden w-64 animate-float items-center gap-3 rounded-2xl p-2.5 pr-4 shadow-2xl sm:flex lg:-left-14"
                style={{ "--r": "-3deg" } as CSSProperties}
              >
                <span className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-xl">
                  <Thumb id={featured.id} alt="" sizes="96px" />
                </span>
                <span className="min-w-0">
                  <span className="hud block text-neon">Latest drop</span>
                  <span className="mt-1 line-clamp-2 text-xs font-semibold leading-snug">{featured.title}</span>
                </span>
              </a>
            )}

            {/* Rotating subscribe badge */}
            <a
              href={site.youtube.subscribeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group absolute -bottom-8 -right-2 grid size-32 place-items-center sm:size-36 lg:-right-8"
              aria-label="Subscribe to XploreWithKrrish on YouTube"
            >
              <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-spin-slow" aria-hidden="true">
                <defs>
                  <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <circle cx="50" cy="50" r="49" className="fill-ink/80" />
                <text className="fill-snow font-mono text-[8.4px] uppercase tracking-[0.3em]">
                  <textPath href="#badge-circle">Subscribe • XploreWithKrrish • </textPath>
                </text>
              </svg>
              <span className="relative grid size-14 place-items-center rounded-full bg-neon text-ink shadow-[0_0_40px_rgb(255_122_47/0.6)] transition duration-500 group-hover:scale-110">
                <YouTubeIcon width={24} height={24} />
              </span>
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex" aria-hidden="true">
          <span className="grid h-10 w-6 justify-center rounded-full border border-snow/30 pt-2">
            <span className="size-1.5 animate-scroll-dot rounded-full bg-neon" />
          </span>
          <span className="hud text-stone">Scroll</span>
        </div>
      </section>

      {/* ================= TICKER ================= */}
      <div className="relative z-10 -rotate-2 border-y border-neon/30 bg-neon py-5 text-ink shadow-[0_0_60px_rgb(255_122_47/0.25)]" aria-hidden="true">
        <Marquee
          items={["Kamlah Fort", "Kanchana Mata", "Awahdevi", "Anant Garh", "Meteor 350", "Scorpio S11", "Mandi", "Sarkaghat"].map((t) => (
            <span key={t} className="whitespace-nowrap font-display text-2xl font-bold uppercase tracking-tight sm:text-4xl">
              {t}
            </span>
          ))}
          separator={<span className="text-2xl sm:text-3xl">✺</span>}
        />
      </div>

      {/* ================= CREATOR PROFILE (bento) ================= */}
      <section className="relative py-28 md:py-40" aria-labelledby="about-title">
        <div className="container-x">
          <SectionHeading
            index="01"
            eyebrow="Creator profile"
            id="about-title"
            action={
              <Link href="/about" className="btn btn-ghost">
                Full story <ArrowUpRightIcon width={16} height={16} className="btn-arrow" />
              </Link>
            }
          >
            Pahadi by heart. <span className="text-glow">Engineer</span> by trade.
          </SectionHeading>

          <div className="grid auto-rows-[minmax(0,auto)] gap-4 md:grid-cols-6 lg:grid-cols-12">
            {/* Bio */}
            <Reveal variant="scale" className="glass glow-border spot rounded-3xl p-7 sm:p-10 md:col-span-6 lg:col-span-7 lg:row-span-2">
              <p className="hud text-neon">// about.me</p>
              <p className="mt-6 text-xl leading-relaxed text-snow/90 sm:text-2xl">{site.longBio[0]}</p>
              <p className="mt-6 leading-relaxed text-stone">{site.longBio[1]}</p>
              <div className="mt-10 flex flex-wrap gap-2">
                {site.identities.map((id, i) => {
                  const Icon = identityIcons[i];
                  return (
                    <span key={id.title} className="inline-flex items-center gap-2 rounded-full border border-line bg-snow/5 px-4 py-2 text-sm font-medium">
                      <Icon width={16} height={16} className="text-neon" /> {id.title}
                    </span>
                  );
                })}
              </div>
            </Reveal>

            {/* Avatar */}
            <Reveal variant="scale" delay={80} className="glow-border relative min-h-80 overflow-hidden rounded-3xl md:col-span-3 lg:col-span-5">
              <Image src="/images/krrish-tapwal.jpg" alt={`${site.name} standing above a Himalayan lake`} fill sizes="(min-width: 1024px) 40vw, 50vw" className="object-cover object-[78%_30%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
                <div>
                  <p className="font-display text-2xl font-bold tracking-tight">{site.name}</p>
                  <p className="hud mt-1 text-stone">{site.youtube.handle}</p>
                </div>
                <span className="hud rounded-full bg-neon px-3 py-1.5 text-ink">Creator</span>
              </div>
            </Reveal>

            {/* Stats */}
            <Reveal variant="scale" delay={140} className="glass glow-border spot rounded-3xl p-6 md:col-span-3 lg:col-span-5">
              <p className="hud text-stone">Channel analytics · live</p>
              <dl className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <dd className="font-display text-3xl font-bold sm:text-4xl">
                    <CountUp value={live.subscribers} />
                  </dd>
                  <dt className="hud mt-2 text-stone">Subscribers</dt>
                </div>
                <div>
                  <dd className="font-display text-3xl font-bold text-neon sm:text-4xl">
                    <CountUp value={live.views} compact />
                  </dd>
                  <dt className="hud mt-2 text-stone">Total views</dt>
                </div>
              </dl>
              {/* mini bar graph */}
              <div className="mt-6 flex h-14 items-end gap-1.5" aria-hidden="true">
                {[30, 45, 38, 60, 52, 70, 64, 85, 78, 100].map((h, i) => (
                  <span key={i} className="flex-1 rounded-t bg-gradient-to-t from-neon/20 to-neon" style={{ height: `${h}%`, opacity: 0.35 + i * 0.065 }} />
                ))}
              </div>
            </Reveal>

            {/* Identity cards */}
            {site.identities.map((id, i) => {
              const Icon = identityIcons[i];
              return (
                <Reveal key={id.title} variant="up" delay={i * 80} className="glass glow-border spot group rounded-3xl p-6 md:col-span-3 lg:col-span-3">
                  <span className="grid size-12 place-items-center rounded-2xl bg-snow/5 text-neon ring-1 ring-line transition duration-500 group-hover:rotate-[-8deg] group-hover:bg-neon group-hover:text-ink">
                    <Icon width={22} height={22} />
                  </span>
                  <h3 className="mt-6 font-display text-lg font-bold tracking-tight">{id.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">{id.text}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= LATEST DROP ================= */}
      <section id="latest" className="scroll-mt-24 pb-28 md:pb-40" aria-labelledby="latest-title">
        <div className="container-x">
          <SectionHeading
            index="02"
            eyebrow="Latest drop"
            id="latest-title"
            intro="Fresh from the channel — new uploads land here automatically within minutes of going live."
            action={
              <Link href="/videos" className="btn btn-ghost">
                All videos <ArrowUpRightIcon width={16} height={16} className="btn-arrow" />
              </Link>
            }
          >
            Now <span className="text-glow">streaming</span>
          </SectionHeading>

          <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
            {featured && (
              <Reveal variant="scale">
                <YouTubeEmbed id={featured.id} title={featured.title} label={`New · ${formatDate(featured.publishedAt)}`} />
              </Reveal>
            )}
            <div className="flex flex-col gap-3">
              <p className="hud px-1 text-stone">Up next</p>
              {rest.slice(0, 4).map((v, i) => (
                <Reveal key={v.id} delay={i * 80} variant="left">
                  <a href={watchUrl(v.id)} target="_blank" rel="noopener noreferrer" className="glass glow-border spot group card-zoom flex items-center gap-4 rounded-2xl p-2.5">
                    <span className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-xl sm:w-36">
                      <Thumb id={v.id} alt="" sizes="144px" />
                      {v.duration && <span className="hud absolute bottom-1.5 right-1.5 rounded bg-ink/85 px-1.5 py-0.5 !text-[0.6rem]">{v.duration}</span>}
                    </span>
                    <span className="min-w-0 flex-1 pr-2">
                      <span className="line-clamp-2 text-sm font-semibold leading-snug transition group-hover:text-neon">{v.title}</span>
                      <span className="hud mt-2 block text-stone">{formatDate(v.publishedAt)}</span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= HIDDEN HIMACHAL (stacked cards) ================= */}
      <section className="pb-28 md:pb-40" aria-labelledby="places-title">
        <div className="container-x">
          <SectionHeading index="03" eyebrow="Hidden Himachal" id="places-title" intro="Forts on ridgelines, temples above the clouds — the lesser-known side of Mandi district, one trail at a time.">
            Places off the <span className="text-glow">map</span>
          </SectionHeading>

          <div className="space-y-8">
            {places.map((p, i) => (
              <article key={p.name} className="sticky" style={{ top: `${6 + i * 1.5}rem` }}>
                <a
                  href={watchUrl(p.videoId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="stack-card glass glow-border group card-zoom grid overflow-hidden rounded-[2rem] bg-panel/90 md:grid-cols-[1.25fr_1fr]"
                >
                  <div className="relative aspect-video md:aspect-auto md:min-h-[26rem]">
                    <Thumb id={p.videoId} alt={`${p.name}, ${p.area}`} sizes="(min-width: 768px) 55vw, 100vw" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-panel/40" />
                    <span className="absolute inset-0 grid place-items-center opacity-0 transition duration-500 group-hover:opacity-100">
                      <PlayBadge />
                    </span>
                  </div>
                  <div className="flex flex-col justify-between gap-10 p-7 sm:p-10">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-outline font-display text-7xl font-extrabold leading-none text-snow/40 sm:text-8xl">0{i + 1}</span>
                      <span className="hud inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-stone">
                        <MapPinIcon width={12} height={12} className="text-neon" /> {p.area}
                      </span>
                    </div>
                    <div>
                      <h3 className="display-md transition group-hover:text-neon">{p.name}</h3>
                      <p className="mt-4 max-w-md leading-relaxed text-stone">{p.note}</p>
                      <span className="hud mt-8 inline-flex items-center gap-2 text-neon">
                        Watch the journey <ArrowUpRightIcon width={14} height={14} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SHORTS ================= */}
      <section className="pb-28 md:pb-40" aria-labelledby="shorts-title">
        <div className="container-x">
          <SectionHeading
            index="04"
            eyebrow="Shorts"
            id="shorts-title"
            intro="60 seconds of mountains, machines and mandirs. The bite-size side of the channel."
            action={
              <Link href="/videos#shorts" className="btn btn-ghost">
                All shorts <ArrowUpRightIcon width={16} height={16} className="btn-arrow" />
              </Link>
            }
          >
            Quick <span className="text-glow">hits</span>
          </SectionHeading>
        </div>
        <Reveal>
          <Rail label="YouTube Shorts">
            {shorts.slice(0, 12).map((s) => (
              <ShortCard key={s.id} short={s} className="w-[68vw] sm:w-64 lg:w-72" />
            ))}
          </Rail>
        </Reveal>
      </section>

      {/* ================= GARAGE ================= */}
      <section className="pb-28 md:pb-40" aria-labelledby="garage-title">
        <div className="container-x">
          <SectionHeading index="05" eyebrow="The garage" id="garage-title" align="center" intro="Two machines, a hundred mountain roads.">
            Built for the <span className="text-glow">hills</span>
          </SectionHeading>
          <div className="grid gap-6 md:grid-cols-2">
            {garage.map((g, i) => (
              <Reveal key={g.name} variant="scale" delay={i * 120} as="article">
                <a href={watchUrl(g.videoId)} target="_blank" rel="noopener noreferrer" className="glass glow-border spot group card-zoom block overflow-hidden rounded-[2rem] p-2.5">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem]">
                    <Thumb id={g.videoId} alt={`${g.name} ${g.variant}`} sizes="(min-width: 768px) 50vw, 100vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
                    <span className="hud absolute left-4 top-4 rounded-full bg-neon px-3 py-1.5 text-ink">{i === 0 ? "Two wheels" : "Four wheels"}</span>
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                      <p className="hud text-neon">{g.variant}</p>
                      <h3 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-4xl">{g.name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-6 px-4 pb-3 pt-5 sm:px-6">
                    <p className="text-sm leading-relaxed text-stone">{g.note}</p>
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-snow/10 transition duration-500 group-hover:rotate-45 group-hover:bg-neon group-hover:text-ink">
                      <ArrowUpRightIcon width={18} height={18} />
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section id="gallery" className="scroll-mt-24 pb-28 md:pb-40" aria-labelledby="gallery-title">
        <div className="container-x">
          <SectionHeading
            index="06"
            eyebrow="Through my lens"
            id="gallery-title"
            intro="Frames from the trail — straight from the vlogs, Shorts and the camera roll."
            action={
              site.socials.instagram ? (
                <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer me" className="btn btn-ghost">
                  <InstagramIcon width={18} height={18} /> {instaHandle}
                </a>
              ) : null
            }
          >
            The <span className="text-glow">feed</span>
          </SectionHeading>

          <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
            {gallery.map((g, i) => {
              const ratio = g.shape === "tall" ? "aspect-[9/16]" : g.shape === "wide" ? "aspect-video" : "aspect-square";
              const inner = (
                <>
                  <Image src={g.src} alt={g.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" className="object-cover" />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                  <span className="hud absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {g.label}
                  </span>
                </>
              );
              return (
                <Reveal key={g.src} delay={(i % 4) * 70} variant="blur" className="break-inside-avoid">
                  {g.href ? (
                    <a href={g.href} target="_blank" rel="noopener noreferrer" className={`glow-border card-zoom group relative block overflow-hidden rounded-2xl bg-panel-2 ${ratio}`}>
                      {inner}
                    </a>
                  ) : (
                    <div className={`glow-border card-zoom group relative overflow-hidden rounded-2xl bg-panel-2 ${ratio}`}>{inner}</div>
                  )}
                </Reveal>
              );
            })}
            {site.socials.instagram && (
              <Reveal variant="blur" className="break-inside-avoid">
                <a
                  href={site.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="group relative flex aspect-square flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-rose via-indigo to-neon/80 p-6 text-ink"
                >
                  <InstagramIcon width={32} height={32} className="text-snow transition duration-500 group-hover:rotate-12 group-hover:scale-110" />
                  <span>
                    <span className="block font-display text-2xl font-bold leading-tight text-snow">More on Instagram</span>
                    <span className="hud mt-2 inline-flex items-center gap-1 text-snow/90">
                      {instaHandle} <ArrowUpRightIcon width={12} height={12} />
                    </span>
                  </span>
                </a>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ================= JOURNEY ================= */}
      <section className="pb-28 md:pb-40" aria-labelledby="journey-title">
        <div className="container-x">
          <SectionHeading index="07" eyebrow="Changelog" id="journey-title" align="center">
            The journey <span className="text-glow">so far</span>
          </SectionHeading>
          <ol className="relative mx-auto max-w-4xl">
            <span className="absolute bottom-0 left-4 top-0 w-px bg-line md:left-1/2" aria-hidden="true" />
            <span className="timeline-progress absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-neon via-gold to-rose shadow-[0_0_12px_var(--color-neon)] md:left-1/2" aria-hidden="true" />
            {[...timeline].reverse().map((t, i) => {
              const right = i % 2 === 1;
              return (
                <li key={t.title} className={`relative pb-10 pl-12 md:w-1/2 md:pl-0 ${right ? "md:ml-auto md:pl-12" : "md:pr-12 md:text-right"}`}>
                  <span
                    className={`absolute left-4 top-6 size-3 -translate-x-1/2 rounded-full bg-neon shadow-[0_0_0_5px_var(--color-ink),0_0_20px_var(--color-neon)] ${right ? "md:left-0" : "md:left-auto md:right-0 md:translate-x-1/2"}`}
                    aria-hidden="true"
                  />
                  <Reveal variant={right ? "right" : "left"} className="glass glow-border spot rounded-2xl p-6">
                    <p className="hud text-neon">{t.date}</p>
                    <h3 className="mt-3 font-display text-lg font-bold tracking-tight">{t.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone">{t.text}</p>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ================= MERCH ================= */}
      <section className="pb-28 md:pb-40" aria-labelledby="shop-title">
        <div className="container-x">
          <SectionHeading
            index="08"
            eyebrow="Merch · launching soon"
            id="shop-title"
            intro="XploreWithKrrish drops and locally sourced Himachali goodies, straight from the hills."
            action={
              <Link href="/shop" className="btn btn-primary">
                Visit the store <ArrowUpRightIcon width={16} height={16} className="btn-arrow" />
              </Link>
            }
          >
            Wear the <span className="text-glow">mountains</span>
          </SectionHeading>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {merch.map((p, i) => (
              <ProductCard key={p.slug} product={p} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
