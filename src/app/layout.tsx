import type { Metadata } from "next";
import { Inter, Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://csglaze.com"
).replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "CS Glaze | Premium ACP Cladding & Structural Glazing",
    template: "%s | CS Glaze",
  },

  description:
    "CS Glaze delivers premium facade engineering solutions — structural glazing, ACP cladding, spider glazing, and unitized curtain wall systems for commercial and residential projects in Kerala and across India.",

  keywords: [
    "structural glazing Kerala",
    "ACP cladding Kerala",
    "facade engineering",
    "spider glazing",
    "unitized curtain wall",
    "glass facade contractor",
    "architectural glazing India",
    "composite panel cladding",
    "CS Glaze",
  ],

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "CS Glaze",
    title: "CS Glaze | Premium ACP Cladding & Structural Glazing",
    description:
      "Premium facade engineering — structural glazing, ACP cladding, spider glazing, and unitized systems for high-end commercial and residential projects.",
    images: [
      {
        url: `${BASE_URL}/cs-glaze-logo.png`,
        width: 1200,
        height: 630,
        alt: "CS Glaze – Premium Facade Engineering",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "CS Glaze | Premium ACP Cladding & Structural Glazing",
    description:
      "Premium facade engineering — structural glazing, ACP cladding, spider glazing, and unitized systems.",
    images: [`${BASE_URL}/cs-glaze-logo.png`],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/** Schema.org LocalBusiness structured data */
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "CS Glaze",
  description:
    "Premium facade engineering company specialising in structural glazing, ACP cladding, spider glazing, and unitized curtain wall systems.",
  url: BASE_URL,
  logo: `${BASE_URL}/cs-glaze-logo.png`,
  image: `${BASE_URL}/cs-glaze-logo.png`,
  telephone: process.env.NEXT_PUBLIC_PHONE || undefined,
  email: process.env.NEXT_PUBLIC_EMAIL || "info@csglaze.com",
  address: {
    "@type": "PostalAddress",
    addressRegion: "Kerala",
    addressCountry: "IN",
  },
  areaServed: ["Kerala", "India"],
  priceRange: "$$",
  knowsAbout: [
    "Structural Glazing",
    "ACP Cladding",
    "Spider Glazing",
    "Unitized Curtain Wall",
    "Facade Engineering",
    "Composite Panel Systems",
  ],
};

import { CustomCursor } from "@/components/ui/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}

