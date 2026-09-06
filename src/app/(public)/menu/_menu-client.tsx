"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { ArrowRight, Phone, ChevronDown } from "lucide-react";

/* ─── Tokens ─── */
const EASE = [0.25, 0.46, 0.45, 0.94] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};
const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

/* ─── Category icons (inline SVG) ─── */
const ICON_BREAKFAST = (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
    <circle cx="12" cy="12" r="4" stroke="#c8a951" strokeWidth="1.5"/>
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const ICON_RICE = (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
    <path d="M12 3c0 0-6 3-6 9s6 9 6 9 6-3 6-9-6-9-6-9z" stroke="#c8a951" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M12 3v18" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6.5 8.5c1.5 1 3.5 1.5 5.5 1.5s4-.5 5.5-1.5" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6.5 15.5c1.5-1 3.5-1.5 5.5-1.5s4 .5 5.5 1.5" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const ICON_CURRY = (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
    <path d="M4 10h16v2a8 8 0 01-16 0v-2z" stroke="#c8a951" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M8 10V7a4 4 0 018 0v3" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 20h6M12 20v2" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 6c0-1 .5-2 1.5-2.5" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const ICON_STARTERS = (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
    <circle cx="12" cy="13" r="7" stroke="#c8a951" strokeWidth="1.5"/>
    <path d="M5 13h14" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 6V3M9 4l3-1 3 1" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ICON_SWEETS = (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
    <path d="M12 21c4.418 0 8-1.79 8-4s-3.582-4-8-4-8 1.79-8 4 3.582 4 8 4z" stroke="#c8a951" strokeWidth="1.5"/>
    <path d="M4 17v-4c0-2.21 3.582-4 8-4s8 1.79 8 4v4" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 9V7a4 4 0 018 0v2" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const ICON_BEVERAGES = (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
    <path d="M8 2h8l1 7H7L8 2z" stroke="#c8a951" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M7 9c0 5 1 9 5 9s5-4 5-9" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16 12h3a1 1 0 011 1v2a3 3 0 01-3 3h-1" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 20h4" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/* ─── Category display metadata (presentation config — icons, labels, notes) ─── */
type CategoryMeta = {
  id: string;
  label: string;
  tamil: string;
  icon: React.ReactNode;
  note: string;
};

const CATEGORY_META: CategoryMeta[] = [
  { id: "BREAKFAST", label: "Breakfast & Tiffin",   tamil: "காலை உணவு",          icon: ICON_BREAKFAST, note: "Served at morning functions, wedding breakfasts and Pongal events." },
  { id: "RICE",      label: "Rice & Biryanis",     tamil: "சாதம் & பிரியாணி",   icon: ICON_RICE,      note: "The centrepiece of any South Indian feast. Served with full accompaniments." },
  { id: "GRAVIES",  label: "Curries & Gravies",   tamil: "குழம்பு & கறி",      icon: ICON_CURRY,     note: "Rich South Indian gravies that define our table. All cooked fresh on-site." },
  { id: "STARTERS", label: "Starters & Snacks",   tamil: "ஸ்னாக்ஸ்",           icon: ICON_STARTERS,  note: "Served during welcome, cocktail hours, or as evening light bites." },
  { id: "SWEETS",   label: "Sweets & Desserts",  tamil: "இனிப்புகள்",          icon: ICON_SWEETS,    note: "No South Indian feast is complete without a generous pour of sweet." },
  { id: "BEVERAGES",label: "Beverages",            tamil: "பானங்கள்",            icon: ICON_BEVERAGES, note: "Fresh and traditional. Served across all event types." },
];

/* ─── Note about customisation ─── */
const NOTES = [
  "All menus are customised per event — add, remove or swap any item",
  "Vegetarian, Jain and satvik (no onion/garlic) versions available",
  "Quantities and serving style adapted to your guest count and event type",
  "Pricing is per-plate and varies by menu complexity and location",
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

type LiveCategory = CategoryMeta & { items: { name: string; desc: string }[] };

function CategorySection({ cat, index }: { cat: LiveCategory; index: number }) {
  const [expanded, setExpanded] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      id={cat.id}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: EASE, delay: index * 0.06 }}
      className="border border-[#e4e3db] rounded-2xl overflow-hidden scroll-mt-24 bg-white/60"
    >
      {/* Category header — clickable to collapse */}
      <button
        onClick={() => setExpanded(p => !p)}
        className="w-full flex items-center gap-4 px-5 sm:px-7 py-5 text-left group hover:bg-[#f5f4ec] transition-colors duration-200"
        aria-expanded={expanded}
      >
        <div className="w-9 h-9 rounded-lg border border-[#c8a951]/25 flex items-center justify-center shrink-0 bg-[#f5f4ec] group-hover:border-[#c8a951]/50 transition-colors duration-200">
          {cat.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="font-display font-bold text-[#1b1c17] text-[16px] sm:text-[18px] leading-tight">
              {cat.label}
            </h2>
            <span className="font-tamil text-[#c8a951] text-[11px] hidden sm:inline">{cat.tamil}</span>
          </div>
          <p className="text-[#40493d]/70 text-[12px] sm:text-[13px] leading-snug">{cat.note}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-[#40493d]/50 font-medium hidden sm:inline">
            {cat.items.length} items
          </span>
          <ChevronDown
            className={`w-4 h-4 text-[#c8a951] transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Items grid */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e4e3db] border-t border-[#e4e3db]">
              {cat.items.map((item, i) => (
                <div
                  key={item.name}
                  className="bg-[#fbf9f1] px-5 sm:px-6 py-4 sm:py-5 flex gap-3 group hover:bg-[#f5f4ec] transition-colors duration-150"
                >
                  <div className="w-1 shrink-0 rounded-full bg-[#c8a951]/30 group-hover:bg-[#c8a951] transition-colors duration-200 self-stretch" />
                  <div>
                    <p className="font-semibold text-[#1b1c17] text-[13px] sm:text-[14px] leading-snug mb-0.5">
                      {item.name}
                    </p>
                    <p className="text-[#40493d]/70 text-[12px] sm:text-[12.5px] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════ */
export default function MenuClient({
  groupedDishes,
}: {
  groupedDishes: Record<string, { name: string; desc: string }[]>;
}) {
  // Merge metadata with live DB items; skip categories with 0 dishes
  const CATEGORIES: LiveCategory[] = CATEGORY_META
    .map((meta) => ({ ...meta, items: groupedDishes[meta.id] ?? [] }))
    .filter((cat) => cat.items.length > 0);

  const [activeTab, setActiveTab] = useState<string | null>(null);

  return (
    <div className="bg-[#fbf9f1] min-h-screen">

      {/* ── 1. HERO ───────────────────────────────── */}
      <div className="bg-[#1b4332] pt-28 sm:pt-32 pb-14 sm:pb-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Background text watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-[0.04] select-none pointer-events-none"
          aria-hidden
        >
          <span
            className="font-display font-bold text-white uppercase tracking-widest whitespace-nowrap"
            style={{ fontSize: "clamp(60px, 16vw, 200px)" }}
          >
            MENU
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
              <span className="font-tamil text-[#c8a951] text-[12px]">எங்கள் உணவு வகைகள்</span>
            </div>
            <h1
              className="font-display font-bold text-white leading-[1.05] mb-4"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Food that feels like{" "}
              <span className="italic text-[#c8a951]">home.</span>
            </h1>
            <p className="text-white/60 text-[14px] sm:text-[15px] leading-relaxed max-w-xl mb-8">
              This is a representative menu — every event gets a customised list based on your
              function type, guest preferences, and budget. Everything is cooked fresh, on the day.
            </p>

            {/* Category jump pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-white/60 border border-white/15 px-3.5 py-2 rounded-full hover:border-[#c8a951] hover:text-[#c8a951] transition-colors duration-200"
                >
                  <span className="flex items-center justify-center w-4 h-4">{cat.icon}</span>
                  {cat.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── 2. MENU SECTIONS ──────────────────────── */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-4 sm:space-y-5">
        {CATEGORIES.map((cat, i) => (
          <CategorySection key={cat.id} cat={cat} index={i} />
        ))}
      </div>

      {/* ── 3. CUSTOMISATION NOTE ─────────────────── */}
      <section className="bg-[#1b4332] py-12 sm:py-16 px-4 sm:px-6" aria-label="Menu notes">
        <div className="max-w-[1240px] mx-auto">
          <Reveal>
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
              <div className="w-5 h-px bg-[#c8a951]" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951]">
                Good to know
              </span>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {NOTES.map((note, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex items-start gap-3 bg-white/5 rounded-xl px-5 py-4"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c8a951] mt-2 shrink-0" />
                  <p className="text-white/75 text-[13px] sm:text-[14px] leading-relaxed">{note}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 4. SAMPLE MEAL PLANS ──────────────────── */}
      <section className="py-14 sm:py-18 px-4 sm:px-6 bg-[#f5f4ec]" aria-label="Sample meal plans">
        <div className="max-w-[1240px] mx-auto">
          <Reveal className="mb-10">
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-3">
              <div className="w-5 h-px bg-[#c8a951]" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951]">
                Sample spreads
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-display font-bold text-[#1b1c17] leading-tight"
              style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
            >
              What a full event spread{" "}
              <span className="italic text-[#0d631b]">looks like.</span>
            </motion.h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                event: "Wedding Feast",
                tamil: "திருமண விழா",
                courses: [
                  "Banana leaf with banana & papad",
                  "Sambar · Rasam · Mor Kuzhambu",
                  "3 Poriyals · Kootu · Aviyal",
                  "Rice (unlimited) · Appalam",
                  "Poli · Payasam · Kesari",
                  "Curd Rice · Pickle",
                  "Filter Coffee / Buttermilk",
                ],
              },
              {
                event: "Corporate Buffet",
                tamil: "நிறுவன நிகழ்வு",
                courses: [
                  "Poori / Chapati · Kurma",
                  "Veg Biryani · Raita",
                  "2 Gravies · Poriyal",
                  "Sambar · Rasam",
                  "Rice (steamed)",
                  "Kesari / Halwa",
                  "Juice · Buttermilk",
                ],
              },
              {
                event: "House Function",
                tamil: "வீட்டு நிகழ்வு",
                courses: [
                  "Idli · Vada · Pongal",
                  "Coconut Chutney · Sambar",
                  "Rice · Sambar · Rasam",
                  "2 Poriyals · Kootu",
                  "Payasam",
                  "Curd Rice",
                  "Filter Coffee",
                ],
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.event}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: EASE }}
                className="bg-white border border-[#e4e3db] rounded-2xl overflow-hidden"
              >
                <div className="bg-[#1b4332] px-5 py-4">
                  <p className="font-tamil text-[#c8a951] text-[11px] mb-0.5">{plan.tamil}</p>
                  <h3 className="font-display font-bold text-white text-[15px] sm:text-[16px]">{plan.event}</h3>
                </div>
                <ul className="divide-y divide-[#f0efe8]">
                  {plan.courses.map((course, j) => (
                    <li key={j} className="flex items-center gap-2.5 px-5 py-3 text-[13px] text-[#40493d]">
                      <span className="w-1 h-1 rounded-full bg-[#c8a951] shrink-0" />
                      {course}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CTA ────────────────────────────────── */}
      <section className="py-14 sm:py-18 px-4 sm:px-6 bg-[#fbf9f1]" aria-label="Get a custom menu">
        <div className="max-w-[680px] mx-auto text-center">
          <Reveal>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-4">
              <div className="w-5 h-px bg-[#c8a951]" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951]">
                Your custom menu
              </span>
              <div className="w-5 h-px bg-[#c8a951]" />
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-display font-bold text-[#1b1c17] leading-[1.1] mb-4"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
            >
              Tell us what you need.{" "}
              <span className="italic text-[#0d631b]">We&apos;ll build the rest.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#40493d] text-[14px] sm:text-[15px] leading-relaxed mb-7 max-w-md mx-auto">
              Share your event type, guest count, and any preferences. We&apos;ll put together a
              menu and a per-plate quotation — no commitment required.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#0d631b] text-white px-7 py-3.5 rounded-full font-bold text-[13px] hover:bg-[#1b4332] transition-colors hover:scale-105 active:scale-95 transform"
              >
                Request a Custom Menu
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+919842722977"
                className="inline-flex items-center gap-2 text-[#40493d] font-bold text-[13px] hover:text-[#0d631b] transition-colors"
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
