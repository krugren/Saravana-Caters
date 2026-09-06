/**
 * add-missing-columns.mts
 * Safely adds any schema columns that exist in Drizzle definitions
 * but are missing from the live SQLite database.
 * Uses "ALTER TABLE ... ADD COLUMN IF NOT EXISTS" (no-op if already present).
 *
 * Run: pnpm tsx src/db/add-missing-columns.mts
 */
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL ?? "file:local.db",
});

// Each entry: [table, column, SQL type, default]
const migrations: [string, string, string, string?][] = [
  // deletedAt soft-delete columns
  ["enquiries",  "deletedAt",  "TEXT", undefined],
  ["customers",  "deletedAt",  "TEXT", undefined],
  ["bookings",   "deletedAt",  "TEXT", undefined],

  // Any other columns added to schema after initial push go here
];

let applied = 0;
let skipped = 0;

for (const [table, column, type, dflt] of migrations) {
  // Check current columns on the table
  const pragma = await client.execute(`PRAGMA table_info("${table}")`);
  const exists = pragma.rows.some((r) => r.name === column);

  if (exists) {
    console.log(`  ⏭  ${table}.${column} — already exists, skipping`);
    skipped++;
    continue;
  }

  const defaultClause = dflt !== undefined ? ` DEFAULT ${dflt}` : "";
  const sql = `ALTER TABLE "${table}" ADD COLUMN "${column}" ${type}${defaultClause}`;

  try {
    await client.execute(sql);
    console.log(`  ✅  ${table}.${column} — added`);
    applied++;
  } catch (e: any) {
    console.error(`  ❌  ${table}.${column} — ${e.message}`);
  }
}

console.log(`\nDone. Applied: ${applied}, Skipped: ${skipped}`);
client.close();
