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

export const metadata: Metadata = {
  title: "CS Glaze | Immersive Architectural Engineering",
  description: "Premium ACP Cladding, Structural Glazing & Glass Solutions",
  openGraph: {
    title: "CS Glaze | Immersive Architectural Engineering",
    description: "Premium ACP Cladding, Structural Glazing & Glass Solutions",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CS Glaze | Immersive Architectural Engineering",
    description: "Premium ACP Cladding, Structural Glazing & Glass Solutions",
  },
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
      <body className="min-h-full flex flex-col font-sans">
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
