/**
 * bootstrap-owner.mts
 * Creates or updates the OWNER account directly in the database,
 * bypassing the disabled public sign-up API.
 *
 * Run once: pnpm tsx src/db/bootstrap-owner.mts
 * Delete this file after use (it contains hardcoded credentials).
 */
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import * as schema from "./schema/index.js";
import { auth } from "../lib/auth.js";

const EMAIL = "saravanacaters@gmail.com";
const PASSWORD = "9842722977";
const NAME = "Saravana Caters";

const client = createClient({ url: process.env.DATABASE_URL ?? "file:local.db" });
const db = drizzle(client, { schema });

// Use Better Auth's built-in password hashing (Argon2 / bcrypt depending on config)
// ctx.password.hash() is the internal API — safer than rolling our own
const ctx = (auth as any).context ?? (auth as any)._ctx ?? (auth as any).$context;
const hashFn = ctx?.password?.hash ?? ctx?.options?.emailAndPassword?.password?.hash;

let hashedPassword: string;
if (typeof hashFn === "function") {
  hashedPassword = await hashFn(PASSWORD);
} else {
  // Fallback: use built-in crypto to do a SHA-256 — note: Better Auth
  // actually uses scrypt internally. Re-enable signUp temporarily instead.
  throw new Error(
    "Could not access Better Auth's hash function. " +
    "Set disableSignUp: false temporarily, run create-admin.ts, then re-enable."
  );
}

// Check if user already exists
const existing = await db
  .select({ id: schema.users.id, role: schema.users.role })
  .from(schema.users)
  .where(eq(schema.users.email, EMAIL))
  .limit(1);

if (existing.length > 0) {
  // Update password and ensure OWNER role
  await db
    .update(schema.users)
    .set({ role: "OWNER", updatedAt: new Date().toISOString() })
    .where(eq(schema.users.email, EMAIL));

  // Also update the account password hash
  await db
    .update(schema.accounts)
    .set({ password: hashedPassword })
    .where(eq(schema.accounts.userId, existing[0].id));

  console.log("✅ Updated existing user to OWNER and reset password.");
  console.log(`   Email: ${EMAIL}`);
} else {
  // Create new user + account in one transaction
  const userId = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.insert(schema.users).values({
    id: userId,
    name: NAME,
    email: EMAIL,
    emailVerified: true,
    role: "OWNER",
    createdAt: now,
    updatedAt: now,
  });

  await db.insert(schema.accounts).values({
    id: crypto.randomUUID(),
    userId,
    accountId: EMAIL,
    providerId: "credential",
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  });

  console.log("✅ OWNER account created successfully!");
  console.log(`   Email: ${EMAIL}`);
}

console.log("\n--- Login at ---");
console.log("   http://localhost:3001/login");
console.log(`   Email:    ${EMAIL}`);
console.log(`   Password: ${PASSWORD}`);
console.log("\nDelete this file after use: src/db/bootstrap-owner.mts");

client.close();
