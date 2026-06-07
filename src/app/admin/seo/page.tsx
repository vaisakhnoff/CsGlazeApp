import React from "react";
import { prisma } from "@/lib/prisma";
import { saveSeoAction } from "./actions";

export const dynamic = "force-dynamic";

const SEO_KEYS = [
  { label: "Home Page Title", key: "seo_home_title", placeholder: "CS Glaze – Premium ACP Cladding & Structural Glazing" },
  { label: "Home Meta Description", key: "seo_home_desc", placeholder: "CS Glaze specialises in...", rows: 3 },
  { label: "Open Graph Title", key: "seo_home_og_title", placeholder: "CS Glaze | Building Excellence" },
  { label: "Open Graph Description", key: "seo_home_og_desc", placeholder: "Discover premium glazing solutions...", rows: 2 },
  { label: "Keywords (comma-separated)", key: "seo_home_keywords", placeholder: "ACP cladding, structural glazing, spider glazing..." },
];

export default async function SEOPage() {
  const records = await prisma.pageContent.findMany({ where: { key: { startsWith: "seo_" } } });
  const map = records.reduce((a, r) => ({ ...a, [r.key]: r.value }), {} as Record<string, string>);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
      <div>
        <h1 className="text-3xl font-semibold text-black tracking-tight">SEO Settings</h1>
        <p className="text-[#888] mt-2">Control how search engines and social platforms see your site.</p>
      </div>

      <form action={saveSeoAction} className="space-y-6">
        <div className="p-6 rounded-xl border border-[#d6d6d6] bg-white space-y-6">
          <h2 className="text-lg font-medium text-black border-b border-[#d6d6d6] pb-2">Homepage SEO</h2>
          {SEO_KEYS.map(({ label, key, placeholder, rows }) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium text-black">{label}</label>
              {rows ? (
                <textarea name={key} defaultValue={map[key] || ""} rows={rows} placeholder={placeholder}
                  className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2 text-black focus:border-black transition-all outline-none resize-none" />
              ) : (
                <input type="text" name={key} defaultValue={map[key] || ""} placeholder={placeholder}
                  className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2 text-black focus:border-black transition-all outline-none" />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button type="submit"
            className="px-8 py-3 bg-black text-white text-sm font-medium rounded-md hover:bg-[#222] transition-colors">
            Save SEO Settings
          </button>
        </div>
      </form>
    </div>
  );
}
