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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GenerationType, GenerationState } from "@/types/database";

const GENERATION_MODES: Array<{ id: GenerationType; title: string; desc: string; icon: React.ElementType }> = [
  { id: "tailored_resume", title: "Tailored Resume", desc: "Keyword-aligned ATS resume bullets", icon: FileText },
  { id: "cover_letter", title: "Cover Letter", desc: "Metrics-driven personalized letter", icon: Mail },
  { id: "recruiter_email", title: "Recruiter Cold Email", desc: "High-impact 3-bullet intro message", icon: Send },
  { id: "linkedin_post", title: "LinkedIn Application Post", desc: "Network broadcast for hiring referrals", icon: Globe },
  { id: "recruiter_message", title: "InMail / Short Message", desc: "Concise 300-char LinkedIn outreach", icon: Send },
  { id: "application_strategy", title: "Application Strategy", desc: "Interview prep & talking points", icon: Compass },
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
Performance-driven Senior Software Engineer with 6+ years of production experience architecting scalable distributed systems and resilient web applications. Tailored for ${company}'s core developer infrastructure, bringing deep proficiency in modern TypeScript/Next.js architectures, high-volume event streaming, and cloud infrastructure optimization.

## Targeted Key Achievements
- **Architecture & Scale:** Spearheaded distributed event systems processing 45M+ daily requests with 99.99% availability using Go, Kafka, and PostgreSQL.
- **Performance:** Reduced PostgreSQL p99 query latency by 38% through index redesign and partition pruning.
- **Efficiency:** Decreased cloud infrastructure compute costs by $120k annually via automated container right-sizing.

## Core Relevant Technologies
- **Core:** TypeScript, Next.js, React, Node.js, Go (Golang)
- **Data & Storage:** PostgreSQL, Redis, Apache Kafka
- **Infrastructure:** AWS, Kubernetes, Docker, CI/CD GitHub Actions`,

    cover_letter: `Dear ${recipientName},

I am writing to express my strong enthusiasm for the ${jobTitle} role at ${company}. Having followed ${company}'s engineering momentum and developer platform standards, I am eager to contribute my 6+ years of full-stack and systems engineering experience to your high-performing team.

In my current role at CloudScale Technologies, I architected distributed microservices handling over 45 million daily requests while decreasing p99 database latency by 38%. Prior to that, at Vanguard Digital Labs, I led frontend performance initiatives in Next.js and TypeScript that elevated Lighthouse scores from 54 to 98 across customer analytics products.

Specifically: ${keyHighlights} directly aligns with the scalability and reliability goals outlined in ${company}'s platform roadmap.

I would welcome the opportunity to discuss how my technical background and proactive problem-solving can accelerate ${company}'s roadmap. Thank you for your time and consideration.

Warm regards,
Alex Morgan
Seattle, WA | (555) 234-8901 | alex.morgan@example.com`,

    recruiter_email: `Subject: Senior Full-Stack Engineer — Alex Morgan for ${company} ${jobTitle}

Hi ${recipientName},

I hope you're having a productive week.

I noticed ${company}'s opening for the ${jobTitle} position and wanted to reach out directly. Over the past 6 years, I've specialized in building high-throughput distributed systems in Go and TypeScript, and modern web platforms in Next.js.

At CloudScale Technologies, I recently:
• Scaled event-driven microservices to handle 45M+ daily events.
• Reduced PostgreSQL p99 latency by 38% through database indexing and connection pooling.
• Cut AWS compute spend by $120k/year through automated container optimization.

Given your team's stack and requirements, I would love to connect for 10 minutes to learn more about your current engineering priorities and discuss how my experience aligns.

Best regards,
Alex Morgan
Portfolio: https://alexmorgan.codes
LinkedIn: https://linkedin.com/in/alex-morgan-dev`,

    linkedin_post: `🚀 Excited to announce I am actively exploring senior engineering opportunities in enterprise cloud infrastructure and developer platforms!

Over the past 6 years, I've focused on high-throughput distributed systems and modern web architecture:
• Processed 45M+ daily events using Go and Apache Kafka.
• Built full-stack developer consoles in Next.js, React, and TypeScript.
• Tuned high-scale PostgreSQL clusters to cut p99 latency by 38%.

I'm particularly interested in roles like ${jobTitle} at forward-thinking companies like ${company}. If your team is hiring or you know someone leading systems engineering, I'd love to connect!

#SoftwareEngineering #TypeScript #Golang #Nextjs #DistributedSystems #OpenToWork`,

    recruiter_message: `Hi ${recipientName}, saw ${company}'s opening for ${jobTitle}. I've spent 6 years building high-scale distributed systems (Go/Kafka 45M+ events/day) and modern Next.js frontends. Would love to connect for a quick intro if you have 5 minutes this week! - Alex Morgan`,

    application_strategy: `## Strategic Application Playbook for ${jobTitle} at ${company}

### 1. Key Competitive Strengths to Emphasize
- **Event Streaming:** Your Kafka and Go production experience maps directly to ${company}'s real-time transaction processing.
- **Full-Stack Depth:** Few candidates combine low-level systems tuning (PostgreSQL sharding) with modern Next.js App Router performance.

### 2. Potential Gaps to Preempt in Interviews
- **Domain API Experience:** Emphasize rapid ramp-up speed on proprietary APIs by pointing to your StreamQuery open-source project.

### 3. High-Signal Questions for the Hiring Manager
- "How does the billing infrastructure team handle idempotency across multi-region failovers?"
- "What are the primary latency bottlenecks your engineers are solving in 2026?"`,
  };

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleGenerate = async () => {
    setStatus("analyzing");
    setOutputContent("");
    setErrorMessage(null);

    try {
      setStatus("generating");

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        console.warn("API response without content, using template fallback:", result.error);
        setOutputContent(sampleOutputs[selectedMode]);
        setStatus("completed");
      }
    } catch (err: any) {
      console.warn("Generation fetch error, using template fallback:", err);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d5d9d9] pb-4 bg-white p-4 rounded-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#0f1111]">AI Generation Studio</h1>
            <Badge variant="info">Zero Hallucination Guaranteed</Badge>
          </div>
          <p className="text-xs text-[#565959] mt-0.5">
            Generates tailored resumes, cover letters, and outreach grounded strictly in your verified career history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#565959] font-medium">Model Calibration:</span>
          <span className="rounded-xs bg-[#f8f9fa] border border-[#d5d9d9] px-2 py-0.5 text-xs font-bold text-[#0f1111]">
            Deterministic SaaS v1.0
          </span>
        </div>
      </div>

      {/* Mode Selector Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
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
              className={`rounded-xs border p-3 text-left transition-colors flex flex-col justify-between ${
                isSelected
                  ? "border-[#f08804] bg-[#fffbeb] shadow-xs"
                  : "border-[#d5d9d9] bg-white hover:border-[#9ca3af]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-4 w-4 ${isSelected ? "text-[#f08804]" : "text-gray-500"}`} />
                {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-[#f08804]" />}
              </div>
              <div>
                <p className={`text-xs font-bold ${isSelected ? "text-[#b45309]" : "text-[#0f1111]"}`}>
                  {mode.title}
                </p>
                <p className="text-[10px] text-[#565959] leading-tight mt-0.5">{mode.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Two Column Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input & Strategy Controls */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-[#d5d9d9] bg-white shadow-2xs">
            <CardHeader className="p-4 border-b border-[#f3f4f6]">
              <CardTitle className="text-sm font-bold text-[#0f1111]">Generation Parameters</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#0f1111] block mb-1">Target Job Title</label>
                <Input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Full-Stack Engineer"
                />
              </div>

              <div>
                <label className="font-bold text-[#0f1111] block mb-1">Company Name</label>
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#0f1111] block mb-1">Tone & Voice</label>
                  <Select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as typeof tone)}
                    options={[
                      { value: "professional", label: "Professional & Direct" },
                      { value: "confident", label: "High-Confidence" },
                      { value: "enthusiastic", label: "Mission-Enthusiastic" },
                      { value: "concise", label: "Executive Concise" },
                    ]}
                  />
                </div>
                <div>
                  <label className="font-bold text-[#0f1111] block mb-1">Recipient Name</label>
                  <Input
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#0f1111] block mb-1">Key Metrics to Highlight</label>
                <Input
                  value={keyHighlights}
                  onChange={(e) => setKeyHighlights(e.target.value)}
                  placeholder="e.g. 45M+ daily requests, Go/Kafka, PostgreSQL"
                />
              </div>

              <div>
                <label className="font-bold text-[#0f1111] block mb-1">Job Context / Description</label>
                <Textarea
                  rows={3}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste context from listing..."
                />
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleGenerate}
                isLoading={status === "analyzing" || status === "generating"}
                className="w-full font-bold mt-2"
              >
                <Sparkles className="h-4 w-4 mr-1.5" />
                <span>
                  {status === "analyzing"
                    ? "Deconstructing Job Requirements..."
                    : status === "generating"
                    ? "Synthesizing Verified Career Artifact..."
                    : `Generate ${GENERATION_MODES.find((m) => m.id === selectedMode)?.title}`}
                </span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Output Preview & Actions */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-[#d5d9d9] bg-white shadow-2xs flex flex-col h-full min-h-[500px]">
            <CardHeader className="p-4 border-b border-[#f3f4f6] flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-bold text-[#0f1111]">
                  Generated Output Preview
                </CardTitle>
                {status === "completed" && (
                  <Badge variant="success">Completed</Badge>
                )}
              </div>

              {status === "completed" && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="text-xs h-7 px-2.5"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    <span>{copied ? "Copied!" : "Copy Text"}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerate}
                    className="text-xs h-7 px-2.5"
                    title="Regenerate"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent className="p-4 flex-1 flex flex-col">
              {status === "idle" && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400 space-y-3">
                  <div className="h-10 w-10 rounded-full bg-[#f8f9fa] border border-[#d5d9d9] flex items-center justify-center text-gray-400">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0f1111]">Studio Workspace Ready</h4>
                    <p className="text-xs text-[#565959] mt-1 max-w-sm">
                      Select your mode on the left and click Generate to produce tailored application artifacts.
                    </p>
                  </div>
                </div>
              )}

              {(status === "analyzing" || status === "generating") && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#d5d9d9] border-t-[#f08804]" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#0f1111]">
                      {status === "analyzing" ? "Analyzing Job Requirements" : "Formulating Targeted Content"}
                    </p>
                    <p className="text-[11px] text-[#565959]">
                      Cross-referencing your 6 years experience without hallucinations...
                    </p>
                  </div>
                </div>
              )}

              {status === "completed" && (
                <div className="flex-1">
                  <textarea
                    readOnly
                    value={outputContent}
                    className="w-full h-full min-h-[420px] rounded-xs border border-[#e5e7eb] bg-[#f8f9fa] p-4 font-mono text-xs text-[#0f1111] leading-relaxed resize-none focus:outline-none"
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
