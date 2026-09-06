"use client";

import { useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";


gsap.registerPlugin(ScrollTrigger);

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

type StatsProps = { eventsCount: number; yearsOfService: number; guestsServed: number; menuVarieties: number };
export default function StatsSection({ stats }: { stats: StatsProps }) {
  const STATS = [
    { value: stats.eventsCount,   display: `${stats.eventsCount.toLocaleString("en-IN")}+`, label: "Events Catered",   context: "weddings, receptions & corporate" },
    { value: stats.yearsOfService,display: `${stats.yearsOfService}+`,                     label: "Years of Service", context: "since 2004, serving Erode" },
    { value: stats.guestsServed,  display: stats.guestsServed >= 100000 ? "1L+" : `${stats.guestsServed.toLocaleString("en-IN")}+`, label: "Guests Served", context: "and still cooking" },
    { value: stats.menuVarieties, display: `${stats.menuVarieties}+`,                      label: "Menu Varieties",   context: "seasonal & traditional" },
  ];
  const ref = useRef<HTMLElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const setRef = useCallback((el: HTMLSpanElement | null, i: number) => {
    counterRefs.current[i] = el;
  }, []);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 72%",
        once: true,
        onEnter: () => {
          STATS.forEach((stat, i) => {
            const el = counterRefs.current[i];
            if (!el || stat.value === 100000) return; // skip pre-formatted
            const isLarge = stat.value >= 1000;
            const obj = { val: 0 };
            gsap.to(obj, {
              val: stat.value,
              duration: 2.2,
              delay: i * 0.12,
              ease: "power2.out",
              onUpdate() {
                const v = Math.round(obj.val);
                el.textContent = isLarge
                  ? v.toLocaleString("en-IN")
                  : v.toString();
              },
              onComplete() {
                el.textContent = isLarge
                  ? stat.value.toLocaleString("en-IN")
                  : stat.value.toString();
              },
            });
          });
        },
      });
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      className="section-watermark stats-card-bg relative overflow-hidden"
      aria-label="Saravana Caters by the numbers"
    >


      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24">
        {/*
          Kuuraii-style layout:
          Left col: editorial heading + copy
          Right col: 2×2 number grid
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* ── Left — editorial heading ─────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05, duration: 0.5, ease: EASE }}
              className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951] mb-3"
            >
              MEASURED IN MOMENTS
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12, duration: 0.6, ease: EASE }}
              className="font-display font-bold text-[#1b2e22] mb-4 leading-tight"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}
            >
              Tradition, served<br />
              <span className="italic">table by table.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.55, ease: EASE }}
              className="text-[#40493d] leading-relaxed max-w-sm"
              style={{ fontSize: "clamp(0.85rem, 1.2vw, 0.95rem)" }}
            >
              Every number here is a family fed, a celebration honoured, a trust
              earned. We have been at this since 2004 — and we are still
              cooking.
            </motion.p>

            {/* Gold divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
              style={{ transformOrigin: "left center" }}
              className="mt-6 w-10 h-[2px] bg-[#c8a951] rounded-full"
            />
          </motion.div>

          {/* ── Right — 2×2 stat grid ────────────────────── */}
          <div className="grid grid-cols-2 gap-px bg-[#1b4332]/10 rounded-2xl overflow-hidden">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.55, ease: EASE }}
                className="bg-[#ede8db] px-6 py-8 flex flex-col gap-1"
              >
                {/* Number */}
                <div
                  className="font-display font-bold text-[#1b2e22] leading-none"
                  style={{ fontSize: "clamp(2rem, 3.2vw, 2.8rem)" }}
                >
                  {stat.value === 100000 ? (
                    <span>1L+</span>
                  ) : (
                    <>
                      <span ref={(el) => setRef(el, i)}>0</span>
                      <span>+</span>
                    </>
                  )}
                </div>
                {/* Label */}
                <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#40493d] mt-1">
                  {stat.label}
                </div>
                {/* Context */}
                <div className="text-[11px] text-[#707a6c]">
                  {stat.context}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
