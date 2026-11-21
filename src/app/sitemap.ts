import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getChannelContent, thumb } from "@/lib/youtube";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { videos } = await getChannelContent();
  const lastVideo = videos[0] ? new Date(videos[0].publishedAt) : new Date();

  return [
    {
      url: site.url,
      lastModified: lastVideo,
      changeFrequency: "weekly",
      priority: 1,
      images: [`${site.url}${site.profileImagePath}`],
    },
    {
      url: `${site.url}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      images: [`${site.url}${site.profileImagePath}`],
    },
    {
      url: `${site.url}/videos`,
      lastModified: lastVideo,
      changeFrequency: "weekly",
      priority: 0.8,
      images: videos.slice(0, 10).map((v) => thumb(v.id)),
    },
  ];
}
