"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters."),
  company: z.string().optional(),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export type ContactFormState = {
  status: "idle" | "success" | "error";
  errors?: Partial<Record<"name" | "company" | "email" | "phone" | "message", string>>;
  message?: string;
};

export async function submitContactAction(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const rawData = {
    name: formData.get("name") as string,
    company: (formData.get("company") as string) || undefined,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || undefined,
    message: formData.get("message") as string,
  };

  const result = ContactSchema.safeParse(rawData);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return {
      status: "error",
      errors: {
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        message: fieldErrors.message?.[0],
      },
    };
  }

  try {
    await prisma.contactEnquiry.create({
      data: {
        name: result.data.name,
        company: result.data.company || null,
        email: result.data.email,
        phone: result.data.phone || null,
        message: result.data.message,
      },
    });

    return { status: "success" };
  } catch (err) {
    console.error("Contact form submission failed:", err);
    return {
      status: "error",
      message: "Something went wrong. Please try again or call us directly.",
    };
  }
}
