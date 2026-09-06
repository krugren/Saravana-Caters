"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, CheckCircle2, AlertCircle, Pencil, Trash2, X, RefreshCcw } from "lucide-react";
import { submitPublicReview } from "@/features/testimonials/submit-review";

/* ─── Constants ─────────────────────────────────────────────────────────────── */

const EASE = [0.25, 0.46, 0.45, 0.94] as const;
const LS_KEY = "sc_review";  // localStorage key

const EVENT_TYPES = [
  "Wedding",
  "Wedding Reception",
  "House Warming",
  "Birthday Celebration",
  "Naming Ceremony",
  "Ear Piercing Ceremony",
  "Sashtiabdapoorthi",
  "Seemantham",
  "Temple Festival / Annadanam",
  "Corporate Lunch / Dinner",
  "Corporate Annual Day",
  "Other",
];

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent!"];

/* ─── Types ──────────────────────────────────────────────────────────────────── */

interface StoredReview {
  reviewId: string;
  editToken: string;
  name: string;
  /** ISO string */
  submittedAt: string;
}

type FormState =
  | "form"             // initial / after clearing
  | "submitting"
  | "success"          // just submitted — showing controls
  | "editing"          // edit form open (pre-filled from API)
  | "saving"           // PATCH in progress
  | "confirm-delete"   // delete dialog
  | "deleting"
  | "deleted";

/* ─── Star Rating ────────────────────────────────────────────────────────────── */

function StarRating({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1.5" role="radiogroup" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= (hovered || value);
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(n)}
            className="group transition-transform hover:scale-110 active:scale-95"
          >
            <Star
              className={`w-8 h-8 transition-colors duration-150 ${
                filled
                  ? "fill-[#c8a951] text-[#c8a951]"
                  : "fill-transparent text-[#d4cdb8] group-hover:text-[#c8a951]"
              }`}
            />
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-2 self-center text-[13px] font-semibold text-[#0d631b]">
          {RATING_LABELS[value]}
        </span>
      )}
    </div>
  );
}

/* ─── Shared field styles ────────────────────────────────────────────────────── */

const INPUT_CLS =
  "w-full px-4 py-3 rounded-xl border border-[#e4e3db] bg-[#fbf9f1] text-[14px] text-[#1b1c17] placeholder:text-[#40493d]/40 focus:outline-none focus:border-[#0d631b] focus:ring-2 focus:ring-[#0d631b]/10 transition-all";

/* ─── Review Form Fields ─────────────────────────────────────────────────────── */

interface FormFields {
  name: string;
  location: string;
  eventType: string;
  rating: number;
  review: string;
}

function blank(): FormFields {
  return { name: "", location: "", eventType: "", rating: 0, review: "" };
}

function ReviewFields({
  fields,
  onChange,
  idPrefix = "rf",
}: {
  fields: FormFields;
  onChange: (f: FormFields) => void;
  idPrefix?: string;
}) {
  const set = (k: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    onChange({ ...fields, [k]: e.target.value });

  return (
    <div className="space-y-5">
      {/* Row 1: Name + Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor={`${idPrefix}-name`} className="block text-[12px] font-bold text-[#1b1c17] tracking-wide uppercase">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            id={`${idPrefix}-name`}
            type="text"
            required
            minLength={2}
            maxLength={80}
            value={fields.name}
            onChange={set("name")}
            placeholder="e.g. Priya Ramamurthy"
            className={INPUT_CLS}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor={`${idPrefix}-loc`} className="block text-[12px] font-bold text-[#1b1c17] tracking-wide uppercase">
            Town / City
          </label>
          <input
            id={`${idPrefix}-loc`}
            type="text"
            maxLength={60}
            value={fields.location}
            onChange={set("location")}
            placeholder="e.g. Erode, Salem, Tiruppur…"
            className={INPUT_CLS}
          />
        </div>
      </div>

      {/* Row 2: Event type */}
      <div className="space-y-1.5">
        <label htmlFor={`${idPrefix}-event`} className="block text-[12px] font-bold text-[#1b1c17] tracking-wide uppercase">
          Type of Event
        </label>
        <select
          id={`${idPrefix}-event`}
          value={fields.eventType}
          onChange={set("eventType")}
          className={`${INPUT_CLS} appearance-none cursor-pointer`}
        >
          <option value="">Select event type…</option>
          {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Row 3: Star rating */}
      <div className="space-y-2">
        <p className="text-[12px] font-bold text-[#1b1c17] tracking-wide uppercase">
          Your Rating <span className="text-red-500">*</span>
        </p>
        <StarRating value={fields.rating} onChange={(n) => onChange({ ...fields, rating: n })} />
      </div>

      {/* Row 4: Review text */}
      <div className="space-y-1.5">
        <label htmlFor={`${idPrefix}-text`} className="block text-[12px] font-bold text-[#1b1c17] tracking-wide uppercase">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          id={`${idPrefix}-text`}
          required
          minLength={20}
          maxLength={2000}
          rows={5}
          value={fields.review}
          onChange={set("review")}
          placeholder="Tell us about the food, service, and your experience on the day…"
          className={`${INPUT_CLS} resize-none leading-relaxed`}
        />
        <p className="text-[11px] text-[#40493d]/50 text-right">{fields.review.length} / 2000</p>
      </div>
    </div>
  );
}

/* ─── Error Banner ───────────────────────────────────────────────────────────── */

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-[13px]"
    >
      <AlertCircle className="w-4 h-4 shrink-0" />
      {msg}
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */

export default function ReviewForm() {
  const [formState, setFormState] = useState<FormState>("form");
  const [fields, setFields]       = useState<FormFields>(blank());
  const [editFields, setEditFields] = useState<FormFields>(blank());
  const [error, setError]         = useState("");
  const [stored, setStored]       = useState<StoredReview | null>(null);
  const [loadingStored, setLoadingStored] = useState(true);
  const [isPending, startTransition] = useTransition();

  /* ── Load stored review from localStorage on mount ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const data: StoredReview = JSON.parse(raw);
        if (data?.reviewId && data?.editToken) setStored(data);
      }
    } catch { /* corrupt entry — ignore */ }
    setLoadingStored(false);
  }, []);

  /* ── Save / clear stored review ── */
  const saveStored = useCallback((r: StoredReview) => {
    localStorage.setItem(LS_KEY, JSON.stringify(r));
    setStored(r);
  }, []);

  const clearStored = useCallback(() => {
    localStorage.removeItem(LS_KEY);
    setStored(null);
  }, []);

  /* ── Submit new review ── */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!fields.rating) { setError("Please select a star rating."); return; }

    startTransition(async () => {
      const result = await submitPublicReview({
        name:      fields.name,
        location:  fields.location,
        eventType: fields.eventType || "Other",
        rating:    fields.rating,
        review:    fields.review,
        honeypot:  (e.currentTarget as HTMLFormElement).elements.namedItem("hp")
                     ? ((e.currentTarget as HTMLFormElement).elements.namedItem("hp") as HTMLInputElement).value
                     : undefined,
      });

      if (result.success) {
        const s: StoredReview = {
          reviewId: result.reviewId,
          editToken: result.editToken,
          name: fields.name,
          submittedAt: new Date().toISOString(),
        };
        saveStored(s);
        setFormState("success");
      } else {
        setError(result.error);
      }
    });
  }

  /* ── Open edit form ── */
  async function handleEditOpen() {
    if (!stored) return;
    setError("");
    setFormState("editing");
    setEditFields(blank()); // will be pre-filled below

    try {
      const res = await fetch(
        `/api/public/review?id=${encodeURIComponent(stored.reviewId)}&token=${encodeURIComponent(stored.editToken)}`
      );
      if (!res.ok) {
        if (res.status === 404) { clearStored(); setFormState("form"); return; }
        throw new Error(await res.text());
      }
      const data = await res.json();
      // Parse detail back into eventType / location
      const parts = (data.detail as string).split(" · ");
      setEditFields({
        name:      data.name ?? "",
        location:  parts.length > 1 ? parts[1] : "",
        eventType: parts[0] ?? "",
        rating:    0,  // rating not stored in DB; user must re-select
        review:    data.quote ?? "",
      });
    } catch {
      setError("Could not load your review. Please try again.");
      setFormState("success");
    }
  }

  /* ── Save edits ── */
  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!stored) return;
    setError("");
    if (!editFields.rating) { setError("Please select a star rating."); return; }

    startTransition(async () => {
      setFormState("saving");
      try {
        const res = await fetch("/api/public/review", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id:        stored.reviewId,
            token:     stored.editToken,
            name:      editFields.name,
            location:  editFields.location,
            eventType: editFields.eventType || "Other",
            rating:    editFields.rating,
            review:    editFields.review,
            hp:        "",
          }),
        });
        const json = await res.json();
        if (!res.ok) { setError(json.error ?? "Save failed."); setFormState("editing"); return; }
        saveStored({ ...stored, name: editFields.name });
        setFormState("success");
      } catch {
        setError("Network error. Please try again.");
        setFormState("editing");
      }
    });
  }

  /* ── Delete ── */
  function handleDelete() {
    if (!stored) return;
    setError("");

    startTransition(async () => {
      setFormState("deleting");
      try {
        const res = await fetch("/api/public/review", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: stored.reviewId, token: stored.editToken }),
        });
        const json = await res.json();
        if (!res.ok) { setError(json.error ?? "Delete failed."); setFormState("confirm-delete"); return; }
        clearStored();
        setFormState("deleted");
      } catch {
        setError("Network error. Please try again.");
        setFormState("confirm-delete");
      }
    });
  }

  /* ── Render ── */
  return (
    <section
      id="leave-review"
      className="py-14 sm:py-20 px-4 sm:px-6 bg-[#f5f4ec] border-t border-[#e4e3db]"
      aria-label="Leave a review"
    >
      <div className="max-w-[720px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: EASE }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-5 h-px bg-[#c8a951]" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951]">
              Share your experience
            </span>
          </div>
          <h2
            className="font-display font-bold text-[#1b1c17] leading-tight mb-3"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.3rem)" }}
          >
            Did we cook for your event?{" "}
            <span className="italic text-[#0d631b]">Tell us how it went.</span>
          </h2>
          <p className="text-[#40493d] text-[14px] sm:text-[15px] leading-relaxed max-w-lg">
            Your review helps the next family make a confident choice. We read every submission and publish genuine ones after a quick check.
          </p>
        </motion.div>

        {/* ── Already-submitted banner (return visits) ── */}
        {!loadingStored && stored && formState === "form" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-[#0d631b]/8 border border-[#0d631b]/20 rounded-2xl px-5 py-4"
          >
            <CheckCircle2 className="w-5 h-5 text-[#0d631b] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[#1b1c17]">You have a pending review on this device</p>
              <p className="text-[12px] text-[#40493d]">Submitted by <strong>{stored.name}</strong> — visible after admin approval.</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={handleEditOpen}
                className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#0d631b] hover:text-[#1b4332] transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <span className="text-[#d4cdb8]">·</span>
              <button
                onClick={() => setFormState("confirm-delete")}
                className="inline-flex items-center gap-1.5 text-[12px] font-bold text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </motion.div>
        )}

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="bg-white rounded-2xl border border-[#e4e3db] shadow-sm overflow-hidden"
        >
          <AnimatePresence mode="wait">

            {/* ─── NEW REVIEW FORM ─────────────────────────── */}
            {formState === "form" && (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="p-6 sm:p-8 space-y-6"
              >
                {/* Honeypot — must stay empty; hidden from real users */}
                <div
                  aria-hidden="true"
                  style={{ position: "absolute", opacity: 0, height: 0, overflow: "hidden", pointerEvents: "none" }}
                  tabIndex={-1}
                >
                  <input name="hp" type="text" autoComplete="off" tabIndex={-1} />
                </div>

                <ReviewFields fields={fields} onChange={setFields} idPrefix="nf" />

                <AnimatePresence>{error && <ErrorBanner msg={error} />}</AnimatePresence>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#0d631b] text-white px-8 py-3.5 rounded-full font-bold text-[14px] hover:bg-[#1b4332] disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                >
                  {isPending ? (
                    <><Spinner /> Submitting…</>
                  ) : (
                    <><Send className="w-4 h-4" /> Submit My Review</>
                  )}
                </button>

                <p className="text-[11px] text-[#40493d]/50 leading-relaxed">
                  Reviews are published after a brief moderation check. We never edit your words.
                </p>
              </motion.form>
            )}

            {/* ─── SUCCESS STATE ────────────────────────────── */}
            {(formState === "success" || formState === "confirm-delete") && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="p-6 sm:p-8"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#0d631b]/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-[#0d631b]" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-[#1b1c17] text-lg mb-1">
                      Thank you, {stored?.name?.split(" ")[0] ?? ""}!
                    </h3>
                    <p className="text-[#40493d] text-[13px] leading-relaxed">
                      Your review is now live on the website. You can edit or delete it below
                      as long as you haven&apos;t cleared your browser data.
                    </p>
                  </div>
                </div>

                {/* Edit / Delete actions */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <button
                    onClick={handleEditOpen}
                    className="inline-flex items-center gap-2 border border-[#0d631b] text-[#0d631b] hover:bg-[#0d631b] hover:text-white px-5 py-2.5 rounded-full font-bold text-[13px] transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit My Review
                  </button>
                  <button
                    onClick={() => { setError(""); setFormState("confirm-delete"); }}
                    className="inline-flex items-center gap-2 border border-red-200 text-red-500 hover:bg-red-500 hover:text-white px-5 py-2.5 rounded-full font-bold text-[13px] transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>

                {/* Delete confirmation dialog */}
                <AnimatePresence>
                  {formState === "confirm-delete" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-red-50 border border-red-100 rounded-xl p-4 mt-2">
                        <p className="text-[13px] font-semibold text-red-700 mb-3">
                          Are you sure you want to permanently delete your review?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={handleDelete}
                            disabled={isPending}
                            className="inline-flex items-center gap-1.5 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-[12px] hover:bg-red-600 disabled:opacity-60 transition-all"
                          >
                            {isPending ? <Spinner /> : <Trash2 className="w-3 h-3" />}
                            Yes, Delete
                          </button>
                          <button
                            onClick={() => setFormState("success")}
                            className="inline-flex items-center gap-1.5 border border-[#e4e3db] px-4 py-2 rounded-full font-bold text-[12px] text-[#40493d] hover:bg-[#f5f4ec] transition-all"
                          >
                            <X className="w-3 h-3" /> Cancel
                          </button>
                        </div>
                        <AnimatePresence>{error && <div className="mt-2"><ErrorBanner msg={error} /></div>}</AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ─── EDIT FORM ────────────────────────────────── */}
            {(formState === "editing" || formState === "saving") && (
              <motion.form
                key="editing"
                onSubmit={handleSaveEdit}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="p-6 sm:p-8 space-y-6"
              >
                {/* Edit header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#e4e3db]">
                  <div className="flex items-center gap-2">
                    <Pencil className="w-4 h-4 text-[#0d631b]" />
                    <span className="font-bold text-[#1b1c17] text-[15px]">Edit Your Review</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setError(""); setFormState("success"); }}
                    className="text-[#40493d]/60 hover:text-[#1b1c17] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {editFields.name ? (
                  <>
                    <ReviewFields fields={editFields} onChange={setEditFields} idPrefix="ef" />
                    <AnimatePresence>{error && <ErrorBanner msg={error} />}</AnimatePresence>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={formState === "saving"}
                        className="inline-flex items-center gap-2 bg-[#0d631b] text-white px-6 py-3 rounded-full font-bold text-[13px] hover:bg-[#1b4332] disabled:opacity-60 transition-all hover:scale-105 active:scale-95"
                      >
                        {formState === "saving" ? <><Spinner /> Saving…</> : <><CheckCircle2 className="w-4 h-4" /> Save Changes</>}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setError(""); setFormState("success"); }}
                        className="inline-flex items-center gap-2 border border-[#e4e3db] px-6 py-3 rounded-full font-bold text-[13px] text-[#40493d] hover:bg-[#f5f4ec] transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                    <p className="text-[11px] text-[#40493d]/50">
                      Editing will reset your review to pending — it will need to be re-approved.
                    </p>
                  </>
                ) : (
                  <div className="flex items-center gap-3 py-6 text-[#40493d]/60 text-[13px]">
                    <Spinner /> Loading your review…
                  </div>
                )}
              </motion.form>
            )}

            {/* ─── DELETED STATE ────────────────────────────── */}
            {formState === "deleted" && (
              <motion.div
                key="deleted"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex flex-col items-center justify-center text-center px-8 py-14"
              >
                <div className="w-14 h-14 rounded-full bg-[#f5f4ec] flex items-center justify-center mb-4">
                  <Trash2 className="w-7 h-7 text-[#40493d]/40" />
                </div>
                <h3 className="font-display font-bold text-[#1b1c17] text-lg mb-2">Review Deleted</h3>
                <p className="text-[#40493d] text-[13px] mb-6 max-w-xs">
                  Your review has been permanently removed. We&apos;d still love to hear from you.
                </p>
                <button
                  onClick={() => { setFields(blank()); setFormState("form"); }}
                  className="inline-flex items-center gap-2 border border-[#0d631b] text-[#0d631b] hover:bg-[#0d631b] hover:text-white px-5 py-2.5 rounded-full font-bold text-[13px] transition-all"
                >
                  <RefreshCcw className="w-3.5 h-3.5" /> Write a New Review
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Inline spinner ─────────────────────────────────────────────────────────── */

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
    </svg>
  );
}
