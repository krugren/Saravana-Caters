import { createAuthClient } from "better-auth/react";

// Use the current page's origin when running in the browser so the auth
// client always hits the same host/port as the page itself — this is critical
// for the two-door architecture where admin runs on a different port/domain.
// Fall back to NEXT_PUBLIC_APP_URL for server-side rendering.
const baseURL =
  typeof window !== "undefined"
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");

export const authClient = createAuthClient({ baseURL });
