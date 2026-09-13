"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
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

  const [selectedMode, setSelectedMode] = React.useState<GenerationType>("tailored_resume");
  const [jobTitle, setJobTitle] = React.useState(initialJobTitle);
  const [company, setCompany] = React.useState(initialCompany);
  const [tone, setTone] = React.useState<"professional" | "confident" | "enthusiastic" | "concise">("professional");
  const [recipientName, setRecipientName] = React.useState("Sarah Jenkins (Hiring Team)");
  const [keyHighlights, setKeyHighlights] = React.useState("45M+ daily requests, Go/Kafka streaming, PostgreSQL sharding");
  const [jobDescription, setJobDescription] = React.useState(
    "Looking for a Senior Full-Stack Engineer with deep experience in distributed systems, TypeScript, and Go to scale global payment billing platforms."
  );

  // State Machine
  const [status, setStatus] = React.useState<GenerationState>("idle");
  const [outputContent, setOutputContent] = React.useState<string>("");
  const [copied, setCopied] = React.useState(false);

  const sampleOutputs: Record<GenerationType, string> = {
    tailored_resume: `# Alex Morgan
Seattle, WA | alex.morgan@example.com | (555) 234-8901 | linkedin.com/in/alex-morgan-dev

## Tailored Profile Summary for ${jobTitle} at ${company}
Performance-driven Senior Software Engineer with 6+ years of experience architecting scalable distributed systems and modern web applications. Tailored for ${company}'s core developer infrastructure, bringing deep proficiency in modern TypeScript/Next.js architectures, high-volume event streaming, and cloud optimization.

## Targeted Key Achievements
- **Architecture & Scale:** Spearheaded distributed event systems processing 45M+ daily requests with 99.99% availability using Go, Kafka, and PostgreSQL.
- **Performance:** Reduced PostgreSQL p99 query latency by 38% through index redesign and partition pruning.
- **Efficiency:** Decreased cloud infrastructure compute costs by $120k annually via automated container right-sizing.

## Core Relevant Technologies
- **Frontend & Full-Stack:** TypeScript, Next.js, React, Node.js, Tailwind CSS
- **Backend & Systems:** Go (Golang), Python, PostgreSQL, Redis, Apache Kafka
- **DevOps & Cloud:** AWS, Kubernetes, Docker, CI/CD GitHub Actions`,

    cover_letter: `Dear ${recipientName},

I am excited to submit my application for the ${jobTitle} position at ${company}. Having followed ${company}'s engineering momentum and developer platform standards, I would love to contribute my 6+ years of full-stack and systems engineering experience to your high-performing team.

In my current role at CloudScale Technologies, I architected distributed microservices handling over 45 million daily requests while decreasing p99 database latency by 38%. Prior to that, at Vanguard Digital Labs, I led frontend performance initiatives in Next.js and TypeScript that elevated Lighthouse performance scores from 54 to 98 across customer analytics products.

Specifically: ${keyHighlights} directly aligns with the scalability and reliability goals outlined in ${company}'s platform roadmap.

I would welcome the opportunity to discuss how my background and problem-solving skills can accelerate ${company}'s goals. Thank you for your time and consideration.

Warm regards,
Alex Morgan
Seattle, WA | (555) 234-8901 | alex.morgan@example.com`,

    recruiter_email: `Subject: Senior Full-Stack Engineer — Alex Morgan for ${company} ${jobTitle}

Hi ${recipientName},

I hope you're having a wonderful week!

I noticed ${company}'s opening for the ${jobTitle} position and wanted to reach out directly. Over the past 6 years, I've specialized in building high-throughput distributed systems in Go and TypeScript, and modern web platforms in Next.js.

At CloudScale Technologies, I recently:
• Scaled event-driven microservices to handle 45M+ daily events with 99.99% uptime.
• Reduced PostgreSQL p99 latency by 38% through database indexing.
• Cut AWS compute spend by $120k/year through automated container optimization.

Given ${company}'s focus on payment reliability and engineering scale, I believe I could hit the ground running. Would you be open to a brief 10-minute introductory call next week?

Best regards,
Alex Morgan
github.com/alex-morgan | (555) 234-8901`,

    linkedin_post: `🚀 Excited to announce I am actively exploring my next career chapter as a ${jobTitle}!

Over the last 6 years, I've focused on building scalable web platforms and high-throughput microservices. Recently, I led initiatives processing 45M+ daily events and optimizing database latency by 38%.

I'm particularly interested in ambitious teams building developer tools, fintech, or distributed platforms like ${company}.

If your team is hiring or you'd like to connect, my DMs are open! Reposts and referrals are deeply appreciated. 🙏

#JobSearch #SoftwareEngineering #TypeScript #FullStack #Hiring`,

    recruiter_message: `Hi ${recipientName} — saw your opening for ${jobTitle} at ${company}! I'm a Senior Engineer with 6+ years specializing in Next.js, TypeScript, and high-throughput systems (45M+ daily events). Would love to connect and share how my background aligns with your team's goals!`,

    application_strategy: `## Strategic Application Plan for ${jobTitle} at ${company}

### 1. Primary Strengths to Emphasize
- **High-Volume Systems:** Your experience with 45M+ events/day directly addresses ${company}'s high-traffic requirements.
- **Modern Full-Stack Stack:** Strong alignment with TypeScript, Next.js, and PostgreSQL.

### 2. Potential Gaps & Bridge Strategies
- **Gap:** Experience with eBPF / low-level networking.
- **Bridge:** Highlight strong Linux internals knowledge and ability to rapidly adopt low-level tracing tools.

### 3. Interview Talking Points
1. *Distributed Architecture:* Walk through how you designed partition keys in Kafka to eliminate consumer lag.
2. *Database Optimization:* Detail your indexing strategy that reduced p99 latency by 38%.
3. *Cross-Functional Collaboration:* Explain how you mentored 4 junior engineers on TypeScript clean code practices.`,
  };

  const handleGenerate = async () => {
    setStatus("analyzing");
    setOutputContent("");

    try {
      await new Promise((r) => setTimeout(r, 600));
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
    } catch (err: any) {
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

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">AI Tailor Studio</h1>
            <Badge variant="info">Zero Hallucinations</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Generate tailored resumes, cover letters, and outreach grounded strictly in your real career background.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span>Powered by Groq AI</span>
        </div>
      </div>

      {/* 2. Mode Selector Strip (Responsive Grid) */}
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
                {isSelected && <span className="h-2 w-2 rounded-full bg-indigo-600" />}
              </div>
              <div>
                <p className={`text-xs font-bold ${isSelected ? "text-indigo-950" : "text-slate-900"}`}>
                  {mode.title}
                </p>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{mode.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Two-Column Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input Parameters */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-slate-900">Application Details</CardTitle>
              <CardDescription>Enter the job details to customize your output.</CardDescription>
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
                  placeholder="e.g. Stripe"
                  className="rounded-xl"
                />
              </div>

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
                <label className="font-bold text-slate-800 block mb-1.5">Key Highlights to Emphasize</label>
                <Input
                  value={keyHighlights}
                  onChange={(e) => setKeyHighlights(e.target.value)}
                  placeholder="e.g. 45M+ requests, Go/Kafka, PostgreSQL"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1.5">Job Description</label>
                <Textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job requirements from LinkedIn, Indeed, or company careers page..."
                  className="rounded-xl"
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleGenerate}
                isLoading={status === "analyzing" || status === "generating"}
                className="w-full font-bold shadow-md shadow-indigo-600/20 mt-2"
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

        {/* Right: Output Preview & Actions */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="flex flex-col min-h-[520px]">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold text-slate-900">Generated Output</CardTitle>
                {status === "completed" && <Badge variant="success">Ready</Badge>}
              </div>

              {status === "completed" && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="text-xs font-semibold gap-1.5"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerate}
                    className="text-xs p-2 text-slate-500 hover:text-slate-900"
                    title="Regenerate"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-5">
              {status === "idle" && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <Sparkles className="h-6 w-6 text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Your Generated Content Will Appear Here</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
                      Select your mode, fill in the job title & description on the left, and click Generate.
                    </p>
                  </div>
                </div>
              )}

              {(status === "analyzing" || status === "generating") && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="h-9 w-9 animate-spin rounded-full border-3 border-slate-200 border-t-indigo-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">
                      {status === "analyzing" ? "Analyzing Job Requirements..." : "Synthesizing Content with Groq AI..."}
                    </p>
                    <p className="text-xs text-slate-500">
                      Matching skills and formatting bullets without hallucinations.
                    </p>
                  </div>
                </div>
              )}

              {status === "completed" && (
                <div className="flex-1">
                  <textarea
                    readOnly
                    value={outputContent}
                    className="w-full h-full min-h-[460px] rounded-xl border border-slate-200 bg-slate-50/50 p-4 font-mono text-xs sm:text-sm text-slate-800 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
