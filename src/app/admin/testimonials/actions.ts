"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const TestimonialSchema = z.object({
  client: z.string().min(2, "Name must be at least 2 characters."),
  company: z.string().optional(),
  text: z.string().min(10, "Testimonial must be at least 10 characters."),
});

export type TestimonialFormState = {
  status: "idle" | "success" | "error";
  errors?: Partial<Record<"client" | "text", string>>;
  message?: string;
};

export async function createTestimonialAction(
  _prev: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  await requireAdminSession();

  const result = TestimonialSchema.safeParse({
    client: formData.get("client") as string,
    company: (formData.get("company") as string) || undefined,
    text: formData.get("text") as string,
  });

  if (!result.success) {
    const fe = result.error.flatten().fieldErrors;
    return { status: "error", errors: { client: fe.client?.[0], text: fe.text?.[0] } };
  }

  try {
    await prisma.testimonial.create({ data: result.data });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { status: "success" };
  } catch {
    return { status: "error", message: "Failed to save. Please try again." };
  }
}

export async function deleteTestimonialAction(id: string) {
  await requireAdminSession();
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}
