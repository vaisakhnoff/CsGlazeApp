"use server";

import { prisma } from "@/lib/prisma";
import { sendQuoteEnquiryEmail } from "@/lib/mailer";
import { z } from "zod";

const ContactSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Name is too long."),
  company: z.string().max(100, "Company name is too long.").optional(),
  email: z.string().email("Enter a valid email address."),
  phone: z
    .string()
    .regex(/^[+\d][\d\s\-().]{6,19}$/, "Enter a valid phone number.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "Please describe your project in at least 10 characters.")
    .max(2000, "Message is too long (max 2000 characters)."),
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
        phone: fieldErrors.phone?.[0],
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

    await sendQuoteEnquiryEmail({
      name: result.data.name,
      company: result.data.company,
      email: result.data.email,
      phone: result.data.phone,
      message: result.data.message,
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
