"use client";

// Pure CSS marquee — GPU composited, pause on hover
const ITEMS = [
  "Grand Weddings",
  "Wedding Receptions",
  "Corporate Events",
  "House Functions",
  "Temple Festivals",
  "Birthday Celebrations",
  "Housewarmings",
  "Engagements",
];

const MARQUEE_TEXT = ITEMS.map(i => `${i}  ·  `).join("");

export default function MarqueeStrip() {
  return (
    <div className="bg-[#1b4332] py-3.5 overflow-hidden select-none border-y border-[#0d631b]">
      <div
        className="flex whitespace-nowrap"
        style={{ animation: "marquee 28s linear infinite" }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.animationPlayState = "paused")}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.animationPlayState = "running")}
      >
        {/* Two copies for seamless loop */}
        {[0, 1].map(n => (
          <span
            key={n}
            aria-hidden={n === 1}
            className="font-display text-[13px] font-semibold tracking-[0.18em] uppercase text-[#c8a951]/90 px-8"
          >
            {MARQUEE_TEXT}
          </span>
        ))}
      </div>
    </div>
  );
}
