import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./auth";
import { bookings } from "./customers";
import { kitchen_plans } from "./kitchen";

export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("TODO"),
  priority: text("priority").notNull().default("MEDIUM"),
  sourceModule: text("sourceModule"),
  
  assignedTo: text("assignedTo").references(() => users.id),
  createdBy: text("createdBy").references(() => users.id),
    
  bookingId: text("bookingId").references(() => bookings.id),
  kitchenPlanId: text("kitchenPlanId").references(() => kitchen_plans.id),
  
  dueDate: text("dueDate"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});
