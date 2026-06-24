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

export const Hero = ({ heading, subheading, phone, whatsapp }: HeroProps) => {
  const features = [
    "Structural Glazing",
    "ACP Cladding",
    "Spider Glazing",
    "Unitized Systems",
    "150+ Projects",
    "Trusted Partner",
  ];

  const normalPhone    = phone?.replace(/\s+/g, "") || null;
  const normalWhatsapp = whatsapp?.replace(/\s+/g, "") || phone?.replace(/\s+/g, "") || null;

  const displayHeading    = heading    || "Engineering Modern";
  const displaySubheading = subheading || "Transform your architectural vision into reality with premium facade solutions for commercial and residential projects.";

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden pt-24 sm:pt-[120px] lg:pt-32 pb-8 sm:pb-12" style={{ background: "linear-gradient(180deg, #f3f4f7 0%, #eceef2 100%)" }}>
      {/* Spatial layered background */}
      <div className="absolute inset-0 gradient-mesh-animated pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] rounded-full opacity-[0.07] animate-glow-pulse"
          style={{ background: "radial-gradient(circle, #fca311 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 -left-40 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full opacity-[0.05] animate-glow-pulse"
          style={{ background: "radial-gradient(circle, #14213d 0%, transparent 70%)", animationDelay: "-2s" }} />
      </div>

      {/* Floating orbs — desktop only */}
      <div className="absolute top-[20%] right-[10%] w-24 h-24 rounded-full bg-accent/5 blur-xl animate-spatial-float-slow pointer-events-none hidden lg:block" />
      <div className="absolute bottom-[30%] left-[5%] w-16 h-16 rounded-full bg-primary/5 blur-lg animate-spatial-float pointer-events-none hidden lg:block" style={{ animationDelay: "-3s" }} />

      {/* Vertical line — desktop only */}
      <div className="absolute left-0 top-0 bottom-0 w-px hidden lg:block">
        <div className="line-v h-full opacity-30" />
      </div>

      <div className="container-premium relative z-10 w-full">
        <div className="grid lg:grid-cols-[50%_50%] gap-8 lg:gap-16 items-center">

          {/* LEFT: Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-2.5 mb-4"
            >
              <span className="line-accent animated" />
              <span className="font-mono text-[10px] sm:text-xs font-semibold text-accent uppercase tracking-widest">
                Premium Architectural Solutions
              </span>
            </motion.div>

            {/* H1 — mobile-optimized sizing */}
            <h1 className="font-heading font-bold text-primary leading-[1.08] tracking-tight mb-4"
              style={{ fontSize: "clamp(32px, 7vw, 72px)" }}>
              {displayHeading}{" "}
              <span className="text-gradient-accent">Facades</span>
            </h1>

            {/* Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "left" }}
              className="h-px bg-gradient-to-r from-accent via-accent/40 to-transparent mb-5 w-2/3"
            />

            {/* Description — responsive text */}
            <p className="text-base sm:text-lg lg:text-xl text-text-secondary leading-relaxed mb-6 max-w-[560px]">
              {displaySubheading}
            </p>

            {/* Features — mobile: smaller gaps, smaller chips */}
            <div className="grid grid-cols-2 gap-2 sm:gap-x-4 sm:gap-y-2.5 mb-7 max-w-[520px]">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                  className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-sm border border-white/70 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]"
                >
                  <div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-success-light flex-shrink-0">
                    <Check size={9} className="text-success sm:hidden" />
                    <Check size={11} className="text-success hidden sm:block" />
                  </div>
                  <span className="text-[11px] sm:text-[13px] font-medium text-primary leading-tight">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTAs — full width on mobile, proper touch targets */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 w-full"
            >
              {normalPhone && (
                <a
                  href={`tel:${normalPhone}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-7 font-heading font-semibold text-[14px] sm:text-[15px] text-accent bg-white border-2 border-accent/20 rounded-xl active:scale-[0.97] hover:bg-accent hover:text-white hover:border-accent transition-all duration-200 w-full sm:w-auto shadow-[0_2px_6px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.03)]"
                >
                  <Phone size={16} />
                  Call Now
                </a>
              )}
              {normalWhatsapp && (
                <a
                  href={`https://wa.me/${normalWhatsapp.replace(/\+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-7 font-heading font-semibold text-[14px] sm:text-[15px] text-green-600 bg-white border-2 border-green-200 rounded-xl active:scale-[0.97] hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200 w-full sm:w-auto shadow-[0_2px_6px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.03)]"
                >
                  <MessageCircle size={16} />
                  WhatsApp Us
                </a>
              )}
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-7 font-heading font-semibold text-[14px] sm:text-[15px] text-primary bg-white border-2 border-primary/12 rounded-xl active:scale-[0.97] hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 w-full sm:w-auto shadow-[0_2px_6px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.03)]"
              >
                <ArrowRight size={16} />
                View Projects
              </a>
            </motion.div>

          </motion.div>

          {/* RIGHT: Visual — hidden on very small screens, smaller on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center w-full"
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[80%] h-[80%] rounded-full bg-accent/5 blur-3xl animate-glow-pulse" />
            </div>
            <video
              src="/cs-glaze-logo-Picsart-BackgroundRemover.webm"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto max-w-[400px] md:max-w-[600px] lg:max-w-none object-contain opacity-90 mix-blend-multiply scale-100 md:scale-110 lg:scale-[1.35] transition-transform duration-700"
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom transition line */}
      <div className="absolute bottom-0 left-0 right-0 line-h h-px opacity-40" />
    </section>
  );
};
