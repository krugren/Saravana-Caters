import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { auth } from "../lib/auth";
import * as schema from "./schema";
import { users } from "./schema";
import { eq } from "drizzle-orm";

// SEC-A1: Read credentials from environment variables — never hardcode secrets.
// Provide these in your .env file before running this script.
const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  console.error(
    "❌ INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD must be set in your environment before running this script."
  );
  process.exit(1);
}

const client = createClient({
  url: process.env.DATABASE_URL || "file:local.db",
});
const db = drizzle(client, { schema });

async function createAdmin() {
  const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log("DB Tables:", result.rows.map((r) => r.name).join(", "));

  try {
    const res = await auth.api.signUpEmail({
      body: {
        email: adminEmail!,
        password: adminPassword!,
        name: "Admin",
      },
    });

    const userId = res.user?.id;
    if (!userId) throw new Error("User creation did not return an ID");

    // SEC-A1: Better-Auth defaults new users to the least-privilege "KITCHEN" role.
    // Explicitly upgrade this bootstrapped user to OWNER immediately after creation.
    await db
      .update(users)
      .set({ role: "OWNER", updatedAt: new Date().toISOString() })
      .where(eq(users.id, userId));

    console.log("✅ Admin (OWNER) user created:", res.user?.email);
    console.log("\n--- Login Credentials ---");
    console.log("URL:     http://localhost:3000/login");
    console.log("Email:   " + adminEmail);
    console.log("Role:    OWNER");
  } catch (e: any) {
    const msg = e?.message || JSON.stringify(e);
    if (msg.includes("already exists") || msg.includes("UNIQUE") || e?.status === 422 || e?.status === 200) {
      console.log("ℹ️  Admin user already exists.");
      console.log("If this user is stuck at KITCHEN role, run:");
      console.log(`  UPDATE users SET role='OWNER' WHERE email='${adminEmail}';`);
    } else {
      console.error("❌ Error:", msg);
      console.error("Full error:", e);
    }
  } finally {
    client.close();
  }
}

createAdmin().catch((e) => {
  console.error(e);
  process.exit(1);
});
