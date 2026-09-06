"use server";

import { db } from "@/db";
import { kitchen_plans, kitchen_tasks, bookings, users, dishes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import { requireAuth } from "@/lib/auth-guard";

export async function getKitchenPlans() {
  await requireAuth();
  return await db
    .select({
      plan: kitchen_plans,
      booking: bookings,
      headChef: users,
    })
    .from(kitchen_plans)
    .leftJoin(bookings, eq(kitchen_plans.bookingId, bookings.id))
    .leftJoin(users, eq(kitchen_plans.headChefId, users.id))
    .orderBy(desc(kitchen_plans.createdAt));
}

export async function getKitchenTasksForPlan(planId: string) {
  await requireAuth();
  return await db
    .select({ task: kitchen_tasks, dish: dishes, assignee: users })
    .from(kitchen_tasks)
    .leftJoin(dishes, eq(kitchen_tasks.dishId, dishes.id))
    .leftJoin(users, eq(kitchen_tasks.assignedTo, users.id))
    .where(eq(kitchen_tasks.planId, planId));
}

export async function updatePlanStatus(id: string, status: string) {
  const session = await requireAuth(); // HIGH-1
  await db.update(kitchen_plans)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(kitchen_plans.id, id));
  await logAudit({ userId: session.user.id, action: "UPDATE", module: "KITCHEN", entityId: id, after: { status } });
  revalidatePath("/kitchen");
  return { success: true };
}

export async function updateKitchenTaskStatus(id: string, status: string) {
  const session = await requireAuth(); // HIGH-1
  await db.update(kitchen_tasks).set({ status }).where(eq(kitchen_tasks.id, id));
  await logAudit({ userId: session.user.id, action: "UPDATE", module: "KITCHEN", entityId: id, after: { status } });
  revalidatePath("/kitchen");
  return { success: true };
}
