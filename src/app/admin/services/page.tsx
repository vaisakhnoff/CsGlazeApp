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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-black tracking-tight">Services</h1>
          <p className="text-[#888] mt-2">Manage the services displayed on your site.</p>
        </div>
        <Link 
          href="/admin/services/new" 
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-[#222] transition-colors"
        >
          <Plus size={16} />
          New Service
        </Link>
      </div>

      <div className="rounded-xl border border-[#d6d6d6] bg-white overflow-hidden">
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
                      {service.glow}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-black/10" style={{ background: service.accent }} />
                      {service.accent}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/services/${service.id}/edit`} className="text-[#888] hover:text-black transition-colors">
                        <Edit2 size={16} />
                      </Link>
                      <AdminDeleteButton
                        action={deleteServiceAction.bind(null, service.id)}
                        label={service.title}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
