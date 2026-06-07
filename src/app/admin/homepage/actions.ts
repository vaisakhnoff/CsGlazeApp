"use server";

import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function checkAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session")?.value;
  const session = await verifySession(sessionCookie);
  if (!session?.auth) {
    throw new Error("Unauthorized");
  }
}

export async function saveContentAction(formData: FormData) {
  await checkAuth();

  const entries = Array.from(formData.entries());
  
  // Use a transaction to upsert all keys
  await prisma.$transaction(
    entries.map(([key, value]) => {
      return prisma.pageContent.upsert({
        where: { key },
        update: { value: value as string },
        create: { key, value: value as string },
      });
    })
  );

  // Revalidate the main homepage so it fetches new content
  revalidatePath("/");
}
