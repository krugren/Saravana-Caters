import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";
import { ingredients } from "./inventory";

export const service_models = sqliteTable("service_models", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  displayName: text("displayName").notNull(),
  pricingBasis: text("pricingBasis").notNull(),
  baseRate: real("baseRate"),
  minGuests: real("minGuests").notNull(),
  maxGuests: real("maxGuests").notNull(),
  inclusions: text("inclusions", { mode: "json" }).default("[]"),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
});

export const dishes = sqliteTable("dishes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nameTamil: text("nameTamil"),
  category: text("category").notNull(),
  dietType: text("dietType").notNull(),
  description: text("description"),
  tags: text("tags", { mode: "json" }).default("[]"),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const recipes = sqliteTable("recipes", {
  id: text("id").primaryKey(),
  dishId: text("dishId")
    .notNull()
    .references(() => dishes.id, { onDelete: "cascade" }),
  servesBaseQty: real("servesBaseQty").notNull().default(100),
  prepTimeMinutes: real("prepTimeMinutes"),
  cookTimeMinutes: real("cookTimeMinutes"),
  instructions: text("instructions"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const recipe_ingredients = sqliteTable("recipe_ingredients", {
  id: text("id").primaryKey(),
  recipeId: text("recipeId")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  ingredientId: text("ingredientId")
    .notNull()
    .references(() => ingredients.id),
  quantityPerBase: real("quantityPerBase").notNull(),
  unit: text("unit").notNull(),
});
