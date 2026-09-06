import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./auth";

export const config = sqliteTable("config", {
  key: text("key").primaryKey(),
  value: text("value", { mode: "json" }).notNull(),
  category: text("category").notNull(),
  label: text("label").notNull(),
  updatedAt: text("updatedAt").notNull(),
  updatedBy: text("updatedBy")
    .notNull()
    .references(() => users.id),
});
