import React from "react";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";
import { NewTestimonialForm } from "./NewTestimonialForm";
import { deleteTestimonialAction } from "./actions";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  await requireAdminSession();

  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-semibold text-black tracking-tight">Testimonials</h1>
        <p className="text-[#888] mt-2">Manage client testimonials shown on the website.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Form */}
        <div className="p-6 rounded-xl border border-[#d6d6d6] bg-white">
          <h2 className="text-lg font-medium text-black mb-6">Add New Testimonial</h2>
          <NewTestimonialForm />
        </div>

        {/* List */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-black">Existing Testimonials ({testimonials.length})</h2>
          {testimonials.length === 0 ? (
            <div className="py-12 text-center text-[#666] border border-dashed border-[#c7c7c7] rounded-xl">
              No testimonials yet.
            </div>
          ) : (
            testimonials.map((t) => (
              <div key={t.id} className="p-5 rounded-xl border border-[#d6d6d6] bg-white group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-black text-sm leading-relaxed italic mb-3">&ldquo;{t.text}&rdquo;</p>
                    <div>
                      <span className="text-black font-medium text-sm">{t.client}</span>
                      {t.company && <span className="text-[#888] text-sm">, {t.company}</span>}
                    </div>
                  </div>
                  <AdminDeleteButton
                    action={deleteTestimonialAction.bind(null, t.id)}
                    label={`${t.client}'s testimonial`}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
