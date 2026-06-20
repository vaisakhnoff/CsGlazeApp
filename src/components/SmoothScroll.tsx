"use client";

import { ReactLenis } from "lenis/react";
import { useEffect } from "react";
import React from "react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Always start at the very top on every page load
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  return (
    <ReactLenis root options={{ 
      lerp: 0.08, 
      duration: 1.2, 
      smoothWheel: true, 
      wheelMultiplier: 1.1, 
      touchMultiplier: 2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    }}>
      {children}
    </ReactLenis>
  );
}
