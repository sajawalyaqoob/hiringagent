"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
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
  Share2,
  Plus,
  Trash2,
  HelpCircle,
  ArrowRight,
  Camera,
  FileText,
  User,
  Info,
  Stethoscope,
  Building,
  Calculator,
  Scale,
  Palette,
  Megaphone,
  BookOpen,
  Wrench,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { CAREER_DOMAINS, getDomainById, type CareerDomain } from "@/lib/config/domains";

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

const PRESET_AVATARS = [
  { id: "exec-1", label: "Professional 1", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&h=256&fit=crop&crop=faces" },
  { id: "exec-2", label: "Professional 2", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=faces" },
  { id: "exec-3", label: "Professional 3", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&h=256&fit=crop&crop=faces" },
  { id: "exec-4", label: "Professional 4", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop&crop=faces" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [step, setStep] = React.useState<number>(1);
  const [saving, setSaving] = React.useState<boolean>(false);
  const [helpModalOpen, setHelpModalOpen] = React.useState<boolean>(false);
  const [isDragging, setIsDragging] = React.useState<boolean>(false);

  // Domain Selection
  const [selectedDomainId, setSelectedDomainId] = React.useState<string>("cs_it");
  const [customDomainInput, setCustomDomainInput] = React.useState<string>("");

  // Step 1: Personal & Contact Details
  const [fullName, setFullName] = React.useState("");
  const [headline, setHeadline] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [targetRole, setTargetRole] = React.useState("");
  const [githubUrl, setGithubUrl] = React.useState("");
  const [linkedInUrl, setLinkedInUrl] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState("");
  const [bio, setBio] = React.useState("");

  // Step 2: Education History
  const [educationList, setEducationList] = React.useState<EducationItem[]>([]);

  // Step 3: Work Experience with exact Time Periods
  const [experienceList, setExperienceList] = React.useState<ExperienceItem[]>([]);

  // Step 4: Notable Projects / Portfolio Items
  const [projectList, setProjectList] = React.useState<ProjectItem[]>([]);

  // Step 5: Core Domain & Field Skills
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = React.useState("");

  // Current domain object
  const activeDomain = getDomainById(selectedDomainId);

  // Handle domain change
  const handleDomainSelect = (domainId: string) => {
    setSelectedDomainId(domainId);
    const domain = getDomainById(domainId);

    // Pre-fill smart domain defaults if user hasn't typed custom ones yet
    if (!headline || CAREER_DOMAINS.some((d) => d.defaultHeadline === headline)) {
      setHeadline(domain.defaultHeadline);
    }
    if (!targetRole || CAREER_DOMAINS.some((d) => d.defaultJobTitle === targetRole)) {
      setTargetRole(domain.defaultJobTitle);
    }
  };

  // Hydrate existing user/profile data if already logged in
  React.useEffect(() => {
    async function loadInitialProfile() {
      try {
        const [profRes, authRes] = await Promise.all([
          fetch("/api/profile").then((r) => r.json()).catch(() => null),
          fetch("/api/auth").then((r) => r.json()).catch(() => null),
        ]);

        const loggedInUser = authRes?.user;
        if (loggedInUser) {
          if (loggedInUser.name) setFullName((prev) => prev || loggedInUser.name);
          if (loggedInUser.email) setEmail((prev) => prev || loggedInUser.email);
        }

        if (profRes?.success && profRes.data?.profile) {
          const p = profRes.data.profile;
          if (p.fullName && p.fullName !== "Candidate") setFullName(p.fullName);
          if (p.email) setEmail(p.email);
          if (p.phone) setPhone(p.phone);
          if (p.location) setLocation(p.location);
          if (p.professionalHeadline) setHeadline(p.professionalHeadline);
          if (p.currentJobTitle) setTargetRole(p.currentJobTitle);
          if (p.industry) setSelectedDomainId(p.industry);
          if (p.githubUrl) setGithubUrl(p.githubUrl);
          if (p.linkedInUrl) setLinkedInUrl(p.linkedInUrl);
          if (p.avatarUrl) setAvatarUrl(p.avatarUrl);
          if (p.bio) setBio(p.bio);

          if (Array.isArray(profRes.data.education) && profRes.data.education.length > 0) {
            setEducationList(profRes.data.education);
          }
          if (Array.isArray(profRes.data.experiences) && profRes.data.experiences.length > 0) {
            setExperienceList(profRes.data.experiences);
          }
          if (Array.isArray(profRes.data.projects) && profRes.data.projects.length > 0) {
            setProjectList(profRes.data.projects);
          }
          if (Array.isArray(profRes.data.skills) && profRes.data.skills.length > 0) {
            setSelectedSkills(profRes.data.skills.map((s: any) => (typeof s === "string" ? s : s.name)));
          }
        }
      } catch (err) {
        console.warn("Failed to load initial profile data:", err);
      }
    }
    loadInitialProfile();
  }, []);

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
    if (file) handleImageFile(file);
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
    if (file) handleImageFile(file);
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAvatarUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
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

  // Save Everything to Database via API
  const handleSaveAndFinish = async (skip = false) => {
    setSaving(true);
    try {
      if (!skip) {
        const domainLabel =
          selectedDomainId === "custom_field" && customDomainInput.trim()
            ? customDomainInput.trim()
            : activeDomain.label;

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
            careerField: domainLabel,
            targetRole: targetRole.trim() || activeDomain.defaultJobTitle,
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
    { id: 1, label: "Field & Identity", icon: User },
    { id: 2, label: "Education", icon: GraduationCap },
    { id: 3, label: "Work History", icon: Briefcase },
    { id: 4, label: "Projects / Portfolio", icon: FolderGit2 },
    { id: 5, label: "Domain Skills", icon: Cpu },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-2 sm:px-4">
      {/* Hidden File Input for Photo Upload */}
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
              Step {step} of 5 • Personalized Professional Setup
            </span>
          </div>
          <h1 className="mt-1.5 text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            {step === 1 && "Choose Your Professional Field & Personal Details"}
            {step === 2 && "Education & Academic Credentials"}
            {step === 3 && "Work Experience & Time Periods"}
            {step === 4 && "Key Projects, Portfolio & Case Studies"}
            {step === 5 && `Calibrated Skills for ${activeDomain.label}`}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {step === 1 && "Select your exact domain (CS, Medical/Doctor, Engineering, Accounting, Humanities, Law, Design, etc.)"}
            {step === 2 && "Formal degrees, universities, and graduation timelines."}
            {step === 3 && "Include exact time periods (e.g. (3 Months) or dates) for recruiter screening."}
            {step === 4 && "Highlight major initiatives, publications, or live project links."}
            {step === 5 && "Select or add primary competencies matched to your domain."}
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
      {/* STEP 1: DOMAIN SELECTOR & PERSONAL DETAILS */}
      {/* ========================================================================= */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Domain Selection Grid */}
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/50 via-white to-violet-50/40 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-black text-slate-900">
                Select Your Professional Career Domain / Field <span className="text-rose-500">*</span>
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Personalizes your entire platform experience, AI resume generation, and profile evaluation.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1">
              {CAREER_DOMAINS.map((domain) => {
                const isSelected = selectedDomainId === domain.id;
                return (
                  <button
                    key={domain.id}
                    type="button"
                    onClick={() => handleDomainSelect(domain.id)}
                    className={`rounded-xl p-3 text-left transition-all border cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-indigo-600 bg-white shadow-xs ring-2 ring-indigo-500/20"
                        : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xl">{domain.icon}</span>
                      {isSelected && <Check className="h-4 w-4 text-indigo-600 font-bold" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">{domain.label}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedDomainId === "custom_field" && (
              <div className="pt-2">
                <label className="text-xs font-bold text-slate-800 block mb-1">Specify Custom Field</label>
                <Input
                  value={customDomainInput}
                  onChange={(e) => setCustomDomainInput(e.target.value)}
                  placeholder="e.g. Aviation, Molecular Biology, Environmental Policy"
                  className="rounded-xl h-10 text-xs"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Photo Upload Card */}
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
              <div className="relative mb-3.5 h-28 w-28 overflow-hidden rounded-full ring-4 ring-indigo-500/20 shadow-md group-hover:ring-indigo-500/40 transition-all bg-slate-100 flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Uploaded Avatar" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-slate-400 stroke-[1.5]" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                  <Camera className="h-6 w-6 mb-1" />
                  <span className="text-[10px] font-bold">{avatarUrl ? "Change" : "Upload"}</span>
                </div>
              </div>

              <span className="text-xs font-bold text-slate-900">
                {avatarUrl ? "Photo Uploaded" : "Upload Profile Photo"}
              </span>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] leading-relaxed">
                Click or drag & drop. High-res JPG, PNG, or WebP up to 5MB.
              </p>

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
                    className="rounded-xl text-xs text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
            </div>

            {/* Personal Info Form */}
            <div className="md:col-span-2 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1.5">
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
                  <label className="font-bold text-slate-800 text-xs block mb-1.5">
                    Location / City <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. New York, NY or Remote"
                    className="rounded-xl h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1.5">
                    Target Role / Job Title <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder={`e.g. ${activeDomain.defaultJobTitle}`}
                    className="rounded-xl h-10"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1.5">
                    Professional Headline <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder={`e.g. ${activeDomain.defaultHeadline}`}
                    className="rounded-xl h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1.5">
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
                  <label className="font-bold text-slate-800 text-xs block mb-1.5">
                    Phone / Contact Number <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 234-5678"
                    className="rounded-xl h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1.5">
                    LinkedIn Profile URL
                  </label>
                  <Input
                    value={linkedInUrl}
                    onChange={(e) => setLinkedInUrl(e.target.value)}
                    placeholder="linkedin.com/in/username"
                    className="rounded-xl h-10"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1.5">
                    GitHub / Portfolio / Website URL
                  </label>
                  <Input
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="github.com/username or portfolio.com"
                    className="rounded-xl h-10"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 text-xs block mb-1.5">
                  Executive Profile Summary
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={`Describe your background, core capabilities in ${activeDomain.label}, and what value you bring...`}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs leading-relaxed focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
            >
              <span>Next: Add Education</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: EDUCATION */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between rounded-xl bg-indigo-50/60 p-3.5 border border-indigo-100 text-xs text-indigo-900">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>
                List your formal degrees, professional diplomas, or academic certifications.
              </span>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={addEducationRow}
              className="rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 ml-3"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Qualification
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
                Add Your Qualification
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {educationList.map((edu, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-indigo-600" />
                      Degree / Qualification #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeEducation(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Degree / Qualification Title
                      </label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                        placeholder="e.g. Bachelor of Science / MBBS / CPA / MBA"
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
                        placeholder="e.g. Stanford University or Medical College"
                        className="rounded-xl h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Start Year</label>
                      <Input
                        value={edu.startDate}
                        onChange={(e) => updateEducation(idx, "startDate", e.target.value)}
                        placeholder="e.g. 2020"
                        className="rounded-xl h-9 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Graduation Year</label>
                      <Input
                        value={edu.endDate}
                        onChange={(e) => updateEducation(idx, "endDate", e.target.value)}
                        placeholder="e.g. 2024"
                        className="rounded-xl h-9 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">GPA / Honors</label>
                      <Input
                        value={edu.gpa || ""}
                        onChange={(e) => updateEducation(idx, "gpa", e.target.value)}
                        placeholder="e.g. 3.8 / 4.0 or Distinction"
                        className="rounded-xl h-9 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="rounded-xl font-bold text-xs"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button
              type="button"
              onClick={() => setStep(3)}
              className="rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
            >
              <span>Next: Work History</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: WORK HISTORY */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between rounded-xl bg-indigo-50/60 p-3.5 border border-indigo-100 text-xs text-indigo-900">
            <span>
              Include exact time periods (e.g. <em>&quot;(3 Months)&quot;</em> or start/end dates) to optimize recruiter screening.
            </span>
            <Button
              type="button"
              size="sm"
              onClick={addExperienceRow}
              className="rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 ml-3"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Work History
            </Button>
          </div>

          {experienceList.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
              <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Experience Added Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Add your employment history, clinical residency, or project roles.
              </p>
              <Button
                type="button"
                onClick={addExperienceRow}
                className="mt-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Position
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {experienceList.map((exp, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-emerald-600" />
                      Experience Entry #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Company / Organization / Hospital
                      </label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(idx, "company", e.target.value)}
                        placeholder="e.g. Apex Health / Vanguard Corp"
                        className="rounded-xl h-9 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Job Title / Position
                      </label>
                      <Input
                        value={exp.jobTitle}
                        onChange={(e) => updateExperience(idx, "jobTitle", e.target.value)}
                        placeholder={`e.g. ${activeDomain.defaultJobTitle}`}
                        className="rounded-xl h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Duration / Time Period
                      </label>
                      <Input
                        value={exp.duration}
                        onChange={(e) => updateExperience(idx, "duration", e.target.value)}
                        placeholder="e.g. (3 Months) or Jan 2023 - Present"
                        className="rounded-xl h-9 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Location</label>
                      <Input
                        value={exp.location}
                        onChange={(e) => updateExperience(idx, "location", e.target.value)}
                        placeholder="e.g. New York, NY (Remote)"
                        className="rounded-xl h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Responsibilities & Key Deliverables
                    </label>
                    <textarea
                      rows={3}
                      value={Array.isArray(exp.responsibilities) ? exp.responsibilities.join("\n") : exp.responsibilities}
                      onChange={(e) => updateExperience(idx, "responsibilities", e.target.value.split("\n"))}
                      placeholder="Bullet points describing your duties, accomplishments, and metrics..."
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(2)}
              className="rounded-xl font-bold text-xs"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button
              type="button"
              onClick={() => setStep(4)}
              className="rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
            >
              <span>Next: Projects & Portfolio</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: PROJECTS / PORTFOLIO */}
      {step === 4 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between rounded-xl bg-indigo-50/60 p-3.5 border border-indigo-100 text-xs text-indigo-900">
            <span>
              Add key projects, publications, clinical research, or portfolio links matching {activeDomain.label}.
            </span>
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
              <div className="h-12 w-12 rounded-full bg-violet-50 flex items-center justify-center text-violet-600 mb-3">
                <FolderGit2 className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Projects Added Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Optional: Add key highlighted projects or case studies to strengthen your profile score.
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
              {projectList.map((proj, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FolderGit2 className="h-4 w-4 text-violet-600" />
                      Project Entry #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeProject(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
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
                        value={proj.name}
                        onChange={(e) => updateProject(idx, "name", e.target.value)}
                        placeholder="e.g. Clinical Telehealth App / Financial Audit Initiative"
                        className="rounded-xl h-9 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Your Role
                      </label>
                      <Input
                        value={proj.role}
                        onChange={(e) => updateProject(idx, "role", e.target.value)}
                        placeholder="e.g. Lead Author / Auditor / Lead Architect"
                        className="rounded-xl h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Project or Case Study URL
                    </label>
                    <Input
                      value={proj.projectUrl}
                      onChange={(e) => updateProject(idx, "projectUrl", e.target.value)}
                      placeholder="https://example.com/project"
                      className="rounded-xl h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Key Highlights & Impact
                    </label>
                    <textarea
                      rows={2}
                      value={Array.isArray(proj.responsibilities) ? proj.responsibilities.join("\n") : proj.responsibilities}
                      onChange={(e) => updateProject(idx, "responsibilities", e.target.value.split("\n"))}
                      placeholder="Bullet points summarizing technical details or outcome..."
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(3)}
              className="rounded-xl font-bold text-xs"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button
              type="button"
              onClick={() => setStep(5)}
              className="rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
            >
              <span>Next: Domain Skills</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5: DOMAIN SKILLS */}
      {step === 5 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-2xl border border-indigo-100 bg-white p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Select Competencies for {activeDomain.label}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click skills to toggle them into your profile.
                </p>
              </div>
              <Badge variant="success" className="font-bold">
                {selectedSkills.length} Selected
              </Badge>
            </div>

            {/* Presets by Category */}
            <div className="space-y-4">
              {activeDomain.presetSkills.map((cat, cIdx) => (
                <div key={cIdx} className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    {cat.category}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill) => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
                            isSelected
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                          <span>{skill}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Skill Input */}
            <form onSubmit={handleAddCustomSkill} className="pt-3 border-t border-slate-100 flex gap-2">
              <Input
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                placeholder="Add any custom skill, tool, or certification..."
                className="rounded-xl h-10 text-xs flex-1"
              />
              <Button type="submit" variant="outline" className="rounded-xl font-bold text-xs h-10 shrink-0">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Skill
              </Button>
            </form>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(4)}
              className="rounded-xl font-bold text-xs"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button
              type="button"
              onClick={() => handleSaveAndFinish(false)}
              isLoading={saving}
              className="rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 shadow-md px-6 h-10"
            >
              <Check className="h-4 w-4" />
              <span>Complete Setup & Save to Database</span>
            </Button>
          </div>
        </div>
      )}

      {/* Help Modal */}
      <Modal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        title="💡 Professional Setup Tips"
        description="Follow these guidelines to optimize your profile for ATS scanners and recruiter screening:"
      >
        <div className="space-y-3 text-xs text-slate-700">
          <p>• <strong>Select Your True Domain:</strong> Setting your domain ensures Groq AI uses appropriate terminology (e.g. medical protocols for doctors, GAAP for accountants).</p>
          <p>• <strong>Specify Time Periods:</strong> Include explicit timelines like <em>(3 Months)</em> or exact years to pass recruiter screening.</p>
          <p>• <strong>Add Project Links:</strong> Adding portfolio or case study URLs boosts your profile completeness score significantly.</p>
          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" onClick={() => setHelpModalOpen(false)} className="rounded-xl text-xs font-bold bg-indigo-600">
              Got It
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
