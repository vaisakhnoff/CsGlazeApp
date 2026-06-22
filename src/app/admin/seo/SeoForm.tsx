"use client";
import React, { useActionState } from "react";
import { saveSeoAction, type SeoFormState } from "./actions";
import { CheckCircle2, AlertCircle } from "lucide-react";

const INIT: SeoFormState = { status: "idle" };

function FieldErr({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400">
      <AlertCircle size={12} className="flex-shrink-0" /> {msg}
    </p>
  );
}

const SEO_KEYS: {
  label: string;
  key: keyof NonNullable<SeoFormState["errors"]>;
  placeholder: string;
  rows?: number;
  required?: boolean;
}[] = [
  { label: "Home Page Title", key: "seo_home_title", placeholder: "CS Glaze – Premium ACP Cladding & Structural Glazing", required: true },
  { label: "Home Meta Description", key: "seo_home_desc", placeholder: "CS Glaze specialises in...", rows: 3 },
  { label: "Open Graph Title", key: "seo_home_og_title", placeholder: "CS Glaze | Building Excellence" },
  { label: "Open Graph Description", key: "seo_home_og_desc", placeholder: "Discover premium glazing solutions...", rows: 2 },
  { label: "Keywords (comma-separated)", key: "seo_home_keywords", placeholder: "ACP cladding, structural glazing, spider glazing..." },
];

export function SeoForm({ map }: { map: Record<string, string> }) {
  const [state, formAction, isPending] = useActionState(saveSeoAction, INIT);
  const e = state.errors;

  return (
    <form action={formAction} className="space-y-6">
      <div className="p-6 rounded-xl border border-[#d6d6d6] bg-white space-y-6">
        <h2 className="text-lg font-medium text-black border-b border-[#d6d6d6] pb-2">Homepage SEO</h2>
        {SEO_KEYS.map(({ label, key, placeholder, rows, required }) => {
          const err = e?.[key];
          const cls = `w-full bg-[#f6f6f6] border rounded-lg px-4 py-2 text-black focus:border-black transition-all outline-none resize-none ${
            err ? "border-red-400" : "border-[#c7c7c7]"
          }`;
          return (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium text-black">
                {label} {required && <span className="text-red-400">*</span>}
              </label>
              {rows ? (
                <textarea name={key} defaultValue={map[key] || ""} rows={rows} placeholder={placeholder} className={cls} />
              ) : (
                <input type="text" name={key} defaultValue={map[key] || ""} placeholder={placeholder} className={cls} />
              )}
              <FieldErr msg={err} />
            </div>
          );
        })}
      </div>

      {state.status === "success" && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          <CheckCircle2 size={15} /> {state.message}
        </div>
      )}
      {state.status === "error" && state.message && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          <AlertCircle size={15} /> {state.message}
        </div>
      )}

      <div className="flex justify-end">
        <button type="submit" disabled={isPending}
          className="px-8 py-3 bg-black text-white text-sm font-medium rounded-md hover:bg-[#222] transition-colors disabled:opacity-50">
          {isPending ? "Saving…" : "Save SEO Settings"}
        </button>
      </div>
    </form>
  );
}
