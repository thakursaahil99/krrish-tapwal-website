import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <PageHero
      eyebrow="Error 404 · Signal lost"
      image="/images/krrish-tapwal.jpg"
      imagePosition="76% center"
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
