import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Target,
  FileCheck2,
  TrendingUp,
  Briefcase,
  Zap,
  BarChart3,
  HelpCircle,
  Clock,
  Layers,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col bg-white text-slate-900 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50/50 pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32 border-b border-slate-100">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-200/30 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Clear, Friendly Pitch */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-200/70 px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-xs">
                <Sparkles className="h-4 w-4 text-indigo-600 animate-pulse" />
                <span>Smart AI Job Application Assistant</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Land Your Dream Job <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent">
                  In Days, Not Months.
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Stop getting ghosted by automated resume screeners. HireBoost AI matches your real experience to jobs, highlights missing keywords, and creates tailored resumes & cover letters in seconds.
              </p>

              {/* Action Buttons - 100% Mobile Responsive */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto text-base font-bold shadow-md shadow-indigo-600/20">
                    Get Started Free
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>

                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base font-semibold border-slate-300 hover:bg-slate-50">
                    Try Live Demo
                  </Button>
                </Link>

                <Link href="#how-it-works" className="w-full sm:w-auto">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto text-slate-600 hover:text-slate-900 text-sm">
                    How it works ↓
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs sm:text-sm font-medium text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Free to try</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span>Zero AI hallucinations</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span>100% ATS friendly</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual 3D Hero Illustration & Live Match Card */}
            <div className="lg:col-span-5 max-w-lg mx-auto lg:max-w-none w-full relative">
              <div className="relative rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-2xl shadow-indigo-200/40">
                {/* 3D Illustration Graphic */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                  <Image
                    src="/images/hero-illustration.jpg"
                    alt="HireBoost AI Real-time Job Matching and Score Calibration"
                    fill
                    priority
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <span className="text-xs font-black tracking-wide drop-shadow-md">
                      Interactive Match Calibrator
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white text-[11px] font-extrabold shadow-sm">
                      98% Fit
                    </span>
                  </div>
                </div>

                {/* Glassmorphic Interactive Preview Card */}
                <div className="p-5 sm:p-6 space-y-4 bg-white/95 backdrop-blur-md">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Live Opportunity Preview
                      </span>
                      <h3 className="text-base font-bold text-slate-900">Senior Full-Stack Engineer</h3>
                      <p className="text-xs text-indigo-600 font-semibold">Stripe / Global Remote • $185k - $235k</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black">
                        ✓ Top Match
                      </span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap gap-1.5">
                      {["TypeScript", "React", "Next.js", "Python", "PostgreSQL"].map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold"
                        >
                          ✓ {s}
                        </span>
                      ))}
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">
                        ⚡ 1-Click LinkedIn Search
                      </span>
                    </div>
                  </div>

                  {/* Action Link */}
                  <Link href="/onboarding" className="block pt-1">
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full justify-center font-bold text-sm rounded-xl shadow-sm bg-indigo-600 hover:bg-indigo-700"
                    >
                      Personalize My Job Matches Free
                      <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (Super Simple 3 Steps) */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white border-b border-slate-100 scroll-mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How HireBoost AI Gets You Interviews
            </h2>
            <p className="text-base text-slate-600">
              No complicated setups. You can create your first tailored job application in under 2 minutes.
            </p>
          </div>

          <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm shadow-indigo-600/30 mb-5">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Upload Your Resume</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upload your existing PDF or Word resume. Our smart parser instantly extracts your work history, skills, and projects without losing any details.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm shadow-indigo-600/30 mb-5">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Choose Any Job Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Paste the text or link of any job you want to apply for. The match engine instantly reveals your compatibility score and any missing keywords.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm shadow-indigo-600/30 mb-5">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Get Your Tailored Resume</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Click generate! Powered by Groq AI, you get an ATS-optimized resume, customized cover letter, and recruiter outreach message tailored to that exact job.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/signup">
              <Button variant="primary" size="lg" className="font-bold">
                Create Your Free Account Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES */}
      <section className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Powerful Features
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need in One Clean Platform
            </h2>
            <p className="text-base text-slate-600">
              Built so anyone—whether applying for your first job or your next senior role—can succeed with confidence.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3 hover:border-indigo-300 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">ATS Resume Checker</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                See your resume through the eyes of hiring software. Catch formatting issues, keyword gaps, and weak bullet points before applying.
              </p>
            </Card>

            <Card className="p-6 space-y-3 hover:border-indigo-300 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Job Fit Score</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Get an instant 0-100% compatibility rating for any job posting. Focus your time on roles where you have the highest chance of getting interviewed.
              </p>
            </Card>

            <Card className="p-6 space-y-3 hover:border-indigo-300 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">AI Cover Letter Writer</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generate compelling, human-sounding cover letters tailored to each company. No generic robotic text—just polished, persuasive storytelling.
              </p>
            </Card>

            <Card className="p-6 space-y-3 hover:border-indigo-300 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Application Pipeline Tracker</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track applied jobs, interview dates, follow-up reminders, and job offers in an intuitive visual dashboard. Never lose track of an application.
              </p>
            </Card>

            <Card className="p-6 space-y-3 hover:border-indigo-300 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Lightning-Fast AI (Groq)</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enjoy ultra-fast resume tailored generation in 1 to 2 seconds powered by the fastest AI infrastructure in the world.
              </p>
            </Card>

            <Card className="p-6 space-y-3 hover:border-indigo-300 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Zero Hallucinations</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Unlike ChatGPT, HireBoost AI is strictly constrained to your actual background. It never fabricates fake companies or phantom degrees.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. PRICING SECTION */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Clear & Simple Pricing
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Invest In Getting Hired Faster
            </h2>
            <p className="text-base text-slate-600">
              Transparent, flexible plans. No hidden costs. Cancel anytime with one click.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <Card className="flex flex-col justify-between p-6 sm:p-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900">Starter Free</h3>
                  <Badge variant="default">Basic</Badge>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">$0</span>
                  <span className="text-sm text-slate-500">/forever</span>
                </div>
                <p className="text-sm text-slate-500">Perfect for exploring the platform and creating your profile.</p>
                <ul className="space-y-2.5 text-sm text-slate-700 pt-3 border-t border-slate-100">
                  <li className="flex items-center gap-2">✓ 1 Master Career Profile</li>
                  <li className="flex items-center gap-2">✓ 5 Job Match Scans</li>
                  <li className="flex items-center gap-2">✓ Basic ATS Keyword Check</li>
                  <li className="flex items-center gap-2">✓ Application Tracker (up to 10)</li>
                </ul>
              </div>
              <div className="pt-8">
                <Link href="/signup" className="block">
                  <Button variant="outline" size="md" className="w-full justify-center">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Pro Tier (Popular) */}
            <Card className="flex flex-col justify-between p-6 sm:p-8 border-2 border-indigo-600 shadow-xl shadow-indigo-100 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Most Popular
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900">Pro Job Seeker</h3>
                  <Badge variant="info">Recommended</Badge>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">$19</span>
                  <span className="text-sm text-slate-500">/month</span>
                </div>
                <p className="text-sm text-slate-500">Everything you need to apply at scale and land interviews quickly.</p>
                <ul className="space-y-2.5 text-sm text-slate-700 pt-3 border-t border-slate-100">
                  <li className="flex items-center gap-2 font-medium">✓ Unlimited AI Tailored Resumes</li>
                  <li className="flex items-center gap-2 font-medium">✓ Unlimited Custom Cover Letters</li>
                  <li className="flex items-center gap-2 font-medium">✓ Full ATS Keyword Gap Analysis</li>
                  <li className="flex items-center gap-2 font-medium">✓ Recruiter Outreach Message Writer</li>
                  <li className="flex items-center gap-2 font-medium">✓ Unlimited Application Pipeline</li>
                </ul>
              </div>
              <div className="pt-8">
                <Link href="/signup" className="block">
                  <Button variant="primary" size="md" className="w-full justify-center font-bold shadow-md shadow-indigo-500/20">
                    Start 7-Day Free Trial
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Career Pass */}
            <Card className="flex flex-col justify-between p-6 sm:p-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900">Quarterly Pass</h3>
                  <Badge variant="success">Best Value</Badge>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">$39</span>
                  <span className="text-sm text-slate-500">/quarter</span>
                </div>
                <p className="text-sm text-slate-500">For active job seekers who want 3 months of full access at a discount.</p>
                <ul className="space-y-2.5 text-sm text-slate-700 pt-3 border-t border-slate-100">
                  <li className="flex items-center gap-2">✓ All Pro features included</li>
                  <li className="flex items-center gap-2">✓ Save 32% compared to monthly</li>
                  <li className="flex items-center gap-2">✓ Priority Groq AI processing</li>
                  <li className="flex items-center gap-2">✓ Export to PDF & Word (.docx)</li>
                </ul>
              </div>
              <div className="pt-8">
                <Link href="/signup" className="block">
                  <Button variant="outline" size="md" className="w-full justify-center">
                    Get Quarterly Pass
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Clear, transparent answers to help you understand how HireBoost works.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            {[
              {
                q: "Will recruiters or companies know I used AI?",
                a: "No. HireBoost doesn't write generic AI fluff. It takes your real work accomplishments and rephrases them cleanly to include the exact keywords and skills the employer asked for.",
              },
              {
                q: "What is an ATS (Applicant Tracking System)?",
                a: "An ATS is software that 98% of Fortune 500 companies use to filter job applications before a human recruiter reads them. If your resume lacks the exact keywords from the job description, it gets discarded automatically. HireBoost ensures you match those keywords.",
              },
              {
                q: "Does HireBoost invent fake experiences or degrees?",
                a: "Never. HireBoost operates under strict Zero-Hallucination rules. It will only use verified skills and experiences from your profile and will suggest areas where you might want to add real projects.",
              },
              {
                q: "Can I use it completely for free?",
                a: "Yes! You can sign up, create your career profile, scan your resume, and see your job compatibility scores for free.",
              },
            ].map((faq, i) => (
              <div key={i} className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 space-y-2">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-600 shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION */}
      <section className="py-16 sm:py-24 bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Start Getting Interview Calls?
          </h2>
          <p className="text-base sm:text-lg text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            Join thousands of job seekers who turned blind applications into interview invitations. Get your free tailored resume in under 2 minutes.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-white text-indigo-700 hover:bg-slate-100 font-bold text-base shadow-lg">
                Build My Profile Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-indigo-800/40 text-white border-indigo-400/50 hover:bg-indigo-800/70 text-base">
                Explore Demo First
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
