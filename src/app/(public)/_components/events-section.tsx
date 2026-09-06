"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";


const PANELS = [
  {
    id: "weddings",
    index: "01",
    title: "Grand Weddings",
    tamil: "திருமண விழா",
    tagline: "Every ritual honoured. Every dish perfect.",
    body: "From the morning breakfast spread to the evening reception, we manage the full culinary experience. Banana leaf service, signature sweets, and a team that works invisibly so you can be present.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80",
    href: "/services#weddings",
  },
  {
    id: "corporate",
    index: "02",
    title: "Corporate Events",
    tamil: "நிறுவன நிகழ்வு",
    tagline: "Organised, hygienic, on the dot.",
    body: "Office lunches, product launches, board meetings, institutional functions. Clean buffet setups, timely service, a menu that respects every dietary need.",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=900&q=80",
    href: "/services#corporate",
  },
  {
    id: "home",
    index: "03",
    title: "House Functions",
    tamil: "வீட்டு நிகழ்வு",
    tagline: "Home-cooked warmth. Professional execution.",
    body: "Naming ceremonies, housewarmings, birthdays, Seemantham, temple functions. Small or large, authentic home-style cooking with the reliability that only experience provides.",
    image: "https://images.unsplash.com/photo-1530062845289-9109b2c9c868?w=900&q=80",
    href: "/services#home",
  },
];

export default function EventsSection() {
  const [active, setActive] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 bg-[#f5f4ec]">


      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        ref={ref}
      >
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-5 h-px bg-[#c8a951]" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951]">
              What we do best
            </span>
          </div>
          {/* Heading — fluid 22px → 32px */}
          <h2 className="font-display font-bold text-[#1b1c17] leading-tight"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}>
            Events We&rsquo;re Made For
          </h2>
          <p className="text-[#40493d] text-[13px] sm:text-[14px] mt-1.5">
            Tailored menus for every milestone in your life.
          </p>
        </div>
        <Link href="/services"
          className="shrink-0 inline-flex items-center gap-2 text-[12px] sm:text-[13px] font-bold text-[#0d631b] group">
          <span className="border-b border-[#0d631b]/40 group-hover:border-[#0d631b] transition-colors pb-0.5">
            All services
          </span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </motion.div>

      {/* Panels:
          Mobile  — vertical stack, each card fixed 220px tall
          Desktop — horizontal flex, height 420px
      */}
      <div
        className="max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-2"
        style={{ height: undefined }}
        onMouseLeave={() => setActive(null)}
      >
        {PANELS.map((panel) => {
          const isActive = active === panel.id;
          const isIdle = active === null;

          return (
            <motion.div
              key={panel.id}
              onMouseEnter={() => setActive(panel.id)}
              /* On desktop: flex expansion. On mobile: always full width, fixed height */
              animate={{ flex: isActive ? 1.9 : isIdle ? 1 : 0.55 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="relative overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer"
              style={{
                /* Mobile: fixed height; desktop: controlled by flex inside the row */
                minHeight: "clamp(160px, 28vw, 220px)",
              }}
            >
              <Image
                src={panel.image}
                alt={panel.title}
                fill
                className="object-cover"
                style={{
                  transform: isActive ? "scale(1.03)" : "scale(1.1)",
                  transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)",
                }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 transition-all duration-500"
                style={{
                  background: isActive
                    ? "linear-gradient(to top, rgba(13,26,16,0.95) 0%, rgba(13,26,16,0.35) 55%, transparent 100%)"
                    : "linear-gradient(to top, rgba(13,26,16,0.88) 0%, rgba(13,26,16,0.55) 100%)",
                }}
              />

              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 md:p-6">
                <span className="font-display text-[10px] font-bold tracking-[0.2em] text-[#c8a951] mb-2">
                  {panel.index}
                </span>
                <h3 className="font-display font-bold text-white leading-tight transition-all duration-300"
                  style={{ fontSize: isActive ? "clamp(1rem, 1.5vw, 1.35rem)" : "clamp(0.9rem, 1.2vw, 1.1rem)" }}>
                  {panel.title}
                </h3>
                <p className="font-tamil text-white/40 text-[10px] mt-0.5 mb-3">{panel.tamil}</p>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <p className="text-[#c8a951]/80 text-[11px] sm:text-[12px] italic mb-2">
                        &ldquo;{panel.tagline}&rdquo;
                      </p>
                      <p className="text-white/60 text-[11px] sm:text-[12px] leading-relaxed mb-4 max-w-[260px]">
                        {panel.body}
                      </p>
                      <Link href={panel.href}
                        className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#c8a951] hover:gap-2.5 transition-all duration-200">
                        Learn more <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isActive && (
                  <p className="text-white/35 text-[11px] truncate italic">{panel.tagline}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
