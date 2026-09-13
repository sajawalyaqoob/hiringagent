"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Code,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Cpu,
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  GitBranch,
  Globe,
  Share2,
  Plus,
  Trash2,
  HelpCircle,
  X,
  ArrowRight,
  Camera,
  Layers,
  FileText,
  Clock,
  ShieldCheck,
  User,
  ExternalLink,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";

interface EducationItem {
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface ExperienceItem {
  company: string;
  jobTitle: string;
  location: string;
  duration: string; // e.g. "(3 Months)" or "Jan 2024 - Apr 2024"
  responsibilities: string[];
  technologiesUsed: string[];
}

interface ProjectItem {
  name: string;
  role: string;
  projectUrl: string;
  githubUrl: string;
  technologies: string[];
  responsibilities: string[];
}

const CATEGORIZED_SKILL_PRESETS = [
  {
    category: "Frontend",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "HTML5/CSS3", "JavaScript", "Vue.js", "Redux"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "Express.js", "REST APIs", "Python", "Nest.js", "GraphQL", "Microservices", "Django"],
  },
  {
    category: "Databases",
    skills: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Sequelize ORM", "Prisma", "Supabase"],
  },
  {
    category: "DevOps & Cloud",
    skills: ["Docker", "Linux Administration", "CI/CD Automation", "AWS", "Nginx", "Git", "Kubernetes", "Vercel"],
  },
  {
    category: "Mobile & Cloud Services",
    skills: ["React Native", "Flutter", "Expo", "Cloudinary", "Firebase", "Twilio", "SendGrid"],
  },
];

const PRESET_AVATARS = [
  { id: "exec-1", label: "Modern Dev", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&h=256&fit=crop&crop=faces" },
  { id: "exec-2", label: "Engineer", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=faces" },
  { id: "exec-3", label: "Tech Lead", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&h=256&fit=crop&crop=faces" },
  { id: "exec-4", label: "Consultant", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop&crop=faces" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [step, setStep] = React.useState<number>(1);
  const [saving, setSaving] = React.useState<boolean>(false);
  const [helpModalOpen, setHelpModalOpen] = React.useState<boolean>(false);
  const [isDragging, setIsDragging] = React.useState<boolean>(false);

  // Step 1: Personal & Contact Details (Clean initial state)
  const [fullName, setFullName] = React.useState("");
  const [headline, setHeadline] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [githubUrl, setGithubUrl] = React.useState("");
  const [linkedInUrl, setLinkedInUrl] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState("");
  const [bio, setBio] = React.useState("");

  // Step 2: Education History
  const [educationList, setEducationList] = React.useState<EducationItem[]>([]);

  // Step 3: Work Experience with exact Time Periods
  const [experienceList, setExperienceList] = React.useState<ExperienceItem[]>([]);

  // Step 4: Notable Projects with live URLs
  const [projectList, setProjectList] = React.useState<ProjectItem[]>([]);

  // Step 5: Core Technical Skills
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = React.useState("");

  // Image Upload Handlers
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setAvatarUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAvatarUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Skill Handlers
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
      setCustomSkillInput("");
    }
  };

  // Education Helpers
  const addEducationRow = () => {
    setEducationList([
      ...educationList,
      {
        degree: "",
        institution: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        gpa: "",
      },
    ]);
  };

  const updateEducation = (idx: number, field: keyof EducationItem, val: string) => {
    const updated = [...educationList];
    updated[idx] = { ...updated[idx], [field]: val };
    setEducationList(updated);
  };

  const removeEducation = (idx: number) => {
    setEducationList(educationList.filter((_, i) => i !== idx));
  };

  // Experience Helpers
  const addExperienceRow = () => {
    setExperienceList([
      ...experienceList,
      {
        company: "",
        jobTitle: "",
        location: "",
        duration: "",
        responsibilities: [""],
        technologiesUsed: [],
      },
    ]);
  };

  const updateExperience = (idx: number, field: keyof ExperienceItem, val: any) => {
    const updated = [...experienceList];
    updated[idx] = { ...updated[idx], [field]: val };
    setExperienceList(updated);
  };

  const removeExperience = (idx: number) => {
    setExperienceList(experienceList.filter((_, i) => i !== idx));
  };

  // Project Helpers
  const addProjectRow = () => {
    setProjectList([
      ...projectList,
      {
        name: "",
        role: "",
        projectUrl: "",
        githubUrl: "",
        technologies: [],
        responsibilities: [""],
      },
    ]);
  };

  const updateProject = (idx: number, field: keyof ProjectItem, val: any) => {
    const updated = [...projectList];
    updated[idx] = { ...updated[idx], [field]: val };
    setProjectList(updated);
  };

  const removeProject = (idx: number) => {
    setProjectList(projectList.filter((_, i) => i !== idx));
  };

  // Save Everything to backend
  const handleSaveAndFinish = async (skip = false) => {
    setSaving(true);
    try {
      if (!skip) {
        await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: fullName.trim() || "Professional Candidate",
            email: email.trim(),
            phone: phone.trim(),
            location: location.trim(),
            linkedInUrl: linkedInUrl.trim(),
            githubUrl: githubUrl.trim(),
            careerField: "Software Engineering & Tech",
            targetRole: headline.split("|")[0]?.trim() || headline.trim() || "Software Engineer",
            avatarUrl,
            bio: bio.trim(),
            education: educationList,
            experiences: experienceList,
            projects: projectList,
            skills: selectedSkills,
          }),
        });
      }
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to save onboarding:", err);
      router.push("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  // Step metadata
  const stepsConfig = [
    { id: 1, label: "Identity & Photo", icon: User },
    { id: 2, label: "Education", icon: GraduationCap },
    { id: 3, label: "Experience & Time", icon: Briefcase },
    { id: 4, label: "Live Projects", icon: FolderGit2 },
    { id: 5, label: "Technical Skills", icon: Cpu },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-2 sm:px-4">
      {/* Hidden File Input for Real Photo Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={onFileInputChange}
        className="hidden"
      />

      {/* Top Header & Progress */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white shadow-xs">
              {step}
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600">
              Step {step} of 5 • InvoZone Professional CV Setup
            </span>
          </div>
          <h1 className="mt-1.5 text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            {step === 1 && "Personal Identity & Contact Bar"}
            {step === 2 && "Education & Academic Credentials"}
            {step === 3 && "Work Experience & Time Periods"}
            {step === 4 && "Notable Projects & Live Deployed URLs"}
            {step === 5 && "Categorized Technical Stack"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {step === 1 && "Recruiter-standard contact info, phone, photo, and direct GitHub links."}
            {step === 2 && "Degrees, universities, graduation timelines, and academic performance."}
            {step === 3 && "Include exact time periods (e.g. (3 Months) or dates) for recruiter screening."}
            {step === 4 && "Showcase production systems with live URLs and GitHub repositories."}
            {step === 5 && "Grouped technical competencies matching agency and enterprise ATS standards."}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setHelpModalOpen(true)}
            className="rounded-xl text-xs font-semibold border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100/60"
          >
            <HelpCircle className="mr-1.5 h-3.5 w-3.5 text-indigo-600" />
            Tips & Guide
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleSaveAndFinish(true)}
            className="rounded-xl text-xs text-slate-600 hover:text-slate-900"
          >
            Skip to Dashboard
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Visual Step Progress Indicator */}
      <div className="mb-8 grid grid-cols-5 gap-2 sm:gap-3">
        {stepsConfig.map((s) => {
          const Icon = s.icon;
          const isCompleted = s.id < step;
          const isActive = s.id === step;

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(s.id)}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-indigo-600 shadow-sm shadow-indigo-500/40"
                    : isCompleted
                    ? "bg-emerald-500"
                    : "bg-slate-200"
                }`}
              />
              <div className="mt-2 flex items-center gap-1.5">
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                    isCompleted
                      ? "bg-emerald-100 text-emerald-800"
                      : isActive
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {isCompleted ? <Check className="h-2.5 w-2.5" /> : s.id}
                </span>
                <span
                  className={`text-[11px] font-bold truncate hidden sm:inline ${
                    isActive
                      ? "text-indigo-600"
                      : isCompleted
                      ? "text-slate-800"
                      : "text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: IDENTITY, PHOTO & CONTACT */}
      {/* ========================================================================= */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Left: Interactive Real Photo Upload Card */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerUploadClick}
              className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer bg-white shadow-xs ${
                isDragging
                  ? "border-indigo-600 bg-indigo-50/50 scale-[1.02]"
                  : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50"
              }`}
            >
              {/* Avatar Preview or Empty Silhouette */}
              <div className="relative mb-3.5 h-28 w-28 overflow-hidden rounded-full ring-4 ring-indigo-500/20 shadow-md group-hover:ring-indigo-500/40 transition-all bg-slate-100 flex items-center justify-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Uploaded Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <User className="h-12 w-12 stroke-[1.5]" />
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                  <Camera className="h-6 w-6 mb-1" />
                  <span className="text-[10px] font-bold">
                    {avatarUrl ? "Change" : "Upload"}
                  </span>
                </div>
              </div>

              <span className="text-xs font-bold text-slate-900">
                {avatarUrl ? "Photo Uploaded" : "Upload Candidate Photo"}
              </span>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] leading-relaxed">
                Click or drag & drop. High-res JPG, PNG, or WebP up to 5MB.
              </p>

              {/* Action Buttons */}
              <div className="mt-3 flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerUploadClick();
                  }}
                  className="rounded-xl text-xs font-bold border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
                >
                  <Upload className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
                  {avatarUrl ? "Replace Photo" : "Browse File"}
                </Button>

                {avatarUrl && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={removeAvatar}
                    className="rounded-xl text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Remove
                  </Button>
                )}
              </div>

              {/* Optional Preset Avatars */}
              <div className="mt-4 pt-3 border-t border-slate-100 w-full" onClick={(e) => e.stopPropagation()}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Or pick a professional style:
                </span>
                <div className="flex items-center justify-center gap-2">
                  {PRESET_AVATARS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setAvatarUrl(p.url)}
                      title={p.label}
                      className={`h-8 w-8 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
                        avatarUrl === p.url ? "border-indigo-600 ring-2 ring-indigo-300" : "border-slate-200"
                      }`}
                    >
                      <img src={p.url} alt={p.label} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Personal & Contact Information */}
            <div className="md:col-span-2 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1.5 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-indigo-600" />
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="rounded-xl h-10 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1.5 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                    Location / City <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA or Remote"
                    className="rounded-xl h-10"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 text-xs block mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  Professional Headline / Title <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Senior Full-Stack Engineer | React, Node.js & Cloud Architect"
                  className="rounded-xl h-10"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Appears at the very top of your InvoZone-standard CV right beneath your name.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1.5 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-indigo-600" />
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sarah.jenkins@example.com"
                    className="rounded-xl h-10"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1.5 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-indigo-600" />
                    Phone / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 234-5678 or 0300-1234567"
                    className="rounded-xl h-10 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1.5 flex items-center gap-1.5">
                    <GitBranch className="h-3.5 w-3.5 text-indigo-600" />
                    GitHub Profile / URL
                  </label>
                  <Input
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="github.com/username"
                    className="rounded-xl h-10"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1.5 flex items-center gap-1.5">
                    <Share2 className="h-3.5 w-3.5 text-indigo-600" />
                    LinkedIn Profile / URL
                  </label>
                  <Input
                    value={linkedInUrl}
                    onChange={(e) => setLinkedInUrl(e.target.value)}
                    placeholder="linkedin.com/in/username"
                    className="rounded-xl h-10"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 text-xs block mb-1.5 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-indigo-600" />
                  Executive Profile Summary
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your background, core technical capabilities, and what engineering value you deliver..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs leading-relaxed focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: FORMAL EDUCATION HISTORY */}
      {/* ========================================================================= */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between rounded-xl bg-indigo-50/60 p-3.5 border border-indigo-100 text-xs text-indigo-900">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>
                <strong>InvoZone Standard Tip:</strong> List your formal degrees, universities, and graduation years. Multiple degrees (e.g. BS + MS) are supported.
              </span>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={addEducationRow}
              className="rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 ml-3"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Degree
            </Button>
          </div>

          {educationList.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
              <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Education Added Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Add your degree, university name, and graduation year to satisfy ATS education requirements.
              </p>
              <Button
                type="button"
                onClick={addEducationRow}
                className="mt-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Your First Degree
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {educationList.map((edu, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 relative group"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-indigo-600" />
                      Degree Entry #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeEducation(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Remove Degree"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Degree Program
                      </label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                        placeholder="e.g. BS Computer Science (BSCS)"
                        className="rounded-xl h-9 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Institution / University
                      </label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(idx, "institution", e.target.value)}
                        placeholder="e.g. Stanford University or NCBA&E"
                        className="rounded-xl h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Start Year
                      </label>
                      <Input
                        value={edu.startDate}
                        onChange={(e) => updateEducation(idx, "startDate", e.target.value)}
                        placeholder="e.g. 2021"
                        className="rounded-xl h-9 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Graduation Year
                      </label>
                      <Input
                        value={edu.endDate}
                        onChange={(e) => updateEducation(idx, "endDate", e.target.value)}
                        placeholder="e.g. 2025"
                        className="rounded-xl h-9 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        GPA / Honors (Optional)
                      </label>
                      <Input
                        value={edu.gpa || ""}
                        onChange={(e) => updateEducation(idx, "gpa", e.target.value)}
                        placeholder="e.g. 3.8 / 4.0"
                        className="rounded-xl h-9 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEducationRow}
                className="w-full rounded-xl border-dashed border-slate-300 py-3 text-xs font-bold text-slate-700 hover:border-indigo-400 hover:text-indigo-600"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Another Degree
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: WORK EXPERIENCE & INTERNSHIPS WITH TIME PERIODS */}
      {/* ========================================================================= */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between rounded-xl bg-amber-50/70 p-3.5 border border-amber-200/80 text-xs text-amber-950">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-700 shrink-0" />
              <span>
                <strong>Crucial InvoZone Rule:</strong> Always specify the exact <strong>Duration / Time Period</strong> (e.g. <em>&quot;(3 Months)&quot;</em> or <em>&quot;Jan 2024 – Apr 2024&quot;</em>). Recruiters look for continuous timelines.
              </span>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={addExperienceRow}
              className="rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 ml-3"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Experience
            </Button>
          </div>

          {experienceList.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
              <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Work Experience Added Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Add internships, contract roles, or full-time experience. Exact time periods are highlighted directly on your InvoZone CV.
              </p>
              <Button
                type="button"
                onClick={addExperienceRow}
                className="mt-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Your First Experience
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {experienceList.map((exp, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 relative group"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-emerald-600" />
                      Role #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Remove Role"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Job Title / Position
                      </label>
                      <Input
                        value={exp.jobTitle}
                        onChange={(e) => updateExperience(idx, "jobTitle", e.target.value)}
                        placeholder="e.g. MERN Stack Developer Intern"
                        className="rounded-xl h-9 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Company / Organization
                      </label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(idx, "company", e.target.value)}
                        placeholder="e.g. InvoZone or Tech Sole Inc."
                        className="rounded-xl h-9 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-indigo-700 block mb-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Duration / Time Period
                      </label>
                      <Input
                        value={exp.duration}
                        onChange={(e) => updateExperience(idx, "duration", e.target.value)}
                        placeholder="e.g. (3 Months) or Jan 2024 – Apr 2024"
                        className="rounded-xl h-9 text-xs font-bold text-indigo-900 border-indigo-300 bg-indigo-50/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Key Responsibilities & Deliverables
                    </label>
                    <textarea
                      rows={2}
                      value={exp.responsibilities.join("\n")}
                      onChange={(e) =>
                        updateExperience(
                          idx,
                          "responsibilities",
                          e.target.value.split("\n").filter((l) => l.trim().length > 0)
                        )
                      }
                      placeholder="• Built production-grade web applications with Next.js and Node.js&#10;• Engineered REST APIs and configured Nginx deployment on VPS"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs leading-relaxed focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Separate each bullet point on a new line.
                    </p>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addExperienceRow}
                className="w-full rounded-xl border-dashed border-slate-300 py-3 text-xs font-bold text-slate-700 hover:border-indigo-400 hover:text-indigo-600"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Another Role / Internship
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: NOTABLE PROJECTS WITH LIVE URLS */}
      {/* ========================================================================= */}
      {step === 4 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between rounded-xl bg-blue-50/70 p-3.5 border border-blue-200/80 text-xs text-blue-950">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-600 shrink-0" />
              <span>
                <strong>Recruiter Standard:</strong> Live deployed URLs (e.g. <em>https://myproject.com</em>) give you a 3x higher callback rate than code-only repos.
              </span>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={addProjectRow}
              className="rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 ml-3"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Project
            </Button>
          </div>

          {projectList.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
                <FolderGit2 className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Projects Added Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Add your deployed web apps, open-source repos, or client systems. Clickable links will be embedded directly in your InvoZone CV.
              </p>
              <Button
                type="button"
                onClick={addProjectRow}
                className="mt-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Your First Project
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {projectList.map((prj, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 relative group"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FolderGit2 className="h-4 w-4 text-blue-600" />
                      Project #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeProject(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Remove Project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Project Name
                      </label>
                      <Input
                        value={prj.name}
                        onChange={(e) => updateProject(idx, "name", e.target.value)}
                        placeholder="e.g. Cloud Deals Marketplace Platform"
                        className="rounded-xl h-9 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Your Role
                      </label>
                      <Input
                        value={prj.role}
                        onChange={(e) => updateProject(idx, "role", e.target.value)}
                        placeholder="e.g. Full Stack Developer & DevOps Lead"
                        className="rounded-xl h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-blue-700 block mb-1 flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Live Deployed URL (Clickable on CV)
                      </label>
                      <Input
                        value={prj.projectUrl}
                        onChange={(e) => updateProject(idx, "projectUrl", e.target.value)}
                        placeholder="https://myproject.com or https://234deals.com"
                        className="rounded-xl h-9 text-xs border-blue-200 bg-blue-50/20"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center gap-1">
                        <GitBranch className="h-3 w-3 text-slate-400" />
                        GitHub Repository URL
                      </label>
                      <Input
                        value={prj.githubUrl}
                        onChange={(e) => updateProject(idx, "githubUrl", e.target.value)}
                        placeholder="https://github.com/username/project"
                        className="rounded-xl h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Key Highlights & Architecture
                    </label>
                    <textarea
                      rows={2}
                      value={prj.responsibilities.join("\n")}
                      onChange={(e) =>
                        updateProject(
                          idx,
                          "responsibilities",
                          e.target.value.split("\n").filter((l) => l.trim().length > 0)
                        )
                      }
                      placeholder="• Engineered end-to-end architecture with Next.js, Node.js, and PostgreSQL&#10;• Implemented automated CI/CD and deployment on VPS container infrastructure"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs leading-relaxed focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addProjectRow}
                className="w-full rounded-xl border-dashed border-slate-300 py-3 text-xs font-bold text-slate-700 hover:border-indigo-400 hover:text-indigo-600"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Another Project
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: CATEGORIZED TECHNICAL SKILLS */}
      {/* ========================================================================= */}
      {step === 5 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-900 block">
                Selected Skills ({selectedSkills.length})
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                InvoZone CV layout categorizes these automatically into Frontend, Backend, Databases, and DevOps.
              </p>
            </div>

            {/* Custom skill adder */}
            <form onSubmit={handleAddCustomSkill} className="flex gap-2 shrink-0">
              <Input
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                placeholder="+ Add custom skill"
                className="rounded-xl h-8 text-xs w-44"
              />
              <Button type="submit" size="sm" className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white h-8">
                Add
              </Button>
            </form>
          </div>

          {/* Categorized presets */}
          <div className="space-y-4">
            {CATEGORIZED_SKILL_PRESETS.map((cat) => (
              <div key={cat.category} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                    {cat.category}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {cat.skills.filter((s) => selectedSkills.includes(s)).length} of {cat.skills.length} selected
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-xs scale-[1.02]"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {isSelected ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3 opacity-50" />}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BOTTOM NAVIGATION CONTROLS */}
      {/* ========================================================================= */}
      <div className="mt-8 pt-4 border-t border-slate-200/80 flex items-center justify-between">
        <div>
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStep(step - 1)}
              className="rounded-xl font-bold text-xs border-slate-300"
            >
              <ChevronLeft className="mr-1 h-3.5 w-3.5" />
              Back
            </Button>
          ) : (
            <span className="text-xs text-slate-400 font-medium">Step 1 of 5</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {step < 5 ? (
            <>
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                Skip this step
              </button>
              <Button
                type="button"
                size="sm"
                onClick={() => setStep(step + 1)}
                className="rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm px-4 h-9"
              >
                Continue
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <Button
              type="button"
              size="sm"
              disabled={saving}
              onClick={() => handleSaveAndFinish(false)}
              className="rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-500/25 px-5 h-9"
            >
              {saving ? "Generating Profile..." : "Complete & Generate InvoZone CV ✨"}
            </Button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RECRUITER & ATS GUIDANCE POPUP MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        title="💡 InvoZone Professional CV Guidance"
        description="Benchmark criteria extracted from authentic InvoZone executive resumes:"
      >
        <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed">
          <div className="rounded-xl bg-indigo-50/70 p-3.5 border border-indigo-100">
            <h4 className="font-bold text-indigo-950 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-indigo-600" />
              1. Time Periods Are Mandatory
            </h4>
            <p className="mt-1 text-indigo-900 text-[11px]">
              Top agencies and ATS systems filter candidates by duration. Always include explicit terms like <strong>&quot;(3 Months)&quot;</strong> or <strong>&quot;Jan 2024 – Apr 2024&quot;</strong>.
            </p>
          </div>

          <div className="rounded-xl bg-blue-50/70 p-3.5 border border-blue-100">
            <h4 className="font-bold text-blue-950 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-blue-600" />
              2. Live URLs Prove Real Engineering Capability
            </h4>
            <p className="mt-1 text-blue-900 text-[11px]">
              A clickable live deployment URL (e.g. <em>https://234deals.com</em>) immediately establishes trust and sets you apart from generic bootcamp candidates.
            </p>
          </div>

          <div className="rounded-xl bg-emerald-50/70 p-3.5 border border-emerald-100">
            <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-emerald-600" />
              3. Categorized Skills Taxonomy
            </h4>
            <p className="mt-1 text-emerald-900 text-[11px]">
              Never list 40 skills in one giant paragraph. Recruiters scan by <strong>Frontend</strong>, <strong>Backend</strong>, <strong>Databases</strong>, and <strong>DevOps & Cloud</strong>.
            </p>
          </div>

          <div className="rounded-xl bg-purple-50/70 p-3.5 border border-purple-100">
            <h4 className="font-bold text-purple-950 flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-purple-600" />
              4. Immediate Contact Directness
            </h4>
            <p className="mt-1 text-purple-900 text-[11px]">
              Direct phone/WhatsApp and active GitHub link must be visible right under your name in the contact header strip.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
