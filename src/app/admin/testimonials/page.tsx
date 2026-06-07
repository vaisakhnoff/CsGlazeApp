import React from "react";
import { prisma } from "@/lib/prisma";
import { Trash2, Plus } from "lucide-react";
import { NewTestimonialForm } from "./NewTestimonialForm";
import { deleteTestimonialAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-semibold text-white tracking-tight">Testimonials</h1>
        <p className="text-[#888] mt-2">Manage client testimonials shown on the website.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Form */}
        <div className="p-6 rounded-xl border border-[#222] bg-[#0a0a0a]">
          <h2 className="text-lg font-medium text-white mb-6">Add New Testimonial</h2>
          <NewTestimonialForm />
        </div>

        {/* List */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-white">Existing Testimonials ({testimonials.length})</h2>
          {testimonials.length === 0 ? (
            <div className="py-12 text-center text-[#666] border border-dashed border-[#333] rounded-xl">
              No testimonials yet.
            </div>
          ) : (
            testimonials.map((t) => (
              <div key={t.id} className="p-5 rounded-xl border border-[#222] bg-[#0a0a0a] group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[#ededed] text-sm leading-relaxed italic mb-3">"{t.text}"</p>
                    <div>
                      <span className="text-white font-medium text-sm">{t.client}</span>
                      {t.company && <span className="text-[#888] text-sm">, {t.company}</span>}
                    </div>
                  </div>
                  <form action={deleteTestimonialAction.bind(null, t.id)}>
                    <button type="submit" className="p-2 text-[#666] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
