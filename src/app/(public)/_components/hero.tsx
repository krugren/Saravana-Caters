"use client";

import { useRef } from "react";
import ScrollIndicator from "./scroll-indicator";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HEADLINE_LINES = [
  ["Premium", "Catering."],
  ["Traditional", "Taste."],
  ["Trusted", "Across", "Erode."],
];

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.from(bgRef.current, { scale: 1.06, duration: 2.2, ease: "power2.out" });
      tl.from(".hw", { yPercent: 115, stagger: 0.065, duration: 0.9, ease: "power4.out" }, "-=1.8");
      tl.from(".hero-rule", { scaleX: 0, transformOrigin: "left center", duration: 0.7, ease: "power3.inOut" }, "-=0.5");
      tl.from(".hero-sub", { opacity: 0, y: 16, duration: 0.65, ease: "power3.out" }, "-=0.4");
      tl.from(".hero-cta", { opacity: 0, y: 14, stagger: 0.1, duration: 0.5, ease: "power3.out" }, "-=0.3");
      tl.from(".hero-scroll", { opacity: 0, duration: 0.5 }, "-=0.2");

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => gsap.set(bgRef.current, { yPercent: self.progress * 18 }),
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative h-[100svh] min-h-[540px] overflow-hidden">
      {/* Background */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/hero-cinematic.png"
          alt="Traditional South Indian banana leaf feast"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(13,26,16,0.92) 0%, rgba(13,26,16,0.45) 45%, rgba(13,26,16,0.1) 100%)" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(13,26,16,0.35) 0%, transparent 60%)" }} />
      </div>

      {/* Content — bottom-anchored */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pb-10 sm:pb-12 md:pb-16">

          {/* Tamil eyebrow */}
          <p className="font-tamil text-[#c8a951]/80 text-xs sm:text-sm tracking-widest mb-3 sm:mb-4">
            சுவையான உணவு. நம்பகமான சேவை.
          </p>

          {/* Headline — fluid from ~26px (mobile) to ~52px (desktop) */}
          <h1 className="mb-4 sm:mb-5" style={{ lineHeight: 1.08 }}>
            {HEADLINE_LINES.map((line, li) => (
              <div key={li} className="flex flex-wrap gap-x-2 sm:gap-x-3 overflow-hidden">
                {line.map((word, wi) => (
                  <span key={wi} className="overflow-hidden inline-block">
                    <span
                      className="hw inline-block font-display font-bold text-white will-change-transform"
                      style={{ fontSize: "clamp(1.6rem, 3.8vw, 3.2rem)" }}
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </h1>

          {/* Rule */}
          <div className="hero-rule w-12 sm:w-16 h-[2px] bg-[#c8a951] rounded-full mb-4 sm:mb-6 will-change-transform" />

          {/* Subtitle */}
          <p className="hero-sub text-white/70 text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed mb-6 sm:mb-8 max-w-xs sm:max-w-sm md:max-w-md">
            From intimate family rituals to grand wedding receptions — 
            50 guests or 5,000. Erode&apos;s most trusted catering family.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link href="/contact"
              className="hero-cta inline-flex items-center gap-2 bg-[#c8a951] text-[#1b1c17] px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-bold text-[12px] sm:text-[13px] tracking-wide hover:bg-[#e2c06a] transition-colors duration-200 group">
              Book a Consultation
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/menu"
              className="hero-cta inline-flex items-center gap-2 border-2 border-white/25 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-bold text-[12px] sm:text-[13px] tracking-wide hover:border-white/50 hover:bg-white/5 transition-all duration-200">
              View Menu
            </Link>
          </div>
        </div>

          {/* Scroll indicator — hidden on mobile */}
          <div className="hero-scroll absolute right-6 bottom-6 hidden md:flex flex-col items-center gap-2 opacity-40">
            <ScrollIndicator />
          </div>
      </div>
    </section>
  );
}
