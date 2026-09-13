"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  Layers,
  FileText,
  Clock,
  ShieldCheck,
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
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "HTML5/CSS3", "JavaScript"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "Express.js", "REST APIs", "Python", "GraphQL", "Microservices"],
  },
  {
    category: "Databases",
    skills: ["PostgreSQL", "Sequelize ORM", "MongoDB", "MySQL", "Redis", "Prisma"],
  },
  {
    category: "DevOps & Cloud",
    skills: ["Docker", "Linux Administration", "CI/CD Automation", "Nginx", "VPS Management", "Git", "AWS"],
  },
  {
    category: "Mobile & Cloud Services",
    skills: ["React Native", "Cloudinary", "Twilio", "SendGrid", "Firebase"],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<number>(1);
  const [saving, setSaving] = React.useState<boolean>(false);
  const [helpModalOpen, setHelpModalOpen] = React.useState<boolean>(false);

  // Step 1: Personal & Contact Details
  const [fullName, setFullName] = React.useState("Muhammad Ali");
  const [headline, setHeadline] = React.useState("BS Computer Science Student | Full Stack Developer | DevOps Enthusiast");
  const [email, setEmail] = React.useState("aliofficialpk63@gmail.com");
  const [phone, setPhone] = React.useState("03020048966");
  const [location, setLocation] = React.useState("Lahore, Pakistan");
  const [githubUrl, setGithubUrl] = React.useState("github.com/aliofficialpk");
  const [linkedInUrl, setLinkedInUrl] = React.useState("linkedin.com/in/aliofficialpk");
  const [avatarUrl, setAvatarUrl] = React.useState("/images/default-avatar.jpg");
  const [bio, setBio] = React.useState(
    "Computer Science student with hands-on experience building, deploying, and maintaining production-grade web and mobile applications. Seeking a Software Engineering or DevOps role to contribute to real-world scalable products."
  );

  // Step 2: Education History
  const [educationList, setEducationList] = React.useState<EducationItem[]>([
    {
      degree: "BS Computer Science (BSCS)",
      institution: "NCBA&E",
      fieldOfStudy: "Computer Science",
      startDate: "2021",
      endDate: "2025",
      gpa: "3.4 / 4.0",
    },
  ]);

  // Step 3: Work Experience with exact Time Periods
  const [experienceList, setExperienceList] = React.useState<ExperienceItem[]>([
    {
      company: "UET Incubation Center",
      jobTitle: "MERN Stack Developer Intern",
      location: "Lahore, Pakistan",
      duration: "(3 Months)",
      responsibilities: [
        "Developed production web applications and backend microservices.",
        "Built responsive interfaces with Next.js, React, and REST APIs.",
      ],
      technologiesUsed: ["React", "Node.js", "Express.js", "MongoDB"],
    },
    {
      company: "ATechsole",
      jobTitle: "Web Development Intern",
      location: "Lahore, Pakistan",
      duration: "(3 Months)",
      responsibilities: [
        "Worked on client web projects, continuous deployments, and production maintenance.",
        "Assisted in server administration, database migrations, and CI/CD routines.",
      ],
      technologiesUsed: ["Next.js", "TypeScript", "PostgreSQL", "Docker", "Nginx"],
    },
  ]);

  // Step 4: Notable Projects with live URLs
  const [projectList, setProjectList] = React.useState<ProjectItem[]>([
    {
      name: "234Deals Marketplace Platform",
      role: "Full Stack Developer & DevOps Engineer",
      projectUrl: "https://234deals.com",
      githubUrl: "https://github.com/aliofficialpk",
      technologies: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
      responsibilities: [
        "Designed, developed, deployed, and maintained complete marketplace ecosystem across web, API, and cloud infrastructure.",
        "Built scalable REST APIs in Node.js and managed PostgreSQL with Sequelize ORM.",
        "Implemented authentication, security controls, Cloudinary file uploads, and Twilio/SendGrid integration.",
      ],
    },
    {
      name: "2Techsole Platform",
      role: "Full Stack Developer",
      projectUrl: "https://2techsole.page",
      githubUrl: "",
      technologies: ["React", "Tailwind CSS", "Node.js"],
      responsibilities: ["Engineered client-facing landing experience and booking portal."],
    },
  ]);

  // Step 5: Core Technical Skills
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Express.js",
    "PostgreSQL",
    "Sequelize ORM",
    "Docker",
    "Linux Administration",
    "CI/CD Automation",
    "Nginx",
    "REST APIs",
    "React Native",
  ]);
  const [customSkillInput, setCustomSkillInput] = React.useState("");

  // Populate InvoZone Sample Data
  const loadMuhammadAliData = () => {
    setFullName("Muhammad Ali");
    setHeadline("BS Computer Science Student | Full Stack Developer | DevOps Enthusiast");
    setEmail("aliofficialpk63@gmail.com");
    setPhone("03020048966");
    setLocation("Lahore, Pakistan");
    setGithubUrl("github.com/aliofficialpk");
    setLinkedInUrl("linkedin.com/in/aliofficialpk");
    setBio(
      "Computer Science student at NCBA&E with hands-on experience building, deploying, and maintaining production-grade web and mobile applications. Experienced in full-stack development, cloud infrastructure, and DevOps operations."
    );
    setEducationList([
      {
        degree: "BS Computer Science (BSCS)",
        institution: "NCBA&E",
        fieldOfStudy: "Computer Science",
        startDate: "2021",
        endDate: "2025",
        gpa: "3.4 / 4.0",
      },
    ]);
    setExperienceList([
      {
        company: "UET Incubation Center",
        jobTitle: "MERN Stack Developer Intern",
        location: "Lahore, Pakistan",
        duration: "(3 Months)",
        responsibilities: [
          "Developed web applications and backend services.",
          "Implemented authentication, state management, and REST endpoints.",
        ],
        technologiesUsed: ["React", "Node.js", "Express.js", "MongoDB"],
      },
      {
        company: "ATechsole",
        jobTitle: "Web Development Intern",
        location: "Lahore, Pakistan",
        duration: "(3 Months)",
        responsibilities: [
          "Worked on client projects, deployments, and production maintenance.",
          "Configured Nginx web servers and automated deployment pipelines.",
        ],
        technologiesUsed: ["Next.js", "TypeScript", "PostgreSQL", "Docker", "Nginx"],
      },
    ]);
    setProjectList([
      {
        name: "234Deals Marketplace Platform",
        role: "Full Stack Developer & DevOps Engineer",
        projectUrl: "https://234deals.com",
        githubUrl: "https://github.com/aliofficialpk",
        technologies: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
        responsibilities: [
          "Designed, developed, deployed, and maintained the complete marketplace ecosystem including website, backend APIs, and cloud infrastructure.",
          "Built scalable REST APIs using Node.js and Express.js with PostgreSQL & Sequelize ORM.",
          "Implemented auth, file management, email/SMS services, server monitoring, and platform maintenance.",
        ],
      },
      {
        name: "2Techsole",
        role: "Full Stack Developer",
        projectUrl: "https://2techsole.page",
        githubUrl: "",
        technologies: ["React", "Tailwind CSS", "Node.js"],
        responsibilities: ["Delivered responsive business platform with fast loading performance."],
      },
      {
        name: "2DBite Application",
        role: "Full Stack Developer",
        projectUrl: "https://2dbite-frontend.vercel.app",
        githubUrl: "",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
        responsibilities: ["Built full-stack ordering and interactive menu interfaces."],
      },
    ]);
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

  // Education Helpers
  const addEducationRow = () => {
    setEducationList([
      ...educationList,
      { degree: "Bachelor of Science", institution: "University Name", fieldOfStudy: "Computer Science", startDate: "2021", endDate: "2025" },
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
        company: "Company / Agency",
        jobTitle: "Software Engineer",
        location: "Remote",
        duration: "Jan 2024 – Present",
        responsibilities: ["Developed core features and maintained client production services."],
        technologiesUsed: ["Next.js", "Node.js"],
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
        name: "New Software Project",
        role: "Full Stack Engineer",
        projectUrl: "https://myproject.com",
        githubUrl: "",
        technologies: ["React", "TypeScript", "Node.js"],
        responsibilities: ["Engineered complete application architecture and deployed to production."],
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
            fullName,
            email,
            phone,
            location,
            linkedInUrl,
            githubUrl,
            careerField: "Software Engineering & DevOps",
            targetRole: headline.split("|")[0]?.trim() || "Full Stack Developer",
            avatarUrl,
            bio,
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

  return (
    <div className="w-full max-w-4xl mx-auto py-3 px-2 sm:px-4">
      {/* Top Header & Steps */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-sm">
              {step}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Step {step} of 5 • InvoZone Professional CV Setup
            </span>
          </div>
          <h1 className="mt-1 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            {step === 1 && "Personal Identity & Contact Bar"}
            {step === 2 && "Education & Academic History"}
            {step === 3 && "Work Experience & Internships"}
            {step === 4 && "Key Projects & Live Deployments"}
            {step === 5 && "Core Technical Stack & Categorized Skills"}
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            {step === 1 && "Recruiter-standard contact info, phone, and direct GitHub links."}
            {step === 2 && "Degrees, institutions, and expected graduation time periods."}
            {step === 3 && "Companies, internships, and exact durations (e.g. 3 Months or Jan - Apr)."}
            {step === 4 && "Showcase production systems with live URLs and GitHub repositories."}
            {step === 5 && "Categorized skills like InvoZone standard (Frontend, Backend, DevOps, etc.)."}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setHelpModalOpen(true)}
            className="rounded-xl border-indigo-200 text-xs font-semibold text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100"
          >
            <HelpCircle className="h-3.5 w-3.5 mr-1" />
            Tips & Guide
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSaveAndFinish(true)}
            className="rounded-xl border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Skip to Dashboard
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Visual Step Progress */}
      <div className="mb-6 grid grid-cols-5 gap-1.5">
        {[
          { id: 1, label: "Identity" },
          { id: 2, label: "Education" },
          { id: 3, label: "Experience" },
          { id: 4, label: "Projects" },
          { id: 5, label: "Skills" },
        ].map((s) => (
          <div key={s.id} className="space-y-1 text-center">
            <div
              className={`h-2 rounded-full transition-all ${
                s.id <= step ? "bg-indigo-600 shadow-xs" : "bg-slate-200"
              }`}
            />
            <span className="text-[10px] font-bold text-slate-500 hidden sm:block">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Quick Sample Button (Always available on Step 1) */}
      {step === 1 && (
        <div className="mb-6 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              InvoZone Professional Template Quick-Fill
            </span>
            <p className="text-xs text-indigo-700 mt-0.5">
              Instantly populate all steps with the authentic <strong>Muhammad Ali (BSCS / InvoZone Standard)</strong> CV dataset.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={loadMuhammadAliData}
            className="rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shrink-0"
          >
            ⚡ Load Muhammad Ali CV
          </Button>
        </div>
      )}

      {/* STEP 1: IDENTITY & CONTACT BAR */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
            {/* Left: Avatar & Candidate Photo */}
            <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs">
              <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-full ring-4 ring-indigo-100 shadow-md">
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              </div>
              <span className="text-xs font-bold text-slate-900">Professional Photo</span>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Displays on InvoZone-standard CV and executive profile header.
              </p>

              <label className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">
                <Upload className="h-3.5 w-3.5 text-slate-500" />
                Upload Photo
                <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
              </label>
            </div>

            {/* Right: Contact Fields */}
            <div className="sm:col-span-2 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1">Full Name</label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Muhammad Ali"
                    className="rounded-xl h-10 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1">Location / City</label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Lahore, Pakistan"
                    className="rounded-xl h-10"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 text-xs block mb-1">Professional Headline</label>
                <Input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. BS Computer Science Student | Full Stack Developer | DevOps Enthusiast"
                  className="rounded-xl h-10 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1">Email Address</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. aliofficialpk63@gmail.com"
                    className="rounded-xl h-10"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1">Phone / WhatsApp</label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 03020048966"
                    className="rounded-xl h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1">GitHub Profile / URL</label>
                  <Input
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="e.g. github.com/aliofficialpk"
                    className="rounded-xl h-10"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1">LinkedIn Profile / URL</label>
                  <Input
                    value={linkedInUrl}
                    onChange={(e) => setLinkedInUrl(e.target.value)}
                    placeholder="e.g. linkedin.com/in/aliofficialpk"
                    className="rounded-xl h-10"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 text-xs block mb-1">Profile Summary</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Concise summary highlighting hands-on stack, infrastructure skills, and target role..."
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: EDUCATION HISTORY */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Academic Degrees & Certifications ({educationList.length})
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEducationRow}
              className="rounded-xl text-xs font-semibold text-indigo-600 border-indigo-200 hover:bg-indigo-50"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Another Degree
            </Button>
          </div>

          <div className="space-y-3">
            {educationList.map((edu, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-indigo-600" />
                    Degree Entry #{idx + 1}
                  </span>
                  {educationList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEducation(idx)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-lg"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Degree Title / Program
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
                      placeholder="e.g. NCBA&E / FAST NUCES / COMSATS"
                      className="rounded-xl h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Start Year</label>
                    <Input
                      value={edu.startDate}
                      onChange={(e) => updateEducation(idx, "startDate", e.target.value)}
                      placeholder="2021"
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
                      placeholder="2025"
                      className="rounded-xl h-9 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">CGPA (Optional)</label>
                    <Input
                      value={edu.gpa || ""}
                      onChange={(e) => updateEducation(idx, "gpa", e.target.value)}
                      placeholder="3.4 / 4.0"
                      className="rounded-xl h-9 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: WORK EXPERIENCE WITH EXACT TIME PERIODS */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Work Experience & Internships ({experienceList.length})
              </span>
              <p className="text-[11px] text-slate-500">
                Include company, role, and exact time period (e.g. &quot;3 Months&quot; or &quot;Jan 2024 - Present&quot;).
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addExperienceRow}
              className="rounded-xl text-xs font-semibold text-indigo-600 border-indigo-200 hover:bg-indigo-50"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Experience
            </Button>
          </div>

          <div className="space-y-3.5">
            {experienceList.map((exp, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-indigo-600" />
                    Role #{idx + 1}: {exp.jobTitle} at {exp.company}
                  </span>
                  {experienceList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-lg"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Company / Organization</label>
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(idx, "company", e.target.value)}
                      placeholder="e.g. UET Incubation Center"
                      className="rounded-xl h-9 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Job Title / Role</label>
                    <Input
                      value={exp.jobTitle}
                      onChange={(e) => updateExperience(idx, "jobTitle", e.target.value)}
                      placeholder="e.g. MERN Stack Developer Intern"
                      className="rounded-xl h-9 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Time Period / Duration
                    </label>
                    <Input
                      value={exp.duration}
                      onChange={(e) => updateExperience(idx, "duration", e.target.value)}
                      placeholder="e.g. (3 Months) or Jan 2024 - Apr 2024"
                      className="rounded-xl h-9 text-xs text-indigo-700 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Key Deliverables & Responsibilities (1 per line)
                  </label>
                  <textarea
                    rows={2}
                    value={exp.responsibilities.join("\n")}
                    onChange={(e) => updateExperience(idx, "responsibilities", e.target.value.split("\n"))}
                    placeholder="Developed web applications and backend services..."
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: KEY PROJECTS & DEPLOYMENTS */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Notable Engineering Projects & Demos ({projectList.length})
              </span>
              <p className="text-[11px] text-slate-500">
                Live URLs, architecture bullets, and technologies used.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addProjectRow}
              className="rounded-xl text-xs font-semibold text-indigo-600 border-indigo-200 hover:bg-indigo-50"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Project
            </Button>
          </div>

          <div className="space-y-3.5">
            {projectList.map((proj, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                    <FolderGit2 className="h-4 w-4 text-indigo-600" />
                    Project #{idx + 1}: {proj.name}
                  </span>
                  {projectList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProject(idx)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-lg"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Project Name</label>
                    <Input
                      value={proj.name}
                      onChange={(e) => updateProject(idx, "name", e.target.value)}
                      placeholder="e.g. 234Deals Marketplace Platform"
                      className="rounded-xl h-9 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Your Role</label>
                    <Input
                      value={proj.role}
                      onChange={(e) => updateProject(idx, "role", e.target.value)}
                      placeholder="e.g. Full Stack & DevOps Engineer"
                      className="rounded-xl h-9 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Live URL / Demo Link</label>
                    <Input
                      value={proj.projectUrl}
                      onChange={(e) => updateProject(idx, "projectUrl", e.target.value)}
                      placeholder="https://2techsole.page"
                      className="rounded-xl h-9 text-xs text-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Architectural & Engineering Bullets (1 per line)
                  </label>
                  <textarea
                    rows={3}
                    value={proj.responsibilities.join("\n")}
                    onChange={(e) => updateProject(idx, "responsibilities", e.target.value.split("\n"))}
                    placeholder="Designed, developed, deployed, and maintained the ecosystem..."
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 5: CATEGORIZED CORE SKILLS */}
      {step === 5 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Categorized Technical Stack ({selectedSkills.length} selected)
            </span>
            <span className="text-xs text-indigo-600 font-semibold">
              InvoZone Industry Standard Taxonomy
            </span>
          </div>

          <div className="space-y-4">
            {CATEGORIZED_SKILL_PRESETS.map((group) => (
              <div key={group.category} className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-600" />
                  {group.category}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {group.skills.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-2xs"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {isSelected && "✓ "}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Custom Skill Adder */}
          <form onSubmit={handleAddCustomSkill} className="flex gap-2">
            <Input
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              placeholder="Add other skills (e.g. Terraform, GraphQL, Socket.io)..."
              className="rounded-xl h-10"
            />
            <Button
              type="submit"
              variant="outline"
              className="rounded-xl font-bold text-indigo-600 border-indigo-200 hover:bg-indigo-50"
            >
              + Add
            </Button>
          </form>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
        <div>
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="gap-1 rounded-xl font-semibold border-slate-300"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleSaveAndFinish(true)}
              className="text-xs text-slate-400 hover:text-slate-700"
            >
              Skip Setup for now
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {step < 5 ? (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(step + 1)}
                className="text-xs text-slate-500 hover:text-slate-900"
              >
                Skip this step
              </Button>
              <Button
                type="button"
                onClick={() => setStep(step + 1)}
                className="gap-1 rounded-xl bg-indigo-600 px-5 font-bold text-white shadow-sm hover:bg-indigo-700"
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
              className="gap-2 rounded-xl bg-emerald-600 px-6 font-bold text-white shadow-md hover:bg-emerald-700"
            >
              {saving ? "Generating Profile..." : "Launch InvoZone-Standard CV 🚀"}
            </Button>
          )}
        </div>
      </div>

      {/* Custom Help & Guidance Popup Modal */}
      <Modal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        title="💡 Step-by-Step Professional CV Guidance"
        description="Tips derived from agency-standard CV formats (e.g. InvoZone, Turing, Toptal)."
      >
        <div className="space-y-4 text-xs text-slate-700">
          <div className="rounded-xl bg-indigo-50/60 border border-indigo-100 p-3.5 space-y-1.5">
            <h4 className="font-bold text-indigo-900 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              1. Contact Bar & Headings
            </h4>
            <p className="leading-relaxed text-slate-600">
              Recruiters spend an average of 6 seconds on a CV. A bold name followed by a targeted headline (e.g. <em>&quot;Full Stack Developer | DevOps Enthusiast&quot;</em>) and quick links to GitHub and Phone number immediately builds trust.
            </p>
          </div>

          <div className="rounded-xl bg-emerald-50/60 border border-emerald-100 p-3.5 space-y-1.5">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-emerald-600" />
              2. Time Periods for Internships & Work
            </h4>
            <p className="leading-relaxed text-slate-600">
              Always state durations clearly (e.g. <em>&quot;(3 Months)&quot;</em> or <em>&quot;Jan 2024 – Apr 2024&quot;</em>). Explicit dates reassure recruiters and satisfy ATS parsing filters.
            </p>
          </div>

          <div className="rounded-xl bg-amber-50/60 border border-amber-100 p-3.5 space-y-1.5">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-amber-600" />
              3. Live URLs on Projects
            </h4>
            <p className="leading-relaxed text-slate-600">
              Including live links like <em>https://2techsole.page</em> or active GitHub repos proves your skills are production-ready and tangible.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              variant="primary"
              onClick={() => setHelpModalOpen(false)}
              className="rounded-xl bg-indigo-600 text-xs font-bold"
            >
              Got it, continue setup
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
