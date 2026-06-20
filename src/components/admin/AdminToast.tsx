"use client";

import React, { useState, useEffect } from "react";
import { Check, AlertCircle, X } from "lucide-react";

type Toast = { id: number; message: string; type: "success" | "error" };

// Module-level listeners so any component can push toasts
type Listener = (toast: Omit<Toast, "id">) => void;
const listeners: Set<Listener> = new Set();

/** Call this anywhere (client-side) to show a toast. */
export function addToast(message: string, type: "success" | "error" = "success") {
  listeners.forEach((cb) => cb({ message, type }));
}

export function AdminToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler: Listener = (toast) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { ...toast, id }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2.5 pl-4 pr-3 py-3 rounded-xl text-sm font-medium shadow-lg pointer-events-auto
            animate-in slide-in-from-right-4 fade-in duration-300 border
            ${
              t.type === "success"
                ? "bg-white border-green-500/25 text-green-700"
                : "bg-white border-red-400/25 text-red-600"
            }`}
        >
          {t.type === "success" ? (
            <Check size={14} className="flex-shrink-0" />
          ) : (
            <AlertCircle size={14} className="flex-shrink-0" />
          )}
          <span>{t.message}</span>
          <button
            onClick={() => dismiss(t.id)}
            className="ml-1 text-current opacity-50 hover:opacity-100 transition-opacity"
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
