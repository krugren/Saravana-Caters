"use client";

import { useState, useTransition } from "react";
import { submitPublicEnquiry } from "@/features/public/actions";
import { CheckCircle, Loader2 } from "lucide-react";
import TurnstileWidget from "@/components/public/turnstile";

const EVENT_TYPES = [
  { value: "", label: "Select event type..." },
  { value: "WEDDING", label: "Grand Wedding" },
  { value: "RECEPTION", label: "Wedding Reception" },
  { value: "BIRTHDAY", label: "Birthday Celebration" },
  { value: "CORPORATE", label: "Corporate / Institutional" },
  { value: "TEMPLE", label: "Temple Function" },
  { value: "HOUSEWARMING", label: "Housewarming" },
  { value: "OTHER", label: "Other" },
];

export default function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  // Turnstile is required only when a site key is configured (i.e. in production)
  const requiresTurnstile = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const canSubmit = !requiresTurnstile || !!turnstileToken;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      eventType: String(fd.get("eventType") || "OTHER"),
      eventDate: String(fd.get("eventDate") || ""),
      guests: Number(fd.get("guests") || 100),
      message: String(fd.get("message") || ""),
      turnstileToken: turnstileToken ?? undefined,
    };

    setError(null);
    startTransition(async () => {
      try {
        await submitPublicEnquiry(data);
        setDone(true);
      } catch {
        setError("Something went wrong. Please try calling us directly at +91 98427 22977.");
      }
    });
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#beead1] flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-[#0d631b]" />
        </div>
        <h3 className="font-display text-xl font-bold text-[#1b1c17]">We've received your enquiry!</h3>
        <p className="text-sm text-[#40493d] max-w-sm">
          Thank you for reaching out. We'll get back to you within 2 hours. You can also WhatsApp us at{" "}
          <a href="https://wa.me/919842722977" className="text-[#0d631b] font-semibold hover:underline">
            +91 98427 22977
          </a>
          .
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3 bg-[#f5f4ec] border border-[#e4e3db] rounded-lg text-sm text-[#1b1c17] placeholder-[#707a6c] focus:outline-none focus:ring-2 focus:ring-[#0d631b]/30 focus:border-[#0d631b] transition-colors";
  const labelClass = "block text-xs font-bold text-[#40493d] tracking-wide uppercase mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cf-name" className={labelClass}>Your Name *</label>
          <input id="cf-name" name="name" type="text" required placeholder="Rajasekaran M." className={inputClass} />
        </div>
        <div>
          <label htmlFor="cf-phone" className={labelClass}>Phone Number *</label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            required
            placeholder="+91 98427 22977"
            pattern="[0-9+\- ]{8,15}"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cf-event-type" className={labelClass}>Event Type *</label>
          <select id="cf-event-type" name="eventType" required className={inputClass}>
            {EVENT_TYPES.map((et) => (
              <option key={et.value} value={et.value} disabled={et.value === ""}>
                {et.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cf-event-date" className={labelClass}>Event Date</label>
          <input
            id="cf-event-date"
            name="eventDate"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="cf-guests" className={labelClass}>Expected Guest Count *</label>
        <input
          id="cf-guests"
          name="guests"
          type="number"
          required
          min={20}
          max={10000}
          placeholder="e.g. 200"
          className={inputClass}
        />
        <p className="text-xs text-[#707a6c] mt-1">We cater for 20 to 5,000+ guests.</p>
      </div>

      <div>
        <label htmlFor="cf-message" className={labelClass}>Any specific requirements?</label>
        <textarea
          id="cf-message"
          name="message"
          rows={4}
          placeholder="Tell us about your event — venue, cuisine preferences, special dietary needs, anything that helps us plan better."
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</p>
      )}

      {/* Cloudflare Turnstile — bot protection */}
      <TurnstileWidget
        onVerify={(token) => setTurnstileToken(token)}
        onExpire={() => setTurnstileToken(null)}
        onError={() => setTurnstileToken(null)}
      />

      <button
        type="submit"
        disabled={pending || !canSubmit}
        className="w-full flex items-center justify-center gap-2 bg-[#0d631b] text-white py-4 rounded-full font-bold text-sm tracking-wide hover:bg-[#1b4332] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
      >
        {pending ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Sending your enquiry…</>
        ) : (
          "Send Enquiry"
        )}
      </button>

      <p className="text-center text-xs text-[#707a6c]">
        We respect your privacy. Your details are only used to respond to your enquiry.
      </p>
    </form>
  );
}
