import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit2, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Projects</h1>
          <p className="text-[#888] mt-2">Manage your portfolio projects.</p>
        </div>
        <Link 
          href="/admin/projects/new" 
          className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
        >
          <Plus size={16} />
          New Project
        </Link>
      </div>

      <div className="rounded-xl border border-[#222] bg-[#0a0a0a] overflow-hidden">
        <table className="w-full text-left text-sm text-[#888]">
          <thead className="bg-[#111] text-xs uppercase text-[#666] border-b border-[#222]">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium">Featured</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#666]">
                  No projects found. Create your first project.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-[#111] transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{project.title}</td>
                  <td className="px-6 py-4">{project.category}</td>
                  <td className="px-6 py-4">{project.location || "-"}</td>
                  <td className="px-6 py-4">
                    {project.featured ? (
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs border border-blue-500/20">Featured</span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/projects/${project.id}/edit`} className="text-[#888] hover:text-white transition-colors">
                        <Edit2 size={16} />
                      </Link>
                      <button className="text-[#888] hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
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
