import type { Metadata } from "next";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import VideoGrid from "@/components/VideoGrid";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { YouTubeIcon } from "@/components/icons";
import { JsonLd, PageHero, SectionHeading, ShortCard } from "@/components/ui";
import { site } from "@/data/site";
import { formatDate } from "@/lib/format";
import { breadcrumbSchema, graph, videoSchema } from "@/lib/schema";
import { getChannelContent, getChannelStats, thumb } from "@/lib/youtube";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Videos & Shorts",
  description:
    "Watch all videos by Krrish Tapwal (XploreWithKrrish): Himachal travel vlogs, Kamlah Fort, Kanchana Mata Mandir, Awahdevi, Bengaluru to Himachal road trip, Royal Enfield Meteor 350, Scorpio Classic S11 and shorts.",
  alternates: { canonical: "/videos" },
  openGraph: { url: "/videos", title: "Videos by Krrish Tapwal", description: "Himachal travel vlogs, treks, temples, rides & shorts." },
};

export default async function VideosPage() {
  const [{ videos, shorts }, live] = await Promise.all([getChannelContent(), getChannelStats()]);
  const [featured] = videos;

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Videos", path: "/videos" },
          ]),
          {
            "@type": "ItemList",
            name: "Videos by Krrish Tapwal",
            itemListElement: videos.map((v, i) => ({ "@type": "ListItem", position: i + 1, item: videoSchema(v) })),
          },
        )}
      />

      <PageHero
        eyebrow={`${site.brand} · Channel`}
        image={thumb("sY2h1Gsx_ZI", "max")}
        title={
          <>
            Watch the <span className="text-glow">trail</span>
          </>
        }
        aside={
          <div className="glass glow-border rounded-[2rem] p-6">
            <dl className="grid grid-cols-3 gap-4">
              <div>
                <dt className="hud text-stone">Videos</dt>
                <dd className="mt-2 font-display text-3xl font-bold">
                  <CountUp value={videos.length} />
                </dd>
              </div>
              <div>
                <dt className="hud text-stone">Shorts</dt>
                <dd className="mt-2 font-display text-3xl font-bold">
                  <CountUp value={shorts.length} />
                </dd>
              </div>
              <div>
                <dt className="hud text-stone">Views</dt>
                <dd className="mt-2 font-display text-3xl font-bold text-neon">
                  <CountUp value={live.views} compact />
                </dd>
              </div>
            </dl>
            <a href={site.youtube.subscribeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6 w-full">
              <YouTubeIcon width={18} height={18} /> Subscribe
            </a>
          </div>
        }
      >
        <p>Every story from Himachal in one place — treks, temples, forts, rides and real-life moments.</p>
      </PageHero>

      {featured && (
        <section className="pb-24" aria-label="Latest video">
          <div className="container-x">
            <Reveal variant="scale">
              <YouTubeEmbed id={featured.id} title={featured.title} preload label={`Latest · ${formatDate(featured.publishedAt)}`} />
            </Reveal>
          </div>
        </section>
      )}

      <section className="pb-28 md:pb-40" aria-labelledby="all-videos">
        <div className="container-x">
          <SectionHeading index="01" eyebrow="Library" id="all-videos">
            All <span className="text-glow">videos</span>
          </SectionHeading>
          <VideoGrid videos={videos} />
        </div>
      </section>

      <section id="shorts" className="scroll-mt-24 pb-28 md:pb-40" aria-labelledby="shorts-heading">
        <div className="container-x">
          <SectionHeading index="02" eyebrow="Vertical" id="shorts-heading" intro={`${shorts.length} Shorts — quick moments from rides, temples and the mountains.`}>
            <span className="text-glow">Shorts</span>
          </SectionHeading>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {shorts.map((s, i) => (
              <Reveal key={s.id} delay={(i % 5) * 60} variant="blur">
                <ShortCard short={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
