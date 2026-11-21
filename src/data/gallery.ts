/**
 * GALLERY — "Through My Lens" (Home page).
 *
 * Abhi photos YouTube videos/Shorts ke frames se aa rahi hain.
 * Instagram ki photos daalni ho to:
 *   1. Photo ko `public/images/insta/` folder mein save karo (e.g. kamlah.jpg)
 *   2. Neeche list mein add karo:
 *      { src: "/images/insta/kamlah.jpg", alt: "Sunset at Kamlah Fort", label: "Kamlah Fort", shape: "tall" }
 *   `href` doge to photo click karne par wahan khulegi (Instagram post link).
 */

import { shortUrl, thumb, watchUrl } from "@/lib/youtube";

export type GalleryShot = {
  src: string;
  alt: string;
  label: string;
  href?: string;
  /** tall = 9:16, wide = 16:9, square = 1:1 */
  shape: "tall" | "wide" | "square";
};

const short = (id: string, label: string, alt: string): GalleryShot => ({ src: thumb(id, "oar"), alt, label, href: shortUrl(id), shape: "tall" });
const video = (id: string, label: string, alt: string): GalleryShot => ({ src: thumb(id, "max"), alt, label, href: watchUrl(id), shape: "wide" });

export const gallery: GalleryShot[] = [
  short("TkZFTEAF-mw", "Anant Garh", "Pine-covered valley below Anant Garh, Sarkaghat, under a bright sun"),
  { src: "/images/krrish-tapwal.jpg", alt: "Krrish Tapwal standing above a Himalayan lake", label: "Lakeside, Himachal", shape: "square" },
  video("QHAmMv4mdRE", "Kanchana Mata trail", "Krrish on the green hilltop trail to Kanchana Mata Temple"),
  short("NdLJ6ilUUjo", "Monsoon in Mandi", "Monsoon clouds over the hills of Mandi"),
  short("z5TH_VFqlQ8", "Kamlah Fort", "The ridge-top Kamlah Fort in Mandi district"),
  video("sbHuha-IWzY", "Kamlahgarh steps", "Stone steps climbing up to Kamlah Fort"),
  short("hdAgYMn7hXs", "Mountain roads", "Royal Enfield Meteor 350 on a winding mountain road"),
  video("49GLZkMXvqE", "Awahdevi", "Mata Awahdevi temple in the Himachal hills"),
  short("cituqHAXbiM", "Anantpur Garh", "Kanchana Mata Mandir at Anantpur Garh"),
  short("jXi5VNPuF24", "Scorpio Classic S11", "The black Mahindra Scorpio Classic S11"),
];
