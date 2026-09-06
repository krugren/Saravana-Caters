import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { generateId } from "../lib/utils";

const client = createClient({
  url: process.env.DATABASE_URL || "file:local.db",
});
const db = drizzle(client, { schema });

async function seed() {
  console.log("Seeding database...");

  // 1. Config
  const configs = [
    { key: "pricing.fullContract.baseRate", value: 200, category: "pricing", label: "Full Contract Base Rate" },
    { key: "pricing.traditional.baseRate", value: 220, category: "pricing", label: "Traditional Base Rate" },
    { key: "pricing.labour.chefDayRate", value: 800, category: "pricing", label: "Chef Day Rate" },
    { key: "pricing.labour.serverDayRate", value: 600, category: "pricing", label: "Server Day Rate" },
    { key: "pricing.labour.minStaff", value: 5, category: "pricing", label: "Labour Min Staff" },
    { key: "pricing.advance.percentage", value: 30, category: "pricing", label: "Advance Percentage" },
    { key: "pricing.gst.percentage", value: 5, category: "pricing", label: "GST Percentage" },
    { key: "business.name", value: "Saravana Caters", category: "business", label: "Business Name" },
    { key: "business.phone", value: "+91 98427 22977", category: "business", label: "Phone" },
    { key: "business.tagline", value: "Your trust, our tradition.", category: "business", label: "Tagline" },
  ];

  const systemUserId = "system-user-id";
  await db.insert(schema.users).values({
    id: systemUserId,
    name: "System",
    email: "system@saravanacaters.com",
    role: "OWNER",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }).onConflictDoNothing();

  for (const conf of configs) {
    await db.insert(schema.config).values({
      key: conf.key,
      value: conf.value,
      category: conf.category,
      label: conf.label,
      updatedBy: systemUserId,
      updatedAt: new Date().toISOString(),
    }).onConflictDoUpdate({
      target: schema.config.key,
      set: { value: conf.value, updatedAt: new Date().toISOString() }
    });
  }

  // 2. Service Models
  const serviceModels = [
    { id: "labour", name: "LABOUR", displayName: "Labour Service", pricingBasis: "STAFF_COUNT", baseRate: null, minGuests: 100, maxGuests: 5000 },
    { id: "full_contract", name: "FULL_CONTRACT", displayName: "Full Contract", pricingBasis: "PER_PLATE", baseRate: 200, minGuests: 50, maxGuests: 500 },
    { id: "traditional", name: "TRADITIONAL", displayName: "Traditional Package", pricingBasis: "PER_PLATE", baseRate: 220, minGuests: 200, maxGuests: 1000 },
    { id: "corporate", name: "CORPORATE", displayName: "Corporate Package", pricingBasis: "CUSTOM_QUOTE", baseRate: null, minGuests: 50, maxGuests: 2000 },
  ];

  for (const model of serviceModels) {
    await db.insert(schema.service_models).values(model).onConflictDoNothing();
  }

  // 3. Dishes
  const dishes = [
    { name: "Ghee Roast Sannas", category: "BREAKFAST", dietType: "VEG", tags: ["Signature Dish"] },
    { name: "Traditional Sambar Vadai", category: "BREAKFAST", dietType: "VEG", tags: ["All-Time Favourite"] },
    { name: "Erode Seeraga Samba Biryani", category: "LUNCH", dietType: "NON_VEG", tags: ["Crowd Favourite"] },
    { name: "Elaneer Payasam", category: "DESSERTS", dietType: "VEG", tags: ["Premium"] },
  ];

  for (const dish of dishes) {
    const stableId = dish.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await db.insert(schema.dishes).values({
      id: stableId,
      name: dish.name,
      category: dish.category,
      dietType: dish.dietType,
      tags: dish.tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).onConflictDoNothing();
  }

  // 4. Ingredients
  const ingredients = [
    { name: "Rice", category: "GRAIN", unit: "kg", minThreshold: 20 },
    { name: "Toor Dal", category: "GRAIN", unit: "kg", minThreshold: 10 },
    { name: "Tomatoes", category: "VEGETABLE", unit: "kg", minThreshold: 5 },
    { name: "Groundnut Oil", category: "OIL", unit: "L", minThreshold: 5 },
    { name: "Turmeric Powder", category: "SPICE", unit: "kg", minThreshold: 1 },
  ];

  for (const ing of ingredients) {
    const stableId = ing.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await db.insert(schema.ingredients).values({
      id: stableId,
      name: ing.name,
      category: ing.category,
      unit: ing.unit,
      minThreshold: ing.minThreshold,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).onConflictDoNothing();
  }

  console.log("Seeding complete!");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
