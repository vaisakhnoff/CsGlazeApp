"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  LayoutTemplate,
  Image as ImageIcon,
  MessageSquareQuote,
  Search,
  Settings,
  Wrench,
} from "lucide-react";
import { AdminToastContainer } from "@/components/admin/AdminToast";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: FolderOpen },
  { name: "Services", href: "/admin/services", icon: Wrench },
  { name: "Homepage Editor", href: "/admin/homepage", icon: LayoutTemplate },
  { name: "Media Library", href: "/admin/media", icon: ImageIcon },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { name: "SEO", href: "/admin/seo", icon: Search },
];

/** Resolve a breadcrumb label for any pathname, including sub-routes. */
function getBreadcrumb(pathname: string): string {
  // Exact match first
  const exact = navigation.find((n) => n.href === pathname);
  if (exact) return exact.name;
  // Sub-route: e.g. /admin/projects/new, /admin/projects/:id/edit
  const sub = navigation
    .filter((n) => n.href !== "/admin") // don't match root for every page
    .find((n) => pathname.startsWith(n.href + "/"));
  if (sub) {
    if (pathname.endsWith("/new")) return `New ${sub.name.replace(/s$/, "")}`;  // "New Project"
    if (pathname.endsWith("/edit")) return `Edit ${sub.name.replace(/s$/, "")}`;  // "Edit Project"
    return sub.name;
  }
  if (pathname === "/admin/settings") return "Settings";
  return "Admin";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mobileNavigation = [
    ...navigation,
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-white text-black flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#d6d6d6] bg-white hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[#d6d6d6]">
          <span className="font-montserrat font-bold text-lg tracking-tight">CS Glaze OS</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-[#eeeeee] text-black" 
                    : "text-[#888] hover:text-black hover:bg-[#f6f6f6]"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#d6d6d6]">
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-[#888] hover:text-black hover:bg-[#f6f6f6] transition-colors"
          >
            <Settings size={18} />
            Settings
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden" style={{ minWidth: 0 }}>
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-[#d6d6d6] bg-white">
          <div className="font-medium text-sm text-[#888]">
            {getBreadcrumb(pathname)}
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
              System Online
            </span>
            <div className="w-8 h-8 rounded-full bg-[#eeeeee] border border-[#c7c7c7] flex items-center justify-center text-xs">
              AD
            </div>
          </div>
        </header>

        <nav className="md:hidden border-b border-[#d6d6d6] bg-white overflow-x-auto">
          <div className="flex min-w-max gap-1 px-3 py-2">
            {mobileNavigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex h-10 items-center gap-2 rounded-md px-3 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[#eeeeee] text-black"
                      : "text-[#888] hover:bg-[#f6f6f6] hover:text-black"
                  }`}
                >
                  <Icon size={15} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
        
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="w-full max-w-5xl mx-auto min-w-0">
            {children}
          </div>
        </div>
        <AdminToastContainer />
      </main>
    </div>
  );
}
