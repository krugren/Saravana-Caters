"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 1000, suffix: "+", label: "Events Completed", sub: "across Erode district" },
  { value: 20, suffix: "+", label: "Years of Service", sub: "since 2004" },
  { value: 100000, suffix: "+", label: "Guests Fed", sub: "and counting" },
  { value: 50, suffix: "+", label: "Menu Varieties", sub: "traditional & seasonal" },
];

function useCountUp(target: number, active: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf: number;
    const start = performance.now();
    const dur = 2000;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setN(Math.floor(ease * target));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setN(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);
  return n;
}

function Stat({ value, suffix, label, sub, index }: typeof STATS[0] & { index: number }) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const n = useCountUp(value, active);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const fmt = value >= 10000
    ? (n / 100000 >= 1 ? `${(n / 100000).toFixed(1)}L` : n.toLocaleString("en-IN"))
    : n.toString();

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center py-8 px-4 relative"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Vertical divider */}
      {index > 0 && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-px bg-[#1b4332]/15" />
      )}
      <div className="font-display font-bold text-[#0d631b] mb-1"
        style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}>
        {fmt}{suffix}
      </div>
      <div className="text-[12px] font-bold tracking-[0.12em] uppercase text-[#1b1c17] mb-1">{label}</div>
      <div className="text-[11px] text-[#707a6c]">{sub}</div>
    </div>
  );
}

export default function StatsCounter() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4">
      {STATS.map((s, i) => <Stat key={s.label} {...s} index={i} />)}
    </div>
  );
}
