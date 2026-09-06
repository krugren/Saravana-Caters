"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const PANELS = [
  {
    id: "weddings",
    label: "01",
    title: "Grand Weddings",
    subtitle: "வாழ்க்கை விழா",
    tagline: "Every tradition, every dish, every moment — honoured.",
    description:
      "From the morning breakfast spread to the evening reception, we manage the complete culinary experience. Banana leaf meal service, signature sweets, and a team that blends invisibly into your celebration.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0zWLEifAl_kLpJfOQYAUOnTMPXycKyrxvCI0CqO-7j0o7kY9YlNTrhCzsMZuZR2-BCtoeAkuYjo5ns9uf2WAvijI8Gpz_nEvdLL2A_t5MeHDRhjpJvZP-kYfzFraafW7uD0EXLfPxrZKWIlbhQPdzvPliBc5B9XQqpfQucGh15UrM_1QHNjX_HxfuxCDeR2ungVLd_SWygrsdSakwoUCGvnqHi42IXAhGGTQ8-O3bERkTSU0C93Ys",
    href: "/services#weddings",
    accentColor: "#c8a951",
  },
  {
    id: "corporate",
    label: "02",
    title: "Corporate Events",
    subtitle: "நிறுவன நிகழ்வுகள்",
    tagline: "Organised, hygienic, and on the dot.",
    description:
      "Office lunches, product launches, board meetings, institutional functions. Clean buffet setups, timely delivery, a menu that respects every dietary need. Professional service that reflects well on your company.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_RCfXKHiktHWmEKeSxkIz4_wNAAT3mJrDJPm_-zhJW-6csB4ga7XJxfB1J3Kse5fgb6vbNLvqkQqOfw7DsrHUHXXd3W3hk3g3aug3yp8_zhZv-nefqPWzxrIO18-UwgiyklFw7jQ5_x7eFzq4gsf8xJU17dLXYs3V6woeTwJkRCUxmx595yNXhCaR-nf2IxxpptzXGeMB8Z7PkCXO-JoAkeGjdLMBgMhTwtlRby_prp-V3oobcpwp",
    href: "/services#corporate",
    accentColor: "#88d982",
  },
  {
    id: "home",
    label: "03",
    title: "House Functions",
    subtitle: "வீட்டு நிகழ்வுகள்",
    tagline: "Home-cooked warmth, catering-scale execution.",
    description:
      "Naming ceremonies, housewarmings, birthdays, temple events, Seemantham. Small or large, we bring the warmth of a home kitchen to your gathering with the precision that only experience provides.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYyfKpVRy1Sj0elCQazo4fdCx473e3HTRMwgj667pdmggzQhuCyje54yTIuzFcncMAVnfNhiSmtXJV6czcoBlJ6udmvfC8lwQDmqZBkf3_22WB3tDjE8ggz3611WxfyqW4Sn91DdOOi2Egbjh33_Gff7X9m1FdldYlY0H9wbQM7krKS0eFq3xt2xMMNWLMsiNTMz5yOxrguM-sjpA2_HHthaOFAZ5cEXJ_sKjyL5xSOiqpkUWEG",
    href: "/services#home",
    accentColor: "#c8a951",
  },
];

export default function ExpandingPanels() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div
      className="flex flex-col md:flex-row h-auto md:h-[560px] gap-1 px-6 max-w-[1240px] mx-auto"
      onMouseLeave={() => setActive(null)}
    >
      {PANELS.map((panel) => {
        const isActive = active === panel.id;
        const isOther = active !== null && !isActive;

        return (
          <div
            key={panel.id}
            onMouseEnter={() => setActive(panel.id)}
            className="relative overflow-hidden rounded-2xl cursor-pointer"
            style={{
              flex: isActive ? "0 0 52%" : isOther ? "0 0 24%" : "1",
              transition: "flex 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              minHeight: "240px",
            }}
          >
            {/* Background image */}
            <Image
              src={panel.image}
              alt={panel.title}
              fill
              className="object-cover"
              style={{
                transform: isActive ? "scale(1.05)" : "scale(1.12)",
                transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Dark overlay — deeper when not active */}
            <div
              className="absolute inset-0"
              style={{
                background: isActive
                  ? "linear-gradient(to top, rgba(27,67,50,0.92) 0%, rgba(27,67,50,0.3) 60%, transparent 100%)"
                  : "linear-gradient(to top, rgba(27,67,50,0.85) 0%, rgba(27,67,50,0.5) 100%)",
                transition: "background 0.5s ease",
              }}
            />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-7">
              {/* Number — always visible */}
              <span
                className="font-display text-[11px] font-bold tracking-[0.2em] mb-3"
                style={{ color: panel.accentColor }}
              >
                {panel.label}
              </span>

              {/* Title — always visible */}
              <h3 className="font-display font-bold text-white leading-tight mb-1"
                style={{ fontSize: isActive ? "1.7rem" : "1.2rem", transition: "font-size 0.4s ease" }}>
                {panel.title}
              </h3>

              {/* Tamil subtitle */}
              <p className="font-tamil text-white/50 text-xs mb-4">{panel.subtitle}</p>

              {/* Expanded content — only when active */}
              <div
                style={{
                  maxHeight: isActive ? "200px" : "0px",
                  opacity: isActive ? 1 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease",
                }}
              >
                <p className="text-white/70 text-[13px] leading-relaxed mb-5 max-w-xs italic">
                  &ldquo;{panel.tagline}&rdquo;
                </p>
                <p className="text-white/60 text-[13px] leading-relaxed mb-5">
                  {panel.description}
                </p>
                <Link
                  href={panel.href}
                  className="inline-flex items-center gap-2 text-[13px] font-bold hover:gap-3 transition-all duration-200"
                  style={{ color: panel.accentColor }}
                >
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Collapsed — show tagline hint */}
              {!isActive && (
                <p className="text-white/40 text-[12px] italic truncate">{panel.tagline}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
