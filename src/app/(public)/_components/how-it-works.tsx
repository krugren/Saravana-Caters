"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";


const STEPS = [
  {
    number: "01",
    title: "You reach out",
    copy: "Call, WhatsApp, or fill the form. Tell us your date, guest count, and the type of function. Takes 2 minutes.",
    detail: "Phone · WhatsApp · Contact Form",
  },
  {
    number: "02",
    title: "We visit and plan",
    copy: "One of our team members visits the venue. We understand your preferences, dietary needs, and event flow.",
    detail: "Free consultation · No obligation",
  },
  {
    number: "03",
    title: "You approve the menu",
    copy: "We send a detailed quotation with the full menu, staff plan, and serving schedule. You approve or refine.",
    detail: "Transparent pricing · No hidden costs",
  },
  {
    number: "04",
    title: "We cook, you celebrate",
    copy: "Our team arrives, sets up, cooks fresh on-site, serves on time, and cleans up. You focus on your guests.",
    detail: "Full setup · Service · Cleanup",
  },
];

export default function HowItWorks() {
  return (
    <section
      className="relative overflow-hidden bg-[#f9f5ed] section-watermark"
      aria-label="How our catering process works"
    >


      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24">

        {/* Section header — Kuuraii editorial split */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14 md:mb-16">
          <div>
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#c8a951] mb-2">
              THE PROCESS
            </p>
            <h2
              className="font-display font-bold text-[#1b2e22] leading-tight"
              style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)" }}
            >
              From your first call<br />
              <span className="italic">to a full table.</span>
            </h2>
          </div>
          <p className="text-[#40493d] text-[13px] md:text-[14px] leading-relaxed md:max-w-xs md:text-right">
            Four simple steps. No guesswork. No surprises on the day. Just a
            feast your guests will remember.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                delay: i * 0.12,
                duration: 0.65,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="relative"
            >
              {/* Connector line (desktop only — between steps) */}
              {i < STEPS.length - 1 && (
                <div
                  className="hidden lg:block absolute top-6 left-[calc(100%+0.5rem)] right-0 w-[calc(100%-1rem)] h-px bg-[#1b4332]/12"
                  style={{ left: "calc(100% + 0.75rem)", width: "calc(100% - 0.75rem)" }}
                />
              )}

              {/* Step card */}
              <div className="h-full bg-[#ede8db] rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300">

                {/* Number badge */}
                <div className="flex items-center gap-3">
                  <span
                    className="font-display font-bold text-[#c8a951] leading-none"
                    style={{ fontSize: "clamp(2.2rem, 3vw, 2.8rem)" }}
                  >
                    {step.number}
                  </span>
                  <div className="flex-1 h-px bg-[#1b4332]/12" />
                </div>

                {/* Title */}
                <h3 className="font-bold text-[#1b2e22] text-[15px] leading-snug">
                  {step.title}
                </h3>

                {/* Copy */}
                <p className="text-[#40493d] text-[13px] leading-relaxed flex-1">
                  {step.copy}
                </p>

                {/* Detail tag */}
                <p className="text-[11px] text-[#707a6c] font-medium tracking-wide">
                  {step.detail}
                </p>

              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA below steps */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4 justify-center"
        >
          <p className="text-[#40493d] text-[14px]">
            Ready to start? Takes less than 2 minutes.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#0d631b] text-white px-6 py-3 rounded-full font-bold text-[13px] tracking-wide hover:bg-[#1b4332] transition-colors duration-200 group"
          >
            Get a Quote
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
