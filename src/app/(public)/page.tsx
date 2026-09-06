import type { Metadata } from "next";
import Hero from "./_components/hero";
import MarqueeStrip from "./_components/marquee-strip";
import StorySection from "./_components/story-section";
import StatsSection from "./_components/stats-section";
import TrustPillars from "./_components/trust-pillars";
import EventsSection from "./_components/events-section";
import HowItWorks from "./_components/how-it-works";
import GallerySection from "./_components/gallery-section";
import Testimonials from "./_components/testimonials";
import CtaSection from "./_components/cta-section";
import { db } from "@/db";
import { config as configTable, testimonials as testimonialsTable, gallery_images } from "@/db/schema";
import { eq, asc, inArray } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Saravana Caters — Premium Traditional Catering in Erode",
  description:
    "Erode's most trusted catering service for weddings, receptions, corporate events and house functions. Authentic South Indian cuisine. 20+ years, 1,000+ events. Call +91 98427 22977.",
};

export default async function HomePage() {
  // Fetch live data in parallel — direct DB calls (no "use server" import needed)
  const [testimonialsData, galleryData, statsRows] = await Promise.all([
    db
      .select()
      .from(testimonialsTable)
      .where(eq(testimonialsTable.isActive, true))
      .orderBy(asc(testimonialsTable.sortOrder)),
    db
      .select()
      .from(gallery_images)
      .where(eq(gallery_images.isActive, true))
      .orderBy(asc(gallery_images.sortOrder)),
    db
      .select()
      .from(configTable)
      .where(
        inArray(configTable.key, [
          "stats.eventsCount",
          "stats.yearsOfService",
          "stats.guestsServed",
          "stats.menuVarieties",
        ])
      ),
  ]);

  // Map config rows to stat values
  const statMap = Object.fromEntries(statsRows.map(r => [r.key, Number(r.value)]));
  const stats = {
    eventsCount: statMap["stats.eventsCount"] ?? 1000,
    yearsOfService: statMap["stats.yearsOfService"] ?? 20,
    guestsServed: statMap["stats.guestsServed"] ?? 100000,
    menuVarieties: statMap["stats.menuVarieties"] ?? 50,
  };

  return (
    <div>
      <Hero />
      <MarqueeStrip />
      <StorySection />
      <StatsSection stats={stats} />
      <TrustPillars />
      <EventsSection />
      <HowItWorks />
      <GallerySection images={galleryData} />
      <Testimonials testimonials={testimonialsData} />
      <CtaSection />
    </div>
  );
}
