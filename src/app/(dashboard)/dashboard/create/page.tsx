"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  FileText,
  Mail,
  Send,
  Compass,
  Copy,
  Printer,
  Eye,
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Check,
  HelpCircle,
  ArrowRight,
  EyeOff,
  Camera,
  MapPin,
  Phone,
  Mail as MailIcon,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { getDomainById } from "@/lib/config/domains";
import type { GenerationType, GenerationState } from "@/types/database";

const GENERATION_MODES: Array<{ id: GenerationType; title: string; desc: string; icon: React.ElementType }> = [
  { id: "tailored_resume", title: "Executive Tailored CV", desc: "Tailored CV matching target role", icon: FileText },
  { id: "cover_letter", title: "Cover Letter", desc: "Persuasive personalized letter", icon: Mail },
  { id: "recruiter_email", title: "Recruiter Email", desc: "High-response intro email", icon: Send },
  { id: "linkedin_post", title: "LinkedIn Post", desc: "Career broadcast post", icon: Compass },
  { id: "recruiter_message", title: "LinkedIn InMail", desc: "Concise 300-char message", icon: Send },
  { id: "application_strategy", title: "Interview Strategy", desc: "Talking points & prep notes", icon: Compass },
];

export default function AiGenerationCenterPage() {
  const searchParams = useSearchParams();
  const initialJobTitle = searchParams.get("jobTitle") || "Professional Specialist";
  const initialCompany = searchParams.get("company") || "Target Organization";

  // Mode: "live" (user's real data) or "sample"
  const [viewSample, setViewSample] = React.useState<boolean>(false);

  // Live Candidate Profile State
  const [profile, setProfile] = React.useState({
    fullName: "Candidate",
    professionalHeadline: "Professional Specialist",
    email: "",
    phone: "",
    location: "",
    githubUrl: "",
    linkedInUrl: "",
    avatarUrl: "",
    bio: "",
    industry: "cs_it",
  });

  const [educationList, setEducationList] = React.useState<any[]>([]);
  const [experienceList, setExperienceList] = React.useState<any[]>([]);
  const [projectList, setProjectList] = React.useState<any[]>([]);
  const [rawSkills, setRawSkills] = React.useState<string[]>([]);

  const [selectedMode, setSelectedMode] = React.useState<GenerationType>("tailored_resume");
  const [jobTitle, setJobTitle] = React.useState(initialJobTitle);
  const [company, setCompany] = React.useState(initialCompany);
  const [jobDescription, setJobDescription] = React.useState("");
  const [tone, setTone] = React.useState<"professional" | "confident" | "enthusiastic" | "concise">("professional");
  const [includePhoto, setIncludePhoto] = React.useState<boolean>(true);
  const [helpModalOpen, setHelpModalOpen] = React.useState(false);

  // Generation state
  const [status, setStatus] = React.useState<GenerationState>("completed");
  const [outputContent, setOutputContent] = React.useState<string>("");
  const [copied, setCopied] = React.useState(false);

  // Fetch candidate profile from API
  React.useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d?.data) {
          if (d.data.profile) {
            const p = d.data.profile;
            setProfile({
              fullName: p.fullName || "Candidate",
              professionalHeadline: p.professionalHeadline || "Professional Specialist",
              email: p.email || "",
              phone: p.phone || "",
              location: p.location || "",
              githubUrl: p.githubUrl || "",
              linkedInUrl: p.linkedInUrl || "",
              avatarUrl: p.avatarUrl || "",
              bio: p.bio || "",
              industry: p.industry || "cs_it",
            });
            if (p.currentJobTitle && initialJobTitle === "Professional Specialist") {
              setJobTitle(p.currentJobTitle);
            }
          }
          if (Array.isArray(d.data.education)) setEducationList(d.data.education);
          if (Array.isArray(d.data.experiences)) setExperienceList(d.data.experiences);
          if (Array.isArray(d.data.projects)) setProjectList(d.data.projects);
          if (Array.isArray(d.data.skills)) {
            setRawSkills(d.data.skills.map((s: any) => (typeof s === "string" ? s : s.name)));
          }
        }
      })
      .catch(() => null);
  }, []);

  const domainObj = getDomainById(profile.industry);

  const handleGenerate = async () => {
    setStatus("analyzing");
    setOutputContent("");

    try {
      await new Promise((r) => setTimeout(r, 300));
      setStatus("generating");

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedMode,
          jobTitle,
          company,
          jobDescription,
          tone,
          candidateName: profile.fullName,
        }),
      });

      const result = await response.json();
      if (result.success && result.data?.outputContent) {
        setOutputContent(result.data.outputContent);
      }
      setStatus("completed");
    } catch {
      setStatus("completed");
    }
  };

  const handleCopy = () => {
    const content = outputContent || `RESUME FOR ${profile.fullName.toUpperCase()}\n${profile.professionalHeadline}\nCompany: ${company}\nTarget Role: ${jobTitle}\n\nSKILLS\n${rawSkills.join(", ")}\n\nEXPERIENCE\n${experienceList.map(e => `${e.jobTitle} at ${e.company} ${e.duration || ""}`).join("\n")}`;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              AI Tailor & Executive CV Studio
            </h1>
            <Badge variant="success" className="font-bold">
              Groq AI Enabled • {domainObj.label}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Generate tailored resumes, cover letters, and recruiter emails customized for {profile.fullName} and tailored to {company}.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setHelpModalOpen(true)}
            className="rounded-xl border-indigo-200 text-xs font-semibold text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100"
          >
            <HelpCircle className="h-3.5 w-3.5 mr-1 text-indigo-600" />
            Guide
          </Button>

          <Button
            type="button"
            onClick={handlePrint}
            className="rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            Print / Save PDF
          </Button>
        </div>
      </div>

      {/* 2. Mode Selector Strip */}
      <div className="space-y-2 print:hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white">1</span>
            Select Document Artifact
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {GENERATION_MODES.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`rounded-2xl border p-3.5 text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-600/30"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-2 rounded-xl ${
                      isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-indigo-600" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{mode.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{mode.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Controls */}
        <div className="lg:col-span-4 space-y-4 print:hidden">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-slate-900">Target Settings</CardTitle>
              <CardDescription className="text-xs">
                Tailor for a specific company and position.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Target Job Title</label>
                <Input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder={`e.g. ${domainObj.defaultJobTitle}`}
                  className="rounded-xl h-9"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Target Company / Organization</label>
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Hospital / Stripe / Apex Corp"
                  className="rounded-xl h-9"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Job Description (Optional)</label>
                <textarea
                  rows={3}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste job posting text or key requirements here..."
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                />
              </div>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs">Include Photo in CV</span>
                <input
                  type="checkbox"
                  checked={includePhoto}
                  onChange={(e) => setIncludePhoto(e.target.checked)}
                  className="rounded accent-indigo-600 h-4 w-4 cursor-pointer"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Tone & Approach</label>
                <Select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as typeof tone)}
                  options={[
                    { value: "professional", label: "Professional & Impactful" },
                    { value: "confident", label: "Executive Confident" },
                    { value: "concise", label: "Concise & Fast-Paced" },
                  ]}
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleGenerate}
                isLoading={status === "analyzing" || status === "generating"}
                className="w-full font-bold shadow-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white mt-2"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                <span>Generate with Groq AI</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Output Sheet */}
        <div className="lg:col-span-8 w-full">
          <div className="mb-3 flex items-center justify-between print:hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {selectedMode.replace(/_/g, " ").toUpperCase()} OUTPUT
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="text-xs font-semibold rounded-xl border-slate-300 gap-1.5 cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copied ? "Copied!" : "Copy Output"}</span>
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handlePrint}
                className="text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm gap-1.5 cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print / Save PDF</span>
              </Button>
            </div>
          </div>

          {selectedMode !== "tailored_resume" && outputContent ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md text-xs leading-relaxed text-slate-800 whitespace-pre-wrap font-sans">
              {outputContent}
            </div>
          ) : (
            /* EXECUTIVE CV CANVAS */
            <div
              id="executive-cv-sheet"
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg text-slate-800 space-y-6 print:border-none print:shadow-none print:p-0 print:m-0"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-b-2 border-slate-900 pb-5">
                <div className="space-y-1 max-w-xl">
                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950">
                    {profile.fullName || "Candidate Name"}
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-slate-700 leading-snug">
                    {jobTitle} — Tailored for {company}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    {profile.location || "Open to Remote"} | {domainObj.label}
                  </p>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-2.5 text-xs text-slate-700 font-medium pt-1">
                    {profile.phone && <span>{profile.phone}</span>}
                    {profile.email && <span>| {profile.email}</span>}
                    {profile.linkedInUrl && <span>| {profile.linkedInUrl}</span>}
                    {profile.githubUrl && <span>| {profile.githubUrl}</span>}
                  </div>
                </div>

                {includePhoto && (
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border-2 border-slate-900 shadow-md bg-slate-100 flex items-center justify-center">
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt={profile.fullName} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 text-slate-400" />
                    )}
                  </div>
                )}
              </div>

              {/* BIO / SUMMARY */}
              {profile.bio && (
                <div className="space-y-1.5">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-950 border-b border-slate-200 pb-1">
                    Executive Profile Summary
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal text-justify">
                    {profile.bio}
                  </p>
                </div>
              )}

              {/* SKILLS */}
              <div className="space-y-1.5">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-950 border-b border-slate-200 pb-1">
                  Core Skills & Domain Competencies
                </h2>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {rawSkills.length > 0 ? (
                    rawSkills.map((s) => (
                      <span key={s} className="rounded border border-slate-300 bg-slate-50 px-2 py-0.5 text-slate-800 font-medium">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 italic">No skills listed yet. Add skills in Onboarding.</span>
                  )}
                </div>
              </div>

              {/* WORK EXPERIENCE */}
              {experienceList.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-950 border-b border-slate-200 pb-1">
                    Work Experience
                  </h2>
                  <div className="space-y-3">
                    {experienceList.map((exp: any, idx: number) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex flex-wrap items-baseline justify-between text-xs">
                          <span className="font-bold text-slate-950">
                            {exp.jobTitle} — <span className="font-semibold text-slate-800">{exp.company}</span>
                          </span>
                          {exp.duration && (
                            <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                              {exp.duration}
                            </span>
                          )}
                        </div>
                        {Array.isArray(exp.responsibilities) && (
                          <ul className="list-disc pl-4 space-y-0.5 text-xs text-slate-700">
                            {exp.responsibilities.map((resp: string, rIdx: number) => (
                              <li key={rIdx}>{resp}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROJECTS */}
              {projectList.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-950 border-b border-slate-200 pb-1">
                    Projects & Key Case Studies
                  </h2>
                  <div className="space-y-3">
                    {projectList.map((proj: any, idx: number) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex flex-wrap items-center justify-between text-xs">
                          <span className="font-bold text-slate-950">{proj.name} {proj.role && `| ${proj.role}`}</span>
                          {proj.projectUrl && (
                            <a href={proj.projectUrl.startsWith("http") ? proj.projectUrl : `https://${proj.projectUrl}`} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline">
                              {proj.projectUrl} ↗
                            </a>
                          )}
                        </div>
                        {Array.isArray(proj.responsibilities) && (
                          <ul className="list-disc pl-4 space-y-0.5 text-xs text-slate-700">
                            {proj.responsibilities.map((resp: string, rIdx: number) => (
                              <li key={rIdx}>{resp}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EDUCATION */}
              {educationList.length > 0 && (
                <div className="space-y-1.5">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-950 border-b border-slate-200 pb-1">
                    Education & Credentials
                  </h2>
                  <div className="space-y-1">
                    {educationList.map((edu: any, idx: number) => (
                      <div key={idx} className="flex flex-wrap items-baseline justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-950">{edu.degree}</span> —{" "}
                          <span className="font-semibold text-slate-800">{edu.institution}</span>
                        </div>
                        <span className="text-[11px] text-slate-600 font-medium">
                          {edu.startDate && `${edu.startDate} – `}{edu.endDate || "Present"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        title="💡 AI Studio Help"
        description="Tips for generating high-impact tailored content:"
      >
        <div className="space-y-3 text-xs text-slate-700">
          <p>• Enter target role and company name to align wording directly with hiring manager priorities.</p>
          <p>• Click &quot;Print / Save PDF&quot; to export your formatted CV sheet cleanly.</p>
          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" onClick={() => setHelpModalOpen(false)} className="rounded-xl text-xs font-bold bg-indigo-600 text-white">
              Got It
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
