"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Item = { src: string; alt: string };

export default function GallerySlider({ items }: { items: Item[] }) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    ref.current?.scrollBy({ left: dir === "right" ? 380 : -380, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {/* Prev / Next */}
      <button
        onClick={() => scroll("left")}
        aria-label="Previous"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 border border-[#e4e3db] shadow-md flex items-center justify-center text-[#0d631b] hover:bg-[#0d631b] hover:text-white transition-colors duration-200"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => scroll("right")}
        aria-label="Next"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 border border-[#e4e3db] shadow-md flex items-center justify-center text-[#0d631b] hover:bg-[#0d631b] hover:text-white transition-colors duration-200"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Scroll container */}
      <div
        ref={ref}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory px-[max(24px,calc((100vw-1200px)/2))] pb-2 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="relative min-w-[300px] md:min-w-[380px] h-60 snap-center rounded-2xl overflow-hidden group shrink-0"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="380px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
