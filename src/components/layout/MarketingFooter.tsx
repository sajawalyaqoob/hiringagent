import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

export function MarketingFooter() {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="sm:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-white tracking-tight">HireBoost</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-black tracking-widest uppercase">
                AI
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Smart career intelligence platform empowering job seekers with tailored resumes, high-fit job matches, and automated application tracking.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              Built with Next.js App Router, Groq AI, and Supabase PostgreSQL.
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Features & Workflow
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/dashboard/resume/analyze" className="hover:text-white transition-colors">
                  ATS Resume Checker
                </Link>
              </li>
              <li>
                <Link href="/dashboard/jobs" className="hover:text-white transition-colors">
                  Job Matcher
                </Link>
              </li>
              <li>
                <Link href="/dashboard/create" className="hover:text-white transition-colors">
                  AI Tailor Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Live Demo Workspace
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white transition-colors">
                  Get Started Free
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Trust & Privacy</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>✓ Zero AI hallucinations</li>
              <li>✓ Strict candidate privacy</li>
              <li>✓ Standard ATS compliance</li>
              <li>✓ Secure cloud infrastructure</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} HireBoost AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Fast AI Processing</span>
            <span>ATS Certified</span>
            <span>Next.js 16</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
