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
  (
    {
      className,
      children,
      tiltOnHover = false,
      glowColor = "rgba(252, 163, 17, 0.1)",
      ...props
    },
    ref
  ) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [2, -2]), {
      stiffness: 400,
      damping: 30,
    });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-2, 2]), {
      stiffness: 400,
      damping: 30,
    });
    const sheenX = useTransform(mouseX, [-0.5, 0.5], ["-30%", "130%"]);
    const sheenY = useTransform(mouseY, [-0.5, 0.5], ["-30%", "130%"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!tiltOnHover) return;
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
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
        style={
          tiltOnHover ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined
        }
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className={cn(
          "relative overflow-hidden rounded-xl",
          "bg-white",
          "border border-border",
          "shadow-[0_4px_12px_rgba(0,0,0,0.05)]",
          "hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]",
          "transition-shadow duration-300",
          className
        )}
        {...props}
      >
        {/* Sheen layer on hover */}
        {tiltOnHover && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${sheenX} ${sheenY}, ${glowColor} 0%, transparent 70%)`,
            }}
          />
        )}

        <div className="relative z-[1]">{children}</div>
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
