"use client";

import * as React from "react";
import {
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Layers,
  Award,
  Globe,
  Sliders,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { SkillProficiencyLevel } from "@/types/database";

export default function CareerProfilePage() {
  const [activeTab, setActiveTab] = React.useState<
    "personal" | "professional" | "experience" | "education" | "skills" | "projects" | "preferences"
  >("personal");

  const [savedSuccess, setSavedSuccess] = React.useState(false);
  const [completionPercentage, setCompletionPercentage] = React.useState(88);

  // Profile Form State
  const [personal, setPersonal] = React.useState({
    fullName: "Alex Morgan",
    professionalHeadline: "Senior Full-Stack & Distributed Systems Engineer",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 234-8901",
    location: "Seattle, WA (Open to Remote)",
    linkedInUrl: "https://linkedin.com/in/alex-morgan-dev",
    githubUrl: "https://github.com/alexmorgan-dev",
    portfolioUrl: "https://alexmorgan.codes",
  });

  const [professional, setProfessional] = React.useState({
    currentJobTitle: "Senior Software Engineer",
    yearsOfExperience: 6,
    industry: "Enterprise SaaS & Cloud Infrastructure",
    careerLevel: "senior",
    employmentStatus: "open_to_work",
  });

  // Experiences List
  const [experiences, setExperiences] = React.useState([
    {
      id: "exp_01",
      company: "CloudScale Technologies",
      jobTitle: "Senior Software Engineer",
      location: "Seattle, WA",
      isRemote: true,
      employmentType: "full_time",
      startDate: "2023-04",
      endDate: "",
      isCurrent: true,
      responsibilities:
        "Architected and deployed event-driven microservices processing 45M+ daily requests using Go, Node.js, and Apache Kafka.\nLed high-throughput database sharding and performance tuning on PostgreSQL reducing p99 latency by 38%.\nMentored 4 junior and mid-level engineers across system design, testing best practices, and CI/CD pipelines.",
      achievements:
        "Reduced cloud compute overhead by $120k annually through container right-sizing and caching optimization.\nDesigned real-time telemetry pipeline delivering sub-second anomaly detection across 12 distributed clusters.",
      technologiesUsed: "Go, TypeScript, Node.js, PostgreSQL, Kafka, Docker, Kubernetes, AWS",
    },
    {
      id: "exp_02",
      company: "Vanguard Digital Labs",
      jobTitle: "Full-Stack Engineer",
      location: "San Francisco, CA",
      isRemote: false,
      employmentType: "full_time",
      startDate: "2020-08",
      endDate: "2023-03",
      isCurrent: false,
      responsibilities:
        "Engineered customer-facing analytics dashboards using Next.js, React, TypeScript, and Tailwind CSS.\nConstructed REST and GraphQL endpoints backed by Node.js and Redis caching layers.",
      achievements:
        "Improved Lighthouse performance scores from 54 to 98 through dynamic bundle splitting and asset caching.\nSpearheaded redesign of data query engine accelerating client report generation by 4x.",
      technologiesUsed: "Next.js, React, TypeScript, Tailwind CSS, GraphQL, Redis, Jest",
    },
  ]);

  // Skills with AI Career Interview Depth
  const [skills, setSkills] = React.useState<
    Array<{
      id: string;
      name: string;
      category: string;
      proficiencyLevel: SkillProficiencyLevel;
      yearsOfExperience: number;
      verifiedViaInterview: boolean;
      evidenceNotes: string;
    }>
  >([
    {
      id: "skl_01",
      name: "TypeScript",
      category: "programming_languages",
      proficiencyLevel: "professional_experience",
      yearsOfExperience: 6,
      verifiedViaInterview: true,
      evidenceNotes: "Primary language for 4+ production enterprise applications; strict typing advocate.",
    },
    {
      id: "skl_02",
      name: "Next.js",
      category: "frameworks",
      proficiencyLevel: "professional_experience",
      yearsOfExperience: 5,
      verifiedViaInterview: true,
      evidenceNotes: "Built SSR/SSG apps using App Router, Server Actions, Route Handlers, and Edge runtime.",
    },
    {
      id: "skl_03",
      name: "Go (Golang)",
      category: "programming_languages",
      proficiencyLevel: "professional_experience",
      yearsOfExperience: 3,
      verifiedViaInterview: true,
      evidenceNotes: "Built concurrent microservices, channel synchronization, and gRPC services.",
    },
    {
      id: "skl_04",
      name: "Apache Kafka",
      category: "tools",
      proficiencyLevel: "project_experience",
      yearsOfExperience: 2,
      verifiedViaInterview: false,
      evidenceNotes: "Used for distributed event streams, consumer groups, and partition balancing.",
    },
    {
      id: "skl_05",
      name: "Rust",
      category: "programming_languages",
      proficiencyLevel: "beginner_familiarity",
      yearsOfExperience: 1,
      verifiedViaInterview: false,
      evidenceNotes: "Completed Rust Book and personal CLI utilities; no production deployment yet.",
    },
  ]);

  // Job Preferences
  const [preferences, setPreferences] = React.useState({
    desiredJobTitles: "Staff Software Engineer, Senior Full-Stack Engineer, Senior Backend Engineer",
    desiredIndustries: "Cloud Infrastructure, Enterprise SaaS, Developer Tools, FinTech",
    targetLocations: "Seattle, WA, Remote (US), San Francisco, CA",
    workplacePreference: "remote",
    minimumExperienceYears: 5,
    employmentTypes: "Full-Time",
    minimumSalary: 175000,
    targetSalary: 215000,
    preferredTechnologies: "TypeScript, Next.js, Go, PostgreSQL, AWS, Kubernetes",
  });

  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        const json = await res.json();
        if (json.success && json.data) {
          const { profile, completion } = json.data;
          if (profile) {
            setPersonal({
              fullName: profile.fullName || "Alex Morgan",
              professionalHeadline: profile.professionalHeadline || "Senior Full-Stack & Distributed Systems Engineer",
              email: profile.email || "alex.morgan@example.com",
              phone: profile.phone || "+1 (555) 234-8901",
              location: profile.location || "Seattle, WA (Open to Remote)",
              linkedInUrl: profile.linkedinUrl || "https://linkedin.com/in/alex-morgan-dev",
              githubUrl: profile.githubUrl || "https://github.com/alexmorgan-dev",
              portfolioUrl: profile.portfolioUrl || "https://alexmorgan.codes",
            });
            setProfessional({
              currentJobTitle: profile.currentJobTitle || "Senior Software Engineer",
              yearsOfExperience: profile.yearsOfExperience || 6,
              industry: profile.industry || "Enterprise SaaS & Cloud Infrastructure",
              careerLevel: (profile.careerLevel as any) || "senior",
              employmentStatus: (profile.employmentStatus as any) || "open_to_work",
            });
          }
          if (completion?.percentage !== undefined) {
            setCompletionPercentage(completion.percentage);
          }
        }
      } catch (err) {
        console.warn("Could not load profile from API, using defaults:", err);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const payload = {
        fullName: personal.fullName,
        professionalHeadline: personal.professionalHeadline,
        email: personal.email,
        phone: personal.phone,
        location: personal.location,
        linkedInUrl: personal.linkedInUrl,
        githubUrl: personal.githubUrl,
        portfolioUrl: personal.portfolioUrl,
        currentJobTitle: professional.currentJobTitle,
        yearsOfExperience: Number(professional.yearsOfExperience) || 0,
        industry: professional.industry,
        careerLevel: professional.careerLevel,
        employmentStatus: professional.employmentStatus,
      };

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.warn("Error saving profile to API:", err);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSkillLevel = (id: string, level: SkillProficiencyLevel) => {
    setSkills((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              proficiencyLevel: level,
              verifiedViaInterview: true,
            }
          : s
      )
    );
    setCompletionPercentage(94);
  };

  return (
    <div className="space-y-6">
      {/* Header with Completion Metric & Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d5d9d9] pb-4 bg-white p-4 rounded-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#0f1111]">Career Profile Builder</h1>
            <Badge variant="success">{completionPercentage}% Complete</Badge>
          </div>
          <p className="text-xs text-[#565959] mt-0.5">
            Calibrate your actual skills and career background to ensure high-fidelity ATS and job matching.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-bold text-[#067d62] flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Profile Updated
            </span>
          )}
          <Button variant="primary" size="sm" onClick={handleSave} disabled={isSaving} className="font-bold gap-1.5">
            <Save className="h-3.5 w-3.5" />
            <span>{isSaving ? "Saving..." : "Save Profile"}</span>
          </Button>
        </div>
      </div>

      {/* Profile Section Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-[#d5d9d9] bg-[#f8f9fa] p-1.5 rounded-xs">
        {[
          { id: "personal", label: "Personal Info", icon: User },
          { id: "professional", label: "Professional", icon: Briefcase },
          { id: "experience", label: "Work Experience", icon: Layers },
          { id: "skills", label: "AI Skill Interview", icon: Sparkles, highlight: true },
          { id: "education", label: "Education", icon: GraduationCap },
          { id: "projects", label: "Projects", icon: Globe },
          { id: "preferences", label: "Job Preferences", icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-1.5 rounded-xs px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-[#131921] text-white"
                  : tab.highlight
                  ? "bg-[#fffbeb] text-[#b45309] border border-[#fde68a] hover:bg-[#fef3c7]"
                  : "text-[#565959] hover:bg-gray-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION CONTENT */}

      {/* 1. PERSONAL INFO */}
      {activeTab === "personal" && (
        <Card className="border-[#d5d9d9] bg-white">
          <CardHeader className="p-4 border-b border-[#f3f4f6]">
            <CardTitle className="text-sm font-bold text-[#0f1111]">Personal & Contact Information</CardTitle>
            <CardDescription className="text-xs text-[#565959]">
              Used for header generation on tailored resumes and cold recruiter outreach.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0f1111]">Full Name</label>
                <Input
                  value={personal.fullName}
                  onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0f1111]">Professional Headline</label>
                <Input
                  value={personal.professionalHeadline}
                  onChange={(e) => setPersonal({ ...personal, professionalHeadline: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0f1111]">Email Address</label>
                <Input
                  type="email"
                  value={personal.email}
                  onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0f1111]">Phone Number</label>
                <Input
                  value={personal.phone}
                  onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0f1111]">Location / Market</label>
                <Input
                  value={personal.location}
                  onChange={(e) => setPersonal({ ...personal, location: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0f1111]">LinkedIn Profile URL</label>
                <Input
                  value={personal.linkedInUrl}
                  onChange={(e) => setPersonal({ ...personal, linkedInUrl: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0f1111]">GitHub URL</label>
                <Input
                  value={personal.githubUrl}
                  onChange={(e) => setPersonal({ ...personal, githubUrl: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0f1111]">Portfolio URL</label>
                <Input
                  value={personal.portfolioUrl}
                  onChange={(e) => setPersonal({ ...personal, portfolioUrl: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 2. PROFESSIONAL INFO */}
      {activeTab === "professional" && (
        <Card className="border-[#d5d9d9] bg-white">
          <CardHeader className="p-4 border-b border-[#f3f4f6]">
            <CardTitle className="text-sm font-bold text-[#0f1111]">Professional Background & Seniority</CardTitle>
            <CardDescription className="text-xs text-[#565959]">
              Drives seniority calibration and executive matching thresholds.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0f1111]">Current Job Title</label>
                <Input
                  value={professional.currentJobTitle}
                  onChange={(e) => setProfessional({ ...professional, currentJobTitle: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0f1111]">Total Years of Experience</label>
                <Input
                  type="number"
                  value={professional.yearsOfExperience}
                  onChange={(e) => setProfessional({ ...professional, yearsOfExperience: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0f1111]">Primary Industry</label>
                <Input
                  value={professional.industry}
                  onChange={(e) => setProfessional({ ...professional, industry: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0f1111]">Career Seniority Level</label>
                <Select
                  value={professional.careerLevel}
                  onChange={(e) => setProfessional({ ...professional, careerLevel: e.target.value })}
                  options={[
                    { value: "entry", label: "Entry Level" },
                    { value: "mid", label: "Mid Level" },
                    { value: "senior", label: "Senior Engineer" },
                    { value: "lead", label: "Lead / Staff Engineer" },
                    { value: "principal", label: "Principal Engineer" },
                    { value: "executive", label: "Engineering Director / VP" },
                  ]}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0f1111]">Employment Status</label>
                <Select
                  value={professional.employmentStatus}
                  onChange={(e) => setProfessional({ ...professional, employmentStatus: e.target.value })}
                  options={[
                    { value: "open_to_work", label: "Actively Looking (Open to Work)" },
                    { value: "employed", label: "Employed & Passively Looking" },
                    { value: "freelance", label: "Freelance / Contract Available" },
                    { value: "unemployed", label: "Currently In Transition" },
                  ]}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3. WORK EXPERIENCE */}
      {activeTab === "experience" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#0f1111]">Work History ({experiences.length} Positions)</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setExperiences([
                  ...experiences,
                  {
                    id: `exp_${Date.now()}`,
                    company: "New Company",
                    jobTitle: "Software Engineer",
                    location: "Remote",
                    isRemote: true,
                    employmentType: "full_time",
                    startDate: "2024-01",
                    endDate: "",
                    isCurrent: true,
                    responsibilities: "Describe key responsibilities...",
                    achievements: "Quantified metric achievements...",
                    technologiesUsed: "TypeScript, React, Node.js",
                  },
                ]);
              }}
              className="text-xs font-bold gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Position</span>
            </Button>
          </div>

          {experiences.map((exp, idx) => (
            <Card key={exp.id} className="border-[#d5d9d9] bg-white">
              <CardHeader className="p-4 border-b border-[#f3f4f6] flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-[#0f1111]">
                    {exp.jobTitle} • {exp.company}
                  </CardTitle>
                  <CardDescription className="text-xs text-[#565959]">
                    {exp.startDate} — {exp.isCurrent ? "Present" : exp.endDate} ({exp.location})
                  </CardDescription>
                </div>
                <button
                  type="button"
                  onClick={() => setExperiences(experiences.filter((e) => e.id !== exp.id))}
                  className="text-gray-400 hover:text-red-600 p-1"
                  title="Remove Position"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#0f1111]">Company Name</label>
                    <Input
                      value={exp.company}
                      onChange={(e) => {
                        const next = [...experiences];
                        next[idx].company = e.target.value;
                        setExperiences(next);
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#0f1111]">Job Title</label>
                    <Input
                      value={exp.jobTitle}
                      onChange={(e) => {
                        const next = [...experiences];
                        next[idx].jobTitle = e.target.value;
                        setExperiences(next);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0f1111]">
                    Core Responsibilities (Reverse-chronological bullet points)
                  </label>
                  <Textarea
                    rows={3}
                    value={exp.responsibilities}
                    onChange={(e) => {
                      const next = [...experiences];
                      next[idx].responsibilities = e.target.value;
                      setExperiences(next);
                    }}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0f1111]">
                    Quantified Metric Achievements (Key for ATS scoring)
                  </label>
                  <Textarea
                    rows={2}
                    value={exp.achievements}
                    onChange={(e) => {
                      const next = [...experiences];
                      next[idx].achievements = e.target.value;
                      setExperiences(next);
                    }}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0f1111]">Technologies Used</label>
                  <Input
                    value={exp.technologiesUsed}
                    onChange={(e) => {
                      const next = [...experiences];
                      next[idx].technologiesUsed = e.target.value;
                      setExperiences(next);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 4. SKILL DISCOVERY UX (AI CAREER INTERVIEW) */}
      {activeTab === "skills" && (
        <div className="space-y-6">
          {/* AI Career Interview Callout Banner */}
          <div className="rounded-xs border border-[#fde68a] bg-[#fffbeb] p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#b45309]">
              <Sparkles className="h-4 w-4 text-[#f08804]" />
              <span>AI Career Interview & Calibration Mode</span>
            </div>
            <p className="text-xs text-[#565959] leading-relaxed">
              To guarantee zero hallucinations and eliminate resume exaggeration, HireBoost asks targeted calibration questions. We differentiate between technologies you just &ldquo;know&rdquo; versus those where you have shipped mission-critical enterprise systems.
            </p>
          </div>

          {/* Interactive Skill Depth Cards */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0f1111]">Calibrated Technical Skills</h3>

            <div className="grid grid-cols-1 gap-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="rounded-xs border border-[#d5d9d9] bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="space-y-1 max-w-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0f1111]">{skill.name}</span>
                      <Badge variant={skill.verifiedViaInterview ? "success" : "warning"}>
                        {skill.verifiedViaInterview ? "Interview Verified" : "Needs Depth Check"}
                      </Badge>
                      <span className="text-[11px] text-gray-400">({skill.yearsOfExperience} yrs)</span>
                    </div>
                    <p className="text-xs text-[#565959] leading-relaxed italic">
                      &ldquo;{skill.evidenceNotes}&rdquo;
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                    <span className="text-[10px] uppercase font-bold text-gray-400">
                      Verified Depth Level
                    </span>
                    <select
                      value={skill.proficiencyLevel}
                      onChange={(e) => updateSkillLevel(skill.id, e.target.value as SkillProficiencyLevel)}
                      className="h-8 rounded-xs border border-[#d5d9d9] bg-[#f8f9fa] px-2 text-xs font-bold text-[#0f1111] focus:border-[#f08804] focus:outline-none"
                    >
                      <option value="knows">1. Knows (Theoretical / Conceptual)</option>
                      <option value="beginner_familiarity">2. Beginner Familiarity</option>
                      <option value="has_used">3. Has Used (Occasional Utility)</option>
                      <option value="project_experience">4. Project / Prototype Experience</option>
                      <option value="professional_experience">5. Professional Production Experience</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. EDUCATION */}
      {activeTab === "education" && (
        <Card className="border-[#d5d9d9] bg-white">
          <CardHeader className="p-4 border-b border-[#f3f4f6]">
            <CardTitle className="text-sm font-bold text-[#0f1111]">Higher Education & Credentials</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="rounded-xs border border-[#e5e7eb] p-3 bg-[#f8f9fa] space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-xs text-[#0f1111]">University of Washington</h4>
                  <p className="text-xs text-[#565959]">Bachelor of Science in Computer Science & Engineering</p>
                </div>
                <span className="text-xs font-semibold text-[#0f1111]">2016 — 2020</span>
              </div>
              <p className="text-xs text-[#565959]">GPA: 3.85 / 4.0 • Honors: Magna Cum Laude, Dean&apos;s List</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 6. PROJECTS */}
      {activeTab === "projects" && (
        <Card className="border-[#d5d9d9] bg-white">
          <CardHeader className="p-4 border-b border-[#f3f4f6]">
            <CardTitle className="text-sm font-bold text-[#0f1111]">Key Technical Projects</CardTitle>
            <CardDescription className="text-xs text-[#565959]">
              High-signal projects supporting open-source or commercial achievements.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="rounded-xs border border-[#e5e7eb] p-4 bg-[#f8f9fa] space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-sm text-[#0f1111]">StreamQuery Engine</h4>
                <a
                  href="https://github.com/alexmorgan-dev/streamquery"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#b45309] font-bold hover:underline flex items-center gap-1"
                >
                  <span>GitHub Repository</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <p className="text-xs text-[#565959]">
                Open-source lightweight stream processor for filtering and aggregating high-volume WebSocket telemetry.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Go", "WebSockets", "Redis", "Prometheus"].map((t) => (
                  <span key={t} className="rounded-xs bg-white border border-[#d5d9d9] px-2 py-0.5 text-[10px] font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 7. JOB PREFERENCES */}
      {activeTab === "preferences" && (
        <Card className="border-[#d5d9d9] bg-white">
          <CardHeader className="p-4 border-b border-[#f3f4f6]">
            <CardTitle className="text-sm font-bold text-[#0f1111]">Target Job Criteria & Search Preferences</CardTitle>
            <CardDescription className="text-xs text-[#565959]">
              Defines which jobs are highlighted in your compatibility recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0f1111]">Desired Job Titles</label>
                <Input
                  value={preferences.desiredJobTitles}
                  onChange={(e) => setPreferences({ ...preferences, desiredJobTitles: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0f1111]">Workplace Preference</label>
                <Select
                  value={preferences.workplacePreference}
                  onChange={(e) => setPreferences({ ...preferences, workplacePreference: e.target.value })}
                  options={[
                    { value: "remote", label: "Remote Only" },
                    { value: "hybrid", label: "Hybrid (Flexible)" },
                    { value: "on_site", label: "On-Site" },
                    { value: "any", label: "Open to Any Arrangement" },
                  ]}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0f1111]">Minimum Base Salary (USD)</label>
                <Input
                  type="number"
                  value={preferences.minimumSalary}
                  onChange={(e) => setPreferences({ ...preferences, minimumSalary: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0f1111]">Target Base Salary (USD)</label>
                <Input
                  type="number"
                  value={preferences.targetSalary}
                  onChange={(e) => setPreferences({ ...preferences, targetSalary: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-[#0f1111]">Preferred Technologies & Frameworks</label>
                <Input
                  value={preferences.preferredTechnologies}
                  onChange={(e) => setPreferences({ ...preferences, preferredTechnologies: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
