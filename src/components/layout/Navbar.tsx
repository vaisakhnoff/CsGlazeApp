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
          rootMargin: "-40% 0px -55% 0px", // fire when section is ~middle of viewport
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
          ? "bg-white/70 backdrop-blur-2xl border-b border-white/60 shadow-sm py-2 md:glass-strong md:shadow-md md:py-3"
          : "py-3 md:py-4"
      }`}
    >
      {/* Animated bottom accent line (visible when scrolled) */}
      {isScrolled && (
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(252,163,17,0.4) 50%, transparent 100%)",
          }}
        />
      )}

      <div className="container-premium">
        <div
          className={`flex items-center justify-between transition-[height] duration-500 ${
            isScrolled ? "h-12 md:h-[88px]" : "h-16 md:h-[88px]"
          }`}
        >
          {/* Logo — morphs on scroll */}
          <Link href="/" className="relative z-50 flex items-center group">
            <div
              className={`relative transition-all duration-500 ease-out ${
                isScrolled
                  ? "h-10 w-[74px] md:h-14 md:w-[100px]"
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 text-[14px] font-medium transition-colors duration-200 rounded-xl group ${
                    isActive
                      ? "text-primary bg-primary-light"
                      : "text-text-secondary hover:text-primary hover:bg-primary-light"
                  }`}
                >
                  {link.name}
                  {/* Active / hover underline */}
                  <span
                    className={`absolute bottom-1 left-4 right-4 h-px bg-accent transition-transform duration-300 origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <a
            href="#contact"
            className="hidden md:inline-flex items-center justify-center px-5 py-2.5 font-heading font-semibold text-[14px] text-on-accent gradient-accent rounded-xl hover:shadow-accent transition-all duration-300 hover-lift"
          >
            Get Quote
          </a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden z-50 flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/70 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X size={20} strokeWidth={1.6} className="text-primary" />
            ) : (
              <Menu size={20} strokeWidth={1.6} className="text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden bg-white/80 backdrop-blur-2xl border-t border-white/70 mt-2 overflow-hidden"
          >
            {/* Mobile accent line */}
            <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
            <nav className="container-premium py-5 flex flex-col gap-1" aria-label="Mobile navigation">
              {navLinks.map((link, i) => {
                const isActive = activeSection === link.id;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.25 }}
                  >
                    <Link
                      href={link.href}
                      className={`block px-4 py-2.5 text-[15px] font-medium rounded-xl transition-colors ${
                        isActive
                          ? "text-primary bg-primary-light"
                          : "text-text-primary hover:bg-primary-light"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05, duration: 0.25 }}
                className="mt-3"
              >
                <a
                  href="#contact"
                  className="block text-center px-5 py-3 font-heading font-semibold text-[14px] text-on-accent gradient-accent rounded-xl"
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
