"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Phone, MessageCircle } from "lucide-react";

interface HeroProps {
  heading?: string;
  subheading?: string;
  phone?: string;
  whatsapp?: string;
}

const heroStats = [
  { value: "150+", label: "Projects" },
  { value: "12+", label: "Years" },
  { value: "500k+", label: "Sq. Meters" },
  { value: "100%", label: "Safety" },
];

export const Hero = ({ heading, subheading, phone, whatsapp }: HeroProps) => {
  const features = [
    "Structural Glazing",
    "ACP Cladding",
    "Spider Glazing",
    "Unitized Systems",
    "150+ Completed Projects",
    "Trusted Industry Partner",
  ];

  const normalPhone    = phone?.replace(/\s+/g, "") || null;
  const normalWhatsapp = whatsapp?.replace(/\s+/g, "") || phone?.replace(/\s+/g, "") || null;

  const displayHeading    = heading    || "Engineering Modern";
  const displaySubheading = subheading || "Transform your architectural vision into reality with premium facade solutions for commercial and residential projects.";

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-[120px] lg:pt-32 pb-12" style={{ background: "linear-gradient(180deg, #f3f4f7 0%, #eceef2 100%)" }}>
      {/* ── Spatial layered background ── */}
      <div className="absolute inset-0 gradient-mesh-animated pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full opacity-[0.07] animate-glow-pulse"
          style={{ background: "radial-gradient(circle, #fca311 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.05] animate-glow-pulse"
          style={{ background: "radial-gradient(circle, #14213d 0%, transparent 70%)", animationDelay: "-2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #fca311 0%, transparent 70%)" }} />
      </div>

      {/* Spatial floating orbs — decorative depth layers */}
      <div className="absolute top-[20%] right-[10%] w-24 h-24 rounded-full bg-accent/5 blur-xl animate-spatial-float-slow pointer-events-none hidden lg:block" />
      <div className="absolute bottom-[30%] left-[5%] w-16 h-16 rounded-full bg-primary/5 blur-lg animate-spatial-float pointer-events-none hidden lg:block" style={{ animationDelay: "-3s" }} />

      {/* Animated vertical line – left structural accent */}
      <div className="absolute left-0 top-0 bottom-0 w-px hidden lg:block">
        <div className="line-v h-full opacity-30" />
      </div>

      <div className="container-premium relative z-10 w-full">
        <div className="grid lg:grid-cols-[50%_50%] gap-12 lg:gap-16 items-center">

          {/* ── LEFT: Content ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex items-center gap-3 mb-5"
            >
              <span className="line-accent animated" />
              <span className="font-mono text-xs font-semibold text-accent uppercase tracking-widest">
                Premium Architectural Solutions
              </span>
            </motion.div>

            {/* H1 */}
            <h1 className="font-heading font-bold text-primary leading-[1.08] tracking-tight mb-5"
              style={{ fontSize: "clamp(40px, 5.5vw, 72px)" }}>
              {displayHeading}{" "}
              <span className="text-gradient-accent">Facades</span>
            </h1>

            {/* Animated horizontal line under title */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "left" }}
              className="h-px bg-gradient-to-r from-accent via-accent/40 to-transparent mb-6 w-2/3"
            />

            {/* Description */}
            <p className="text-lg lg:text-xl text-text-secondary leading-relaxed mb-7 max-w-[560px]">
              {displaySubheading}
            </p>

            {/* Features – spatial floating chips */}
            <div className="grid grid-cols-2 gap-x-5 gap-y-2.5 mb-8 max-w-[520px]">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.35 + i * 0.07 }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-white/70 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]"
                >
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-success-light flex-shrink-0 shadow-sm">
                    <Check size={11} className="text-success" />
                  </div>
                  <span className="text-[13px] font-medium text-primary">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTAs — spatial elevated buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 w-full"
            >
              {normalPhone && (
                <a
                  href={`tel:${normalPhone}`}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-heading font-semibold text-[15px] text-accent bg-white border-2 border-accent/20 rounded-xl hover:bg-accent hover:text-white hover:border-accent hover:shadow-[0_8px_24px_rgba(252,163,17,0.25)] transition-all duration-300 w-full sm:w-auto shadow-[0_2px_6px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.03)]"
                >
                  <Phone size={17} />
                  Call Now
                </a>
              )}
              {normalWhatsapp && (
                <a
                  href={`https://wa.me/${normalWhatsapp.replace(/\+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-heading font-semibold text-[15px] text-green-600 bg-white border-2 border-green-200 rounded-xl hover:bg-green-500 hover:text-white hover:border-green-500 hover:shadow-[0_8px_24px_rgba(34,197,94,0.25)] transition-all duration-300 w-full sm:w-auto shadow-[0_2px_6px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.03)]"
                >
                  <MessageCircle size={17} />
                  WhatsApp Us
                </a>
              )}
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-heading font-semibold text-[15px] text-primary bg-white border-2 border-primary/12 rounded-xl hover:bg-primary hover:text-white hover:border-primary hover:shadow-[0_8px_24px_rgba(20,33,61,0.2)] transition-all duration-300 w-full sm:w-auto shadow-[0_2px_6px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.03)]"
              >
                <ArrowRight size={17} />
                View Projects
              </a>
            </motion.div>

            {/* ── Stats Strip — floating glass surface ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="mt-10 flex items-center gap-0 max-w-[540px] p-5 rounded-2xl bg-white/75 backdrop-blur-md border border-white/60 shadow-[0_2px_6px_rgba(0,0,0,0.03),0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]"
            >
              {heroStats.map((stat, i) => (
                <div key={stat.label} className="flex items-center">
                  {i > 0 && (
                    <div className="w-px h-8 bg-border/60 mx-4 lg:mx-5 flex-shrink-0" />
                  )}
                  <div className="text-center min-w-0">
                    <div className="font-heading font-bold text-primary text-lg lg:text-xl tabular-nums">
                      {stat.value}
                    </div>
                    <div className="text-[11px] text-text-tertiary font-medium uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Visual — spatial floating ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center w-full"
          >
            {/* Ambient glow behind video */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[80%] h-[80%] rounded-full bg-accent/5 blur-3xl animate-glow-pulse" />
            </div>
            <video
              src="/cs-glaze-logo-Picsart-BackgroundRemover.webm"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto max-w-[600px] lg:max-w-none object-contain opacity-90 mix-blend-multiply scale-110 md:scale-125 lg:scale-[1.35] transition-transform duration-700"
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom section transition line */}
      <div className="absolute bottom-0 left-0 right-0 line-h h-px opacity-40" />
    </section>
  );
};
