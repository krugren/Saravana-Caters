/**
 * SectionWatermark
 *
 * Renders a faint SVG decorative element positioned absolutely within a section.
 * The parent section MUST have `position: relative` and ideally `overflow-hidden`.
 *
 * Usage:
 *   <section className="relative overflow-hidden">
 *     <SectionWatermark src="/images/bg-botanical.svg" position="right" size="xl" />
 *     <div className="relative z-10">…content…</div>
 *   </section>
 *
 * SVG assets:
 *   /images/bg-botanical.svg   — banana leaf side view
 *   /images/bg-leaf-plate.svg  — banana leaf plate top view
 *   /images/bg-lamp.svg        — traditional oil lamp (Agal Vilakku)
 *   /images/bg-kolam.svg       — South Indian kolam pattern
 *   /images/bg-banana-tree.svg — banana plant with bunch
 *   /images/bg-gopuram.svg     — temple tower silhouette
 */

const SIZE_MAP = {
  sm:  { width: "clamp(80px,  10vw, 140px)", height: "clamp(80px,  14vw, 200px)" },
  md:  { width: "clamp(120px, 14vw, 220px)", height: "clamp(160px, 20vw, 320px)" },
  lg:  { width: "clamp(160px, 18vw, 300px)", height: "clamp(220px, 28vw, 440px)" },
  xl:  { width: "clamp(200px, 22vw, 380px)", height: "clamp(280px, 36vw, 560px)" },
  /** Square — for kolam, plate */
  sq:  { width: "clamp(120px, 16vw, 260px)", height: "clamp(120px, 16vw, 260px)" },
  sqLg:{ width: "clamp(180px, 22vw, 360px)", height: "clamp(180px, 22vw, 360px)" },
} as const;

const POS_MAP = {
  "top-right":    { top: "-5%",  right: "-4%",  bottom: "auto", left: "auto"  },
  "center-right": { top: "50%",  right: "-4%",  bottom: "auto", left: "auto",
                    transform: "translateY(-50%)" },
  "bottom-right": { top: "auto", right: "-3%",  bottom: "-5%",  left: "auto"  },
  "top-left":     { top: "-5%",  right: "auto", bottom: "auto", left: "-4%"   },
  "center-left":  { top: "50%",  right: "auto", bottom: "auto", left: "-4%",
                    transform: "translateY(-50%)" },
  "bottom-left":  { top: "auto", right: "auto", bottom: "-5%",  left: "-4%"   },
  "center":       { top: "50%",  right: "auto", bottom: "auto", left: "50%",
                    transform: "translate(-50%, -50%)" },
} as const;

interface Props {
  /** Path to the SVG in /public */
  src: string;
  /** Predefined position shorthand */
  position?: keyof typeof POS_MAP;
  /** Predefined size shorthand */
  size?: keyof typeof SIZE_MAP;
  /** Override opacity (default 0.055) */
  opacity?: number;
  /**
   * "green"  — forest green tint (for light/cream sections, default)
   * "cream"  — warm cream/off-white tint (for dark green sections)
   * "gold"   — warm gold tint
   */
  tint?: "green" | "cream" | "gold";
  /** Additional Tailwind / inline classes */
  className?: string;
  /** Custom CSS overrides beyond the presets */
  style?: React.CSSProperties;
}

const TINT_FILTERS = {
  green: "brightness(0) saturate(100%) invert(18%) sepia(60%) saturate(600%) hue-rotate(100deg) brightness(50%)",
  cream: "brightness(0) invert(1) opacity(0.18)",
  gold:  "brightness(0) saturate(100%) invert(72%) sepia(45%) saturate(500%) hue-rotate(5deg) brightness(90%)",
};

export default function SectionWatermark({
  src,
  position = "center-right",
  size = "lg",
  opacity = 0.055,
  tint = "green",
  className = "",
  style = {},
}: Props) {
  const sizeStyles = SIZE_MAP[size];
  const posStyles  = POS_MAP[position];

  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none select-none ${className}`}
      style={{
        ...posStyles,
        ...sizeStyles,
        backgroundImage:    `url(${src})`,
        backgroundRepeat:   "no-repeat",
        backgroundSize:     "contain",
        backgroundPosition: "center",
        opacity,
        filter: TINT_FILTERS[tint],
        zIndex: 0,
        ...style,
      }}
    />
  );
}
