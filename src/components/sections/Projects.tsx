import React from "react";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";

export async function Projects() {
  const projectQuery = {
    include: { images: true },
  } satisfies Prisma.ProjectDefaultArgs;

  let projects: Prisma.ProjectGetPayload<typeof projectQuery>[] = [];

  try {
    projects = await prisma.project.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 12,
      include: projectQuery.include,  // all images, not just 1
    });
  } catch (error) {
    console.error("Failed to load projects:", error);
  }

  return <ProjectsGrid projects={projects} />;
}
