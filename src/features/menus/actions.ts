"use server";

import { db } from "@/db";
import { dishes, service_models } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { generateId } from "@/lib/utils";
import { logAudit } from "@/lib/audit";
import { requireAuth, requireRole } from "@/lib/auth-guard";

/** Admin: all dishes (requires auth) */
export async function getDishes() {
  await requireAuth();
  return await db.select().from(dishes);
}

/** Public: only active dishes — no auth required */
export async function getPublicDishes() {
  return await db.select().from(dishes).where(eq(dishes.isActive, true));
}

export async function getServiceModels() {
  await requireAuth();
  return await db.select().from(service_models);
}

export async function createDish(data: {
  name: string;
  nameTamil?: string;
  category: string;
  dietType: string;
  description?: string;
  tags?: string[];
  isActive?: boolean;
}) {
  const session = await requireRole("ADMIN", "OWNER");
  const newId = generateId();
  await db.insert(dishes).values({
    id: newId,
    name: data.name,
    nameTamil: data.nameTamil || null,
    category: data.category,
    dietType: data.dietType,
    description: data.description || null,
    tags: data.tags || [],
    isActive: data.isActive !== false, // default true
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await logAudit({ userId: session.user.id, action: "CREATE", module: "DISH", entityId: newId, after: data });
  revalidatePath("/menus");
  revalidatePath("/menu"); // ← update public website
  return { success: true };
}

export async function updateDish(
  id: string,
  data: {
    name?: string;
    nameTamil?: string;
    category?: string;
    dietType?: string;
    description?: string;
    tags?: string[];
    isActive?: boolean;
  }
) {
  const session = await requireRole("ADMIN", "OWNER");
  await db
    .update(dishes)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(dishes.id, id));
  await logAudit({ userId: session.user.id, action: "UPDATE", module: "DISH", entityId: id, after: data });
  revalidatePath("/menus");
  revalidatePath("/menu"); // ← update public website
  return { success: true };
}

export async function deleteDish(id: string) {
  const session = await requireRole("ADMIN", "OWNER");
  await db.delete(dishes).where(eq(dishes.id, id));
  await logAudit({ userId: session.user.id, action: "DELETE", module: "DISH", entityId: id });
  revalidatePath("/menus");
  revalidatePath("/menu"); // ← update public website
  return { success: true };
}

export async function deleteServiceModel(id: string) {
  const session = await requireRole("ADMIN", "OWNER");
  await db.delete(service_models).where(eq(service_models.id, id));
  await logAudit({ userId: session.user.id, action: "DELETE", module: "SERVICE_MODEL", entityId: id });
  revalidatePath("/menus");
  return { success: true };
}
