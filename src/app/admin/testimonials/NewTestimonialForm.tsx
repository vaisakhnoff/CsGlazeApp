"use client";
import React, { useRef, useState, useTransition } from "react";
import { createTestimonialAction } from "./actions";
import { Check, AlertCircle, Loader2 } from "lucide-react";

export function NewTestimonialForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  async function handleAction(formData: FormData) {
    setStatus("idle");
    startTransition(async () => {
      try {
        await createTestimonialAction(formData);
        ref.current?.reset();
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      } catch {
        setStatus("error");
      }
    });
  }

  return (
    <form action={handleAction} ref={ref} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-black">Client Name *</label>
        <input
          name="client"
          required
          minLength={2}
          className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2 text-black focus:border-black transition-all outline-none"
          placeholder="e.g. Ahmed Al-Rashid"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-black">Company</label>
        <input
          name="company"
          className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2 text-black focus:border-black transition-all outline-none"
          placeholder="e.g. Al Futtaim Group"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-black">Testimonial Text *</label>
        <textarea
          name="text"
          required
          minLength={10}
          rows={4}
          className="w-full bg-[#f6f6f6] border border-[#c7c7c7] rounded-lg px-4 py-2 text-black focus:border-black transition-all outline-none resize-none"
          placeholder="What the client said about CS Glaze..."
        />
      </div>

      {status === "success" && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          <Check size={14} />
          Testimonial added successfully.
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          <AlertCircle size={14} />
          Failed to add testimonial. Please try again.
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-[#222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Saving…
          </>
        ) : (
          "Add Testimonial"
        )}
      </button>
    </form>
  );
}
