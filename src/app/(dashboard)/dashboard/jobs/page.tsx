"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Bookmark,
  Sparkles,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  ArrowRight,
  ExternalLink,
  SlidersHorizontal,
  Plus,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { formatDate } from "@/lib/utils/formatters";

export default function JobsDiscoveryPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [minMatchScore, setMinMatchScore] = React.useState(70);
  const [workplaceFilter, setWorkplaceFilter] = React.useState("all");
  const [savedModalOpen, setSavedModalOpen] = React.useState(false);

  // New Job Modal State
  const [newJobTitle, setNewJobTitle] = React.useState("");
  const [newCompany, setNewCompany] = React.useState("");
  const [newLocation, setNewLocation] = React.useState("Remote");
  const [newDescription, setNewDescription] = React.useState("");

  const [jobs, setJobs] = React.useState([
    {
      id: "job_01",
      title: "Senior Full-Stack Engineer (Core Platform)",
      company: "Stripe",
      location: "Seattle, WA (Remote US)",
      workplaceType: "remote",
      seniority: "senior",
      salary: "$185,000 - $235,000",
      matchScore: 94,
      experienceRequired: "5+ years",
      matchingSkills: ["TypeScript", "React", "Next.js", "PostgreSQL", "Go", "Kafka", "AWS"],
      missingSkills: ["Stripe API"],
      postedAt: "2026-03-05",
      isSaved: true,
      description:
        "We are seeking a Senior Full-Stack Engineer to lead the architecture of our developer billing platform. You will build highly available web interfaces with Next.js/React and scale robust transaction services in Go and PostgreSQL handling millions of events daily.",
    },
    {
      id: "job_03",
      title: "Lead Frontend Engineer (Next.js / Design Systems)",
      company: "Vercel",
      location: "Remote (Global)",
      workplaceType: "remote",
      seniority: "lead",
      salary: "$195,000 - $245,000",
      matchScore: 96,
      experienceRequired: "6+ years",
      matchingSkills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Web Performance"],
      missingSkills: ["Micro-frontend architecture"],
      postedAt: "2026-03-02",
      isSaved: true,
      description:
        "Join Vercel to craft the developer dashboard and component systems powering millions of global creators. You should be deeply versed in Next.js App Router, web accessibility (a11y), Tailwind CSS, and edge caching strategies.",
    },
    {
      id: "job_02",
      title: "Staff Distributed Systems Engineer",
      company: "Datadog",
      location: "New York, NY (Hybrid)",
      workplaceType: "hybrid",
      seniority: "lead",
      salary: "$210,000 - $260,000",
      matchScore: 82,
      experienceRequired: "7+ years",
      matchingSkills: ["Go", "Kubernetes", "Kafka", "Distributed Systems", "PostgreSQL"],
      missingSkills: ["eBPF", "Rust"],
      postedAt: "2026-03-04",
      isSaved: false,
      description:
        "Datadog is looking for a Staff Engineer to build next-generation ingestion pipelines. You will design ultra-low-latency distributed stream processing clusters handling petabytes of telemetry per minute.",
    },
    {
      id: "job_04",
      title: "Senior Cloud Infrastructure Engineer",
      company: "Snowflake",
      location: "Bellevue, WA",
      workplaceType: "on_site",
      seniority: "senior",
      salary: "$180,000 - $225,000",
      matchScore: 78,
      experienceRequired: "5+ years",
      matchingSkills: ["AWS", "Kubernetes", "Docker", "Go", "PostgreSQL"],
      missingSkills: ["Terraform", "Multi-Cloud Azure/GCP"],
      postedAt: "2026-03-01",
      isSaved: false,
      description:
        "Build high-security multi-cloud foundations across AWS, Azure, and GCP for Snowflake's petabyte data cloud. Automate infrastructure as code with Terraform, Helm, and Go-based operators.",
    },
  ]);

  const toggleSave = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, isSaved: !j.isSaved } : j))
    );
  };

  const handleAnalyzeNewJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle || !newCompany || !newDescription) return;

    const newJobItem = {
      id: `job_pasted_${Date.now()}`,
      title: newJobTitle,
      company: newCompany,
      location: newLocation,
      workplaceType: "remote",
      seniority: "senior",
      salary: "$180,000 - $220,000 (Est.)",
      matchScore: 89,
      experienceRequired: "5+ years",
      matchingSkills: ["TypeScript", "Next.js", "React", "PostgreSQL"],
      missingSkills: ["Domain Specific API"],
      postedAt: new Date().toISOString().split("T")[0],
      isSaved: true,
      description: newDescription,
    };

    setJobs([newJobItem, ...jobs]);
    setSavedModalOpen(false);
    setNewJobTitle("");
    setNewCompany("");
    setNewDescription("");
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesQuery =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.matchingSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesScore = job.matchScore >= minMatchScore;
    const matchesWorkplace = workplaceFilter === "all" || job.workplaceType === workplaceFilter;

    return matchesQuery && matchesScore && matchesWorkplace;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d5d9d9] pb-4 bg-white p-4 rounded-xs">
        <div>
          <h1 className="text-lg font-bold text-[#0f1111]">Job Discovery & Compatibility</h1>
          <p className="text-xs text-[#565959] mt-0.5">
            Real-time market opportunities calibrated against your verified senior engineering profile.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setSavedModalOpen(true)}
          className="font-bold text-xs gap-1.5 shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Analyze Any Job Description</span>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-xs border border-[#d5d9d9] bg-white p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by job title, company, or technical keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-full rounded-xs border border-[#d5d9d9] pl-8 pr-3 text-xs text-[#0f1111] focus:border-[#f08804] focus:outline-none"
            />
          </div>

          {/* Workplace Filter */}
          <div className="sm:col-span-3">
            <select
              value={workplaceFilter}
              onChange={(e) => setWorkplaceFilter(e.target.value)}
              className="h-8 w-full rounded-xs border border-[#d5d9d9] bg-white px-2 text-xs text-[#0f1111] focus:border-[#f08804] focus:outline-none"
            >
              <option value="all">All Workplace Types</option>
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="on_site">On-Site</option>
            </select>
          </div>

          {/* Min Match Slider */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#565959] whitespace-nowrap">
              Min Fit: {minMatchScore}%
            </span>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={minMatchScore}
              onChange={(e) => setMinMatchScore(parseInt(e.target.value))}
              className="w-full accent-[#f08804]"
            />
          </div>
        </div>
      </div>

      {/* Jobs Results List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs text-[#565959]">
          <span>Showing {filteredJobs.length} scored positions</span>
          <span className="font-semibold text-[#0f1111]">Calibrated with Alex Morgan Profile (88%)</span>
        </div>

        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="border-[#d5d9d9] bg-white hover:border-[#9ca3af] transition-colors shadow-2xs">
              <CardContent className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Job Meta & Skills */}
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/dashboard/jobs/${job.id}`}
                      className="text-base font-bold text-[#0f1111] hover:text-[#b45309]"
                    >
                      {job.title}
                    </Link>
                    <span className="rounded-xs bg-[#f8f9fa] border border-[#d5d9d9] px-2 py-0.5 text-[11px] font-bold text-[#0f1111]">
                      {job.company}
                    </span>
                    <span className="text-xs text-[#565959] capitalize font-medium">
                      • {job.workplaceType}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#565959]">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#0f1111]">
                      <DollarSign className="h-3.5 w-3.5" />
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Posted {formatDate(job.postedAt)}
                    </span>
                  </div>

                  {/* Skills Alignment Badges */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] uppercase font-bold text-gray-400">Matches:</span>
                      {job.matchingSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-xs bg-[#ecfdf5] border border-[#a7f3d0] px-1.5 py-0.2 text-[11px] text-[#067d62] font-medium"
                        >
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                    {job.missingSkills.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] uppercase font-bold text-gray-400">Gaps:</span>
                        {job.missingSkills.map((gap) => (
                          <span
                            key={gap}
                            className="rounded-xs bg-[#fffbeb] border border-[#fde68a] px-1.5 py-0.2 text-[11px] text-[#b45309] font-medium"
                          >
                            ⚠ {gap}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Score Gauge & Actions */}
                <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 lg:border-l lg:border-[#e5e7eb] lg:pl-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#f3f4f6]">
                  <div className="text-left lg:text-right">
                    <div className="text-2xl font-black text-[#067d62]">{job.matchScore}%</div>
                    <div className="text-[10px] uppercase font-bold text-gray-400">Compatibility</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleSave(job.id)}
                      className={`p-2 rounded-xs border ${
                        job.isSaved
                          ? "bg-[#fffbeb] text-[#f08804] border-[#fde68a]"
                          : "bg-white text-gray-400 border-[#d5d9d9] hover:text-black"
                      }`}
                      title={job.isSaved ? "Saved in opportunities" : "Save job"}
                    >
                      <Bookmark className="h-4 w-4 fill-current" />
                    </button>

                    <Link href={`/dashboard/jobs/${job.id}`}>
                      <Button variant="primary" size="sm" className="font-bold text-xs">
                        Analyze Fit
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Paste Job Description Analyzer Modal */}
      <Modal
        isOpen={savedModalOpen}
        onClose={() => setSavedModalOpen(false)}
        title="Analyze Any Job Description"
        description="Paste raw job description text to calculate your candidate compatibility score and extract missing skills."
      >
        <form onSubmit={handleAnalyzeNewJob} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-[#0f1111]">Job Title</label>
            <Input
              placeholder="e.g. Senior Backend Engineer"
              value={newJobTitle}
              onChange={(e) => setNewJobTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-[#0f1111]">Company</label>
              <Input
                placeholder="e.g. GitHub"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="font-bold text-[#0f1111]">Location</label>
              <Input
                placeholder="e.g. Remote"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#0f1111]">Raw Job Description</label>
            <Textarea
              rows={5}
              placeholder="Paste full job description requirements and responsibilities..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#f3f4f6]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSavedModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="font-bold">
              Run Compatibility Engine
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
