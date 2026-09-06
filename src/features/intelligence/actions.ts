"use server";

import { db } from "@/db";
import { bookings, enquiries, quotations, ingredients, customers, stock_movements } from "@/db/schema";
import { sql, desc, eq, isNull } from "drizzle-orm";
import { requireRole } from "@/lib/auth-guard";

// SEC-V2: Financial intelligence is restricted to ADMIN/OWNER only.
// Previously used requireAuth() which allowed KITCHEN staff to access
// gross revenue, monthly billing trends, and outstanding client balances.
export async function getIntelligenceData() {
  await requireRole("ADMIN", "OWNER");

  const [
    bookingStats,
    enquiryCount,
    quotationCount,
    revenueByMonth,
    eventTypeBreakdown,
    lowStockIngredients,
    recentBookings,
  ] = await Promise.all([
    // SEC-V5: Filter soft-deleted bookings from revenue totals
    db.select({
      total: sql<number>`count(*)`,
      totalRevenue: sql<number>`sum(${bookings.totalValue})`,
      totalBalance: sql<number>`sum(${bookings.balanceDue})`,
      totalCollected: sql<number>`sum(${bookings.advancePaid})`,
    }).from(bookings).where(isNull(bookings.deletedAt)),

    // SEC-V5: Filter soft-deleted enquiries from counts
    db.select({ total: sql<number>`count(*)` }).from(enquiries).where(isNull(enquiries.deletedAt)),

    // Quotation count
    db.select({ total: sql<number>`count(*)` }).from(quotations),

    // Bookings by month (last 6 months) — filter soft-deleted
    db.select({
      month: sql<string>`strftime('%Y-%m', ${bookings.eventDate})`,
      count: sql<number>`count(*)`,
      revenue: sql<number>`sum(${bookings.totalValue})`,
    })
    .from(bookings)
    .where(isNull(bookings.deletedAt))
    .groupBy(sql`strftime('%Y-%m', ${bookings.eventDate})`)
    .orderBy(sql`strftime('%Y-%m', ${bookings.eventDate}) desc`)
    .limit(6),

    // Event type breakdown — active bookings only
    db.select({
      eventType: bookings.eventType,
      count: sql<number>`count(*)`,
    })
    .from(bookings)
    .where(isNull(bookings.deletedAt))
    .groupBy(bookings.eventType)
    .orderBy(sql`count(*) desc`),

    // Real stock levels: SUM IN minus SUM OUT per ingredient
    db.select({
      id: ingredients.id,
      name: ingredients.name,
      category: ingredients.category,
      unit: ingredients.unit,
      minThreshold: ingredients.minThreshold,
      currentStock: sql<number>`COALESCE(SUM(CASE WHEN ${stock_movements.type} = 'IN' THEN ${stock_movements.quantity} ELSE -${stock_movements.quantity} END), 0)`,
    })
    .from(ingredients)
    .leftJoin(stock_movements, eq(stock_movements.ingredientId, ingredients.id))
    .groupBy(ingredients.id)
    .limit(50),

    // Recent bookings (active only)
    db.select({ booking: bookings, customer: customers })
      .from(bookings)
      .leftJoin(customers, eq(bookings.customerId, customers.id))
      .where(isNull(bookings.deletedAt))
      .orderBy(desc(bookings.createdAt))
      .limit(5),
  ]);

  // Low stock: current stock below minimum threshold
  const lowStock = lowStockIngredients.filter(
    (i) => (i.minThreshold ?? 0) > 0 && Number(i.currentStock) < Number(i.minThreshold)
  );

  // Sort months ascending for chart
  const monthlyData = [...revenueByMonth].reverse();

  return {
    summary: {
      totalBookings: Number(bookingStats[0]?.total ?? 0),
      totalRevenue: Number(bookingStats[0]?.totalRevenue ?? 0),
      totalCollected: Number(bookingStats[0]?.totalCollected ?? 0),
      outstandingBalance: Number(bookingStats[0]?.totalBalance ?? 0),
      totalEnquiries: Number(enquiryCount[0]?.total ?? 0),
      totalQuotations: Number(quotationCount[0]?.total ?? 0),
    },
    monthlyData,
    eventTypeBreakdown,
    lowStock,
    recentBookings,
  };
}
