"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { ClipReveal } from "@/components/ui/ClipReveal";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

type ParsedService = {
  id: string;
  title: string;
  description: string;
  specs: string[];
  icon: string;
  glow: string;
  accent: string;
  overview: string;
  features: string[];
  applications: string[];
  imageUrl: string | null;
};

interface Props {
  initialServices: Record<string, unknown>[];
}

function safeParseArray(json: string, fallback: string[] = []): string[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export const Services = ({ initialServices }: Props) => {
  const parsedServices: ParsedService[] = initialServices
    .map((s) => {
      try {
        return {
          ...s,
          specs: safeParseArray(s.specs as string),
          features: safeParseArray(s.features as string),
          applications: safeParseArray(s.applications as string),
        };
      } catch (err) {
        console.warn(`Skipping malformed service "${s.title}":`, err);
        return null;
      }
    })
    .filter(Boolean) as ParsedService[];

  const [showAll, setShowAll] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const MOBILE_INITIAL = 4;

  useEffect(() => {
    if (!selectedId) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedId]);

  return (
    <section id="services" className="section-spacing relative overflow-hidden" style={{ background: "#f9fafb" }}>
      {/* Section entry line */}
      <div className="line-h absolute top-0 left-0 right-0 opacity-30" />

      {/* Spatial background layers */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="container-premium relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div className="w-full max-w-[600px]">
            <div className="flex items-center gap-3 mb-4">
              <span className="line-accent animated" />
              <span className="font-mono text-xs font-semibold text-accent uppercase tracking-widest">
                Our Services
              </span>
            </div>
            <ClipReveal>
              <h2
                className="font-heading font-bold text-primary leading-tight mb-3"
                style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
              >
                Engineered for the modern skyline
              </h2>
            </ClipReveal>
            <p className="text-base lg:text-lg text-text-secondary leading-relaxed">
              Structural and aesthetic systems designed for contemporary architecture.
            </p>
          </div>
        </motion.div>

        {/* Services Grid — spatial cards with depth */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6"
        >
          {parsedServices.length === 0 ? (
            <div className="col-span-2 lg:col-span-4 py-16 text-center text-text-secondary">
              <p className="text-sm">No services available at the moment.</p>
            </div>
          ) : parsedServices.map((service, idx) => {
            const Icon =
              (LucideIcons as Record<string, unknown>)[service.icon] as React.FC<{ size?: number; className?: string; style?: React.CSSProperties }> || LucideIcons.HelpCircle;
            const hiddenOnMobile = !showAll && idx >= MOBILE_INITIAL;

            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                className={hiddenOnMobile ? "hidden sm:block" : "block"}
              >
                <div
                  className="relative h-full rounded-[28px] overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedId(service.id)}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    e.currentTarget.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-8px) scale(1.02)`;
                    e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02), 0 12px 28px rgba(0,0,0,0.08), 0 36px 90px rgba(0,0,0,0.07)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px) scale(1)";
                    e.currentTarget.style.boxShadow = "";
                  }}
                  style={{
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04), 0 18px 52px rgba(0,0,0,0.04)",
                    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {/* Full-bleed image background */}
                  {service.imageUrl ? (
                    <div className="absolute inset-0">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a2d52] to-[#14213d]" />
                  )}

                  {/* Dark gradient overlay for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/85 group-hover:via-black/40 transition-all duration-500" />

                  {/* Ambient top glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, ${service.glow || "rgba(252,163,17,0.12)"}, transparent 60%)` }}
                  />

                  {/* Content — layered on top */}
                  <div className="relative z-10 h-full min-h-[240px] sm:min-h-[280px] flex flex-col justify-between p-5 lg:p-6">
                    {/* Top: Icon badge */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-300"
                      style={{ background: "rgba(255,255,255,0.15)" }}
                    >
                      <Icon size={20} style={{ color: "#ffffff" }} />
                    </div>

                    {/* Bottom: Title + CTA */}
                    <div>
                      <h3 className="text-[17px] lg:text-lg font-heading font-bold text-white leading-snug mb-3 drop-shadow-sm">
                        {service.title}
                      </h3>
                      <div className="inline-flex items-center gap-2 text-white/90 font-medium text-sm group-hover:text-accent group-hover:gap-3 transition-all duration-300">
                        Learn more
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Show More (mobile only) */}
        {!showAll && parsedServices.length > MOBILE_INITIAL && (
          <div className="mt-6 flex justify-center sm:hidden">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 font-heading font-semibold text-sm text-primary bg-white border border-border/50 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              View All Services
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Bottom line */}
      <div className="line-h absolute bottom-0 left-0 right-0 opacity-20" />

      {/* Service Detail Modal — spatial overlay */}
      <AnimatePresence>
        {selectedId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-primary/30 backdrop-blur-md z-50"
              onClick={() => setSelectedId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full max-h-[100dvh] md:h-auto md:w-[672px] md:max-w-[90vw] md:max-h-[88dvh] bg-white rounded-none md:rounded-3xl z-50 overflow-hidden flex flex-col md:border md:border-white/80"
              style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.02), 0 16px 36px rgba(0,0,0,0.07), 0 40px 100px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1)" }}
            >
              <div className="flex-1 overflow-y-auto p-7 md:p-10 w-full">
                {(() => {
                  const service = parsedServices.find((s) => s.id === selectedId);
                  if (!service) return null;
                  const Icon = (LucideIcons as Record<string, unknown>)[service.icon] as React.FC<{ size?: number; className?: string; style?: React.CSSProperties }> || LucideIcons.HelpCircle;

                  return (
                    <>
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-7 w-full">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                          style={{ background: service.glow || "var(--color-accent-light)" }}
                        >
                          <Icon size={26} style={{ color: service.accent || "var(--color-accent)" }} />
                        </div>
                        <div className="flex-1 min-w-0 w-full">
                          <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-1.5">
                            {service.title}
                          </h2>
                          <p className="text-text-secondary text-sm">{service.description}</p>
                        </div>
                        <button
                          onClick={() => setSelectedId(null)}
                          className="w-9 h-9 rounded-xl bg-background hover:bg-border-light flex items-center justify-center transition-all flex-shrink-0 shadow-sm"
                        >
                          <X size={16} className="text-text-secondary" />
                        </button>
                      </div>

                      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-7" />

                      <div className="mb-7 w-full">
                        <h3 className="text-xs font-mono font-semibold text-accent uppercase tracking-wider mb-3">Overview</h3>
                        <p className="text-text-secondary leading-relaxed text-sm w-full break-words">{service.overview}</p>
                      </div>

                      <div className="mb-7">
                        <h3 className="text-xs font-mono font-semibold text-accent uppercase tracking-wider mb-3">Key Features</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {service.features.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-text-secondary px-3 py-2 rounded-lg bg-background/50">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                              <span className="text-sm">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-7">
                        <h3 className="text-xs font-mono font-semibold text-accent uppercase tracking-wider mb-3">Applications</h3>
                        <div className="flex flex-wrap gap-2">
                          {service.applications.map((app, i) => (
                            <span key={i} className="px-3 py-1.5 bg-accent-light text-accent text-xs font-medium rounded-lg shadow-sm">
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};
