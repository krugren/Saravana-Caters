import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Verifies that the caller has a valid session.
 * Throws an Unauthorized error if not authenticated.
 * Returns the full session object on success.
 */
export async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("Unauthorized: Authentication required");
  }
  return session;
}

/**
 * Verifies authentication AND that the caller holds one of the allowed roles.
 * Throws Forbidden if the role doesn't match.
 */
export async function requireRole(...allowedRoles: string[]) {
  const session = await requireAuth();
  const role = (session.user as any).role as string | undefined;
  if (!role || (allowedRoles.length > 0 && !allowedRoles.includes(role))) {
    throw new Error(`Forbidden: role '${role}' is not permitted for this action`);
  }
  return session;
}
