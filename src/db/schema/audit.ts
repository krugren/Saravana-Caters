import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./auth";

export const audit_log = sqliteTable("audit_log", {
  id: text("id").primaryKey(),
  userId: text("userId").references(() => users.id),
  action: text("action").notNull(),
  module: text("module").notNull(),
  entityId: text("entityId").notNull(),
  before: text("before", { mode: "json" }),
  after: text("after", { mode: "json" }),
  createdAt: text("createdAt").notNull(),
});
