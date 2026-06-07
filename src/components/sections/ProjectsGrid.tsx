"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { DetailModal } from "@/components/ui/DetailModal";
import { ArrowUpRight, MapPin, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

function ImageCarousel({ images, fallback }: { images: string[]; fallback: string }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const all = images.length > 0 ? images : [fallback];

  const go = (next: number, direction: number) => {
    setDir(direction);
    setIdx((next + all.length) % all.length);
  };

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 bg-black">
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

      {all.length > 1 && (
        <>
          <button
            onClick={() => go(idx - 1, -1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 border border-white/15 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          ><ChevronLeft size={16} /></button>
          <button
            onClick={() => go(idx + 1, 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 border border-white/15 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          ><ChevronRight size={16} /></button>
          {/* Dot indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {all.map((_, i) => (
              <button key={i} onClick={() => go(i, i > idx ? 1 : -1)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? "bg-white w-3" : "bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const CATEGORY_GLOW: Record<string, string> = {
  "Structural Glazing":   "rgba(0,0,0,0.08)",
  "ACP Works":            "rgba(0,0,0,0.06)",
  "Glass Works":          "rgba(0,0,0,0.08)",
  "Spider Glazing":       "rgba(0,0,0,0.08)",
  "Glass Roofing":        "rgba(0,0,0,0.08)",
  "MS Structural Works":  "rgba(0,0,0,0.06)",
  "Roofing Works":        "rgba(0,0,0,0.06)",
  default:                "rgba(0,0,0,0.06)",
};

const CATEGORY_ACCENT: Record<string, string> = {
  "Structural Glazing":   "#000000",
  "ACP Works":            "#000000",
  "Glass Works":          "#000000",
  "Spider Glazing":       "#000000",
  "Glass Roofing":        "#000000",
  "MS Structural Works":  "#000000",
  "Roofing Works":        "#000000",
  default:                "#000000",
};

const FALLBACK_IMAGE: Record<string, string> = {
  "Structural Glazing": "https://images.unsplash.com/photo-1574681655653-e9bf88c8fa17?q=80&w=2070&auto=format&fit=crop",
  "ACP Works":          "https://images.unsplash.com/photo-1541888070904-03a08865fcc2?q=80&w=1974&auto=format&fit=crop",
  "Spider Glazing":     "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop",
  default:              "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2070&auto=format&fit=crop",
};

type Project = {
  id: string;
  title: string;
  category: string;
  location: string | null;
  completionYear: string | null;
  featured: boolean;
  images: { url: string }[];
};

const DEMO_PROJECTS: Project[] = [
  { id: "demo-1", title: "Apex Tower Facade",      category: "Structural Glazing", location: "Dubai, UAE",    completionYear: "2024", featured: true,  images: [] },
  { id: "demo-2", title: "Lumina Corporate Center", category: "ACP Works",          location: "Abu Dhabi, UAE",completionYear: "2023", featured: false, images: [] },
  { id: "demo-3", title: "Meridian Glass Canopy",   category: "Spider Glazing",     location: "Sharjah, UAE",  completionYear: "2023", featured: false, images: [] },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const displayProjects = projects.length > 0 ? projects : DEMO_PROJECTS;
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const MOBILE_INITIAL = 6;

  const getImage = (p: Project) =>
    p.images[0]?.url ?? FALLBACK_IMAGE[p.category] ?? FALLBACK_IMAGE.default;

  return (
    <section id="projects" className="py-32 bg-surface-container-lowest relative z-10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div>
            <div className="mb-4 flex items-center gap-4">
              <div className="h-[1px] w-8 bg-tertiary" />
              <span className="font-geist text-xs font-semibold tracking-widest uppercase text-tertiary">Portfolio</span>
            </div>
            <h2 className="font-montserrat text-4xl md:text-5xl font-semibold tracking-tight text-on-surface">
              Featured Projects
            </h2>
          </div>
          <div className="font-geist text-xs uppercase tracking-widest text-tertiary cursor-pointer hover:text-on-surface transition-colors flex items-center gap-2 group">
            View All Work [{displayProjects.length}]{" "}
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
        >
          {displayProjects.map((project, idx) => {
            const glow = CATEGORY_GLOW[project.category] ?? CATEGORY_GLOW.default;
            const imageUrl = getImage(project);
            const hiddenOnMobile = !showAll && idx >= MOBILE_INITIAL;

            return (
              <motion.div
                key={project.id}
                variants={cardVariants}
                className={hiddenOnMobile ? "hidden md:block" : "block"}
              >
                <GlassCard
                  tiltOnHover
                  glowColor={glow}
                  className="cursor-pointer overflow-hidden p-0"
                  onClick={() => setSelected(project)}
                >
                  <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${imageUrl})` }}
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.07 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex items-center gap-1.5 sm:gap-2">
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-geist font-medium backdrop-blur-md bg-white/10 border border-white/20 text-white uppercase tracking-wider">
                        {project.category}
                      </span>
                      {project.featured && (
                        <span className="hidden sm:inline px-2 py-1 rounded-full text-xs font-geist font-medium backdrop-blur-md bg-primary/20 border border-primary/30 text-primary uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="hidden sm:flex absolute top-4 right-4 w-9 h-9 rounded-full backdrop-blur-md bg-white/10 border border-white/20 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ArrowUpRight size={16} className="text-white" />
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-3 sm:p-6">
                      <div className="w-full h-px bg-white/15 mb-2 sm:mb-4" />
                      <div className="flex items-end justify-between gap-1">
                        <div className="min-w-0">
                          <h3 className="font-montserrat text-sm sm:text-2xl font-semibold text-white leading-tight truncate">
                            {project.title}
                          </h3>
                          {project.location && (
                            <p className="font-geist text-[9px] sm:text-xs text-white/55 mt-0.5 sm:mt-1 truncate">
                              {project.location}
                            </p>
                          )}
                        </div>
                        {project.completionYear && (
                          <span className="font-geist text-[9px] sm:text-xs text-white/35 font-medium flex-shrink-0">
                            {project.completionYear}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>

        {!showAll && displayProjects.length > MOBILE_INITIAL && (
          <div className="mt-6 flex justify-center md:hidden">
            <button
              onClick={() => setShowAll(true)}
              className="flex items-center gap-2 px-6 py-2.5 border border-black/15 text-black/60 font-geist text-xs uppercase tracking-widest backdrop-blur-md bg-black/5 hover:bg-black/10 hover:text-black transition-all rounded-full"
            >
              Show More ({displayProjects.length - MOBILE_INITIAL} more)
              <ArrowUpRight size={12} />
            </button>
          </div>
        )}
      </div>

      {/* ── Project Detail Modal ── */}
      <DetailModal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (() => {
          const glow   = CATEGORY_GLOW[selected.category]   ?? CATEGORY_GLOW.default;
          const accent = CATEGORY_ACCENT[selected.category] ?? CATEGORY_ACCENT.default;
          const allImages = selected.images.map(i => i.url);
          const fallback  = FALLBACK_IMAGE[selected.category] ?? FALLBACK_IMAGE.default;
          return (
            <div>
              {/* Carousel */}
              <ImageCarousel images={allImages} fallback={fallback} />
              {selected.featured && (
                <span className="inline-block mb-3 px-2.5 py-1 rounded-full text-[10px] font-geist font-medium backdrop-blur-md bg-primary/20 border border-primary/30 text-primary uppercase tracking-wider">
                  Featured
                </span>
              )}

              {/* Title row */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-mono text-[9px] tracking-widest mb-1" style={{ color: accent }}>
                    {selected.category}
                  </p>
                  <h2 className="font-montserrat text-xl sm:text-2xl font-bold text-black leading-tight">
                    {selected.title}
                  </h2>
                </div>
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0 mt-2"
                  style={{ background: glow.replace("0.25", "0.8"), boxShadow: `0 0 10px ${glow}` }}
                />
              </div>

              <div className="w-full h-px bg-gradient-to-r from-black/20 via-black/10 to-transparent mb-5" />

              {/* Meta chips */}
              <div className="flex flex-wrap gap-3 mb-6">
                {selected.location && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 border border-black/10 font-geist text-xs text-black/60">
                    <MapPin size={11} /> {selected.location}
                  </span>
                )}
                {selected.completionYear && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 border border-black/10 font-geist text-xs text-black/60">
                    <Calendar size={11} /> Completed {selected.completionYear}
                  </span>
                )}
                <span
                  className="px-3 py-1.5 rounded-full border font-geist text-xs uppercase tracking-wider"
                  style={{ background: glow, borderColor: accent + "44", color: accent }}
                >
                  {selected.category}
                </span>
              </div>

              {/* Description placeholder — real projects can have a `description` field later */}
              <p className="font-inter text-black/60 text-sm leading-relaxed mb-8">
                This project showcases CS Glaze&apos;s expertise in {selected.category.toLowerCase()} — delivering
                precision-engineered facade solutions that balance structural integrity, thermal performance,
                and architectural vision. Every element is designed, fabricated, and installed in-house to
                the highest international standards.
              </p>

              {/* CTA */}
              <div className="flex gap-3">
                <a
                  href="#contact"
                  onClick={() => setSelected(null)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 font-geist text-xs uppercase tracking-widest text-on-primary bg-primary shadow-[0_14px_34px_rgba(0,0,0,0.14)] hover:bg-primary-container transition-colors rounded-sm font-semibold"
                >
                  Enquire About This Project <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          );
        })()}
      </DetailModal>
    </section>
  );
}
