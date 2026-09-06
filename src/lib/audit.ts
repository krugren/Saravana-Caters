import { db } from "@/db";
import { audit_log } from "@/db/schema";
import { generateId } from "./utils";

export async function logAudit({
  userId,
  action,
  module,
  entityId,
  before,
  after,
}: {
  userId?: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE";
  module: string;
  entityId: string;
  before?: any;
  after?: any;
}) {
  try {
    await db.insert(audit_log).values({
      id: generateId(),
      userId,
      action,
      module,
      entityId,
      before,
      after,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to log audit:", error);
  }
}
