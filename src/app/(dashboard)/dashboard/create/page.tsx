"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Sparkles,
  FileText,
  Mail,
  Send,
  Compass,
  Copy,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Check,
  Camera,
  Printer,
  Eye,
  Code,
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Phone,
  GitBranch,
  MapPin,
  ExternalLink,
  HelpCircle,
  ArrowRight,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import type { GenerationType, GenerationState } from "@/types/database";

const GENERATION_MODES: Array<{ id: GenerationType; title: string; desc: string; icon: React.ElementType }> = [
  { id: "tailored_resume", title: "InvoZone Professional CV", desc: "Agency-standard formatted CV", icon: FileText },
  { id: "cover_letter", title: "Cover Letter", desc: "Persuasive personalized letter", icon: Mail },
  { id: "recruiter_email", title: "Recruiter Email", desc: "High-response intro email", icon: Send },
  { id: "linkedin_post", title: "LinkedIn Post", desc: "Job search broadcast post", icon: Compass },
  { id: "recruiter_message", title: "LinkedIn InMail", desc: "Concise 300-char message", icon: Send },
  { id: "application_strategy", title: "Interview Strategy", desc: "Talking points & prep notes", icon: Compass },
];

// Sample InvoZone reference template (Used only when user toggles "Preview Sample")
const SAMPLE_INVOZONE_DATA = {
  profile: {
    fullName: "Alex Morgan",
    professionalHeadline: "BS Computer Science | Full Stack Engineer & Cloud Architecture Enthusiast",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 234-8901",
    location: "San Francisco, CA (Open to Remote)",
    githubUrl: "github.com/alexmorgan-dev",
    linkedInUrl: "linkedin.com/in/alexmorgan",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&h=256&fit=crop&crop=faces",
    bio: "Computer Science graduate with extensive hands-on experience building, deploying, and maintaining production-grade web applications and distributed cloud systems. Proven track record delivering scalable RESTful APIs, modern frontend architectures, and automated CI/CD pipelines.",
  },
  education: [
    {
      degree: "BS Computer Science (BSCS)",
      institution: "State University of Technology",
      startDate: "2021",
      endDate: "2025",
      gpa: "3.8 / 4.0",
    },
  ],
  experiences: [
    {
      company: "Apex Cloud Solutions",
      jobTitle: "Software Engineer Intern",
      duration: "(3 Months)",
      location: "Remote",
      responsibilities: [
        "Architected and deployed production web services with Next.js, Node.js, and PostgreSQL.",
        "Constructed high-throughput REST APIs and reduced server response latency by 32%.",
        "Automated continuous integration and deployment routines using Docker and GitHub Actions.",
      ],
      technologiesUsed: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
    },
    {
      company: "Veloce Technologies",
      jobTitle: "Full Stack Developer Intern",
      duration: "(4 Months)",
      location: "San Francisco, CA",
      responsibilities: [
        "Implemented secure JWT authentication, role-based authorization, and Cloudinary asset management.",
        "Configured Nginx reverse proxy routing and SSL certificates for client microservices.",
      ],
      technologiesUsed: ["React", "Express.js", "MongoDB", "Nginx", "Linux"],
    },
  ],
  projects: [
    {
      name: "Distributed Cloud Deals Marketplace",
      role: "Lead Full Stack & DevOps Engineer",
      projectUrl: "https://example-marketplace.com",
      githubUrl: "https://github.com/alexmorgan-dev/marketplace",
      responsibilities: [
        "Designed and shipped complete marketplace architecture handling payments, real-time notifications, and item listings.",
        "Built responsive client interface with Tailwind CSS and Next.js App Router.",
      ],
    },
    {
      name: "Pulse Analytics Platform",
      role: "Full Stack Developer",
      projectUrl: "https://pulse-analytics-demo.vercel.app",
      githubUrl: "https://github.com/alexmorgan-dev/pulse",
      responsibilities: [
        "Engineered real-time telemetry dashboard with interactive SVG charts and PostgreSQL persistence.",
      ],
    },
  ],
  categorizedTechnologies: {
    frontend: "Next.js, React, TypeScript, Tailwind CSS, HTML5, CSS3",
    backend: "Node.js, Express.js, REST APIs, Python, Nest.js",
    mobile: "React Native, Expo",
    database: "PostgreSQL, Sequelize ORM, MongoDB, Redis, Supabase",
    devops: "Docker, Linux Administration, Git, CI/CD, Nginx, AWS, Vercel",
    services: "Cloudinary, Twilio, SendGrid, Stripe API",
  },
};

export default function AiGenerationCenterPage() {
  const searchParams = useSearchParams();
  const initialJobTitle = searchParams.get("jobTitle") || "Full Stack Developer";
  const initialCompany = searchParams.get("company") || "Target Company";

  // Mode: "live" (user's real data) or "sample" (InvoZone reference preview)
  const [viewSample, setViewSample] = React.useState<boolean>(false);

  // Live Candidate Profile State (Clean, initialized from /api/profile)
  const [profile, setProfile] = React.useState({
    fullName: "",
    professionalHeadline: "",
    email: "",
    phone: "",
    location: "",
    githubUrl: "",
    linkedInUrl: "",
    avatarUrl: "",
    bio: "",
  });

  const [educationList, setEducationList] = React.useState<any[]>([]);
  const [experienceList, setExperienceList] = React.useState<any[]>([]);
  const [projectList, setProjectList] = React.useState<any[]>([]);
  const [rawSkills, setRawSkills] = React.useState<string[]>([]);

  const [selectedMode, setSelectedMode] = React.useState<GenerationType>("tailored_resume");
  const [jobTitle, setJobTitle] = React.useState(initialJobTitle);
  const [company, setCompany] = React.useState(initialCompany);
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
              fullName: p.fullName || "",
              professionalHeadline: p.professionalHeadline || "",
              email: p.email || "",
              phone: p.phone || "",
              location: p.location || "",
              githubUrl: p.githubUrl || "",
              linkedInUrl: p.linkedInUrl || "",
              avatarUrl: p.avatarUrl || "",
              bio: p.bio || "",
            });
          }
          if (Array.isArray(d.data.education)) {
            setEducationList(d.data.education);
          }
          if (Array.isArray(d.data.experiences)) {
            setExperienceList(d.data.experiences);
          }
          if (Array.isArray(d.data.projects)) {
            setProjectList(d.data.projects);
          }
          if (Array.isArray(d.data.skills)) {
            setRawSkills(d.data.skills.map((s: any) => (typeof s === "string" ? s : s.name)));
          }
        }
      })
      .catch(() => null);
  }, []);

  // Compute active CV content (live profile vs sample)
  const activeProfile = viewSample ? SAMPLE_INVOZONE_DATA.profile : profile;
  const activeEducation = viewSample ? SAMPLE_INVOZONE_DATA.education : educationList;
  const activeExperience = viewSample ? SAMPLE_INVOZONE_DATA.experiences : experienceList;
  const activeProjects = viewSample ? SAMPLE_INVOZONE_DATA.projects : projectList;

  // Categorize user skills dynamically
  const categorizedTechnologies = React.useMemo(() => {
    if (viewSample) {
      return SAMPLE_INVOZONE_DATA.categorizedTechnologies;
    }

    const front = ["react", "next", "vue", "angular", "tailwind", "html", "css", "javascript", "typescript", "ui", "ux", "redux"];
    const back = ["node", "express", "nest", "python", "django", "fastapi", "rest", "graphql", "microservices", "java", "spring"];
    const db = ["postgres", "mongo", "mysql", "redis", "prisma", "sequelize", "supabase", "database", "sql"];
    const devops = ["docker", "kubernetes", "aws", "linux", "ci/cd", "nginx", "git", "cloud", "vps", "vercel"];
    const mob = ["react native", "flutter", "ios", "android", "expo"];

    const fArr: string[] = [];
    const bArr: string[] = [];
    const dArr: string[] = [];
    const devArr: string[] = [];
    const mArr: string[] = [];
    const otherArr: string[] = [];

    rawSkills.forEach((s) => {
      const lower = s.toLowerCase();
      if (front.some((k) => lower.includes(k))) fArr.push(s);
      else if (back.some((k) => lower.includes(k))) bArr.push(s);
      else if (db.some((k) => lower.includes(k))) dArr.push(s);
      else if (devops.some((k) => lower.includes(k))) devArr.push(s);
      else if (mob.some((k) => lower.includes(k))) mArr.push(s);
      else otherArr.push(s);
    });

    return {
      frontend: fArr.length > 0 ? fArr.join(", ") : "Modern Web Frameworks & UI Architecture",
      backend: bArr.length > 0 ? bArr.join(", ") : "RESTful Services & Server Infrastructure",
      mobile: mArr.length > 0 ? mArr.join(", ") : "Responsive & Mobile Engineering",
      database: dArr.length > 0 ? dArr.join(", ") : "Relational & Document Datastores",
      devops: devArr.length > 0 ? devArr.join(", ") : "Containerization & Continuous Deployment",
      services: otherArr.length > 0 ? otherArr.join(", ") : "Third-Party Cloud APIs & Tooling",
    };
  }, [viewSample, rawSkills]);

  const hasAnyData = Boolean(
    activeProfile.fullName ||
    activeProfile.email ||
    activeEducation.length > 0 ||
    activeExperience.length > 0
  );

  const handleGenerate = async () => {
    setStatus("analyzing");
    setOutputContent("");

    try {
      await new Promise((r) => setTimeout(r, 400));
      setStatus("generating");

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedMode,
          jobTitle,
          company,
          tone,
          candidateName: activeProfile.fullName,
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
    const textToCopy = `${activeProfile.fullName.toUpperCase()}\n${activeProfile.professionalHeadline}\n${activeProfile.location} | ${activeProfile.phone} | ${activeProfile.email} | ${activeProfile.githubUrl}\n\nPROFILE\n${activeProfile.bio}\n\nEDUCATION\n${activeEducation.map((e: any) => `${e.degree} — ${e.institution} (${e.startDate || ""} - ${e.endDate || ""})`).join('\n')}\n\nEXPERIENCE\n${activeExperience.map((e: any) => `${e.jobTitle} — ${e.company} ${e.duration || ""}\n${(e.responsibilities || []).map((r: string) => `• ${r}`).join('\n')}`).join('\n\n')}\n\nPROJECTS\n${activeProjects.map((p: any) => `${p.name} ${p.role ? `| ${p.role}` : ""}\n${(p.responsibilities || []).map((r: string) => `• ${r}`).join('\n')}`).join('\n\n')}`;

    navigator.clipboard.writeText(textToCopy);
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
              InvoZone-Standard Professional CV Studio
            </h1>
            <Badge variant="success" className="font-bold">
              Agency Standard Verified
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Generates high-impact resumes matching the benchmark of top tech agencies (InvoZone, Turing). Features clean contact strips, explicit time periods, and live URLs.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Sample preview toggle */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setViewSample(!viewSample)}
            className={`rounded-xl text-xs font-bold transition-all ${
              viewSample
                ? "border-amber-400 bg-amber-50 text-amber-900"
                : "border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {viewSample ? <Eye className="h-3.5 w-3.5 mr-1 text-amber-600" /> : <EyeOff className="h-3.5 w-3.5 mr-1 text-slate-500" />}
            {viewSample ? "Viewing Sample CV" : "Preview Sample"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setHelpModalOpen(true)}
            className="rounded-xl border-indigo-200 text-xs font-semibold text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100"
          >
            <HelpCircle className="h-3.5 w-3.5 mr-1 text-indigo-600" />
            Structure Guide
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

      {/* Sample Banner Notification */}
      {viewSample && (
        <div className="rounded-xl bg-amber-50/80 border border-amber-200 p-3.5 text-xs text-amber-900 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              <strong>Sample Preview Mode Active:</strong> Displaying benchmark InvoZone template data for evaluation. Click <strong>&quot;Preview Sample&quot;</strong> above to switch back to your live profile.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setViewSample(false)}
            className="text-xs font-bold text-amber-800 underline hover:text-amber-950 ml-3 shrink-0"
          >
            Switch to My Profile
          </button>
        </div>
      )}

      {/* 2. Mode Selector Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 print:hidden">
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

      {/* 3. Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: CV Settings & Controls (Hidden on Print) */}
        <div className="lg:col-span-4 space-y-4 print:hidden">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-slate-900">CV & Tailor Settings</CardTitle>
              <CardDescription className="text-xs">
                Fine-tune employer alignment and presentation options.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Target Role Title</label>
                <Input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                  className="rounded-xl h-9"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Target Company</label>
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. InvoZone / Stripe / Remote"
                  className="rounded-xl h-9"
                />
              </div>

              {/* Photo Toggle */}
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-indigo-600" />
                  <span className="font-bold text-slate-800 text-xs">Include Photo in CV</span>
                </div>
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
                    { value: "confident", label: "Senior / High Confidence" },
                    { value: "concise", label: "Concise & Fast-Paced" },
                  ]}
                />
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  Candidate Data Status
                </span>
                <div className="space-y-1 text-slate-600 text-[11px]">
                  <p><strong>Name:</strong> {activeProfile.fullName || "Not provided"}</p>
                  <p><strong>Education:</strong> {activeEducation.length > 0 ? activeEducation[0].degree : "None added"}</p>
                  <p><strong>Experience:</strong> {activeExperience.length > 0 ? `${activeExperience[0].jobTitle} ${activeExperience[0].duration || ""}` : "None added"}</p>
                  <p><strong>Projects:</strong> {activeProjects.length} added</p>
                </div>
                <Link href="/onboarding" className="block pt-1">
                  <Button variant="outline" size="sm" className="w-full text-xs rounded-xl text-indigo-600 border-indigo-200">
                    Edit Details in Onboarding ↗
                  </Button>
                </Link>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleGenerate}
                isLoading={status === "analyzing" || status === "generating"}
                className="w-full font-bold shadow-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 mt-2 text-white"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                <span>Tailor for {company}</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: InvoZone-Standard CV Canvas (Prints Flawlessly) */}
        <div className="lg:col-span-8 w-full">
          {/* Action Bar Above Canvas */}
          <div className="mb-3 flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                InvoZone Agency Standard Format
              </span>
              <Badge variant="info">Ready to Print</Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="text-xs font-semibold rounded-xl border-slate-300 gap-1.5"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied!" : "Copy Text"}</span>
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handlePrint}
                className="text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print PDF</span>
              </Button>
            </div>
          </div>

          {/* Empty Profile Notice when live data is empty */}
          {!hasAnyData && !viewSample ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm space-y-4">
              <div className="h-14 w-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto">
                <FileText className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Your Career Profile is Empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                  Complete your 5-step guided onboarding to add your name, photo, education, and work experience with time periods.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link href="/onboarding">
                  <Button variant="primary" size="sm" className="rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
                    Start 5-Step Setup
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewSample(true)}
                  className="rounded-xl font-bold text-xs border-slate-300 text-slate-700"
                >
                  <Eye className="h-3.5 w-3.5 mr-1 text-indigo-600" />
                  Preview Sample Layout
                </Button>
              </div>
            </div>
          ) : (
            /* Actual Professional CV Sheet */
            <div
              id="invozone-cv-sheet"
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg text-slate-800 space-y-6 print:border-none print:shadow-none print:p-0 print:m-0"
            >
              {/* Header: Photo + Name + Contact Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-b-2 border-slate-900 pb-5">
                <div className="space-y-1 max-w-xl">
                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 font-sans">
                    {activeProfile.fullName || "Candidate Name"}
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-slate-700 leading-snug">
                    {activeProfile.professionalHeadline || "Software Engineer | Technical Specialist"}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    {activeProfile.location || "Open to Remote"}
                  </p>

                  {/* Contact row with separator bars */}
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-2.5 text-xs text-slate-700 font-medium pt-1">
                    {activeProfile.phone && <span>{activeProfile.phone}</span>}
                    {activeProfile.phone && activeProfile.email && <span>|</span>}
                    {activeProfile.email && <span>{activeProfile.email}</span>}
                    {activeProfile.githubUrl && <span>|</span>}
                    {activeProfile.githubUrl && (
                      <a href={`https://${activeProfile.githubUrl.replace(/^https?:\/\//, "")}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                        {activeProfile.githubUrl}
                      </a>
                    )}
                    {activeProfile.linkedInUrl && <span>|</span>}
                    {activeProfile.linkedInUrl && (
                      <a href={`https://${activeProfile.linkedInUrl.replace(/^https?:\/\//, "")}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                        {activeProfile.linkedInUrl}
                      </a>
                    )}
                  </div>
                </div>

                {includePhoto && (
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border-2 border-slate-900 shadow-md bg-slate-100 flex items-center justify-center">
                    {activeProfile.avatarUrl ? (
                      <img
                        src={activeProfile.avatarUrl}
                        alt={activeProfile.fullName || "Avatar"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-slate-400" />
                    )}
                  </div>
                )}
              </div>

              {/* PROFILE SECTION */}
              {activeProfile.bio && (
                <div className="space-y-1.5">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-950 border-b border-slate-200 pb-1">
                    Profile
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal text-justify">
                    {activeProfile.bio}
                  </p>
                </div>
              )}

              {/* CORE COMPETENCIES SECTION */}
              <div className="space-y-1.5">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-950 border-b border-slate-200 pb-1">
                  Core Skills
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-950">▪</span> Full Stack Architecture & Web Development
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-950">▪</span> Cloud Infrastructure & DevOps Operations
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-950">▪</span> Database Architecture & Data Modeling
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-950">▪</span> RESTful API Engineering & Integration
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-950">▪</span> Linux System Administration & Containerization
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-950">▪</span> CI/CD Automated Pipelines & Deployment
                  </div>
                </div>
              </div>

              {/* TECHNOLOGIES CATEGORIZED */}
              <div className="space-y-1.5">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-950 border-b border-slate-200 pb-1">
                  Technologies
                </h2>
                <div className="space-y-1 text-xs text-slate-700">
                  <p>
                    <strong className="text-slate-950">Frontend:</strong> {categorizedTechnologies.frontend}
                  </p>
                  <p>
                    <strong className="text-slate-950">Backend:</strong> {categorizedTechnologies.backend}
                  </p>
                  <p>
                    <strong className="text-slate-950">Mobile:</strong> {categorizedTechnologies.mobile}
                  </p>
                  <p>
                    <strong className="text-slate-950">Database:</strong> {categorizedTechnologies.database}
                  </p>
                  <p>
                    <strong className="text-slate-950">DevOps:</strong> {categorizedTechnologies.devops}
                  </p>
                  <p>
                    <strong className="text-slate-950">Services:</strong> {categorizedTechnologies.services}
                  </p>
                </div>
              </div>

              {/* WORK EXPERIENCE (With exact time periods) */}
              {activeExperience.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-950 border-b border-slate-200 pb-1">
                    Experience
                  </h2>
                  <div className="space-y-3">
                    {activeExperience.map((exp: any, idx: number) => (
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

              {/* PROJECTS SECTION (With live URLs) */}
              {activeProjects.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-950 border-b border-slate-200 pb-1">
                    Projects
                  </h2>
                  <div className="space-y-3">
                    {activeProjects.map((proj: any, idx: number) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex flex-wrap items-center justify-between text-xs">
                          <span className="font-bold text-slate-950">
                            {proj.name} {proj.role && `| ${proj.role}`}
                          </span>
                          {proj.projectUrl && (
                            <a
                              href={proj.projectUrl.startsWith("http") ? proj.projectUrl : `https://${proj.projectUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold text-indigo-600 hover:underline inline-flex items-center gap-0.5"
                            >
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

              {/* EDUCATION SECTION */}
              {activeEducation.length > 0 && (
                <div className="space-y-1.5">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-950 border-b border-slate-200 pb-1">
                    Education
                  </h2>
                  <div className="space-y-1">
                    {activeEducation.map((edu: any, idx: number) => (
                      <div key={idx} className="flex flex-wrap items-baseline justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-950">{edu.degree}</span> —{" "}
                          <span className="font-semibold text-slate-800">{edu.institution}</span>
                        </div>
                        <span className="text-[11px] text-slate-600 font-medium">
                          {edu.startDate && `${edu.startDate} – `}{edu.endDate || "Present"}
                          {edu.gpa && ` | GPA: ${edu.gpa}`}
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

      {/* Structure Guidance Modal */}
      <Modal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        title="💡 InvoZone Professional CV Standard"
        description="The architectural breakdown of your professional CV format:"
      >
        <div className="space-y-3.5 text-xs text-slate-700">
          <div className="rounded-xl bg-indigo-50/70 p-3 border border-indigo-100">
            <h4 className="font-bold text-indigo-950">1. Clean Contact Strip & Direct Channels</h4>
            <p className="text-slate-600 text-[11px] mt-0.5">
              Top agencies like InvoZone require an uncrowded header with direct phone numbers (WhatsApp ready) and active GitHub profile links.
            </p>
          </div>
          <div className="rounded-xl bg-emerald-50/70 p-3 border border-emerald-100">
            <h4 className="font-bold text-emerald-950">2. Time Periods on Experience</h4>
            <p className="text-slate-600 text-[11px] mt-0.5">
              Stating durations such as <em>&quot;(3 Months)&quot;</em> or explicit month/year dates provides concrete proof of internship and project longevity.
            </p>
          </div>
          <div className="rounded-xl bg-violet-50/70 p-3 border border-violet-100">
            <h4 className="font-bold text-violet-950">3. Live Project URLs & Categorized Stack</h4>
            <p className="text-slate-600 text-[11px] mt-0.5">
              Having clickable live URLs demonstrates real-world software delivery and gives recruiters immediate proof of execution.
            </p>
          </div>
          <div className="flex justify-end pt-1">
            <Button
              type="button"
              variant="primary"
              onClick={() => setHelpModalOpen(false)}
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
