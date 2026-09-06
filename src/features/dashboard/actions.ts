"use server";

import { db } from "@/db";
import { bookings, enquiries, quotations, audit_log, users } from "@/db/schema";
import { sql, desc, eq, isNull, and } from "drizzle-orm";
import { requireAuth, requireRole } from "@/lib/auth-guard";

export async function getDashboardMetrics() {
  await requireAuth();
  const [totalEnquiries, activeQuotations, confirmedBookings, recentRevenue] = await Promise.all([
    // SEC-V5: Exclude soft-deleted enquiries from public-facing count
    db.select({ count: sql<number>`count(*)` }).from(enquiries).where(isNull(enquiries.deletedAt)),
    db.select({ count: sql<number>`count(*)` }).from(quotations).where(eq(quotations.status, "DRAFT")),
    // SEC-V5: Exclude soft-deleted bookings from confirmed count and revenue
    db.select({ count: sql<number>`count(*)` }).from(bookings).where(and(eq(bookings.status, "CONFIRMED"), isNull(bookings.deletedAt))),
    db.select({ total: sql<number>`sum(${bookings.totalValue})` }).from(bookings).where(and(eq(bookings.status, "CONFIRMED"), isNull(bookings.deletedAt))),
  ]);

  return {
    enquiries: totalEnquiries[0]?.count || 0,
    quotations: activeQuotations[0]?.count || 0,
    bookings: confirmedBookings[0]?.count || 0,
    revenue: recentRevenue[0]?.total || 0,
  };
}

export async function getAuditLogs(limit = 50) {
  // SEC-V3: Restrict audit log access to ADMIN/OWNER — prevents kitchen staff
  // from reading the change history (which contains customer PII, pricing diffs, etc.)
  // Also caps the limit parameter to prevent unbounded record dumps.
  await requireRole("ADMIN", "OWNER");
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 50));

  return await db
    .select({
      log: audit_log,
      user: users
    })
    .from(audit_log)
    .leftJoin(users, eq(audit_log.userId, users.id))
    .orderBy(desc(audit_log.createdAt))
    .limit(safeLimit);
}
