const BASE = "https://saravanacaters.in";

type CrumbItem = { name: string; url?: string };

/**
 * Server component — injects BreadcrumbList JSON-LD into any page.
 * Google uses breadcrumbs in SERP path trails below the page title.
 * First "Home" item is always added automatically.
 */
export default function BreadcrumbSchema({ items }: { items: CrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": BASE,
      },
      ...items.map((item, idx) => ({
        "@type": "ListItem",
        "position": idx + 2,
        "name": item.name,
        ...(item.url ? { "item": item.url } : {}),
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
