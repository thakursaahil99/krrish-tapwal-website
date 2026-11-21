import { site } from "@/data/site";
import { shorts as staticShorts, videos as staticVideos, type Short, type Video, type VideoCategory } from "@/data/videos";

const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${site.youtube.channelId}`;
// Har 5 minute mein YouTube se nayi uploads + stats check hote hain (ISR).
// Note: page files mein `export const revalidate = 300` bhi isi value se match karta hai.
export const YT_REVALIDATE = 300;
// YouTube DP ki local copy — YouTube na mile to yeh dikhegi (favicon bhi isi se banta hai)
const PROFILE_IMAGE_FALLBACK = "/images/krrish-avatar.jpg";
const PROFILE_PAGE_URL = `https://www.youtube.com/${site.youtube.handle}`;

type FeedEntry = {
  id: string;
  title: string;
  publishedAt: string;
  description: string;
  views?: number;
  isShort: boolean;
};

function decode(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function pick(block: string, re: RegExp) {
  const m = block.match(re);
  return m ? decode(m[1]) : "";
}

async function fetchFeed(): Promise<FeedEntry[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: YT_REVALIDATE } });
    if (!res.ok) return [];
    const xml = await res.text();
    return xml
      .split("<entry>")
      .slice(1)
      .map((block) => {
        const views = pick(block, /<media:statistics views="(\d+)"/);
        return {
          id: pick(block, /<yt:videoId>([^<]+)<\/yt:videoId>/),
          title: pick(block, /<title>([^<]*)<\/title>/),
          publishedAt: pick(block, /<published>([^<]+)<\/published>/),
          description: pick(block, /<media:description>([\s\S]*?)<\/media:description>/),
          views: views ? Number(views) : undefined,
          isShort: /\/shorts\//.test(pick(block, /<link rel="alternate" href="([^"]+)"/)),
        };
      })
      .filter((e) => e.id);
  } catch {
    return [];
  }
}

/** Nayi video ke title/description se category khud tay karta hai */
function guessCategory(text: string): VideoCategory {
  const t = text.toLowerCase();
  if (/(mandir|temple|mata|baba|devi|maa |dham|jai |bhandara|fort|garh|qila)/.test(t)) return "temples";
  if (/(scorpio|royal enfield|meteor|bike|\bride|\bcar\b|thar|mahindra|bullet|\d+cc\b)/.test(t)) return "rides";
  if (/(job|life|diwali|holi|family|story|journey|vlog 20|day in)/.test(t)) return "life";
  return "travel";
}

export type ChannelStats = { subscribers: number; views: number; videos: number };

export async function getChannelProfileImage(): Promise<string> {
  try {
    const res = await fetch(PROFILE_PAGE_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Cookie: "CONSENT=YES+1",
      },
      next: { revalidate: YT_REVALIDATE },
    });
    if (!res.ok) {
      console.warn(`Could not load the YouTube channel page for its profile image: ${res.status}`);
      return PROFILE_IMAGE_FALLBACK;
    }

    const html = await res.text();
    const rawUrl = html.match(/"avatar"\s*:\s*\{"thumbnails":\[\{"url":"([^"]+)"/)?.[1];
    if (!rawUrl) {
      console.warn("The YouTube channel page did not include a profile image; using the local fallback.");
      return PROFILE_IMAGE_FALLBACK;
    }

    const avatarUrl = new URL(rawUrl.replace(/\\u0026/g, "&").replace(/\\\//g, "/"));
    if (avatarUrl.hostname !== "yt3.googleusercontent.com" && avatarUrl.hostname !== "yt3.ggpht.com") {
      console.warn("The YouTube channel profile image URL used an unexpected host; using the local fallback.");
      return PROFILE_IMAGE_FALLBACK;
    }

    return avatarUrl.toString();
  } catch (error) {
    console.error("Failed to fetch the current YouTube profile image.", error);
    return PROFILE_IMAGE_FALLBACK;
  }
}

function parseCount(raw?: string) {
  if (!raw) return undefined;
  const m = raw.replace(/,/g, "").match(/([\d.]+)\s*([KMB])?/i);
  if (!m) return undefined;
  const mult = { K: 1e3, M: 1e6, B: 1e9 }[(m[2] ?? "").toUpperCase() as "K" | "M" | "B"] ?? 1;
  return Math.round(parseFloat(m[1]) * mult);
}

/**
 * Subscribers / views / video count — YouTube channel page se live.
 * Agar YouTube kabhi block kare to site.ts wale numbers dikhte hain (site kabhi nahi tootegi).
 */
export async function getChannelStats(): Promise<ChannelStats> {
  const fallback = { subscribers: site.stats.subscribers, views: site.stats.views, videos: site.stats.videos };
  try {
    const res = await fetch(`https://www.youtube.com/channel/${site.youtube.channelId}/about`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Cookie: "CONSENT=YES+1",
      },
      next: { revalidate: YT_REVALIDATE },
    });
    if (!res.ok) return fallback;
    const html = await res.text();
    const grab = (key: string) => html.match(new RegExp(`"${key}":"([^"]+)"`))?.[1];
    const subscribers = parseCount(grab("subscriberCountText"));
    const views = parseCount(grab("viewCountText"));
    const videos = parseCount(grab("videoCountText"));
    return {
      subscribers: subscribers && subscribers >= fallback.subscribers * 0.5 ? subscribers : fallback.subscribers,
      views: views && views >= fallback.views * 0.5 ? views : fallback.views,
      videos: videos && videos > 0 ? videos : fallback.videos,
    };
  } catch {
    return fallback;
  }
}

const byDateDesc = (a: { publishedAt: string }, b: { publishedAt: string }) =>
  +new Date(b.publishedAt) - +new Date(a.publishedAt);

/**
 * Static data (src/data/videos.ts) + live RSS feed ko merge karta hai.
 * Nayi upload aate hi site par apne aap dikh jaati hai; views bhi refresh hote hain.
 */
export async function getChannelContent(): Promise<{ videos: Video[]; shorts: Short[] }> {
  const feed = await fetchFeed();
  const feedById = new Map(feed.map((e) => [e.id, e]));

  const videos: Video[] = staticVideos.map((v) => {
    const live = feedById.get(v.id);
    return live?.views !== undefined ? { ...v, views: Math.max(live.views, v.views ?? 0) } : v;
  });
  const shorts: Short[] = staticShorts.map((s) => {
    const live = feedById.get(s.id);
    return live?.views !== undefined ? { ...s, views: Math.max(live.views, s.views ?? 0) } : s;
  });

  const known = new Set([...videos.map((v) => v.id), ...shorts.map((s) => s.id)]);
  for (const e of feed) {
    if (known.has(e.id)) continue;
    if (e.isShort) {
      shorts.push({ id: e.id, title: e.title, publishedAt: e.publishedAt, views: e.views });
    } else {
      videos.push({
        id: e.id,
        title: e.title,
        description: e.description.split("\n").find((l) => l.trim()) ?? e.title,
        publishedAt: e.publishedAt,
        views: e.views,
        category: guessCategory(e.title + " " + e.description),
      });
    }
  }

  return { videos: videos.sort(byDateDesc), shorts: shorts.sort(byDateDesc) };
}

// "oar" = Shorts ka original portrait (9:16) frame
const thumbFile = { hq: "hqdefault", mq: "mqdefault", sd: "sddefault", max: "maxresdefault", oar: "oardefault" } as const;
export const thumb = (id: string, size: keyof typeof thumbFile = "hq") => `https://i.ytimg.com/vi/${id}/${thumbFile[size]}.jpg`;

export const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const shortUrl = (id: string) => `https://www.youtube.com/shorts/${id}`;
