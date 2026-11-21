import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { getChannelProfileImage } from "@/lib/youtube";
import { ArrowUpRightIcon, MapPinIcon, YouTubeIcon } from "./icons";
import Marquee from "./Marquee";
import Reveal from "./Reveal";
import Socials, { activeSocials } from "./Socials";

export default async function Footer() {
  const year = new Date().getFullYear();
  const profileImage = await getChannelProfileImage();

  return (
    <footer className="relative overflow-hidden bg-ink">
      {/* ===== Big CTA ===== */}
      <section id="follow" className="relative scroll-mt-24 border-t border-line pt-24 md:pt-32" aria-labelledby="follow-title">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[60rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-neon/15 blur-[120px]" aria-hidden="true" />
        <div className="container-x relative">
          <div className="grid items-center gap-14 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <Reveal>
                <p className="eyebrow">Follow the journey</p>
              </Reveal>
              <Reveal delay={80} variant="blur">
                <h2 id="follow-title" className="display-lg mt-6">
                  Chalo, let&apos;s explore <span className="text-glow">Himachal</span> together.
                </h2>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-stone">
                  New trails, temples and road trips every month. Subscribe on YouTube, say hi on Instagram, or reach out for collaborations and travel features.
                </p>
              </Reveal>
              <Reveal delay={220} className="mt-10 flex flex-wrap gap-3">
                <a href={site.youtube.subscribeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-subscribe btn-primary">
                  <YouTubeIcon width={18} height={18} /> Subscribe on YouTube
                </a>
                {site.socials.instagram && (
                  <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer me" className="btn btn-ghost">
                    Instagram <ArrowUpRightIcon width={16} height={16} className="btn-arrow" />
                  </a>
                )}
              </Reveal>
            </div>

            {/* Profile card */}
            <Reveal variant="scale" delay={150}>
              <div className="glass relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
                <div className="flex items-center gap-5">
                  <span className="relative size-20 shrink-0 overflow-hidden rounded-full ring-2 ring-neon ring-offset-4 ring-offset-panel">
                    <Image src={profileImage} alt={`${site.name}, ${site.role}`} fill sizes="80px" className="object-cover object-top" />
                  </span>
                  <div>
                    <p className="font-display text-2xl font-bold tracking-tight">{site.name}</p>
                    <p className="text-sm text-stone">{site.youtube.handle}</p>
                  </div>
                </div>
                <dl className="mt-8 space-y-4 text-sm">
                  <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
                    <dt className="text-stone">Business & collabs</dt>
                    <dd className="text-right font-semibold">
                      {site.email ? (
                        <a href={`mailto:${site.email}`} className="link-underline">
                          {site.email}
                        </a>
                      ) : (
                        <a href={site.youtube.url} target="_blank" rel="noopener noreferrer" className="link-underline">
                          Message on YouTube
                        </a>
                      )}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
                    <dt className="text-stone">Based in</dt>
                    <dd className="inline-flex items-center gap-1.5 text-right font-semibold">
                      <MapPinIcon width={15} height={15} className="text-neon" />
                      {site.location.area}, HP
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-stone">Creating since</dt>
                    <dd className="font-semibold">{site.stats.since}</dd>
                  </div>
                </dl>
                <Socials className="mt-8" />
              </div>
            </Reveal>
          </div>
        </div>

        {/* Giant outlined brand ticker */}
        <div className="mt-24 select-none md:mt-32" aria-hidden="true">
          <Marquee
            className="text-snow/15"
            separator={<span className="text-neon">✦</span>}
            items={[site.brand, site.name, "Himachal Pradesh", "Pahadi Stories"].map((t) => (
              <span key={t} className="text-outline whitespace-nowrap font-display text-[clamp(4rem,12vw,10rem)] font-extrabold uppercase leading-none tracking-tight">
                {t}
              </span>
            ))}
          />
        </div>
      </section>

      {/* ===== Bottom bar ===== */}
      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-5 py-8 text-sm text-stone md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name} · {site.brand}
          </p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/videos", label: "Videos" },
                { href: "/shop", label: "Shop" },
                { href: "/sitemap.xml", label: "Sitemap" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-underline hover:text-snow">
                    {l.label}
                  </Link>
                </li>
              ))}
              {activeSocials().map((s) => (
                <li key={s.key} className="hidden md:block">
                  <a href={s.href} target="_blank" rel="noopener noreferrer me" className="link-underline hover:text-snow">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
