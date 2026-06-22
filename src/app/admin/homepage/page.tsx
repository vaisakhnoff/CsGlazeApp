import React from "react";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";
import { HomepageEditorForm } from "./HomepageEditorForm";

export const dynamic = "force-dynamic";

export default async function HomepageEditorPage() {
  await requireAdminSession();

  const content = await prisma.pageContent.findMany();
  const contentMap = content.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-semibold text-black tracking-tight">Homepage Editor</h1>
        <p className="text-[#888] mt-2">Update the text content for the main landing page.</p>
      </div>
      <HomepageEditorForm contentMap={contentMap} />
    </div>
  );
}
