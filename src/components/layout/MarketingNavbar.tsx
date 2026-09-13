"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navConfig, siteConfig } from "@/lib/config/site";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function MarketingNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <BrandLogo size="md" theme="light" href="/" badgeText="AI" />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navConfig.marketing.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? "text-indigo-600 bg-indigo-50/80 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
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
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              Sign In
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="font-semibold text-slate-700">
              Live Demo
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm" className="font-semibold shadow-sm">
              Get Started Free
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-lg px-4 py-5 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-1">
            {navConfig.marketing.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 rounded-xl transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="lg" className="w-full justify-center">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="lg" className="w-full justify-center font-bold">
                Get Started Free
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" size="lg" className="w-full justify-center">
                Explore Live Demo Workspace
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
