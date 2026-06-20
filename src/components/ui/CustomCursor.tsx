"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isMounted, setIsMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Position
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring physics for smooth following
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    setIsMounted(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Detect hover on interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = !!target.closest(
        'a, button, input, textarea, select, [role="button"], .interactive-click'
      );
      setIsHovering(isInteractive);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseout", handleMouseLeave);
    window.addEventListener("mouseover", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseout", handleMouseLeave);
      window.removeEventListener("mouseover", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  // Don't render on SSR or on touch devices
  if (!isMounted || (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches)) {
    return null;
  }

  // Base size of the custom cursor dot
  const size = 16;

  // Hide the custom cursor completely when hovering an interactive element
  // or when the mouse leaves the window
  const currentOpacity = isHovering ? 0 : (isVisible ? 1 : 0);

  return (
    <>
      {/* Hide default cursor on body, but restore native cursors for interactive elements */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (pointer: fine) {
          body {
            cursor: none;
          }
          a, button, [role="button"], .interactive-click {
            cursor: pointer !important;
          }
          input, select, textarea {
            cursor: text !important;
          }
        }
      `}} />

      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{
          x: smoothX,
          y: smoothY,
          opacity: currentOpacity,
        }}
      >
        <motion.div
          animate={{
            width: size,
            height: size,
            x: -size / 2,
            y: -size / 2,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="rounded-full bg-white flex items-center justify-center"
        />
      </motion.div>
    </>
  );
}
