import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { Expertise } from "@/components/sections/Expertise";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { WhatsAppFAB } from "@/components/ui/WhatsAppFAB";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { MarqueeTicker } from "@/components/ui/MarqueeTicker";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DEFAULT_METADATA = {
  title: "CS Glaze | Immersive Architectural Engineering",
  description: "Premium ACP Cladding, Structural Glazing & Glass Solutions",
};

export async function generateMetadata(): Promise<Metadata> {
  let records: { key: string; value: string }[] = [];

  try {
    records = await prisma.pageContent.findMany({
      where: { key: { startsWith: "seo_" } },
    });
  } catch (error) {
    console.error("Failed to load SEO metadata:", error);
  }

  const seo = records.reduce<Record<string, string>>((acc, r) => {
    acc[r.key] = r.value;
    return acc;
  }, {});

  const title = seo["seo_home_title"] || DEFAULT_METADATA.title;
  const description = seo["seo_home_desc"] || DEFAULT_METADATA.description;
  const ogTitle = seo["seo_home_og_title"] || title;
  const ogDesc  = seo["seo_home_og_desc"]  || description;

  return {
    title,
    description,
    keywords: seo["seo_home_keywords"] || undefined,
    openGraph: { title: ogTitle, description: ogDesc, type: "website" },
    twitter: { card: "summary_large_image", title: ogTitle, description: ogDesc },
  };
}

export default async function Home() {
  let services: Record<string, unknown>[] = [];
  let testimonials: {
    id: string;
    client: string;
    company: string | null;
    text: string;
  }[] = [];
  let contentRows: { key: string; value: string }[] = [];

  try {
    [services, testimonials, contentRows] = await Promise.all([
      prisma.service.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.pageContent.findMany(),
    ]);
  } catch (error) {
    console.error("Failed to load home page content:", error);
  }

  const content = contentRows.reduce<Record<string, string>>((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="flex-grow">
        <Hero
          heading={content["hero_heading"]}
          subheading={content["hero_subheading"]}
          phone={content["contact_phone"]}
          whatsapp={content["contact_whatsapp"]}
        />
        <Services initialServices={services} />
        <Projects />
        <Expertise />
        <Testimonials testimonials={testimonials} />
        <Contact
          location={content["contact_location"]}
          email={content["contact_email"]}
          phone={content["contact_phone"]}
          whatsapp={content["contact_whatsapp"]}
        />
      </main>
      <MarqueeTicker />
      <Footer />
      <WhatsAppFAB phone={content["contact_whatsapp"] || content["contact_phone"]} />
    </>
  );
}
