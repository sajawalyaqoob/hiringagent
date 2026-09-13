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
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Profile", href: "/dashboard/profile", icon: UserCircle, badge: "88%" },
  { title: "My Resumes", href: "/dashboard/resume", icon: FileText },
  { title: "ATS Checker", href: "/dashboard/resume/analyze", icon: ScanLine },
  { title: "Job Matches", href: "/dashboard/jobs", icon: Briefcase, badge: "4 New" },
  { title: "Applications", href: "/dashboard/applications", icon: Layers, badge: "5 Active" },
  { title: "AI Studio", href: "/dashboard/create", icon: Sparkles, highlight: true },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [profile, setProfile] = React.useState({
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    avatarUrl: "/images/default-avatar.jpg",
    title: "Software Engineer",
  });

  React.useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d?.data?.profile) {
          const p = d.data.profile;
          setProfile({
            name: p.fullName || "User",
            email: p.email || "user@example.com",
            avatarUrl: p.avatarUrl || "/images/default-avatar.jpg",
            title: p.currentJobTitle || "Tech Specialist",
          });
        }
      })
      .catch(() => null);
  }, []);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white text-slate-700 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
        isOpen ? "translate-x-0 shadow-2xl md:shadow-none" : "-translate-x-full"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex items-center tracking-tight font-extrabold text-lg text-slate-900">
            <span>HireBoost</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200/60 text-[9px] font-black tracking-wider uppercase">
              AI
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
            PRO
          </span>
          {/* Close button for mobile drawer */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 md:hidden rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 font-bold shadow-xs"
                  : item.highlight
                  ? "text-indigo-600 hover:bg-indigo-50/50 hover:text-indigo-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive
                      ? "text-indigo-600"
                      : item.highlight
                      ? "text-indigo-600"
                      : "text-slate-400 group-hover:text-slate-700"
                  }`}
                />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Profile Strength Callout */}
        <div className="pt-5 pb-2">
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/60 to-white p-4 text-xs shadow-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>Profile Strength</span>
              <span className="text-indigo-600">88%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-indigo-100/80 overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: "88%" }} />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Add 2 more skills to achieve a 100% profile score and unlock top recruiter matches.
            </p>
            <Link
              href="/dashboard/profile"
              onClick={onClose}
              className="inline-flex items-center text-[11px] font-bold text-indigo-600 hover:text-indigo-700 pt-1"
            >
              Complete Profile <ChevronRight className="h-3 w-3 ml-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer / User Session Summary */}
      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center justify-between rounded-xl p-2 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200 bg-slate-100">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs">
                  {profile.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="truncate">
              <p className="truncate text-xs font-bold text-slate-900">{profile.name}</p>
              <p className="truncate text-[10px] text-slate-400">{profile.title}</p>
            </div>
          </div>
          <Link
            href="/login"
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}