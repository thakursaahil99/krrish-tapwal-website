import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <PageHero
      eyebrow="Error 404 · Signal lost"
      video={site.backgroundVideos.notFound}
      title={
        <>
          Trail <span className="text-glow">not found</span>
        </>
      }
    >
      <p>This page may have moved or no longer exists. Head back to base camp and keep exploring.</p>
      <Link href="/" className="btn btn-primary mt-8">
        Return home
      </Link>
    </PageHero>
  );
}
