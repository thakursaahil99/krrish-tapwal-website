import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk, Unbounded } from "next/font/google";
import Backdrop from "@/components/Backdrop";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { JsonLd } from "@/components/ui";
import { site } from "@/data/site";
import { graph, personSchema, websiteSchema } from "@/lib/schema";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
  display: "swap",
});
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

const title = `${site.name} — ${site.role} | ${site.brand}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s | ${site.name}`,
  },
  description: `${site.name} (Krizz Tapwal) is a Himachal-based explorer, Computer Science Engineering professional, and data scientist. Discover his travel stories, historic sites, and mountain journeys on ${site.brand}.`,
  applicationName: site.name,
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "Travel",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    firstName: site.firstName,
    lastName: site.lastName,
    username: site.youtube.handle,
    url: site.url,
    siteName: site.name,
    title,
    description: site.shortBio,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.shortBio,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  formatDetection: { telephone: false },
  // Google Search Console verification — code milne par yahan daalo:
  // verification: { google: "XXXXXXXXXXXX" },
};

export const viewport: Viewport = {
  themeColor: "#07080f",
  colorScheme: "dark",
};

/**
 * Lite mode — runs before first paint. Weak PCs/phones get `html.lite`, which switches off
 * looping animations, blur, glass and grain (see globals.css). Triggers:
 *   RAM ≤ 4 GB · CPU ≤ 4 threads · Data Saver · Reduced Motion · or low FPS measured after load.
 * Manual override: add ?lite=1 or ?lite=0 to the URL (remembered on that browser).
 */
const liteScript = `(function(){try{var d=document.documentElement,n=navigator,c=n.connection||{},o=null,q=/[?&]lite=([01])/.exec(location.search);
try{if(q)localStorage.setItem("lite",q[1]);o=localStorage.getItem("lite")}catch(e){}
var on=function(){d.classList.add("lite")};if(o==="1")return on();if(o==="0")return;
if(matchMedia("(prefers-reduced-motion: reduce)").matches||c.saveData||(n.deviceMemory&&n.deviceMemory<=4)||(n.hardwareConcurrency&&n.hardwareConcurrency<=4))return on();
addEventListener("load",function(){var f=0,s=0,t=function(now){if(!s)s=now;f++;if(now-s<1500)requestAnimationFrame(t);else if(f/((now-s)/1e3)<40)on()};requestAnimationFrame(t)})}catch(e){}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${unbounded.variable} ${grotesk.variable} ${jetbrains.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: liteScript }} />
      </head>
      <body className="min-h-dvh">
        <Backdrop />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-neon focus:px-4 focus:py-2 focus:text-ink">
          Skip to content
        </a>
        <JsonLd data={graph(personSchema(), websiteSchema())} />
        <Header />
        <main id="main">{children}</main>
        <div className="topi-band" aria-hidden="true" />
        <Footer />
      </body>
    </html>
  );
}
