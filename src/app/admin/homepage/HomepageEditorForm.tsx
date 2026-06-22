"use client";
import React, { useActionState } from "react";
import { saveContentAction, type ContentFormState } from "./actions";
import { CheckCircle2, AlertCircle } from "lucide-react";

const INIT: ContentFormState = { status: "idle" };

function FieldErr({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400">
      <AlertCircle size={12} className="flex-shrink-0" /> {msg}
    </p>
  );
}

const inputCls = (err?: string) =>
  `w-full bg-[#f6f6f6] border rounded-lg px-4 py-2 text-black focus:border-black transition-all outline-none ${
    err ? "border-red-400" : "border-[#c7c7c7]"
  }`;

export function HomepageEditorForm({ contentMap }: { contentMap: Record<string, string> }) {
  const [state, formAction, isPending] = useActionState(saveContentAction, INIT);
  const e = state.errors;

  return (
    <form action={formAction} className="space-y-8">
      {/* HERO SECTION */}
      <div className="p-6 rounded-xl border border-[#d6d6d6] bg-white space-y-6">
        <h2 className="text-lg font-medium text-black border-b border-[#d6d6d6] pb-2">Hero Section</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-black">Main Heading <span className="text-red-400">*</span></label>
            <input type="text" name="hero_heading"
              defaultValue={contentMap["hero_heading"] || "Blueprint to Reality"}
              className={inputCls(e?.hero_heading)} />
            <FieldErr msg={e?.hero_heading} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-black">Sub Heading</label>
            <textarea name="hero_subheading" rows={2}
              defaultValue={contentMap["hero_subheading"] || "Premium Architectural Engineering Solutions"}
              className={inputCls(e?.hero_subheading) + " resize-none"} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-black">CTA Button Text <span className="text-red-400">*</span></label>
            <input type="text" name="hero_cta"
              defaultValue={contentMap["hero_cta"] || "Explore Projects"}
              className={inputCls(e?.hero_cta)} />
            <FieldErr msg={e?.hero_cta} />
          </div>
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div className="p-6 rounded-xl border border-[#d6d6d6] bg-white space-y-6">
        <h2 className="text-lg font-medium text-black border-b border-[#d6d6d6] pb-2">About Section</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-black">About Heading <span className="text-red-400">*</span></label>
            <input type="text" name="about_heading"
              defaultValue={contentMap["about_heading"] || "Building the Future"}
              className={inputCls(e?.about_heading)} />
            <FieldErr msg={e?.about_heading} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-black">Company Story</label>
            <textarea name="about_story" rows={4}
              defaultValue={contentMap["about_story"] || "CS Glaze is a premier architectural..."}
              className={inputCls(e?.about_story) + " resize-none"} />
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
            <input type="text" name="contact_phone" defaultValue={contentMap["contact_phone"] || ""} placeholder="+91 98765 43210"
              className={inputCls(e?.contact_phone)} />
            <FieldErr msg={e?.contact_phone} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-black">WhatsApp Number</label>
            <input type="text" name="contact_whatsapp" defaultValue={contentMap["contact_whatsapp"] || ""} placeholder="+91 98765 43210"
              className={inputCls(e?.contact_whatsapp)} />
            <FieldErr msg={e?.contact_whatsapp} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-black">Email Address</label>
            <input type="email" name="contact_email" defaultValue={contentMap["contact_email"] || ""} placeholder="info@csglaze.com"
              className={inputCls(e?.contact_email)} />
            <FieldErr msg={e?.contact_email} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-black">Office Location</label>
            <input type="text" name="contact_location" defaultValue={contentMap["contact_location"] || ""} placeholder="e.g. Kochi, Kerala, India"
              className={inputCls(e?.contact_location)} />
          </div>
        </div>
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

      <div className="flex justify-end sticky bottom-8">
        <button type="submit" disabled={isPending}
          className="px-8 py-3 bg-black text-white text-sm font-medium rounded-md hover:bg-[#222] transition-colors shadow-2xl shadow-white/10 disabled:opacity-50">
          {isPending ? "Saving…" : "Save All Changes"}
        </button>
      </div>
    </form>
  );
}
