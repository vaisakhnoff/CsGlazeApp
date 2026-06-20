"use server";

import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ---------------------------------------------------------------------------
// Auth guard
// ---------------------------------------------------------------------------
async function checkAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session")?.value;
  const session = await verifySession(sessionCookie);
  if (!session?.auth) {
    redirect("/admin/login");
  }
}

export async function createTestimonialAction(formData: FormData) {
  await checkAuth();

  const client = formData.get("client") as string;
  const company = formData.get("company") as string;
  const text = formData.get("text") as string;

  if (!client || !text) return;

  await prisma.testimonial.create({ data: { client, company, text } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonialAction(id: string) {
  await checkAuth();
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}
