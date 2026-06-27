"use server";

import { deleteSession, requireAdminSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login");
}

export type PasswordChangeState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function changePasswordAction(
  _prev: PasswordChangeState,
  formData: FormData
): Promise<PasswordChangeState> {
  await requireAdminSession();

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validate current password
  if (!currentPassword || currentPassword !== process.env.ADMIN_PASSWORD) {
    return { status: "error", message: "Current password is incorrect." };
  }

  // Validate new password
  if (!newPassword || newPassword.length < 6) {
    return { status: "error", message: "New password must be at least 6 characters." };
  }

  if (newPassword !== confirmPassword) {
    return { status: "error", message: "New passwords do not match." };
  }

  if (newPassword === currentPassword) {
    return { status: "error", message: "New password must be different from current password." };
  }

  // Update .env file
  try {
    const envPath = join(process.cwd(), ".env");
    let envContent = await readFile(envPath, "utf-8");

    // Replace the ADMIN_PASSWORD line
    if (envContent.includes("ADMIN_PASSWORD=")) {
      envContent = envContent.replace(
        /ADMIN_PASSWORD=.*/,
        `ADMIN_PASSWORD=${newPassword}`
      );
    } else {
      // Add it if it doesn't exist
      envContent += `\nADMIN_PASSWORD=${newPassword}\n`;
    }

    await writeFile(envPath, envContent, "utf-8");

    // Update the runtime environment variable so it takes effect immediately
    process.env.ADMIN_PASSWORD = newPassword;

    return { status: "success", message: "Password changed successfully. It will persist across restarts." };
  } catch {
    return { status: "error", message: "Failed to update password file. Check file permissions." };
  }
}
