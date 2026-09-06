"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";


const VALUES = [
  { n: "01", title: "Freshness First", body: "Local produce sourced from Erode market every morning. Not the night before." },
  { n: "02", title: "Never a Late Meal", body: "Every event is planned on paper before the first dish is cooked. Your guests eat on time." },
  { n: "03", title: "Recipes From Memory", body: "Two decades in, the core recipes haven't changed. Because they don't need to." },
  { n: "04", title: "Staff With Dignity", body: "Our team serves with courtesy. Your guests deserve that — and so does your family's name." },
];

const ease = [0.25, 0.46, 0.45, 0.94] as const;
const itemTransition = { duration: 0.7, ease };

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0 } },
};

export default function StorySection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section ref={ref} className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24">


      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-20 items-center">

        {/* Image column */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease }}
          className="relative"
        >
          <div className="absolute -left-3 -top-3 bottom-6 right-6 bg-[#1b4332]/6 rounded-2xl sm:rounded-3xl" />
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/5] shadow-xl">
            <Image
              src="/images/wedding-hall.png"
              alt="Traditional South Indian wedding catering event"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-[#1b4332]/5" />
          </div>

          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.5, ease: "backOut" }}
            className="absolute -bottom-4 -right-3 sm:-right-6 bg-[#1b4332] text-white px-4 py-3.5 sm:px-5 sm:py-4 rounded-xl shadow-xl"
          >
            <div className="font-display text-2xl sm:text-3xl font-bold text-[#c8a951] leading-none">20+</div>
            <div className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-white/50 mt-1">Years of Trust</div>
          </motion.div>

          {/* Leaf decoration */}
          <svg viewBox="0 0 80 160" className="absolute -left-6 bottom-14 w-10 sm:w-12 text-[#0d631b] opacity-20 pointer-events-none" aria-hidden>
            <path d="M40 4 C55 14 74 40 70 74 C66 105 54 130 40 155 C26 130 14 105 10 74 C6 40 25 14 40 4Z" fill="currentColor" />
            <line x1="40" y1="6" x2="40" y2="152" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
          </svg>
        </motion.div>

        {/* Text column */}
        <motion.div variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"}>

          <motion.div variants={fadeUp} transition={itemTransition} className="flex items-center gap-3 mb-4">
            <div className="w-5 h-px bg-[#c8a951]" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951]">Our story</span>
          </motion.div>

          {/* Section heading — fluid 22px → 32px */}
          <motion.h2
            variants={fadeUp}
            transition={itemTransition}
            className="font-display font-bold text-[#1b1c17] leading-[1.1] mb-4"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
          >
            Started in a home kitchen.{" "}
            <span className="text-[#0d631b]">Still cooking like one.</span>
          </motion.h2>

          <motion.p variants={fadeUp} transition={itemTransition}
            className="text-[#40493d] text-[13.5px] sm:text-[14px] md:text-[15px] leading-relaxed mb-3">
            What began as cooking for neighbours in Erode has quietly grown into
            one of the district&apos;s most-recommended names for traditional South Indian catering.
          </motion.p>

          <motion.p variants={fadeUp} transition={itemTransition}
            className="text-[#40493d]/80 text-[13px] sm:text-[14px] md:text-[14.5px] leading-relaxed mb-8">
            Two decades later — same recipes, higher standards, same warmth.
            Families come back for every milestone because the food still tastes like it was made for them.
          </motion.p>

          {/* Values list */}
          <motion.div variants={stagger} className="space-y-3 mb-7">
            {VALUES.map(({ n, title, body }) => (
              <motion.div
                key={n}
                variants={fadeUp}
                transition={itemTransition}
                className="flex gap-4 items-start pb-3 border-b border-[#e4e3db] last:border-0"
              >
                <span className="font-display text-[#c8a951] text-[12px] font-bold shrink-0 mt-0.5">{n}</span>
                <div>
                  <p className="font-semibold text-[#1b1c17] text-[13px] sm:text-[14px] mb-0.5">{title}</p>
                  <p className="text-[#40493d] text-[12.5px] sm:text-[13px] leading-relaxed">{body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} transition={itemTransition}>
            <Link href="/about"
              className="inline-flex items-center gap-2 text-[13px] font-bold text-[#0d631b] group">
              <span className="border-b border-[#0d631b]/40 group-hover:border-[#0d631b] transition-colors pb-0.5">
                Read our full story
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
      </div>
    </section>
  );
}
