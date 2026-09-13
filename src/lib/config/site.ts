export const siteConfig = {
  name: "HireBoost AI",
  shortName: "HireBoost",
  tagline: "Turn Every Job Opportunity Into Your Best Application",
  description:
    "An AI-powered job-search and job-application assistant that analyzes your professional experience, matches your skills to market opportunities, and generates tailored applications.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://hireboost.ai",
  ogImage: "https://hireboost.ai/og-image.png",
  links: {
    github: "https://github.com/hireboost-ai",
    twitter: "https://twitter.com/hireboostai",
    linkedin: "https://linkedin.com/company/hireboost-ai",
  },
  contact: {
    email: "support@hireboost.ai",
  },
  creator: "HireBoost AI Architecture Team",
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
