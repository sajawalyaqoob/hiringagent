export const siteConfig = {
  name: "TalentForge AI",
  shortName: "TalentForge",
  tagline: "Autonomous Career Architecture & Executive-Standard Application Suite",
  description:
    "An AI-powered career agent that analyzes your professional experience, matches your skills to market opportunities, and generates executive-standard applications.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://talentforge.ai",
  ogImage: "https://talentforge.ai/og-image.png",
  links: {
    github: "https://github.com/sajawalyaqoob/hiringagent",
    twitter: "https://twitter.com/talentforgeai",
    linkedin: "https://linkedin.com/company/talentforge-ai",
  },
  contact: {
    email: "support@talentforge.ai",
  },
  creator: "TalentForge AI Architecture Team",
};

export const navConfig = {
  marketing: [
    { title: "Features", href: "/features" },
    { title: "Pricing", href: "/pricing" },
    { title: "About", href: "/about" },
  ],
  dashboard: [
    { title: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
    { title: "Career Profile", href: "/dashboard/profile", icon: "UserCircle" },
    { title: "Resumes", href: "/dashboard/resume", icon: "FileText" },
    { title: "Job Matches", href: "/dashboard/jobs", icon: "Briefcase" },
    { title: "Applications", href: "/dashboard/applications", icon: "Kanban" },
    { title: "AI Studio", href: "/dashboard/create", icon: "Sparkles" },
    { title: "Settings", href: "/dashboard/settings", icon: "Settings" },
  ],
};
