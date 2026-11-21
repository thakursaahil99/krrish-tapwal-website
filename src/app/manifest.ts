import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.brand}`,
    short_name: site.name,
    description: site.shortBio,
    start_url: "/",
    display: "standalone",
    background_color: "#07080f",
    theme_color: "#ff7a2f",
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
