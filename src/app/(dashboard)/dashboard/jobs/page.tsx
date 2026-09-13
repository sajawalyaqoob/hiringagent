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
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
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
      missingSkills: ["Micro-frontends"],
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
      matchingSkills: ["AWS", "Kubernetes", "Docker", "CI/CD GitHub Actions"],
      missingSkills: ["Terraform", "Python"],
      postedAt: "2026-03-01",
      isSaved: false,
      description:
        "Snowflake is hiring a Cloud Infrastructure Engineer to optimize our multi-region Kubernetes clusters and secure cloud infrastructure automation.",
    },
  ]);

  const toggleSave = (id: string) => {
    setJobs(jobs.map((j) => (j.id === id ? { ...j, isSaved: !j.isSaved } : j)));
  };

  const handleAnalyzeNewJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle || !newCompany) return;

    const newJobItem = {
      id: `job_custom_${Date.now()}`,
      title: newJobTitle,
      company: newCompany,
      location: newLocation,
      workplaceType: "remote",
      seniority: "senior",
      salary: "Market Competitive",
      matchScore: 88,
      experienceRequired: "5+ years",
      matchingSkills: ["TypeScript", "Next.js", "React", "PostgreSQL"],
      missingSkills: ["Domain Specific Tools"],
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
      {/* 1. Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Job Matches</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Curated opportunities matched against your verified skills, experience, and compensation preferences.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setSavedModalOpen(true)}
          className="font-bold text-sm gap-2 shrink-0 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Analyze Any Job</span>
        </Button>
      </div>

      {/* 2. Filter Toolbar (Responsive Grid) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by job title, company, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          {/* Workplace Filter */}
          <div className="sm:col-span-3">
            <select
              value={workplaceFilter}
              onChange={(e) => setWorkplaceFilter(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-xs sm:text-sm text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
            >
              <option value="all">All Locations (Any)</option>
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="on_site">On-Site</option>
            </select>
          </div>

          {/* Min Match Slider */}
          <div className="sm:col-span-3 flex items-center gap-2.5 px-2">
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
              Min Match: {minMatchScore}%
            </span>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={minMatchScore}
              onChange={(e) => setMinMatchScore(parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. Jobs Results List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-1">
          <span className="font-semibold text-slate-700">Showing {filteredJobs.length} matched positions</span>
          <span>Matched against your verified profile (88% completeness)</span>
        </div>

        <div className="space-y-3.5">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:border-indigo-200/90 transition-all duration-200 shadow-xs hover:shadow-md">
              <CardContent className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Left: Job Meta & Skills */}
                <div className="space-y-2.5 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/dashboard/jobs/${job.id}`}
                      className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                    >
                      {job.title}
                    </Link>
                    <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-800">
                      {job.company}
                    </span>
                    <span className="text-xs text-slate-500 capitalize font-medium">
                      • {job.workplaceType}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      Posted {formatDate(job.postedAt)}
                    </span>
                  </div>

                  {/* Skills Alignment Badges */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-slate-400">Matching:</span>
                      {job.matchingSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-xs text-emerald-800 font-medium"
                        >
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                    {job.missingSkills.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-slate-400">Missing:</span>
                        {job.missingSkills.map((gap) => (
                          <span
                            key={gap}
                            className="rounded-lg bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-xs text-amber-800 font-medium"
                          >
                            + {gap}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Score Gauge & Actions */}
                <div className="flex items-center justify-between lg:justify-end gap-5 shrink-0 lg:border-l lg:border-slate-100 lg:pl-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="text-left lg:text-right">
                    <div className="text-2xl font-black text-emerald-600 tracking-tight">{job.matchScore}%</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Match Fit</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleSave(job.id)}
                      className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                        job.isSaved
                          ? "bg-amber-50 text-amber-600 border-amber-200"
                          : "bg-white text-slate-400 border-slate-200 hover:text-slate-800 hover:bg-slate-50"
                      }`}
                      title={job.isSaved ? "Saved" : "Save job"}
                    >
                      <Bookmark className="h-4 w-4 fill-current" />
                    </button>

                    <Link href={`/dashboard/jobs/${job.id}`}>
                      <Button variant="outline" size="sm" className="font-semibold text-xs">
                        Details
                      </Button>
                    </Link>

                    <Link href={`/dashboard/create?jobTitle=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}`}>
                      <Button variant="primary" size="sm" className="font-bold text-xs gap-1 shadow-xs">
                        <span>Tailor</span>
                        <ArrowRight className="h-3.5 w-3.5" />
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
        title="Analyze Custom Job Description"
        description="Paste any job description to calculate your compatibility score and identify matching skills."
      >
        <form onSubmit={handleAnalyzeNewJob} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-800 block mb-1">Job Title</label>
            <Input
              placeholder="e.g. Senior Backend Engineer"
              value={newJobTitle}
              onChange={(e) => setNewJobTitle(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Company</label>
              <Input
                placeholder="e.g. Stripe"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">Location</label>
              <Input
                placeholder="e.g. Remote"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Job Description</label>
            <Textarea
              rows={4}
              placeholder="Paste job requirements, responsibilities, and qualifications..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setSavedModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" className="font-bold">
              Analyze Compatibility
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
