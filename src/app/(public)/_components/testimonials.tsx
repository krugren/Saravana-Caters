"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";


type Testimonial = { id: string; quote: string; name: string; detail: string; initials: string };

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  useEffect(() => {
    if (paused || testimonials.length === 0) return;
    const t = setInterval(() => setIdx(i => (i + 1) % testimonials.length), 5500);
    return () => clearInterval(t);
  }, [paused, testimonials.length]);

  const prev = () => setIdx(i => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIdx(i => (i + 1) % testimonials.length);
  if (testimonials.length === 0) return null;

  // After the guard we know testimonials has at least one element
  const current = testimonials[idx] ?? testimonials[0]!;

  return (
    <section ref={ref} className="py-12 sm:py-16 md:py-20 bg-[#1b4332] overflow-hidden relative">



      {/* Decorative quote mark — scaled down, hidden on small mobile */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 font-display text-[#c8a951]/8 select-none pointer-events-none hidden sm:block"
        style={{ fontSize: "clamp(80px, 12vw, 160px)" }} aria-hidden>
        &ldquo;
      </div>

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-px bg-[#c8a951]" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951]">
                Trusted voices
              </span>
            </div>
            <h2 className="font-display font-bold text-white"
              style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}>
              What Families Say
            </h2>
          </div>

          {/* Nav arrows */}
          <div className="flex items-center gap-2.5">
            <button onClick={prev} aria-label="Previous"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white/20 text-white flex items-center justify-center hover:border-[#c8a951] hover:text-[#c8a951] transition-colors duration-200">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={next} aria-label="Next"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white/20 text-white flex items-center justify-center hover:border-[#c8a951] hover:text-[#c8a951] transition-colors duration-200">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Carousel content */}
        <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start"
            >
              {/* Main quote */}
              <div className="md:col-span-2">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#c8a951] text-[#c8a951]" />
                  ))}
                </div>
                {/* Quote — fluid 16px → 22px */}
                <p className="font-display text-white font-medium leading-relaxed mb-6"
                  style={{ fontSize: "clamp(1rem, 1.8vw, 1.3rem)" }}>
                  &ldquo;{current.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c8a951]/20 border-2 border-[#c8a951]/40 flex items-center justify-center text-[#c8a951] font-display font-bold text-[13px]">
                    {current.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-[13px] sm:text-[14px]">{current.name}</p>
                    <p className="text-[11px] sm:text-[12px] text-white/50 mt-0.5">{current.detail}</p>
                  </div>
                </div>
              </div>

              {/* Sidebar — other testimonials, hidden on mobile */}
              <div className="hidden md:flex flex-col gap-2.5">
                {testimonials.map((other, i) => (
                  <button key={i} onClick={() => setIdx(i)}
                    className={`text-left px-4 py-3.5 rounded-xl border transition-all duration-300 ${
                      i === idx
                        ? "bg-white/10 border-[#c8a951]/40"
                        : "border-white/10 hover:border-white/20 opacity-50 hover:opacity-80"
                    }`}>
                    <p className="text-white/80 text-[11px] leading-relaxed line-clamp-2 italic">
                      &ldquo;{other.quote.slice(0, 75)}…&rdquo;
                    </p>
                    <p className="text-[10px] text-[#c8a951] font-semibold mt-1.5">{other.name}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} aria-label={`Testimonial ${i + 1}`}>
                <div className={`h-1 rounded-full transition-all duration-400 ${
                  i === idx ? "w-7 bg-[#c8a951]" : "w-1.5 bg-white/20"
                }`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
