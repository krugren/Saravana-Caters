import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// ─── Testimonials ────────────────────────────────────────────────────────────
export const testimonials = sqliteTable("testimonials", {
  id: text("id").primaryKey(),
  quote: text("quote").notNull(),
  name: text("name").notNull(),
  /** e.g. "Wedding · 450 guests · Erode" */
  detail: text("detail").notNull().default(""),
  /** Auto-generated initials shown as avatar */
  initials: text("initials").notNull().default(""),
  sortOrder: integer("sortOrder").notNull().default(0),
  isActive: integer("isActive", { mode: "boolean" }).notNull().default(true),
  /** Secret token returned to submitter for edit/delete auth (stored in localStorage) */
  editToken: text("editToken"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

// ─── Gallery images ───────────────────────────────────────────────────────────
export const gallery_images = sqliteTable("gallery_images", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  alt: text("alt").notNull().default(""),
  category: text("category").notNull().default("General"),
  /** First item in the home-page gallery preview grid */
  isFeatured: integer("isFeatured", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sortOrder").notNull().default(0),
  isActive: integer("isActive", { mode: "boolean" }).notNull().default(true),
  uploadedAt: text("uploadedAt").notNull(),
});
