import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { generateId } from "@/lib/utils";

/**
 * Constant-time string comparison — prevents timing side-channel attacks.
 * An attacker measuring response latency differences cannot reconstruct CRON_SECRET
 * byte-by-byte because both buffers are always fully compared regardless of mismatch position.
 */
function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // Length mismatch guard: pad to equal length before comparison so the
  // crypto.timingSafeEqual doesn't throw, while still returning false.
  if (bufA.length !== bufB.length) {
    // Compare against a dummy buffer of the correct length so timing is consistent.
    crypto.timingSafeEqual(bufA, Buffer.alloc(bufA.length));
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization") ?? "";

  if (secret) {
    const expected = `Bearer ${secret}`;
    // Use constant-time comparison to prevent timing oracle attacks
    if (!timingSafeEqual(authHeader, expected)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else {
    console.warn("[CRON] CRON_SECRET is not set — endpoint is unauthenticated. Set it in env.");
  }

  try {
    await db.insert(tasks).values({
      id: generateId(),
      title: "Daily Morning Prep Sync",
      description: "Review today's kitchen plans and verify ingredient availability.",
      status: "TODO",
      priority: "HIGH",
      sourceModule: "SYSTEM_CRON",
      createdBy: "SYSTEM",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: "Daily cron jobs executed successfully" });
  } catch (error) {
    console.error("[CRON] Error:", error instanceof Error ? error.message : "Unknown");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
