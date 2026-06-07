"use server";

import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (password === adminPassword) {
    await createSession();
    redirect("/admin");
  }

  return { error: "Invalid password" };
}
