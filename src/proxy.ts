import { NextResponse, type NextRequest } from "next/server";
import type { auth } from "@/lib/auth";

type Session = typeof auth.$Infer.Session;

// Next.js 16 renames "middleware" to "proxy". The file must be proxy.ts and
// the exported function must be named `proxy`. config must be a literal object
// defined directly here — re-exporting it from another module is forbidden.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

// ─────────────────────────────────────────────────────────────────────────────
// TWO-DOOR ARCHITECTURE
// ─────────────────────────────────────────────────────────────────────────────
//
//  saravanacaters.in          → PUBLIC website only
//    /login, /dashboard etc   → 404 (admin routes don't exist here)
//
//  sc-ops-hub.saravanacaters.in → ADMIN panel only
//    /login                   → always visible, credentials required
//    /, /about, /services etc → 404 (public routes don't exist here)
//
// In local development:
//  localhost:3000             → public site  (NEXT_PUBLIC_IS_ADMIN_HOST unset)
//  localhost:3001             → admin panel  (NEXT_PUBLIC_IS_ADMIN_HOST=true)
//
// ADMIN_HOST is the production admin hostname (set in env).
// ─────────────────────────────────────────────────────────────────────────────

const ADMIN_HOST = process.env.ADMIN_HOST ?? "sc-ops-hub.saravanacaters.in";

const PUBLIC_PATHS = ["/", "/about", "/services", "/gallery", "/menu", "/contact", "/reviews"];
const ADMIN_PATHS = ["/login", "/dashboard", "/enquiries", "/customers", "/inventory", "/quotations", "/tasks", "/config", "/kitchen", "/menus", "/testimonials", "/photos", "/bookings", "/audit", "/intelligence", "/procurement"];

// HIGH-2: Explicit static-asset regex — prevents dot-in-path auth bypass
const STATIC_EXT = /\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|mjs|woff2?|ttf|eot|map|txt|xml|json|webmanifest)$/i;

function isAdminHost(request: NextRequest): boolean {
  // In local dev, differentiate by port: 3001 = admin, 3000 = public
  if (process.env.NODE_ENV === "development") {
    return process.env.NEXT_PUBLIC_IS_ADMIN_HOST === "true";
  }
  const host = request.headers.get("host") ?? "";
  return host === ADMIN_HOST || host.startsWith(`${ADMIN_HOST}:`);
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const onAdminHost = isAdminHost(request);

  // Always allow: static assets, Next.js internals, auth API, and metadata routes
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    STATIC_EXT.test(pathname)
  ) {
    return NextResponse.next();
  }

  // ── DOMAIN SEPARATION ─────────────────────────────────────────────────────
  if (!onAdminHost) {
    // ── PUBLIC SITE (saravanacaters.in) ──
    // Admin paths do not exist here — return 404 so they are not discoverable
    const isAdminPath = ADMIN_PATHS.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`)
    );
    if (isAdminPath) {
      return NextResponse.rewrite(new URL("/not-found", request.url), { status: 404 });
    }

    // Public paths pass through freely
    const isPublicPath =
      PUBLIC_PATHS.includes(pathname) ||
      pathname.startsWith("/services/") ||
      pathname.startsWith("/gallery/") ||
      pathname.startsWith("/menu/");

    if (isPublicPath) {
      return NextResponse.next();
    }

    // Any unmatched route on the public domain → 404
    return NextResponse.rewrite(new URL("/not-found", request.url), { status: 404 });
  }

  // ── ADMIN SITE (sc-ops-hub.saravanacaters.in) ──
  // "/" on admin host → always redirect to dashboard (session check below handles auth)
  if (pathname === "/") {
    // Let session check run first — unauthenticated users will redirect to /login
    // Authenticated users: redirect to /dashboard
  }

  // Public content paths do not exist here — return 404
  const isPublicOnlyPath =
    (PUBLIC_PATHS.includes(pathname) && pathname !== "/") ||
    pathname.startsWith("/services/") ||
    pathname.startsWith("/gallery/") ||
    pathname.startsWith("/menu/");

  if (isPublicOnlyPath) {
    return NextResponse.rewrite(new URL("/not-found", request.url), { status: 404 });
  }

  // /login is always reachable on the admin host — no gate key needed
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // ── SESSION CHECK (admin host, non-login routes) ──────────────────────────
  const trustedOrigin =
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    request.nextUrl.origin;

  let session: Session | null = null;
  try {
    const res = await fetch(new URL("/api/auth/get-session", trustedOrigin), {
      headers: { cookie: request.headers.get("cookie") || "" },
    });
    if (res.ok) {
      session = await res.json();
    }
  } catch {
    // Session fetch fails → treat as unauthenticated — safe fallback
  }

  if (!session) {
    // Redirect unauthenticated users to login (admin host only)
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── ROLE-BASED ACCESS CONTROL ─────────────────────────────────────────────
  const user = (session as any).user as any;

  // "/" on admin host → redirect to dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (user?.role === "KITCHEN") {
    const allowedPrefixes = ["/dashboard", "/kitchen", "/inventory", "/tasks"];
    const isAllowed = allowedPrefixes.some((prefix) => pathname.startsWith(prefix));
    if (!isAllowed) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Redirect authenticated users away from /login to dashboard
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  // ──────────────────────────────────────────────────────────────────────────

  return NextResponse.next();
}
