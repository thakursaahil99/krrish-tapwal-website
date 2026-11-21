import Image from "next/image";
import type { Product } from "@/data/shop";
import { site } from "@/data/site";
import { ArrowUpRightIcon } from "./icons";
import Reveal from "./Reveal";

const tones: Record<Product["tone"], string> = {
  coral: "from-indigo/40 to-rose/20",
  violet: "from-rose/50 to-gold/10",
  teal: "from-gold/40 to-rose/15",
  silver: "from-snow/20 to-gold/10",
  mustard: "from-neon/35 to-gold/10",
  leaf: "from-neon/30 to-rose/20",
};

function notifyHref(p: Product) {
  const msg = `Hi Krrish, I'm interested in "${p.name}". Please let me know when it launches.`;
  if (site.socials.whatsapp) return `${site.socials.whatsapp}${site.socials.whatsapp.includes("?") ? "&" : "?"}text=${encodeURIComponent(msg)}`;
  if (site.email) return `mailto:${site.email}?subject=${encodeURIComponent(`Notify me: ${p.name}`)}&body=${encodeURIComponent(msg)}`;
  if (site.socials.instagram) return site.socials.instagram;
  return site.youtube.subscribeUrl;
}

/** Glass product tile with a gradient glow behind a floating emoji / photo */
export default function ProductCard({ product: p, delay = 0, showDescription = false }: { product: Product; delay?: number; showDescription?: boolean }) {
  const available = p.status === "available";
  const href = available && p.buyUrl ? p.buyUrl : notifyHref(p);
  return (
    <Reveal delay={delay} as="article" className="group h-full">
      <a href={href} target="_blank" rel="noopener noreferrer" className="glass glow-border spot flex h-full flex-col rounded-3xl p-2.5">
        <div className={`relative grid aspect-square place-items-center overflow-hidden rounded-2xl bg-gradient-to-br ${tones[p.tone]}`}>
          <div className="grid-bg absolute inset-0 opacity-70" />
          {p.image ? (
            <Image src={p.image} alt={p.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
          ) : (
            <span
              className="relative animate-float text-[4.5rem] drop-shadow-[0_20px_30px_rgb(0_0_0/0.5)] transition duration-700 group-hover:scale-110 sm:text-8xl"
              style={{ animationDelay: `${-delay * 10}ms` }}
              aria-hidden="true"
            >
              {p.emoji}
            </span>
          )}
          <span className="glass hud absolute left-3 top-3 rounded-full px-3 py-1.5 !text-[0.6rem]">{available ? "In stock" : "Coming soon"}</span>
        </div>
        <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
          <p className="hud text-stone">{p.category}</p>
          <h3 className="mt-2 text-lg font-semibold leading-snug transition-colors group-hover:text-neon sm:text-xl">{p.name}</h3>
          {showDescription && <p className="mt-2 text-sm leading-relaxed text-stone">{p.description}</p>}
          <p className="mt-auto flex items-center justify-between pt-5 text-sm font-semibold">
            <span>{available && p.price ? `₹${p.price.toLocaleString("en-IN")}` : "Notify me"}</span>
            <span className="grid size-9 place-items-center rounded-full bg-snow/10 transition duration-500 group-hover:rotate-45 group-hover:bg-neon group-hover:text-ink">
              <ArrowUpRightIcon width={16} height={16} />
            </span>
          </p>
        </div>
      </a>
    </Reveal>
  );
}
