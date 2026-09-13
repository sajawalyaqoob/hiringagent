import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

export function MarketingFooter() {
  return (
    <footer className="w-full border-t border-[#d5d9d9] bg-[#131921] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-white tracking-tight">HIREBOOST</span>
              <span className="px-1.5 py-0.5 rounded-xs bg-[#f08804] text-[#0f1111] text-xs font-black tracking-widest uppercase">
                AI
              </span>
            </div>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="pt-2 text-xs text-gray-400">
              Architecture designed for enterprise scale, Vercel deployment, and Supabase / PostgreSQL persistence.
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Features & Workflow
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  SaaS Pricing
                </Link>
              </li>
              <li>
                <Link href="/dashboard/resume/analyze" className="hover:text-white transition-colors">
                  ATS Resume Analyzer
                </Link>
              </li>
              <li>
                <Link href="/dashboard/jobs" className="hover:text-white transition-colors">
                  Compatibility Engine
                </Link>
              </li>
              <li>
                <Link href="/dashboard/create" className="hover:text-white transition-colors">
                  AI Application Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About & Architecture
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard Demo
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Security & Trust</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>• Server-only secret isolation</li>
              <li>• SOC2-ready mock architecture</li>
              <li>• ATS compliance standards</li>
              <li>• Zero hallucination policy</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-[#232f3e] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} HireBoost AI. Built with Amazon-inspired productivity principles.</p>
          <div className="flex items-center gap-6">
            <span className="text-gray-400">Production SaaS Architecture</span>
            <span className="text-gray-400">Vercel Ready</span>
            <span className="text-gray-400">Next.js 16 App Router</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
