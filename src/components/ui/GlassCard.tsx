"use client";

import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import React, { useRef, type ReactNode } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  tiltOnHover?: boolean;
  glowColor?: string;
  children?: ReactNode;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, tiltOnHover = true, glowColor = "rgba(0,0,0,0.08)", ...props }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 400, damping: 30 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 400, damping: 30 });
    const sheenX = useTransform(mouseX, [-0.5, 0.5], ["-30%", "130%"]);
    const sheenY = useTransform(mouseY, [-0.5, 0.5], ["-30%", "130%"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!tiltOnHover) return;
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    return (
      <motion.div
        ref={(node) => {
          (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        style={tiltOnHover ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className={cn(
          // Core glass layers
          "relative overflow-hidden",
          "bg-gradient-to-br from-white via-white to-surface-container-low",
          "backdrop-blur-xl",
          // Multi-layered border
          "border border-black/10",
          "shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(0,0,0,0.06)]",
          "rounded-xl",
          className
        )}
        {...props}
      >
        {/* Sheen / specular highlight layer */}
        {tiltOnHover && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${sheenX} ${sheenY}, rgba(0,0,0,0.06) 0%, transparent 70%)`,
            }}
          />
        )}
        {/* Top edge inner highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />
        {/* Glow behind on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500"
          whileHover={{ opacity: 1 }}
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${glowColor} 0%, transparent 70%)`,
          }}
        />
        <div className="relative z-[1]">{children}</div>
      </motion.div>
    );
  }
);
GlassCard.displayName = "GlassCard";
