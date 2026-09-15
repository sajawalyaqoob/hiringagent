"use client";

import * as React from "react";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  Sparkles,
  ArrowRight,
  GraduationCap,
  FolderGit2,
  CheckCircle2,
  Search,
  HelpCircle,
  Clock,
  Globe,
  Printer,
  ExternalLink,
  ShieldCheck,
  Phone,
  Mail,
  GitBranch,
  ChevronRight,
  Eye,
  MapPin,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

export default function DashboardOverviewPage() {
  const [userName, setUserName] = React.useState("Candidate");
  const [userRole, setUserRole] = React.useState("Full Stack Developer");
  const [matchingCount, setMatchingCount] = React.useState(250);
  const [recentMatches, setRecentMatches] = React.useState<any[]>([]);
  const [guideModalOpen, setGuideModalOpen] = React.useState(false);

  // Full candidate data
  const [profile, setProfile] = React.useState<any>({
    fullName: "",
    professionalHeadline: "",
    email: "",
    phone: "",
    location: "",
    githubUrl: "",
    avatarUrl: "",
  });
  const [educationList, setEducationList] = React.useState<any[]>([]);
  const [experienceList, setExperienceList] = React.useState<any[]>([]);
  const [projectList, setProjectList] = React.useState<any[]>([]);
  const [skillsList, setSkillsList] = React.useState<string[]>([]);

  React.useEffect(() => {
    async function loadDashboardData() {
      try {
        const [profRes, jobsRes] = await Promise.all([
          fetch("/api/profile").then((r) => r.json()).catch(() => null),
          fetch("/api/jobs").then((r) => r.json()).catch(() => null),
        ]);

        if (profRes?.success && profRes.data) {
          const p = profRes.data.profile;
          if (p) {
            setProfile(p);
            if (p.fullName) setUserName(p.fullName.split(" ")[0]);
            if (p.currentJobTitle) setUserRole(p.currentJobTitle);
          }
          if (profRes.data.education) setEducationList(profRes.data.education);
          if (profRes.data.experiences) setExperienceList(profRes.data.experiences);
          if (profRes.data.projects) setProjectList(profRes.data.projects);
          if (profRes.data.skills) setSkillsList(profRes.data.skills.map((s: any) => s.name));
        }

        if (jobsRes?.success && Array.isArray(jobsRes.data)) {
          setMatchingCount(jobsRes.data.length);
          setRecentMatches(
            jobsRes.data.slice(0, 3).map((item: any) => ({
              id: item.job.id,
              title: item.job.title,
              company: item.job.company,
              location: item.job.location,
              matchScore: item.match?.overallScore || 92,
              salary: item.job.salaryMin
                ? `$${item.job.salaryMin.toLocaleString()} - $${(item.job.salaryMax || item.job.salaryMin * 1.3).toLocaleString()}`
                : "Market Competitive",
              skills: item.job.requiredSkills || [],
              sourceUrl: item.job.sourceUrl,
            }))
          );
        }
      } catch (err) {
        console.warn("Error loading dashboard live data:", err);
      }
    }

    loadDashboardData();
  }, []);

  const linkedInUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(userRole)}&location=${encodeURIComponent(profile.location || "Remote")}`;
  const googleJobsUrl = `https://www.google.com/search?q=jobs+${encodeURIComponent(userRole)}+${encodeURIComponent(profile.location || "Remote")}&ibp=htl;jobs`;

  return (
    <div className="space-y-6">
      {/* 1. Welcome Header & Guidance CTA */}
      <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-r from-white via-indigo-50/20 to-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {userName}! 👋
              </h1>
              <Badge variant="success" className="gap-1 font-semibold">
                <CheckCircle2 className="h-3 w-3" />
                InvoZone Standard Active
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Your profile is calibrated as <strong className="text-slate-800 font-semibold">{userRole}</strong>.
              You have <strong className="text-indigo-600 font-bold">{matchingCount} live positions</strong> ready for direct application.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGuideModalOpen(true)}
              className="rounded-xl border-indigo-200 text-xs font-semibold text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100"
            >
              <HelpCircle className="h-3.5 w-3.5 mr-1 text-indigo-600" />
              💡 Guided Walkthrough
            </Button>

            <Link href="/dashboard/create">
              <Button variant="primary" size="sm" className="rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                <FileText className="h-3.5 w-3.5 mr-1" />
                View & Print InvoZone CV
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Three Clean, High-Value Core Cards (Decluttered UI) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: InvoZone-Standard CV Status */}
        <Card className="hover:border-indigo-300 transition-all p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
                Professional Resume
              </span>
              <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">InvoZone-Standard CV</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Complete with photo, education, experiences with exact time periods, and project links.
              </p>
            </div>
            <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1.5 font-medium">
                <GraduationCap className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                <span className="truncate">{educationList[0]?.degree || "BS Computer Science (BSCS)"}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{experienceList[0]?.company || "UET Incubation Center"} {experienceList[0]?.duration || "(3 Months)"}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2">
            <Link href="/dashboard/create">
              <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold border-slate-200">
                <Eye className="h-3.5 w-3.5 mr-1" />
                Preview & Print PDF
              </Button>
            </Link>
          </div>
        </Card>

        {/* Card 2: Live Job Matches & 1-Click Search */}
        <Card className="hover:border-emerald-300 transition-all p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">
                Dynamic Job Discovery
              </span>
              <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Briefcase className="h-4 w-4" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{matchingCount} Live Tech Jobs</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Real-time openings matched against your skills with direct 1-click external query buttons.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-blue-50 border border-blue-200/80 px-2 py-1 text-[11px] font-bold text-[#0a66c2] hover:bg-blue-100"
              >
                <span>LinkedIn Jobs ↗</span>
              </a>
              <a
                href={googleJobsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200/80 px-2 py-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100"
              >
                <span>Google Jobs ↗</span>
              </a>
            </div>
          </div>

          <div className="pt-4 mt-2">
            <Link href="/dashboard/jobs">
              <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold border-slate-200">
                <Search className="h-3.5 w-3.5 mr-1" />
                Browse All Matches
              </Button>
            </Link>
          </div>
        </Card>

        {/* Card 3: AI Tailor Studio */}
        <Card className="hover:border-violet-300 transition-all p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-violet-600">
                AI Application Studio
              </span>
              <div className="h-8 w-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Instant AI Tailor</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Generate customized cover letters, recruiter InMails, and tailored bullets for any company in seconds.
              </p>
            </div>
            <div className="rounded-lg bg-violet-50/60 p-2.5 border border-violet-100 text-[11px] text-violet-800">
              ⚡ Powered by Groq AI — zero hallucinations.
            </div>
          </div>

          <div className="pt-4 mt-2">
            <Link href="/dashboard/create">
              <Button variant="primary" size="sm" className="w-full rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700">
                <span>Open AI Studio</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* 3. Live Candidate Card Preview (InvoZone Agency Style) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-indigo-500 shadow-sm bg-slate-100 flex items-center justify-center">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.fullName || "Candidate"} className="h-full w-full object-cover" />
              ) : (
                <User className="h-7 w-7 text-slate-400" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">{profile.fullName || userName || "Candidate Profile"}</h2>
              <p className="text-xs font-bold text-indigo-600">{profile.professionalHeadline || userRole || "Professional Candidate"}</p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    {profile.location}
                  </span>
                )}
                {profile.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-slate-400" />
                    {profile.phone}
                  </span>
                )}
                {profile.githubUrl && (
                  <span className="flex items-center gap-1">
                    <GitBranch className="h-3 w-3 text-slate-400" />
                    {profile.githubUrl}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/onboarding">
              <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold border-slate-300">
                Edit Details
              </Button>
            </Link>
            <Link href="/dashboard/create">
              <Button variant="primary" size="sm" className="rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1">
                <Printer className="h-3.5 w-3.5" />
                InvoZone CV Studio
              </Button>
            </Link>
          </div>
        </div>

        {/* Detailed Credentials Snippet */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
            <span className="font-extrabold uppercase text-[10px] text-slate-400 flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
              Education
            </span>
            {educationList.length > 0 ? (
              <>
                <p className="font-bold text-slate-900">{educationList[0].degree}</p>
                <p className="text-slate-500 text-[11px]">{educationList[0].institution} {educationList[0].endDate ? `(${educationList[0].endDate})` : ""}</p>
              </>
            ) : (
              <p className="text-slate-400 text-[11px] italic">No education added yet. Click &quot;Edit Details&quot; to add.</p>
            )}
          </div>

          <div className="space-y-1.5 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
            <span className="font-extrabold uppercase text-[10px] text-slate-400 flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5 text-emerald-600" />
              Recent Experience
            </span>
            {experienceList.length > 0 ? (
              <>
                <p className="font-bold text-slate-900">{experienceList[0].jobTitle}</p>
                <p className="text-slate-500 text-[11px]">{experienceList[0].company} • <strong className="text-emerald-700">{experienceList[0].duration || "(Current)"}</strong></p>
              </>
            ) : (
              <p className="text-slate-400 text-[11px] italic">No experience added yet. Click &quot;Edit Details&quot; to add.</p>
            )}
          </div>

          <div className="space-y-1.5 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
            <span className="font-extrabold uppercase text-[10px] text-slate-400 flex items-center gap-1">
              <FolderGit2 className="h-3.5 w-3.5 text-violet-600" />
              Key Project
            </span>
            {projectList.length > 0 ? (
              <>
                <p className="font-bold text-slate-900">{projectList[0].name}</p>
                <p className="text-slate-500 text-[11px] truncate">{projectList[0].projectUrl || projectList[0].githubUrl || "Live application"}</p>
              </>
            ) : (
              <p className="text-slate-400 text-[11px] italic">No projects added yet. Click &quot;Edit Details&quot; to add.</p>
            )}
          </div>
        </div>
      </div>

      {/* 4. Top Matched Opportunities List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-bold text-slate-800">Top Recommended Matches for You</span>
          <Link href="/dashboard/jobs" className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center">
            View all {matchingCount} live jobs <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recentMatches.map((job) => (
            <Card key={job.id} className="p-4 space-y-2.5 hover:border-indigo-300 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{job.title}</h4>
                  <p className="text-[11px] text-indigo-600 font-semibold">{job.company} • {job.location}</p>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-black shrink-0">
                  {job.matchScore}%
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {job.skills.slice(0, 3).map((sk: string) => (
                  <span key={sk} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                    {sk}
                  </span>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 text-[11px]">{job.salary}</span>
                {job.sourceUrl && (
                  <a
                    href={job.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 font-bold text-[11px] flex items-center gap-0.5"
                  >
                    Direct Apply <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Guided Walkthrough Modal */}
      <Modal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
        title="💡 New User Guided Walkthrough"
        description="Here is how to get the most out of your career platform in 4 simple steps:"
      >
        <div className="space-y-4 text-xs text-slate-700">
          <div className="flex items-start gap-3 rounded-xl bg-indigo-50/60 p-3 border border-indigo-100">
            <div className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-indigo-950">Complete Your InvoZone-Standard Profile</h4>
              <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                Add your phone number, GitHub link, degree, and work experience with exact time periods (e.g. <em>&quot;(3 Months)&quot;</em>) in the Onboarding or Profile wizard.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-emerald-50/60 p-3 border border-emerald-100">
            <div className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-emerald-950">View & Download Your Agency-Standard CV</h4>
              <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                Head to the <strong>AI Tailor Studio</strong> or click &quot;Print / Save PDF&quot; to export your formatted CV styled exactly like top software agencies (InvoZone, Turing, Toptal).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-blue-50/60 p-3 border border-blue-100">
            <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-blue-950">1-Click Live Search on LinkedIn & Google Jobs</h4>
              <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                Click the <strong>LinkedIn Jobs</strong> or <strong>Google Jobs</strong> buttons to automatically query live postings matching your calibrated title and city.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-violet-50/60 p-3 border border-violet-100">
            <div className="h-6 w-6 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              4
            </div>
            <div>
              <h4 className="font-bold text-violet-950">Tailor for Any Specific Company</h4>
              <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                Paste any job description to generate high-response cover letters and recruiter intro emails in 1 second with Groq AI.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              variant="primary"
              onClick={() => setGuideModalOpen(false)}
              className="rounded-xl bg-indigo-600 text-xs font-bold"
            >
              Ready to Explore
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
