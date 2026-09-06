"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type GalleryImage = { id: string; url: string; alt: string; isFeatured: boolean | null; category: string };

export default function GallerySection({ images }: { images: GalleryImage[] }) {
  // Use up to 6 images; featured first
  const sorted = [...images].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  const GALLERY = sorted.slice(0, 6).map((img, i) => ({ src: img.url, alt: img.alt, featured: i === 0 }));
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-8%" });

  useGSAP(
    () => {
      gsap.from(".gallery-item", {
        opacity: 0,
        y: 30,
        scale: 0.97,
        stagger: 0.08,
        duration: 0.65,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".gallery-grid",
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-12 sm:py-16 md:py-20">
      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-px bg-[#c8a951]" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951]">
                A taste of our work
              </span>
            </div>
            <h2 className="font-display font-bold text-[#1b1c17]"
              style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}>
              Food Worth Talking About
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link href="/gallery"
              className="inline-flex items-center gap-2 text-[12px] sm:text-[13px] font-bold text-[#0d631b] group shrink-0">
              <span className="border-b border-[#0d631b]/40 group-hover:border-[#0d631b] transition-colors pb-0.5">
                View full gallery
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/*
          Gallery grid — NO empty gaps:
          Mobile: 2-col uniform grid, all aspect-[4/3]
          md+: 3-col grid: featured item (col 1) spans 2 rows portrait,
               remaining 5 items fill 2 rows × 2-col side area
        */}
        <div className="gallery-grid grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {GALLERY.map((item, i) => (
            <div
              key={i}
              className={[
                "gallery-item relative rounded-xl sm:rounded-2xl overflow-hidden group will-change-transform",
                // Featured item — col 1, span 2 rows on md+
                i === 0 ? "md:row-span-2 aspect-[4/3] md:aspect-auto" : "aspect-[4/3]",
              ].join(" ")}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes={i === 0
                  ? "(max-width: 768px) 50vw, 33vw"
                  : "(max-width: 768px) 50vw, 22vw"
                }
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#1b4332]/0 group-hover:bg-[#1b4332]/20 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
