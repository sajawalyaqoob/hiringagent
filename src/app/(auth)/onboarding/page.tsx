"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Code,
  Cpu,
  Palette,
  Cloud,
  Briefcase,
  Shield,
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  Sparkles,
  MapPin,
  DollarSign,
  Building2,
  Laptop,
  Compass,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface CareerCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  suggestedRoles: string[];
  skills: string[];
  color: string;
}

const CAREER_CATEGORIES: CareerCategory[] = [
  {
    id: "software",
    title: "Software Engineering",
    icon: Code,
    description: "Frontend, Backend, Full Stack, and Mobile development",
    suggestedRoles: ["Full Stack Engineer", "Senior Frontend Engineer", "Backend Go/Node Engineer", "Mobile App Developer"],
    skills: ["React", "TypeScript", "Next.js", "Node.js", "Python", "PostgreSQL", "Tailwind CSS", "Docker", "REST APIs", "GraphQL"],
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "ai_data",
    title: "AI & Data Science",
    icon: Cpu,
    description: "LLMs, Machine Learning, Data Engineering, and Analytics",
    suggestedRoles: ["AI/ML Engineer", "Data Scientist", "LLM Application Developer", "Data Engineer"],
    skills: ["Python", "PyTorch", "LangChain", "OpenAI APIs", "Pandas", "Scikit-Learn", "Vector Databases", "SQL", "MLOps", "RAG"],
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "cloud_devops",
    title: "Cloud & DevOps",
    icon: Cloud,
    description: "AWS/GCP infrastructure, CI/CD pipelines, and Kubernetes",
    suggestedRoles: ["DevOps Engineer", "Cloud Architect", "Site Reliability Engineer", "Platform Engineer"],
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD", "Linux", "GCP", "Prometheus", "Helm", "GitLab CI"],
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "design",
    title: "UI/UX & Product Design",
    icon: Palette,
    description: "Design systems, user research, wireframing, and Figma",
    suggestedRoles: ["Product Designer", "UI/UX Specialist", "Design System Architect", "UX Researcher"],
    skills: ["Figma", "Design Systems", "Prototyping", "User Research", "Wireframing", "Tailwind CSS", "Design Tokens", "Usability Testing"],
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "product",
    title: "Product & Strategy",
    icon: Briefcase,
    description: "Roadmapping, sprint leadership, user stories, and growth",
    suggestedRoles: ["Technical Product Manager", "Product Owner", "VP of Product", "Growth Manager"],
    skills: ["Product Strategy", "Roadmapping", "Agile / Scrum", "Jira", "A/B Testing", "Data Analytics", "User Interviews", "KPI Tracking"],
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "security",
    title: "Cybersecurity & IT",
    icon: Shield,
    description: "Information security, compliance, SOC2, and networking",
    suggestedRoles: ["Security Engineer", "SOC Analyst", "Cloud Security Architect", "Penetration Tester"],
    skills: ["Network Security", "Penetration Testing", "SOC2 Compliance", "IAM / OAuth", "Vulnerability Scanning", "SIEM", "Python"],
    color: "from-red-500 to-rose-600",
  },
];

const SENIORITY_LEVELS = [
  { id: "entry", label: "Junior / Entry", desc: "0-2 yrs experience" },
  { id: "mid", label: "Mid-Level", desc: "2-5 yrs experience" },
  { id: "senior", label: "Senior", desc: "5-8 yrs experience" },
  { id: "lead", label: "Lead / Staff", desc: "8+ yrs experience" },
  { id: "executive", label: "Director / VP", desc: "10+ yrs leadership" },
];

const WORKPLACE_PREFERENCES = [
  { id: "remote", label: "Remote", icon: Laptop },
  { id: "hybrid", label: "Hybrid", icon: Building2 },
  { id: "onsite", label: "On-site", icon: Compass },
];

const LOCATION_PRESETS = [
  "Remote Worldwide",
  "United States / Canada",
  "Europe / UK",
  "Germany / Berlin",
  "Asia-Pacific (APAC)",
  "United Kingdom",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<number>(1);
  const [saving, setSaving] = React.useState<boolean>(false);

  // Form State
  const [selectedCategory, setSelectedCategory] = React.useState<string>("software");
  const [targetRole, setTargetRole] = React.useState<string>("Full Stack Engineer");
  const [seniority, setSeniority] = React.useState<string>("mid");
  const [workplace, setWorkplace] = React.useState<string>("remote");
  const [location, setLocation] = React.useState<string>("Remote Worldwide");
  const [minSalary, setMinSalary] = React.useState<number>(95000);
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([
    "React",
    "TypeScript",
    "Next.js",
    "Node.js",
    "PostgreSQL",
  ]);
  const [customSkillInput, setCustomSkillInput] = React.useState<string>("");
  const [avatarUrl, setAvatarUrl] = React.useState<string>("/images/default-avatar.jpg");
  const [bio, setBio] = React.useState<string>("");

  const activeCategory = CAREER_CATEGORIES.find((c) => c.id === selectedCategory) || CAREER_CATEGORIES[0];

  // Auto-switch suggested skills when category changes
  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    const cat = CAREER_CATEGORIES.find((c) => c.id === catId);
    if (cat) {
      setTargetRole(cat.suggestedRoles[0]);
      // keep common skills or switch to category defaults
      setSelectedSkills(cat.skills.slice(0, 5));
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
      setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
      setCustomSkillInput("");
    }
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAndFinish = async (skipAll = false) => {
    setSaving(true);
    try {
      if (!skipAll) {
        await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            careerField: activeCategory.title,
            targetRole,
            seniority,
            workplacePreference: workplace,
            targetLocations: [location],
            minSalary,
            skills: selectedSkills,
            avatarUrl,
            bio: bio || `${targetRole} specializing in ${selectedSkills.slice(0, 3).join(", ")}.`,
          }),
        });
      }
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to save onboarding profile:", err);
      router.push("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-2 sm:px-4">
      {/* Top Header & Progress */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-sm">
              {step}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Step {step} of 4 • Personalize Your Journey
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {step === 1 && "What is your primary career domain?"}
            {step === 2 && "What are your job preferences?"}
            {step === 3 && "Which core skills do you excel at?"}
            {step === 4 && "Add your photo and professional bio"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {step === 1 && "Select the track that best describes your expertise. You can refine anytime."}
            {step === 2 && "Help our AI calibrate realistic matches and pinpoint the right compensation."}
            {step === 3 && "Click to select your superpowers. We use these for automated scoring."}
            {step === 4 && "Preview your dynamic candidate card that recruiters and companies see."}
          </p>
        </div>

        {/* Universal Skip Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSaveAndFinish(true)}
          className="shrink-0 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-gray-300"
        >
          Skip to Dashboard
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Visual Step Progress Bar */}
      <div className="mb-8 grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all duration-300 ${
              s <= step ? "bg-indigo-600" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Career Domain Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {CAREER_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`group relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/70"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${cat.color} text-white shadow-sm`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {isSelected && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <h3 className="mt-3 font-semibold text-gray-900">{cat.title}</h3>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed">{cat.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {cat.suggestedRoles.slice(0, 2).map((role) => (
                      <span
                        key={role}
                        className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>Personalization Preview</span>
            </div>
            <p className="mt-1 text-xs text-indigo-700">
              Selecting <strong className="font-semibold">{activeCategory.title}</strong> will automatically tune
              your job recommendations, skill verification challenges, and live LinkedIn/Google queries.
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Target Role & Preferences */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Target Role Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Target Job Title / Role
            </label>
            <Input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer"
              className="h-11 rounded-xl text-base font-medium"
            />
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-gray-500">Popular:</span>
              {activeCategory.suggestedRoles.map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setTargetRole(role)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    targetRole === role
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Seniority Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Seniority Level
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {SENIORITY_LEVELS.map((lvl) => (
                <button
                  type="button"
                  key={lvl.id}
                  onClick={() => setSeniority(lvl.id)}
                  className={`flex flex-col items-start rounded-xl border p-3 text-left transition ${
                    seniority === lvl.id
                      ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <span className="text-xs font-bold text-gray-900">{lvl.label}</span>
                  <span className="text-[10px] text-gray-500">{lvl.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Workplace & Location */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Workplace Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {WORKPLACE_PREFERENCES.map((wp) => {
                  const Icon = wp.icon;
                  return (
                    <button
                      type="button"
                      key={wp.id}
                      onClick={() => setWorkplace(wp.id)}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 transition ${
                        workplace === wp.id
                          ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-2 ring-indigo-500/20"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs font-bold">{wp.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Target Location / Region
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote Worldwide, New York, London"
                className="h-11 rounded-xl"
              />
              <div className="flex flex-wrap gap-1 pt-1">
                {LOCATION_PRESETS.slice(0, 3).map((loc) => (
                  <button
                    type="button"
                    key={loc}
                    onClick={() => setLocation(loc)}
                    className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600 hover:bg-gray-200"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Salary Expectation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Target Minimum Annual Salary
              </label>
              <span className="text-base font-bold text-indigo-600">
                ${minSalary.toLocaleString()} USD / yr
              </span>
            </div>
            <input
              type="range"
              min="40000"
              max="250000"
              step="5000"
              value={minSalary}
              onChange={(e) => setMinSalary(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-600"
            />
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>$40,000</span>
              <span>$120,000</span>
              <span>$200,000</span>
              <span>$250,000+</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Core Skills Selection */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Select Skills ({selectedSkills.length} selected)
            </span>
            <span className="text-xs text-indigo-600 font-medium">
              Click to toggle • Selected skills drive match accuracy
            </span>
          </div>

          {/* Skills Grid */}
          <div className="flex flex-wrap gap-2">
            {activeCategory.skills.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-semibold transition ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  {skill}
                </button>
              );
            })}
          </div>

          {/* Custom Skill Adder */}
          <form onSubmit={handleAddCustomSkill} className="flex gap-2">
            <Input
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              placeholder="Add other skills (e.g. Supabase, Rust, Go, Figma)..."
              className="h-11 rounded-xl"
            />
            <Button
              type="submit"
              variant="outline"
              className="h-11 shrink-0 rounded-xl px-4 font-semibold text-indigo-600 border-indigo-200 hover:bg-indigo-50"
            >
              + Add Skill
            </Button>
          </form>

          {/* Display all selected skills */}
          {selectedSkills.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Your Calibrated Stack
              </span>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {selectedSkills.map((sk) => (
                  <Badge
                    key={sk}
                    variant="secondary"
                    className="gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-gray-800 shadow-2xs border border-gray-200"
                  >
                    {sk}
                    <button
                      type="button"
                      onClick={() => toggleSkill(sk)}
                      className="ml-1 text-gray-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Photo & Bio Personalization */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Left: Avatar Picker */}
            <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-xs">
              <div className="relative mb-3 h-28 w-28 overflow-hidden rounded-full ring-4 ring-indigo-100 shadow-md">
                <Image
                  src={avatarUrl}
                  alt="Profile Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs font-bold text-gray-900">Your Candidate Avatar</span>
              <p className="mt-1 text-[11px] text-gray-500">
                Visible on your personalized AI resumes and candidate cards.
              </p>

              <label className="mt-3.5 inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition">
                <Upload className="h-3.5 w-3.5 text-gray-500" />
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFile}
                  className="hidden"
                />
              </label>
            </div>

            {/* Right: Bio & Tagline */}
            <div className="space-y-4 sm:col-span-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Professional Bio / Elevator Pitch
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={`Hi! I am a ${targetRole} passionate about delivering high-impact solutions with ${selectedSkills.slice(0, 3).join(", ")}. Focused on modern engineering, speed, and reliability.`}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Dynamic Candidate Summary Badge */}
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                  Instant Candidate Card Preview
                </span>
                <div className="mt-2 flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-indigo-500">
                    <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{targetRole}</h4>
                    <p className="text-xs text-gray-600">
                      {seniority.toUpperCase()} • {location} • ${minSalary.toLocaleString()} USD
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation Bar */}
      <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-5">
        <div>
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="gap-1.5 rounded-xl border-gray-300 font-semibold"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleSaveAndFinish(true)}
              className="text-xs text-gray-500 hover:text-gray-900"
            >
              Skip Setup for now
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {step < 4 ? (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(step + 1)}
                className="text-xs text-gray-500 hover:text-gray-900"
              >
                Skip this step
              </Button>
              <Button
                type="button"
                onClick={() => setStep(step + 1)}
                className="gap-1.5 rounded-xl bg-indigo-600 px-5 font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                Next Step
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              type="button"
              disabled={saving}
              onClick={() => handleSaveAndFinish(false)}
              className="gap-2 rounded-xl bg-emerald-600 px-6 font-bold text-white shadow-md hover:bg-emerald-700 transition"
            >
              {saving ? "Calibrating..." : "Launch My Dashboard 🚀"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
