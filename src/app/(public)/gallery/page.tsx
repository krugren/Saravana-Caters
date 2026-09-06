import type { Metadata } from "next";
import BreadcrumbSchema from "@/components/seo/breadcrumb-schema";
import GalleryPageClient from "./_gallery-client";
import { db } from "@/db";
import { gallery_images } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Gallery — Saravana Caters",
  description:
    "Browse our gallery of traditional South Indian catering — weddings, corporate events, and house functions in Erode. Authentic food, beautifully served.",
  alternates: { canonical: "https://saravanacaters.in/gallery" },
  openGraph: {
    url: "https://saravanacaters.in/gallery",
    title: "Gallery — Saravana Caters Erode",
    description:
      "See the authentic traditional South Indian feasts Saravana Caters has served at weddings, corporate events, and house functions across Erode.",
    images: [
      {
        url: "/images/hero-feast.png",
        width: 1200,
        height: 630,
        alt: "Traditional South Indian catering feast by Saravana Caters",
      },
    ],
  },
};

export default async function Gallery() {
  // Direct DB query — no "use server" module import (would break route group in Next.js 16)
  const images = await db
    .select()
    .from(gallery_images)
    .where(eq(gallery_images.isActive, true))
    .orderBy(asc(gallery_images.sortOrder));

  return (
    <>
      <BreadcrumbSchema
        items={[{ name: "Gallery", url: "https://saravanacaters.in/gallery" }]}
      />
      <GalleryPageClient images={images} />
    </>
  );
}
