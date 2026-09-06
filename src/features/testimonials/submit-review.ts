"use server";

import { headers } from "next/headers";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { generateId } from "@/lib/utils";
import { sanitizeText, sanitizeName, sanitizeRating } from "@/lib/sanitize";
import { detectGibberish } from "@/lib/gibberish-detector";
import { checkRateLimit, retryAfterSeconds } from "@/lib/rate-limiter";

export type SubmitReviewResult =
  | { success: true; reviewId: string; editToken: string }
  | { success: false; error: string };

export async function submitPublicReview(data: {
  name: string;
  location?: string;
  eventType: string;
  rating: number;
  review: string;
  honeypot?: string; // must be empty
}): Promise<SubmitReviewResult> {
  try {
    // ── 0. Honeypot ───────────────────────────────────────────────────────────
    // If the hidden field is filled, this is almost certainly a bot.
    // Silently return "success" so the bot doesn't know it was rejected.
    if (data.honeypot) {
      return { success: true, reviewId: "x", editToken: "x" };
    }

    // ── 1. IP rate limiting ───────────────────────────────────────────────────
    const reqHeaders = await headers();
    // Only trust X-Forwarded-For when a known reverse proxy sets it.
    // Without TRUSTED_PROXY=1, use a fixed key so the rate limiter applies
    // at the server level (conservative but not bypassable by header spoofing).
    const trustedProxy = process.env.TRUSTED_PROXY === "1";
    const ip = trustedProxy
      ? (reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() ??
         reqHeaders.get("x-real-ip") ??
         "127.0.0.1")
      : "direct";

    if (!checkRateLimit(ip, "submit")) {
      const wait = retryAfterSeconds(ip, "submit");
      const hours = Math.ceil(wait / 3600);
      return {
        success: false,
        error: `You've reached the review limit. Please try again in ${hours} hour${hours > 1 ? "s" : ""}.`,
      };
    }

    // ── 2. Sanitise all inputs ────────────────────────────────────────────────
    const name       = sanitizeName(data.name, 80);
    const location   = sanitizeText(data.location, 60);
    const eventType  = sanitizeText(data.eventType, 80);
    const reviewText = sanitizeText(data.review, 2000);
    const rating     = sanitizeRating(data.rating);

    // ── 3. Validate ───────────────────────────────────────────────────────────
    if (!name || name.length < 2)
      return { success: false, error: "Please enter your full name (at least 2 characters)." };

    if (rating === null)
      return { success: false, error: "Please select a star rating (1–5)." };

    if (!reviewText || reviewText.length < 20)
      return { success: false, error: "Please write at least 20 characters in your review." };

    if (reviewText.length > 2000)
      return { success: false, error: "Review is too long (maximum 2,000 characters)." };

    // ── 4. Gibberish detection ────────────────────────────────────────────────
    const gib = detectGibberish(reviewText);
    if (gib.isGibberish) {
      return {
        success: false,
        error:
          "Your review doesn't appear to be written in a recognisable language. " +
          "Please write a genuine review of your experience.",
      };
    }

    // Also run a lighter check on the name field
    const nameGib = detectGibberish(name);
    if (nameGib.isGibberish) {
      return { success: false, error: "Please enter a real name." };
    }

    // ── 5. Insert ─────────────────────────────────────────────────────────────
    const initials = name
      .split(/\s+/)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .slice(0, 2)
      .join("");

    const detail = [eventType, location].filter(Boolean).join(" · ");
    const now = new Date().toISOString();
    const reviewId = generateId();
    const editToken = crypto.randomUUID(); // 128-bit secret — cannot be guessed

    await db.insert(testimonials).values({
      id: reviewId,
      quote: reviewText,
      name,
      detail,
      initials,
      sortOrder: 9999,
      isActive: true, // publish immediately — admin can delete from the panel
      editToken,
      createdAt: now,
      updatedAt: now,
    });

    return { success: true, reviewId, editToken };
  } catch (err) {
    console.error("[submitPublicReview]", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
