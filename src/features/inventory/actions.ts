"use server";

import { db } from "@/db";
import { ingredients, suppliers, stock_movements } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { generateId } from "@/lib/utils";
import { logAudit } from "@/lib/audit";
import { requireAuth, requireRole } from "@/lib/auth-guard";

export async function getIngredients() {
  await requireAuth();
  return await db.select().from(ingredients);
}

export async function getSuppliers() {
  await requireAuth();
  return await db.select().from(suppliers);
}

export async function createIngredient(data: { name: string; category: string; unit: string; minThreshold: number }) {
  const session = await requireRole("ADMIN", "OWNER");
  const newId = generateId();
  await db.insert(ingredients).values({
    id: newId,
    name: data.name,
    category: data.category,
    unit: data.unit,
    minThreshold: Math.max(0, Number(data.minThreshold) || 0),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await logAudit({ userId: session.user.id, action: "CREATE", module: "INGREDIENT", entityId: newId, after: data });
  revalidatePath("/inventory");
  return { success: true };
}

export async function deleteIngredient(id: string) {
  const session = await requireRole("ADMIN", "OWNER");
  await db.delete(ingredients).where(eq(ingredients.id, id));
  await logAudit({ userId: session.user.id, action: "DELETE", module: "INGREDIENT", entityId: id });
  revalidatePath("/inventory");
  return { success: true };
}

export async function createSupplier(data: { name: string; phone?: string; address?: string; notes?: string }) {
  const session = await requireRole("ADMIN", "OWNER");
  const newId = generateId();
  await db.insert(suppliers).values({
    id: newId,
    name: data.name,
    phone: data.phone || null,
    address: data.address || null,
    notes: data.notes || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await logAudit({ userId: session.user.id, action: "CREATE", module: "SUPPLIER", entityId: newId, after: data });
  revalidatePath("/inventory");
  return { success: true };
}

export async function deleteSupplier(id: string) {
  const session = await requireRole("ADMIN", "OWNER");
  await db.delete(suppliers).where(eq(suppliers.id, id));
  await logAudit({ userId: session.user.id, action: "DELETE", module: "SUPPLIER", entityId: id });
  revalidatePath("/inventory");
  return { success: true };
}

// ── Procurement (stock movements as purchase records) ──
export async function getStockMovements() {
  await requireAuth();
  return await db
    .select({
      movement: stock_movements,
      ingredient: ingredients,
      supplier: suppliers,
    })
    .from(stock_movements)
    .leftJoin(ingredients, eq(stock_movements.ingredientId, ingredients.id))
    .leftJoin(suppliers, eq(stock_movements.supplierId, suppliers.id))
    .orderBy(desc(stock_movements.createdAt));
}

export async function createStockIn(data: {
  ingredientId: string;
  supplierId?: string;
  quantity: number;
  reason?: string;
}) {
  const session = await requireAuth();

  const quantity = Number(data.quantity);
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error("Stock quantity must be a positive number");
  }

  const newId = generateId();
  await db.insert(stock_movements).values({
    id: newId,
    ingredientId: data.ingredientId,
    supplierId: data.supplierId || null,
    type: "IN",
    quantity,
    reason: data.reason || "Purchase",
    createdBy: session.user.id,
    createdAt: new Date().toISOString(),
  });
  await logAudit({ userId: session.user.id, action: "CREATE", module: "STOCK_IN", entityId: newId, after: data });
  revalidatePath("/procurement");
  revalidatePath("/inventory");
  return { success: true };
}

export async function deleteStockMovement(id: string) {
  const session = await requireRole("ADMIN", "OWNER");
  await db.delete(stock_movements).where(eq(stock_movements.id, id));
  await logAudit({ userId: session.user.id, action: "DELETE", module: "STOCK_MOVEMENT", entityId: id });
  revalidatePath("/procurement");
  return { success: true };
}
