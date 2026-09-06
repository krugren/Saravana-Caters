import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { bookings } from "./customers";
import { users } from "./auth";
import { dishes } from "./menus";

export const kitchen_plans = sqliteTable("kitchen_plans", {
  id: text("id").primaryKey(),
  bookingId: text("bookingId")
    .notNull()
    .references(() => bookings.id),
  status: text("status").notNull().default("PENDING"),
  headChefId: text("headChefId").references(() => users.id),
  notes: text("notes"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const kitchen_tasks = sqliteTable("kitchen_tasks", {
  id: text("id").primaryKey(),
  planId: text("planId")
    .notNull()
    .references(() => kitchen_plans.id, { onDelete: "cascade" }),
  dishId: text("dishId").references(() => dishes.id),
  timeSlot: text("timeSlot").notNull(),
  assignedTo: text("assignedTo").references(() => users.id),
  status: text("status").notNull().default("TODO"),
  durationMinutes: real("durationMinutes"),
  notes: text("notes"),
});
