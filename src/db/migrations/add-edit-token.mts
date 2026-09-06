// Direct SQLite migration — adds editToken column to testimonials
// Run with: pnpm tsx src/db/migrations/add-edit-token.mts

import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const client = createClient({ url });

async function main() {
  // Check if column already exists
  const info = await client.execute("PRAGMA table_info('testimonials')");
  const hasColumn = info.rows.some((row) => row[1] === "editToken");

  if (hasColumn) {
    console.log("✓ editToken column already exists — nothing to do.");
  } else {
    await client.execute("ALTER TABLE testimonials ADD COLUMN editToken TEXT");
    console.log("✓ editToken column added successfully.");
  }

  await client.close();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
