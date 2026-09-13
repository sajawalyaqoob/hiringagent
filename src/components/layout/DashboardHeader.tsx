"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Menu, Plus, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const routeTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Overview",
    subtitle: "Your job search progress, active matches, and interview status.",
  },
  "/dashboard/profile": {
    title: "My Profile",
    subtitle: "Your skills, work experience, and career goals.",
  },
  "/dashboard/resume": {
    title: "My Resumes",
    subtitle: "Manage, upload, and organize your resumes.",
  },
  "/dashboard/resume/analyze": {
    title: "ATS Resume Checker",
    subtitle: "Get your resume score and keyword suggestions.",
  },
  "/dashboard/jobs": {
    title: "Job Matches",
    subtitle: "Curated opportunities matched to your real experience.",
  },
  "/dashboard/applications": {
    title: "Applications Tracker",
    subtitle: "Keep track of every job you've applied to and next steps.",
  },
  "/dashboard/create": {
    title: "AI Tailor Studio",
    subtitle: "Generate tailored resumes and cover letters in seconds.",
  },
  "/dashboard/settings": {
    title: "Settings",
    subtitle: "Manage your account, preferences, and notifications.",
  },
};

export function DashboardHeader({ onToggleSidebar }: HeaderProps) {
  const pathname = usePathname();
  const [notificationOpen, setNotificationOpen] = React.useState(false);
  const [profile, setProfile] = React.useState({
    name: "Alex Morgan",
    avatarUrl: "/images/default-avatar.jpg",
  });

  React.useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d?.data?.profile) {
          setProfile({
            name: d.data.profile.fullName || "User",
            avatarUrl: d.data.profile.avatarUrl || "/images/default-avatar.jpg",
          });
        }
      })
      .catch(() => null);
  }, []);

  // Match title
  const currentRoute = Object.keys(routeTitles)
    .sort((a, b) => b.length - a.length)
    .find((route) => pathname === route || (route !== "/dashboard" && pathname.startsWith(route)));

  const meta = currentRoute
    ? routeTitles[currentRoute]
    : { title: "Dashboard", subtitle: "TalentForge AI Assistant" };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-4 sm:px-6">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden transition-colors"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-col">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {meta.title}
          </h1>
          <p className="hidden sm:block text-xs text-slate-500">
            {meta.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Search, Notifications, Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Global Quick Search */}
        <div className="relative hidden lg:block w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs, skills, companies..."
            className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        {/* AI Studio Shortcut */}
        <Link href="/dashboard/create">
          <Button variant="primary" size="sm" className="hidden sm:inline-flex gap-1.5 font-bold shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Studio</span>
          </Button>
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none"
            aria-label="View Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 text-xs overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/70">
                <span className="font-bold text-slate-900">Notifications</span>
                <span className="text-[11px] text-slate-500 font-medium">3 unread</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                <div className="p-3.5 hover:bg-slate-50 transition-colors">
                  <p className="font-semibold text-slate-900">Stripe match updated: 94% Match</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Senior Full-Stack Engineer position closely aligns with your TypeScript & Kafka experience.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1.5 block">2 hours ago</span>
                </div>
                <div className="p-3.5 hover:bg-slate-50 transition-colors">
                  <p className="font-semibold text-slate-900">ATS Resume analysis complete</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Your primary resume achieved 92/100 ATS compatibility score.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1.5 block">Yesterday</span>
                </div>
                <div className="p-3.5 hover:bg-slate-50 transition-colors">
                  <p className="font-semibold text-slate-900">Follow-up reminder: Vercel</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Scheduled follow-up with Marcus Vance is due today.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1.5 block">3 days ago</span>
                </div>
              </div>
              <div className="border-t border-slate-100 p-2.5 text-center bg-slate-50/50">
                <Link
                  href="/dashboard/applications"
                  onClick={() => setNotificationOpen(false)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  View All Applications →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* View Profile Shortcut */}
        <Link href="/dashboard/profile">
          <div className="flex items-center gap-2 border-l border-slate-200 pl-3 hover:opacity-80 transition-opacity">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200 bg-slate-100">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {profile.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
