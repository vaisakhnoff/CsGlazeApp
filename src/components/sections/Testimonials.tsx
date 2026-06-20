"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { ClipReveal } from "@/components/ui/ClipReveal";

type Testimonial = {
  id: string;
  client: string;
  company: string | null;
  text: string;
};

interface Props {
  testimonials: Testimonial[];
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Testimonials({ testimonials }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (testimonials.length === 0) return null;

  const active = testimonials[activeIdx];
  const prev = () => setActiveIdx((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setActiveIdx((i) => (i + 1) % testimonials.length);

  return (
    <section id="testimonials" className="section-spacing bg-primary relative overflow-hidden">
      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent opacity-[0.06] rounded-full blur-3xl pointer-events-none" />

      <div className="container-premium relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="line-accent animated" />
            <span className="font-mono text-xs font-semibold text-accent uppercase tracking-widest">
              What Clients Say
            </span>
            <span className="line-accent animated" />
          </div>
          <ClipReveal>
            <h2
              className="font-heading font-bold text-white leading-tight"
              style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
            >
              Trusted by Industry Leaders
            </h2>
          </ClipReveal>
        </motion.div>

        {/* Featured Testimonial (carousel) — shown when ≥1 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <div className="relative card-premium bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl text-center">
            {/* Large quote icon */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Quote size={22} className="text-accent" />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <blockquote className="text-white/85 text-lg md:text-xl leading-relaxed mb-8 italic font-light">
                  &ldquo;{active.text}&rdquo;
                </blockquote>

                <div className="flex flex-col items-center gap-1">
                  <span className="font-heading font-semibold text-white text-base">
                    {active.client}
                  </span>
                  {active.company && (
                    <span className="text-white/50 text-sm">{active.company}</span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows — only show if multiple */}
            {testimonials.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={prev}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-all"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Dots */}
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === activeIdx ? "bg-accent w-6" : "bg-white/30 w-1.5"
                      }`}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={next}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-all"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Grid of remaining cards — only show if >1 */}
        {testimonials.length > 1 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {testimonials.slice(0, 3).map((t, i) => (
              <motion.div
                key={t.id}
                variants={cardVariants}
                onClick={() => setActiveIdx(i)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                  i === activeIdx
                    ? "border-accent/40 bg-accent/10"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                }`}
              >
                <p className="text-white/70 text-sm leading-relaxed italic line-clamp-3 mb-4">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <span className="font-semibold text-white text-sm">{t.client}</span>
                  {t.company && (
                    <span className="text-white/40 text-xs ml-2">{t.company}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
