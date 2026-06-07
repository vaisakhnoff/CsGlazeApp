"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function DetailModal({ open, onClose, children }: DetailModalProps) {
  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center z-50 p-0 sm:p-6"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="relative w-full sm:max-w-2xl max-h-[92dvh] sm:max-h-[85vh] overflow-y-auto
                rounded-t-2xl sm:rounded-2xl
                bg-surface/95 backdrop-blur-2xl
                border border-white/10
                shadow-[0_0_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.12)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top edge glow */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none rounded-t-2xl" />
              {/* HUD brackets */}
              <div className="absolute top-4 left-4 pointer-events-none opacity-20">
                <svg width="24" height="24" fill="none">
                  <line x1="0" y1="0" x2="14" y2="0" stroke="white" strokeWidth="1.5"/>
                  <line x1="0" y1="0" x2="0" y2="14" stroke="white" strokeWidth="1.5"/>
                </svg>
              </div>
              <div className="absolute top-4 right-12 pointer-events-none opacity-20">
                <svg width="24" height="24" fill="none">
                  <line x1="24" y1="0" x2="10" y2="0" stroke="white" strokeWidth="1.5"/>
                  <line x1="24" y1="0" x2="24" y2="14" stroke="white" strokeWidth="1.5"/>
                </svg>
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/8 border border-white/10 text-white/60 hover:text-white hover:bg-white/15 transition-colors"
                aria-label="Close"
              >
                <X size={15} />
              </button>

              {/* Mobile drag hint */}
              <div className="sm:hidden flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              <div className="p-6 sm:p-8">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
