import type { MetadataRoute } from "next";

// Regenerate the sitemap at most once per hour via ISR.
// This avoids hitting the DB on every crawl while keeping the file fresh.
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (
    process.env.NEXT_PUBLIC_APP_URL || "https://csglaze.com"
  ).replace(/\/$/, "");

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];
}