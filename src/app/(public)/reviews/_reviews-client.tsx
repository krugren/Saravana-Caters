"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, type Variants } from "framer-motion";
import { ArrowRight, Star, Quote } from "lucide-react";
import ReviewForm from "./_review-form";

/* ─── Tokens ─── */
const EASE = [0.25, 0.46, 0.45, 0.94] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};
const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

/* ─── Review data ─── */
const REVIEWS = [
  {
    name: "Priya Ramamurthy",
    location: "Erode",
    event: "Wedding — 800 guests",
    rating: 5,
    text: "We booked Saravana Caters for our daughter's wedding and they exceeded every expectation. The banana leaf service was flawless, food was hot and plentiful, and not a single guest complained. More importantly, they worked without needing us to supervise anything. That peace of mind is worth everything.",
    featured: true,
  },
  {
    name: "Karthik Selvam",
    location: "Gobichettipalayam",
    event: "Corporate Lunch — 200 guests",
    rating: 5,
    text: "Punctual, professional, clean. Our MD was impressed by the setup. The sambar and rasam tasted like home cooking — not institutional food. Will book again for our annual day.",
  },
  {
    name: "Meenakshi Venkatesh",
    location: "Erode",
    event: "Sashtiabdapoorthi — 300 guests",
    rating: 5,
    text: "They cooked exactly what we asked for, added a few suggestions that made it better, and the team served with such warmth. My father-in-law said it was the best meal he'd had in years. That means everything to us.",
  },
  {
    name: "Suresh Arumugam",
    location: "Bhavani",
    event: "House warming — 150 guests",
    rating: 5,
    text: "For a smaller function I was worried about quality, but they gave us the same attention as a big wedding. Idli and vada were perfect, the sambar was outstanding. My guests kept asking who did the catering.",
  },
  {
    name: "Lakshmi Chandrasekaran",
    location: "Salem",
    event: "Naming Ceremony — 120 guests",
    rating: 5,
    text: "Found them through a reference and so glad we did. Booking was easy, they called twice to confirm details, arrived an hour early, set up beautifully. The Kesari and Payasam were exceptional. Truly professional.",
  },
  {
    name: "Anand Natarajan",
    location: "Erode",
    event: "Wedding Reception — 1,200 guests",
    rating: 5,
    text: "Managing food for over a thousand guests is no small feat. They handled it without a single delay in serving lines, food quality stayed consistent from first table to last, and cleanup was done before we even noticed. Remarkable operation.",
    featured: true,
  },
  {
    name: "Saranya Krishnamurthy",
    location: "Tiruppur",
    event: "Birthday celebration — 80 guests",
    rating: 5,
    text: "Even for a small birthday party they brought their full professionalism. The menu was customised exactly as we wanted — no onion, no garlic — and every dish was delicious. My guests were genuinely impressed.",
  },
  {
    name: "Rajesh Murugan",
    location: "Erode",
    event: "Temple Festival — 500 guests",
    rating: 5,
    text: "We needed strict satvik cooking for our temple function — no compromise on ingredients or preparation. They understood immediately and delivered perfection. Annadanam was clean, timely and respectful.",
  },
  {
    name: "Padma Subramaniam",
    location: "Namakkal",
    event: "Seemantham — 200 guests",
    rating: 5,
    text: "Very organised from start to finish. Written quotation before booking, clear communication, no hidden charges. Food was wonderful — the Pongal and Payasam were the highlight. Will recommend to everyone.",
  },
  {
    name: "Vijay Annamalai",
    location: "Erode",
    event: "Corporate Annual Day — 400 guests",
    rating: 5,
    text: "Biryani, starters, sweets — all were excellent. More importantly, they managed the serving flow well with no long queues. For a corporate crowd that appreciates efficiency, they delivered exactly that.",
  },
  {
    name: "Geetha Rajan",
    location: "Gobichettipalayam",
    event: "Wedding — 600 guests",
    rating: 5,
    text: "Referred by three different families, and now I understand why. The sambar alone is worth the booking. My husband's family from Chennai said they haven't had food this authentic in years.",
  },
  {
    name: "Mohan Sundaram",
    location: "Erode",
    event: "Ear Piercing Ceremony — 100 guests",
    rating: 5,
    text: "Quick to respond, easy to finalise the menu, no last-minute surprises on the bill. The team was courteous and the food was exactly as promised. Cannot ask for more.",
  },
];

const STATS = [
  { value: "1,000+", label: "Events completed" },
  { value: "4.9★",   label: "Average rating" },
  { value: "20+",    label: "Years trusted" },
  { value: "98%",    label: "Would re-book" },
];

/* ─── Helpers ─── */
function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-[#c8a951] text-[#c8a951]" />
      ))}
    </div>
  );
}

function ReviewCard({ r, index, featured = false }: { r: typeof REVIEWS[0]; index: number; featured?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = r.text.length > 220;
  const displayText = isLong && !expanded ? r.text.slice(0, 220) + "…" : r.text;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: (index % 3) * 0.1, duration: 0.65, ease: EASE }}
      className={`relative flex flex-col bg-white border rounded-2xl p-6 sm:p-7 ${
        featured
          ? "border-[#c8a951]/40 shadow-lg shadow-[#c8a951]/8"
          : "border-[#e4e3db]"
      }`}
    >
      {/* Quote mark */}
      <Quote
        className="absolute top-5 right-5 w-7 h-7 text-[#c8a951]/15"
        aria-hidden
      />

      {/* Stars */}
      <Stars n={r.rating} />

      {/* Review text */}
      <p className="text-[#40493d] text-[13px] sm:text-[14px] leading-relaxed mt-3 mb-4 flex-1">
        &ldquo;{displayText}&rdquo;
        {isLong && (
          <button
            onClick={() => setExpanded(p => !p)}
            className="ml-1 text-[#0d631b] font-semibold text-[12px] hover:underline"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </p>

      {/* Author */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#f0efe8]">
        <div>
          <p className="font-bold text-[#1b1c17] text-[13px] sm:text-[14px]">{r.name}</p>
          <p className="text-[#40493d]/60 text-[11px] sm:text-[12px]">{r.location}</p>
        </div>
        <span className="text-[10px] font-semibold tracking-wide text-[#c8a951] bg-[#c8a951]/10 px-2.5 py-1 rounded-full shrink-0 text-right leading-snug max-w-[130px]">
          {r.event}
        </span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════ */
export default function ReviewsClient() {
  return (
    <div className="bg-[#fbf9f1] min-h-screen">

      {/* ── 1. HERO ───────────────────────────────── */}
      <div className="bg-[#1b4332] pt-28 sm:pt-32 pb-14 sm:pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 flex items-center justify-center opacity-[0.04] select-none pointer-events-none"
          aria-hidden
        >
          <span
            className="font-display font-bold text-white uppercase tracking-widest whitespace-nowrap"
            style={{ fontSize: "clamp(40px, 12vw, 160px)" }}
          >
            REVIEWS
          </span>
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-px bg-[#c8a951]" />
              <span className="font-tamil text-[#c8a951] text-[12px]">வாடிக்கையாளர் கருத்துக்கள்</span>
            </div>
            <h1
              className="font-display font-bold text-white leading-[1.05] mb-4"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Words from the families{" "}
              <span className="italic text-[#c8a951]">we&apos;ve fed.</span>
            </h1>
            <p className="text-white/60 text-[14px] sm:text-[15px] leading-relaxed max-w-xl">
              Twenty years of events. Every review here is from a real family, a real occasion,
              a real meal cooked on the day. We let their words speak for us.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── 2. STATS BAND ─────────────────────────── */}
      <div className="bg-[#f5f4ec] border-b border-[#e4e3db]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#e4e3db]">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: EASE }}
                className="px-5 sm:px-7 py-5 sm:py-6"
              >
                <div
                  className="font-display font-bold text-[#1b4332] leading-none mb-1"
                  style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
                >
                  {s.value}
                </div>
                <div className="text-[#40493d]/70 text-[11px] sm:text-[12px] font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. FEATURED REVIEWS ───────────────────── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6" aria-label="Featured reviews">
        <div className="max-w-[1240px] mx-auto">
          <Reveal className="mb-8">
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-1">
              <div className="w-5 h-px bg-[#c8a951]" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951]">
                Highlighted
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-display font-bold text-[#1b1c17]"
              style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
            >
              Stories worth reading.
            </motion.h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-6">
            {REVIEWS.filter(r => r.featured).map((r, i) => (
              <ReviewCard key={r.name} r={r} index={i} featured />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. ALL REVIEWS GRID ───────────────────── */}
      <section className="pb-16 sm:pb-20 px-4 sm:px-6 bg-[#fbf9f1]" aria-label="All reviews">
        <div className="max-w-[1240px] mx-auto">
          <Reveal className="mb-8">
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-1">
              <div className="w-5 h-px bg-[#c8a951]" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951]">
                All reviews
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-display font-bold text-[#1b1c17]"
              style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
            >
              Families across Erode district.
            </motion.h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {REVIEWS.filter(r => !r.featured).map((r, i) => (
              <ReviewCard key={r.name} r={r} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. TRUST STATEMENT ────────────────────── */}
      <section className="bg-[#1b4332] py-14 sm:py-18 px-4 sm:px-6" aria-label="Our trust promise">
        <div className="max-w-[1240px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <Reveal>
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-3">
                <div className="w-5 h-px bg-[#c8a951]" />
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951]">
                  Why they return
                </span>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="font-display font-bold text-white leading-tight mb-5"
                style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)" }}
              >
                Most of our bookings come{" "}
                <span className="italic text-[#c8a951]">from families who&apos;ve booked before.</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-white/60 text-[14px] sm:text-[15px] leading-relaxed mb-6">
                Repeat bookings are not a marketing metric for us — they are the proof that what we
                cook is worth coming back for. Same family, different milestone, same trust.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#c8a951] text-[#1b1c17] px-7 py-3.5 rounded-full font-bold text-[13px] hover:bg-[#d4b55e] transition-colors hover:scale-105 active:scale-95 transform"
                >
                  Book Your Event
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </Reveal>

            {/* Quote highlight */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="relative"
            >
              <div className="bg-white/5 border border-white/10 rounded-2xl p-7 sm:p-9">
                <Quote className="w-10 h-10 text-[#c8a951]/25 mb-4" aria-hidden />
                <p className="font-display italic text-white/85 text-[17px] sm:text-[19px] md:text-[21px] leading-relaxed mb-6">
                  &ldquo;Saravana Caters has cooked for three generations of my family —
                  my wedding, my son&rsquo;s naming ceremony, and my daughter&rsquo;s engagement.
                  The sambar hasn&rsquo;t changed. That&rsquo;s why we keep coming back.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#c8a951]/20 flex items-center justify-center">
                    <span className="font-display font-bold text-[#c8a951] text-[14px]">R</span>
                  </div>
                  <div>
                    <p className="font-bold text-white text-[13px]">Radhakrishnan Iyer</p>
                    <p className="text-white/45 text-[11px]">Erode — 3 events over 18 years</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 6. REVIEW FORM ─────────────────────────── */}
      <ReviewForm />

    </div>
  );
}
