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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-semibold text-black tracking-tight">Homepage Editor</h1>
        <p className="text-[#888] mt-2">Update the text content for the main landing page.</p>
      </div>

      <form action={saveContentAction} className="space-y-8">
        
        {/* HERO SECTION */}
        <div className="p-6 rounded-xl border border-[#d6d6d6] bg-white space-y-6">
          <h2 className="text-lg font-medium text-black border-b border-[#d6d6d6] pb-2">Hero Section</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">Main Heading</label>
              <input 
                type="text" 
                name="hero_heading"
                defaultValue={contentMap["hero_heading"] || "Blueprint to Reality"}
                className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2 text-black focus:border-black transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">Sub Heading</label>
              <textarea 
                name="hero_subheading"
                rows={2}
                defaultValue={contentMap["hero_subheading"] || "Premium Architectural Engineering Solutions"}
                className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2 text-black focus:border-black transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">CTA Button Text</label>
              <input 
                type="text" 
                name="hero_cta"
                defaultValue={contentMap["hero_cta"] || "Explore Projects"}
                className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2 text-black focus:border-black transition-all"
              />
            </div>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="p-6 rounded-xl border border-[#d6d6d6] bg-white space-y-6">
          <h2 className="text-lg font-medium text-black border-b border-[#d6d6d6] pb-2">About Section</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">About Heading</label>
              <input 
                type="text" 
                name="about_heading"
                defaultValue={contentMap["about_heading"] || "Building the Future"}
                className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2 text-black focus:border-black transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">Company Story</label>
              <textarea 
                name="about_story"
                rows={4}
                defaultValue={contentMap["about_story"] || "CS Glaze is a premier architectural..."}
                className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2 text-black focus:border-black transition-all"
              />
            </div>
          </div>
        </div>

        {/* CONTACT INFO */}
        <div className="p-6 rounded-xl border border-[#d6d6d6] bg-white space-y-6">
          <h2 className="text-lg font-medium text-black border-b border-[#d6d6d6] pb-2">Global Contact Info</h2>
          <p className="text-xs text-[#888]">These values appear live on the homepage Hero and Contact sections immediately after saving.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">Phone Number</label>
              <input 
                type="text" 
                name="contact_phone"
                defaultValue={contentMap["contact_phone"] || ""}
                placeholder="+91 98765 43210"
                className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2 text-black focus:border-black transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">WhatsApp Number</label>
              <input 
                type="text" 
                name="contact_whatsapp"
                defaultValue={contentMap["contact_whatsapp"] || ""}
                placeholder="+91 98765 43210"
                className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2 text-black focus:border-black transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">Email Address</label>
              <input 
                type="email" 
                name="contact_email"
                defaultValue={contentMap["contact_email"] || ""}
                placeholder="info@csglaze.com"
                className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2 text-black focus:border-black transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">Office Location</label>
              <input 
                type="text" 
                name="contact_location"
                defaultValue={contentMap["contact_location"] || ""}
                placeholder="e.g. Kochi, Kerala, India"
                className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2 text-black focus:border-black transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end sticky bottom-8">
          <button 
            type="submit"
            className="px-8 py-3 bg-black text-white text-sm font-medium rounded-md hover:bg-[#222] transition-colors shadow-2xl shadow-white/10"
          >
            Save All Changes
          </button>
        </div>
      </form>
    </div>
  );
}
