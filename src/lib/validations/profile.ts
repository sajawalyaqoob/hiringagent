import { z } from "zod";

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  professionalHeadline: z.string().min(3, "Headline is required (e.g. Senior Full-Stack Engineer)"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  location: z.string().min(2, "Location is required (e.g. Seattle, WA or Remote)"),
  linkedInUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  portfolioUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const professionalInfoSchema = z.object({
  currentJobTitle: z.string().min(2, "Current job title is required"),
  yearsOfExperience: z.coerce.number().min(0, "Years of experience cannot be negative"),
  industry: z.string().min(2, "Industry is required"),
  careerLevel: z.enum(["intern", "entry", "mid", "senior", "lead", "principal", "executive"]),
  employmentStatus: z.enum(["employed", "unemployed", "open_to_work", "freelance"]),
});

export const experienceItemSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  location: z.string().min(1, "Location is required"),
  isRemote: z.boolean().default(false),
  employmentType: z.enum(["full_time", "part_time", "contract", "freelance", "internship"]),
  startDate: z.string().min(4, "Start date is required"),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  responsibilities: z.array(z.string()).min(1, "At least one responsibility is required"),
  achievements: z.array(z.string()).default([]),
  technologiesUsed: z.array(z.string()).default([]),
});

export const educationItemSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required (e.g. B.S., M.S.)"),
  fieldOfStudy: z.string().min(1, "Field of study is required (e.g. Computer Science)"),
  startDate: z.string().min(4, "Start date is required"),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
});

export const skillDiscoveryItemSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.enum([
    "programming_languages",
    "frameworks",
    "libraries",
    "databases",
    "cloud",
    "devops",
    "testing",
    "tools",
    "soft_skills",
    "other",
  ]),
  proficiencyLevel: z.enum([
    "knows",
    "has_used",
    "professional_experience",
    "project_experience",
    "beginner_familiarity",
  ]),
  yearsOfExperience: z.coerce.number().min(0).optional(),
  evidenceNotes: z.string().optional(),
});

export const projectItemSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  role: z.string().min(2, "Your role is required"),
  technologies: z.array(z.string()).min(1, "At least one technology is required"),
  responsibilities: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  projectUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
});

export const certificationItemSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuing organization is required"),
  issueDate: z.string().min(4, "Issue date is required"),
  credentialUrl: z.string().url().optional().or(z.literal("")),
  credentialId: z.string().optional(),
});

export const languageItemSchema = z.object({
  name: z.string().min(1, "Language name is required"),
  proficiency: z.enum([
    "elementary",
    "limited_working",
    "professional_working",
    "full_professional",
    "native_bilingual",
  ]),
});

export const jobPreferenceSchema = z.object({
  desiredJobTitles: z.array(z.string()).min(1, "Provide at least one desired job title"),
  desiredIndustries: z.array(z.string()).default([]),
  targetLocations: z.array(z.string()).min(1, "Specify at least one preferred location"),
  workplacePreference: z.enum(["remote", "hybrid", "on_site", "any"]),
  minimumExperienceYears: z.coerce.number().min(0),
  employmentTypes: z.array(z.enum(["full_time", "part_time", "contract", "freelance", "internship"])),
  minimumSalary: z.coerce.number().min(0),
  targetSalary: z.coerce.number().min(0),
  preferredTechnologies: z.array(z.string()).default([]),
  openToRelocation: z.boolean().default(false),
});

export const profileSchema = personalInfoSchema.merge(professionalInfoSchema);
