"use client";

import * as React from "react";
import Link from "next/link";
import {
  Briefcase,
  Layers,
  Sparkles,
  ArrowRight,
  Calendar,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function DashboardOverviewPage() {
  const [userName, setUserName] = React.useState("Candidate");
  const [userRole, setUserRole] = React.useState("Software Engineer");
  const [profileCompletion, setProfileCompletion] = React.useState(88);
  const [matchingCount, setMatchingCount] = React.useState(14);
  const [applicationsCount, setApplicationsCount] = React.useState(5);
  const [interviewsCount, setInterviewsCount] = React.useState(2);
  const [recentMatches, setRecentMatches] = React.useState<any[]>([]);
  const [recentApplications, setRecentApplications] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function loadDashboardData() {
      try {
        const [profRes, jobsRes, appsRes] = await Promise.all([
          fetch("/api/profile").then((r) => r.json()).catch(() => null),
          fetch("/api/jobs").then((r) => r.json()).catch(() => null),
          fetch("/api/applications").then((r) => r.json()).catch(() => null),
        ]);

        if (profRes?.success && profRes.data?.profile) {
          const p = profRes.data.profile;
          if (p.fullName) {
            setUserName(p.fullName.split(" ")[0]);
          }
          if (p.currentJobTitle) {
            setUserRole(p.currentJobTitle);
          }
          if (profRes.data.completion) {
            setProfileCompletion(profRes.data.completion.percentage);
          }
        }

        if (jobsRes?.success && Array.isArray(jobsRes.data)) {
          setMatchingCount(jobsRes.data.length);
          setRecentMatches(
            jobsRes.data.slice(0, 3).map((item: any) => ({
              id: item.job.id,
              title: item.job.title,
              company: item.job.company,
              location: item.job.location,
              matchScore: item.match?.overallScore || 90,
              salary: item.job.salaryMin
                ? `$${item.job.salaryMin.toLocaleString()} - $${item.job.salaryMax?.toLocaleString()}`
                : "Market Competitive",
              skills: item.job.requiredSkills || [],
              missing: item.match?.missingSkills || [],
              posted: item.job.postedAt ? item.job.postedAt.split("T")[0] : "Recently",
            }))
          );
        }

        if (appsRes?.success && Array.isArray(appsRes.data)) {
          setApplicationsCount(appsRes.data.length);
          const interviews = appsRes.data.filter((a: any) => a.status === "interview" || a.status === "screening");
          setInterviewsCount(interviews.length);
          setRecentApplications(
            appsRes.data.slice(0, 3).map((app: any) => ({
              id: app.id,
              jobTitle: app.jobTitle,
              company: app.company,
              status: app.status,
              stageBadge: app.status.replace("_", " ").toUpperCase(),
              badgeVariant: app.status === "interview" ? "success" : app.status === "offer" ? "success" : "info",
              nextAction: app.nextAction || "Follow up on application status",
              dueDate: app.nextActionDueDate || "Pending",
            }))
          );
        }
      } catch (err) {
        console.warn("Error loading dashboard live data:", err);
      }
    }

    loadDashboardData();
  }, []);

  const kpis = [
    {
      title: "Job Matches",
      value: matchingCount.toString(),
      change: "+4 new today",
      icon: Briefcase,
      iconBg: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Applications Sent",
      value: applicationsCount.toString(),
      change: "5 active submissions",
      icon: Layers,
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      title: "Interviews Active",
      value: interviewsCount.toString(),
      change: "In interview round",
      icon: Calendar,
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Avg Match Score",
      value: "92%",
      change: "Top 5% candidate fit",
      icon: TrendingUp,
      iconBg: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Welcome & Action Header */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {userName}! 👋
              </h1>
              <Badge variant="success" className="gap-1 font-semibold">
                <CheckCircle2 className="h-3 w-3" />
                Profile Active
              </Badge>
            </div>
            <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
              Here is your current career progress as <span className="font-semibold text-slate-800">{userRole}</span>. You have{" "}
              <span className="font-semibold text-slate-800">{matchingCount} live positions</span> calibrated to your skills.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1 lg:pt-0">
            <Link href="/dashboard/create" className="w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full sm:w-auto font-bold shadow-sm">
                <Sparkles className="h-4 w-4 mr-1.5" />
                Create Tailored Resume
              </Button>
            </Link>

            <Link href="/dashboard/jobs" className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full sm:w-auto font-semibold">
                <Search className="h-4 w-4 mr-1.5 text-slate-500" />
                Explore Matches
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile Completion Indicator */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-semibold text-slate-700 mb-2 gap-1">
            <div className="flex items-center gap-2">
              <span>Career Profile Completeness</span>
              <span className="text-indigo-600 font-bold">({profileCompletion}%)</span>
            </div>
            <Link href="/dashboard/profile" className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center">
              Complete remaining details <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
            </Link>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. KPI Metrics Grid (Fully Responsive: 2 cols on mobile, 4 on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {kpis.map((kpi, idx) => {
          const IconComponent = kpi.icon;
          return (
            <Card key={idx} className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
                  {kpi.title}
                </span>
                <div className={`p-2 rounded-xl ${kpi.iconBg} shrink-0`}>
                  <IconComponent className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {kpi.value}
                </div>
                <div className="text-[11px] sm:text-xs font-medium text-slate-500 truncate">
                  {kpi.change}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 3. Main Split Grid: Top Matches & Application Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Top Matched Jobs */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Recommended Job Matches</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Roles scored against your verified skills & experience.
                </CardDescription>
              </div>
              <Link href="/dashboard/jobs">
                <Button variant="ghost" size="sm" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                  View All ({matchingCount}) <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="divide-y divide-slate-100 p-0">
              {recentMatches.length > 0 ? (
                recentMatches.map((item) => (
                  <div key={item.id} className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                      <div>
                        <Link
                          href={`/dashboard/jobs/${item.id}`}
                          className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-sm sm:text-base block"
                        >
                          {item.title}
                        </Link>
                        <div className="mt-1 text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
                          <span className="font-semibold text-slate-800">{item.company}</span>
                          <span>•</span>
                          <span>{item.location}</span>
                          <span>•</span>
                          <span className="font-medium text-slate-700">{item.salary}</span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <Badge variant={item.matchScore >= 90 ? "success" : "warning"} size="md">
                          {item.matchScore}% Match
                        </Badge>
                      </div>
                    </div>

                    {/* Skill tags */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {item.skills.slice(0, 4).map((skill: string) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                      {item.skills.length > 4 && (
                        <span className="text-xs text-slate-400 font-medium">
                          +{item.skills.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                      <span>Posted {item.posted}</span>
                      <div className="flex items-center gap-3">
                        <Link href={`/dashboard/jobs/${item.id}`}>
                          <span className="font-semibold text-indigo-600 hover:underline flex items-center">
                            View Details <ExternalLink className="h-3 w-3 ml-1" />
                          </span>
                        </Link>
                        <Link href={`/dashboard/create`}>
                          <Button variant="primary" size="sm" className="h-7 px-2.5 text-xs">
                            Tailor Resume
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  No job matches calculated yet. Click Explore Matches to find opportunities.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Active Applications Pipeline */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Active Applications</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Track your interview schedule and follow-ups.
                </CardDescription>
              </div>
              <Link href="/dashboard/applications">
                <Button variant="ghost" size="sm" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                  Full Pipeline <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="divide-y divide-slate-100 p-0">
              {recentApplications.length > 0 ? (
                recentApplications.map((app) => (
                  <div key={app.id} className="p-4 sm:p-5 space-y-3 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-slate-900">{app.jobTitle}</div>
                        <div className="text-xs text-slate-500 font-medium">{app.company}</div>
                      </div>
                      <Badge variant={app.badgeVariant} size="sm" className="uppercase font-bold">
                        {app.stageBadge}
                      </Badge>
                    </div>

                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs text-slate-700">
                      <span className="font-bold text-slate-900">Next Action: </span>
                      {app.nextAction}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  No active applications tracked yet. Use the Application Tracker to stay organized.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
