"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const ServiceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(5, "Description is required").max(500),
  icon: z.string().min(2, "Icon name is required"),
  glow: z.string().optional(),
  accent: z.string().optional(),
  overview: z.string().min(5, "Overview is required"),
  specs: z.string().min(2, "At least one spec is required"),
  features: z.string().min(2, "At least one feature is required"),
  applications: z.string().min(2, "At least one application is required"),
  imageUrl: z.string().optional(),
});

export type ServiceFormState = {
  errors?: Record<string, string[]>;
  message?: string;
};

// Helper to convert comma separated strings to JSON array
const toJSONArray = (str: string) => JSON.stringify(str.split(",").map(s => s.trim()).filter(Boolean));

// Helper to fetch URL if an ID is provided
async function getImageUrl(imageUrlOrId?: string | null) {
  if (!imageUrlOrId) return null;
  if (imageUrlOrId.startsWith("http") || imageUrlOrId.startsWith("data:") || imageUrlOrId.startsWith("/")) {
    return imageUrlOrId;
  }
  const img = await prisma.image.findUnique({ where: { id: imageUrlOrId } });
  return img?.url || null;
}

export async function createServiceAction(
  prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  await requireAdminSession();

  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    icon: formData.get("icon") as string,
    glow: formData.get("glow") as string || "rgba(0,0,0,0.08)",
    accent: formData.get("accent") as string || "#000000",
    overview: formData.get("overview") as string,
    specs: formData.get("specs") as string,
    features: formData.get("features") as string,
    applications: formData.get("applications") as string,
    imageUrl: formData.get("imageUrl") as string,
  };

  const result = ServiceSchema.safeParse(rawData);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const finalImageUrl = await getImageUrl(result.data.imageUrl);

  await prisma.service.create({
    data: {
      title: result.data.title,
      description: result.data.description,
      icon: result.data.icon,
      glow: result.data.glow || "rgba(0,0,0,0.08)",
      accent: result.data.accent || "#000000",
      overview: result.data.overview,
      specs: toJSONArray(result.data.specs),
      features: toJSONArray(result.data.features),
      applications: toJSONArray(result.data.applications),
      imageUrl: finalImageUrl,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function updateServiceAction(
  id: string,
  prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  await requireAdminSession();

  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    icon: formData.get("icon") as string,
    glow: (formData.get("glow") as string) || "",
    accent: (formData.get("accent") as string) || "",
    overview: formData.get("overview") as string,
    specs: formData.get("specs") as string,
    features: formData.get("features") as string,
    applications: formData.get("applications") as string,
    imageUrl: (formData.get("imageUrl") as string) || "",
  };

  const result = ServiceSchema.safeParse(rawData);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const finalImageUrl = await getImageUrl(result.data.imageUrl);

  await prisma.service.update({
    where: { id },
    data: {
      title: result.data.title,
      description: result.data.description,
      icon: result.data.icon,
      glow: result.data.glow || "rgba(0,0,0,0.08)",
      accent: result.data.accent || "#000000",
      overview: result.data.overview,
      specs: toJSONArray(result.data.specs),
      features: toJSONArray(result.data.features),
      applications: toJSONArray(result.data.applications),
      imageUrl: finalImageUrl,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function deleteServiceAction(id: string) {
  await requireAdminSession();
  await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/services");
  revalidatePath("/");
}
