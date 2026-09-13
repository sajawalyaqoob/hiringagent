import * as React from "react";
import Link from "next/link";
import { Check, HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const tiers = [
    {
      name: "Starter",
      tier: "free",
      price: "$0",
      cadence: "forever free",
      description: "Ideal for candidates setting up their initial career profile and testing ATS scores.",
      features: [
        "1 Primary Resume & Profile",
        "1 Basic ATS Resume Scan per month",
        "5 Job Compatibility Matches",
        "10 Tracked Pipeline Applications",
        "Community Support",
      ],
      cta: "Start Free",
      href: "/signup",
      popular: false,
    },
    {
      name: "Professional",
      tier: "professional",
      price: "$29",
      cadence: "billed monthly",
      description: "For active engineers and candidates actively applying to software and product roles.",
      features: [
        "Unlimited ATS Resume Scans",
        "Unlimited Job Compatibility Matches",
        "50 AI Tailored Generations / month",
        "AI Career Interview (Skill Depth Calibration)",
        "Recruiter Outreach & Cold Email Generator",
        "Full Kanban Application Pipeline",
        "Follow-up & Interview Preparation Alerts",
      ],
      cta: "Start 7-Day Free Trial",
      href: "/signup",
      popular: true,
    },
    {
      name: "Career Pro",
      tier: "career_pro",
      price: "$59",
      cadence: "billed monthly",
      description: "For senior, staff, and principal engineers seeking top compensation and executive roles.",
      features: [
        "Everything in Professional",
        "Unlimited AI Studio Generations",
        "Recruiter Discovery & Public Contact Matcher",
        "Multiple Tailored Resume Snapshots",
        "Executive Cover Letter Strategy Suite",
        "Priority ATS Engine Calibration",
        "Dedicated Engineering Career Support",
      ],
      cta: "Upgrade to Career Pro",
      href: "/signup",
      popular: false,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="border-b border-[#d5d9d9] bg-[#131921] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#f08804]">Transparent Pricing</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Plans That Accelerate Your Job Search
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            No long-term commitments. Upgrade, downgrade, or cancel anytime directly from your dashboard settings.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 bg-[#f8f9fa] border-b border-[#d5d9d9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xs border bg-white p-6 flex flex-col justify-between relative ${
                  tier.popular
                    ? "border-2 border-[#f08804] shadow-md"
                    : "border-[#d5d9d9] shadow-2xs"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-xs bg-[#f08804] px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#0f1111]">
                    Recommended
                  </span>
                )}

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-[#0f1111]">{tier.name}</h3>
                    <span className="rounded-xs bg-gray-100 text-gray-700 px-2 py-0.5 text-[10px] font-bold uppercase">
                      {tier.tier}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[#0f1111]">{tier.price}</span>
                    <span className="text-xs text-[#565959]">/{tier.cadence}</span>
                  </div>

                  <p className="text-xs text-[#565959] leading-relaxed">{tier.description}</p>

                  <div className="border-t border-[#f3f4f6] pt-4 space-y-2">
                    <p className="text-[10px] font-bold uppercase text-gray-400">Included In Plan</p>
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2 text-xs text-[#374151]">
                        <Check className="h-3.5 w-3.5 text-[#067d62] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <Link href={tier.href} className="block w-full">
                    <Button
                      variant={tier.popular ? "primary" : "outline"}
                      size="md"
                      className="w-full font-bold"
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing FAQ */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-10">
            <h3 className="text-xl font-bold text-[#0f1111]">Billing & Subscription FAQ</h3>
            <p className="text-xs text-[#565959]">Common questions regarding billing, invoices, and payments.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="border border-[#d5d9d9] p-4 rounded-xs bg-[#f8f9fa] space-y-1.5">
              <h4 className="font-bold text-[#0f1111]">Can I expense this as career development?</h4>
              <p className="text-[#565959] leading-relaxed">
                Yes. Many employers provide annual learning and career transition budgets. We provide downloadable PDF invoices for expense reports.
              </p>
            </div>

            <div className="border border-[#d5d9d9] p-4 rounded-xs bg-[#f8f9fa] space-y-1.5">
              <h4 className="font-bold text-[#0f1111]">What payment methods are accepted?</h4>
              <p className="text-[#565959] leading-relaxed">
                We accept all major credit cards (Visa, Mastercard, American Express) via Stripe. Payment keys are configured in Phase 2.
              </p>
            </div>

            <div className="border border-[#d5d9d9] p-4 rounded-xs bg-[#f8f9fa] space-y-1.5">
              <h4 className="font-bold text-[#0f1111]">Can I cancel anytime?</h4>
              <p className="text-[#565959] leading-relaxed">
                Yes, there are no contracts. You can cancel your subscription in 1 click inside Settings → Subscription.
              </p>
            </div>

            <div className="border border-[#d5d9d9] p-4 rounded-xs bg-[#f8f9fa] space-y-1.5">
              <h4 className="font-bold text-[#0f1111]">What happens to my data if I cancel?</h4>
              <p className="text-[#565959] leading-relaxed">
                Your profile, uploaded resumes, and application tracker logs remain fully accessible in read-only mode, and you can export them as JSON.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
