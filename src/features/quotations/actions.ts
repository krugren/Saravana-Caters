"use server";

import { db } from "@/db";
import {
  quotations,
  quotation_line_items,
  service_models,
  dishes,
  customers,
} from "@/db/schema";
import { eq, inArray, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { generateId } from "@/lib/utils";
import { logAudit } from "@/lib/audit";
import { getConfig } from "@/lib/config";
import { requireAuth, requireRole } from "@/lib/auth-guard";

export async function getQuotations() {
  await requireAuth();
  return await db.select().from(quotations).orderBy(desc(quotations.createdAt));
}

export async function getQuotation(id: string) {
  await requireAuth();
  const rows = await db
    .select({ quotation: quotations, customer: customers })
    .from(quotations)
    .leftJoin(customers, eq(quotations.customerId, customers.id))
    .where(eq(quotations.id, id))
    .limit(1);
  if (!rows.length) return null;
  const lineItems = await db
    .select()
    .from(quotation_line_items)
    .where(eq(quotation_line_items.quotationId, id))
    .orderBy(quotation_line_items.sortOrder);
  return { ...rows[0], lineItems };
}

export async function updateQuotationStatus(id: string, status: string) {
  const session = await requireRole("ADMIN", "OWNER");
  await db
    .update(quotations)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(quotations.id, id));
  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    module: "QUOTATION",
    entityId: id,
    after: { status },
  });
  revalidatePath(`/quotations/${id}`);
  revalidatePath("/quotations");
  return { success: true };
}

export type QuotationInput = {
  enquiryId?: string;
  customerId: string;
  serviceModelId: string;
  eventType: string;
  eventDate: string;
  guests: number;
  venue?: string;
  selectedDishIds: string[];
  discountPercent?: number;
};

export async function generateQuotation(input: QuotationInput) {
  const session = await requireRole("ADMIN", "OWNER");

  // Validate & sanitize numeric bounds
  const guests = Math.max(1, Math.floor(Number(input.guests) || 1));
  const discountPercent = Math.min(100, Math.max(0, Number(input.discountPercent) || 0));

  const models = await db
    .select()
    .from(service_models)
    .where(eq(service_models.id, input.serviceModelId))
    .limit(1);
  if (models.length === 0) throw new Error("Service model not found");
  const model = models[0];

  const selectedDishes =
    input.selectedDishIds.length > 0
      ? await db
          .select()
          .from(dishes)
          .where(inArray(dishes.id, input.selectedDishIds))
      : [];

  let subtotal = 0;
  const lineItems: any[] = [];

  if (model.pricingBasis === "PER_PLATE") {
    const baseRate = Number(model.baseRate || 0);
    subtotal = Math.round(baseRate * guests * 100) / 100;
    lineItems.push({
      id: generateId(),
      name: `${model.displayName} per plate`,
      quantity: guests,
      unit: "plates",
      rate: baseRate,
      total: subtotal,
      sortOrder: 1,
    });
  } else if (model.pricingBasis === "STAFF_COUNT") {
    const minStaff = Number(await getConfig("pricing.labour.minStaff", 5));
    const chefRate = Number(await getConfig("pricing.labour.chefDayRate", 800));
    const serverRate = Number(await getConfig("pricing.labour.serverDayRate", 600));
    const requiredStaff = Math.max(minStaff, Math.ceil(guests / 20));
    const chefs = Math.max(2, Math.ceil(requiredStaff * 0.3));
    const servers = requiredStaff - chefs;
    const chefTotal = chefs * chefRate;
    const serverTotal = servers * serverRate;
    subtotal = Math.round((chefTotal + serverTotal) * 100) / 100;
    lineItems.push(
      { id: generateId(), name: "Head/Sous Chefs", quantity: chefs, unit: "staff", rate: chefRate, total: chefTotal, sortOrder: 1 },
      { id: generateId(), name: "Serving Staff", quantity: servers, unit: "staff", rate: serverRate, total: serverTotal, sortOrder: 2 }
    );
  }

  const discountAmount = Math.round(subtotal * (discountPercent / 100) * 100) / 100;
  const afterDiscount = Math.round((subtotal - discountAmount) * 100) / 100;
  const gstPercent = Number(await getConfig("pricing.gst.percentage", 5));
  const gstAmount = Math.round(afterDiscount * (gstPercent / 100) * 100) / 100;
  const grandTotal = Math.round((afterDiscount + gstAmount) * 100) / 100;
  const advancePercent = Number(await getConfig("pricing.advance.percentage", 30));
  const advanceRequired = Math.round(grandTotal * (advancePercent / 100) * 100) / 100;

  const quotationId = generateId();
  // High-entropy collision-resistant quotation code
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = generateId().slice(0, 6).toUpperCase();
  const qtnNumber = `QTN-${dateStr}-${randomSuffix}`;

  // Atomic transaction
  await db.transaction(async (tx) => {
    await tx.insert(quotations).values({
      id: quotationId,
      quotationNumber: qtnNumber,
      enquiryId: input.enquiryId || null,
      customerId: input.customerId,
      serviceModelId: model.id,
      status: "DRAFT",
      eventType: input.eventType,
      eventDate: input.eventDate,
      guests,
      venue: input.venue,
      subtotal,
      discountPercent,
      discountAmount,
      gstPercent,
      gstAmount,
      grandTotal,
      advanceRequired,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    for (const item of lineItems) {
      await tx.insert(quotation_line_items).values({ ...item, quotationId });
    }

    for (const dish of selectedDishes) {
      await tx.insert(quotation_line_items).values({
        id: generateId(),
        quotationId,
        dishId: dish.id,
        name: dish.name,
        category: dish.category,
        quantity: guests,
        unit: "servings",
        rate: 0,
        total: 0,
        sortOrder: 99,
      });
    }
  });

  await logAudit({
    userId: session.user.id,
    action: "CREATE",
    module: "QUOTATION",
    entityId: quotationId,
    after: { qtnNumber, grandTotal },
  });

  revalidatePath("/quotations");
  return { success: true, quotationId, qtnNumber };
}
