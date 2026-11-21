import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { BellIcon, MountainIcon, SparkIcon, YouTubeIcon } from "@/components/icons";
import { JsonLd, PageHero, SectionHeading } from "@/components/ui";
import { products } from "@/data/shop";
import { site } from "@/data/site";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { thumb } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "The upcoming Krrish Tapwal store will feature XploreWithKrrish merchandise and locally sourced products from Himachal Pradesh.",
  alternates: { canonical: "/shop" },
  openGraph: { url: "/shop", title: "Krrish Store — Coming soon", description: "Merch, Pahadi desi ghee & Himachali goodies." },
  robots: { index: false, follow: true },
};

const promises = [
  { t: "Sourced locally", d: "Products from Himachal's villages and local makers.", Icon: MountainIcon },
  { t: "Quality first", d: "Thoughtfully selected products with clear information.", Icon: SparkIcon },
  { t: "Community first", d: "Early access and drop alerts for subscribers.", Icon: BellIcon },
];

export default function ShopPage() {
  const categories = Array.from(new Set(products.map((p) => p.category)));
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
          ]),
        )}
      />

      <PageHero
        eyebrow="Store · Launching soon"
        image={thumb("HAmoqYBhXBA", "max")}
        title={
          <>
            The <span className="text-glow">drop</span>
          </>
        }
      >
        <p>{site.brand} merch and handpicked Himachali goodies — delivered from the hills to your home.</p>
      </PageHero>

      <section className="pb-20" aria-label="Store promises">
        <div className="container-x grid gap-4 sm:grid-cols-3">
          {promises.map(({ t, d, Icon }, i) => (
            <Reveal key={t} delay={i * 80} className="glass glow-border spot group flex items-start gap-4 rounded-3xl p-6">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-neon/10 text-neon ring-1 ring-neon/30 transition duration-500 group-hover:bg-neon group-hover:text-ink">
                <Icon width={22} height={22} />
              </span>
              <span>
                <span className="block font-display text-lg font-bold tracking-tight">{t}</span>
                <span className="mt-1 block text-sm leading-relaxed text-stone">{d}</span>
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      {categories.map((cat, ci) => (
        <section key={cat} className="pb-24" aria-labelledby={`cat-${ci}`}>
          <div className="container-x">
            <SectionHeading index={`0${ci + 1}`} eyebrow="Collection" id={`cat-${ci}`}>
              {cat}
            </SectionHeading>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {products
                .filter((p) => p.category === cat)
                .map((p, i) => (
                  <ProductCard key={p.slug} product={p} delay={i * 80} showDescription />
                ))}
            </div>
          </div>
        </section>
      ))}

      <section className="pb-28 md:pb-40">
        <div className="container-x">
          <Reveal variant="scale" className="glass glow-border relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-12 md:py-24">
            <div className="absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon/20 blur-[100px]" aria-hidden="true" />
            <p className="eyebrow relative">Get notified</p>
            <h2 className="display-lg relative mx-auto mt-6 max-w-3xl">
              Be first in line for the <span className="text-glow">launch</span>
            </h2>
            <p className="relative mx-auto mt-6 max-w-lg text-lg text-stone">The store launch will be announced on YouTube. Subscribe and hit the bell.</p>
            <a href={site.youtube.subscribeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary relative mt-10">
              <YouTubeIcon width={18} height={18} /> Subscribe for updates
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
