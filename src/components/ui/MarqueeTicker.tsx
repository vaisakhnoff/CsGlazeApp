"use client";

import React from "react";

const ITEMS = [
  "Structural Glazing",
  "ACP Cladding",
  "Spider Glazing",
  "Unitized Systems",
  "Curtain Wall",
  "Facade Engineering",
  "Glass Canopies",
  "Skylight Systems",
];

export function MarqueeTicker() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="relative overflow-hidden bg-primary border-t border-b border-white/[0.06] py-4 select-none">
      {/* Fade edges — spatial gradient */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-primary via-primary/80 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-primary via-primary/80 to-transparent pointer-events-none" />

      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-6 mx-6">
            <span className="font-heading font-semibold text-sm uppercase tracking-widest text-white/60">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_rgba(252,163,17,0.4)] flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}
