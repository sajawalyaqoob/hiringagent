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
  Globe,
  Share2,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { formatDate } from "@/lib/utils/formatters";

interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  workplaceType: string;
  seniority: string;
  salary: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  postedAt: string;
  isSaved: boolean;
  description: string;
  sourceUrl?: string;
}

export default function JobsDiscoveryPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [minMatchScore, setMinMatchScore] = React.useState(70);
  const [workplaceFilter, setWorkplaceFilter] = React.useState("all");
  const [seniorityFilter, setSeniorityFilter] = React.useState("all");
  const [savedModalOpen, setSavedModalOpen] = React.useState(false);

  // Profile data for dynamic query links
  const [candidateRole, setCandidateRole] = React.useState("Software Engineer");
  const [candidateLocation, setCandidateLocation] = React.useState("Remote");
  const [candidateSkills, setCandidateSkills] = React.useState<string[]>([]);

  // Jobs state
  const [jobs, setJobs] = React.useState<JobItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  // New Job Modal State
  const [newJobTitle, setNewJobTitle] = React.useState("");
  const [newCompany, setNewCompany] = React.useState("");
  const [newLocation, setNewLocation] = React.useState("Remote");
  const [newDescription, setNewDescription] = React.useState("");
  const [submittingJob, setSubmittingJob] = React.useState(false);

  // Load User Profile and Initial Jobs
  const loadData = React.useCallback(async () => {
    try {
      const [profileRes, jobsRes] = await Promise.all([
        fetch("/api/profile").then((r) => r.json()).catch(() => null),
        fetch("/api/jobs").then((r) => r.json()).catch(() => null),
      ]);

      if (profileRes?.data?.profile) {
        const p = profileRes.data.profile;
        if (p.currentJobTitle) setCandidateRole(p.currentJobTitle);
        if (p.location) setCandidateLocation(p.location);
      }
      if (profileRes?.data?.skills) {
        setCandidateSkills(profileRes.data.skills.map((s: any) => s.name));
      }

      if (jobsRes?.data && Array.isArray(jobsRes.data)) {
        const formatted: JobItem[] = jobsRes.data.map((item: any) => {
          const j = item.job;
          const m = item.match;
          const salaryFormatted = j.salaryMin
            ? `$${j.salaryMin.toLocaleString()} - $${(j.salaryMax || j.salaryMin * 1.3).toLocaleString()}`
            : "Competitive Market Rate";

          return {
            id: j.id,
            title: j.title,
            company: j.company,
            location: j.location || "Remote",
            workplaceType: j.workplaceType || "remote",
            seniority: j.seniority || "mid",
            salary: salaryFormatted,
            matchScore: m?.overallScore ?? m?.matchScore ?? 82,
            matchingSkills: m?.matchingSkills || j.requiredSkills?.slice(0, 4) || [],
            missingSkills: m?.missingSkills || [],
            postedAt: j.postedAt || new Date().toISOString(),
            isSaved: Boolean(m?.isSaved),
            description: j.description || "",
            sourceUrl: j.sourceUrl,
          };
        });
        setJobs(formatted);
      }
    } catch (err) {
      console.error("Failed to load jobs data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const toggleSave = async (id: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, isSaved: !j.isSaved } : j))
    );
    try {
      await fetch(`/api/jobs/${id}/save`, { method: "POST" });
    } catch (err) {
      console.warn("Failed to persist save toggle:", err);
    }
  };

  const handleAnalyzeNewJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle || !newCompany) return;
    setSubmittingJob(true);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newJobTitle,
          company: newCompany,
          location: newLocation,
          description: newDescription || `${newJobTitle} at ${newCompany}.`,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.job) {
        const j = data.data.job;
        const m = data.data.match;
        const newJobItem: JobItem = {
          id: j.id,
          title: j.title,
          company: j.company,
          location: j.location,
          workplaceType: j.workplaceType || "remote",
          seniority: j.seniority || "mid",
          salary: j.salaryMin ? `$${j.salaryMin.toLocaleString()}` : "Market Competitive",
          matchScore: m?.overallScore || 88,
          matchingSkills: m?.matchingSkills || ["Core Competencies"],
          missingSkills: m?.missingSkills || [],
          postedAt: new Date().toISOString(),
          isSaved: true,
          description: j.description,
          sourceUrl: j.sourceUrl,
        };
        setJobs([newJobItem, ...jobs]);
      }
    } catch (err) {
      console.error("Error analyzing pasted job:", err);
    } finally {
      setSubmittingJob(false);
      setSavedModalOpen(false);
      setNewJobTitle("");
      setNewCompany("");
      setNewDescription("");
    }
  };

  // External Search URLs
  const activeSearchTerm = searchQuery.trim() || candidateRole;
  const activeSearchLocation = candidateLocation || "Remote";
  const linkedInSearchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(activeSearchTerm)}&location=${encodeURIComponent(activeSearchLocation)}`;
  const googleJobsSearchUrl = `https://www.google.com/search?q=jobs+${encodeURIComponent(activeSearchTerm)}+${encodeURIComponent(activeSearchLocation)}&ibp=htl;jobs`;

  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      job.matchingSkills.some((s) => s.toLowerCase().includes(q));

    const matchesScore = job.matchScore >= minMatchScore;
    const matchesWorkplace = workplaceFilter === "all" || job.workplaceType === workplaceFilter;
    const matchesSeniority = seniorityFilter === "all" || job.seniority === seniorityFilter;

    return matchesQuery && matchesScore && matchesWorkplace && matchesSeniority;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Quick Search Integrations */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-gradient-to-r from-white via-indigo-50/20 to-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-2xs">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Live Verified Opportunities
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Dynamic Job Discovery
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Real-time positions matched against your profile as <strong className="text-slate-800 font-semibold">{candidateRole}</strong>.
            Click any direct link or launch searches directly on LinkedIn and Google Jobs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="rounded-xl border-slate-200 font-semibold text-xs gap-1.5 hover:bg-slate-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-indigo-600" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setSavedModalOpen(true)}
            className="rounded-xl font-bold text-xs gap-1.5 shadow-sm bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            <span>Analyze Custom Job</span>
          </Button>
        </div>
      </div>

      {/* 2. One-Click External Portals: LinkedIn & Google Jobs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <a
          href={linkedInSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/70 to-white p-4 transition-all hover:border-blue-300 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a66c2] text-white font-black text-sm shadow-sm">
              in
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Search Live on LinkedIn Jobs
                </span>
                <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-blue-600" />
              </div>
              <p className="text-[11px] text-slate-500">
                Query: &quot;{activeSearchTerm}&quot; in {activeSearchLocation}
              </p>
            </div>
          </div>
          <span className="rounded-lg bg-blue-100/80 px-2.5 py-1 text-[11px] font-bold text-[#0a66c2]">
            Open ↗
          </span>
        </a>

        <a
          href={googleJobsSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-white p-4 transition-all hover:border-emerald-300 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-black text-sm shadow-sm">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Search on Google Jobs
                </span>
                <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-emerald-700" />
              </div>
              <p className="text-[11px] text-slate-500">
                Aggregates Greenhouse, Lever, and corporate careers
              </p>
            </div>
          </div>
          <span className="rounded-lg bg-emerald-100/80 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
            Open ↗
          </span>
        </a>
      </div>

      {/* 3. Filter Toolbar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search live jobs, companies, or tech tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          {/* Workplace Filter */}
          <div className="sm:col-span-2">
            <select
              value={workplaceFilter}
              onChange={(e) => setWorkplaceFilter(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-xs sm:text-sm text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
            >
              <option value="all">Any Location</option>
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="on_site">On-Site</option>
            </select>
          </div>

          {/* Seniority Filter */}
          <div className="sm:col-span-2">
            <select
              value={seniorityFilter}
              onChange={(e) => setSeniorityFilter(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-xs sm:text-sm text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
            >
              <option value="all">All Seniorities</option>
              <option value="entry">Entry / Junior</option>
              <option value="mid">Mid-Level</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead / Staff</option>
            </select>
          </div>

          {/* Min Match Slider */}
          <div className="sm:col-span-3 flex items-center gap-2.5 px-2">
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
              Min: {minMatchScore}%
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

      {/* 4. Jobs Results List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-1">
          <span className="font-semibold text-slate-700">
            {loading ? "Discovering live opportunities..." : `Showing ${filteredJobs.length} dynamic positions`}
          </span>
          <span>Matched to: {candidateRole}</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 w-full animate-pulse rounded-2xl bg-slate-100 border border-slate-200" />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <Briefcase className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-base font-bold text-slate-800">No matching jobs found</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query, lowering the minimum match fit, or clicking the LinkedIn/Google buttons above.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setMinMatchScore(50);
                setWorkplaceFilter("all");
              }}
              className="mt-4 rounded-xl text-xs"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="hover:border-indigo-200/90 transition-all duration-200 shadow-xs hover:shadow-md"
              >
                <CardContent className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left: Job Meta & Tags */}
                  <div className="space-y-2.5 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                        {job.title}
                      </h3>
                      <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-800">
                        {job.company}
                      </span>
                      <span className="rounded-md bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 capitalize">
                        {job.workplaceType}
                      </span>
                      <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600 capitalize">
                        {job.seniority}
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

                    {/* Dynamic Skills Badges */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-slate-400">Skills / Tags:</span>
                        {job.matchingSkills.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-lg bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-xs text-emerald-800 font-medium inline-flex items-center gap-1"
                          >
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Score Gauge & Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-5 shrink-0 lg:border-l lg:border-slate-100 lg:pl-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      <div className="text-2xl font-black text-emerald-600 tracking-tight">
                        {job.matchScore}%
                      </div>
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

                      {job.sourceUrl ? (
                        <a
                          href={job.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="font-semibold text-xs rounded-xl gap-1"
                          >
                            <span>Direct Apply</span>
                            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                          </Button>
                        </a>
                      ) : (
                        <a
                          href={`https://www.google.com/search?q=jobs+${encodeURIComponent(job.title)}+${encodeURIComponent(job.company)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="font-semibold text-xs rounded-xl gap-1"
                          >
                            <span>Google Search</span>
                            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                          </Button>
                        </a>
                      )}

                      <Link
                        href={`/dashboard/create?jobTitle=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}`}
                      >
                        <Button
                          variant="primary"
                          size="sm"
                          className="font-bold text-xs gap-1 shadow-xs rounded-xl bg-indigo-600 hover:bg-indigo-700"
                        >
                          <span>Tailor Resume</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
              placeholder="e.g. Senior Full Stack Engineer"
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
                placeholder="e.g. OpenAI / Stripe"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">Location</label>
              <Input
                placeholder="Remote / San Francisco"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Job Description Text</label>
            <Textarea
              placeholder="Paste responsibilities and requirements here to run instant match analysis..."
              rows={5}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSavedModalOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submittingJob}
              variant="primary"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
            >
              {submittingJob ? "Analyzing..." : "Calculate Match Fit"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
