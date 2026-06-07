import React from "react";
import { prisma } from "@/lib/prisma";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";

export async function Projects() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 12,
    include: { images: true },  // all images, not just 1
  });

  return <ProjectsGrid projects={projects} />;
}
