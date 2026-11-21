/**
 * ============================================================
 *  SITE CONFIG — Saari personal details yahin se badlo.
 *  Edit this one file to update name, bio, links & stats.
 * ============================================================
 */

export const site = {
  // Live domain (bina trailing slash ke)
  url: "https://krrishtapwal.space",
  profileImagePath: "/channel-avatar",

  name: "Krrish Tapwal",
  firstName: "Krrish",
  lastName: "Tapwal",
  // Doosre naam jinse log search karte hain — SEO ke liye
  alternateNames: ["Krrish Tapwal", "KRRISH TAPWAL", "Krizz Tapwal", "XploreWithKrrish", "Xplore With Krrish"],
  brand: "XploreWithKrrish",
  role: "Himachal Explorer",
  tagline: "Exploring Himachal through its landscapes, heritage, road trips, and stories.",

  // Homepage hero copy
  hero: {
    kicker: "Sarkaghat · Mandi · Himachal Pradesh",
    lead: "Forgotten forts, hilltop temples, misty mountain roads — and the people who make every trail feel like home. Pahadi by heart, engineer by trade.",
  },

  /**
   * Har page ke hero ke peeche chalne wali (muted, faded, loop) YouTube video.
   * `id` = video ID (youtube.com/watch?v=YAHAN_WALA), `start` = kitne second se shuru ho (240 = 4 minute).
   * Video khatam hone par wapas `start` se hi chalti hai.
   * (Home hero ki photo apne aap aapki latest YouTube profile photo hoti hai.)
   */
  backgroundVideos: {
    home: { id: "QHAmMv4mdRE", start: 240 }, // Kanchana Mata Temple, Anantpur Garh
    about: { id: "Zt6EH13HBM8", start: 240 }, // Bengaluru → Himachal road trip
    videos: { id: "sY2h1Gsx_ZI", start: 240 }, // Morning ride in the mountains
    shop: { id: "xcYFq7LX7Is", start: 240 }, // Diwali at home
    notFound: { id: "sbHuha-IWzY", start: 240 }, // Kamlah Fort trail
  },

  // Site ki saari video cards / players muted autoplay hoti hain — is second se (240 = 4 minute).
  // (Shorts hamesha shuru se chalte hain; 4 min se chhoti video apne aap 0:00 se chalti hai.)
  videoPreviewStart: 240,

  // "Who I am" chips + cards (About & Home)
  identities: [
    { title: "Explorer", text: "Chasing hidden trails, old forts and temples above the clouds across Mandi district." },
    { title: "CSE Engineer", text: "A Computer Science Engineering professional who loves building with technology." },
    { title: "Data Scientist", text: "Turning numbers into insight by day — and footage into stories by night." },
    { title: "Rider", text: "Mountain mornings on a Meteor 350, family road trips in the Scorpio Classic." },
  ],
  location: {
    region: "Himachal Pradesh",
    area: "Sarkaghat, Mandi",
    country: "India",
    countryCode: "IN",
  },

  shortBio:
    "Krrish Tapwal is a Himachal-based explorer, Computer Science Engineering professional, and data scientist. Through XploreWithKrrish, he shares thoughtful travel stories, mountain journeys, and the culture of Himachal Pradesh.",

  longBio: [
    "I am Krrish Tapwal, a Himachal-based explorer, Computer Science Engineering professional, and data scientist. I am drawn to the region's lesser-known village trails, historic temples and forts, mountain roads, and the stories that make each place distinct.",
    "I started my YouTube channel, XploreWithKrrish, in 2020. It features journeys to places such as Kamlah Fort, Kanchana Mata Temple at Anantpur Garh, Mata Awahdevi Temple, and Baba Kamlahiya Temple, alongside long-distance road trips and rides on my Royal Enfield Meteor 350.",
    "Alongside my work in technology and data science, I share honest experiences from everyday life and career milestones, including the challenges of finding my first MIS Executive role. I hope these stories offer useful perspective to others navigating a similar path.",
    "My goal is to introduce more people to Himachal Pradesh's landscapes, heritage, and communities through thoughtful, authentic storytelling.",
  ],

  youtube: {
    channelId: "UCQxlcJ5k9U9l6jwr-VV-sfQ",
    handle: "@KRRISHTAPWAL001",
    url: "https://www.youtube.com/@KRRISHTAPWAL001",
    subscribeUrl: "https://www.youtube.com/@KRRISHTAPWAL001?sub_confirmation=1",
    joined: "2020-03-27",
  },

  // Stats — YouTube se liye gaye (Nov 2026). Time-time par update karte rehna.
  stats: {
    subscribers: 962,
    views: 64714,
    videos: 25,
    since: 2020,
    asOf: "November 2026",
  },

  /**
   * Social links: leave a value empty to hide its icon from the website.
   */
  socials: {
    youtube: "https://www.youtube.com/@KRRISHTAPWAL001",
    instagram: "https://www.instagram.com/krrish_thakur01/",
    facebook: "https://www.facebook.com/krishi.krishitapwal",
    x: "",
    linkedin: "",
    whatsapp: "", // e.g. "https://wa.me/91XXXXXXXXXX"
  } as Record<"youtube" | "instagram" | "facebook" | "x" | "linkedin" | "whatsapp", string>,

  // Business / collab email — khali chhodoge to email button nahi dikhega
  email: "" as string,

  keywords: [
    "Krrish Tapwal",
    "Krrish Tapwal YouTube",
    "Krrish Tapwal Himachal",
    "Krrish Tapwal Sarkaghat",
    "Krrish Tapwal CSE Engineer",
    "Krrish Tapwal Data Scientist",
    "Tapwal",
    "Krizz Tapwal",
    "XploreWithKrrish",
    "Xplore With Krrish",
    "Krrish Himachal vlogger",
    "Himachal vlogger",
    "Himachali YouTuber",
    "Sarkaghat vlogger",
    "Mandi Himachal Pradesh vlog",
    "Kamlah Fort vlog",
    "Kanchana Mata Mandir",
    "Awahdevi Mandir",
    "Baba Kamlahiya Mandir",
    "Himachal treks",
    "Royal Enfield Meteor 350 Fireball Black",
    "Scorpio Classic S11",
  ],
} as const;

export type SocialKey = keyof typeof site.socials;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/videos", label: "Videos" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/shop", label: "Shop" },
  { href: "#follow", label: "Contact" },
] as const;
