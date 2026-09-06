"use server";

import { db } from "@/db";
import { tasks, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { generateId } from "@/lib/utils";
import { logAudit } from "@/lib/audit";
import { requireAuth, requireRole } from "@/lib/auth-guard";

export async function getTasks() {
  await requireAuth(); // HIGH-1: was missing requireAuth
  return await db
    .select({ task: tasks, assignee: users })
    .from(tasks)
    .leftJoin(users, eq(tasks.assignedTo, users.id))
    .orderBy(desc(tasks.createdAt));
}

export async function getUsers() {
  await requireAuth();
  return await db.select({ id: users.id, name: users.name, role: users.role }).from(users);
}

export async function createTask(data: {
  title: string;
  description?: string;
  priority: string;
  assignedTo?: string;
  dueDate?: string;
}) {
  const session = await requireAuth(); // HIGH-1
  const newId = generateId();
  await db.insert(tasks).values({
    id: newId,
    title: data.title,
    description: data.description || null,
    status: "TODO",
    priority: data.priority,
    assignedTo: data.assignedTo || null,
    createdBy: session.user.id,
    dueDate: data.dueDate || null,
    sourceModule: "MANUAL",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await logAudit({ userId: session.user.id, action: "CREATE", module: "TASK", entityId: newId, after: data });
  revalidatePath("/tasks");
  return { success: true };
}

export async function updateTaskStatus(id: string, status: string) {
  const session = await requireAuth(); // HIGH-1
  await db.update(tasks).set({ status, updatedAt: new Date().toISOString() }).where(eq(tasks.id, id));
  await logAudit({ userId: session.user.id, action: "UPDATE", module: "TASK", entityId: id, after: { status } });
  revalidatePath("/tasks");
  return { success: true };
}

export async function deleteTask(id: string) {
  // SEC-A2: Only ADMIN/OWNER may delete tasks.
  // KITCHEN staff should only update task status (done/in-progress), not destroy task records.
  const session = await requireRole("ADMIN", "OWNER");
  await db.delete(tasks).where(eq(tasks.id, id));
  await logAudit({ userId: session.user.id, action: "DELETE", module: "TASK", entityId: id });
  revalidatePath("/tasks");
  return { success: true };
}
