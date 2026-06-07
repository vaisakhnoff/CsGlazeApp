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
  Settings 
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: FolderOpen },
  { name: "Homepage Editor", href: "/admin/homepage", icon: LayoutTemplate },
  { name: "Media Library", href: "/admin/media", icon: ImageIcon },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { name: "SEO", href: "/admin/seo", icon: Search },
];

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
    <div className="min-h-screen bg-[#050505] text-[#ededed] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#222] bg-[#0a0a0a] hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[#222]">
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
                    ? "bg-[#222] text-white" 
                    : "text-[#888] hover:text-[#ededed] hover:bg-[#111]"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#222]">
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-[#888] hover:text-[#ededed] hover:bg-[#111] transition-colors"
          >
            <Settings size={18} />
            Settings
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-[#222] bg-[#0a0a0a]">
          <div className="font-medium text-sm text-[#888]">
            {navigation.find(n => n.href === pathname)?.name || "Settings"}
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
              System Online
            </span>
            <div className="w-8 h-8 rounded-full bg-[#222] border border-[#333] flex items-center justify-center text-xs">
              AD
            </div>
          </div>
        </header>

        <nav className="md:hidden border-b border-[#222] bg-[#090909] overflow-x-auto">
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
                      ? "bg-[#222] text-white"
                      : "text-[#888] hover:bg-[#111] hover:text-[#ededed]"
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
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
