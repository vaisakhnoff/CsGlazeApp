"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const ProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  category: z.string().min(2, "Category is required"),
  location: z.string().optional(),
  shortDescription: z.string().max(500, "Keep it under 500 characters").optional(),
  completionYear: z
    .string()
    .regex(/^\d{4}$/, "Must be a valid 4-digit year")
    .optional()
    .or(z.literal("")),
  featured: z.boolean().optional(),
});

export type ProjectFormState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createProjectAction(
  prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const rawData = {
    title: formData.get("title") as string,
    category:
      formData.get("category") === "__custom__"
        ? (formData.get("customCategory") as string)
        : (formData.get("category") as string),
    location: formData.get("location") as string,
    shortDescription: formData.get("shortDescription") as string,
    completionYear: formData.get("completionYear") as string,
    featured: formData.get("featured") === "on",
  };

  const result = ProjectSchema.safeParse(rawData);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const imageIds = formData.getAll("imageIds") as string[];

  const project = await prisma.project.create({
    data: {
      title: result.data.title,
      category: result.data.category,
      location: result.data.location || null,
      shortDescription: result.data.shortDescription || null,
      completionYear: result.data.completionYear || null,
      featured: result.data.featured ?? false,
    },
  });

  // Link uploaded images to this project in order
  if (imageIds.length > 0) {
    await prisma.image.updateMany({
      where: { id: { in: imageIds } },
      data: { projectId: project.id },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProjectAction(id: string) {
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/projects");
  revalidatePath("/");
}
