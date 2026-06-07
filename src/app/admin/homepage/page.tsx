import React from "react";
import { prisma } from "@/lib/prisma";
import { saveContentAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function HomepageEditorPage() {
  // Fetch existing content
  const content = await prisma.pageContent.findMany();
  const contentMap = content.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
      <div>
        <h1 className="text-3xl font-semibold text-white tracking-tight">Homepage Editor</h1>
        <p className="text-[#888] mt-2">Update the text content for the main landing page.</p>
      </div>

      <form action={saveContentAction} className="space-y-8">
        
        {/* HERO SECTION */}
        <div className="p-6 rounded-xl border border-[#222] bg-[#0a0a0a] space-y-6">
          <h2 className="text-lg font-medium text-white border-b border-[#222] pb-2">Hero Section</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#ededed]">Main Heading</label>
              <input 
                type="text" 
                name="hero_heading"
                defaultValue={contentMap["hero_heading"] || "Blueprint to Reality"}
                className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#666] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#ededed]">Sub Heading</label>
              <textarea 
                name="hero_subheading"
                rows={2}
                defaultValue={contentMap["hero_subheading"] || "Premium Architectural Engineering Solutions"}
                className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#666] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#ededed]">CTA Button Text</label>
              <input 
                type="text" 
                name="hero_cta"
                defaultValue={contentMap["hero_cta"] || "Explore Projects"}
                className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#666] transition-all"
              />
            </div>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="p-6 rounded-xl border border-[#222] bg-[#0a0a0a] space-y-6">
          <h2 className="text-lg font-medium text-white border-b border-[#222] pb-2">About Section</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#ededed]">About Heading</label>
              <input 
                type="text" 
                name="about_heading"
                defaultValue={contentMap["about_heading"] || "Building the Future"}
                className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#666] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#ededed]">Company Story</label>
              <textarea 
                name="about_story"
                rows={4}
                defaultValue={contentMap["about_story"] || "CS Glaze is a premier architectural..."}
                className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#666] transition-all"
              />
            </div>
          </div>
        </div>

        {/* CONTACT INFO */}
        <div className="p-6 rounded-xl border border-[#222] bg-[#0a0a0a] space-y-6">
          <h2 className="text-lg font-medium text-white border-b border-[#222] pb-2">Global Contact Info</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#ededed]">Phone Number</label>
              <input 
                type="text" 
                name="contact_phone"
                defaultValue={contentMap["contact_phone"] || "+971 50 123 4567"}
                className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#666] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#ededed]">WhatsApp</label>
              <input 
                type="text" 
                name="contact_whatsapp"
                defaultValue={contentMap["contact_whatsapp"] || "+971 50 123 4567"}
                className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#666] transition-all"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-[#ededed]">Email Address</label>
              <input 
                type="email" 
                name="contact_email"
                defaultValue={contentMap["contact_email"] || "info@csglaze.com"}
                className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-2 text-white focus:border-[#666] transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end sticky bottom-8">
          <button 
            type="submit"
            className="px-8 py-3 bg-white text-black text-sm font-medium rounded-md hover:bg-gray-200 transition-colors shadow-2xl shadow-white/10"
          >
            Save All Changes
          </button>
        </div>
      </form>
    </div>
  );
}
