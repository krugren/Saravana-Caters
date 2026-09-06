import type { Metadata } from "next";
import AboutClient from "./_about-client";
import BreadcrumbSchema from "@/components/seo/breadcrumb-schema";

export const metadata: Metadata = {
  title: "About Us — Saravana Caters",
  description:
    "Two decades of traditional South Indian catering in Erode. Learn the story behind Saravana Caters — family-run since 2004, built on fresh ingredients, on-time service and recipes passed down through generations.",
  alternates: { canonical: "https://saravanacaters.in/about" },
  openGraph: { url: "https://saravanacaters.in/about", title: "Our Story — Saravana Caters Erode" },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[{ name: "About Us", url: "https://saravanacaters.in/about" }]}
      />
      <AboutClient />
    </>
  );
}
