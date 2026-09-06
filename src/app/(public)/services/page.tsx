import type { Metadata } from "next";
import ServicesClient from "./_services-client";
import BreadcrumbSchema from "@/components/seo/breadcrumb-schema";

export const metadata: Metadata = {
  title: "Services — Saravana Caters",
  description:
    "Traditional South Indian catering for weddings, corporate events, house functions, temple ceremonies and more. Serving 50–5,000 guests across Erode, Namakkal, Salem and Coimbatore.",
  alternates: { canonical: "https://saravanacaters.in/services" },
  openGraph: { url: "https://saravanacaters.in/services", title: "Catering Services — Saravana Caters Erode" },
};

// Service-specific structured data for Google Knowledge Panel / service rich results
const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Saravana Caters — Service Packages",
  "description": "Traditional South Indian catering service packages for weddings, corporate events, house functions, and temple ceremonies in Erode.",
  "url": "https://saravanacaters.in/services",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Service",
        "name": "Wedding Catering",
        "description": "Full-day South Indian wedding catering with traditional banana leaf service, morning breakfast to evening reception. 100–5,000 guests across Erode and Kongu region.",
        "provider": { "@type": "LocalBusiness", "name": "Saravana Caters", "@id": "https://saravanacaters.in/#business" },
        "areaServed": "Erode, Tamil Nadu",
        "serviceType": "Wedding Catering",
      },
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "Service",
        "name": "Corporate Catering",
        "description": "Professional buffet and lunch catering for corporate events, product launches, and annual days. FSSAI-compliant, on-time delivery, 50–2,000 guests.",
        "provider": { "@type": "LocalBusiness", "name": "Saravana Caters", "@id": "https://saravanacaters.in/#business" },
        "areaServed": "Erode, Tamil Nadu",
        "serviceType": "Corporate Catering",
      },
    },
    {
      "@type": "ListItem",
      "position": 3,
      "item": {
        "@type": "Service",
        "name": "Traditional Package — Banana Leaf Feast",
        "description": "Authentic Tamil Nadu full course banana leaf meal with rice, sambar, rasam, kootu, poriyal, appalam, pickle, buttermilk and payasam. 200–1,000 guests.",
        "provider": { "@type": "LocalBusiness", "name": "Saravana Caters", "@id": "https://saravanacaters.in/#business" },
        "areaServed": "Erode, Tamil Nadu",
        "serviceType": "Traditional South Indian Catering",
      },
    },
    {
      "@type": "ListItem",
      "position": 4,
      "item": {
        "@type": "Service",
        "name": "Temple & Religious Functions",
        "description": "Satvik catering for temple festivals, Sashtiabdapoorthi, Seemantham, Namakarana, and religious ceremonies. 100–5,000 guests.",
        "provider": { "@type": "LocalBusiness", "name": "Saravana Caters", "@id": "https://saravanacaters.in/#business" },
        "areaServed": "Erode, Tamil Nadu",
        "serviceType": "Religious Function Catering",
      },
    },
    {
      "@type": "ListItem",
      "position": 5,
      "item": {
        "@type": "Service",
        "name": "Labour Catering Service",
        "description": "Professional kitchen staff (chefs and servers) for events where clients manage their own ingredients. 100–5,000 guests.",
        "provider": { "@type": "LocalBusiness", "name": "Saravana Caters", "@id": "https://saravanacaters.in/#business" },
        "areaServed": "Erode, Tamil Nadu",
        "serviceType": "Catering Labour Service",
      },
    },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[{ name: "Services", url: "https://saravanacaters.in/services" }]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      <ServicesClient />
    </>
  );
}
