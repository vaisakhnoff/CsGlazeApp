"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { ClipReveal } from "@/components/ui/ClipReveal";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
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
  // On mobile show first 4 (fills 2×2), on sm+ show all
  const MOBILE_INITIAL = 4;

  // Close modal on Escape key
  useEffect(() => {
    if (!selectedId) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedId]);

  return (
    <section id="services" className="section-spacing bg-white relative overflow-hidden">
      {/* Section entry line */}
      <div className="line-h absolute top-0 left-0 right-0 opacity-30" />

      <div className="container-premium">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
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

        {/* Services Grid — 2-col mobile, 2-col tablet, 4-col desktop */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
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
                  className="tilt-card card-premium p-5 lg:p-6 h-full flex flex-col cursor-pointer group relative overflow-hidden line-hover-bottom interactive-click"
                  onClick={() => setSelectedId(service.id)}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    e.currentTarget.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-2px)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0px)";
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {/* Background image on hover */}
                  {service.imageUrl && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
                      <img src={service.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="relative z-10 w-full h-full flex flex-col flex-1">
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                      style={{ background: service.glow || "var(--color-accent-light)" }}
                    >
                      <Icon size={20} style={{ color: service.accent || "var(--color-accent)" }} />
                    </div>

                    {/* Title */}
                    <h3 className="text-[15px] lg:text-base font-heading font-semibold text-primary mb-2 leading-snug w-full">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[13px] lg:text-sm text-text-secondary leading-relaxed mb-4 flex-grow w-full">
                      {service.description}
                    </p>

                    {/* Specs — top 2 */}
                    <div className="space-y-1.5 mb-4">
                      {service.specs.slice(0, 2).map((spec, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                          <div className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-1.5 text-accent font-medium text-xs group-hover:gap-2.5 transition-all">
                      Learn more
                      <ArrowRight size={14} />
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
              className="inline-flex items-center gap-2 px-5 py-2.5 font-heading font-semibold text-sm text-primary bg-primary-light rounded-xl hover:bg-primary hover:text-white transition-all duration-300"
            >
              View All Services
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Bottom line */}
      <div className="line-h absolute bottom-0 left-0 right-0 opacity-20" />

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50"
              onClick={() => setSelectedId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full h-full md:h-auto md:w-[672px] md:max-w-[90vw] md:max-h-[90vh] bg-white rounded-none md:rounded-3xl shadow-lg z-50 overflow-hidden flex flex-col"
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
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
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
                          className="w-9 h-9 rounded-lg hover:bg-border-light flex items-center justify-center transition-colors flex-shrink-0"
                        >
                          <LucideIcons.X size={18} className="text-text-secondary" />
                        </button>
                      </div>

                      <div className="h-px bg-border mb-7" />

                      <div className="mb-7 w-full">
                        <h3 className="text-xs font-mono font-semibold text-accent uppercase tracking-wider mb-3">Overview</h3>
                        <p className="text-text-secondary leading-relaxed text-sm w-full break-words">{service.overview}</p>
                      </div>

                      <div className="mb-7">
                        <h3 className="text-xs font-mono font-semibold text-accent uppercase tracking-wider mb-3">Key Features</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {service.features.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-text-secondary">
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
                            <span key={i} className="px-3 py-1.5 bg-accent-light text-accent text-xs font-medium rounded-lg">
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
