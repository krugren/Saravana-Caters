"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type GalleryImage = {
  id: string; url: string; alt: string; category: string;
  isFeatured: boolean | null; sortOrder: number;
};

const ALL_CATEGORIES = ["All", "Weddings", "Corporate", "House Functions", "Food", "Sweets & Desserts", "Team"];

export default function GalleryPage({ images }: { images: GalleryImage[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(images.map(i => i.category).filter(Boolean)))];
  const filtered = activeCategory === "All" ? images : images.filter(i => i.category === activeCategory);

  // Map to the shape used in the grid (with span classes for visual variety)
  const SPAN_PATTERNS = ["row-span-2", "", "", "row-span-2", "", "", "col-span-2", "", "", "", "row-span-2", ""];
  const photos = filtered.map((img, i) => ({
    ...img,
    span: img.isFeatured
      ? "row-span-2"
      : (SPAN_PATTERNS[i % SPAN_PATTERNS.length] || ""),
  }));

  useGSAP(
    () => {
      gsap.from(".photo-item", {
        opacity: 0,
        y: 24,
        scale: 0.97,
        stagger: 0.07,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".photo-grid",
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: ref, dependencies: [activeCategory] }
  );

  return (
    <div ref={ref} className="min-h-screen bg-[#fbf9f1]">
      {/* Hero header */}
      <div className="bg-[#1b4332] pt-28 pb-14 px-6 relative overflow-hidden">
        {/* Subtle text watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-[0.04] select-none pointer-events-none"
          aria-hidden
        >
          <span
            className="font-display font-bold text-white uppercase tracking-widest"
            style={{ fontSize: "clamp(60px, 14vw, 180px)" }}
          >
            Gallery
          </span>
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <p className="font-tamil text-[#c8a951] text-sm mb-3">எங்கள் சமையல்</p>
          <h1
            className="font-display font-bold text-white leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            Food Worth Remembering
          </h1>
          <p className="text-white/60 mt-3 text-base max-w-xl leading-relaxed">
            Every photograph here represents a real event, a real family, and a meal cooked
            fresh on the day. This is what we do — and we&apos;re proud of it.
          </p>
        </div>
      </div>

      {/* Category filter */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                activeCategory === cat
                  ? "bg-[#0d631b] text-white border-[#0d631b]"
                  : "border-[#1b4332]/20 text-[#40493d] hover:border-[#0d631b]/50 hover:text-[#0d631b]"
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {filtered.length === 0 ? (
          <p className="text-center text-[#707a6c] py-16">No photos in this category yet.</p>
        ) : (
          <div
            className="photo-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[220px] gap-3 sm:gap-4"
          >
            {photos.map((photo, i) => (
              <div
                key={photo.id}
                className={[
                  "photo-item relative rounded-xl sm:rounded-2xl overflow-hidden group",
                  photo.span,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-[#1b4332]/0 group-hover:bg-[#1b4332]/25 transition-colors duration-300 flex items-end p-4 opacity-0 group-hover:opacity-100">
                  <p className="text-white text-xs font-medium leading-snug">{photo.alt}</p>
                </div>
                {/* Category badge */}
                {photo.category && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] bg-black/50 text-white px-2 py-0.5 rounded-full">{photo.category}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-[#40493d] text-base mb-6 max-w-md mx-auto leading-relaxed">
            Ready to have food like this at your event? Let&apos;s start planning.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#0d631b] text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-[#1b4332] transition-colors"
          >
            Send an Enquiry
          </Link>
        </div>
      </div>
    </div>
  );
}
