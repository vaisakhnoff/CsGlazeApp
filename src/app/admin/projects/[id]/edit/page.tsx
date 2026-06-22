import React from "react";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";
import { notFound } from "next/navigation";
import EditProjectForm from "./EditProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!project) {
    notFound();
  }

  return <EditProjectForm project={project} />;
}
