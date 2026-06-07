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
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
