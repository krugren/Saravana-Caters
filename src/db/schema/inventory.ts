import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { users } from "./auth";
import { bookings } from "./customers";

export const suppliers = sqliteTable("suppliers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  address: text("address"),
  notes: text("notes"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const ingredients = sqliteTable("ingredients", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  unit: text("unit").notNull(),
  minThreshold: real("minThreshold").notNull().default(0),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const stock_movements = sqliteTable("stock_movements", {
  id: text("id").primaryKey(),
  ingredientId: text("ingredientId")
    .notNull()
    .references(() => ingredients.id),
  type: text("type").notNull(),
  quantity: real("quantity").notNull(),
  reason: text("reason"),
  supplierId: text("supplierId").references(() => suppliers.id),
  bookingId: text("bookingId").references(() => bookings.id),
  createdBy: text("createdBy")
    .notNull()
    .references(() => users.id),
  createdAt: text("createdAt").notNull(),
});
