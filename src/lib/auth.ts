import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    // Map better-auth model names to our schema table exports
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    // SEC-02: Disable self-registration — accounts are created only via seed/create-admin script
    disableSignUp: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        // SEC-02: Least-privilege default — explicit OWNER/ADMIN must be set in DB
        defaultValue: "KITCHEN",
      },
    },
  },
});
