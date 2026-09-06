import type { Metadata } from "next";
import ReviewsClient from "./_reviews-client";
import BreadcrumbSchema from "@/components/seo/breadcrumb-schema";

export const metadata: Metadata = {
  title: "Reviews — Saravana Caters",
  description:
    "Read what families across Erode say about Saravana Caters. 20 years of trust, 1,000+ events — see why we are Erode's most recommended catering service.",
  alternates: { canonical: "https://saravanacaters.in/reviews" },
  openGraph: { url: "https://saravanacaters.in/reviews", title: "Customer Reviews — Saravana Caters Erode" },
};

// Individual Review structured data — powers Google's review rich snippets
// and signals authenticity to AI models that cite businesses
const reviewsSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Saravana Caters — Traditional South Indian Catering",
  "description": "Traditional South Indian catering service for weddings, corporate events, house functions, and temple ceremonies in Erode and surrounding districts.",
  "brand": { "@type": "Brand", "name": "Saravana Caters" },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "280",
    "bestRating": "5",
    "worstRating": "1",
  },
  "review": [
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Rajasekaran M." },
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "reviewBody": "We've booked Saravana Caters for three family weddings. Every time, the food is what guests talk about on the drive home. The sambar alone is worth picking up the phone.",
      "datePublished": "2024-11-10",
    },
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Priya Ramamurthy" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "reviewBody": "We booked Saravana Caters for our daughter's wedding and they exceeded every expectation. The banana leaf service was flawless, food was hot and plentiful, and not a single guest complained.",
      "datePublished": "2024-03-22",
    },
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Karthik Selvam" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "reviewBody": "Punctual, professional, clean. Our MD was impressed by the setup. The sambar and rasam tasted like home cooking — not institutional food. Will book again for our annual day.",
      "datePublished": "2024-06-15",
    },
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Meenakshi Venkatesh" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "reviewBody": "They cooked exactly what we asked for, added a few suggestions that made it better, and the team served with such warmth. My father-in-law said it was the best meal he'd had in years.",
      "datePublished": "2024-08-01",
    },
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Lakshmi Chandrasekaran" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "reviewBody": "Found them through a reference and so glad we did. Booking was easy, they called twice to confirm details, arrived an hour early, set up beautifully. The Kesari and Payasam were exceptional. Truly professional.",
      "datePublished": "2025-01-18",
    },
  ],
};

export default function ReviewsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[{ name: "Reviews", url: "https://saravanacaters.in/reviews" }]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />
      <ReviewsClient />
    </>
  );
}
