"use client";

import * as React from "react";
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

export default function AiGenerationCenterPage() {
  const searchParams = useSearchParams();
  const initialJobTitle = searchParams.get("jobTitle") || "Full Stack Developer";
  const initialCompany = searchParams.get("company") || "InvoZone";

  // Full candidate profile state
  const [profile, setProfile] = React.useState({
    fullName: "Muhammad Ali",
    professionalHeadline: "BS Computer Science Student | Full Stack Developer | DevOps Enthusiast",
    email: "aliofficialpk63@gmail.com",
    phone: "03020048966",
    location: "Lahore, Pakistan",
    githubUrl: "github.com/aliofficialpk",
    linkedInUrl: "linkedin.com/in/aliofficialpk",
    avatarUrl: "/images/default-avatar.jpg",
    bio: "Computer Science student at NCBA&E with hands-on experience building, deploying, and maintaining production-grade web and mobile applications. Experienced in full-stack development, cloud infrastructure, database management, and DevOps operations. Seeking a Software Engineering or DevOps Internship to contribute to real-world products and scalable systems.",
  });

  const [educationList, setEducationList] = React.useState<any[]>([
    {
      degree: "BS Computer Science (BSCS)",
      institution: "NCBA&E",
      startDate: "2021",
      endDate: "2025",
      gpa: "3.4 / 4.0",
    },
  ]);

  const [experienceList, setExperienceList] = React.useState<any[]>([
    {
      company: "UET Incubation Center",
      jobTitle: "MERN Stack Developer Intern",
      duration: "(3 Months)",
      location: "Lahore, Pakistan",
      responsibilities: [
        "Developed web applications and backend services.",
        "Engineered responsive components and REST APIs using modern TypeScript and Node.js.",
      ],
      technologiesUsed: ["React", "Node.js", "Express.js", "MongoDB"],
    },
    {
      company: "ATechsole",
      jobTitle: "Web Development Intern",
      duration: "(3 Months)",
      location: "Lahore, Pakistan",
      responsibilities: [
        "Worked on client projects, deployments, and production maintenance.",
        "Assisted in Nginx reverse proxy configuration, Docker containers, and CI/CD pipelines.",
      ],
      technologiesUsed: ["Next.js", "TypeScript", "PostgreSQL", "Docker", "Nginx"],
    },
  ]);

  const [projectList, setProjectList] = React.useState<any[]>([
    {
      name: "234Deals Marketplace Platform",
      role: "Full Stack Developer & DevOps Engineer",
      projectUrl: "https://234deals.com",
      githubUrl: "https://github.com/aliofficialpk",
      responsibilities: [
        "Designed, developed, deployed, and maintained the complete marketplace ecosystem including website, mobile application, backend APIs, database architecture, and cloud infrastructure.",
        "Built scalable REST APIs using Node.js and Express.js with PostgreSQL and Sequelize ORM.",
        "Implemented authentication, security controls, Cloudinary file management, Twilio SMS, and SendGrid email services.",
        "Managed production deployments, server administration, monitoring, and platform maintenance on VPS.",
      ],
    },
    {
      name: "2Techsole",
      role: "Full Stack Developer",
      projectUrl: "https://2techsole.page",
      responsibilities: ["Engineered client landing platform and responsive booking system."],
    },
    {
      name: "2DBite",
      role: "Full Stack Developer",
      projectUrl: "https://2dbite-frontend.vercel.app",
      responsibilities: ["Built full-stack ordering interface with Next.js and Tailwind CSS."],
    },
  ]);

  const [categorizedTechnologies, setCategorizedTechnologies] = React.useState({
    frontend: "Next.js, React, TypeScript, Tailwind CSS, HTML5, CSS3",
    backend: "Node.js, Express.js, REST APIs, Python",
    mobile: "React Native",
    database: "PostgreSQL, Sequelize ORM, MongoDB, Redis",
    devops: "Docker, Linux Administration, Git, CI/CD, Nginx, VPS Management",
    services: "Cloudinary, Twilio, SendGrid",
  });

  const [selectedMode, setSelectedMode] = React.useState<GenerationType>("tailored_resume");
  const [jobTitle, setJobTitle] = React.useState(initialJobTitle);
  const [company, setCompany] = React.useState(initialCompany);
  const [tone, setTone] = React.useState<"professional" | "confident" | "enthusiastic" | "concise">("professional");
  const [recipientName, setRecipientName] = React.useState("Hiring Team");
  const [keyHighlights, setKeyHighlights] = React.useState("Next.js, React, TypeScript, PostgreSQL, Docker");
  const [includePhoto, setIncludePhoto] = React.useState<boolean>(true);
  const [previewTab, setPreviewTab] = React.useState<"document" | "raw">("document");
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
            setProfile((prev) => ({
              ...prev,
              fullName: p.fullName || prev.fullName,
              professionalHeadline: p.professionalHeadline || prev.professionalHeadline,
              email: p.email || prev.email,
              phone: p.phone || prev.phone,
              location: p.location || prev.location,
              githubUrl: p.githubUrl || prev.githubUrl,
              linkedInUrl: p.linkedInUrl || prev.linkedInUrl,
              avatarUrl: p.avatarUrl || prev.avatarUrl,
              bio: p.bio || prev.bio,
            }));
          }
          if (d.data.education && d.data.education.length > 0) {
            setEducationList(d.data.education);
          }
          if (d.data.experiences && d.data.experiences.length > 0) {
            setExperienceList(d.data.experiences);
          }
          if (d.data.projects && d.data.projects.length > 0) {
            setProjectList(d.data.projects);
          }
        }
      })
      .catch(() => null);
  }, []);

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
          keyHighlights,
          recipientName,
        }),
      });

      const result = await response.json();
      if (result.success && result.data?.outputContent) {
        setOutputContent(result.data.outputContent);
        setStatus("completed");
      } else {
        setStatus("completed");
      }
    } catch {
      setStatus("completed");
    }
  };

  const handleCopy = () => {
    const textToCopy = selectedMode === "tailored_resume" && !outputContent
      ? `${profile.fullName.toUpperCase()}\n${profile.professionalHeadline}\n${profile.location} | ${profile.phone} | ${profile.email} | ${profile.githubUrl}\n\nPROFILE\n${profile.bio}\n\nEDUCATION\n${educationList.map(e => `${e.degree} — ${e.institution} (${e.startDate} - ${e.endDate})`).join('\n')}\n\nEXPERIENCE\n${experienceList.map(e => `${e.jobTitle} — ${e.company} ${e.duration}\n${e.responsibilities.map((r: string) => `• ${r}`).join('\n')}`).join('\n\n')}\n\nPROJECTS\n${projectList.map(p => `${p.name} | ${p.role}\n${p.responsibilities.map((r: string) => `• ${r}`).join('\n')}`).join('\n\n')}`
      : outputContent;

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
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              InvoZone-Standard Professional CV Studio
            </h1>
            <Badge variant="success" className="font-bold">
              Agency Format Verified
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Standardized on top software agency benchmarks (InvoZone, Turing, Toptal) featuring clean contact headers, education, exact time periods, and live project demos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setHelpModalOpen(true)}
            className="rounded-xl border-indigo-200 text-xs font-semibold text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100"
          >
            <HelpCircle className="h-3.5 w-3.5 mr-1 text-indigo-600" />
            CV Structure Tips
          </Button>

          <Button
            type="button"
            onClick={handlePrint}
            className="rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            Download / Print PDF
          </Button>
        </div>
      </div>

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
        {/* Left Column: CV Customization Controls (Hidden on Print) */}
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
                  Active CV Credentials
                </span>
                <div className="space-y-1 text-slate-600 text-[11px]">
                  <p><strong>Candidate:</strong> {profile.fullName}</p>
                  <p><strong>Education:</strong> {educationList[0]?.degree || "BS Computer Science"}</p>
                  <p><strong>Experience:</strong> {experienceList[0]?.jobTitle} {experienceList[0]?.duration}</p>
                  <p><strong>Key Project:</strong> {projectList[0]?.name}</p>
                </div>
                <Link href="/onboarding" className="block pt-1">
                  <Button variant="outline" size="sm" className="w-full text-xs rounded-xl text-indigo-600 border-indigo-200">
                    Edit Education, Work & Projects ↗
                  </Button>
                </Link>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleGenerate}
                isLoading={status === "analyzing" || status === "generating"}
                className="w-full font-bold shadow-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 mt-2"
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

          {/* Actual Professional CV Sheet */}
          <div
            id="invozone-cv-sheet"
            className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg text-slate-800 space-y-6 print:border-none print:shadow-none print:p-0 print:m-0"
          >
            {/* Header: Photo + Name + Contact Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-b-2 border-slate-900 pb-5">
              <div className="space-y-1 max-w-xl">
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 font-sans">
                  {profile.fullName}
                </h1>
                <p className="text-xs sm:text-sm font-bold text-slate-700 leading-snug">
                  {profile.professionalHeadline}
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  {profile.location}
                </p>

                {/* Contact row with separator bars */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-2.5 text-xs text-slate-700 font-medium pt-1">
                  {profile.phone && <span>{profile.phone}</span>}
                  {profile.phone && <span>|</span>}
                  <span>{profile.email}</span>
                  {profile.githubUrl && <span>|</span>}
                  {profile.githubUrl && (
                    <a href={`https://${profile.githubUrl}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                      {profile.githubUrl}
                    </a>
                  )}
                  {profile.linkedInUrl && <span>|</span>}
                  {profile.linkedInUrl && (
                    <a href={`https://${profile.linkedInUrl}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                      {profile.linkedInUrl}
                    </a>
                  )}
                </div>
              </div>

              {includePhoto && (
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border-2 border-slate-900 shadow-md bg-slate-100">
                  <img
                    src={profile.avatarUrl || "/images/default-avatar.jpg"}
                    alt={profile.fullName}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* PROFILE SECTION */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-950 border-b border-slate-200 pb-1">
                Profile
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed font-normal text-justify">
                {profile.bio}
              </p>
            </div>

            {/* CORE SKILLS SECTION */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-950 border-b border-slate-200 pb-1">
                Core Skills
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-700">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-950">▪</span> Full Stack Development
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-950">▪</span> DevOps & Cloud Infrastructure
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-950">▪</span> Database Design & Optimization
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-950">▪</span> REST API Development
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-950">▪</span> Linux Administration
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-950">▪</span> CI/CD & Deployment Automation
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-950">▪</span> Application Security
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-950">▪</span> Production System Maintenance
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
            <div className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-950 border-b border-slate-200 pb-1">
                Experience
              </h2>
              <div className="space-y-3">
                {experienceList.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between text-xs">
                      <span className="font-bold text-slate-950">
                        {exp.jobTitle} — <span className="font-semibold text-slate-800">{exp.company}</span>
                      </span>
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {exp.duration}
                      </span>
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 text-xs text-slate-700">
                      {exp.responsibilities.map((resp: string, rIdx: number) => (
                        <li key={rIdx}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* PROJECTS SECTION (With live URLs) */}
            <div className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-950 border-b border-slate-200 pb-1">
                Projects
              </h2>
              <div className="space-y-3">
                {projectList.map((proj, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex flex-wrap items-center justify-between text-xs">
                      <span className="font-bold text-slate-950">
                        {proj.name} {proj.role && `| ${proj.role}`}
                      </span>
                      {proj.projectUrl && (
                        <a
                          href={proj.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-indigo-600 hover:underline inline-flex items-center gap-0.5"
                        >
                          {proj.projectUrl} ↗
                        </a>
                      )}
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 text-xs text-slate-700">
                      {proj.responsibilities.map((resp: string, rIdx: number) => (
                        <li key={rIdx}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* EDUCATION SECTION */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-950 border-b border-slate-200 pb-1">
                Education
              </h2>
              <div className="space-y-1">
                {educationList.map((edu, idx) => (
                  <div key={idx} className="flex flex-wrap items-baseline justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-950">{edu.degree}</span> —{" "}
                      <span className="font-semibold text-slate-800">{edu.institution}</span>
                    </div>
                    <span className="text-[11px] text-slate-600 font-medium">
                      {edu.startDate && `${edu.startDate} – `}{edu.endDate || "Present"}
                      {edu.gpa && ` | CGPA: ${edu.gpa}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
            <h4 className="font-bold text-indigo-950">1. Clean Contact Strip & Phone</h4>
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
              Having clickable live URLs (e.g. <em>https://234deals.com</em>, <em>https://2techsole.page</em>) demonstrates real-world software delivery.
            </p>
          </div>
          <div className="flex justify-end pt-1">
            <Button
              type="button"
              variant="primary"
              onClick={() => setHelpModalOpen(false)}
              className="rounded-xl bg-indigo-600 text-xs font-bold"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
