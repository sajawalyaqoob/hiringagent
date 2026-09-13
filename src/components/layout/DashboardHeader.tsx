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
    title: "Executive Overview",
    subtitle: "Real-time candidate compatibility metrics, active matches, and application pipeline.",
  },
  "/dashboard/profile": {
    title: "Career Profile Builder",
    subtitle: "Verified skills, work history, and AI Career Interview calibration.",
  },
  "/dashboard/resume": {
    title: "Resume Management",
    subtitle: "Parsed ATS resumes, versions, and primary active distribution documents.",
  },
  "/dashboard/resume/analyze": {
    title: "ATS Compatibility Analyzer",
    subtitle: "Deep formatting analysis, keyword coverage, and quantifiable impact verification.",
  },
  "/dashboard/jobs": {
    title: "Job Discovery & Compatibility",
    subtitle: "Market opportunities filtered and scored against your verified profile experience.",
  },
  "/dashboard/applications": {
    title: "Application Pipeline Tracker",
    subtitle: "Track outreach stages from initial discovery through offers and interview loops.",
  },
  "/dashboard/create": {
    title: "AI Generation Studio",
    subtitle: "Generate tailored resumes, cover letters, and recruiter outreach with zero hallucinations.",
  },
  "/dashboard/settings": {
    title: "Platform Settings",
    subtitle: "Manage account security, AI preferences, subscription tiers, and privacy controls.",
  },
};

export function DashboardHeader({ onToggleSidebar }: HeaderProps) {
  const pathname = usePathname();
  const [notificationOpen, setNotificationOpen] = React.useState(false);

  // Match title
  const currentRoute = Object.keys(routeTitles)
    .sort((a, b) => b.length - a.length)
    .find((route) => pathname === route || (route !== "/dashboard" && pathname.startsWith(route)));

  const meta = currentRoute
    ? routeTitles[currentRoute]
    : { title: "Dashboard", subtitle: "HireBoost AI Candidate Assistant" };

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-[#d5d9d9] bg-white px-4 sm:px-6">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-xs p-1.5 text-gray-700 hover:bg-gray-100 md:hidden"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-[#0f1111] tracking-tight sm:text-base">
              {meta.title}
            </h1>
            <span className="hidden lg:inline-block rounded-xs bg-[#f8f9fa] border border-[#d5d9d9] px-2 py-0.5 text-[11px] font-medium text-[#565959]">
              Alex Morgan (Senior Engineer)
            </span>
          </div>
        </div>
      </div>

      {/* Right: Search, Notifications, Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Global Quick Search */}
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs, skills, companies..."
            className="h-8 w-full rounded-xs border border-[#d5d9d9] bg-[#f8f9fa] pl-8 pr-3 text-xs text-[#0f1111] placeholder-gray-500 focus:border-[#f08804] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f08804]"
          />
        </div>

        {/* AI Studio Shortcut */}
        <Link href="/dashboard/create">
          <Button variant="primary" size="sm" className="hidden sm:inline-flex gap-1.5 font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate Content</span>
          </Button>
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative rounded-xs p-1.5 text-gray-600 hover:bg-gray-100 hover:text-black focus:outline-none"
            aria-label="View Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#f08804]" />
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xs border border-[#d5d9d9] bg-white shadow-lg z-50 text-xs">
              <div className="flex items-center justify-between border-b border-[#e5e7eb] px-3 py-2 bg-[#f8f9fa]">
                <span className="font-bold text-[#0f1111]">Notifications</span>
                <span className="text-[10px] text-[#565959]">3 unread</span>
              </div>
              <div className="divide-y divide-[#f3f4f6]">
                <div className="p-3 hover:bg-gray-50 transition-colors">
                  <p className="font-semibold text-[#0f1111]">Stripe match updated: 94% Match</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Senior Full-Stack Engineer position closely aligns with your TypeScript & Kafka experience.
                  </p>
                  <span className="text-[10px] text-gray-400 mt-1 block">2 hours ago</span>
                </div>
                <div className="p-3 hover:bg-gray-50 transition-colors">
                  <p className="font-semibold text-[#0f1111]">ATS Resume analysis complete</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Your primary resume achieved 92/100 ATS compatibility score.
                  </p>
                  <span className="text-[10px] text-gray-400 mt-1 block">Yesterday</span>
                </div>
                <div className="p-3 hover:bg-gray-50 transition-colors">
                  <p className="font-semibold text-[#0f1111]">Follow-up reminder: Vercel</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Scheduled follow-up with Marcus Vance is due today.
                  </p>
                  <span className="text-[10px] text-gray-400 mt-1 block">3 days ago</span>
                </div>
              </div>
              <div className="border-t border-[#e5e7eb] p-2 text-center bg-[#f8f9fa]">
                <Link
                  href="/dashboard/applications"
                  onClick={() => setNotificationOpen(false)}
                  className="text-[11px] font-semibold text-[#b45309] hover:underline"
                >
                  View All Action Items
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* View Profile Shortcut */}
        <Link href="/dashboard/profile">
          <div className="flex items-center gap-2 border-l border-[#d5d9d9] pl-3 hover:opacity-80 transition-opacity">
            <div className="h-7 w-7 rounded-xs bg-[#131921] text-white flex items-center justify-center text-xs font-bold">
              AM
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
