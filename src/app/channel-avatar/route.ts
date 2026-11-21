import { site } from "@/data/site";
import { getChannelProfileImage } from "@/lib/youtube";

export const revalidate = 300;

export async function GET() {
  const image = await getChannelProfileImage();
  return new Response(null, {
    status: 307,
    headers: {
      Location: new URL(image, site.url).toString(),
      "Cache-Control": "public, max-age=900, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
