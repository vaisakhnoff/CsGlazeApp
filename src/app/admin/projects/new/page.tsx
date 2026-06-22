"use client";

import React, { useActionState, useState } from "react";
import { createProjectAction, type ProjectFormState } from "../actions";
import { ImageCropUploader } from "@/components/ImageCropUploader";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

const PRESET_CATEGORIES = [
  "Structural Glazing","ACP Works","Glass Roofing","Glass Canopies","Spider Glazing",
  "Glass Handrails","Roofing Works","MS Structural Works","LED Letter Boards",
  "3D Elevation Works","Toilet Glass Partitions","V Board Partitions",
];

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

const inputCls = (errors?: Record<string, string[]>, field?: string) =>
  `w-full bg-[#f6f6f6] border rounded-lg px-4 py-2.5 text-black focus:outline-none focus:border-black transition-all ${
    field && errors?.[field]?.length ? "border-red-400" : "border-[#c7c7c7]"
  }`;

export default function NewProjectPage() {
  const [state, formAction, isPending] = useActionState(createProjectAction, {} as ProjectFormState);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imageIds, setImageIds] = useState<string[]>([]);

  const isCustom = selectedCategory === "__custom__";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects" className="p-2 rounded-full hover:bg-[#eeeeee] text-[#888] hover:text-black transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-black tracking-tight">Add New Project</h1>
          <p className="text-[#888] mt-1">Fill out the details for the new portfolio item.</p>
        </div>
      </div>

      <form
        action={(fd) => {
          imageIds.forEach(id => fd.append("imageIds", id));
          formAction(fd);
        }}
        className="space-y-6"
      >
        <div className="p-6 rounded-xl border border-[#d6d6d6] bg-white space-y-6">

          {/* Title */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-black">Project Title <span className="text-red-400">*</span></label>
            <input
              type="text" name="title" required
              className={inputCls(state.errors, "title")}
              placeholder="e.g. Skyline Glass Tower"
            />
            <FieldError errors={state.errors} field="title" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-black">Category <span className="text-red-400">*</span></label>
              <select
                name="category" required
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={inputCls(state.errors, "category") + " appearance-none cursor-pointer"}
              >
                <option value="" disabled>Select a category…</option>
                {PRESET_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                <option value="__custom__">+ Add New Category…</option>
              </select>
              <FieldError errors={state.errors} field="category" />
            </div>

            {/* Completion Year */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-black">Completion Year</label>
              <input
                type="text" name="completionYear" maxLength={4}
                className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2.5 text-black focus:outline-none focus:border-black transition-all"
                placeholder="e.g. 2024"
              />
              <FieldError errors={state.errors} field="completionYear" />
            </div>
          </div>

          {isCustom && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-black">New Category Name <span className="text-red-400">*</span></label>
              <input
                type="text" name="customCategory" required={isCustom} autoFocus
                className="w-full bg-[#f6f6f6] border border-amber-500/40 rounded-lg px-4 py-2.5 text-black focus:outline-none focus:border-amber-400 transition-all"
                placeholder="e.g. Pergola Glass Fittings"
              />
              <p className="text-xs text-amber-400/70">This will be saved as a new category.</p>
            </div>
          )}

          {/* Location */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-black">Location</label>
            <input
              type="text" name="location"
              className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2.5 text-black focus:outline-none focus:border-black transition-all"
              placeholder="e.g. Dubai, UAE"
            />
          </div>

          {/* Short Description */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-black">
              Short Description <span className="text-[#666] font-normal ml-2 text-xs">(max 500 chars)</span>
            </label>
            <textarea
              name="shortDescription" rows={3} maxLength={500}
              className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2.5 text-black focus:outline-none focus:border-black transition-all resize-none"
              placeholder="A brief overview of the project scope and challenges."
            />
            <FieldError errors={state.errors} field="shortDescription" />
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3 py-1">
            <input type="checkbox" name="featured" id="featured" className="w-4 h-4 rounded border-[#999] bg-[#f6f6f6] accent-black cursor-pointer" />
            <label htmlFor="featured" className="text-sm font-medium text-black cursor-pointer">Feature on Homepage</label>
          </div>
        </div>

        {/* Images */}
        <div className="p-6 rounded-xl border border-[#d6d6d6] bg-white space-y-3">
          <div>
            <label className="text-sm font-medium text-black">Project Images</label>
            <p className="text-xs text-[#666] mt-0.5">Upload and crop images. The first image is the cover.</p>
          </div>
          <ImageCropUploader onImagesChange={setImageIds} />
          {state.errors?.imageIds && (
            <div className="flex items-center gap-1.5 mt-1">
              <AlertCircle size={13} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-xs">{state.errors.imageIds[0]}</p>
            </div>
          )}
        </div>

        {state.message && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle size={16} /> {state.message}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Link href="/admin/projects" className="px-6 py-2.5 bg-[#f6f6f6] text-black border border-[#c7c7c7] text-sm font-medium rounded-md hover:bg-[#eeeeee] transition-colors">
            Cancel
          </Link>
          <button
            type="submit" disabled={isPending}
            className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-md hover:bg-[#222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving…" : "Save Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
