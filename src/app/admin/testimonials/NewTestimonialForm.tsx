"use client";
import React, { useActionState, useEffect, useRef } from "react";
import { createTestimonialAction, type TestimonialFormState } from "./actions";
import { Check, AlertCircle, Loader2 } from "lucide-react";

const INIT: TestimonialFormState = { status: "idle" };

function FieldErr({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400">
      <AlertCircle size={12} className="flex-shrink-0" /> {msg}
    </p>
  );
}

export function NewTestimonialForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(createTestimonialAction, INIT);

  useEffect(() => {
    if (state.status === "success") ref.current?.reset();
  }, [state.status]);

  return (
    <form action={formAction} ref={ref} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-black">Client Name *</label>
        <input
          name="client"
          className={`w-full bg-[#f6f6f6] border rounded-lg px-4 py-2 text-black focus:border-black transition-all outline-none ${state.errors?.client ? "border-red-400" : "border-[#c7c7c7]"}`}
          placeholder="e.g. Ahmed Al-Rashid"
        />
        <FieldErr msg={state.errors?.client} />
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
          rows={4}
          className={`w-full bg-[#f6f6f6] border rounded-lg px-4 py-2 text-black focus:border-black transition-all outline-none resize-none ${state.errors?.text ? "border-red-400" : "border-[#c7c7c7]"}`}
          placeholder="What the client said about CS Glaze..."
        />
        <FieldErr msg={state.errors?.text} />
      </div>

      {state.status === "success" && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          <Check size={14} /> Testimonial added successfully.
        </div>
      )}
      {state.status === "error" && state.message && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          <AlertCircle size={14} /> {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-[#222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : "Add Testimonial"}
      </button>
    </form>
  );
}
