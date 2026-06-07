"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { DetailModal } from "@/components/ui/DetailModal";
import { ArrowRight, Layers, LayoutGrid, Box, Zap } from "lucide-react";

const GLASS_GLOW = "rgba(0,0,0,0.08)";
const METAL_GLOW = "rgba(0,0,0,0.06)";
const GLASS_ACCENT = "#000000";
const METAL_ACCENT = "#000000";

const services = [
  {
    title: "Structural Glazing",
    description: "Frameless glass facades providing seamless exterior skins for modern skyscrapers.",
    specs: ["Thermal Insulation", "Wind Load Resistance"],
    icon: Layers,
    glow: GLASS_GLOW,
    accent: GLASS_ACCENT,
    detail: {
      overview: "Our structural glazing system bonds glass directly to the aluminium frame using high-performance silicone sealants, eliminating visible frames for a sleek, continuous glass exterior. Ideal for high-rises, curtain walls, and signature architectural facades.",
      features: ["Point-fixed and frame-bonded systems", "Double & triple IGU options", "U-value as low as 0.9 W/m²K", "Wind load up to 3.0 kPa", "ASTM / BS certified sealants", "Custom RAL powder-coat frames"],
      applications: ["Commercial towers", "Airport terminals", "Luxury hotels", "Corporate HQs"],
    },
  },
  {
    title: "ACP Cladding",
    description: "Premium Aluminum Composite Panels for durable and aesthetically flawless exteriors.",
    specs: ["Fire Retardant", "Weather Resistant"],
    icon: LayoutGrid,
    glow: METAL_GLOW,
    accent: METAL_ACCENT,
    detail: {
      overview: "Aluminum Composite Panels deliver a bold, modern look with exceptional durability. Our FR-grade ACP systems meet international fire codes while offering limitless colour and finish options — from metallic to stone and wood-effect.",
      features: ["FR (Fire Retardant) A2 core", "PVDF & polyester coatings", "Panel thickness 3–6 mm", "Wind & UV resistance", "Easy replacement of individual panels", "Hidden and exposed fastener systems"],
      applications: ["Retail facades", "Residential complexes", "Renovation cladding", "Signage panels"],
    },
  },
  {
    title: "Spider Glazing",
    description: "High-transparency bolted glass assemblies for lobbies and architectural centerpieces.",
    specs: ["Maximum Visibility", "Structural Integrity"],
    icon: Box,
    glow: GLASS_GLOW,
    accent: GLASS_ACCENT,
    detail: {
      overview: "Spider glazing uses stainless steel point-fixings (spiders) to support large glass panels with minimal visual obstructions. The result is near-invisible glass walls that maximise natural light and create striking interior transparency.",
      features: ["2, 4 & 6-arm spider fittings", "304 / 316 stainless steel", "Laminated safety glass", "Seismic & wind movement tolerance", "Custom canopy & roof variants", "Countersunk & surface-mount options"],
      applications: ["Entrance lobbies", "Showrooms", "Atriums", "Glass canopies"],
    },
  },
  {
    title: "Unitized Systems",
    description: "Pre-assembled factory-glazed panels for rapid and precise installation on-site.",
    specs: ["Fast Installation", "Quality Control"],
    icon: Zap,
    glow: METAL_GLOW,
    accent: METAL_ACCENT,
    detail: {
      overview: "Unitized curtain wall panels are fully factory-assembled and glazed, then transported to site for crane-lifted stack-jointed installation. This reduces on-site labour, ensures consistent quality, and dramatically shortens programme time.",
      features: ["Floor-to-floor panel modules", "Internal drainage & pressure equalisation", "EPDM gasket sealing system", "Integrated opening vents & louvres", "BIM-compatible design", "Tested to AAMA 501.1 & CWCT"],
      applications: ["High-rise towers", "Fast-track commercial builds", "Podium levels", "Mixed-use developments"],
    },
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

type Service = typeof services[number];

export const Services = () => {
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<Service | null>(null);
  const MOBILE_INITIAL = 4;

  return (
    <section id="services" className="py-32 bg-background relative z-10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <div className="mb-4 flex items-center gap-4">
              <div className="h-[1px] w-8 bg-tertiary" />
              <span className="font-geist text-xs font-semibold tracking-widest uppercase text-tertiary">Core Competencies</span>
            </div>
            <h2 className="font-montserrat text-4xl md:text-5xl font-semibold tracking-tight text-on-surface max-w-2xl">
              Engineered systems for the modern skyline.
            </h2>
          </div>
          <p className="font-inter text-on-surface-variant max-w-md">
            Our systems are designed to meet the most rigorous structural and aesthetic requirements of contemporary architecture.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        >
          <AnimatePresence>
            {services.map((service, idx) => {
              const Icon = service.icon;
              const hiddenOnMobile = !showAll && idx >= MOBILE_INITIAL;
              return (
                <motion.div
                  key={service.title}
                  variants={cardVariants}
                  className={hiddenOnMobile ? "hidden md:block" : "block"}
                >
                  <GlassCard
                    tiltOnHover
                    glowColor={service.glow}
                    className="h-full flex flex-col p-4 sm:p-6 md:p-8 cursor-pointer"
                    onClick={() => setSelected(service)}
                  >
                    <div
                      className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-4 sm:mb-6 border border-black/10"
                      style={{ background: service.glow, boxShadow: `0 0 16px ${service.glow}` }}
                    >
                      <Icon size={16} style={{ color: service.accent }} className="sm:hidden" />
                      <Icon size={20} style={{ color: service.accent }} className="hidden sm:block" />
                    </div>

                    <h3 className="font-montserrat text-sm sm:text-base md:text-xl font-semibold text-on-surface mb-2 sm:mb-3 leading-tight">
                      {service.title}
                    </h3>
                    <p className="font-inter text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-4 sm:mb-8 flex-grow line-clamp-3 sm:line-clamp-none">
                      {service.description}
                    </p>

                    <div className="mb-3 sm:mb-6">
                      <div className="w-full h-[1px] bg-black/10 mb-3 sm:mb-4" />
                      <ul className="flex flex-col gap-1.5 sm:gap-2">
                        {service.specs.map((spec) => (
                          <li key={spec} className="font-geist text-[10px] sm:text-xs text-on-surface-variant flex items-center gap-1.5 sm:gap-2">
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: service.accent }} />
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div
                      className="flex items-center gap-1.5 sm:gap-2 font-geist text-[10px] sm:text-xs uppercase tracking-widest group/link"
                      style={{ color: service.accent }}
                    >
                      Explore <ArrowRight size={12} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {!showAll && services.length > MOBILE_INITIAL && (
          <div className="mt-6 flex justify-center md:hidden">
            <button
              onClick={() => setShowAll(true)}
              className="flex items-center gap-2 px-6 py-2.5 border border-black/15 text-black/60 font-geist text-xs uppercase tracking-widest backdrop-blur-md bg-black/5 hover:bg-black/10 hover:text-black transition-all rounded-full"
            >
              Show More <ArrowRight size={12} />
            </button>
          </div>
        )}
      </div>

      {/* ── Service Detail Modal ── */}
      <DetailModal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center border border-black/10 flex-shrink-0"
                style={{ background: selected.glow, boxShadow: `0 0 20px ${selected.glow}` }}
              >
                <selected.icon size={22} style={{ color: selected.accent }} />
              </div>
              <div>
                <p className="font-mono text-[9px] tracking-widest text-black/35 uppercase mb-0.5">Service Detail</p>
                <h2 className="font-montserrat text-xl sm:text-2xl font-bold text-black">{selected.title}</h2>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-black/20 via-black/10 to-transparent mb-6" />

            {/* Overview */}
            <p className="font-inter text-black/65 text-sm leading-relaxed mb-8">{selected.detail.overview}</p>

            {/* Features */}
            <div className="mb-8">
              <h4 className="font-geist text-[10px] uppercase tracking-widest mb-4" style={{ color: selected.accent }}>
                Key Features
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selected.detail.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 font-inter text-sm text-black/70">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: selected.accent }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Applications */}
            <div>
              <h4 className="font-geist text-[10px] uppercase tracking-widest mb-4" style={{ color: selected.accent }}>
                Applications
              </h4>
              <div className="flex flex-wrap gap-2">
                {selected.detail.applications.map((a) => (
                  <span
                    key={a}
                    className="px-3 py-1 rounded-full text-xs font-geist backdrop-blur-md bg-black/5 border border-black/10 text-black/60"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 pt-6 border-t border-black/10">
              <a
                href="#contact"
                onClick={() => setSelected(null)}
                className="inline-flex items-center gap-2 px-6 py-2.5 font-geist text-xs uppercase tracking-widest text-on-primary bg-primary shadow-[0_14px_34px_rgba(0,0,0,0.14)] hover:bg-primary-container transition-colors rounded-sm font-semibold"
              >
                Request Proposal <ArrowRight size={13} />
              </a>
            </div>
          </div>
        )}
      </DetailModal>
    </section>
  );
};
