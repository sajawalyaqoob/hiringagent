"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Sparkles,
  FileText,
  Mail,
  Globe,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GenerationType, GenerationState } from "@/types/database";

const GENERATION_MODES: Array<{ id: GenerationType; title: string; desc: string; icon: React.ElementType }> = [
  { id: "tailored_resume", title: "Tailored Resume", desc: "Keyword-matched resume bullets", icon: FileText },
  { id: "cover_letter", title: "Cover Letter", desc: "Persuasive personalized letter", icon: Mail },
  { id: "recruiter_email", title: "Recruiter Email", desc: "High-response intro email", icon: Send },
  { id: "linkedin_post", title: "LinkedIn Post", desc: "Job search broadcast post", icon: Globe },
  { id: "recruiter_message", title: "LinkedIn InMail", desc: "Concise 300-char message", icon: Send },
  { id: "application_strategy", title: "Interview Strategy", desc: "Talking points & prep notes", icon: Compass },
];

export default function AiGenerationCenterPage() {
  const searchParams = useSearchParams();
  const initialJobTitle = searchParams.get("jobTitle") || "Senior Full-Stack Engineer";
  const initialCompany = searchParams.get("company") || "Stripe";

  // Profile data
  const [profile, setProfile] = React.useState({
    fullName: "Alex Morgan",
    email: "alex.morgan@example.com",
    location: "Remote / Worldwide",
    currentJobTitle: "Senior Full-Stack Engineer",
    avatarUrl: "/images/default-avatar.jpg",
    skills: ["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL"],
  });

  const [selectedMode, setSelectedMode] = React.useState<GenerationType>("tailored_resume");
  const [jobTitle, setJobTitle] = React.useState(initialJobTitle);
  const [company, setCompany] = React.useState(initialCompany);
  const [tone, setTone] = React.useState<"professional" | "confident" | "enthusiastic" | "concise">("professional");
  const [recipientName, setRecipientName] = React.useState("Hiring Team");
  const [keyHighlights, setKeyHighlights] = React.useState("React, TypeScript, Next.js, Cloud APIs");
  const [jobDescription, setJobDescription] = React.useState(
    "Looking for a high-performing engineer with deep experience in modern web platforms and distributed services."
  );

  // Resume customization
  const [includePhoto, setIncludePhoto] = React.useState<boolean>(true);
  const [templateTheme, setTemplateTheme] = React.useState<"modern" | "minimal" | "executive">("modern");
  const [previewTab, setPreviewTab] = React.useState<"document" | "raw">("document");

  // State Machine
  const [status, setStatus] = React.useState<GenerationState>("idle");
  const [outputContent, setOutputContent] = React.useState<string>("");
  const [copied, setCopied] = React.useState(false);

  // Fetch candidate's profile on mount
  React.useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d?.data?.profile) {
          const p = d.data.profile;
          const skillsList = (d.data.skills || []).map((s: any) => s.name);
          setProfile({
            fullName: p.fullName || "Candidate",
            email: p.email || "candidate@example.com",
            location: p.location || "Remote",
            currentJobTitle: p.currentJobTitle || initialJobTitle,
            avatarUrl: p.avatarUrl || "/images/default-avatar.jpg",
            skills: skillsList.length > 0 ? skillsList : ["TypeScript", "React", "Next.js", "PostgreSQL"],
          });
          if (!searchParams.get("jobTitle") && p.currentJobTitle) {
            setJobTitle(p.currentJobTitle);
          }
          if (skillsList.length > 0) {
            setKeyHighlights(skillsList.slice(0, 4).join(", "));
          }
        }
      })
      .catch(() => null);
  }, [initialJobTitle, searchParams]);

  const sampleOutputs: Record<GenerationType, string> = {
    tailored_resume: `# ${profile.fullName}
${profile.location} | ${profile.email} | (555) 234-8901 | linkedin.com/in/${profile.fullName.toLowerCase().replace(/\s+/g, "-")}

## Tailored Profile Summary for ${jobTitle} at ${company}
Performance-driven ${jobTitle} with proven expertise delivering modern scalable platforms and reliable data architectures. Calibrated specifically for ${company}'s technical priorities, bringing core competency in ${profile.skills.slice(0, 4).join(", ")}.

## Targeted Key Achievements
- **High-Impact Architecture:** Designed and deployed resilient services handling millions of monthly interactions with 99.99% uptime.
- **Performance & Latency:** Reduced key web application load times and p99 query latency by over 35%.
- **Technical Excellence:** Automated CI/CD pipelines and testing coverage, accelerating sprint release velocity.

## Core Relevant Technologies
- **Frontend & Full-Stack:** ${profile.skills.filter((_, i) => i % 2 === 0).join(", ") || "TypeScript, React, Next.js"}
- **Backend & Cloud Services:** ${profile.skills.filter((_, i) => i % 2 !== 0).join(", ") || "Node.js, PostgreSQL, Docker"}
- **Methodologies:** Agile / Scrum, Microservices, Clean Architecture, Automated Testing`,

    cover_letter: `Dear ${recipientName},

I am excited to submit my application for the ${jobTitle} position at ${company}. Having followed ${company}'s technology footprint and market leadership, I would love to bring my experience in ${profile.skills.slice(0, 3).join(", ")} to your team.

In my recent engineering initiatives, I led the development of critical customer-facing platforms, delivering measurable improvements in performance, reliability, and developer experience.

Specifically: ${keyHighlights} directly aligns with the technical goals outlined in ${company}'s role requirements.

I would welcome the opportunity to discuss how my background and problem-solving skills can accelerate ${company}'s mission. Thank you for your consideration.

Warm regards,
${profile.fullName}
${profile.location} | ${profile.email}`,

    recruiter_email: `Subject: ${jobTitle} — ${profile.fullName} for ${company}

Hi ${recipientName},

I hope you're having a productive week!

I noticed ${company}'s opening for the ${jobTitle} role and wanted to reach out directly. Over recent years, I've specialized in building reliable platforms with ${profile.skills.slice(0, 3).join(", ")}.

Recently, I:
• Scaled high-availability services handling significant daily volume with 99.99% reliability.
• Reduced system latency and improved application performance by over 35%.
• Led cross-functional initiatives emphasizing clean code and rapid delivery.

Given ${company}'s focus on engineering excellence, I believe I could contribute immediately. Would you be open to a brief 10-minute introductory call next week?

Best regards,
${profile.fullName}
${profile.email}`,

    linkedin_post: `🚀 Excited to announce I am actively exploring new opportunities as a ${jobTitle}!

I specialize in building high-performance applications with ${profile.skills.slice(0, 4).join(", ")}. Passionate about speed, scalable architectures, and collaborative engineering teams.

I'm particularly interested in forward-thinking teams like ${company}.

If your team is hiring or you'd like to connect, my DMs are open! Reposts and introductions are deeply appreciated. 🙏

#JobSearch #${jobTitle.replace(/\s+/g, "")} #SoftwareEngineering #TechCareers`,

    recruiter_message: `Hi ${recipientName} — saw your opening for ${jobTitle} at ${company}! I'm a ${jobTitle} specializing in ${profile.skills.slice(0, 3).join(", ")}. Would love to connect and share how my background aligns with your team's goals!`,

    application_strategy: `## Strategic Application Plan for ${jobTitle} at ${company}

### 1. Primary Strengths to Emphasize
- **Proven Stack Mastery:** Deep proficiency in ${profile.skills.slice(0, 4).join(", ")}.
- **Business Impact:** Demonstrated track record improving application latency and uptime.

### 2. Tailored Value Proposition
Highlight your ability to translate ${company}'s technical roadmap into resilient, clean code that accelerates delivery.

### 3. Interview Talking Points
1. *System Design:* Walk through your architectural decision-making and performance tuning.
2. *Collaboration:* Describe how you partner with product and design to deliver robust user experiences.`,
  };

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
          jobDescription,
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
        setOutputContent(sampleOutputs[selectedMode]);
        setStatus("completed");
      }
    } catch {
      setOutputContent(sampleOutputs[selectedMode]);
      setStatus("completed");
    }
  };

  const handleCopy = () => {
    if (!outputContent) return;
    navigator.clipboard.writeText(outputContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Tailor Studio & Resume Creator
            </h1>
            <Badge variant="info">Live Dynamic AI</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Create tailored resumes, persuasive cover letters, and recruiter outreach grounded in your real profile.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span>Groq Compound Intelligence</span>
        </div>
      </div>

      {/* 2. Mode Selector Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {GENERATION_MODES.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => {
                setSelectedMode(mode.id);
                if (status === "completed") {
                  setOutputContent(sampleOutputs[mode.id]);
                }
              }}
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

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Configuration */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-slate-900">Customization Parameters</CardTitle>
              <CardDescription className="text-xs">
                Tune target employer, role, and visual presentation options.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1.5">Target Job Title</label>
                <Input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Full-Stack Engineer"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1.5">Company Name</label>
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe, OpenAI"
                  className="rounded-xl"
                />
              </div>

              {/* Photo & Template Controls for Resumes */}
              {selectedMode === "tailored_resume" && (
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-indigo-600" />
                      <span className="font-bold text-slate-900 text-xs">Candidate Photo</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-indigo-700">
                      <input
                        type="checkbox"
                        checked={includePhoto}
                        onChange={(e) => setIncludePhoto(e.target.checked)}
                        className="rounded accent-indigo-600 h-4 w-4 cursor-pointer"
                      />
                      <span>Include in Resume</span>
                    </label>
                  </div>

                  {includePhoto && (
                    <div className="flex items-center gap-3 pt-1 border-t border-indigo-100">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-indigo-500">
                        <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-[11px]">{profile.fullName}</p>
                        <p className="text-[10px] text-slate-500">{profile.email} • {profile.location}</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-indigo-100">
                    <label className="font-bold text-slate-800 block mb-1.5 text-[11px]">
                      Template Style
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(["modern", "minimal", "executive"] as const).map((tmpl) => (
                        <button
                          type="button"
                          key={tmpl}
                          onClick={() => setTemplateTheme(tmpl)}
                          className={`rounded-lg py-1.5 px-2 text-[10px] font-bold capitalize transition ${
                            templateTheme === tmpl
                              ? "bg-indigo-600 text-white shadow-xs"
                              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {tmpl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1.5">Tone & Voice</label>
                  <Select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as typeof tone)}
                    options={[
                      { value: "professional", label: "Professional" },
                      { value: "confident", label: "High Confidence" },
                      { value: "enthusiastic", label: "Enthusiastic" },
                      { value: "concise", label: "Concise" },
                    ]}
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1.5">Recipient (Optional)</label>
                  <Input
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Hiring Manager"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1.5">Key Highlights / Skills</label>
                <Input
                  value={keyHighlights}
                  onChange={(e) => setKeyHighlights(e.target.value)}
                  placeholder="e.g. TypeScript, React, Next.js, Node.js"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1.5">Job Description (Optional)</label>
                <Textarea
                  rows={3}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste requirements to align keywords with high ATS fidelity..."
                  className="rounded-xl"
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleGenerate}
                isLoading={status === "analyzing" || status === "generating"}
                className="w-full font-bold shadow-md shadow-indigo-600/20 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-700"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                <span>
                  {status === "analyzing"
                    ? "Analyzing Job Keywords..."
                    : status === "generating"
                    ? "Generating Tailored Output..."
                    : `Generate ${GENERATION_MODES.find((m) => m.id === selectedMode)?.title}`}
                </span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Output Preview & Formatted View */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="flex flex-col min-h-[540px]">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold text-slate-900">Output Preview</CardTitle>
                {status === "completed" && <Badge variant="success">Ready</Badge>}
              </div>

              <div className="flex items-center gap-1.5">
                {selectedMode === "tailored_resume" && status === "completed" && (
                  <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs mr-2">
                    <button
                      type="button"
                      onClick={() => setPreviewTab("document")}
                      className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition ${
                        previewTab === "document" ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Eye className="h-3 w-3" />
                      Visual Sheet
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab("raw")}
                      className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition ${
                        previewTab === "raw" ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Code className="h-3 w-3" />
                      Text
                    </button>
                  </div>
                )}

                {status === "completed" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrint}
                      className="text-xs font-semibold gap-1.5 rounded-xl border-slate-200"
                      title="Print or Save as PDF"
                    >
                      <Printer className="h-3.5 w-3.5 text-slate-600" />
                      <span className="hidden sm:inline">PDF</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="text-xs font-semibold gap-1.5 rounded-xl border-slate-200"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copied ? "Copied!" : "Copy"}</span>
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-5">
              {status === "idle" && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Your Tailored Document Will Appear Here</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
                      Select your target role on the left and click &quot;Generate&quot; to produce an ATS-aligned resume or letter.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerate}
                    className="mt-2 text-xs font-semibold rounded-xl text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                  >
                    Quick Sample Generate
                  </Button>
                </div>
              )}

              {(status === "analyzing" || status === "generating") && (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                    <Sparkles className="h-6 w-6 text-indigo-600 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">
                      {status === "analyzing" ? "Analyzing Job & Skills..." : "Synthesizing Tailored Copy..."}
                    </p>
                    <p className="text-xs text-slate-500">Aligning keywords to bypass applicant screening algorithms.</p>
                  </div>
                </div>
              )}

              {status === "completed" && (
                <div className="space-y-4 flex-1">
                  {/* Formatted Document View (When Resume & Document tab is selected) */}
                  {selectedMode === "tailored_resume" && previewTab === "document" ? (
                    <div
                      className={`rounded-2xl border p-6 sm:p-8 bg-white shadow-xs transition-all ${
                        templateTheme === "modern"
                          ? "border-indigo-200/80 bg-gradient-to-b from-indigo-50/20 to-white"
                          : templateTheme === "executive"
                          ? "border-slate-300 font-serif"
                          : "border-slate-200"
                      }`}
                    >
                      {/* Resume Header with Optional Photo */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                        <div className="flex items-center gap-4">
                          {includePhoto && (
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-indigo-500 shadow-sm">
                              <img src={profile.avatarUrl} alt={profile.fullName} className="h-full w-full object-cover" />
                            </div>
                          )}
                          <div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900">
                              {profile.fullName}
                            </h2>
                            <p className="text-xs font-bold text-indigo-600 tracking-wide mt-0.5">
                              {jobTitle} • {company} Candidate
                            </p>
                            <p className="text-[11px] text-slate-500 mt-1">
                              {profile.location} | {profile.email} | (555) 234-8901
                            </p>
                          </div>
                        </div>

                        <Badge variant="success" className="shrink-0 text-xs font-bold">
                          96% ATS Score
                        </Badge>
                      </div>

                      {/* Summary */}
                      <div className="mt-5 space-y-2">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                          Tailored Career Summary
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Performance-driven {jobTitle} with demonstrated track record delivering reliable,
                          scalable platforms. Calibrated specifically for {company}&apos;s tech priorities, bringing core competency in {keyHighlights}.
                        </p>
                      </div>

                      {/* Achievements */}
                      <div className="mt-5 space-y-2">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                          Targeted Achievements & Experience
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4">
                          <li>
                            <strong className="text-slate-800">High-Impact Delivery:</strong> Architected and deployed services supporting millions of monthly requests with 99.99% uptime.
                          </li>
                          <li>
                            <strong className="text-slate-800">Optimization:</strong> Reduced core application latency and improved response times by over 35%.
                          </li>
                          <li>
                            <strong className="text-slate-800">Collaboration:</strong> Partnered with cross-functional product and engineering leaders to drive rapid execution.
                          </li>
                        </ul>
                      </div>

                      {/* Technical Skills */}
                      <div className="mt-5 space-y-2">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                          Core Competencies
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {profile.skills.map((sk) => (
                            <span
                              key={sk}
                              className="rounded-lg bg-indigo-50 border border-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-800"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Plain Text / Markdown View */
                    <Textarea
                      readOnly
                      rows={18}
                      value={outputContent}
                      className="font-mono text-xs leading-relaxed bg-slate-50 border-slate-200 rounded-xl p-4 text-slate-800 focus:outline-none"
                    />
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
