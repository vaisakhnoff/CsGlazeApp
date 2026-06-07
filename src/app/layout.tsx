import type { Metadata } from "next";
import { Inter, Montserrat, Geist } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} ${geist.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-on-surface font-sans selection:bg-tertiary selection:text-on-tertiary">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
