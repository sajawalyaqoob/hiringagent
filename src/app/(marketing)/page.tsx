import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Target,
  FileCheck2,
  TrendingUp,
  Layers,
  ChevronRight,
  Briefcase,
  Search,
  Zap,
  BarChart3,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[#d5d9d9] bg-gradient-to-b from-[#131921] via-[#1a232f] to-[#131921] text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-xs bg-[#232f3e] border border-[#374151] px-3 py-1 text-xs font-semibold text-[#f08804]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Next-Generation Career Intelligence</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white">
                Turn Every Job Opportunity Into Your{" "}
                <span className="text-[#f08804]">Best Application.</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed font-normal">
                HireBoost AI analyzes your real career experience, deconstructs job descriptions to extract true requirements, and generates tailored, high-compatibility resumes, cover letters, and recruiter outreach.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link href="/signup">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto font-bold text-sm">
                    Build My Career Profile
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>

                <Link href="#how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto bg-[#232f3e] border-[#374151] text-white hover:bg-[#2e3e52] text-sm"
                  >
                    See How It Works
                  </Button>
                </Link>

                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full sm:w-auto text-gray-300 hover:text-white hover:bg-white/10 text-sm"
                  >
                    Live Demo Workspace →
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-[#232f3e] flex flex-wrap items-center gap-6 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#f08804]" />
                  <span>Zero Hallucinations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileCheck2 className="h-4 w-4 text-[#f08804]" />
                  <span>100% ATS Compliant</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#f08804]" />
                  <span>Structured Evidence Calibration</span>
                </div>
              </div>
            </div>

            {/* Right: Live Interactive Card Simulation */}
            <div className="lg:col-span-5">
              <div className="rounded-xs border border-[#374151] bg-[#0a0e14] p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#232f3e] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    <span className="ml-2 text-xs font-mono text-gray-400">Compatibility Engine v1.0</span>
                  </div>
                  <span className="rounded-xs bg-[#067d62]/20 border border-[#067d62]/50 text-[#067d62] text-[11px] font-bold px-2 py-0.5">
                    HIGH FIT
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-400">Target Opportunity</p>
                      <h4 className="text-sm font-bold text-white">Senior Full-Stack Engineer</h4>
                      <p className="text-xs text-[#f08804]">Stripe • Seattle, WA (Remote)</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-[#f08804]">94%</div>
                      <div className="text-[10px] text-gray-400 uppercase font-semibold">Match Score</div>
                    </div>
                  </div>

                  <div className="h-1.5 w-full bg-[#232f3e] rounded-full overflow-hidden">
                    <div className="h-full bg-[#f08804] rounded-full" style={{ width: "94%" }} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xs bg-[#131921] border border-[#232f3e] p-2.5">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Skills Match</p>
                      <p className="text-sm font-bold text-emerald-400 mt-0.5">96% (7/8 Found)</p>
                      <p className="text-[10px] text-gray-400 mt-1">TypeScript, Go, Kafka, PostgreSQL</p>
                    </div>
                    <div className="rounded-xs bg-[#131921] border border-[#232f3e] p-2.5">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Experience Match</p>
                      <p className="text-sm font-bold text-emerald-400 mt-0.5">95% (6 yrs vs 5 req)</p>
                      <p className="text-[10px] text-gray-400 mt-1">Seniority level exceeds minimum</p>
                    </div>
                  </div>

                  <div className="rounded-xs bg-[#131921] border border-[#232f3e] p-2.5 text-xs">
                    <div className="flex items-center justify-between text-gray-300 font-semibold mb-1">
                      <span>Detected Skill Advantage:</span>
                      <span className="text-[#f08804] text-[10px]">Verified via AI Interview</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      "45M+ daily requests on Kafka & Go" directly maps to Stripe's core billing pipeline requirement.
                    </p>
                  </div>

                  <Link href="/dashboard/create" className="block w-full">
                    <Button variant="primary" size="sm" className="w-full font-bold">
                      Generate Tailored Application Artifacts
                      <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM STATEMENT */}
      <section className="border-b border-[#d5d9d9] bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#b45309]">The Job Search Crisis</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f1111] tracking-tight">
              Why 90% of Qualified Candidates Get Rejected Before an Interview
            </h2>
            <p className="text-xs sm:text-sm text-[#565959] leading-relaxed">
              Job applications are no longer read by humans first. They are screened by algorithmic ATS filters, while candidates burn dozens of hours copying, pasting, and guessing what recruiters want.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xs border border-[#d5d9d9] bg-[#f8f9fa] p-6 space-y-3">
              <div className="h-8 w-8 rounded-xs bg-[#fef2f2] text-[#c41c1c] border border-[#fecaca] flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-[#0f1111]">ATS Keyword Disconnect</h3>
              <p className="text-xs text-[#565959] leading-relaxed">
                Even top engineers get filtered out because resumes lack exact terminology matches, standard section hierarchies, or quantifiable impact syntax.
              </p>
            </div>

            <div className="rounded-xs border border-[#d5d9d9] bg-[#f8f9fa] p-6 space-y-3">
              <div className="h-8 w-8 rounded-xs bg-[#fffbeb] text-[#b45309] border border-[#fde68a] flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-[#0f1111]">Generic AI Resumes & Hallucinations</h3>
              <p className="text-xs text-[#565959] leading-relaxed">
                Generic AI chatbots invent experiences, exaggerate claims, and produce easily identifiable fluff that recruiters immediately discard.
              </p>
            </div>

            <div className="rounded-xs border border-[#d5d9d9] bg-[#f8f9fa] p-6 space-y-3">
              <div className="h-8 w-8 rounded-xs bg-[#ecfdf5] text-[#067d62] border border-[#a7f3d0] flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-[#0f1111]">Blind Application Submissions</h3>
              <p className="text-xs text-[#565959] leading-relaxed">
                Job seekers apply without knowing their true compatibility score, missing skills, or whether they meet the actual seniority expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW HIREBOOST WORKS */}
      <section id="how-it-works" className="border-b border-[#d5d9d9] bg-[#f8f9fa] py-16 sm:py-20 scroll-mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#f08804]">Deterministic Methodology</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f1111] tracking-tight">
              How HireBoost AI Secures Interviews
            </h2>
            <p className="text-xs sm:text-sm text-[#565959] leading-relaxed">
              A 5-step precision workflow engineered to turn market opportunities into interview invitations.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: "01",
                title: "Profile & Evidence",
                desc: "Upload your resume and complete the AI Career Interview to calibrate true skill depth.",
              },
              {
                step: "02",
                title: "Job Deconstruction",
                desc: "Paste any job description or pick from recommendations to parse required vs. preferred criteria.",
              },
              {
                step: "03",
                title: "Compatibility Scoring",
                desc: "Get an instant match score (0-100%) highlighting matching strengths and missing gaps.",
              },
              {
                step: "04",
                title: "Targeted Generation",
                desc: "Generate ATS-optimized resumes, cover letters, and recruiter emails grounded strictly in your real background.",
              },
              {
                step: "05",
                title: "Pipeline Tracker",
                desc: "Track every submission, recruiter response, follow-up due date, and interview round.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-xs border border-[#d5d9d9] bg-white p-5 flex flex-col justify-between space-y-3">
                <span className="font-mono text-xs font-black text-[#f08804]">{item.step}</span>
                <div>
                  <h4 className="text-sm font-bold text-[#0f1111]">{item.title}</h4>
                  <p className="text-xs text-[#565959] mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURE OVERVIEW */}
      <section className="border-b border-[#d5d9d9] bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#b45309]">Enterprise Architecture</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f1111] tracking-tight">
              Engineered for Serious Career Momentum
            </h2>
            <p className="text-xs sm:text-sm text-[#565959] leading-relaxed">
              Every tool in HireBoost AI is built with practical utility, high data density, and zero fluff.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-[#d5d9d9] bg-[#f8f9fa] p-6 rounded-xs space-y-3">
              <BarChart3 className="h-6 w-6 text-[#f08804]" />
              <h3 className="text-base font-bold text-[#0f1111]">ATS Resume Analyzer</h3>
              <p className="text-xs text-[#565959] leading-relaxed">
                Evaluates resume formatting, section header compliance, keyword frequency, and quantifiable bullet impact with actionable remediation points.
              </p>
            </div>

            <div className="border border-[#d5d9d9] bg-[#f8f9fa] p-6 rounded-xs space-y-3">
              <Target className="h-6 w-6 text-[#f08804]" />
              <h3 className="text-base font-bold text-[#0f1111]">Skill Discovery Interview</h3>
              <p className="text-xs text-[#565959] leading-relaxed">
                Differentiates whether you "know", "have used", "have professional experience in", or "built project prototypes with" each technology.
              </p>
            </div>

            <div className="border border-[#d5d9d9] bg-[#f8f9fa] p-6 rounded-xs space-y-3">
              <Zap className="h-6 w-6 text-[#f08804]" />
              <h3 className="text-base font-bold text-[#0f1111]">Job Compatibility Engine</h3>
              <p className="text-xs text-[#565959] leading-relaxed">
                Deterministic matching calculating exact skills match, experience thresholds, and potential seniority concerns before you apply.
              </p>
            </div>

            <div className="border border-[#d5d9d9] bg-[#f8f9fa] p-6 rounded-xs space-y-3">
              <Sparkles className="h-6 w-6 text-[#f08804]" />
              <h3 className="text-base font-bold text-[#0f1111]">AI Application Studio</h3>
              <p className="text-xs text-[#565959] leading-relaxed">
                Generate tailored resumes, cover letters, and recruiter emails with multiple tone controls and complete zero-hallucination guarantees.
              </p>
            </div>

            <div className="border border-[#d5d9d9] bg-[#f8f9fa] p-6 rounded-xs space-y-3">
              <Search className="h-6 w-6 text-[#f08804]" />
              <h3 className="text-base font-bold text-[#0f1111]">Recruiter Outreach Engine</h3>
              <p className="text-xs text-[#565959] leading-relaxed">
                Discover publicly available recruiter profiles and draft concise, compelling cold emails that highlight relevant metrics immediately.
              </p>
            </div>

            <div className="border border-[#d5d9d9] bg-[#f8f9fa] p-6 rounded-xs space-y-3">
              <Layers className="h-6 w-6 text-[#f08804]" />
              <h3 className="text-base font-bold text-[#0f1111]">Stage-Gated Application Tracker</h3>
              <p className="text-xs text-[#565959] leading-relaxed">
                Kanban and tabular tracking with follow-up notifications, next action checklists, and interview preparation notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. JOB MATCHING & RESUME TAILORING DEMO */}
      <section className="border-b border-[#d5d9d9] bg-[#131921] text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#f08804]">Side-by-Side Calibration</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                See Exactly Where You Match — and What is Missing.
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Never wonder if an application is worth your time. HireBoost breaks down required skills against your verified experience profile, providing honest compatibility percentages and actionable recommendations.
              </p>
              <div className="pt-2">
                <Link href="/dashboard/jobs">
                  <Button variant="primary" size="md" className="font-bold">
                    Explore Sample Job Matches
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-xs border border-[#374151] bg-[#0a0e14] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#232f3e] pb-3 text-xs">
                  <span className="font-mono text-gray-400">Match Analysis: Datadog Staff Systems Role</span>
                  <span className="font-bold text-[#f08804]">82% Overall Compatibility</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Skills Alignment (5/7 matched)</span>
                    <span className="font-bold text-emerald-400">80%</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["Go", "Kubernetes", "Kafka", "Distributed Systems", "PostgreSQL"].map((skill) => (
                      <span key={skill} className="rounded-xs bg-[#067d62]/20 border border-[#067d62]/40 px-2 py-0.5 text-[11px] text-emerald-300 font-medium">
                        ✓ {skill}
                      </span>
                    ))}
                    {["eBPF", "Rust"].map((skill) => (
                      <span key={skill} className="rounded-xs bg-[#b45309]/20 border border-[#b45309]/40 px-2 py-0.5 text-[11px] text-amber-300 font-medium">
                        ⚠ {skill} (Missing)
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xs bg-[#131921] border border-[#232f3e] p-3 text-xs space-y-1">
                  <p className="font-bold text-gray-200">AI Strategy Advisory:</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    "Role requests 7+ years of experience; your profile has 6 years. Highlight your StreamQuery open-source throughput benchmarks (1.2M events/sec) to bridge the seniority gap."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRICING PREVIEW */}
      <section className="border-b border-[#d5d9d9] bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#b45309]">Straightforward Plans</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f1111] tracking-tight">
              Invest in Your Career Acceleration
            </h2>
            <p className="text-xs sm:text-sm text-[#565959] leading-relaxed">
              Transparent, flexible plans designed for active job seekers. No hidden fees. Cancel anytime.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="rounded-xs border border-[#d5d9d9] bg-white p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-[#0f1111]">Starter Free</h3>
                  <span className="rounded-xs bg-gray-100 text-gray-700 px-2 py-0.5 text-[10px] font-bold uppercase">Basic</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#0f1111]">$0</span>
                  <span className="text-xs text-[#565959]">/month</span>
                </div>
                <p className="text-xs text-[#565959]">For candidates getting started with career profile creation.</p>
                <ul className="space-y-2 text-xs text-[#374151] pt-2">
                  <li className="flex items-center gap-2">✓ 1 Career Profile & Resume</li>
                  <li className="flex items-center gap-2">✓ Basic ATS Scan (1 scan/mo)</li>
                  <li className="flex items-center gap-2">✓ 5 Job Compatibility Matches</li>
                  <li className="flex items-center gap-2">✓ Application Tracker (10 items)</li>
                </ul>
              </div>
              <div className="pt-6">
                <Link href="/signup" className="block w-full">
                  <Button variant="outline" size="md" className="w-full">Get Started Free</Button>
                </Link>
              </div>
            </div>

            {/* Professional (Featured) */}
            <div className="rounded-xs border-2 border-[#f08804] bg-[#f8f9fa] p-6 flex flex-col justify-between shadow-md relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-xs bg-[#f08804] px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#0f1111]">
                Most Popular
              </span>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-[#0f1111]">Professional</h3>
                  <span className="rounded-xs bg-[#f08804]/20 text-[#b45309] px-2 py-0.5 text-[10px] font-bold uppercase">Active Search</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#0f1111]">$29</span>
                  <span className="text-xs text-[#565959]">/month</span>
                </div>
                <p className="text-xs text-[#565959]">For active job seekers applying to high-yield engineering roles.</p>
                <ul className="space-y-2 text-xs text-[#374151] pt-2">
                  <li className="flex items-center gap-2 font-semibold">✓ Unlimited ATS Resume Scans</li>
                  <li className="flex items-center gap-2 font-semibold">✓ Unlimited Job Compatibility Matches</li>
                  <li className="flex items-center gap-2 font-semibold">✓ 50 AI Tailored Generations / mo</li>
                  <li className="flex items-center gap-2">✓ AI Career Interview Skill Calibration</li>
                  <li className="flex items-center gap-2">✓ Recruiter Cold Outreach Generator</li>
                  <li className="flex items-center gap-2">✓ Full Kanban Application Tracker</li>
                </ul>
              </div>
              <div className="pt-6">
                <Link href="/signup" className="block w-full">
                  <Button variant="primary" size="md" className="w-full font-bold">Start Professional Trial</Button>
                </Link>
              </div>
            </div>

            {/* Career Pro */}
            <div className="rounded-xs border border-[#d5d9d9] bg-white p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-[#0f1111]">Career Pro</h3>
                  <span className="rounded-xs bg-gray-100 text-gray-700 px-2 py-0.5 text-[10px] font-bold uppercase">Executive</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#0f1111]">$59</span>
                  <span className="text-xs text-[#565959]">/month</span>
                </div>
                <p className="text-xs text-[#565959]">For senior and staff professionals seeking executive compensation.</p>
                <ul className="space-y-2 text-xs text-[#374151] pt-2">
                  <li className="flex items-center gap-2">✓ Everything in Professional</li>
                  <li className="flex items-center gap-2 font-semibold">✓ Unlimited AI Studio Generations</li>
                  <li className="flex items-center gap-2">✓ Recruiter Contact Discovery</li>
                  <li className="flex items-center gap-2">✓ Priority ATS Parsing Engine</li>
                  <li className="flex items-center gap-2">✓ Multiple Resume Version Snapshots</li>
                  <li className="flex items-center gap-2">✓ Dedicated Priority Support</li>
                </ul>
              </div>
              <div className="pt-6">
                <Link href="/signup" className="block w-full">
                  <Button variant="outline" size="md" className="w-full">Choose Career Pro</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="border-b border-[#d5d9d9] bg-[#f8f9fa] py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#f08804]">Answers & Clarifications</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1111] tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does HireBoost prevent AI hallucinations in resumes?",
                a: "HireBoost AI operates on a strictly constrained context model. It only extracts and rephrases achievements and skills from your verified profile history and AI interview notes. It will never invent companies, dates, or technical proficiencies you haven't confirmed.",
              },
              {
                q: "Are the generated resumes compliant with standard ATS scanners?",
                a: "Yes. Resumes are formatted using clean reverse-chronological layouts, standard section headings (Experience, Education, Skills), and clean typography without complex tables or images that break ATS parsers like Workday, Greenhouse, and Lever.",
              },
              {
                q: "What is the AI Career Interview and why is it necessary?",
                a: "Rather than treating all listed skills identically, our interview UX asks targeted questions to distinguish between technologies you just have beginner familiarity with versus those where you designed enterprise production systems. This ensures precision job matching.",
              },
              {
                q: "Can I cancel or change my subscription at any time?",
                a: "Yes. You can upgrade, downgrade, or cancel your subscription at any time directly from the dashboard settings. You retain access until the end of your billing cycle.",
              },
              {
                q: "How is my personal and career information secured?",
                a: "All personal information, resume documents, and notes are encrypted at rest and in transit. We maintain a strict server-only boundary ensuring sensitive data is never exposed to client-side code.",
              },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xs border border-[#d5d9d9] bg-white p-5 space-y-2">
                <h4 className="text-sm font-bold text-[#0f1111] flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-[#f08804] shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-[#565959] leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA BANNER */}
      <section className="bg-[#131921] text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Stop Guessing. Start Applying with Deterministic Precision.
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Create your career profile in 3 minutes, calibrate your actual skills, and see your real compatibility score for top software engineering positions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/signup">
              <Button variant="primary" size="lg" className="font-bold text-sm">
                Build My Career Profile Free
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="bg-[#232f3e] border-[#374151] text-white hover:bg-[#2e3e52] text-sm"
              >
                Launch Demo Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
