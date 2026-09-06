import PublicNavbar from "@/components/public/navbar";
import PublicFooter from "@/components/public/footer";
import FloatingActions from "@/components/public/floating-cta";
import ProgressBar from "@/components/public/progress-bar";
import type { Metadata } from "next";

const BASE_URL = "https://saravanacaters.in";
const OG_IMAGE = `${BASE_URL}/images/hero-cinematic.png`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: "%s | Saravana Caters",
    default: "Saravana Caters — Premium Traditional Catering in Erode",
  },
  description:
    "Saravana Caters — Erode's trusted catering partner for weddings, corporate events, and house functions. Authentic South Indian cuisine. 20+ years, 1,000+ events. Call +91 98427 22977.",
  keywords: [
    "catering erode", "erode caterers", "wedding catering erode",
    "outdoor catering erode", "banana leaf catering", "traditional south indian catering",
    "corporate catering erode", "saravana caters", "catering namakkal", "catering salem",
    "catering coimbatore", "catering tiruppur", "vegetarian catering erode",
    "temple catering erode", "housewarming catering erode",
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Saravana Caters",
    url: BASE_URL,
    title: "Saravana Caters — Premium Traditional Catering in Erode",
    description:
      "Erode's most trusted catering service for weddings, receptions, corporate events and house functions. Authentic South Indian cuisine. 20+ years, 1,000+ events.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Saravana Caters — Traditional South Indian banana leaf feast at a grand wedding in Erode",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saravana Caters — Premium Traditional Catering in Erode",
    description:
      "Erode's trusted catering service for weddings, corporate events, and house functions. 20+ years of authentic South Indian cuisine.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// ─── Structured Data ──────────────────────────────────────────────────────────

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  "@id": `${BASE_URL}/#business`,
  "name": "Saravana Caters",
  "description": "Premium traditional South Indian vegetarian catering in Erode. Specialists in wedding catering, corporate events, temple functions, and banana-leaf banquets.",
  "url": BASE_URL,
  "telephone": "+91-98427-22977",
  "email": "saravanacaters@gmail.com",
  "image": OG_IMAGE,
  "priceRange": "₹₹",
  "servesCuisine": ["South Indian", "Vegetarian", "Tamil"],
  "openingHours": "Mo-Su 08:00-20:00",
  "foundingDate": "2004",
  "numberOfEmployees": { "@type": "QuantitativeValue", "value": 25 },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Erode",
    "addressRegion": "Tamil Nadu",
    "postalCode": "638001",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "11.3410",
    "longitude": "77.7172"
  },
  "areaServed": [
    { "@type": "City", "name": "Erode" },
    { "@type": "City", "name": "Namakkal" },
    { "@type": "City", "name": "Salem" },
    { "@type": "City", "name": "Coimbatore" },
    { "@type": "City", "name": "Tiruppur" },
    { "@type": "City", "name": "Gobichettipalayam" },
    { "@type": "City", "name": "Bhavani" },
  ],
  // 5-star Google rich snippet — shows aggregate rating stars below the search result title
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "280",
    "bestRating": "5",
    "worstRating": "1"
  },
  "sameAs": [
    "https://www.facebook.com/saravanacaters",
    "https://www.instagram.com/saravanacaters"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Catering Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Wedding Catering", "description": "End-to-end traditional South Indian wedding catering for 50–1,000 guests" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Corporate Catering", "description": "Professional buffet and lunch catering for corporate events in Erode and surrounding districts" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Banana Leaf Banquet", "description": "Authentic Tamil Nadu banana leaf feast for traditional ceremonies and religious functions" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Temple & Religious Functions", "description": "Satvik catering for temple festivals, Sashtiabdapoorthi, Seemantham and Namakarana events" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Housewarming Catering", "description": "Traditional Griha Pravesham catering with full South Indian meal service" } },
    ]
  },
  // Signature dishes for AI understanding and rich snippet potential
  "menu": `${BASE_URL}/menu`,
  "hasMenu": {
    "@type": "Menu",
    "name": "Traditional South Indian Catering Menu",
    "hasMenuSection": [
      {
        "@type": "MenuSection",
        "name": "Signature Dishes",
        "hasMenuItem": [
          { "@type": "MenuItem", "name": "Ghee Roast Sannas", "description": "Soft, spongy rice cakes served with aromatic ghee — our most celebrated breakfast offering" },
          { "@type": "MenuItem", "name": "Traditional Sambar Vadai", "description": "Crispy lentil fritters soaked in freshly ground sambar" },
          { "@type": "MenuItem", "name": "Erode Seeraga Samba Biryani", "description": "Fragrant short-grain biryani cooked in dum style — the crowd favourite at every event" },
          { "@type": "MenuItem", "name": "Elaneer Payasam", "description": "Tender coconut pudding — a premium dessert that defines the end of a great feast" },
        ]
      }
    ]
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the minimum guest count for Saravana Caters?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our minimum guest count is 50 guests for Full Contract and Corporate packages. For Labour Service, we cater to events starting from 100 guests. Our Traditional Package is available for 200 to 1,000 guests."
      }
    },
    {
      "@type": "Question",
      "name": "How much does traditional wedding catering cost in Erode?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our Full Contract service starts from ₹200 per plate and our Traditional Banana Leaf package starts from ₹220 per plate. Pricing varies based on the menu, guest count, and event date. Contact us at +91 98427 22977 for a customized quotation."
      }
    },
    {
      "@type": "Question",
      "name": "Does Saravana Caters cook fresh on-site or bring pre-cooked food?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We cook fresh on-site at every event. We never transport pre-cooked food. All produce is sourced fresh daily from Erode local market, and cooking begins at the venue on the day of the event."
      }
    },
    {
      "@type": "Question",
      "name": "Which areas does Saravana Caters serve?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We serve events across Erode, Gobichettipalayam, Bhavani, Sathyamangalam, Namakkal, Salem, Tiruppur, and Coimbatore districts. Contact us to confirm availability for your location."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer banana leaf service for weddings?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Our Traditional Package includes full South Indian banana leaf meal service — rice, sambar, rasam, kootu, poriyal, appalam, pickle, buttermilk, and payasam, all served on fresh banana leaves in the authentic Tamil Nadu style."
      }
    },
    {
      "@type": "Question",
      "name": "How far in advance should I book Saravana Caters for a wedding?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We recommend booking at least 2–3 months in advance for weddings, especially during the Tamil wedding season (November to March). A 30% advance payment is required to confirm your booking date."
      }
    },
  ]
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* JSON-LD — LocalBusiness + AggregateRating + Offers + Menu */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {/* JSON-LD — FAQPage (powers Google AI Overviews & Perplexity direct answers) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <ProgressBar />
      <PublicNavbar />

      {/* Page wrapper — grain texture */}
      <div className="page-grain relative">
        <main className="relative z-10">{children}</main>
      </div>

      <PublicFooter />
      <FloatingActions />
    </>
  );
}
