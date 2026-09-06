"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { ArrowRight, Phone, Check, ChevronDown } from "lucide-react";

/* ─── Animation tokens ─── */
const EASE = [0.25, 0.46, 0.45, 0.94] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

/* ─── Service data ─── */
const SERVICES = [
  {
    id: "weddings",
    index: "01",
    title: "Wedding Catering",
    tamil: "திருமண விழா",
    tagline: "Every ritual honoured. Every dish perfect.",
    description:
      "A wedding is not just a meal — it is a memory every guest carries home. We manage the full culinary journey: morning breakfast service, afternoon feast, evening reception, and everything in between. Banana leaf dining, traditional sweets, fresh juices — executed by a team that works quietly so your family can be fully present.",
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=1000&q=80",
    includes: [
      "Full-day setup and cooking team",
      "Traditional banana leaf service",
      "Customised menu — vegetarian & Jain options",
      "Morning breakfast to evening reception",
      "Signature sweets — Halwa, Kesari, Payasam",
      "Professional serving staff in uniform",
      "Complete post-event cleanup",
    ],
    guests: "100 – 5,000 guests",
    notice: "Minimum 2 weeks notice preferred",
    accent: "#1b4332",
  },
  {
    id: "corporate",
    index: "02",
    title: "Corporate Events",
    tamil: "நிறுவன நிகழ்வு",
    tagline: "Organised, hygienic, on the dot.",
    description:
      "Your employees and guests should eat well, quickly, and without fuss. We set up clean buffet lines, serve on schedule, and clear out without disrupting your programme. Whether it is a working lunch, product launch, or annual day, we adapt our menu and format to match the formality of your event.",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1000&q=80",
    includes: [
      "Hygienic buffet setup with sneeze guards",
      "On-time serving — synced with your agenda",
      "Vegetarian, non-vegetarian and Jain options",
      "Hot & cold beverage counters",
      "Experienced staff in formal wear",
      "FSSAI-compliant food handling",
      "Rapid post-service clearing",
    ],
    guests: "50 – 1,000 guests",
    notice: "72-hour notice accepted for smaller events",
    accent: "#0d631b",
  },
  {
    id: "home",
    index: "03",
    title: "House Functions",
    tamil: "வீட்டு நிகழ்வு",
    tagline: "Home-cooked warmth. Professional execution.",
    description:
      "Naming ceremonies, housewarmings, Seemantham, ear-piercing ceremonies, birthdays, Sashtiabdapoorthi — every milestone deserves food that tastes like it came from the family kitchen. We bring that warmth with the reliability of a professional team. Small guest count, personal touch, full-service setup.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1000&q=80",
    includes: [
      "Intimate setup for small to medium functions",
      "Traditional home-style cooking",
      "Banana leaf or steel vessel service",
      "Custom menu based on function type",
      "Sweets and savouries prepared fresh",
      "Compact, courteous team",
      "Setup and cleanup included",
    ],
    guests: "50 – 500 guests",
    notice: "1 week notice preferred",
    accent: "#1b4332",
  },
  {
    id: "temple",
    index: "04",
    title: "Temple & Religious Functions",
    tamil: "கோயில் விழா",
    tagline: "Pure ingredients. Reverential service.",
    description:
      "Temple prasadam, Annadanam, and religious feast days demand strict purity standards — no onion, no garlic where required, correct fasting-day preparations, and ingredients sourced and handled with care. We have decades of experience feeding devotees at temple festivals across Erode district.",
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=1000&q=80",
    includes: [
      "Satvik cooking — no onion, no garlic on request",
      "Annadanam-style mass feeding setup",
      "Pongal, Ven Pongal, Sakkarai Pongal",
      "Prasadam preparation with pure ghee",
      "Leaf cup and traditional vessel service",
      "High-volume rapid serving lines",
      "Suitable for all Hindu festivals and rituals",
    ],
    guests: "100 – 5,000+ guests",
    notice: "Festival bookings — 1 month advance",
    accent: "#0d631b",
  },
];

/* ─── What's always included ─── */
const ALWAYS_INCLUDED = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
        <path d="M6 13V9a6 6 0 1112 0v4" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="4" y="13" width="16" height="4" rx="2" stroke="#c8a951" strokeWidth="1.5"/>
        <path d="M8 17v3M16 17v3" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 3V1" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Fresh on-site cooking",
    body: "We do not transport pre-cooked food. Everything is prepared at or near your venue on the day.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
        <path d="M12 22V12" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 12C12 12 8 9 8 6a4 4 0 018 0c0 3-4 6-4 6z" stroke="#c8a951" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M12 12c0 0-4 2-6 5" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 12c0 0 4 2 6 5" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 21h8" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Local produce daily",
    body: "Erode market supplies every morning. No stored vegetables, no compromises on freshness.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="#c8a951" strokeWidth="1.5"/>
        <path d="M12 7v5l3 3" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "On-time serving guarantee",
    body: "We plan every event to the minute. Your guests eat when they are supposed to.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
        <path d="M20 7H4a1 1 0 00-1 1v9a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1z" stroke="#c8a951" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M8 7V5a1 1 0 011-1h6a1 1 0 011 1v2" stroke="#c8a951" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M9 13l2 2 4-4" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Full setup & cleanup",
    body: "We arrive before guests, set everything up, and leave the space cleaner than we found it.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="#c8a951" strokeWidth="1.5"/>
        <path d="M8 8h8M8 12h8M8 16h5" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Written quotation",
    body: "No surprises. Every item — menu, staff, equipment, service charges — is listed before you commit.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Direct family contact",
    body: "You speak to the family, not a call centre. Same person from first call to last dish.",
  },
];

/* ─── FAQ ─── */
const FAQS = [
  {
    q: "How far in advance should I book?",
    a: "For weddings and large events, 4–8 weeks is ideal. For house functions and corporate lunches, 1–2 weeks is usually sufficient. For urgent requirements, call us directly — we do our best.",
  },
  {
    q: "Do you serve outside Erode?",
    a: "Yes. We regularly cater in Namakkal, Salem, Gobichettipalayam, Bhavani, Tiruppur and Coimbatore. Travel charges apply for events beyond 30 km from Erode.",
  },
  {
    q: "Can you handle vegetarian-only events?",
    a: "Absolutely. A large portion of our events are fully vegetarian — including strict Jain options with no root vegetables when required.",
  },
  {
    q: "Do you provide serving equipment and vessels?",
    a: "Yes — serving vessels, ladles, chafing dishes, banana leaves, serving tables and linen are all included in our quotation. You do not need to arrange anything separately.",
  },
  {
    q: "What is your minimum guest count?",
    a: "We typically start from 50 guests. For very intimate events (below 50), please call us — we assess each case individually.",
  },
  {
    q: "How is pricing structured?",
    a: "Pricing is per-plate, based on menu selection, guest count, service style (leaf/steel/buffet) and location. We provide a complete written quotation after a brief discussion.",
  },
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

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#e4e3db]">
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        aria-expanded={open}
      >
        <span className="font-semibold text-[#1b1c17] text-[14px] sm:text-[15px] group-hover:text-[#0d631b] transition-colors leading-snug">
          {q}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-[#c8a951] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="text-[#40493d] text-[13.5px] sm:text-[14px] leading-relaxed pb-5 pr-6">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
export default function ServicesClient() {
  return (
    <div className="bg-[#fbf9f1]">

      {/* ── 1. HERO ──────────────────────────────────────── */}
      <section className="relative min-h-[58vh] flex items-end overflow-hidden bg-[#1b1c17]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1400&q=80"
            alt="Traditional South Indian banana leaf thali spread at a wedding"
            fill unoptimized priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c17] via-[#1b1c17]/55 to-[#1b1c17]/15" />
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 pb-16 sm:pb-20 pt-36 w-full">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-px bg-[#c8a951]" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[#c8a951]">
                What we do
              </span>
            </div>
            <h1
              className="font-display font-bold text-white leading-[1.05]"
              style={{ fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)" }}
            >
              Catering built for{" "}
              <span className="italic text-[#c8a951]">every occasion.</span>
            </h1>
            <p className="text-white/60 mt-4 text-[14px] sm:text-[15px] leading-relaxed max-w-lg">
              Weddings, corporate events, house functions, temple feasts — we bring the same
              fresh ingredients and family care to every event, regardless of size.
            </p>

            {/* Quick jump links */}
            <div className="flex flex-wrap gap-2 mt-7">
              {SERVICES.map(s => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="text-[11px] font-bold tracking-wide text-white/60 border border-white/20 px-4 py-2 rounded-full hover:border-[#c8a951] hover:text-[#c8a951] transition-colors duration-200"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. SERVICE CARDS ─────────────────────────────── */}
      <section className="py-16 sm:py-20 md:py-24" aria-label="Our services">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-24 sm:space-y-32">
          {SERVICES.map((service, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={service.id}
                id={service.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center scroll-mt-24 ${
                  !isEven ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -28 : 28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.85, ease: EASE }}
                  className="relative"
                >
                  <div className={`absolute -top-3 -bottom-6 rounded-2xl sm:rounded-3xl bg-[#1b4332]/5 ${isEven ? "-left-3 right-6" : "left-6 -right-3"}`} />
                  <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[3/2] lg:aspect-[4/3] shadow-2xl group">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c17]/40 to-transparent" />
                    {/* Index badge */}
                    <div className="absolute top-4 left-4 bg-[#1b4332] text-white text-[10px] font-bold tracking-[0.15em] px-3 py-1.5 rounded-full">
                      {service.index}
                    </div>
                  </div>

                  {/* Guests tag */}
                  <div className="absolute -bottom-4 right-4 sm:right-6 bg-[#fbf9f1] border border-[#e4e3db] shadow-lg rounded-xl px-4 py-3">
                    <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#c8a951] mb-0.5">Capacity</div>
                    <div className="text-[#1b1c17] font-bold text-[13px]">{service.guests}</div>
                  </div>
                </motion.div>

                {/* Text */}
                <Reveal>
                  <motion.div variants={fadeUp} className="flex items-center gap-3 mb-3">
                    <div className="w-5 h-px bg-[#c8a951]" />
                    <span className="font-tamil text-[#c8a951] text-[12px]">{service.tamil}</span>
                  </motion.div>

                  <motion.h2
                    variants={fadeUp}
                    className="font-display font-bold text-[#1b1c17] leading-[1.1] mb-3"
                    style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.3rem)" }}
                  >
                    {service.title}
                  </motion.h2>

                  <motion.p variants={fadeUp} className="text-[#c8a951] italic text-[13px] mb-4">
                    &ldquo;{service.tagline}&rdquo;
                  </motion.p>

                  <motion.p variants={fadeUp} className="text-[#40493d] text-[14px] sm:text-[15px] leading-relaxed mb-7">
                    {service.description}
                  </motion.p>

                  {/* Includes list */}
                  <motion.div variants={fadeUp} className="mb-6">
                    <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#1b4332] mb-3">What&apos;s included</p>
                    <ul className="space-y-2">
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[13px] sm:text-[14px] text-[#40493d]">
                          <Check className="w-3.5 h-3.5 text-[#0d631b] mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Notice */}
                  <motion.p variants={fadeUp} className="text-[#40493d]/60 text-[12px] mb-6 italic">
                    ✦ {service.notice}
                  </motion.p>

                  <motion.div variants={fadeUp}>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 bg-[#0d631b] text-white px-6 py-3 rounded-full font-bold text-[13px] hover:bg-[#1b4332] transition-colors duration-200 hover:scale-105 active:scale-95 transform"
                    >
                      Enquire for {service.title}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </motion.div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 3. ALWAYS INCLUDED ───────────────────────────── */}
      <section className="bg-[#1b4332] py-16 sm:py-20 md:py-24 overflow-hidden" aria-label="Always included in every event">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <Reveal className="mb-12">
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-3">
              <div className="w-5 h-px bg-[#c8a951]" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951]">Every booking</span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-display font-bold text-white leading-tight"
              style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)" }}
            >
              Included in every service,{" "}
              <span className="italic text-[#c8a951]">no exceptions.</span>
            </motion.h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/8 rounded-2xl overflow-hidden">
            {ALWAYS_INCLUDED.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}
                className="group bg-[#1b4332] hover:bg-[#22573f] transition-colors duration-300 p-6 sm:p-7"
              >
                <div className="w-10 h-10 rounded-xl border border-[#c8a951]/25 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-white text-[14px] mb-2">{item.title}</h3>
                <p className="text-white/50 text-[13px] leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. PROCESS (4 steps) ─────────────────────────── */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#f5f4ec]" aria-label="How to book">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <Reveal className="mb-12 md:mb-14">
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-3">
              <div className="w-5 h-px bg-[#c8a951]" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951]">The process</span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-display font-bold text-[#1b1c17] leading-tight"
              style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)" }}
            >
              From your first call{" "}
              <span className="italic text-[#0d631b]">to a full table.</span>
            </motion.h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: "01", title: "You reach out", body: "Call, WhatsApp, or fill our contact form. Share your date, guest count and event type. Takes 2 minutes." },
              { n: "02", title: "We visit & plan", body: "One of our team visits the venue. We understand your preferences, dietary needs and event flow." },
              { n: "03", title: "You approve the menu", body: "We send a detailed quotation — full menu, staff plan, serving schedule and total cost. You approve or refine." },
              { n: "04", title: "We cook, you celebrate", body: "We arrive, set up, cook fresh, serve on time and clean up. You stay present with your guests." },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.65, ease: EASE }}
                className="relative bg-[#fbf9f1] border border-[#e4e3db] rounded-2xl p-6 sm:p-7"
              >
                {/* Connector line (hidden on mobile, last item) */}
                {i < 3 && (
                  <div className="hidden lg:block absolute top-9 left-full w-6 h-px bg-[#e4e3db] z-10" />
                )}
                <div className="font-display text-[#c8a951] font-bold text-[13px] tracking-[0.15em] mb-3">{step.n}</div>
                <h3 className="font-display font-bold text-[#1b1c17] text-[16px] sm:text-[17px] mb-2">{step.title}</h3>
                <p className="text-[#40493d] text-[13px] sm:text-[13.5px] leading-relaxed">{step.body}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#0d631b] text-white px-8 py-3.5 rounded-full font-bold text-[13px] hover:bg-[#1b4332] transition-colors hover:scale-105 active:scale-95 transform"
            >
              Get a Quote — It&apos;s Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. FAQ ───────────────────────────────────────── */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#fbf9f1]" aria-label="Frequently asked questions">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          <Reveal className="mb-10">
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-3">
              <div className="w-5 h-px bg-[#c8a951]" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951]">Questions</span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-display font-bold text-[#1b1c17] leading-tight"
              style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)" }}
            >
              Answers before you even ask.
            </motion.h2>
          </Reveal>

          <div className="divide-y-0">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FINAL CTA ─────────────────────────────────── */}
      <section className="bg-[#1b4332] py-16 sm:py-20 md:py-24" aria-label="Book your catering">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 text-center">
          <Reveal>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-4">
              <div className="w-5 h-px bg-[#c8a951]" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951]">
                Let&apos;s begin
              </span>
              <div className="w-5 h-px bg-[#c8a951]" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="font-display font-bold text-white leading-[1.1] mb-4"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}
            >
              Your event deserves{" "}
              <span className="italic text-[#c8a951]">food people remember.</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="text-white/55 text-[14px] sm:text-[15px] leading-relaxed mb-8 max-w-md mx-auto">
              Tell us your date, guest count, and what you have in mind. We&apos;ll send you a
              complete quotation — no pressure, no obligation.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#c8a951] text-[#1b1c17] px-7 py-3.5 rounded-full font-bold text-[13px] tracking-wide hover:bg-[#d4b55e] transition-colors hover:scale-105 active:scale-95 transform"
              >
                Send an Enquiry
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+919842722977"
                className="inline-flex items-center gap-2 text-white/70 text-[13px] font-bold hover:text-white transition-colors"
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
