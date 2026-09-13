"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCircle,
  FileText,
  Briefcase,
  Layers,
  Sparkles,
  Settings,
  ChevronRight,
  LogOut,
  ScanLine,
  ExternalLink,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Career Profile", href: "/dashboard/profile", icon: UserCircle, badge: "88%" },
  { title: "Resumes", href: "/dashboard/resume", icon: FileText },
  { title: "ATS Analyzer", href: "/dashboard/resume/analyze", icon: ScanLine },
  { title: "Job Matches", href: "/dashboard/jobs", icon: Briefcase, badge: "4 New" },
  { title: "Applications", href: "/dashboard/applications", icon: Layers, badge: "5 Active" },
  { title: "AI Studio", href: "/dashboard/create", icon: Sparkles, highlight: true },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-[#d5d9d9] bg-[#131921] text-gray-200 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between border-b border-[#232f3e] px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex items-center tracking-tight font-black text-lg">
            <span className="text-white">HIREBOOST</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-xs bg-[#f08804] text-[#0f1111] text-xs font-black tracking-widest uppercase">
              AI
            </span>
          </div>
        </Link>
        <span className="rounded bg-[#232f3e] px-1.5 py-0.5 text-[10px] font-semibold text-gray-300">
          PRO TIER
        </span>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Platform
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`group flex items-center justify-between rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-[#f08804] text-[#0f1111] font-bold shadow-xs"
                  : item.highlight
                  ? "text-[#f08804] hover:bg-[#232f3e] hover:text-white"
                  : "text-gray-300 hover:bg-[#232f3e] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? "text-[#0f1111]" : item.highlight ? "text-[#f08804]" : "text-gray-400 group-hover:text-white"
                  }`}
                />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <span
                  className={`rounded-xs px-1.5 py-0.5 text-[10px] font-bold ${
                    isActive
                      ? "bg-[#0f1111] text-[#f08804]"
                      : "bg-[#232f3e] text-gray-300 group-hover:text-white"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Profile Completion Callout */}
        <div className="pt-6 pb-2">
          <div className="rounded-sm border border-[#232f3e] bg-[#0a0e14] p-3 text-xs">
            <div className="flex items-center justify-between font-semibold text-white">
              <span>Profile Strength</span>
              <span className="text-[#f08804] font-bold">88%</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-[#232f3e] overflow-hidden">
              <div className="h-full bg-[#f08804] rounded-full" style={{ width: "88%" }} />
            </div>
            <p className="mt-2 text-[11px] text-gray-400">
              Verify 2 more skills in the AI Interview to reach 100% and unlock high-match alerts.
            </p>
            <Link
              href="/dashboard/profile"
              onClick={onClose}
              className="mt-2 inline-flex items-center text-[11px] font-semibold text-[#f08804] hover:underline"
            >
              Complete Interview <ChevronRight className="h-3 w-3 ml-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer / User Session Summary */}
      <div className="border-t border-[#232f3e] p-3">
        <div className="flex items-center justify-between rounded-sm p-2 hover:bg-[#232f3e]/60 transition-colors">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-7 w-7 shrink-0 rounded-sm bg-[#232f3e] text-white flex items-center justify-center font-bold text-xs border border-[#374151]">
              AM
            </div>
            <div className="truncate">
              <p className="truncate text-xs font-semibold text-white">Alex Morgan</p>
              <p className="truncate text-[10px] text-gray-400">alex.morgan@example.com</p>
            </div>
          </div>
          <Link
            href="/login"
            title="Sign Out"
            className="p-1 text-gray-400 hover:text-white rounded-xs hover:bg-[#374151] transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}