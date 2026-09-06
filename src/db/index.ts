import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const client = createClient({
  // SEC-A3: Provide a local dev fallback — prevents opaque TypeError crashes
  // when DATABASE_URL is not yet set (e.g. during first-time setup / migrations).
  url: process.env.DATABASE_URL || "file:local.db",
});
export const db = drizzle(client, { schema });
export type Database = typeof db;
