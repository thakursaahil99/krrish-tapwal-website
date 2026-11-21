import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import Socials from "@/components/Socials";
import Thumb from "@/components/Thumb";
import { ArrowUpRightIcon, BikeIcon, ChartIcon, CodeIcon, CompassIcon, MapPinIcon } from "@/components/icons";
import { JsonLd, PageHero, PlayBadge, SectionHeading, StatTile } from "@/components/ui";
import { site } from "@/data/site";
import { places, timeline } from "@/data/videos";
import { breadcrumbSchema, faqSchema, graph, profilePageSchema } from "@/lib/schema";
import { getChannelProfileImage, getChannelStats, thumb, watchUrl } from "@/lib/youtube";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "About — CSE Engineer & Data Scientist",
  description:
    "Meet Krrish Tapwal: a Himachal-based explorer, Computer Science Engineering professional, and data scientist sharing travel stories through XploreWithKrrish.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", title: "About Krrish Tapwal", description: site.shortBio },
};

const faqs = [
  {
    q: "Who is Krrish Tapwal?",
    a: `Krrish Tapwal (also known as Krizz Tapwal) is a Himachal-based explorer, Computer Science Engineering professional, data scientist, and creator of ${site.brand} on YouTube (${site.youtube.handle}).`,
  },
  {
    q: "Where is Krrish Tapwal from?",
    a: "Krrish Tapwal is from Himachal Pradesh, India. His videos feature the Sarkaghat and Mandi region, including Kamlah Fort, Kanchana Mata Temple at Anantpur Garh, Awahdevi, and Chandpur.",
  },
  {
    q: "What is Krrish Tapwal's YouTube channel?",
    a: `His YouTube channel is ${site.brand} — ${site.youtube.url}. Launched in March 2020, it features Himachal travel, treks, historic temples, Royal Enfield Meteor 350 rides, and the Mahindra Scorpio Classic S11.`,
  },
  {
    q: "Which bike and car does Krrish Tapwal ride?",
    a: "Krrish rides a Royal Enfield Meteor 350 Fireball Black and drives a Mahindra Scorpio Classic S11, both featured in his videos.",
  },
  {
    q: "How can I collaborate with Krrish Tapwal?",
    a: "For collaborations, brand partnerships, and travel features, get in touch through his YouTube channel or the social links on this website.",
  },
];

const identityIcons = [CompassIcon, CodeIcon, ChartIcon, BikeIcon];

export default async function AboutPage() {
  const [live, profileImage] = await Promise.all([getChannelStats(), getChannelProfileImage()]);

  return (
    <>
      <JsonLd
        data={graph(
          profilePageSchema("/about", "About Krrish Tapwal"),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
          faqSchema(faqs),
        )}
      />

      <PageHero
        eyebrow="About · Creator file"
        image={thumb("QHAmMv4mdRE", "max")}
        imagePosition="center 30%"
        title={
          <>
            The <span className="text-glow">human</span>
            <br />
            behind the lens
          </>
        }
        aside={
          <div className="glass glow-border rounded-[2rem] p-6">
            <div className="flex items-center gap-4">
              <span className="relative size-20 shrink-0 overflow-hidden rounded-2xl ring-1 ring-line">
                <Image src={profileImage} alt="Current YouTube profile photo of Krrish Tapwal" fill sizes="80px" className="object-cover object-top" />
              </span>
              <div>
                <p className="font-display text-xl font-bold tracking-tight">{site.name}</p>
                <p className="hud mt-1 text-neon">{site.role}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-stone">
                  <MapPinIcon width={14} height={14} /> {site.location.area}, HP
                </p>
              </div>
            </div>
            <Socials className="mt-6" />
          </div>
        }
      >
        <p>{site.shortBio}</p>
      </PageHero>

      {/* Story */}
      <section className="py-28 md:py-40" aria-labelledby="story-title">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal variant="clip" className="glow-border relative aspect-[4/5] overflow-hidden rounded-[2rem]">
              <Image src="/images/krrish-tapwal-portrait.jpg" alt={`Portrait of ${site.name} by a Himalayan lake`} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <p className="hud absolute bottom-5 left-5 text-snow/80">// est. {site.stats.since}</p>
            </Reveal>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              <StatTile label="Subscribers">
                <CountUp value={live.subscribers} />
              </StatTile>
              <StatTile label="Views">
                <span className="text-neon">
                  <CountUp value={live.views} compact />
                </span>
              </StatTile>
              <StatTile label="Uploads">
                <CountUp value={live.videos} />+
              </StatTile>
              <StatTile label="Since">{site.stats.since}</StatTile>
            </dl>
            <p className="hud mt-4 text-muted">Live YouTube stats · refreshed every 15 min</p>
          </div>

          <div>
            <Reveal>
              <p className="eyebrow">My story</p>
            </Reveal>
            <Reveal delay={80} variant="blur">
              <h2 id="story-title" className="display-lg mt-6">
                From code to <span className="text-glow">cliffside</span> trails.
              </h2>
            </Reveal>
            <div className="mt-10 space-y-7 text-lg leading-relaxed text-stone">
              {site.longBio.map((para, i) => (
                <Reveal key={i} delay={i * 60} as="p" className={i === 0 ? "text-2xl leading-relaxed text-snow" : ""}>
                  {para}
                </Reveal>
              ))}
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2">
              {site.identities.map((id, i) => {
                const Icon = identityIcons[i];
                return (
                  <Reveal key={id.title} delay={i * 70} className="glass glow-border spot group rounded-3xl p-6">
                    <span className="grid size-12 place-items-center rounded-2xl bg-snow/5 text-neon ring-1 ring-line transition duration-500 group-hover:rotate-[-8deg] group-hover:bg-neon group-hover:text-ink">
                      <Icon width={22} height={22} />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-bold tracking-tight">{id.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone">{id.text}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Places explored */}
      <section className="pb-28 md:pb-40" aria-labelledby="places-title">
        <div className="container-x">
          <SectionHeading index="01" eyebrow="Explored" id="places-title" intro="Remarkable places across Mandi and Sarkaghat, from historic forts to hilltop temples.">
            Places I&apos;ve <span className="text-glow">explored</span>
          </SectionHeading>
          <div className="grid gap-5 sm:grid-cols-2">
            {places.map((p, i) => (
              <Reveal key={p.name} delay={(i % 2) * 100} variant="scale" as="article">
                <a href={watchUrl(p.videoId)} target="_blank" rel="noopener noreferrer" className="glow-border group card-zoom relative block aspect-[4/3] overflow-hidden rounded-[2rem] bg-panel-2">
                  <Thumb id={p.videoId} alt={`${p.name}, ${p.area}`} sizes="(min-width: 640px) 50vw, 100vw" />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                  <span className="absolute inset-0 grid place-items-center opacity-0 transition duration-500 group-hover:opacity-100">
                    <PlayBadge />
                  </span>
                  <span className="hud absolute left-5 top-5 rounded-full bg-ink/70 px-3 py-1.5 backdrop-blur">0{i + 1}</span>
                  <span className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <span className="hud inline-flex items-center gap-1.5 text-neon">
                      <MapPinIcon width={12} height={12} /> {p.area}
                    </span>
                    <span className="mt-2 block font-display text-2xl font-bold tracking-tight sm:text-3xl">{p.name}</span>
                    <span className="mt-2 block max-w-md text-sm leading-relaxed text-snow/70">{p.note}</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="pb-28 md:pb-40" aria-labelledby="journey-title">
        <div className="container-x">
          <SectionHeading index="02" eyebrow="Changelog" id="journey-title">
            The journey <span className="text-glow">so far</span>
          </SectionHeading>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {timeline.map((t, i) => (
              <Reveal key={t.title} as="li" delay={(i % 4) * 70} className="glass glow-border spot flex flex-col rounded-3xl p-6">
                <span className="flex items-center justify-between">
                  <span className="hud text-neon">{t.date}</span>
                  <span className="hud text-muted">v{i + 1}.0</span>
                </span>
                <h3 className="mt-6 font-display text-lg font-bold leading-snug tracking-tight">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">{t.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-28 md:pb-40" aria-labelledby="faq-title">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <SectionHeading index="03" eyebrow="FAQ" id="faq-title">
              Questions, <span className="text-glow">answered</span>
            </SectionHeading>
            <Reveal>
              <Link href="/videos" className="btn btn-primary">
                Watch my videos <ArrowUpRightIcon width={16} height={16} className="btn-arrow" />
              </Link>
            </Reveal>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <details className="glass glow-border group rounded-2xl px-6 py-5 open:bg-snow/[0.07]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-snow/10 text-xl transition duration-500 group-open:rotate-45 group-open:bg-neon group-open:text-ink">+</span>
                  </summary>
                  <p className="mt-4 leading-relaxed text-stone">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
