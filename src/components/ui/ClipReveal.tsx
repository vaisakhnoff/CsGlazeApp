"use client";

import React, { useRef, useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Reveals its children with a clip-path wipe-up animation when scrolled into view.
 * Inspired by Vercel / Linear heading reveals.
 */
export function ClipReveal({ children, className = "", delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Apply delay before revealing
          if (delay > 0) {
            setTimeout(() => setInView(true), delay);
          } else {
            setInView(true);
          }
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`reveal-clip ${inView ? "in-view" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
