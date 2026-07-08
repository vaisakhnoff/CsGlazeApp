import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://csglaze.com";

  let lastModified: Date = new Date();
  try {
    const [latestContent, latestService, latestProject, latestTestimonial] = await Promise.all([
      prisma.pageContent.findFirst({ orderBy: { updatedAt: "desc" } }),
      prisma.service.findFirst({ orderBy: { updatedAt: "desc" } }),
      prisma.project.findFirst({ orderBy: { updatedAt: "desc" } }),
      prisma.testimonial.findFirst({ orderBy: { updatedAt: "desc" } }),
    ]);

    const dates = [
      latestContent?.updatedAt,
      latestService?.updatedAt,
      latestProject?.updatedAt,
      latestTestimonial?.updatedAt,
    ].filter((d): d is Date => !!d);

    if (dates.length > 0) {
      lastModified = new Date(Math.max(...dates.map((d) => d.getTime())));
    }
  } catch (error) {
    console.error("Failed to fetch last modified dates for sitemap:", error);
  }

  return [
    {
      url: baseUrl,
      lastModified: lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];
}