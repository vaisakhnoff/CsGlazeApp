"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveSeoAction(formData: FormData) {
  const entries = Array.from(formData.entries());
  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.pageContent.upsert({
        where: { key },
        update: { value: value as string },
        create: { key, value: value as string },
      })
    )
  );
  revalidatePath("/");
}
