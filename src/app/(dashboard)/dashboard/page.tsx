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
  Printer,
  ExternalLink,
  ShieldCheck,
  Phone,
  ChevronRight,
  Eye,
  MapPin,
  User,
  AlertTriangle,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { getDomainById } from "@/lib/config/domains";

export default function DashboardOverviewPage() {
  const [userName, setUserName] = React.useState("Candidate");
  const [userRole, setUserRole] = React.useState("Professional Specialist");
  const [userDomain, setUserDomain] = React.useState("Computer Science & IT");
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
  const [subscriptionStatus, setSubscriptionStatus] = React.useState<string>("active");

  // Groq AI Profile Analysis state
  const [aiAnalysis, setAiAnalysis] = React.useState<any>(null);
  const [loadingAi, setLoadingAi] = React.useState<boolean>(true);

  React.useEffect(() => {
    async function loadDashboardData() {
      try {
        const [profRes, jobsRes, authRes, analyzeRes] = await Promise.all([
          fetch("/api/profile").then((r) => r.json()).catch(() => null),
          fetch("/api/jobs").then((r) => r.json()).catch(() => null),
          fetch("/api/auth").then((r) => r.json()).catch(() => null),
          fetch("/api/profile/analyze").then((r) => r.json()).catch(() => null),
        ]);

        if (authRes?.user) {
          setSubscriptionStatus(authRes.user.subscriptionStatus || "pending_payment");
          if (authRes.user.name) {
            setUserName(authRes.user.name.split(" ")[0]);
          }
        }

        if (profRes?.success && profRes.data) {
          const p = profRes.data.profile;
          if (p) {
            setProfile(p);
            if (p.fullName && p.fullName !== "Candidate") {
              setUserName(p.fullName.split(" ")[0]);
            }
            if (p.currentJobTitle) setUserRole(p.currentJobTitle);
            if (p.industry) {
              const domObj = getDomainById(p.industry);
              setUserDomain(domObj.label);
            }
          }
          if (profRes.data.education) setEducationList(profRes.data.education);
          if (profRes.data.experiences) setExperienceList(profRes.data.experiences);
          if (profRes.data.projects) setProjectList(profRes.data.projects);
          if (profRes.data.skills) setSkillsList(profRes.data.skills.map((s: any) => (typeof s === "string" ? s : s.name)));
        }

        if (analyzeRes?.success && analyzeRes.data) {
          setAiAnalysis(analyzeRes.data);
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
      } finally {
        setLoadingAi(false);
      }
    }

    loadDashboardData();
  }, []);

  const linkedInUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(userRole)}&location=${encodeURIComponent(profile.location || "Remote")}`;
  const googleJobsUrl = `https://www.google.com/search?q=jobs+${encodeURIComponent(userRole)}+${encodeURIComponent(profile.location || "Remote")}&ibp=htl;jobs`;

  return (
    <div className="space-y-6">
      {/* JazzCash Payment Alert Banner */}
      {subscriptionStatus === "pending_approval" ? (
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-amber-500/20 p-2 text-amber-700">
              <Clock className="h-5 w-5" />
            </div>
            <div className="space-y-0.5 text-xs">
              <p className="font-bold text-sm text-amber-950">
                JazzCash Payment Under Admin Review
              </p>
              <p className="text-amber-800 leading-relaxed">
                Your payment screenshot has been received and is currently being verified. Your account will be activated shortly.
              </p>
            </div>
          </div>
          <Link href="/dashboard/billing">
            <Button size="sm" variant="outline" className="font-bold text-xs shrink-0 border-amber-300 text-amber-900 bg-white hover:bg-amber-100">
              View Payment Status
            </Button>
          </Link>
        </div>
      ) : subscriptionStatus !== "active" ? (
        <div className="rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 via-white to-amber-50 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-rose-500/20 p-2 text-rose-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm text-rose-950">
                  Account Activation Required (Pakistan JazzCash)
                </p>
                <span className="rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5">
                  Unpaid
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Transfer your subscription fee (Weekly: Rs. 1,499 | Monthly: Rs. 3,499) to JazzCash number <strong>03016532878</strong> to unlock all AI tools.
              </p>
            </div>
          </div>
          <Link href="/dashboard/billing">
            <Button size="sm" variant="primary" className="font-bold text-xs shrink-0 shadow-xs gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white">
              <span>Activate via JazzCash</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      ) : null}

      {/* 1. Dynamic Welcome Banner */}
      <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-r from-white via-indigo-50/20 to-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {userName}! 👋
              </h1>
              <Badge variant="success" className="gap-1 font-semibold">
                <CheckCircle2 className="h-3 w-3" />
                {userDomain} Profile Calibrated
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Your profile is customized for <strong className="text-slate-800 font-semibold">{userRole}</strong> in <strong className="text-indigo-600 font-bold">{userDomain}</strong>.
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
              <Button variant="primary" size="sm" className="rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                <FileText className="h-3.5 w-3.5 mr-1" />
                Executive CV Studio
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Groq AI Profile Strength Analysis Card */}
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/60 via-white to-violet-50/50 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 tracking-tight">
                  Groq AI Profile Strength Analysis
                </h2>
                <Badge variant="info">
                  {aiAnalysis?.fieldDomain || userDomain}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluated specifically for candidate domain and ATS alignment.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-2xl font-black text-indigo-600">
                {aiAnalysis?.overallScore || 85}%
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400">
                {aiAnalysis?.gradeLabel || "Strong Candidate"}
              </span>
            </div>
          </div>
        </div>

        {/* Strengths & Missing Field Gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Highlighted Strengths */}
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4 space-y-2">
            <span className="font-extrabold uppercase text-[11px] text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Highlighted Domain Strengths
            </span>
            <ul className="space-y-1.5 text-slate-700 font-medium">
              {aiAnalysis?.strengthsHighlighted?.map((str: string, idx: number) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{str}</span>
                </li>
              )) || (
                <li className="text-slate-500 italic">Complete profile details to see Groq AI strengths analysis.</li>
              )}
            </ul>
          </div>

          {/* Missing Field Gaps & Recommendations */}
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4 space-y-2">
            <span className="font-extrabold uppercase text-[11px] text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Recommended Field Additions
            </span>
            <ul className="space-y-1.5 text-slate-700 font-medium">
              {aiAnalysis?.missingFieldGaps?.map((gap: string, idx: number) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{gap}</span>
                </li>
              )) || (
                <li className="text-slate-500 italic">Add specific certifications or portfolio links to increase impact.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Three Core Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Resume Status */}
        <Card className="hover:border-indigo-300 transition-all p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
                Personalized Resume
              </span>
              <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Executive CV Sheet</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Formatted specifically for {userDomain} with education, experiences, and project links.
              </p>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1.5 font-medium">
                <GraduationCap className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                {educationList.length > 0 ? (
                  <span className="truncate">{educationList[0].degree} — {educationList[0].institution}</span>
                ) : (
                  <Link href="/onboarding" className="text-indigo-600 hover:underline text-[11px] font-semibold">
                    + Add your degree & university
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                {experienceList.length > 0 ? (
                  <span className="truncate">{experienceList[0].company} • {experienceList[0].duration || "(Current)"}</span>
                ) : (
                  <Link href="/onboarding" className="text-emerald-600 hover:underline text-[11px] font-semibold">
                    + Add work experience & duration
                  </Link>
                )}
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

        {/* Card 2: Live Job Matches */}
        <Card className="hover:border-emerald-300 transition-all p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">
                Dynamic Job Search
              </span>
              <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Briefcase className="h-4 w-4" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{matchingCount} Opportunities</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Query postings matching {userRole} in {userDomain}.
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
                AI Tailor Studio
              </span>
              <div className="h-8 w-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Company Customizer</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Generate customized cover letters and recruiter emails tailored for any employer.
              </p>
            </div>
            <div className="rounded-lg bg-violet-50/60 p-2.5 border border-violet-100 text-[11px] text-violet-800">
              ⚡ Powered by Groq AI for {userDomain}.
            </div>
          </div>

          <div className="pt-4 mt-2">
            <Link href="/dashboard/create">
              <Button variant="primary" size="sm" className="w-full rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white">
                <span>Open AI Studio</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* 4. Candidate Profile Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-indigo-500 shadow-sm bg-slate-100 flex items-center justify-center">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.fullName || userName} className="h-full w-full object-cover" />
              ) : (
                <User className="h-7 w-7 text-slate-400" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">{profile.fullName || userName}</h2>
              <p className="text-xs font-bold text-indigo-600">{profile.professionalHeadline || userRole}</p>
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
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/onboarding">
              <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold border-slate-300">
                Edit Onboarding & Domain
              </Button>
            </Link>
            <Link href="/dashboard/create">
              <Button variant="primary" size="sm" className="rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1">
                <Printer className="h-3.5 w-3.5" />
                Executive CV Studio
              </Button>
            </Link>
          </div>
        </div>

        {/* Detailed Credentials Snippet */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
            <span className="font-extrabold uppercase text-[10px] text-slate-400 flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
              Education & Credentials
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
              Key Domain Project
            </span>
            {projectList.length > 0 ? (
              <>
                <p className="font-bold text-slate-900">{projectList[0].name}</p>
                <p className="text-slate-500 text-[11px] truncate">{projectList[0].projectUrl || projectList[0].githubUrl || "Live project"}</p>
              </>
            ) : (
              <p className="text-slate-400 text-[11px] italic">No projects added yet. Click &quot;Edit Details&quot; to add.</p>
            )}
          </div>
        </div>
      </div>

      {/* Guided Walkthrough Modal */}
      <Modal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
        title="💡 User Guided Walkthrough"
        description="How to get the most out of your career platform:"
      >
        <div className="space-y-4 text-xs text-slate-700">
          <div className="flex items-start gap-3 rounded-xl bg-indigo-50/60 p-3 border border-indigo-100">
            <div className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-indigo-950">Select Your Career Domain</h4>
              <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                Whether you are an Accountant, Doctor, Engineer, Teacher, Lawyer, Designer, or Software Developer, choose your domain in Onboarding.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-emerald-50/60 p-3 border border-emerald-100">
            <div className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-emerald-950">Groq AI Profile Analysis</h4>
              <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                Review your dynamic score and field-tailored recommendations generated by Groq AI.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-violet-50/60 p-3 border border-violet-100">
            <div className="h-6 w-6 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-violet-950">Tailored Resume Generation</h4>
              <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                Generate and print resumes customized specifically for your profile and target company.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              variant="primary"
              onClick={() => setGuideModalOpen(false)}
              className="rounded-xl bg-indigo-600 text-xs font-bold text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
