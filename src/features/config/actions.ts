"use server";

import { db } from "@/db";
import { config } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-guard";

export async function updateConfigValue(key: string, value: string | number) {
  const session = await requireRole("ADMIN", "OWNER");

  await db
    .update(config)
    .set({ value, updatedAt: new Date().toISOString(), updatedBy: session.user.id })
    .where(eq(config.key, key));

  // Revalidate all public pages — config changes (phone, stats, pricing) affect the whole site
  revalidatePath("/config");
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/about");
  revalidatePath("/menu");
  revalidatePath("/contact");

  return { success: true };
}

export async function getConfigByCategory(category: string) {
  return await db.select().from(config).where(eq(config.category, category));
}

export async function getAllConfig() {
  return await db.select().from(config);
}
