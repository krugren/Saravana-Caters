import { createClient } from "@libsql/client";
const client = createClient({ url: "file:local.db" });

// Find what tables exist
const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
console.log("Tables in database:", tables.rows.map(r => r.name).join(", ") || "(none — db not migrated yet)");

// Try both possible table names Better Auth might use
const tableName = tables.rows.find(r => r.name === "user" || r.name === "users")?.name;
if (!tableName) {
  console.log("\n❌ No user table found. Run: pnpm db:push  then  pnpm tsx src/db/create-admin.ts");
} else {
  const result = await client.execute(`SELECT email, name, role, created_at FROM "${tableName}"`);
  if (result.rows.length === 0) {
    console.log("\nNo users yet. Run: pnpm tsx src/db/create-admin.ts");
  } else {
    console.log("\n=== Admin Users ===");
    result.rows.forEach(row => {
      console.log(`Email:   ${row.email}`);
      console.log(`Name:    ${row.name}`);
      console.log(`Role:    ${row.role}`);
      console.log("---");
    });
  }
}
client.close();
