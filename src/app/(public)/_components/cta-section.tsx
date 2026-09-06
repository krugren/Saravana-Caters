"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";


export default function CtaSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section ref={ref} className="py-10 sm:py-14 md:py-16 px-4 sm:px-6">
      <div className="max-w-[1240px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] bg-[#fbf9f1] border border-[#e4e3db]"
          style={{ boxShadow: "0 24px 80px rgba(13,99,27,0.07), 0 4px 24px rgba(13,99,27,0.04)" }}
        >


          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Left: Text */}
            <div className="px-6 py-10 sm:px-8 sm:py-12 md:px-12 md:py-14">
              <p className="font-tamil text-[#c8a951] text-xs sm:text-sm mb-3">உங்கள் நிகழ்வை சிறப்பாக்குவோம்</p>
              <h2 className="font-display font-bold text-[#1b1c17] leading-tight mb-4"
                style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}>
                Planning an Event?{" "}
                <span className="text-[#0d631b]">Let&rsquo;s Talk.</span>
              </h2>
              <p className="text-[#40493d] text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed mb-6 max-w-sm">
                Tell us about your event. We&rsquo;ll send back a personalised menu and quote — 
                usually within 2 hours. No obligation.
              </p>
              <p className="text-[11px] sm:text-[12px] text-[#707a6c]">
                Mon – Sun, 8 AM – 8 PM &nbsp;·&nbsp; Book at least 2 weeks ahead for weekend dates.
              </p>
            </div>

            {/* Right: Actions */}
            <div className="px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 border-t md:border-t-0 md:border-l border-[#e4e3db] space-y-3">
              <Link href="/contact"
                className="flex items-center justify-between w-full bg-[#0d631b] text-white px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl font-bold text-[13px] sm:text-[14px] hover:bg-[#1b4332] transition-colors duration-200 group shadow-md">
                <span>Send an Enquiry</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a href="tel:+919842722977"
                className="flex items-center justify-between w-full border-2 border-[#0d631b]/20 text-[#0d631b] px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl font-bold text-[13px] sm:text-[14px] hover:border-[#0d631b]/50 hover:bg-[#0d631b]/4 transition-all duration-200">
                <span>+91 98427 22977</span>
                <Phone className="w-4 h-4" />
              </a>

              <a href="https://wa.me/919842722977?text=Hi%2C+I%27d+like+to+enquire+about+catering."
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between w-full border-2 border-[#25d366]/25 text-[#25d366] px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl font-bold text-[13px] sm:text-[14px] hover:border-[#25d366]/50 hover:bg-[#25d366]/4 transition-all duration-200">
                <span>WhatsApp Us</span>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884z"/>
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
