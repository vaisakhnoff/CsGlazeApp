"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BlueprintAnimation } from "@/components/BuildingAnimation";

export const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const svgY    = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const opacity  = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-white"
      aria-label="Hero"
    >
      {/* Full-screen blueprint animation canvas */}
      <motion.div style={{ y: svgY, opacity }} className="absolute inset-0 z-0">
        <BlueprintAnimation />
      </motion.div>

      {/* Vignette */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.66) 45%, transparent 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-40 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, #fff 0%, transparent 100%)" }}
      />

      {/* ── HERO CONTENT — visible immediately ── */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-20 h-screen flex flex-col justify-center px-6 sm:px-10 lg:px-20 max-w-[700px]"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-10 h-[1px] bg-black/60" />
          <span className="font-geist text-[10px] font-semibold tracking-[0.25em] uppercase text-black/55">
            Foundation to Landmark
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="font-montserrat font-bold text-black leading-[1.05] tracking-[-0.025em] mb-5"
          style={{ fontSize: "clamp(36px, 5.5vw, 72px)" }}
        >
          Engineering Modern<br />Facades
        </motion.h1>

        {/* Sub-heading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="font-inter text-black/60 leading-relaxed mb-10 max-w-[520px]"
          style={{ fontSize: "clamp(15px, 1.4vw, 18px)" }}
        >
          Premium ACP Cladding, Structural Glazing, Glass Roofing, Glass Canopies and Architectural Glass Solutions.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease: "easeOut" }}
          className="flex items-center gap-8 mb-12"
        >
          {[
            { value: "12+", label: "Years Exp." },
            { value: "150+", label: "Projects" },
            { value: "100%", label: "Satisfaction" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="font-montserrat font-bold text-black text-2xl sm:text-3xl leading-none">
                {value}
              </span>
              <span className="font-geist text-[10px] uppercase tracking-[0.18em] text-black/45">
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <a
            href="#projects"
            className="inline-flex items-center justify-center px-7 py-3 bg-primary text-on-primary font-montserrat font-semibold text-sm tracking-wide shadow-[0_18px_44px_rgba(0,0,0,0.16)] hover:bg-primary-container transition-colors"
          >
            View Projects
          </a>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-7 py-3 border border-black/25 text-black font-montserrat font-semibold text-sm tracking-wide hover:border-black/60 hover:bg-black/5 transition-colors"
          >
            WhatsApp Us
          </a>
          <a
            href="tel:"
            className="inline-flex items-center justify-center px-7 py-3 text-black/55 font-montserrat font-semibold text-sm tracking-wide hover:text-black transition-colors"
          >
            Call Now
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-10 left-6 sm:left-10 lg:left-20 z-20 flex items-center gap-3"
      >
        <div className="relative h-14 w-[1px] bg-black/15 overflow-hidden">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-black/70"
          />
        </div>
        <span className="font-geist text-[9px] tracking-[0.22em] text-black/45 uppercase">
          Scroll
        </span>
      </motion.div>
    </section>
  );
};
