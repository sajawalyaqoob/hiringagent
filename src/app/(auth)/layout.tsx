import * as React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa] text-[#0f1111]">
      {/* Simple Clean Auth Header */}
      <header className="border-b border-[#d5d9d9] bg-[#131921] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center tracking-tight font-black text-lg text-white">
              <span>HIREBOOST</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-xs bg-[#f08804] text-[#0f1111] text-xs font-black tracking-widest uppercase">
                AI
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-gray-300">
            <ShieldCheck className="h-4 w-4 text-[#f08804]" />
            <span className="hidden sm:inline">Encrypted & SOC2 Ready</span>
          </div>
        </div>
      </header>

      {/* Main Form Body */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Subtle Auth Footer */}
      <footer className="border-t border-[#d5d9d9] py-4 text-center text-xs text-[#565959] bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} HireBoost AI. Amazon-inspired Productivity Standard.</span>
          <div className="flex gap-4">
            <Link href="/about" className="hover:underline">Security</Link>
            <Link href="/pricing" className="hover:underline">Plans</Link>
            <Link href="/" className="hover:underline">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
