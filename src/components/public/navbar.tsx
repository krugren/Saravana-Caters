"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Menu", href: "/menu" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/reviews" },
];

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 72);
    window.addEventListener("scroll", h, { passive: true });
    h();
    return () => window.removeEventListener("scroll", h);
  }, []);

  const transparent = isHome && !scrolled && !open;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          transparent
            ? "bg-transparent py-4 md:py-5"
            : "bg-[#fbf9f1]/90 backdrop-blur-md border-b border-[#1b4332]/10 shadow-sm py-2.5 md:py-3"
        }`}
      >
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 flex items-center justify-between">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-300 ${transparent ? "bg-white/10" : "bg-[#0d631b]/10"}`}>
              <svg viewBox="0 0 40 40" className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${transparent ? "fill-white" : "fill-[#0d631b]"}`}>
                <path d="M20 4 C28 8 36 16 34 24 C32 32 26 36 20 38 C14 36 8 32 6 24 C4 16 12 8 20 4Z" />
                <line x1="20" y1="6" x2="20" y2="36" stroke={transparent ? "rgba(200,169,81,0.6)" : "rgba(200,169,81,0.8)"} strokeWidth="1.5" />
              </svg>
            </div>
            <div className="leading-none">
              <span className={`block font-display font-bold text-[15px] sm:text-[17px] tracking-tight transition-colors duration-300 ${transparent ? "text-white" : "text-[#1b4332]"}`}>
                Saravana Caters
              </span>
              <span className={`hidden sm:block font-tamil text-[10px] transition-colors duration-300 ${transparent ? "text-[#c8a951]/80" : "text-[#c8a951]"}`}>
                சாரவண கேட்டர்ஸ்
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {LINKS.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative text-[11px] font-bold tracking-[0.12em] uppercase transition-colors duration-200 ${
                    transparent ? "text-white/80 hover:text-white" : "text-[#40493d] hover:text-[#0d631b]"
                  } ${active ? "text-[#c8a951]! after:absolute after:-bottom-1 after:left-0 after:w-full after:h-px after:bg-[#c8a951]" : ""}`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+919842722977"
              className={`text-[11px] font-bold tracking-wider transition-colors ${transparent ? "text-white/70 hover:text-white" : "text-[#40493d] hover:text-[#0d631b]"}`}
            >
              +91 98427 22977
            </a>
            <Link
              href="/contact"
              className="bg-[#0d631b] text-white text-[11px] font-bold tracking-[0.1em] uppercase px-5 py-2.5 rounded-full hover:bg-[#1b4332] transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Enquire Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(p => !p)}
            aria-label="Menu"
            className={`md:hidden p-2 rounded-lg ${transparent ? "text-white" : "text-[#1b4332]"}`}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#1b4332] flex flex-col pt-24 pb-10 px-8">
          <nav className="flex-1 space-y-1">
            {LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-4 border-b border-white/10 text-white font-display text-2xl font-bold"
              >
                {label}
                <span className="text-[#c8a951]">→</span>
              </Link>
            ))}
          </nav>
          <div className="space-y-3 pt-6">
            <a href="tel:+919842722977" className="block text-center text-white/70 text-sm font-medium">
              +91 98427 22977
            </a>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="block text-center bg-[#c8a951] text-[#1b1c17] py-3.5 rounded-full font-bold text-sm tracking-wide"
            >
              Send an Enquiry
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
