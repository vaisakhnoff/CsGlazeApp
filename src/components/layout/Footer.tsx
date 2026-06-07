"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/20 pt-20 pb-10 relative overflow-hidden">
      {/* Top edge blueprint glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent pointer-events-none"/>
      <div className="absolute inset-x-0 top-0 h-8 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, transparent 100%)" }}/>

      {/* HUD corner — top-right */}
      <div className="absolute top-6 right-6 pointer-events-none opacity-15">
        <svg width="36" height="36" fill="none">
          <line x1="36" y1="0" x2="14" y2="0"  stroke="black" strokeWidth="1.5"/>
          <line x1="36" y1="0" x2="36" y2="22" stroke="black" strokeWidth="1.5"/>
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <motion.div
          className="col-span-1 md:col-span-2"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/" className="inline-block mb-6">
            <span className="font-montserrat font-bold text-3xl tracking-tighter text-on-surface">
              CS GLAZE
            </span>
          </Link>
          <p className="text-on-surface-variant max-w-md font-inter text-sm leading-relaxed mb-6">
            Engineered perfection in structural glazing and premium facade systems.
            We deliver state-of-the-art architectural solutions for high-end
            commercial and residential projects.
          </p>
        </motion.div>

        {/* Services links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h4 className="font-geist font-semibold text-xs tracking-widest uppercase text-on-surface mb-6">Services</h4>
          <ul className="flex flex-col gap-4">
            {["Façades", "ACP Cladding", "Unitized Systems", "Spider Glazing"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-on-surface-variant hover:text-tertiary transition-colors text-sm font-inter">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Company links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.18 }}
        >
          <h4 className="font-geist font-semibold text-xs tracking-widest uppercase text-on-surface mb-6">Company</h4>
          <ul className="flex flex-col gap-4">
            {["Structural Glazing", "Sustainability", "Contact", "Careers"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-on-surface-variant hover:text-tertiary transition-colors text-sm font-inter">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tiny camera-style coord label */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-[9px] text-black/25 tracking-wider hidden sm:inline">
            DRG-2025-CSG-FACADE
          </span>
          <p className="text-on-surface-variant/60 font-geist text-xs">
            © {new Date().getFullYear()} CS GLAZE ARCHITECTURAL SYSTEMS. ALL RIGHTS RESERVED.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <Link href="#" className="text-on-surface-variant/60 hover:text-on-surface text-xs font-geist">PRIVACY POLICY</Link>
          <Link href="#" className="text-on-surface-variant/60 hover:text-on-surface text-xs font-geist">TERMS OF SERVICE</Link>
        </div>
      </div>
    </footer>
  );
};
