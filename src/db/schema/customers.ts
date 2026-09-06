import { sqliteTable, text, real, index } from "drizzle-orm/sqlite-core";

export const customers = sqliteTable(
  "customers",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    address: text("address"),
    createdAt: text("createdAt").notNull(),
    updatedAt: text("updatedAt").notNull(),
    deletedAt: text("deletedAt"), // Soft delete — NULL means active
  },
  (table) => ({
    phoneIdx: index("customers_phone_idx").on(table.phone),
  })
);

export const enquiries = sqliteTable("enquiries", {
  id: text("id").primaryKey(),
  customerId: text("customerId")
    .notNull()
    .references(() => customers.id),
  eventType: text("eventType").notNull(),
  eventDate: text("eventDate"),
  expectedGuests: real("expectedGuests"),
  venue: text("venue"),
  source: text("source").notNull(),
  status: text("status").notNull().default("NEW"),
  notes: text("notes"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
  deletedAt: text("deletedAt"), // Soft delete — NULL means active
});

export const enquiry_interactions = sqliteTable("enquiry_interactions", {
  id: text("id").primaryKey(),
  enquiryId: text("enquiryId")
    .notNull()
    .references(() => enquiries.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  notes: text("notes"),
  createdAt: text("createdAt").notNull(),
});

export const quotations = sqliteTable("quotations", {
  id: text("id").primaryKey(),
  quotationNumber: text("quotationNumber").notNull().unique(),
  enquiryId: text("enquiryId").references(() => enquiries.id),
  customerId: text("customerId")
    .notNull()
    .references(() => customers.id),
  serviceModelId: text("serviceModelId").notNull(),
  status: text("status").notNull().default("DRAFT"),
  validUntil: text("validUntil"),
  
  eventType: text("eventType").notNull(),
  eventDate: text("eventDate").notNull(),
  guests: real("guests").notNull(),
  venue: text("venue"),
  
  subtotal: real("subtotal").notNull(),
  discountPercent: real("discountPercent").default(0),
  discountAmount: real("discountAmount").notNull(),
  gstPercent: real("gstPercent").default(5),
  gstAmount: real("gstAmount").notNull(),
  grandTotal: real("grandTotal").notNull(),
  advanceRequired: real("advanceRequired").notNull(),
  
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const quotation_line_items = sqliteTable("quotation_line_items", {
  id: text("id").primaryKey(),
  quotationId: text("quotationId")
    .notNull()
    .references(() => quotations.id, { onDelete: "cascade" }),
  dishId: text("dishId"),
  name: text("name").notNull(),
  category: text("category"),
  quantity: real("quantity").notNull(),
  unit: text("unit").notNull(),
  rate: real("rate").notNull(),
  total: real("total").notNull(),
  sortOrder: real("sortOrder").notNull().default(0),
});

export const bookings = sqliteTable("bookings", {
  id: text("id").primaryKey(),
  quotationId: text("quotationId")
    .notNull()
    .references(() => quotations.id),
  customerId: text("customerId")
    .notNull()
    .references(() => customers.id),
  status: text("status").notNull().default("TENTATIVE"),

  eventType: text("eventType").notNull(),
  eventDate: text("eventDate").notNull(),
  venue: text("venue"),
  totalValue: real("totalValue").notNull(),

  advancePaid: real("advancePaid").default(0),
  balanceDue: real("balanceDue").notNull(),

  notes: text("notes"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
  deletedAt: text("deletedAt"), // Soft delete — NULL means active
});
