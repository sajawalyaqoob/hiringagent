import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Lock } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-white to-slate-100/60 text-slate-900">
      {/* Modern High-End Auth Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md px-4 sm:px-6 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <BrandLogo size="md" theme="light" href="/" badgeText="AI PRO" />

          <div className="flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/70 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden sm:inline">256-Bit Encrypted • SOC2 Ready</span>
            <span className="sm:hidden">SOC2 Verified</span>
          </div>
        </div>
      </header>

      {/* Main Form Body */}
      <main className="flex flex-1 items-center justify-center p-3 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl">{children}</div>
      </main>

      {/* Subtle Auth Footer */}
      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 bg-white/80 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} TalentForge AI. Enterprise Career Architecture Platform.</span>
          <div className="flex gap-4 font-medium">
            <Link href="/about" className="text-slate-600 hover:text-indigo-600 transition-colors">Privacy & Security</Link>
            <Link href="/pricing" className="text-slate-600 hover:text-indigo-600 transition-colors">Enterprise Plans</Link>
            <Link href="/" className="text-slate-600 hover:text-indigo-600 transition-colors">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
