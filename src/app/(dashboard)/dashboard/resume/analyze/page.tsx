"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  Download,
  Copy,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function ResumeAnalyzePage() {
  const [copied, setCopied] = React.useState(false);

  const analysis = {
    title: "Alex_Morgan_Senior_FullStack_Resume_2026.pdf",
    atsScore: 92,
    formatScore: 95,
    keywordScore: 88,
    impactScore: 92,
    strengths: [
      "Consistent reverse-chronological layout with standard section headers recognized by Workday and Greenhouse ATS parsers.",
      "Strong quantifiable impact metrics ('45M+ daily requests', '$120k annually saved', '38% latency reduction').",
      "Clear technical skill taxonomy categorized by programming languages, frameworks, and infrastructure.",
    ],
    improvements: [
      "Include explicit references to cloud cost monitoring tools (e.g. AWS Cost Explorer, Datadog Billing).",
      "Add brief summaries for open-source project outcomes alongside direct GitHub references.",
      "Ensure bullet points in the earliest positions maintain active voice and outcome-focused verbs.",
    ],
    detectedKeywords: [
      "TypeScript",
      "Next.js",
      "React",
      "PostgreSQL",
      "Go (Golang)",
      "Apache Kafka",
      "Docker",
      "Kubernetes",
      "AWS",
      "Microservices",
      "CI/CD Pipelines",
      "Distributed Systems",
    ],
    missingKeywords: [
      "Terraform / IaC",
      "GraphQL Federation",
      "Site Reliability Engineering (SRE)",
      "SOC2 Compliance",
    ],
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d5d9d9] pb-4 bg-white p-4 rounded-xs">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/resume">
            <Button variant="outline" size="sm" className="h-8 px-2.5">
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#0f1111]">ATS Resume Compatibility Breakdown</h1>
            <p className="text-xs text-[#565959] mt-0.5">
              Document: <span className="font-mono font-semibold text-[#0f1111]">{analysis.title}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/create">
            <Button variant="primary" size="sm" className="font-bold text-xs gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Tailor For A Job</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Score Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#d5d9d9] bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#565959]">Overall ATS Health</span>
          <div className="text-3xl font-black text-[#067d62] mt-1">{analysis.atsScore} / 100</div>
          <p className="text-[11px] text-emerald-700 mt-1 font-semibold">Exceeds 90% Threshold</p>
        </Card>

        <Card className="border-[#d5d9d9] bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#565959]">Format Integrity</span>
          <div className="text-3xl font-black text-[#0f1111] mt-1">{analysis.formatScore}%</div>
          <p className="text-[11px] text-[#565959] mt-1">Parses cleanly without OCR errors</p>
        </Card>

        <Card className="border-[#d5d9d9] bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#565959]">Keyword Alignment</span>
          <div className="text-3xl font-black text-[#0f1111] mt-1">{analysis.keywordScore}%</div>
          <p className="text-[11px] text-[#565959] mt-1">12 Core technical keywords found</p>
        </Card>

        <Card className="border-[#d5d9d9] bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#565959]">Metric Impact Score</span>
          <div className="text-3xl font-black text-[#0f1111] mt-1">{analysis.impactScore}%</div>
          <p className="text-[11px] text-[#565959] mt-1">6 Strong quantifiable achievements</p>
        </Card>
      </div>

      {/* Two Column Analysis: Strengths vs Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="border-[#d5d9d9] bg-white shadow-2xs">
          <CardHeader className="p-4 border-b border-[#f3f4f6]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#067d62]" />
              <CardTitle className="text-sm font-bold text-[#0f1111]">ATS Parsing Strengths</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {analysis.strengths.map((s, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#374151]">
                <span className="font-mono text-[#067d62] font-bold">✓</span>
                <p className="leading-relaxed">{s}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actionable Improvements */}
        <Card className="border-[#d5d9d9] bg-white shadow-2xs">
          <CardHeader className="p-4 border-b border-[#f3f4f6]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-[#b45309]" />
              <CardTitle className="text-sm font-bold text-[#0f1111]">Actionable Recommendations</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {analysis.improvements.map((imp, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#374151]">
                <span className="font-mono text-[#b45309] font-bold">→</span>
                <p className="leading-relaxed">{imp}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Keywords Breakdown */}
      <Card className="border-[#d5d9d9] bg-white shadow-2xs">
        <CardHeader className="p-4 border-b border-[#f3f4f6]">
          <CardTitle className="text-sm font-bold text-[#0f1111]">ATS Keyword Density Breakdown</CardTitle>
          <CardDescription className="text-xs text-[#565959]">
            Terms extracted and parsed compared against market-standard job requirements.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#067d62] uppercase tracking-wider block">
              Detected High-Yield Keywords ({analysis.detectedKeywords.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {analysis.detectedKeywords.map((kw) => (
                <span key={kw} className="rounded-xs bg-[#ecfdf5] border border-[#a7f3d0] px-2 py-0.5 text-xs text-[#067d62] font-medium">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#f3f4f6]">
            <span className="text-xs font-bold text-[#b45309] uppercase tracking-wider block">
              Missing High-Frequency Keywords ({analysis.missingKeywords.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {analysis.missingKeywords.map((kw) => (
                <span key={kw} className="rounded-xs bg-[#fffbeb] border border-[#fde68a] px-2 py-0.5 text-xs text-[#b45309] font-medium">
                  + {kw}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
