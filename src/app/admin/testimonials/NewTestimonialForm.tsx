"use client";
import React, { useRef } from "react";
import { createTestimonialAction } from "./actions";

export function NewTestimonialForm() {
  const ref = useRef<HTMLFormElement>(null);

  async function handleAction(formData: FormData) {
    await createTestimonialAction(formData);
    ref.current?.reset();
  }

  return (
    <form action={handleAction} ref={ref} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-black">Client Name *</label>
        <input name="client" required
          className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2 text-black focus:border-black transition-all outline-none"
          placeholder="e.g. Ahmed Al-Rashid" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-black">Company</label>
        <input name="company"
          className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2 text-black focus:border-black transition-all outline-none"
          placeholder="e.g. Al Futtaim Group" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-black">Testimonial Text *</label>
        <textarea name="text" required rows={4}
          className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2 text-black focus:border-black transition-all outline-none resize-none"
          placeholder="What the client said about CS Glaze..." />
      </div>
      <button type="submit"
        className="w-full px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-[#222] transition-colors">
        Add Testimonial
      </button>
    </form>
  );
}
