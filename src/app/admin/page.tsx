import React from "react";
import { prisma } from "@/lib/prisma";
import { FolderOpen, Image as ImageIcon, MessageSquareQuote, FileText } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    projectsCount,
    imagesCount,
    testimonialsCount,
    contentItemsCount
  ] = await Promise.all([
    prisma.project.count(),
    prisma.image.count(),
    prisma.testimonial.count(),
    prisma.pageContent.count(),
  ]);

  const stats = [
    { name: "Total Projects", value: projectsCount, icon: FolderOpen, href: "/admin/projects" },
    { name: "Gallery Images", value: imagesCount, icon: ImageIcon, href: "/admin/media" },
    { name: "Testimonials", value: testimonialsCount, icon: MessageSquareQuote, href: "/admin/testimonials" },
    { name: "Content Keys Edited", value: contentItemsCount, icon: FileText, href: "/admin/homepage" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-semibold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-[#888] mt-2">Welcome back to the CS Glaze OS.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={stat.name} 
              href={stat.href}
              className="p-6 rounded-xl bg-[#0a0a0a] border border-[#222] hover:border-[#444] transition-colors group flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[#888] text-sm font-medium">{stat.name}</span>
                <Icon size={18} className="text-[#666] group-hover:text-white transition-colors" />
              </div>
              <div className="text-4xl font-semibold text-white">
                {stat.value}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-8 rounded-xl bg-[#0a0a0a] border border-[#222]">
        <h2 className="text-lg font-medium text-white mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link 
            href="/admin/projects/new" 
            className="px-4 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            + Add New Project
          </Link>
          <Link 
            href="/admin/media" 
            className="px-4 py-2 bg-[#111] border border-[#333] text-white text-sm font-medium rounded-md hover:bg-[#222] transition-colors"
          >
            Upload Media
          </Link>
        </div>
      </div>
    </div>
  );
}
