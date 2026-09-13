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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function DashboardOverviewPage() {
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

        if (profRes?.success && profRes.data?.completion) {
          setProfileCompletion(profRes.data.completion.percentage);
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
              salary: item.job.salaryMin ? `$${item.job.salaryMin.toLocaleString()} - $${item.job.salaryMax?.toLocaleString()}` : "Market Competitive",
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
              nextAction: app.nextAction || "Follow up on status",
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
    { title: "Active Job Matches", value: matchingCount.toString(), change: "+4 new today", icon: Briefcase, color: "text-[#0f1111]" },
    { title: "Active Applications", value: applicationsCount.toString(), change: `${interviewsCount} in interview loop`, icon: Layers, color: "text-[#0f1111]" },
    { title: "Interviews Scheduled", value: interviewsCount.toString(), change: "Active process", icon: Calendar, color: "text-[#067d62]" },
    { title: "Saved Opportunities", value: "8", change: "Avg 91% Match", icon: Sparkles, color: "text-[#b45309]" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-sm border border-[#d5d9d9] bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#0f1111]">HireBoost Command Center</h1>
              <Badge variant="success" className="gap-1 font-medium">
                <ShieldCheck className="h-3 w-3" />
                Zero-Hallucination Active
              </Badge>
            </div>
            <p className="mt-1 text-xs text-[#565959]">
              Calibrated career profile active. AI generator is constrained strictly to your verified skills and achievements.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <Link href="/dashboard/create">
              <Button variant="primary" size="sm" className="font-bold">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Generate Application Artifact
              </Button>
            </Link>

            <Link href="/dashboard/jobs">
              <Button variant="outline" size="sm" className="font-bold">
                Analyze Job Description
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile Completion Indicator */}
        <div className="mt-5 border-t border-[#e7e7e7] pt-4">
          <div className="flex items-center justify-between text-xs font-bold text-[#0f1111] mb-1.5">
            <div className="flex items-center gap-2">
              <span>Career Profile Completeness</span>
              <span className="text-[#067d62] font-semibold">({profileCompletion}% Calibrated)</span>
            </div>
            <Link href="/dashboard/profile" className="text-[#b45309] hover:underline font-bold flex items-center">
              Complete Remaining Sections <ChevronRight className="h-3 w-3 ml-0.5" />
            </Link>
          </div>
          <Progress value={profileCompletion} className="h-2.5 bg-[#e7e7e7]" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, idx) => {
          const IconComponent = kpi.icon;
          return (
            <Card key={idx} className="border-[#d5d9d9] bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#565959] uppercase tracking-wider">{kpi.title}</span>
                  <div className="rounded-xs bg-[#f7f7f7] p-2 text-[#565959]">
                    <IconComponent className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</span>
                  <span className="text-[11px] font-medium text-[#565959]">{kpi.change}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Grid: Top Matches & Application Tracker */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Top Compatible Job Matches */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-[#d5d9d9] bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#e7e7e7] pb-3">
              <div>
                <CardTitle className="text-base font-bold text-[#0f1111]">Top Matched Opportunities</CardTitle>
                <CardDescription className="text-xs text-[#565959]">
                  Scored deterministically based on skill overlap, experience level, and preferences.
                </CardDescription>
              </div>
              <Link href="/dashboard/jobs">
                <Button variant="ghost" size="sm" className="text-xs font-bold text-[#b45309] hover:bg-[#fffbeb]">
                  View All ({matchingCount}) <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="divide-y divide-[#e7e7e7] p-0">
              {recentMatches.length > 0 ? (
                recentMatches.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-[#fafafa] transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/dashboard/jobs/${item.id}`} className="font-bold text-[#0f1111] hover:text-[#b45309] transition-colors text-sm">
                          {item.title}
                        </Link>
                        <div className="mt-0.5 text-xs text-[#565959]">
                          <span className="font-semibold text-[#0f1111]">{item.company}</span> • {item.location} • <span className="font-mono text-[#0f1111]">{item.salary}</span>
                        </div>
                      </div>

                      <Badge variant={item.matchScore >= 90 ? "success" : "warning"} className="font-bold text-xs shrink-0">
                        {item.matchScore}% Match Score
                      </Badge>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {item.skills.map((skill: string) => (
                        <span key={skill} className="rounded-xs bg-[#f0f2f2] px-2 py-0.5 text-[11px] font-medium text-[#0f1111]">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-[#f3f4f6] pt-2 text-[11px] text-[#565959]">
                      <span>Posted {item.posted}</span>
                      <Link href={`/dashboard/jobs/${item.id}`}>
                        <span className="font-bold text-[#b45309] hover:underline flex items-center">
                          View Match Analysis <ExternalLink className="h-3 w-3 ml-1" />
                        </span>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-[#565959]">
                  No job matches calculated yet. Analyze a job description to generate instant scores.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Active Application Pipeline */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-[#d5d9d9] bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#e7e7e7] pb-3">
              <div>
                <CardTitle className="text-base font-bold text-[#0f1111]">Active Applications</CardTitle>
                <CardDescription className="text-xs text-[#565959]">
                  Track stage changes and upcoming interview prep milestones.
                </CardDescription>
              </div>
              <Link href="/dashboard/applications">
                <Button variant="ghost" size="sm" className="text-xs font-bold text-[#b45309] hover:bg-[#fffbeb]">
                  Full Tracker <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="divide-y divide-[#e7e7e7] p-0">
              {recentApplications.length > 0 ? (
                recentApplications.map((app) => (
                  <div key={app.id} className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-xs text-[#0f1111]">{app.jobTitle}</div>
                        <div className="text-[11px] text-[#565959]">{app.company}</div>
                      </div>
                      <Badge variant={app.badgeVariant} className="text-[10px] uppercase font-bold">
                        {app.stageBadge}
                      </Badge>
                    </div>

                    <div className="rounded-xs bg-[#f7f7f7] p-2 text-[11px] text-[#0f1111]">
                      <span className="font-bold text-[#565959]">Next Action: </span>
                      {app.nextAction}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-[#565959]">
                  No active applications tracked yet. Click Full Tracker to log your first job application.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
