"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Sparkles,
  Layers,
  UserCircle,
} from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

const mobileNavItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
  { title: "AI Studio", href: "/dashboard/create", icon: Sparkles, highlight: true },
  { title: "Apps", href: "/dashboard/applications", icon: Layers },
  { title: "Profile", href: "/dashboard/profile", icon: UserCircle },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Persistent / Responsive Sidebar */}
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DashboardHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Quick-Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200/90 bg-white/95 backdrop-blur-md flex items-center justify-around h-16 px-2 shadow-lg">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-semibold transition-colors ${
                isActive
                  ? "text-indigo-600"
                  : item.highlight
                  ? "text-indigo-500 hover:text-indigo-600"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? "bg-indigo-50" : item.highlight ? "bg-indigo-50/50" : ""
                }`}
              >
                <Icon className={`h-5 w-5 ${item.highlight && !isActive ? "text-indigo-600" : ""}`} />
              </div>
              <span className="mt-0.5">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
