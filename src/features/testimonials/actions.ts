"use server";

import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { eq, asc, isNotNull, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { generateId } from "@/lib/utils";
import { logAudit } from "@/lib/audit";
import { requireAuth, requireRole } from "@/lib/auth-guard";

/** Public: active testimonials sorted by sortOrder */
export async function getPublicTestimonials() {
  return await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.isActive, true))
    .orderBy(asc(testimonials.sortOrder));
}

/** Admin: all testimonials */
export async function getTestimonials() {
  await requireAuth();
  return await db.select().from(testimonials).orderBy(asc(testimonials.sortOrder));
}

/**
 * Count pending public submissions (isActive=false AND editToken set).
 * Used for the sidebar badge. No auth required — called from server layout.
 */
export async function getPendingReviewCount(): Promise<number> {
  const rows = await db
    .select({ id: testimonials.id })
    .from(testimonials)
    .where(and(eq(testimonials.isActive, false), isNotNull(testimonials.editToken)));
  return rows.length;
}

export async function createTestimonial(data: {
  quote: string;
  name: string;
  detail?: string;
  initials?: string;
  sortOrder?: number;
  isActive?: boolean;
}) {
  const session = await requireRole("ADMIN", "OWNER");
  const id = generateId();
  const now = new Date().toISOString();
  // Auto-generate initials if not provided
  const initials =
    data.initials ||
    data.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  await db.insert(testimonials).values({
    id,
    quote: data.quote,
    name: data.name,
    detail: data.detail ?? "",
    initials,
    sortOrder: data.sortOrder ?? 0,
    isActive: data.isActive !== false,
    createdAt: now,
    updatedAt: now,
  });
  await logAudit({ userId: session.user.id, action: "CREATE", module: "TESTIMONIAL", entityId: id, after: data });
  revalidatePath("/testimonials");
  revalidatePath("/"); // public homepage
  return { success: true };
}

export async function updateTestimonial(
  id: string,
  data: {
    quote?: string;
    name?: string;
    detail?: string;
    initials?: string;
    sortOrder?: number;
    isActive?: boolean;
  }
) {
  const session = await requireRole("ADMIN", "OWNER");
  await db
    .update(testimonials)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(testimonials.id, id));
  await logAudit({ userId: session.user.id, action: "UPDATE", module: "TESTIMONIAL", entityId: id, after: data });
  revalidatePath("/testimonials");
  revalidatePath("/");
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const session = await requireRole("ADMIN", "OWNER");
  await db.delete(testimonials).where(eq(testimonials.id, id));
  await logAudit({ userId: session.user.id, action: "DELETE", module: "TESTIMONIAL", entityId: id });
  revalidatePath("/testimonials");
  revalidatePath("/");
  return { success: true };
}

/** One-click approve: set isActive → true. Clears editToken so it can't be edited again. */
export async function approveTestimonial(id: string) {
  const session = await requireRole("ADMIN", "OWNER");
  const now = new Date().toISOString();
  await db
    .update(testimonials)
    .set({ isActive: true, updatedAt: now })
    .where(eq(testimonials.id, id));
  await logAudit({ userId: session.user.id, action: "UPDATE", module: "TESTIMONIAL", entityId: id, after: { isActive: true } });
  revalidatePath("/testimonials");
  revalidatePath("/"); // publish to homepage immediately
  return { success: true };
}
