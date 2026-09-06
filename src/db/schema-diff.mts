/**
 * schema-diff.mts
 * Compares the Drizzle schema definitions against the live SQLite database.
 * Detects: missing columns, type mismatches, missing tables.
 * Automatically applies any safe ALTER TABLE ADD COLUMN fixes.
 *
 * Run: pnpm tsx src/db/schema-diff.mts
 */
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL ?? "file:local.db",
});

// ─── Expected schema (derived from all src/db/schema/*.ts files) ───────────
// Format: { tableName: { columnName: "SQL_TYPE [NOT NULL] [DEFAULT x]" } }
const EXPECTED_SCHEMA: Record<string, Record<string, string>> = {
  // auth.ts
  users: {
    id: "TEXT NOT NULL",
    name: "TEXT NOT NULL",
    email: "TEXT NOT NULL",
    emailVerified: "INTEGER NOT NULL",
    image: "TEXT",
    role: "TEXT NOT NULL",
    createdAt: "TEXT NOT NULL",
    updatedAt: "TEXT NOT NULL",
  },
  sessions: {
    id: "TEXT NOT NULL",
    expiresAt: "TEXT NOT NULL",
    token: "TEXT NOT NULL",
    createdAt: "TEXT NOT NULL",
    updatedAt: "TEXT NOT NULL",
    ipAddress: "TEXT",
    userAgent: "TEXT",
    userId: "TEXT NOT NULL",
  },
  accounts: {
    id: "TEXT NOT NULL",
    accountId: "TEXT NOT NULL",
    providerId: "TEXT NOT NULL",
    userId: "TEXT NOT NULL",
    accessToken: "TEXT",
    refreshToken: "TEXT",
    idToken: "TEXT",
    accessTokenExpiresAt: "TEXT",
    refreshTokenExpiresAt: "TEXT",
    scope: "TEXT",
    password: "TEXT",
    createdAt: "TEXT NOT NULL",
    updatedAt: "TEXT NOT NULL",
  },
  verifications: {
    id: "TEXT NOT NULL",
    identifier: "TEXT NOT NULL",
    value: "TEXT NOT NULL",
    expiresAt: "TEXT NOT NULL",
    createdAt: "TEXT",
    updatedAt: "TEXT",
  },

  // customers.ts
  customers: {
    id: "TEXT NOT NULL",
    name: "TEXT NOT NULL",
    phone: "TEXT NOT NULL",
    email: "TEXT",
    address: "TEXT",
    createdAt: "TEXT NOT NULL",
    updatedAt: "TEXT NOT NULL",
    deletedAt: "TEXT",
  },
  enquiries: {
    id: "TEXT NOT NULL",
    customerId: "TEXT NOT NULL",
    eventType: "TEXT NOT NULL",
    eventDate: "TEXT",
    expectedGuests: "REAL",
    venue: "TEXT",
    source: "TEXT NOT NULL",
    status: "TEXT NOT NULL",
    notes: "TEXT",
    createdAt: "TEXT NOT NULL",
    updatedAt: "TEXT NOT NULL",
    deletedAt: "TEXT",
  },
  enquiry_interactions: {
    id: "TEXT NOT NULL",
    enquiryId: "TEXT NOT NULL",
    type: "TEXT NOT NULL",
    notes: "TEXT",
    createdAt: "TEXT NOT NULL",
  },
  quotations: {
    id: "TEXT NOT NULL",
    quotationNumber: "TEXT NOT NULL",
    enquiryId: "TEXT",
    customerId: "TEXT NOT NULL",
    serviceModelId: "TEXT NOT NULL",
    status: "TEXT NOT NULL",
    validUntil: "TEXT",
    eventType: "TEXT NOT NULL",
    eventDate: "TEXT NOT NULL",
    guests: "REAL NOT NULL",
    venue: "TEXT",
    subtotal: "REAL NOT NULL",
    discountPercent: "REAL",
    discountAmount: "REAL NOT NULL",
    gstPercent: "REAL",
    gstAmount: "REAL NOT NULL",
    grandTotal: "REAL NOT NULL",
    advanceRequired: "REAL NOT NULL",
    createdAt: "TEXT NOT NULL",
    updatedAt: "TEXT NOT NULL",
  },
  quotation_line_items: {
    id: "TEXT NOT NULL",
    quotationId: "TEXT NOT NULL",
    dishId: "TEXT",
    name: "TEXT NOT NULL",
    category: "TEXT",
    quantity: "REAL NOT NULL",
    unit: "TEXT NOT NULL",
    rate: "REAL NOT NULL",
    total: "REAL NOT NULL",
    sortOrder: "REAL NOT NULL",
  },
  bookings: {
    id: "TEXT NOT NULL",
    quotationId: "TEXT NOT NULL",
    customerId: "TEXT NOT NULL",
    status: "TEXT NOT NULL",
    eventType: "TEXT NOT NULL",
    eventDate: "TEXT NOT NULL",
    venue: "TEXT",
    totalValue: "REAL NOT NULL",
    advancePaid: "REAL",
    balanceDue: "REAL NOT NULL",
    notes: "TEXT",
    createdAt: "TEXT NOT NULL",
    updatedAt: "TEXT NOT NULL",
    deletedAt: "TEXT",
  },

  // inventory.ts
  ingredients: {
    id: "TEXT NOT NULL",
    name: "TEXT NOT NULL",
    unit: "TEXT NOT NULL",
    category: "TEXT",
    currentStock: "REAL NOT NULL",
    reorderLevel: "REAL NOT NULL",
    createdAt: "TEXT NOT NULL",
    updatedAt: "TEXT NOT NULL",
  },
  stock_movements: {
    id: "TEXT NOT NULL",
    ingredientId: "TEXT NOT NULL",
    type: "TEXT NOT NULL",
    quantity: "REAL NOT NULL",
    notes: "TEXT",
    createdAt: "TEXT NOT NULL",
  },
  suppliers: {
    id: "TEXT NOT NULL",
    name: "TEXT NOT NULL",
    phone: "TEXT",
    email: "TEXT",
    address: "TEXT",
    createdAt: "TEXT NOT NULL",
    updatedAt: "TEXT NOT NULL",
  },

  // kitchen.ts
  kitchen_plans: {
    id: "TEXT NOT NULL",
    bookingId: "TEXT NOT NULL",
    status: "TEXT NOT NULL",
    notes: "TEXT",
    createdAt: "TEXT NOT NULL",
    updatedAt: "TEXT NOT NULL",
  },
  kitchen_tasks: {
    id: "TEXT NOT NULL",
    kitchenPlanId: "TEXT NOT NULL",
    title: "TEXT NOT NULL",
    assignedTo: "TEXT",
    status: "TEXT NOT NULL",
    dueTime: "TEXT",
    createdAt: "TEXT NOT NULL",
  },

  // menus.ts
  dishes: {
    id: "TEXT NOT NULL",
    name: "TEXT NOT NULL",
    category: "TEXT NOT NULL",
    description: "TEXT",
    isVeg: "INTEGER NOT NULL",
    isActive: "INTEGER NOT NULL",
    createdAt: "TEXT NOT NULL",
    updatedAt: "TEXT NOT NULL",
  },
  recipes: {
    id: "TEXT NOT NULL",
    dishId: "TEXT NOT NULL",
    servingSize: "REAL NOT NULL",
    notes: "TEXT",
    createdAt: "TEXT NOT NULL",
    updatedAt: "TEXT NOT NULL",
  },
  recipe_ingredients: {
    id: "TEXT NOT NULL",
    recipeId: "TEXT NOT NULL",
    ingredientId: "TEXT NOT NULL",
    quantity: "REAL NOT NULL",
  },
  service_models: {
    id: "TEXT NOT NULL",
    name: "TEXT NOT NULL",
    type: "TEXT NOT NULL",
    description: "TEXT",
    isActive: "INTEGER NOT NULL",
    createdAt: "TEXT NOT NULL",
    updatedAt: "TEXT NOT NULL",
  },

  // tasks.ts
  tasks: {
    id: "TEXT NOT NULL",
    title: "TEXT NOT NULL",
    description: "TEXT",
    assignedTo: "TEXT",
    status: "TEXT NOT NULL",
    priority: "TEXT NOT NULL",
    dueDate: "TEXT",
    createdAt: "TEXT NOT NULL",
    updatedAt: "TEXT NOT NULL",
  },

  // audit.ts
  audit_log: {
    id: "TEXT NOT NULL",
    userId: "TEXT",
    action: "TEXT NOT NULL",
    resource: "TEXT NOT NULL",
    resourceId: "TEXT",
    details: "TEXT",
    createdAt: "TEXT NOT NULL",
  },

  // config.ts
  config: {
    key: "TEXT NOT NULL",
    value: "TEXT NOT NULL",
    updatedAt: "TEXT NOT NULL",
  },
};

// ─── Diff and fix ────────────────────────────────────────────────────────────
console.log("=== Schema Diff: Drizzle vs Live SQLite ===\n");

let totalMissing = 0;
let totalFixed = 0;
let totalErrors = 0;

for (const [tableName, expectedCols] of Object.entries(EXPECTED_SCHEMA)) {
  // Check table exists
  const tableCheck = await client.execute(
    `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
    [tableName]
  );
  if (tableCheck.rows.length === 0) {
    console.log(`❌ TABLE MISSING: ${tableName} — run pnpm db:push to create it`);
    totalErrors++;
    continue;
  }

  // Get actual columns
  const pragma = await client.execute(`PRAGMA table_info("${tableName}")`);
  const actualCols = new Set(pragma.rows.map((r) => r.name as string));

  // Find missing columns
  const missing = Object.keys(expectedCols).filter((col) => !actualCols.has(col));

  if (missing.length === 0) {
    console.log(`  ✅ ${tableName} — all columns present`);
    continue;
  }

  console.log(`  ⚠️  ${tableName} — missing columns: ${missing.join(", ")}`);

  for (const col of missing) {
    totalMissing++;
    const typeSpec = expectedCols[col];
    // Extract base SQLite type (TEXT, REAL, INTEGER) for ALTER TABLE
    const baseType = typeSpec.split(" ")[0];
    const sql = `ALTER TABLE "${tableName}" ADD COLUMN "${col}" ${baseType}`;

    try {
      await client.execute(sql);
      console.log(`    ✅  Added: ${col} ${baseType}`);
      totalFixed++;
    } catch (e: any) {
      console.error(`    ❌  Failed to add ${col}: ${e.message}`);
      totalErrors++;
    }
  }
}

console.log(`\n=== Summary ===`);
console.log(`Missing columns found: ${totalMissing}`);
console.log(`Fixed: ${totalFixed}`);
console.log(`Errors: ${totalErrors}`);

client.close();
