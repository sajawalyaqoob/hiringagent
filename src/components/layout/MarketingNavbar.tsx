"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navConfig, siteConfig } from "@/lib/config/site";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";

export function MarketingNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#d5d9d9] bg-[#131921] text-white">
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center tracking-tight font-black text-lg">
              <span className="text-white">HIREBOOST</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-xs bg-[#f08804] text-[#0f1111] text-xs font-black tracking-widest uppercase">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navConfig.marketing.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors ${
                    isActive
                      ? "text-white bg-[#232f3e]"
                      : "text-gray-300 hover:text-white hover:bg-[#232f3e]/60"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-gray-200 hover:text-white hover:bg-[#232f3e]">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm" className="font-bold">
              Build My Profile
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="bg-[#232f3e] border-[#374151] text-white hover:bg-[#2e3e52]">
              Live Demo
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-300 hover:text-white rounded-sm focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#232f3e] bg-[#131921] px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-1">
            {navConfig.marketing.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-gray-200 hover:bg-[#232f3e] rounded-sm"
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-[#232f3e] flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="md" className="w-full bg-[#232f3e] text-white border-[#374151]">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full font-bold">
                Build My Profile
              </Button>
            </Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="navy" size="md" className="w-full bg-[#0a0e14] border border-[#232f3e]">
                Enter Live Demo
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
