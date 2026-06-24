"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer — highlight the nav link for the section in view
  useEffect(() => {
    const sectionIds = ["services", "projects", "expertise", "contact"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        {
          rootMargin: "-40% 0px -55% 0px",
          threshold: 0,
        }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const navLinks = [
    { name: "Services", href: "#services", id: "services" },
    { name: "Projects", href: "#projects", id: "projects" },
    { name: "Expertise", href: "#expertise", id: "expertise" },
    { name: "Contact", href: "#contact", id: "contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "py-1.5 sm:py-2 md:py-3"
          : "py-2 sm:py-3 md:py-4"
      }`}
    >
      {/* Spatial floating navbar container */}
      <div className={`container-premium transition-all duration-500 ${isScrolled ? "px-3 sm:px-4 md:px-8" : ""}`}>
        <div
          className={`transition-all duration-500 relative ${
            isScrolled
              ? "glass-strong rounded-2xl px-3 sm:px-5 md:px-6"
              : "px-0"
          }`}
          style={isScrolled ? {
            boxShadow: "0 2px 4px rgba(0,0,0,0.02), 0 8px 20px rgba(0,0,0,0.05), 0 20px 56px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.95)"
          } : undefined}
        >
          {/* Animated bottom accent line (visible when scrolled) */}
          {isScrolled && (
            <div
              className="absolute bottom-0 left-4 right-4 h-px rounded-full"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(252,163,17,0.3) 50%, transparent 100%)",
              }}
            />
          )}

          <div
            className={`flex items-center justify-between transition-[height] duration-500 ${
              isScrolled ? "h-12 sm:h-14 md:h-[72px]" : "h-14 sm:h-16 md:h-[88px]"
            }`}
          >
            {/* Logo — morphs on scroll */}
            <Link href="/" className="relative z-50 flex items-center group">
              <div
                className={`relative transition-all duration-500 ease-out ${
                  isScrolled
                    ? "h-10 w-[74px] md:h-12 md:w-[96px]"
                    : "h-[58px] w-[104px] md:h-[78px] md:w-[140px]"
                }`}
              >
                <Image
                  src="/cs-glaze-logo.png"
                  alt="CS Glaze"
                  fill
                  priority
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>

            {/* Desktop Navigation — floating pill style */}
            <nav className="hidden md:flex items-center gap-1 rounded-xl bg-white/40 backdrop-blur-md border border-white/50 px-1.5 py-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]" aria-label="Main navigation">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-4 py-2 text-[13px] font-medium transition-all duration-300 rounded-lg group ${
                      isActive
                        ? "text-primary bg-white shadow-sm"
                        : "text-text-secondary hover:text-primary hover:bg-white/60"
                    }`}
                  >
                    {link.name}
                    {/* Active indicator dot */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* CTA Button — floating with depth */}
            <a
              href="#contact"
              className="hidden md:inline-flex items-center justify-center px-5 py-2.5 font-heading font-semibold text-[13px] text-on-accent gradient-accent rounded-xl shadow-[0_4px_16px_rgba(252,163,17,0.25)] hover:shadow-[0_8px_24px_rgba(252,163,17,0.35)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Quote
            </a>

            {/* Mobile Menu Button — large touch target */}
            <button
              className="md:hidden z-50 flex h-11 w-11 items-center justify-center rounded-xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-sm active:scale-95 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X size={18} strokeWidth={1.6} className="text-primary" />
              ) : (
                <Menu size={18} strokeWidth={1.6} className="text-primary" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation — floating glass panel with proper touch targets */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden mx-3 sm:mx-4 mt-2 rounded-2xl glass-strong overflow-hidden"
            style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)" }}
          >
            <nav className="p-3 sm:p-4 flex flex-col gap-0.5" aria-label="Mobile navigation">
              {navLinks.map((link, i) => {
                const isActive = activeSection === link.id;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      className={`block px-4 py-3.5 text-[15px] font-medium rounded-xl transition-all active:scale-[0.98] ${
                        isActive
                          ? "text-primary bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.04)]"
                          : "text-text-primary active:bg-white/60"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.04, duration: 0.2 }}
                className="mt-2 pt-2 border-t border-border-light/50"
              >
                <a
                  href="#contact"
                  className="block text-center px-5 py-3.5 font-heading font-semibold text-[15px] text-on-accent gradient-accent rounded-xl shadow-[0_4px_16px_rgba(252,163,17,0.2)] active:scale-[0.97]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Quote
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
