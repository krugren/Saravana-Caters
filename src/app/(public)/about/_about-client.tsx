"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, type Variants } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

/* ─── Animation helpers ─── */
const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

/* ─── Data ─── */
const TIMELINE = [
  {
    year: "2004",
    title: "A kitchen, a commitment",
    body: "Saravana Caters began with a single catering assignment in Erode — a neighbour's wedding, 80 guests, cooked from home. Word spread before the dishes were cleared.",
  },
  {
    year: "2008",
    title: "First dedicated kitchen",
    body: "Growing demand meant a proper professional kitchen. We moved out of the home and into a full preparation facility, while keeping the same recipes and the same hands.",
  },
  {
    year: "2012",
    title: "Corporate catering begins",
    body: "An invitation from a large textile firm in Erode opened the door to institutional feeding. Reliable, hygienic, on schedule — the same values that worked for weddings worked for boardrooms.",
  },
  {
    year: "2016",
    title: "500 events milestone",
    body: "Over 500 events catered. Our team had grown, our reach extended to Namakkal, Salem and Coimbatore, but the founding family remained at the helm of every plate.",
  },
  {
    year: "2020",
    title: "Adapting & continuing",
    body: "Through difficult years, we shifted focus to smaller, safer gatherings — house functions, smaller receptions, intimate celebrations. We never stopped cooking.",
  },
  {
    year: "2024",
    title: "1,000+ events & counting",
    body: "Two decades in. Over a thousand events, a lakh of guests served, and the same grandmother's sambar recipe still on the menu. Some things are worth keeping.",
  },
];

const VALUES = [
  {
    n: "01",
    title: "Freshness as a rule",
    body: "Produce from Erode market every morning. We don't believe in yesterday's vegetables feeding today's guests.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6" aria-hidden>
        <path d="M16 4C10 8 6 14 8 22c2 6 8 8 8 8s6-2 8-8c2-8-2-14-8-18z" stroke="#0d631b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="16" y1="6" x2="16" y2="28" stroke="#0d631b" strokeWidth="1" opacity="0.4" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "Never a late meal",
    body: "Every event is written out on paper before the first burner lights. Your guests eat on time — that is a promise, not a hope.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6" aria-hidden>
        <circle cx="16" cy="16" r="11" stroke="#0d631b" strokeWidth="1.5" />
        <path d="M16 9v7l4 3" stroke="#0d631b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "Recipes from memory",
    body: "Twenty years in — the core recipes haven't changed. The balance of spices, the consistency of the sambar, the texture of the rice. Because they don't need to change.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6" aria-hidden>
        <path d="M8 6h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="#0d631b" strokeWidth="1.5" />
        <path d="M11 12h10M11 16h10M11 20h6" stroke="#0d631b" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    n: "04",
    title: "Staff with dignity",
    body: "Our team is trained to serve with quiet courtesy. Your guests should feel looked after — and your family's name should feel honoured.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6" aria-hidden>
        <circle cx="16" cy="10" r="5" stroke="#0d631b" strokeWidth="1.5" />
        <path d="M8 26c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#0d631b" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

const STATS = [
  { value: "1,000+", label: "Events catered", sub: "Weddings, corporate & house functions" },
  { value: "20+",    label: "Years of service", sub: "Family-run since 2004" },
  { value: "1L+",    label: "Guests served", sub: "And still cooking" },
  { value: "50+",    label: "Menu varieties", sub: "Seasonal & traditional" },
];

/* ─── Section wrapper with scroll reveal ─── */
function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════ */
export default function AboutClient() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-[#fbf9f1]">

      {/* ── 1. HERO ──────────────────────────────── */}
      <section className="relative min-h-[62vh] flex items-end overflow-hidden bg-[#1b1c17]" ref={heroRef}>
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1400&q=80"
            alt="Traditional South Indian banana leaf meal spread at a wedding feast"
            fill
            unoptimized
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c17] via-[#1b1c17]/60 to-[#1b1c17]/20" />
        </div>

        {/* Hero text */}
        <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 pb-16 sm:pb-20 md:pb-24 pt-36 sm:pt-40 w-full">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-px bg-[#c8a951]" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[#c8a951]">
                Our story
              </span>
            </div>
            <h1
              className="font-display font-bold text-white leading-[1.05]"
              style={{ fontSize: "clamp(2.2rem, 5.5vw, 4rem)" }}
            >
              Started in a home kitchen.<br />
              <span className="italic text-[#c8a951]">Still cooking like one.</span>
            </h1>
            <p className="text-white/60 mt-4 text-[14px] sm:text-[15px] leading-relaxed max-w-lg">
              Two decades of South Indian catering, built on fresh produce, unchanged recipes,
              and a family that shows up — on time, every time.
            </p>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute right-6 bottom-8 sm:right-8 sm:bottom-10 flex flex-col items-center gap-2"
          >
            <span className="text-white/30 text-[9px] tracking-[0.2em] uppercase rotate-90 origin-center translate-x-3">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ── 2. ORIGIN STORY ──────────────────────── */}
      <section className="py-16 sm:py-20 md:py-24 overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

            {/* Image */}
            <Reveal>
              <motion.div variants={fadeIn} className="relative">
                <div className="absolute -left-3 -top-3 bottom-6 right-6 bg-[#1b4332]/6 rounded-2xl sm:rounded-3xl" />
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1567337710282-00832b415979?w=900&q=80"
                    alt="Traditional South Indian vada and idli on a banana leaf"
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-[#1b4332]/8" />
                </div>
                {/* Floating badge */}
                <motion.div
                  variants={{ hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1, transition: { delay: 0.35, duration: 0.5, ease: "backOut" } } }}
                  className="absolute -bottom-4 -right-3 sm:-right-6 bg-[#1b4332] text-white px-5 py-4 rounded-xl shadow-xl"
                >
                  <div className="font-display text-3xl font-bold text-[#c8a951] leading-none">2004</div>
                  <div className="text-[9px] font-bold tracking-widest uppercase text-white/50 mt-1">Year Founded</div>
                </motion.div>
                {/* Leaf SVG accent */}
                <svg viewBox="0 0 80 160" className="absolute -left-6 bottom-14 w-10 sm:w-12 text-[#0d631b] opacity-20 pointer-events-none" aria-hidden>
                  <path d="M40 4 C55 14 74 40 70 74 C66 105 54 130 40 155 C26 130 14 105 10 74 C6 40 25 14 40 4Z" fill="currentColor" />
                  <line x1="40" y1="6" x2="40" y2="152" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
                </svg>
              </motion.div>
            </Reveal>

            {/* Text */}
            <Reveal>
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
                <div className="w-5 h-px bg-[#c8a951]" />
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951]">The beginning</span>
              </motion.div>

              <motion.h2
                variants={fadeUp}
                className="font-display font-bold text-[#1b1c17] leading-[1.1] mb-5"
                style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)" }}
              >
                What began as cooking for neighbours{" "}
                <span className="text-[#0d631b] italic">became a calling.</span>
              </motion.h2>

              <motion.p variants={fadeUp} className="text-[#40493d] text-[14px] sm:text-[15px] leading-relaxed mb-4">
                Saravana Caters was founded in Erode in 2004 — not with a business plan, but with a
                request. A neighbour needed food for 80 guests at their child&apos;s wedding. The family
                cooked. The guests ate. And before the vessels were washed, two more bookings had come in.
              </motion.p>
              <motion.p variants={fadeUp} className="text-[#40493d]/80 text-[14px] sm:text-[15px] leading-relaxed mb-4">
                Twenty years later, the scale is different — 1,000+ events, a dedicated kitchen, a trained
                team — but the philosophy has never changed. Every function is treated like it was that first
                wedding. Every family deserves a meal that feels like it was made for them.
              </motion.p>
              <motion.p variants={fadeUp} className="text-[#40493d]/80 text-[14px] sm:text-[15px] leading-relaxed">
                We are still family-run. The founding recipes are still in use. And the person who takes your
                enquiry is still part of the family that will cook your food.
              </motion.p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 3. STATS BAR ────────────────────────── */}
      <section className="bg-[#0d631b] py-12 sm:py-14 overflow-hidden" aria-label="Key numbers">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}
                className="bg-[#0d631b] px-6 py-7 sm:py-8"
              >
                <div
                  className="font-display font-bold text-[#c8a951] leading-none mb-1"
                  style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}
                >
                  {s.value}
                </div>
                <div className="text-white font-semibold text-[12px] sm:text-[13px] mb-0.5">{s.label}</div>
                <div className="text-white/45 text-[11px] sm:text-[12px] leading-snug">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. TIMELINE ─────────────────────────── */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#fbf9f1]" aria-label="Our milestones">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">

          <Reveal className="mb-12 md:mb-14">
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-3">
              <div className="w-5 h-px bg-[#c8a951]" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951]">Two decades</span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-display font-bold text-[#1b1c17] leading-tight"
              style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)" }}
            >
              The road from one wedding{" "}
              <span className="italic text-[#0d631b]">to a thousand.</span>
            </motion.h2>
          </Reveal>

          {/* Timeline grid */}
          <div className="relative">
            {/* Vertical spine — hidden on mobile, shown on md+ */}
            <div className="hidden md:block absolute left-[calc(50%-0.5px)] top-0 bottom-0 w-px bg-[#e4e3db]" aria-hidden />

            <div className="space-y-0">
              {TIMELINE.map((item, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: isLeft ? -24 : 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className={`relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0 py-8 md:py-10 ${
                      isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Content card */}
                    <div className={`md:w-[calc(50%-2.5rem)] ${isLeft ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                      <span className="font-display font-bold text-[#c8a951] text-[12px] tracking-[0.15em] uppercase mb-1 block">
                        {item.year}
                      </span>
                      <h3 className="font-display font-bold text-[#1b1c17] text-[17px] sm:text-[18px] md:text-[19px] mb-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-[#40493d] text-[13px] sm:text-[14px] leading-relaxed">
                        {item.body}
                      </p>
                    </div>

                    {/* Year dot — centered on the spine */}
                    <div className="hidden md:flex absolute left-[calc(50%-1.25rem)] w-10 h-10 rounded-full bg-[#fbf9f1] border-2 border-[#1b4332] items-center justify-center shrink-0 z-10">
                      <div className="w-3 h-3 rounded-full bg-[#1b4332]" />
                    </div>

                    {/* Mobile dot */}
                    <div className="md:hidden flex items-center gap-3 order-first">
                      <div className="w-3 h-3 rounded-full bg-[#1b4332] shrink-0" />
                      <div className="h-px flex-1 bg-[#e4e3db]" />
                    </div>

                    {/* Spacer for opposite side */}
                    <div className="hidden md:block md:w-[calc(50%-2.5rem)]" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. VALUES ───────────────────────────── */}
      <section className="bg-[#1b4332] py-16 sm:py-20 md:py-24 overflow-hidden" aria-label="Our values">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">

          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-14">
            <div>
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-3">
                <div className="w-5 h-px bg-[#c8a951]" />
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951]">How we work</span>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="font-display font-bold text-white leading-tight"
                style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)" }}
              >
                Principles we&apos;ve never<br />
                <span className="italic text-[#c8a951]">had to rethink.</span>
              </motion.h2>
            </div>
            <motion.p variants={fadeUp} className="text-white/50 text-[13px] sm:text-[14px] leading-relaxed md:max-w-xs md:text-right">
              These aren&apos;t taglines. They are the operational decisions that kept families coming
              back for 20 years.
            </motion.p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/8 rounded-2xl overflow-hidden">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: EASE }}
                className="group bg-[#1b4332] hover:bg-[#22573f] transition-colors duration-300 p-6 sm:p-8 flex gap-5"
              >
                <div className="w-11 h-11 rounded-xl border border-[#c8a951]/25 flex items-center justify-center shrink-0 group-hover:border-[#c8a951]/50 transition-colors duration-300">
                  {v.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#c8a951] text-[10px] font-bold tracking-[0.15em]">{v.n}</span>
                    <h3 className="text-white font-bold text-[13px] sm:text-[14px] leading-snug">{v.title}</h3>
                  </div>
                  <p className="text-white/50 text-[13px] leading-relaxed">{v.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. PHOTO STRIP ──────────────────────── */}
      <section className="py-14 sm:py-16 overflow-hidden bg-[#f5f4ec]" aria-label="Gallery glimpse">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-8">
          <Reveal>
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-2">
              <div className="w-5 h-px bg-[#c8a951]" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951]">In the field</span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-display font-bold text-[#1b1c17]"
              style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
            >
              Events we&apos;ve had the honour of feeding.
            </motion.h2>
          </Reveal>
        </div>

        {/* 3-photo row */}
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              {
                src: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=700&q=80",
                alt: "Medu vada with sambar and chutneys",
                label: "House Functions",
              },
              {
                src: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=900&q=80",
                alt: "Traditional South Indian banana leaf thali spread",
                label: "Weddings",
              },
              {
                src: "https://images.unsplash.com/photo-1630914441924-56a15cde7f80?w=700&q=80",
                alt: "South Indian corporate catering buffet setup",
                label: "Corporate Events",
              },
            ].map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.65, ease: EASE }}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3]"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c17]/70 to-transparent" />
                <span className="absolute bottom-4 left-4 text-white font-bold text-[12px] tracking-[0.12em] uppercase">
                  {photo.label}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-[13px] font-bold text-[#0d631b] group"
            >
              <span className="border-b border-[#0d631b]/40 group-hover:border-[#0d631b] transition-colors pb-0.5">
                View full gallery
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. CTA ──────────────────────────────── */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#fbf9f1]" aria-label="Get in touch">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 text-center">
          <Reveal>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-4">
              <div className="w-5 h-px bg-[#c8a951]" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951]">
                Ready to begin?
              </span>
              <div className="w-5 h-px bg-[#c8a951]" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="font-display font-bold text-[#1b1c17] leading-[1.1] mb-4"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}
            >
              Let&apos;s make your event{" "}
              <span className="italic text-[#0d631b]">one people remember.</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="text-[#40493d] text-[14px] sm:text-[15px] leading-relaxed mb-8 max-w-md mx-auto">
              Tell us your date, guest count, and what you have in mind. We&apos;ll take it from there —
              no pressure, no obligation, no sales pitch.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#0d631b] text-white px-7 py-3.5 rounded-full font-bold text-[13px] tracking-wide hover:bg-[#1b4332] transition-colors duration-200 hover:scale-105 active:scale-95 transform"
              >
                Send an Enquiry
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+919842722977"
                className="inline-flex items-center gap-2 text-[#40493d] text-[13px] font-bold hover:text-[#0d631b] transition-colors"
              >
                <Phone className="w-4 h-4" />
                +91 98427 22977
              </a>
            </motion.div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
