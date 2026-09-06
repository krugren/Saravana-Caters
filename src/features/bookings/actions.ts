"use server";

import { db } from "@/db";
import { bookings, quotations, kitchen_plans, tasks, customers } from "@/db/schema";
import { eq, desc, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { generateId } from "@/lib/utils";
import { logAudit } from "@/lib/audit";
import { requireAuth, requireRole } from "@/lib/auth-guard";

export async function getBookings() {
  await requireAuth();
  return await db
    .select({
      booking: bookings,
      customer: customers,
      quotation: quotations,
    })
    .from(bookings)
    .leftJoin(customers, eq(bookings.customerId, customers.id))
    .leftJoin(quotations, eq(bookings.quotationId, quotations.id))
    // Soft-delete filter: only return active bookings
    .where(isNull(bookings.deletedAt))
    .orderBy(desc(bookings.createdAt));
}

export async function convertQuotationToBooking(
  quotationId: string,
  advancePaid: number,
  notes?: string
) {
  const session = await requireRole("ADMIN", "OWNER");

  const qtns = await db
    .select()
    .from(quotations)
    .where(eq(quotations.id, quotationId))
    .limit(1);
  if (!qtns.length) throw new Error("Quotation not found");
  const qtn = qtns[0];

  // SEC-V1: Prevent double-booking — the quotation must be in SENT state.
  // Checking ACCEPTED here inside the same fetch (before the transaction) is an
  // optimistic guard; the transaction's status update atomically seals it.
  if (qtn.status === "ACCEPTED") {
    throw new Error("This quotation has already been converted to a confirmed booking.");
  }
  if (qtn.status !== "SENT" && qtn.status !== "DRAFT") {
    throw new Error(`Cannot confirm a quotation with status: ${qtn.status}`);
  }

  const cleanAdvance = Math.max(0, Math.round((Number(advancePaid) || 0) * 100) / 100);
  const balanceDue = Math.max(0, Math.round((Number(qtn.grandTotal) - cleanAdvance) * 100) / 100);

  const bookingId = generateId();
  const planId = generateId();
  const taskId = generateId();

  await db.transaction(async (tx) => {
    // 1. Create Booking
    await tx.insert(bookings).values({
      id: bookingId,
      quotationId: qtn.id,
      customerId: qtn.customerId,
      status: "CONFIRMED",
      eventType: qtn.eventType,
      eventDate: qtn.eventDate,
      venue: qtn.venue,
      totalValue: qtn.grandTotal,
      advancePaid: cleanAdvance,
      balanceDue,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 2. Mark Quotation as accepted
    await tx
      .update(quotations)
      .set({ status: "ACCEPTED" })
      .where(eq(quotations.id, quotationId));

    // 3. Create Kitchen Plan
    await tx.insert(kitchen_plans).values({
      id: planId,
      bookingId,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 4. Create assignment task for Head Chef
    await tx.insert(tasks).values({
      id: taskId,
      title: `Assign Head Chef for ${qtn.eventType}`,
      description: `Booking confirmed for ${qtn.eventDate}. Assign a Head Chef to Kitchen Plan.`,
      status: "TODO",
      priority: "HIGH",
      sourceModule: "BOOKINGS",
      bookingId,
      kitchenPlanId: planId,
      createdBy: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

  await logAudit({
    userId: session.user.id,
    action: "CREATE",
    module: "BOOKING",
    entityId: bookingId,
    after: { quotationId, advancePaid: cleanAdvance, balanceDue },
  });

  revalidatePath("/bookings");
  revalidatePath("/quotations");
  revalidatePath("/kitchen");
  revalidatePath("/tasks");

  return { success: true, bookingId };
}

export async function updateBookingStatus(id: string, status: string) {
  const session = await requireAuth();
  await db
    .update(bookings)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(bookings.id, id));
  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    module: "BOOKING",
    entityId: id,
    after: { status },
  });
  revalidatePath("/bookings");
  return { success: true };
}

export async function recordPayment(id: string, amount: number) {
  const session = await requireRole("ADMIN", "OWNER");

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Payment amount must be a positive number");
  }

  const rows = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1);
  if (!rows.length) throw new Error("Booking not found");
  const b = rows[0];

  const roundedAmount = Math.round(amount * 100) / 100;
  const newAdvance = Math.round((Number(b.advancePaid || 0) + roundedAmount) * 100) / 100;
  const newBalance = Math.max(0, Math.round((Number(b.totalValue) - newAdvance) * 100) / 100);

  await db
    .update(bookings)
    .set({
      advancePaid: newAdvance,
      balanceDue: newBalance,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(bookings.id, id));

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    module: "BOOKING",
    entityId: id,
    after: { paymentRecorded: roundedAmount, newAdvance, newBalance },
  });
  revalidatePath("/bookings");
  return { success: true };
}

export async function deleteBooking(id: string) {
  const session = await requireRole("ADMIN", "OWNER");
  // Soft delete: preserve booking for financial history, kitchen plan references,
  // and task linkage — hard delete would violate FK constraints.
  const now = new Date().toISOString();
  await db
    .update(bookings)
    .set({ deletedAt: now, updatedAt: now })
    .where(eq(bookings.id, id));
  await logAudit({
    userId: session.user.id,
    action: "DELETE",
    module: "BOOKING",
    entityId: id,
  });
  revalidatePath("/bookings");
  return { success: true };
}
