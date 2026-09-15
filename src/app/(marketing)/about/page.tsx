import * as React from "react";
import Link from "next/link";
import { Shield, Target, Cpu, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Header */}
      <section className="border-b border-[#d5d9d9] bg-[#131921] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#f08804]">Our Mission</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Building Serious Tools for Serious Careers
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            HireBoost AI was founded on the belief that modern job searching shouldn&apos;t be a random numbers game of keyword bingo and generic chatbot fluff.
          </p>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-16 bg-[#f8f9fa] border-b border-[#d5d9d9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl font-bold text-[#0f1111]">Architectural Principles</h2>
            <p className="text-xs text-[#565959]">
              How we approach candidate intelligence, algorithmic matching, and software design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xs border border-[#d5d9d9] bg-white p-6 space-y-3">
              <div className="h-10 w-10 rounded-xs bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center text-[#067d62]">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#0f1111]">Zero Hallucination Standard</h3>
              <p className="text-xs text-[#565959] leading-relaxed">
                We never let generative models invent skills, jobs, or achievements. Every generated bullet point and cover letter sentence is strictly derived from your calibrated profile history.
              </p>
            </div>

            <div className="rounded-xs border border-[#d5d9d9] bg-white p-6 space-y-3">
              <div className="h-10 w-10 rounded-xs bg-[#fffbeb] border border-[#fde68a] flex items-center justify-center text-[#b45309]">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#0f1111]">Skill Depth Calibration</h3>
              <p className="text-xs text-[#565959] leading-relaxed">
                A simple list of 50 skills is meaningless to a hiring team. Our AI interview UX differentiates true production engineering expertise from casual weekend experiments.
              </p>
            </div>

            <div className="rounded-xs border border-[#d5d9d9] bg-white p-6 space-y-3">
              <div className="h-10 w-10 rounded-xs bg-[#f8f9fa] border border-[#d5d9d9] flex items-center justify-center text-[#131921]">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#0f1111]">Amazon-Inspired Density</h3>
              <p className="text-xs text-[#565959] leading-relaxed">
                We reject toy dashboards with oversized decorative cards and low information density. HireBoost is built for professionals who want fast, clear data and actionable tables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Standards */}
      <section className="py-16 bg-white border-b border-[#d5d9d9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0f1111]">Production Engineering Architecture</h2>
            <p className="text-xs text-[#565959] leading-relaxed">
              HireBoost AI is engineered on Next.js App Router with TypeScript strict mode, server-only execution boundaries, and modular database service abstractions designed for Vercel and Supabase deployment.
            </p>
          </div>

          <div className="space-y-3 text-xs text-[#374151]">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#067d62] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#0f1111]">Server/Client Isolation:</strong> Sensitive credentials and database operations are encapsulated behind server guards, ensuring no secrets leak into client bundles.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#067d62] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#0f1111]">Zod Schema Validation:</strong> All profile inputs, application stage transitions, and AI generation parameters are validated at runtime.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#067d62] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#0f1111]">Accessible and Responsive:</strong> Built with semantic HTML, standard focus indicators, and high contrast design for desktop and mobile usability.
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#f3f4f6] flex gap-3">
            <Link href="/dashboard">
              <Button variant="primary" size="md" className="font-bold">
                Explore Live Platform
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
