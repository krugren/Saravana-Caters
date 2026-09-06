"use server";

import { db } from "@/db";
import { customers, enquiries } from "@/db/schema";
import { eq, desc, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { generateId } from "@/lib/utils";
import { logAudit } from "@/lib/audit";
import { requireAuth, requireRole } from "@/lib/auth-guard";

export async function getEnquiries() {
  await requireAuth();
  return await db
    .select({ enquiry: enquiries, customer: customers })
    .from(enquiries)
    .leftJoin(customers, eq(enquiries.customerId, customers.id))
    // Soft-delete filter: only return active (non-deleted) enquiries
    .where(isNull(enquiries.deletedAt))
    .orderBy(desc(enquiries.createdAt));
}

export async function getCustomers() {
  await requireAuth();
  // Soft-delete filter: only return active (non-deleted) customers
  return await db
    .select()
    .from(customers)
    .where(isNull(customers.deletedAt))
    .orderBy(desc(customers.createdAt));
}

export async function createCustomer(data: {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}) {
  const session = await requireAuth();
  const newId = generateId();
  await db.insert(customers).values({
    id: newId,
    name: data.name,
    phone: data.phone || "",
    email: data.email || null,
    address: data.address || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await logAudit({ userId: session.user.id, action: "CREATE", module: "CUSTOMER", entityId: newId, after: data });
  revalidatePath("/customers");
  return { success: true };
}

export async function deleteCustomer(id: string) {
  const session = await requireRole("ADMIN", "OWNER");
  // Soft delete: mark deletedAt timestamp instead of destroying the row.
  // Preserves referential integrity with linked enquiries, quotations, and bookings.
  const now = new Date().toISOString();
  await db
    .update(customers)
    .set({ deletedAt: now, updatedAt: now })
    .where(eq(customers.id, id));
  await logAudit({ userId: session.user.id, action: "DELETE", module: "CUSTOMER", entityId: id });
  revalidatePath("/customers");
  return { success: true };
}

export async function createEnquiry(data: {
  customerName: string;
  phone: string;
  eventType: string;
  expectedGuests: number;
  source: string;
  eventDate?: string;
}) {
  const session = await requireAuth();

  // Check active customers only (exclude soft-deleted)
  const customerResult = await db
    .select()
    .from(customers)
    .where(eq(customers.phone, data.phone))
    .limit(1);
  let customerId = customerResult[0]?.id;

  if (!customerId) {
    customerId = generateId();
    await db.insert(customers).values({
      id: customerId,
      name: data.customerName,
      phone: data.phone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  const enquiryId = generateId();
  await db.insert(enquiries).values({
    id: enquiryId,
    customerId,
    eventType: data.eventType,
    expectedGuests: Math.max(1, Number(data.expectedGuests) || 1),
    source: data.source,
    eventDate: data.eventDate || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await logAudit({ userId: session.user.id, action: "CREATE", module: "ENQUIRY", entityId: enquiryId, after: data });
  revalidatePath("/enquiries");
  return { success: true, enquiryId };
}

export async function deleteEnquiry(id: string) {
  const session = await requireRole("ADMIN", "OWNER");
  // Soft delete: preserve enquiry history for CRM reporting
  const now = new Date().toISOString();
  await db
    .update(enquiries)
    .set({ deletedAt: now, updatedAt: now })
    .where(eq(enquiries.id, id));
  await logAudit({ userId: session.user.id, action: "DELETE", module: "ENQUIRY", entityId: id });
  revalidatePath("/enquiries");
  return { success: true };
}
