"use client";

import { motion } from "framer-motion";


const PILLARS = [
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <path d="M16 3L4 8v8c0 7 5.4 13.5 12 15 6.6-1.5 12-8 12-15V8L16 3z" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 16l3 3 7-7" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "FSSAI Registered",
    copy: "Full food safety compliance. Every ingredient sourced, stored and served to government standards.",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <circle cx="16" cy="10" r="5" stroke="#c8a951" strokeWidth="1.5"/>
        <path d="M8 26c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M22 14c2.2.8 4 2.8 4 5" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 14c-2.2.8-4 2.8-4 5" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Family-Run Since 2004",
    copy: "Not a franchise. Real people, same family, same recipes — carried forward with pride across generations.",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <path d="M6 8h20M6 12h20M6 16h14" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M22 20l2 2 4-4" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="3" y="5" width="26" height="22" rx="2" stroke="#c8a951" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Served on Time",
    copy: "We do not cook the night before. We show up, cook fresh, and serve on schedule. Every single event.",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <path d="M16 4c-6.6 0-12 4.5-12 10 0 3 1.5 5.7 4 7.7V26l4-2h4c6.6 0 12-4.5 12-10S22.6 4 16 4z" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 14h12M10 18h8" stroke="#c8a951" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "50 to 5,000 Guests",
    copy: "Intimate family functions or grand wedding receptions — the same care, the same taste, regardless of scale.",
  },
];

export default function TrustPillars() {
  return (
    <section className="pillars-panel relative overflow-hidden" aria-label="Why choose Saravana Caters">


      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-14 sm:py-16 md:py-20">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12">
          <div>
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951] mb-2">
              OUR PROMISE
            </p>
            <h2
              className="font-display font-bold text-white leading-tight"
              style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)" }}
            >
              Built on values.<br />
              <span className="italic text-[#c8a951]">Proven by experience.</span>
            </h2>
          </div>
          <p className="text-white/55 text-[13px] md:text-[14px] leading-relaxed md:max-w-xs md:text-right">
            These are not taglines. They are the operational principles that have
            kept families coming back for over two decades.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8 rounded-2xl overflow-hidden">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="group bg-[#1b4332] hover:bg-[#22573f] transition-colors duration-300 px-6 py-8 flex flex-col gap-4"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl border border-[#c8a951]/25 flex items-center justify-center group-hover:border-[#c8a951]/50 transition-colors duration-300">
                {p.icon}
              </div>

              {/* Title */}
              <h3 className="font-bold text-white text-[13px] tracking-wide leading-snug">
                {p.title}
              </h3>

              {/* Copy */}
              <p className="text-white/55 text-[13px] leading-relaxed">
                {p.copy}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
