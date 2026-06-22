"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ContentSchema = z.object({
  hero_heading: z.string().min(2, "Main heading is required."),
  hero_cta: z.string().min(1, "CTA button text is required."),
  about_heading: z.string().min(2, "About heading is required."),
  hero_subheading: z.string().optional(),
  about_story: z.string().optional(),
  contact_phone: z
    .string()
    .regex(/^[+\d][\d\s\-().]{6,19}$/, "Enter a valid phone number.")
    .optional()
    .or(z.literal("")),
  contact_whatsapp: z
    .string()
    .regex(/^[+\d][\d\s\-().]{6,19}$/, "Enter a valid WhatsApp number.")
    .optional()
    .or(z.literal("")),
  contact_email: z
    .string()
    .email("Enter a valid email address.")
    .optional()
    .or(z.literal("")),
  contact_location: z.string().optional(),
});

export type ContentFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<keyof z.infer<typeof ContentSchema>, string>>;
};

export async function saveContentAction(
  _prev: ContentFormState,
  formData: FormData
): Promise<ContentFormState> {
  await requireAdminSession();

  const raw = Object.fromEntries(
    Array.from(formData.entries()).filter(([, v]) => typeof v === "string")
  ) as Record<string, string>;

  const result = ContentSchema.safeParse(raw);
  if (!result.success) {
    const fe = result.error.flatten().fieldErrors;
    return {
      status: "error",
      errors: Object.fromEntries(
        Object.entries(fe).map(([k, v]) => [k, v?.[0]])
      ) as ContentFormState["errors"],
    };
  }

  const entries = Object.entries(result.data).filter(([, v]) => v !== undefined) as [string, string][];

  try {
    await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.pageContent.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );
    revalidatePath("/");
    return { status: "success", message: "Changes saved successfully." };
  } catch {
    return { status: "error", message: "Failed to save. Please try again." };
  }
}
