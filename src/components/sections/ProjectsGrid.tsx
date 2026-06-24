"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { ClipReveal } from "@/components/ui/ClipReveal";

function ImageCarousel({ images, fallback }: { images: string[]; fallback: string }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const all = images.length > 0 ? images : [fallback];

  const go = (next: number, direction: number) => {
    setDir(direction);
    setIdx((next + all.length) % all.length);
  };

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-7 bg-border-light shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={idx}
          custom={dir}
          initial={{ x: dir * 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -dir * 60, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${all[idx]})` }}
        />
      </AnimatePresence>

      {all.length > 1 && (
        <>
          <button
            onClick={() => go(idx - 1, -1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-white/60 flex items-center justify-center text-primary hover:bg-white hover:shadow-md transition-all shadow-sm"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => go(idx + 1, 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-white/60 flex items-center justify-center text-primary hover:bg-white hover:shadow-md transition-all shadow-sm"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {all.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i, i > idx ? 1 : -1)}
                className={`h-1 rounded-full transition-all ${i === idx ? "bg-accent w-6 shadow-[0_0_6px_rgba(252,163,17,0.4)]" : "bg-white/60 w-1.5"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const FALLBACK_IMAGE: Record<string, string> = {
  "Structural Glazing": "https://images.unsplash.com/photo-1574681655653-e9bf88c8fa17?q=80&w=2070&auto=format&fit=crop",
  "ACP Works": "https://images.unsplash.com/photo-1541888070904-03a08865fcc2?q=80&w=1974&auto=format&fit=crop",
  "Spider Glazing": "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2070&auto=format&fit=crop",
};

type Project = {
  id: string;
  title: string;
  category: string;
  location: string | null;
  completionYear: string | null;
  shortDescription: string | null;
  featured: boolean;
  images: { url: string }[];
};

const DEMO_PROJECTS: Project[] = [
  { id: "demo-1", title: "Apex Tower Facade", category: "Structural Glazing", location: "Dubai, UAE", completionYear: "2024", featured: true, shortDescription: "High-performance structural glazing for a 42-storey commercial tower, featuring thermally broken unitized curtain wall with triple-glazed IGUs.", images: [] },
  { id: "demo-2", title: "Lumina Corporate Center", category: "ACP Works", location: "Abu Dhabi, UAE", completionYear: "2023", featured: false, shortDescription: "Full ACP cladding system with custom-coloured Alucobond panels, precision-fabricated for a 28,000 m² corporate campus.", images: [] },
  { id: "demo-3", title: "Meridian Glass Canopy", category: "Spider Glazing", location: "Sharjah, UAE", completionYear: "2023", featured: false, shortDescription: "Architecturally exposed spider-glazed entrance canopy spanning 18 m with minimal structural steel and back-painted laminated glass.", images: [] },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const displayProjects = projects.length > 0 ? projects : DEMO_PROJECTS;
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const DESKTOP_INITIAL = 6;
  const MOBILE_INITIAL = 6;

  const visibleProjects = showAll ? displayProjects : displayProjects.slice(0, DESKTOP_INITIAL);

  const getImage = (p: Project) =>
    p.images[0]?.url ?? FALLBACK_IMAGE[p.category] ?? FALLBACK_IMAGE.default;

  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected]);

  return (
    <section id="projects" className="section-spacing bg-background relative overflow-hidden">
      {/* Section entry line */}
      <div className="line-h absolute top-0 left-0 right-0 opacity-25" />

      {/* Spatial depth layers */}
      <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-accent/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-60 h-60 bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="container-premium relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14"
        >
          <div className="w-full max-w-[700px] flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="line-accent animated" />
              <span className="font-mono text-xs font-semibold text-accent uppercase tracking-widest">
                Portfolio
              </span>
            </div>
            <ClipReveal>
              <h2
                className="font-heading font-bold text-primary leading-tight mb-3"
                style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
              >
                Featured Projects
              </h2>
            </ClipReveal>
            <p className="text-base lg:text-lg text-text-secondary leading-relaxed w-full">
              World-class architectural facade solutions across commercial and residential projects.
            </p>
          </div>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
            className="flex items-center gap-2 text-sm font-medium text-accent cursor-pointer group whitespace-nowrap px-4 py-2 rounded-xl bg-accent-light/50 hover:bg-accent-light transition-colors"
          >
            Enquire
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        {/* Projects Grid — spatial cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5"
        >
          {visibleProjects.map((project, idx) => {
            const imageUrl = getImage(project);
            const hiddenOnMobile = !showAll && idx >= MOBILE_INITIAL;
            const aspectClass = idx % 2 === 0 ? "aspect-[4/3]" : "aspect-[3/4]";

            return (
              <motion.div
                key={project.id}
                variants={cardVariants}
                className={hiddenOnMobile ? "hidden sm:block" : "block"}
              >
                <div
                  className="card-spatial overflow-hidden cursor-pointer group h-full flex flex-col"
                  onClick={() => setSelected(project)}
                  role="button"
                  tabIndex={0}
                >
                  {/* Image — with spatial depth on hover */}
                  <div className={`relative ${aspectClass} overflow-hidden bg-border-light flex-shrink-0`}>
                    <div className="absolute inset-0 skeleton-shimmer" />
                    <motion.div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url(${imageUrl})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                    {/* Category Badge — floating glass chip */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[11px] font-medium text-primary shadow-sm border border-white/60">
                        {project.category}
                      </span>
                    </div>

                    {project.featured && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 bg-accent text-white rounded-lg text-[11px] font-semibold shadow-[0_4px_12px_rgba(252,163,17,0.3)]">
                          Featured
                        </span>
                      </div>
                    )}

                    {/* Hover arrow — floating */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
                        <ArrowRight size={15} className="text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-sm lg:text-base font-heading font-semibold text-primary mb-2 group-hover:text-accent transition-colors leading-snug">
                      {project.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary mt-auto pt-3 border-t border-border-light/50">
                      {project.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={12} className="text-accent" />
                          <span>{project.location}</span>
                        </div>
                      )}
                      {project.completionYear && (
                        <div className="flex items-center gap-1">
                          <Calendar size={12} className="text-accent" />
                          <span>{project.completionYear}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Show More / Less */}
        {displayProjects.length > DESKTOP_INITIAL && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex items-center gap-2 px-6 py-2.5 font-heading font-semibold text-sm text-primary bg-white border border-border/50 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              {showAll ? "View Less" : `View All ${displayProjects.length} Projects`}
              <ArrowRight
                size={16}
                className={`transition-transform duration-300 ${showAll ? "rotate-180 -translate-x-0.5" : ""}`}
              />
            </button>
          </div>
        )}
        {!showAll && displayProjects.length > MOBILE_INITIAL && (
          <div className="mt-4 flex justify-center sm:hidden">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 font-heading font-semibold text-sm text-primary bg-white border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              View More Projects
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Bottom line */}
      <div className="line-h absolute bottom-0 left-0 right-0 opacity-20" />

      {/* Project Detail Modal — spatial overlay */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-primary/30 backdrop-blur-md z-50"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full max-h-[100dvh] md:h-auto md:w-[768px] md:max-w-[90vw] md:max-h-[88dvh] bg-white rounded-none md:rounded-3xl z-50 overflow-hidden flex flex-col md:border md:border-white/80"
              style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)" }}
            >
              <div className="flex-1 overflow-y-auto p-7 md:p-10 w-full">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-7 w-full">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="px-2.5 py-1 bg-accent-light text-accent rounded-lg text-xs font-semibold">
                        {selected.category}
                      </span>
                      {selected.featured && (
                        <span className="px-2.5 py-1 bg-accent text-white rounded-lg text-xs font-semibold shadow-sm">
                          Featured
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-3">
                      {selected.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                      {selected.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-accent" />
                          <span>{selected.location}</span>
                        </div>
                      )}
                      {selected.completionYear && (
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-accent" />
                          <span>Completed {selected.completionYear}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="w-9 h-9 rounded-xl bg-background hover:bg-border-light flex items-center justify-center transition-all flex-shrink-0 shadow-sm"
                  >
                    <X size={16} className="text-text-secondary" />
                  </button>
                </div>

                <ImageCarousel
                  images={selected.images.map((i) => i.url)}
                  fallback={FALLBACK_IMAGE[selected.category] ?? FALLBACK_IMAGE.default}
                />

                {selected.shortDescription ? (
                  <p className="text-text-secondary leading-relaxed mb-7 text-sm w-full break-words">
                    {selected.shortDescription}
                  </p>
                ) : (
                  <p className="text-text-secondary leading-relaxed mb-7 text-sm w-full break-words">
                    Precision-engineered {selected.category.toLowerCase()} facade solution — balancing
                    structural integrity, thermal performance, and architectural vision.
                  </p>
                )}

                <a
                  href="#contact"
                  onClick={() => setSelected(null)}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-heading font-semibold text-[15px] text-on-accent gradient-accent rounded-xl shadow-[0_8px_24px_rgba(252,163,17,0.25)] hover:shadow-[0_12px_32px_rgba(252,163,17,0.35)] hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
                >
                  Enquire About This Project
                  <ArrowRight size={17} />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
