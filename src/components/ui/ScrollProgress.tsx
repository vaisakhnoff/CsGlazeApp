"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const scaleX = useSpring(0, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handler = () => {
      const scrollH = document.documentElement.scrollHeight - window.innerHeight;
      const p = scrollH > 0 ? window.scrollY / scrollH : 0;
      setProgress(p);
      scaleX.set(p);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [scaleX]);

  if (progress < 0.01) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #fca311 0%, #ffb938 50%, #fca311 100%)",
        boxShadow: "0 0 12px rgba(252, 163, 17, 0.4), 0 0 4px rgba(252, 163, 17, 0.6)",
      }}
    />
  );
}
