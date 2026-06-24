"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ClipReveal } from "@/components/ui/ClipReveal";

const stats = [
  { label: "Projects Completed", value: 150, suffix: "+" },
  { label: "Years Experience", value: 12, suffix: "+" },
  { label: "Square Meters", value: 500, suffix: "k+" },
  { label: "Safety Record", value: 100, suffix: "%" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const step = 16;
    const inc = target / (duration / step);
    const id = setInterval(() => {
      start += inc;
      if (start >= target) { setCount(target); clearInterval(id); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(id);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export const Expertise = () => {
  return (
    <section id="expertise" className="section-spacing relative overflow-hidden" style={{ background: "#f5f6f9" }}>
      {/* Top line */}
      <div className="line-h absolute top-0 left-0 right-0 opacity-25" />

      {/* Spatial background depth layers */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-accent opacity-[0.04] rounded-full blur-3xl pointer-events-none animate-glow-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary opacity-[0.04] rounded-full blur-3xl pointer-events-none animate-glow-pulse" style={{ animationDelay: "-2s" }} />

      {/* Floating decorative shapes */}
      <div className="absolute top-[15%] right-[15%] w-20 h-20 rounded-2xl bg-accent/[0.04] rotate-12 blur-sm pointer-events-none hidden lg:block animate-spatial-float-slow" />
      <div className="absolute bottom-[20%] left-[8%] w-14 h-14 rounded-full bg-primary/[0.03] blur-sm pointer-events-none hidden lg:block animate-spatial-float" style={{ animationDelay: "-4s" }} />

      <div className="container-premium relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="line-accent animated" />
              <span className="font-mono text-xs font-semibold text-accent uppercase tracking-widest">
                Why Choose Us
              </span>
            </div>

            <ClipReveal>
              <h2
                className="font-heading font-bold text-primary leading-tight mb-5"
                style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
              >
                Precision engineering at scale
              </h2>
            </ClipReveal>

            {/* Animated line under heading */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "left" }}
              className="h-px bg-gradient-to-r from-accent via-accent/30 to-transparent mb-6 w-3/4"
            />

            <p className="text-base lg:text-lg text-text-secondary leading-relaxed mb-4 max-w-[560px]">
              We bridge the gap between architectural vision and structural reality. Our dedicated
              engineering team ensures every glass pane, composite panel, and structural element
              meets the highest international standards.
            </p>
            <p className="text-base lg:text-lg text-text-secondary leading-relaxed max-w-[560px]">
              From conceptual design and 3D modeling to fabrication and rigorous on-site
              installation, we own the entire lifecycle of the facade.
            </p>
          </motion.div>

          {/* Right: Stats Grid — responsive spacing */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="card-spatial p-5 sm:p-6 lg:p-8 text-center group relative overflow-hidden active:scale-[0.97] transition-transform duration-200"
              >
                {/* Subtle top glow on hover */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-accent/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Corner accent */}
                <div className="line-corner-tl" />

                <div
                  className="font-heading font-bold text-gradient-accent mb-1 sm:mb-2 tabular-nums relative z-10"
                  style={{ fontSize: "clamp(28px, 6vw, 48px)" }}
                >
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs sm:text-sm text-text-secondary font-medium relative z-10">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="line-h absolute bottom-0 left-0 right-0 opacity-20" />
    </section>
  );
};
