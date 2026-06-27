import React from "react";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";
import Link from "next/link";
import { Plus, Edit2, MapPin, Calendar, Star } from "lucide-react";
import { deleteProjectAction } from "./actions";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  await requireAdminSession();

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: true },
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-black tracking-tight">Projects</h1>
          <p className="text-[#888] mt-1 text-sm">Manage your portfolio projects.</p>
        </div>
        <Link 
          href="/admin/projects/new" 
          className="flex items-center gap-2 px-3.5 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-[#222] transition-colors flex-shrink-0"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">New Project</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>

      {/* Desktop Table */}
      <div className="rounded-xl border border-[#d6d6d6] bg-white overflow-hidden hidden md:block">
        <table className="w-full text-left text-sm text-[#888]">
          <thead className="bg-[#f6f6f6] text-xs uppercase text-[#666] border-b border-[#d6d6d6]">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium">Featured</th>
              <th className="px-6 py-4 font-medium">Images</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d6d6d6]">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-[#666]">
                  No projects found. Create your first project.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-[#f6f6f6] transition-colors">
                  <td className="px-6 py-4 font-medium text-black">{project.title}</td>
                  <td className="px-6 py-4">{project.category}</td>
                  <td className="px-6 py-4">{project.location || "-"}</td>
                  <td className="px-6 py-4">
                    {project.featured ? (
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs border border-blue-500/20">Featured</span>
                    ) : "-"}
                  </td>
                  <td className="px-6 py-4 text-xs text-[#666]">
                    {project.images.length > 0 ? (
                      <span className="px-2 py-1 bg-[#f6f6f6] rounded-md border border-[#d6d6d6]">
                        {project.images.length} photo{project.images.length !== 1 ? "s" : ""}
                      </span>
                    ) : <span className="text-[#bbb]">No images</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/projects/${project.id}/edit`} className="text-[#888] hover:text-black transition-colors">
                        <Edit2 size={16} />
                      </Link>
                      <AdminDeleteButton action={deleteProjectAction.bind(null, project.id)} label={project.title} />
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
        {projects.length === 0 ? (
          <div className="py-12 text-center text-[#666] border border-dashed border-[#c7c7c7] rounded-xl">
            No projects found. Create your first project.
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="p-4 rounded-xl border border-[#d6d6d6] bg-white">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-black text-sm truncate">{project.title}</h3>
                  <p className="text-xs text-[#888] mt-0.5">{project.category}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/admin/projects/${project.id}/edit`} className="p-2 rounded-lg hover:bg-[#f6f6f6] text-[#888]">
                    <Edit2 size={15} />
                  </Link>
                  <AdminDeleteButton action={deleteProjectAction.bind(null, project.id)} label={project.title} />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#888]">
                {project.location && (
                  <span className="flex items-center gap-1"><MapPin size={11} />{project.location}</span>
                )}
                {project.completionYear && (
                  <span className="flex items-center gap-1"><Calendar size={11} />{project.completionYear}</span>
                )}
                {project.featured && (
                  <span className="flex items-center gap-1 text-blue-500"><Star size={11} />Featured</span>
                )}
                <span className="text-[#aaa]">{project.images.length} image{project.images.length !== 1 ? "s" : ""}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
