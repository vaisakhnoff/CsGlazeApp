import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditServiceForm from "./EditServiceForm";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service) {
    notFound();
  }

  return <EditServiceForm service={service} />;
}
