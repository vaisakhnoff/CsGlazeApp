"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTestimonialAction(formData: FormData) {
  const client = formData.get("client") as string;
  const company = formData.get("company") as string;
  const text = formData.get("text") as string;

  if (!client || !text) return;

  await prisma.testimonial.create({ data: { client, company, text } });
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonialAction(id: string) {
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
}
