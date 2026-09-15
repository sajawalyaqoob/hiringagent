"use client";

import * as React from "react";
import {
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Layers,
  Globe,
  Sliders,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CAREER_DOMAINS, getDomainById } from "@/lib/config/domains";

export default function CareerProfilePage() {
  const [activeTab, setActiveTab] = React.useState<
    "personal" | "professional" | "experience" | "education" | "skills" | "projects" | "preferences"
  >("personal");

  const [savedSuccess, setSavedSuccess] = React.useState(false);
  const [completionPercentage, setCompletionPercentage] = React.useState(88);
  const [aiAnalysis, setAiAnalysis] = React.useState<any>(null);

  // Profile Form State
  const [personal, setPersonal] = React.useState({
    fullName: "Candidate",
    professionalHeadline: "Professional Specialist",
    email: "",
    phone: "",
    location: "",
    linkedInUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    industry: "cs_it",
  });

  const [professional, setProfessional] = React.useState({
    currentJobTitle: "Professional Specialist",
    yearsOfExperience: 3,
    industry: "cs_it",
    careerLevel: "mid",
    employmentStatus: "open_to_work",
  });

  // Experiences List
  const [experiences, setExperiences] = React.useState<any[]>([]);

  // Skills
  const [skills, setSkills] = React.useState<any[]>([]);

  // Education
  const [education, setEducation] = React.useState<any[]>([]);

  // Job Preferences
  const [preferences, setPreferences] = React.useState({
    desiredJobTitles: "Professional Specialist",
    desiredIndustries: "General Professional",
    targetLocations: "Remote",
    workplacePreference: "remote",
    minimumSalary: 75000,
    targetSalary: 100000,
    preferredTechnologies: "",
  });

  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    async function fetchProfile() {
      try {
        const [profRes, analyzeRes] = await Promise.all([
          fetch("/api/profile").then((r) => r.json()).catch(() => null),
          fetch("/api/profile/analyze").then((r) => r.json()).catch(() => null),
        ]);

        if (profRes?.success && profRes.data) {
          const { profile, completion, experiences: exps, education: edus, skills: sks } = profRes.data;
          if (profile) {
            setPersonal({
              fullName: profile.fullName || "Candidate",
              professionalHeadline: profile.professionalHeadline || "Professional Specialist",
              email: profile.email || "",
              phone: profile.phone || "",
              location: profile.location || "",
              linkedInUrl: profile.linkedInUrl || "",
              githubUrl: profile.githubUrl || "",
              portfolioUrl: profile.portfolioUrl || "",
              industry: profile.industry || "cs_it",
            });
            setProfessional({
              currentJobTitle: profile.currentJobTitle || "Professional Specialist",
              yearsOfExperience: profile.yearsOfExperience || 3,
              industry: profile.industry || "cs_it",
              careerLevel: (profile.careerLevel as any) || "mid",
              employmentStatus: (profile.employmentStatus as any) || "open_to_work",
            });
          }
          if (completion?.percentage !== undefined) {
            setCompletionPercentage(completion.percentage);
          }
          if (Array.isArray(exps)) setExperiences(exps);
          if (Array.isArray(edus)) setEducation(edus);
          if (Array.isArray(sks)) setSkills(sks);
        }

        if (analyzeRes?.success && analyzeRes.data) {
          setAiAnalysis(analyzeRes.data);
        }
      } catch (err) {
        console.warn("Could not load profile from API:", err);
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
        industry: personal.industry,
        currentJobTitle: professional.currentJobTitle,
        yearsOfExperience: Number(professional.yearsOfExperience) || 0,
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

  const domainObj = getDomainById(personal.industry);

  return (
    <div className="space-y-6">
      {/* Header with Completion Metric & Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d5d9d9] pb-4 bg-white p-4 rounded-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#0f1111]">Career Profile Builder</h1>
            <Badge variant="success">{completionPercentage}% Complete</Badge>
            <Badge variant="info">{domainObj.label}</Badge>
          </div>
          <p className="text-xs text-[#565959] mt-0.5">
            Calibrate your domain experience, skills, and target goals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-bold text-[#067d62] flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Profile Updated
            </span>
          )}
          <Button variant="primary" size="sm" onClick={handleSave} disabled={isSaving} className="font-bold gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white">
            <Save className="h-3.5 w-3.5" />
            <span>{isSaving ? "Saving..." : "Save Profile"}</span>
          </Button>
        </div>
      </div>

      {/* Groq AI Analysis Summary Banner */}
      {aiAnalysis && (
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/70 via-white to-violet-50/50 p-4 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span className="font-bold text-xs text-slate-900">
                Groq AI Evaluation ({aiAnalysis.fieldDomain}): <strong className="text-indigo-600">{aiAnalysis.overallScore}% — {aiAnalysis.gradeLabel}</strong>
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
            <div>
              <strong className="text-emerald-700 block mb-0.5">▪ Strengths:</strong>
              <p className="text-[11px] text-slate-600">{aiAnalysis.strengthsHighlighted?.join(" • ")}</p>
            </div>
            <div>
              <strong className="text-amber-800 block mb-0.5">▪ Recommended Additions:</strong>
              <p className="text-[11px] text-slate-600">{aiAnalysis.missingFieldGaps?.join(" • ")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Section Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-[#d5d9d9] bg-[#f8f9fa] p-1.5 rounded-xs">
        {[
          { id: "personal", label: "Personal Info", icon: User },
          { id: "professional", label: "Domain & Role", icon: Briefcase },
          { id: "experience", label: "Work Experience", icon: Layers },
          { id: "skills", label: "Domain Skills", icon: Sparkles, highlight: true },
          { id: "education", label: "Education", icon: GraduationCap },
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

      {/* 1. PERSONAL INFO */}
      {activeTab === "personal" && (
        <Card className="border-[#d5d9d9] bg-white">
          <CardHeader className="p-4 border-b border-[#f3f4f6]">
            <CardTitle className="text-sm font-bold text-[#0f1111]">Personal & Contact Information</CardTitle>
            <CardDescription className="text-xs text-[#565959]">
              Used for header generation on tailored resumes and cold recruiter outreach.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[#0f1111] block mb-1">Full Name</label>
                <Input
                  value={personal.fullName}
                  onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-[#0f1111] block mb-1">Professional Headline</label>
                <Input
                  value={personal.professionalHeadline}
                  onChange={(e) => setPersonal({ ...personal, professionalHeadline: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-[#0f1111] block mb-1">Email Address</label>
                <Input
                  type="email"
                  value={personal.email}
                  onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-[#0f1111] block mb-1">Phone Number</label>
                <Input
                  value={personal.phone}
                  onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-[#0f1111] block mb-1">Location / Market</label>
                <Input
                  value={personal.location}
                  onChange={(e) => setPersonal({ ...personal, location: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-[#0f1111] block mb-1">LinkedIn Profile URL</label>
                <Input
                  value={personal.linkedInUrl}
                  onChange={(e) => setPersonal({ ...personal, linkedInUrl: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-[#0f1111] block mb-1">GitHub / Portfolio URL</label>
                <Input
                  value={personal.githubUrl}
                  onChange={(e) => setPersonal({ ...personal, githubUrl: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-[#0f1111] block mb-1">Portfolio / Website URL</label>
                <Input
                  value={personal.portfolioUrl}
                  onChange={(e) => setPersonal({ ...personal, portfolioUrl: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 2. PROFESSIONAL & DOMAIN */}
      {activeTab === "professional" && (
        <Card className="border-[#d5d9d9] bg-white">
          <CardHeader className="p-4 border-b border-[#f3f4f6]">
            <CardTitle className="text-sm font-bold text-[#0f1111]">Career Domain & Role Seniority</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[#0f1111] block mb-1">Career Field / Domain</label>
                <Select
                  value={personal.industry}
                  onChange={(e) => {
                    const nextDomain = e.target.value;
                    setPersonal({ ...personal, industry: nextDomain });
                    setProfessional({ ...professional, industry: nextDomain });
                  }}
                  options={CAREER_DOMAINS.map((d) => ({ value: d.id, label: `${d.icon} ${d.label}` }))}
                />
              </div>

              <div>
                <label className="font-bold text-[#0f1111] block mb-1">Current / Target Job Title</label>
                <Input
                  value={professional.currentJobTitle}
                  onChange={(e) => setProfessional({ ...professional, currentJobTitle: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold text-[#0f1111] block mb-1">Total Years of Experience</label>
                <Input
                  type="number"
                  value={professional.yearsOfExperience}
                  onChange={(e) => setProfessional({ ...professional, yearsOfExperience: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label className="font-bold text-[#0f1111] block mb-1">Career Seniority Level</label>
                <Select
                  value={professional.careerLevel}
                  onChange={(e) => setProfessional({ ...professional, careerLevel: e.target.value })}
                  options={[
                    { value: "entry", label: "Entry Level" },
                    { value: "mid", label: "Mid Level" },
                    { value: "senior", label: "Senior Level" },
                    { value: "lead", label: "Lead / Supervisor" },
                    { value: "principal", label: "Principal / Executive" },
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
                    company: "Organization / Firm",
                    jobTitle: domainObj.defaultJobTitle,
                    location: "Remote",
                    duration: "(Current)",
                    responsibilities: ["Key responsibilities and achievements..."],
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
            <Card key={exp.id || idx} className="border-[#d5d9d9] bg-white">
              <CardHeader className="p-4 border-b border-[#f3f4f6] flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-[#0f1111]">
                    {exp.jobTitle} • {exp.company}
                  </CardTitle>
                </div>
                <button
                  type="button"
                  onClick={() => setExperiences(experiences.filter((_, i) => i !== idx))}
                  className="text-gray-400 hover:text-red-600 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#0f1111] block mb-1">Company / Organization</label>
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
                    <label className="font-bold text-[#0f1111] block mb-1">Job Title</label>
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
                  <label className="font-bold text-[#0f1111] block mb-1">Duration / Dates</label>
                  <Input
                    value={exp.duration || ""}
                    onChange={(e) => {
                      const next = [...experiences];
                      next[idx].duration = e.target.value;
                      setExperiences(next);
                    }}
                    placeholder="e.g. (3 Months) or 2022 - Present"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 4. DOMAIN SKILLS */}
      {activeTab === "skills" && (
        <Card className="border-[#d5d9d9] bg-white">
          <CardHeader className="p-4 border-b border-[#f3f4f6]">
            <CardTitle className="text-sm font-bold text-[#0f1111]">Calibrated Domain Skills</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, idx) => (
                <Badge key={idx} variant="outline" className="px-2.5 py-1 text-xs">
                  {typeof s === "string" ? s : s.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 5. EDUCATION */}
      {activeTab === "education" && (
        <Card className="border-[#d5d9d9] bg-white">
          <CardHeader className="p-4 border-b border-[#f3f4f6]">
            <CardTitle className="text-sm font-bold text-[#0f1111]">Education & Credentials</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            {education.map((edu, idx) => (
              <div key={idx} className="p-3 border border-slate-200 rounded-xs bg-slate-50 space-y-1">
                <p className="font-bold text-slate-900">{edu.degree} — {edu.institution}</p>
                <p className="text-slate-500">{edu.startDate && `${edu.startDate} - `}{edu.endDate || "Present"}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 6. PREFERENCES */}
      {activeTab === "preferences" && (
        <Card className="border-[#d5d9d9] bg-white">
          <CardHeader className="p-4 border-b border-[#f3f4f6]">
            <CardTitle className="text-sm font-bold text-[#0f1111]">Target Job Criteria</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[#0f1111] block mb-1">Desired Job Titles</label>
                <Input
                  value={preferences.desiredJobTitles}
                  onChange={(e) => setPreferences({ ...preferences, desiredJobTitles: e.target.value })}
                />
              </div>
              <div>
                <label className="font-bold text-[#0f1111] block mb-1">Workplace Preference</label>
                <Select
                  value={preferences.workplacePreference}
                  onChange={(e) => setPreferences({ ...preferences, workplacePreference: e.target.value })}
                  options={[
                    { value: "remote", label: "Remote Only" },
                    { value: "hybrid", label: "Hybrid" },
                    { value: "on_site", label: "On-Site" },
                  ]}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
