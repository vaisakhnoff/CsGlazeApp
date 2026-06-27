"use client";

import React, { useState } from "react";
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
  Menu,
  X,
} from "lucide-react";
import { AdminToastContainer } from "@/components/admin/AdminToast";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: FolderOpen },
  { name: "Services", href: "/admin/services", icon: Wrench },
  { name: "Homepage", href: "/admin/homepage", icon: LayoutTemplate },
  { name: "Media", href: "/admin/media", icon: ImageIcon },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { name: "SEO", href: "/admin/seo", icon: Search },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

function getBreadcrumb(pathname: string): string {
  const exact = navigation.find((n) => n.href === pathname);
  if (exact) return exact.name;
  const sub = navigation
    .filter((n) => n.href !== "/admin")
    .find((n) => pathname.startsWith(n.href + "/"));
  if (sub) {
    if (pathname.endsWith("/new")) return `New ${sub.name.replace(/s$/, "")}`;
    if (pathname.endsWith("/edit")) return `Edit ${sub.name.replace(/s$/, "")}`;
    return sub.name;
  }
  return "Admin";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[100dvh] bg-white text-black flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-[#d6d6d6] bg-white hidden md:flex flex-col fixed inset-y-0 left-0 z-30">
        <div className="h-16 flex items-center px-6 border-b border-[#d6d6d6]">
          <span className="font-heading font-bold text-lg tracking-tight">CS Glaze OS</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 max-w-[80vw] h-full bg-white border-r border-[#d6d6d6] flex flex-col animate-in slide-in-from-left duration-200">
            <div className="h-14 flex items-center justify-between px-5 border-b border-[#d6d6d6]">
              <span className="font-heading font-bold text-base tracking-tight">CS Glaze OS</span>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-[#f6f6f6]">
                <X size={18} className="text-[#666]" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium transition-colors ${
                      isActive
                        ? "bg-[#eeeeee] text-black"
                        : "text-[#666] active:bg-[#f6f6f6]"
                    }`}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[100dvh] md:ml-64" style={{ minWidth: 0 }}>
        {/* Header */}
        <header className="h-14 md:h-16 flex items-center justify-between px-4 md:px-8 border-b border-[#d6d6d6] bg-white flex-shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg hover:bg-[#f6f6f6] active:bg-[#eeeeee]"
              aria-label="Open menu"
            >
              <Menu size={20} className="text-[#666]" />
            </button>
            <span className="font-medium text-sm text-[#666]">
              {getBreadcrumb(pathname)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs px-2 py-1 bg-green-500/10 text-green-600 rounded-full border border-green-500/20">
              Online
            </span>
            <div className="w-8 h-8 rounded-full bg-[#eeeeee] border border-[#c7c7c7] flex items-center justify-center text-xs font-medium">
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
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
