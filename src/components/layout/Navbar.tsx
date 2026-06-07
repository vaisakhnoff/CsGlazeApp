"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-surface/80 backdrop-blur-md border-b border-outline-variant/30" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 z-50">
          <span className="font-montserrat font-bold text-2xl tracking-tighter text-on-surface">
            CS GLAZE
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center h-full">
          <ul className="flex items-center h-full">
            {[
              { name: "Services", href: "#services" },
              { name: "Projects", href: "#projects" },
              { name: "Expertise", href: "#expertise" },
              { name: "Company", href: "#company" },
            ].map((link, index) => (
              <li key={link.name} className="h-full flex items-center">
                <Link
                  href={link.href}
                  className="px-6 h-full flex items-center text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {link.name}
                </Link>
                {/* Structural Line separator */}
                {index < 3 && (
                  <div className="w-[1px] h-8 bg-outline-variant/30" />
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:flex items-center">
          <Button asChild variant="primary">
            <Link href="#contact">Get Quote</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden z-50 text-on-surface"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="md:hidden fixed inset-0 top-0 bg-surface/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center pt-20 overflow-hidden"
        >
          {/* top edge glow */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent pointer-events-none"/>
          {/* HUD corner brackets */}
          <div className="absolute top-6 left-6 pointer-events-none opacity-20">
            <svg width="32" height="32" fill="none">
              <line x1="0" y1="0" x2="20" y2="0"  stroke="black" strokeWidth="1.5"/>
              <line x1="0" y1="0" x2="0"  y2="20" stroke="black" strokeWidth="1.5"/>
            </svg>
          </div>
          <div className="absolute bottom-6 right-6 pointer-events-none opacity-20">
            <svg width="32" height="32" fill="none">
              <line x1="32" y1="32" x2="12" y2="32" stroke="black" strokeWidth="1.5"/>
              <line x1="32" y1="32" x2="32" y2="12" stroke="black" strokeWidth="1.5"/>
            </svg>
          </div>

          <nav className="flex flex-col items-center gap-8 w-full">
            {[
              { name: "Services", href: "#services" },
              { name: "Projects", href: "#projects" },
              { name: "Expertise", href: "#expertise" },
              { name: "Company", href: "#company" },
            ].map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 + i * 0.06 }}
              >
                <Link
                  href={link.href}
                  className="text-2xl font-montserrat font-semibold text-on-surface"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            <Button asChild variant="primary" className="mt-8">
              <Link href="#contact" onClick={() => setMobileMenuOpen(false)}>Get Quote</Link>
            </Button>
          </nav>

          {/* blueprint coord label bottom */}
          <span className="absolute bottom-4 font-mono text-[9px] text-black/20 tracking-widest">
            CS GLAZE  NAV v1.0
          </span>
        </motion.div>
      )}
    </header>
  );
};
