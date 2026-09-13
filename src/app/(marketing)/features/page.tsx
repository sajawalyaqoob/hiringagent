import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  FileCheck2,
  Target,
  Search,
  Layers,
  ArrowRight,
  BarChart2,
  CheckCircle,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FeaturesPage() {
  const features = [
    {
      title: "ATS Compatibility & Keyword Scorer",
      category: "Resume Intelligence",
      description:
        "Analyzes your resume formatting against the parsing engines of Workday, Greenhouse, Lever, and iCIMS. Detects missing keywords, calculates metric density, and flags unstructured layouts.",
      metrics: ["Formatting Health: 95%", "Keyword Coverage: 88%", "Impact Score: 92%"],
      icon: BarChart2,
    },
    {
      title: "AI Career Interview & Skill Calibration",
      category: "Profile Depth",
      description:
        "Stops resume inflation and detects true mastery. The system interviews you to categorize whether you know, have used, or have built enterprise systems with each technology.",
      metrics: ["5 Proficiency Levels", "Evidence-Based Notes", "Zero Exaggeration"],
      icon: Target,
    },
    {
      title: "Deterministic Compatibility Engine",
      category: "Job Matching",
      description:
        "Computes exact candidate-to-job compatibility by evaluating core skills, preferred skills, seniority expectations, and compensation alignment before you invest application time.",
      metrics: ["Skills Alignment", "Experience Calibration", "Potential Gaps Detected"],
      icon: Cpu,
    },
    {
      title: "AI Application Studio",
      category: "Generation Center",
      description:
        "Generates targeted resumes, personalized cover letters, LinkedIn posts, and cold recruiter outreach messages grounded strictly in your verified career history.",
      metrics: ["6 Generation Modes", "4 Tone Options", "Zero Hallucination Policy"],
      icon: Sparkles,
    },
    {
      title: "Recruiter Discovery & Contact Outreach",
      category: "Network Expansion",
      description:
        "Identifies publicly available hiring manager and recruiter information, formatting high-impact 3-bullet introduction emails that reference specific team needs.",
      metrics: ["Verified Public Info", "Executive Email Templates", "Follow-up Cadence"],
      icon: Search,
    },
    {
      title: "Stage-Gated Application Tracker",
      category: "Pipeline Management",
      description:
        "Manage your entire job search workflow across Saved, Applied, Contacted, Interview, and Offer stages with due-date reminders and interview round preparation notes.",
      metrics: ["Dual Kanban & Table", "Action Due Dates", "Historical Logs"],
      icon: Layers,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Header Banner */}
      <section className="border-b border-[#d5d9d9] bg-[#131921] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#f08804]">System Capabilities</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Features Built for High-Yield Engineering Job Searches
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Explore the architectural foundation that powers HireBoost AI—from deterministic ATS analysis to structured skill calibration.
          </p>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-[#f8f9fa] border-b border-[#d5d9d9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="rounded-xs border border-[#d5d9d9] bg-white p-6 flex flex-col justify-between space-y-4 hover:border-[#9ca3af] transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#b45309]">
                        {feat.category}
                      </span>
                      <Icon className="h-5 w-5 text-[#f08804]" />
                    </div>
                    <h3 className="text-base font-bold text-[#0f1111]">{feat.title}</h3>
                    <p className="text-xs text-[#565959] leading-relaxed">{feat.description}</p>
                  </div>

                  <div className="border-t border-[#f3f4f6] pt-3 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase text-gray-400">Core Highlights</p>
                    {feat.metrics.map((m) => (
                      <div key={m} className="flex items-center gap-1.5 text-xs text-[#374151]">
                        <CheckCircle className="h-3 w-3 text-[#067d62] shrink-0" />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
          <h2 className="text-2xl font-bold text-[#0f1111]">Experience the Platform in Action</h2>
          <p className="text-xs text-[#565959] max-w-md mx-auto leading-relaxed">
            Jump directly into our interactive dashboard demo or register an account to calibrate your career profile.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/signup">
              <Button variant="primary" size="md" className="font-bold">
                Build My Profile
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="md">Launch Demo Dashboard</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
