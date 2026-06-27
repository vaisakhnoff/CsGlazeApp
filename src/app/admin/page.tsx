import React from "react";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";
import { FolderOpen, Image as ImageIcon, MessageSquareQuote, FileText, Wrench, Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdminSession();

  const [
    projectsCount,
    servicesCount,
    imagesCount,
    testimonialsCount,
    contentItemsCount
  ] = await Promise.all([
    prisma.project.count(),
    prisma.service.count(),
    prisma.image.count(),
    prisma.testimonial.count(),
    prisma.pageContent.count(),
  ]);

  const stats = [
    { name: "Total Projects", value: projectsCount, icon: FolderOpen, href: "/admin/projects" },
    { name: "Services", value: servicesCount, icon: Wrench, href: "/admin/services" },
    { name: "Gallery Images", value: imagesCount, icon: ImageIcon, href: "/admin/media" },
    { name: "Testimonials", value: testimonialsCount, icon: MessageSquareQuote, href: "/admin/testimonials" },
    { name: "Content Keys", value: contentItemsCount, icon: FileText, href: "/admin/homepage" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-black tracking-tight">Dashboard Overview</h1>
        <p className="text-[#888] mt-1 text-sm">Welcome back to the CS Glaze OS.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={stat.name} 
              href={stat.href}
              className="p-4 sm:p-6 rounded-xl bg-white border border-[#d6d6d6] hover:border-[#999] transition-colors group flex flex-col gap-3 sm:gap-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[#888] text-sm font-medium">{stat.name}</span>
                <Icon size={18} className="text-[#666] group-hover:text-black transition-colors" />
              </div>
              <div className="text-2xl sm:text-4xl font-semibold text-black">
                {stat.value}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-5 sm:p-8 rounded-xl bg-white border border-[#d6d6d6]">
        <h2 className="text-base sm:text-lg font-medium text-black mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-[#222] transition-colors"
          >
            <Plus size={14} /> Add Project
          </Link>
          <Link
            href="/admin/services/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#f6f6f6] border border-[#c7c7c7] text-black text-sm font-medium rounded-md hover:bg-[#eeeeee] transition-colors"
          >
            <Plus size={14} /> Add Service
          </Link>
          <Link
            href="/admin/testimonials"
            className="flex items-center gap-2 px-4 py-2 bg-[#f6f6f6] border border-[#c7c7c7] text-black text-sm font-medium rounded-md hover:bg-[#eeeeee] transition-colors"
          >
            <Plus size={14} /> Add Testimonial
          </Link>
          <Link
            href="/admin/media"
            className="flex items-center gap-2 px-4 py-2 bg-[#f6f6f6] border border-[#c7c7c7] text-black text-sm font-medium rounded-md hover:bg-[#eeeeee] transition-colors"
          >
            Upload Media
          </Link>
        </div>
      </div>
    </div>
  );
}
