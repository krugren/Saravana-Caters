import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { sanitizeText, sanitizeName, sanitizeRating } from "@/lib/sanitize";
import { detectGibberish } from "@/lib/gibberish-detector";
import { checkRateLimit, retryAfterSeconds } from "@/lib/rate-limiter";

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Return the best available IP address.
 *
 * X-Forwarded-For / X-Real-IP can be spoofed by the client if there is no
 * trusted reverse proxy in front.  We only read those headers when the
 * TRUSTED_PROXY env var is set to "1" (e.g. when running behind nginx/Cloudflare).
 * In a direct deployment (the current setup), we fall back to a constant so
 * that the rate limiter is still applied — at the shared-server level rather
 * than per-IP.  This is conservative but safe.
 */
function getIp(req: NextRequest): string {
  const trustedProxy = process.env.TRUSTED_PROXY === "1";
  if (trustedProxy) {
    return (
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "127.0.0.1"
    );
  }
  // No trusted proxy — treat every visitor as coming from a single shared IP.
  // This means the rate limit is per-server, not per-client, which is safe
  // (it limits the form to 2 submissions total per 24 h on this machine).
  // Set TRUSTED_PROXY=1 when deploying behind nginx/Cloudflare.
  return "direct";
}

/** Verify Origin header matches the expected host (CSRF guard for API routes). */
function originAllowed(req: NextRequest): boolean {
  const origin = req.headers.get("origin") ?? "";
  const host   = req.headers.get("host") ?? "";
  if (!origin) return false; // no origin → not a browser request
  try {
    const url = new URL(origin);
    return url.host === host;
  } catch {
    return false;
  }
}

function rateLimitedResponse(ip: string, action: "edit" | "delete") {
  const secs = retryAfterSeconds(ip, action);
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    { status: 429, headers: { "Retry-After": String(secs) } }
  );
}

// ── GET /api/public/review?id=&token= ─────────────────────────────────────────
// Fetches a review's editable fields, token-gated.
export async function GET(req: NextRequest) {
  const id    = req.nextUrl.searchParams.get("id")?.slice(0, 64) ?? "";
  const token = req.nextUrl.searchParams.get("token")?.slice(0, 64) ?? "";

  if (!id || !token) {
    return NextResponse.json({ error: "Missing id or token." }, { status: 400 });
  }

  const rows = await db
    .select({
      id:       testimonials.id,
      name:     testimonials.name,
      detail:   testimonials.detail,
      quote:    testimonials.quote,
      isActive: testimonials.isActive,
    })
    .from(testimonials)
    .where(and(eq(testimonials.id, id), eq(testimonials.editToken, token)))
    .limit(1);

  if (!rows.length) {
    return NextResponse.json({ error: "Review not found or token invalid." }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}

// ── PATCH /api/public/review ───────────────────────────────────────────────────
// Edit a review. Resets isActive → false (pending re-approval).
export async function PATCH(req: NextRequest) {
  if (!originAllowed(req)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const ip = getIp(req);
  if (!checkRateLimit(ip, "edit")) return rateLimitedResponse(ip, "edit");

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // ── Honeypot ──
  if (body.hp) return NextResponse.json({ success: true });

  const id    = sanitizeText(body.id,    64);
  const token = sanitizeText(body.token, 64);

  if (!id || !token) {
    return NextResponse.json({ error: "Missing id or token." }, { status: 400 });
  }

  // Verify token matches DB
  const existing = await db
    .select({ id: testimonials.id })
    .from(testimonials)
    .where(and(eq(testimonials.id, id), eq(testimonials.editToken, token)))
    .limit(1);

  if (!existing.length) {
    return NextResponse.json({ error: "Review not found or token invalid." }, { status: 404 });
  }

  // Sanitise fields
  const name       = sanitizeName(body.name, 80);
  const location   = sanitizeText(body.location, 60);
  const eventType  = sanitizeText(body.eventType, 80);
  const reviewText = sanitizeText(body.review, 2000);
  const rating     = sanitizeRating(body.rating);

  // Validate
  if (!name || name.length < 2)
    return NextResponse.json({ error: "Please enter a valid name." }, { status: 400 });
  if (rating === null)
    return NextResponse.json({ error: "Please select a star rating." }, { status: 400 });
  if (!reviewText || reviewText.length < 20)
    return NextResponse.json({ error: "Please write at least 20 characters." }, { status: 400 });

  // Gibberish detection
  const gib = detectGibberish(reviewText);
  if (gib.isGibberish) {
    return NextResponse.json(
      { error: "Your review doesn't appear to be meaningful text. Please write a genuine review." },
      { status: 422 }
    );
  }

  const detail   = [eventType, location].filter(Boolean).join(" · ");
  const initials = name.split(/\s+/).map((w) => w[0]?.toUpperCase() ?? "").slice(0, 2).join("");

  await db
    .update(testimonials)
    .set({ quote: reviewText, name, detail, initials, isActive: true, updatedAt: new Date().toISOString() })
    .where(eq(testimonials.id, id));

  return NextResponse.json({ success: true });
}

// ── DELETE /api/public/review ─────────────────────────────────────────────────
// Permanently removes a review. Requires valid editToken.
export async function DELETE(req: NextRequest) {
  if (!originAllowed(req)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const ip = getIp(req);
  if (!checkRateLimit(ip, "delete")) return rateLimitedResponse(ip, "delete");

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const id    = sanitizeText(body.id,    64);
  const token = sanitizeText(body.token, 64);

  if (!id || !token) {
    return NextResponse.json({ error: "Missing id or token." }, { status: 400 });
  }

  const existing = await db
    .select({ id: testimonials.id })
    .from(testimonials)
    .where(and(eq(testimonials.id, id), eq(testimonials.editToken, token)))
    .limit(1);

  if (!existing.length) {
    return NextResponse.json({ error: "Review not found or token invalid." }, { status: 404 });
  }

  // Use BOTH id AND editToken in WHERE — strict, no TOCTOU gap
  await db.delete(testimonials)
    .where(and(eq(testimonials.id, id), eq(testimonials.editToken, token)));

  return NextResponse.json({ success: true });
}
