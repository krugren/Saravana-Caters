"use server";

import { db } from "@/db";
import { enquiries, customers } from "@/db/schema";
import { generateId } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { headers } from "next/headers";

// SEC-06: Input validation schema (manual, no external dep needed)
function validateEnquiryInput(data: unknown): {
  name: string;
  phone: string;
  eventType: string;
  eventDate: string;
  guests: number;
  message: string;
  turnstileToken?: string;
} {
  if (typeof data !== "object" || data === null) throw new Error("Invalid input");
  const d = data as Record<string, unknown>;

  const name = String(d.name ?? "").trim();
  const phone = String(d.phone ?? "").trim();
  const eventType = String(d.eventType ?? "OTHER").trim();
  const eventDate = String(d.eventDate ?? "").trim();
  const guests = Number(d.guests ?? 100);
  const message = String(d.message ?? "").trim();
  const turnstileToken = d.turnstileToken ? String(d.turnstileToken) : undefined;

  // Length & content guards
  if (!name || name.length > 100) throw new Error("Invalid name");
  if (!phone || phone.length > 20 || !/^[0-9+\-\s()]+$/.test(phone))
    throw new Error("Invalid phone number");
  // SEC-V4: Enforce minimum real digits (8–15 per E.164) to block phantom entries like "---" or "(  ) +"
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 8 || phoneDigits.length > 15)
    throw new Error("Phone number must contain 8 to 15 digits");
  if (!["WEDDING","RECEPTION","BIRTHDAY","CORPORATE","TEMPLE","HOUSEWARMING","OTHER"].includes(eventType))
    throw new Error("Invalid event type");
  if (eventDate && !/^\d{4}-\d{2}-\d{2}$/.test(eventDate))
    throw new Error("Invalid date format");
  if (!Number.isInteger(guests) || guests < 1 || guests > 50000)
    throw new Error("Invalid guest count");
  if (message.length > 2000) throw new Error("Message too long");

  return { name, phone, eventType, eventDate, guests, message, turnstileToken };
}

export async function submitPublicEnquiry(formData: {
  name: string;
  phone: string;
  eventType: string;
  eventDate: string;
  guests: number;
  message: string;
  turnstileToken?: string;
}) {
  // SEC-04: Verify Turnstile token server-side before any DB write
  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("cf-connecting-ip") ??
    requestHeaders.get("x-forwarded-for") ??
    undefined;

  const turnstileResult = await verifyTurnstileToken(formData.turnstileToken, ip);
  if (!turnstileResult.success) {
    throw new Error(`Bot verification failed: ${turnstileResult.reason}`);
  }

  // SEC-06: Validate and sanitize all inputs
  const data = validateEnquiryInput(formData);

  // SEC-V4: Wrap in transaction to prevent partial writes.
  // If the enquiry insert fails, the customer row is rolled back too.
  let customerId: string;
  let enquiryId: string;

  await db.transaction(async (tx) => {
    const existing = await tx
      .select()
      .from(customers)
      .where(eq(customers.phone, data.phone))
      .limit(1);

    if (existing.length > 0) {
      customerId = existing[0].id;
    } else {
      customerId = generateId();
      await tx.insert(customers).values({
        id: customerId,
        name: data.name,
        phone: data.phone,
        email: null,
        address: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    enquiryId = generateId();
    await tx.insert(enquiries).values({
      id: enquiryId,
      customerId,
      eventType: data.eventType,
      expectedGuests: data.guests,
      eventDate: data.eventDate || null,
      status: "NEW",
      source: "WEBSITE",
      notes: data.message || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

  revalidatePath("/enquiries");
  return { success: true, enquiryId: enquiryId! };
}
