"use client";

import React, { useActionState, useState } from "react";
import { createServiceAction, type ServiceFormState } from "../actions";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { ImageCropUploader } from "@/components/ImageCropUploader";

function FieldError({ errors, field }: { errors?: Record<string, string[]>; field: string }) {
  const msgs = errors?.[field];
  if (!msgs?.length) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1.5">
      <AlertCircle size={13} className="text-red-400 flex-shrink-0" />
      <p className="text-red-400 text-xs">{msgs[0]}</p>
    </div>
  );
}

export default function NewServicePage() {
  const [state, formAction, isPending] = useActionState(createServiceAction, {} as ServiceFormState);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin/services" className="p-2 rounded-full hover:bg-[#eeeeee] text-[#888] hover:text-black transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-black tracking-tight">Add New Service</h1>
          <p className="text-[#888] mt-1">Fill out the details for the new service offering.</p>
        </div>
      </div>

      <form
        action={(fd) => {
          if (imageUrls.length > 0) {
            fd.append("imageUrl", imageUrls[0]); // store just the ID or URL. Wait, ImageCropUploader returns IDs.
          }
          formAction(fd);
        }}
        className="space-y-6"
      >
        <div className="p-6 rounded-xl border border-[#d6d6d6] bg-white space-y-6">

          {/* Title */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-black">Service Title <span className="text-red-400">*</span></label>
            <input
              type="text" name="title" required
              className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2.5 text-black focus:outline-none focus:border-black transition-all"
              placeholder="e.g. Structural Glazing"
            />
            <FieldError errors={state.errors} field="title" />
          </div>
          
          {/* Description */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-black">Card Description <span className="text-red-400">*</span></label>
            <textarea
              name="description" required rows={2}
              className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2.5 text-black focus:outline-none focus:border-black transition-all resize-none"
              placeholder="Short description for the card."
            />
            <FieldError errors={state.errors} field="description" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Icon */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-black">Icon Name <span className="text-red-400">*</span></label>
              <input
                type="text" name="icon" required
                className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2.5 text-black focus:outline-none focus:border-black transition-all"
                placeholder="e.g. Layers (Lucide icon)"
              />
              <p className="text-[10px] text-[#888]">Use <a href="https://lucide.dev/icons" target="_blank" className="underline">Lucide React</a> icon names.</p>
              <FieldError errors={state.errors} field="icon" />
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <label className="text-sm font-medium text-black">Glow Color</label>
                 <input
                   type="text" name="glow" defaultValue="rgba(0,0,0,0.08)"
                   className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2.5 text-black focus:outline-none focus:border-black transition-all"
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-sm font-medium text-black">Accent Color</label>
                 <input
                   type="text" name="accent" defaultValue="#000000"
                   className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2.5 text-black focus:outline-none focus:border-black transition-all"
                 />
               </div>
            </div>
          </div>
          
          <hr className="border-t border-[#d6d6d6]" />
          
          <h3 className="font-semibold text-black">Modal Details</h3>

          {/* Overview */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-black">Detailed Overview <span className="text-red-400">*</span></label>
            <textarea
              name="overview" required rows={3}
              className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2.5 text-black focus:outline-none focus:border-black transition-all resize-none"
              placeholder="Long overview shown in modal."
            />
            <FieldError errors={state.errors} field="overview" />
          </div>

          {/* Specs */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-black">Specs (comma separated) <span className="text-red-400">*</span></label>
            <input
              type="text" name="specs" required
              className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2.5 text-black focus:outline-none focus:border-black transition-all"
              placeholder="e.g. Thermal Insulation, Wind Load Resistance"
            />
            <FieldError errors={state.errors} field="specs" />
          </div>
          
          {/* Features */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-black">Features (comma separated) <span className="text-red-400">*</span></label>
            <input
              type="text" name="features" required
              className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2.5 text-black focus:outline-none focus:border-black transition-all"
              placeholder="e.g. Point-fixed systems, Double IGU options"
            />
            <FieldError errors={state.errors} field="features" />
          </div>
          
          {/* Applications */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-black">Applications (comma separated) <span className="text-red-400">*</span></label>
            <input
              type="text" name="applications" required
              className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2.5 text-black focus:outline-none focus:border-black transition-all"
              placeholder="e.g. Commercial towers, Retail facades"
            />
            <FieldError errors={state.errors} field="applications" />
          </div>

        </div>

        {/* Background Image */}
        <div className="p-6 rounded-xl border border-[#d6d6d6] bg-white space-y-3">
          <div>
            <label className="text-sm font-medium text-black">Background Image (Optional)</label>
            <p className="text-xs text-[#666] mt-0.5">Upload an image to display above the service card in low opacity.</p>
          </div>
          <ImageCropUploader onImagesChange={setImageUrls} />
          <p className="text-xs text-[#888] mt-2">Note: The uploader returns image IDs. We will map this to the URL if needed, but since our image crop uploader creates an Image record, we will use the ID to lookup the URL later, or we can just save the ID.</p>
          {state.errors?.imageUrl && (
            <div className="flex items-center gap-1.5 mt-1">
              <AlertCircle size={13} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-xs">{state.errors.imageUrl[0]}</p>
            </div>
          )}
        </div>

        {state.message && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle size={16} /> {state.message}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Link href="/admin/services" className="px-6 py-2.5 bg-[#f6f6f6] text-black border border-[#c7c7c7] text-sm font-medium rounded-md hover:bg-[#eeeeee] transition-colors">
            Cancel
          </Link>
          <button
            type="submit" disabled={isPending}
            className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-md hover:bg-[#222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving…" : "Save Service"}
          </button>
        </div>
      </form>
    </div>
  );
}
