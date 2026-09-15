export type UserRole = "user" | "admin";
export type SubscriptionTier = "free" | "weekly" | "monthly" | "professional" | "career_pro";
export type SubscriptionStatus =
  | "pending_payment"
  | "pending_approval"
  | "active"
  | "canceled"
  | "past_due"
  | "trialing"
  | "expired"
  | "rejected";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ManualPayment {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  planId: string;
  planName: string;
  amountPkr: number;
  paymentMethod: string;
  senderNumber: string;
  transactionId: string;
  screenshotUrl: string;
  status: "pending" | "approved" | "rejected";
  adminNotes?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
}

export type CareerLevel = "intern" | "entry" | "mid" | "senior" | "lead" | "principal" | "executive";
export type EmploymentStatus = "employed" | "unemployed" | "open_to_work" | "freelance";

export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  professionalHeadline: string;
  email: string;
  phone?: string;
  location: string;
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  currentJobTitle: string;
  yearsOfExperience: number;
  industry: string;
  careerLevel: CareerLevel;
  employmentStatus: EmploymentStatus;
  completionPercentage: number;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export type EmploymentType = "full_time" | "part_time" | "contract" | "freelance" | "internship";

export interface Experience {
  id: string;
  profileId: string;
  company: string;
  jobTitle: string;
  location: string;
  isRemote?: boolean;
  employmentType: EmploymentType;
  startDate: string; // YYYY-MM
  endDate?: string; // YYYY-MM or undefined if current
  isCurrent: boolean;
  responsibilities: string[];
  achievements: string[];
  technologiesUsed: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  profileId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  honors?: string[];
  createdAt: string;
  updatedAt: string;
}

export type SkillCategory =
  | "programming_languages"
  | "frameworks"
  | "libraries"
  | "databases"
  | "cloud"
  | "devops"
  | "testing"
  | "tools"
  | "soft_skills"
  | "other";

export type SkillProficiencyLevel =
  | "knows"
  | "has_used"
  | "professional_experience"
  | "project_experience"
  | "beginner_familiarity";

export interface Skill {
  id: string;
  profileId: string;
  name: string;
  category: SkillCategory;
  proficiencyLevel: SkillProficiencyLevel;
  yearsOfExperience?: number;
  verifiedViaInterview?: boolean;
  evidenceNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  profileId: string;
  name: string;
  description: string;
  role: string;
  technologies: string[];
  responsibilities: string[];
  achievements: string[];
  projectUrl?: string;
  githubUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Certification {
  id: string;
  profileId: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  credentialId?: string;
  createdAt: string;
  updatedAt: string;
}

export type LanguageProficiency = "elementary" | "limited_working" | "professional_working" | "full_professional" | "native_bilingual";

export interface Language {
  id: string;
  profileId: string;
  name: string;
  proficiency: LanguageProficiency;
}

export type WorkplacePreference = "remote" | "hybrid" | "on_site" | "any";

export interface JobPreference {
  id: string;
  profileId: string;
  desiredJobTitles: string[];
  desiredIndustries: string[];
  targetLocations: string[];
  workplacePreference: WorkplacePreference;
  minimumExperienceYears: number;
  maximumCommuteMinutes?: number;
  employmentTypes: EmploymentType[];
  minimumSalary: number;
  targetSalary: number;
  preferredTechnologies: string[];
  openToRelocation: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ResumeStatus = "draft" | "active" | "archived";
export type ResumeParseStatus = "pending" | "processing" | "completed" | "failed";

export interface Resume {
  id: string;
  userId: string;
  title: string;
  fileName: string;
  fileSize: number;
  fileType: "pdf" | "docx";
  fileUrl: string;
  isPrimary: boolean;
  status: ResumeStatus;
  parseStatus: ResumeParseStatus;
  analyzedAt?: string;
  atsScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  versionNumber: number;
  tailoredForJobId?: string;
  atsScore?: number;
  contentSnapshot: string;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  workplaceType: WorkplacePreference;
  employmentType: EmploymentType;
  seniority: CareerLevel;
  experienceYearsRequired: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  educationRequirement?: string;
  sourceUrl?: string;
  postedAt: string;
  expiresAt?: string;
  createdAt: string;
}

export interface JobMatch {
  id: string;
  userId: string;
  jobId: string;
  matchScore: number; // 0-100
  overallScore: number; // 0-100
  skillsMatchScore: number;
  experienceMatchScore: number;
  seniorityMatchScore: number;
  locationScore?: number;
  educationScore?: number;
  preferenceScore?: number;
  matchingSkills: string[];
  missingSkills: string[];
  potentialConcerns: string[];
  recommendedAction: string;
  isSaved: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStage =
  | "saved"
  | "applied"
  | "recruiter_contacted"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";

export interface Recruiter {
  id: string;
  name: string;
  company: string;
  title: string;
  email?: string;
  linkedInUrl?: string;
  phone?: string;
  isPublicInfo: boolean;
  notes?: string;
}

export interface Application {
  id: string;
  userId: string;
  jobId?: string;
  jobTitle: string;
  company: string;
  location: string;
  status: ApplicationStage;
  appliedDate?: string;
  salaryOffered?: number;
  notes?: string;
  recruiterId?: string;
  recruiter?: Recruiter;
  nextAction?: string;
  nextActionDueDate?: string;
  tailoredResumeId?: string;
  createdAt: string;
  updatedAt: string;
}

export type GenerationType =
  | "tailored_resume"
  | "cover_letter"
  | "linkedin_post"
  | "recruiter_email"
  | "recruiter_message"
  | "application_strategy";

export type GenerationState = "idle" | "analyzing" | "generating" | "completed" | "failed";

export interface Generation {
  id: string;
  userId: string;
  type: GenerationType;
  jobId?: string;
  jobTitle?: string;
  company?: string;
  status: GenerationState;
  inputs: Record<string, unknown>;
  outputContent?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface SupportReply {
  id: string;
  senderName: string;
  senderRole: string;
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: string;
  priority?: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  message: string;
  adminResponse?: string;
  respondedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  replies?: SupportReply[];
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}
