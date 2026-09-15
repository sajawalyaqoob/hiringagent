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
  CreditCard,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function DashboardSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [profile, setProfile] = React.useState({
    name: "User",
    email: "user@example.com",
    avatarUrl: "/images/default-avatar.jpg",
    title: "Software Professional",
    role: "user",
    subscriptionStatus: "pending_payment",
  });

  React.useEffect(() => {
    // 1. Fetch user auth status & role
    fetch("/api/auth")
      .then((r) => r.json())
      .then((d) => {
        if (d?.user) {
          setProfile((prev) => ({
            ...prev,
            name: d.user.name || prev.name,
            email: d.user.email || prev.email,
            role: d.user.role || "user",
            subscriptionStatus: d.user.subscriptionStatus || "pending_payment",
          }));
        }
      })
      .catch(() => null);

    // 2. Fetch user profile
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d?.data?.profile) {
          const p = d.data.profile;
          setProfile((prev) => ({
            ...prev,
            name: p.fullName || prev.name,
            email: p.email || prev.email,
            avatarUrl: p.avatarUrl || prev.avatarUrl,
            title: p.currentJobTitle || prev.title,
          }));
        }
      })
      .catch(() => null);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      window.location.href = "/login";
    } catch {
      window.location.href = "/login";
    }
  };

  const navSections = [
    {
      heading: "Overview",
      items: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        ...(profile.role === "admin"
          ? [
              {
                title: "Admin Portal",
                href: "/dashboard/admin",
                icon: ShieldCheck,
                highlight: true,
                badge: "ADMIN",
              },
            ]
          : []),
      ],
    },
    {
      heading: "Career & AI Studio",
      items: [
        { title: "Executive CV Studio", href: "/dashboard/create", icon: Sparkles, highlight: true },
        { title: "Live Job Matches", href: "/dashboard/jobs", icon: Briefcase, badge: "250+" },
        { title: "My Resumes", href: "/dashboard/resume", icon: FileText },
        { title: "ATS Resume Checker", href: "/dashboard/resume/analyze", icon: ScanLine },
        { title: "Job Applications", href: "/dashboard/applications", icon: Layers },
      ],
    },
    {
      heading: "Account & Access",
      items: [
        { title: "My Profile", href: "/dashboard/profile", icon: UserCircle },
        { title: "Help & Support", href: "/dashboard/support", icon: HelpCircle },
        {
          title: "JazzCash Billing",
          href: "/dashboard/billing",
          icon: CreditCard,
          badge:
            profile.subscriptionStatus === "active"
              ? "ACTIVE"
              : profile.subscriptionStatus === "pending_approval"
              ? "REVIEW"
              : "PAY",
        },
        { title: "Settings", href: "/dashboard/settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white text-slate-700 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
        isOpen ? "translate-x-0 shadow-2xl md:shadow-none" : "-translate-x-full"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
        <BrandLogo size="sm" theme="light" href="/dashboard" badgeText="AI" />
        <div className="flex items-center gap-1">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
              profile.role === "admin"
                ? "bg-purple-100 text-purple-800"
                : profile.subscriptionStatus === "active"
                ? "bg-emerald-100 text-emerald-800"
                : profile.subscriptionStatus === "pending_approval"
                ? "bg-amber-100 text-amber-800"
                : "bg-rose-100 text-rose-800"
            }`}
          >
            {profile.role === "admin"
              ? "ADMIN"
              : profile.subscriptionStatus === "active"
              ? "ACTIVE"
              : profile.subscriptionStatus === "pending_approval"
              ? "PENDING"
              : "UNPAID"}
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

      {/* Navigation Links Grouped by Section */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {navSections.map((sec) => (
          <div key={sec.heading} className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              {sec.heading}
            </div>
            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 font-bold shadow-xs"
                      : item.highlight
                      ? "text-indigo-600 hover:bg-indigo-50/50 hover:text-indigo-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
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
                      className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${
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
          </div>
        ))}

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
          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}