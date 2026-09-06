import type { Metadata } from "next";
import { getPublicDishes } from "@/features/menus/actions";
import MenuClient from "./_menu-client";
import BreadcrumbSchema from "@/components/seo/breadcrumb-schema";

export const metadata: Metadata = {
  title: "Menu — Saravana Caters",
  description:
    "Browse our traditional South Indian catering menu — breakfast items, rice varieties, curries, gravies, sweets, desserts and more. Customised for weddings, corporate events and house functions.",
  alternates: { canonical: "https://saravanacaters.in/menu" },
  openGraph: { url: "https://saravanacaters.in/menu", title: "Traditional South Indian Catering Menu — Saravana Caters" },
};

export default async function MenuPage() {
  const dbDishes = await getPublicDishes();

  // Group dishes by category (DB category → display items)
  const groupedByCategory = dbDishes.reduce<Record<string, { name: string; desc: string }[]>>(
    (acc, dish) => {
      const cat = dish.category ?? "OTHER";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push({
        name: dish.name,
        desc: dish.description ?? "",
      });
      return acc;
    },
    {}
  );

  return (
    <>
      <BreadcrumbSchema
        items={[{ name: "Menu", url: "https://saravanacaters.in/menu" }]}
      />
      <MenuClient groupedDishes={groupedByCategory} />
    </>
  );
}
