"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { label: "Projects Completed", value: 150, suffix: "+" },
  { label: "Years Experience",   value: 12,  suffix: "" },
  { label: "Square Meters Glazed", value: 500, suffix: "k+" },
  { label: "Safety Record",      value: 100, suffix: "%" },
];

// Animated counter that counts up when in view
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="expertise"
      ref={sectionRef}
      className="py-32 bg-background relative z-10 border-t border-outline-variant/10 overflow-hidden"
    >
      {/* Blueprint scanline sweep — plays once on section enter */}
      <motion.div
        className="pointer-events-none absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ top: 0, opacity: 0 }}
        animate={inView ? { top: ["0%", "100%"], opacity: [0, 0.6, 0] } : {}}
        transition={{ duration: 1.4, ease: "linear", delay: 0.1 }}
      />

      {/* Corner HUD bracket — top-right */}
      <div className="absolute top-6 right-6 pointer-events-none opacity-20">
        <svg width="40" height="40" fill="none">
          <line x1="40" y1="0" x2="18" y2="0"  stroke="white" strokeWidth="1.5"/>
          <line x1="40" y1="0" x2="40" y2="22" stroke="white" strokeWidth="1.5"/>
        </svg>
      </div>
      <div className="absolute bottom-6 left-6 pointer-events-none opacity-20">
        <svg width="40" height="40" fill="none">
          <line x1="0" y1="40" x2="22" y2="40" stroke="white" strokeWidth="1.5"/>
          <line x1="0" y1="40" x2="0"  y2="18" stroke="white" strokeWidth="1.5"/>
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-4 flex items-center gap-4">
              <div className="h-[1px] w-8 bg-tertiary" />
              <span className="font-geist text-xs font-semibold tracking-widest uppercase text-tertiary">
                Why Choose Us
              </span>
            </div>
            <h2 className="font-montserrat text-4xl md:text-5xl font-semibold tracking-tight text-on-surface mb-8">
              Precision at scale.
            </h2>
            <p className="font-inter text-on-surface-variant text-lg leading-relaxed mb-8">
              We bridge the gap between architectural vision and structural reality. Our dedicated engineering team ensures that every glass pane, composite panel, and structural element meets the highest standards of safety, performance, and aesthetic perfection.
            </p>
            <p className="font-inter text-on-surface-variant text-lg leading-relaxed">
              From conceptual design and 3D modeling to fabrication and rigorous on-site installation, we own the entire lifecycle of the facade.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-[1px] bg-outline-variant/20 p-[1px]">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative bg-surface p-8 sm:p-10 flex flex-col justify-center items-center text-center group hover:bg-surface-container-low transition-colors overflow-hidden"
              >
                {/* Glass glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(142,205,248,0.12) 0%, transparent 70%)" }}/>
                {/* Top edge highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"/>

                <div className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-bold text-on-surface mb-3 group-hover:text-tertiary transition-colors tabular-nums">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="font-geist text-[10px] sm:text-xs text-on-surface-variant uppercase tracking-widest">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
