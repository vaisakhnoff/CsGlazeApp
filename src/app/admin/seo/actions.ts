"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const SeoSchema = z.object({
  seo_home_title: z.string().min(1, "Page title is required.").max(70, "Keep title under 70 characters."),
  seo_home_desc: z.string().max(160, "Meta description should be under 160 characters.").optional().or(z.literal("")),
  seo_home_og_title: z.string().max(70, "OG title should be under 70 characters.").optional().or(z.literal("")),
  seo_home_og_desc: z.string().max(200, "OG description should be under 200 characters.").optional().or(z.literal("")),
  seo_home_keywords: z.string().optional(),
});

export type SeoFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<keyof z.infer<typeof SeoSchema>, string>>;
};

export async function saveSeoAction(
  _prev: SeoFormState,
  formData: FormData
): Promise<SeoFormState> {
  await requireAdminSession();

  const raw = Object.fromEntries(
    Array.from(formData.entries()).filter(([, v]) => typeof v === "string")
  ) as Record<string, string>;

  const result = SeoSchema.safeParse(raw);
  if (!result.success) {
    const fe = result.error.flatten().fieldErrors;
    return {
      status: "error",
      errors: Object.fromEntries(
        Object.entries(fe).map(([k, v]) => [k, v?.[0]])
      ) as SeoFormState["errors"],
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
    return { status: "success", message: "SEO settings saved." };
  } catch {
    return { status: "error", message: "Failed to save. Please try again." };
  }
}
