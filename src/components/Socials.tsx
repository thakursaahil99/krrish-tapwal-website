import { site, type SocialKey } from "@/data/site";
import { FacebookIcon, InstagramIcon, LinkedInIcon, MailIcon, WhatsAppIcon, XIcon, YouTubeIcon } from "./icons";

const meta: Record<SocialKey, { label: string; Icon: typeof YouTubeIcon }> = {
  youtube: { label: "YouTube", Icon: YouTubeIcon },
  instagram: { label: "Instagram", Icon: InstagramIcon },
  facebook: { label: "Facebook", Icon: FacebookIcon },
  x: { label: "X (Twitter)", Icon: XIcon },
  linkedin: { label: "LinkedIn", Icon: LinkedInIcon },
  whatsapp: { label: "WhatsApp", Icon: WhatsAppIcon },
};

export function activeSocials() {
  return (Object.keys(site.socials) as SocialKey[])
    .filter((k) => site.socials[k])
    .map((k) => ({ key: k, href: site.socials[k], ...meta[k] }));
}

/**
 * Round social buttons.
 *  - "glass": frosted circles with a snow glyph (dark sections)
 *  - "dark":  ink circles with a snow glyph (cream sections)
 */
export default function Socials({ className = "", variant = "glass" }: { className?: string; variant?: "glass" | "dark" }) {
  const circle = variant === "glass" ? "glass text-snow hover:bg-neon hover:text-ink hover:border-neon" : "bg-ink text-snow hover:bg-neon hover:text-ink";
  return (
    <ul className={`flex flex-wrap items-center gap-3 ${className}`}>
      {activeSocials().map(({ key, href, label, Icon }) => (
        <li key={key}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer me"
            aria-label={`${site.name} on ${label}`}
            className={`grid size-12 place-items-center rounded-full transition duration-300 hover:-translate-y-1 ${circle}`}
          >
            <Icon width={19} height={19} />
          </a>
        </li>
      ))}
      {site.email && (
        <li>
          <a href={`mailto:${site.email}`} aria-label={`Email ${site.name}`} className={`grid size-12 place-items-center rounded-full transition duration-300 hover:-translate-y-1 ${circle}`}>
            <MailIcon width={18} height={18} />
          </a>
        </li>
      )}
    </ul>
  );
}
