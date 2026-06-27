"use client";

import React, { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { Trash2, AlertTriangle, Check, X } from "lucide-react";

interface Props {
  action: () => Promise<void>;
  label: string;
  variant?: "icon" | "text";
}

export function AdminDeleteButton({ action, label, variant = "icon" }: Props) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConfirm = () => {
    setError(null);
    startTransition(async () => {
      try {
        await action();
        setDone(true);
        setTimeout(() => {
          setOpen(false);
          setDone(false);
        }, 800);
      } catch {
        setError("Delete failed. Please try again.");
      }
    });
  };

  const modal = open ? (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      {/* Overlay */}
      <div
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }}
        onClick={() => !isPending && setOpen(false)}
      />

      {/* Dialog */}
      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "400px", background: "#fff", borderRadius: "1rem", border: "1px solid #d6d6d6", padding: "1.5rem", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        {done ? (
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Check size={20} className="text-green-500" />
            </div>
            <p className="text-sm font-medium text-black">Deleted successfully</p>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={18} className="text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-black text-sm mb-1">Confirm Deletion</h3>
                <p className="text-[#666] text-sm leading-relaxed">
                  Are you sure you want to delete{" "}
                  <span className="font-medium text-black">&ldquo;{label}&rdquo;</span>? This
                  action cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="text-[#888] hover:text-black transition-colors flex-shrink-0 p-1"
              >
                <X size={16} />
              </button>
            </div>

            {error && (
              <p className="mb-4 text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 bg-[#f6f6f6] border border-[#c7c7c7] text-black text-sm font-medium rounded-lg hover:bg-[#eeeeee] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          variant === "icon"
            ? "text-[#888] hover:text-red-500 transition-colors"
            : "flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors"
        }
        aria-label={`Delete ${label}`}
      >
        <Trash2 size={16} />
        {variant === "text" && <span>Delete</span>}
      </button>

      {mounted && modal && createPortal(modal, document.body)}
    </>
  );
}
