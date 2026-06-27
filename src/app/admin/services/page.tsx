import React from "react";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";
import Link from "next/link";
import { Plus, Edit2 } from "lucide-react";
import { deleteServiceAction } from "./actions";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { ServiceIcon } from "@/components/admin/ServiceIcon";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  await requireAdminSession();

  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-black tracking-tight">Services</h1>
          <p className="text-[#888] mt-1 text-sm">Manage the services displayed on your site.</p>
        </div>
        <Link 
          href="/admin/services/new" 
          className="flex items-center gap-2 px-3.5 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-[#222] transition-colors flex-shrink-0"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">New Service</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>

      {/* Desktop Table */}
      <div className="rounded-xl border border-[#d6d6d6] bg-white overflow-hidden hidden md:block">
        <table className="w-full text-left text-sm text-[#888]">
          <thead className="bg-[#f6f6f6] text-xs uppercase text-[#666] border-b border-[#d6d6d6]">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Icon</th>
              <th className="px-6 py-4 font-medium">Glow</th>
              <th className="px-6 py-4 font-medium">Accent</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d6d6d6]">
            {services.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#666]">
                  No services found. Create your first service.
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="hover:bg-[#f6f6f6] transition-colors">
                  <td className="px-6 py-4 font-medium text-black">{service.title}</td>
                  <td className="px-6 py-4"><ServiceIcon name={service.icon} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-black/10" style={{ background: service.glow }} />
                      <span className="text-xs">{service.glow}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-black/10" style={{ background: service.accent }} />
                      <span className="text-xs">{service.accent}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/services/${service.id}/edit`} className="text-[#888] hover:text-black transition-colors">
                        <Edit2 size={16} />
                      </Link>
                      <AdminDeleteButton action={deleteServiceAction.bind(null, service.id)} label={service.title} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {services.length === 0 ? (
          <div className="py-12 text-center text-[#666] border border-dashed border-[#c7c7c7] rounded-xl">
            No services found. Create your first service.
          </div>
        ) : (
          services.map((service) => (
            <div key={service.id} className="p-4 rounded-xl border border-[#d6d6d6] bg-white">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3 min-w-0">
                  <ServiceIcon name={service.icon} />
                  <h3 className="font-medium text-black text-sm truncate">{service.title}</h3>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/admin/services/${service.id}/edit`} className="p-2 rounded-lg hover:bg-[#f6f6f6] text-[#888]">
                    <Edit2 size={15} />
                  </Link>
                  <AdminDeleteButton action={deleteServiceAction.bind(null, service.id)} label={service.title} />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-[#888]">
                  <div className="w-3 h-3 rounded-full border border-black/10" style={{ background: service.glow }} />
                  Glow
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#888]">
                  <div className="w-3 h-3 rounded-full border border-black/10" style={{ background: service.accent }} />
                  Accent
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
