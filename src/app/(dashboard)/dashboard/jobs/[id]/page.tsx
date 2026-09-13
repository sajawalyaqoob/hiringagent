"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Layers,
  Bookmark,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params?.id as string;

  // Realistic mock data matching job_01 or default
  const job = {
    id: jobId || "job_01",
    title: "Senior Full-Stack Engineer (Core Platform)",
    company: "Stripe",
    location: "Seattle, WA (Remote US)",
    workplaceType: "remote",
    seniority: "Senior Engineer",
    experienceRequired: "5+ years",
    salary: "$185,000 - $235,000 + Equity",
    postedAt: "March 5, 2026",
    matchScore: 94,
    skillsScore: 96,
    experienceScore: 95,
    seniorityScore: 90,
    sourceUrl: "https://stripe.com/jobs/senior-fullstack-core",
    description:
      "We are seeking a Senior Full-Stack Engineer to lead the architecture of our developer billing platform. You will build highly available web interfaces with Next.js/React and scale robust transaction services in Go and PostgreSQL handling millions of events daily.",
    responsibilities: [
      "Own end-to-end architecture from web console interfaces to mission-critical backend transactional databases.",
      "Improve system reliability, latency, and observability across globally distributed payment services.",
      "Collaborate with product managers and developer experience engineers to ship frictionless billing tools.",
      "Conduct rigorous code reviews and mentor engineers on distributed systems resilience.",
    ],
    requiredSkills: ["TypeScript", "React", "Next.js", "PostgreSQL", "Distributed Systems"],
    preferredSkills: ["Go (Golang)", "Apache Kafka", "AWS Cloud", "Stripe API"],
    matchingSkills: ["TypeScript", "React", "Next.js", "PostgreSQL", "Go", "Kafka", "AWS"],
    missingSkills: ["Stripe API (prior commercial integration)"],
    potentialConcerns: [
      "No direct Stripe API commercial integration listed in current experience, though Go and Kafka transaction depth exceeds baseline.",
    ],
    recommendation:
      "Strong compatibility (94%). Apply immediately with a tailored resume emphasizing high-throughput Kafka streaming and Next.js frontend performance metrics.",
  };

  return (
    <div className="space-y-6">
      {/* Back Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d5d9d9] pb-4 bg-white p-4 rounded-xs">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/jobs">
            <Button variant="outline" size="sm" className="h-8 px-2.5">
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#0f1111]">{job.title}</h1>
              <span className="rounded-xs bg-[#f8f9fa] border border-[#d5d9d9] px-2 py-0.5 text-xs font-bold">
                {job.company}
              </span>
            </div>
            <p className="text-xs text-[#565959] mt-0.5">
              {job.location} • {job.seniority} • {job.salary}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/dashboard/create?jobTitle=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}`}>
            <Button variant="primary" size="sm" className="font-bold text-xs gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Tailor Resume & Letter</span>
            </Button>
          </Link>
          <Link href="/dashboard/applications">
            <Button variant="outline" size="sm" className="text-xs font-semibold gap-1">
              <Layers className="h-3.5 w-3.5 text-[#f08804]" />
              <span>Track in Pipeline</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Job Details vs Compatibility Analyzer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Job Specifications */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-[#d5d9d9] bg-white shadow-2xs">
            <CardHeader className="p-4 border-b border-[#f3f4f6]">
              <CardTitle className="text-sm font-bold text-[#0f1111]">Position Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs leading-relaxed text-[#374151]">
              <p>{job.description}</p>

              <div>
                <h4 className="font-bold text-[#0f1111] text-xs uppercase tracking-wider mb-2">
                  Key Responsibilities
                </h4>
                <ul className="space-y-1.5 list-disc pl-4 text-gray-700">
                  {job.responsibilities.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#0f1111] text-xs uppercase tracking-wider mb-2">
                  Required Criteria
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {job.requiredSkills.map((req) => (
                    <span key={req} className="rounded-xs bg-gray-100 border border-gray-300 px-2 py-0.5 text-xs text-gray-800 font-semibold">
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#0f1111] text-xs uppercase tracking-wider mb-2">
                  Preferred Qualifications
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {job.preferredSkills.map((pref) => (
                    <span key={pref} className="rounded-xs bg-gray-50 border border-gray-200 px-2 py-0.5 text-xs text-gray-700">
                      {pref}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#f3f4f6] flex items-center justify-between text-gray-400 text-[11px]">
                <span>Opportunity ID: {job.id}</span>
                <a
                  href={job.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#b45309] font-bold hover:underline flex items-center gap-1"
                >
                  <span>View Original Listing</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Side-by-Side Compatibility Engine Analysis */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-[#d5d9d9] bg-white shadow-2xs">
            <CardHeader className="p-4 border-b border-[#f3f4f6]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#565959]">
                  Candidate Fit Engine
                </span>
                <span className="rounded-xs bg-[#ecfdf5] border border-[#a7f3d0] px-2 py-0.5 text-xs font-black text-[#067d62]">
                  HIGH COMPATIBILITY
                </span>
              </div>
              <CardTitle className="text-2xl font-black text-[#0f1111] mt-1">
                {job.matchScore}% Overall Compatibility
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Detailed Category Sub-Scores */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-700">Skills Alignment ({job.skillsScore}%)</span>
                  <span className="text-[#067d62]">7 of 8 Found</span>
                </div>
                <Progress value={job.skillsScore} className="h-1.5 bg-gray-200" />

                <div className="flex justify-between text-xs font-semibold pt-1">
                  <span className="text-gray-700">Experience Alignment ({job.experienceScore}%)</span>
                  <span className="text-[#067d62]">6 yrs vs 5 req</span>
                </div>
                <Progress value={job.experienceScore} className="h-1.5 bg-gray-200" />

                <div className="flex justify-between text-xs font-semibold pt-1">
                  <span className="text-gray-700">Seniority Calibration ({job.seniorityScore}%)</span>
                  <span className="text-[#067d62]">Senior to Senior</span>
                </div>
                <Progress value={job.seniorityScore} className="h-1.5 bg-gray-200" />
              </div>

              {/* Matching Skills */}
              <div className="space-y-1.5 pt-2 border-t border-[#f3f4f6]">
                <span className="text-[11px] uppercase font-bold text-[#067d62] block">
                  Matching Candidate Skills ({job.matchingSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {job.matchingSkills.map((m) => (
                    <span key={m} className="rounded-xs bg-[#ecfdf5] border border-[#a7f3d0] px-2 py-0.5 text-xs text-[#067d62] font-medium">
                      ✓ {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="space-y-1.5 pt-2 border-t border-[#f3f4f6]">
                <span className="text-[11px] uppercase font-bold text-[#b45309] block">
                  Identified Gaps ({job.missingSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {job.missingSkills.map((gap) => (
                    <span key={gap} className="rounded-xs bg-[#fffbeb] border border-[#fde68a] px-2 py-0.5 text-xs text-[#b45309] font-medium">
                      ⚠ {gap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Potential Concerns */}
              <div className="rounded-xs bg-[#fffbeb] border border-[#fde68a] p-3 text-xs text-[#b45309] space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Seniority & Scope Note</span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#78350f]">
                  {job.potentialConcerns[0]}
                </p>
              </div>

              {/* Recommended Action */}
              <div className="rounded-xs bg-[#f8f9fa] border border-[#d5d9d9] p-3 text-xs space-y-1">
                <p className="font-bold text-[#0f1111]">Recommended Strategy:</p>
                <p className="text-[11px] text-[#565959] leading-relaxed">
                  {job.recommendation}
                </p>
              </div>

              {/* Primary Call to Action */}
              <Link href={`/dashboard/create?jobTitle=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}`} className="block w-full">
                <Button variant="primary" size="md" className="w-full font-bold">
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  Generate Tailored Application
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
