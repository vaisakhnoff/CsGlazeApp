import React from "react";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";
import { SeoForm } from "./SeoForm";

export const dynamic = "force-dynamic";

export default async function SEOPage() {
  await requireAdminSession();

  const records = await prisma.pageContent.findMany({ where: { key: { startsWith: "seo_" } } });
  const map = records.reduce((a, r) => ({ ...a, [r.key]: r.value }), {} as Record<string, string>);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-semibold text-black tracking-tight">SEO Settings</h1>
        <p className="text-[#888] mt-2">Control how search engines and social platforms see your site.</p>
      </div>
      <SeoForm map={map} />
    </div>
  );
}
