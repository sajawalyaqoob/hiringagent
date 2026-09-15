import { getDb } from "../db/neon";
import {
  mockProfile,
  mockExperiences,
  mockEducation,
  mockSkills,
  mockProjects,
  mockCertifications,
  mockLanguages,
  mockJobPreferences,
} from "@/lib/server/mock-db";
import type {
  Profile,
  Experience,
  Education,
  Skill,
  Project,
  Certification,
  Language,
  JobPreference,
} from "@/types/database";

export interface ProfileCompletionResult {
  percentage: number;
  missingSections: string[];
  recommendations: string[];
}

export interface FullProfileData {
  profile: Profile;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  jobPreferences: JobPreference;
  completion: ProfileCompletionResult;
}

export class ProfileService {
  /**
   * Profile completion algorithm calculating meaningful readiness
   */
  static calculateCompletion(data: {
    profile: Profile;
    experiences: Experience[];
    education: Education[];
    skills: Skill[];
    projects: Project[];
    certifications: Certification[];
    languages?: Language[];
    jobPreferences?: JobPreference | null;
  }): ProfileCompletionResult {
    let score = 0;
    const missingSections: string[] = [];
    const recommendations: string[] = [];

    // Personal Info (15%)
    if (data.profile.fullName && data.profile.email && data.profile.location) {
      score += 15;
    } else {
      missingSections.push("Personal Information");
      recommendations.push("Add full name, email, and primary location.");
    }

    // Professional Summary & Headline (15%)
    if (data.profile.professionalHeadline && data.profile.currentJobTitle) {
      score += 15;
    } else {
      missingSections.push("Professional Headline & Job Title");
      recommendations.push("Provide your current job title and career headline.");
    }

    // Work Experience (25%)
    if (data.experiences.length >= 2) {
      score += 25;
    } else if (data.experiences.length === 1) {
      score += 15;
      missingSections.push("Additional Employment Records");
      recommendations.push("Add at least 2 work experience entries for optimal matching depth.");
    } else {
      missingSections.push("Work Experience");
      recommendations.push("Add work history entries detailing achievements and technologies used.");
    }

    // Skills (20%)
    if (data.skills.length >= 5) {
      score += 20;
    } else if (data.skills.length > 0) {
      score += 10;
      missingSections.push("Comprehensive Technical Skills");
      recommendations.push("List at least 5 core technical or domain skills.");
    } else {
      missingSections.push("Skill System");
      recommendations.push("Add technical skills and assign proficiency levels.");
    }

    // Education (10%)
    if (data.education.length > 0) {
      score += 10;
    } else {
      missingSections.push("Education History");
      recommendations.push("Specify degree, field of study, and institution.");
    }

    // Projects (10%)
    if (data.projects.length > 0) {
      score += 10;
    } else {
      missingSections.push("Key Engineering Projects");
      recommendations.push("Add at least 1 highlighted personal or professional project.");
    }

    // Preferences (5%)
    if (data.jobPreferences && data.jobPreferences.desiredJobTitles.length > 0) {
      score += 5;
    } else {
      missingSections.push("Job Target Preferences");
      recommendations.push("Set desired target roles and salary expectations.");
    }

    const percentage = Math.min(100, Math.max(0, score));

    return {
      percentage,
      missingSections,
      recommendations,
    };
  }

  /**
   * Fetch complete candidate profile directly from Neon PostgreSQL
   */
  async getFullProfile(userId?: string): Promise<FullProfileData> {
    const isUUID = (id?: string) => Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));

    if (userId && isUUID(userId)) {
      try {
        const db = getDb();
        const rows = await db`
          SELECT * FROM profiles
          WHERE user_id = ${userId}
          LIMIT 1
        `;

        if (rows && rows.length > 0) {
          const prof = rows[0];

          // Parse JSONB columns safely
          const rawEdus = Array.isArray(prof.education) ? prof.education : [];
          const rawExps = Array.isArray(prof.experiences) ? prof.experiences : [];
          const rawProjs = Array.isArray(prof.projects) ? prof.projects : [];
          const rawSkills = Array.isArray(prof.skills) ? prof.skills : [];

          const experiences: Experience[] = rawExps.map((e: any, idx: number) => ({
            id: e.id || `exp_${idx}`,
            profileId: prof.id,
            company: e.company || "",
            jobTitle: e.jobTitle || "",
            location: e.location || prof.location || "Pakistan",
            isRemote: e.isRemote ?? true,
            employmentType: e.employmentType || "full_time",
            startDate: e.startDate || e.duration || "2023",
            endDate: e.endDate,
            isCurrent: Boolean(e.isCurrent),
            responsibilities: Array.isArray(e.responsibilities) ? e.responsibilities : [],
            achievements: Array.isArray(e.achievements) ? e.achievements : [],
            technologiesUsed: Array.isArray(e.technologiesUsed) ? e.technologiesUsed : [],
            createdAt: e.createdAt || new Date().toISOString(),
            updatedAt: e.updatedAt || new Date().toISOString(),
          }));

          const education: Education[] = rawEdus.map((e: any, idx: number) => ({
            id: e.id || `edu_${idx}`,
            profileId: prof.id,
            institution: e.institution || "",
            degree: e.degree || "",
            fieldOfStudy: e.fieldOfStudy || e.degree || "",
            startDate: e.startDate || "2020",
            endDate: e.endDate || "2024",
            gpa: e.gpa,
            honors: Array.isArray(e.honors) ? e.honors : [],
            createdAt: e.createdAt || new Date().toISOString(),
            updatedAt: e.updatedAt || new Date().toISOString(),
          }));

          const skills: Skill[] = rawSkills.map((s: any, idx: number) => {
            if (typeof s === "string") {
              return {
                id: `skl_${idx}`,
                profileId: prof.id,
                name: s,
                category: "programming_languages",
                proficiencyLevel: "professional_experience" as const,
                yearsOfExperience: 3,
                verifiedViaInterview: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
            }
            return {
              id: s.id || `skl_${idx}`,
              profileId: prof.id,
              name: s.name || s.skillName || "Skill",
              category: s.category || "other",
              proficiencyLevel: s.proficiencyLevel || "intermediate",
              yearsOfExperience: Number(s.yearsOfExperience || 2),
              verifiedViaInterview: Boolean(s.verifiedViaInterview),
              createdAt: s.createdAt || new Date().toISOString(),
              updatedAt: s.updatedAt || new Date().toISOString(),
            };
          });

          const projects: Project[] = rawProjs.map((p: any, idx: number) => ({
            id: p.id || `prj_${idx}`,
            profileId: prof.id,
            name: p.name || "",
            description: p.description || "",
            role: p.role || prof.current_job_title || "Full Stack Developer",
            technologies: Array.isArray(p.technologies) ? p.technologies : [],
            responsibilities: Array.isArray(p.responsibilities) ? p.responsibilities : [],
            achievements: Array.isArray(p.achievements) ? p.achievements : [],
            projectUrl: p.projectUrl || p.project_url,
            githubUrl: p.githubUrl || p.github_url,
            createdAt: p.createdAt || new Date().toISOString(),
            updatedAt: p.updatedAt || new Date().toISOString(),
          }));

          const profileObj: Profile = {
            id: prof.id,
            userId: prof.user_id,
            fullName: prof.full_name || "Candidate",
            professionalHeadline: prof.professional_headline || "Software Professional",
            email: prof.email || "",
            phone: prof.phone || "",
            location: prof.location || "Pakistan",
            linkedInUrl: prof.linkedin_url || "",
            githubUrl: prof.github_url || "",
            portfolioUrl: prof.portfolio_url || "",
            currentJobTitle: prof.current_job_title || "Software Engineer",
            yearsOfExperience: Number(prof.years_of_experience || 0),
            industry: prof.industry || "Technology",
            careerLevel: prof.career_level || "mid",
            employmentStatus: prof.employment_status || "open_to_work",
            completionPercentage: Number(prof.completion_percentage || 50),
            avatarUrl: prof.avatar_url || "",
            bio: prof.bio || "",
            createdAt: new Date(prof.created_at).toISOString(),
            updatedAt: new Date(prof.updated_at).toISOString(),
          };

          const completion = ProfileService.calculateCompletion({
            profile: profileObj,
            experiences,
            education,
            skills,
            projects,
            certifications: mockCertifications,
            jobPreferences: mockJobPreferences,
          });

          profileObj.completionPercentage = completion.percentage;

          return {
            profile: profileObj,
            experiences,
            education,
            skills,
            projects,
            certifications: mockCertifications,
            languages: mockLanguages,
            jobPreferences: mockJobPreferences,
            completion,
          };
        }
      } catch (err) {
        console.error("[ProfileService] Neon DB getFullProfile error:", err);
      }
    }

    // Default fallback if anonymous
    const completion = ProfileService.calculateCompletion({
      profile: mockProfile,
      experiences: mockExperiences,
      education: mockEducation,
      skills: mockSkills,
      projects: mockProjects,
      certifications: mockCertifications,
      jobPreferences: mockJobPreferences,
    });

    return {
      profile: { ...mockProfile },
      experiences: [...mockExperiences],
      education: [...mockEducation],
      skills: [...mockSkills],
      projects: [...mockProjects],
      certifications: [...mockCertifications],
      languages: [...mockLanguages],
      jobPreferences: { ...mockJobPreferences },
      completion,
    };
  }

  /**
   * Update candidate profile directly in Neon PostgreSQL
   */
  async updateProfile(updates: Partial<Profile>, userId?: string): Promise<Profile> {
    const isUUID = (id?: string) => Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));

    if (userId && isUUID(userId)) {
      try {
        const db = getDb();
        const rows = await db`
          UPDATE profiles
          SET
            full_name = COALESCE(${updates.fullName}, full_name),
            professional_headline = COALESCE(${updates.professionalHeadline}, professional_headline),
            email = COALESCE(${updates.email}, email),
            phone = COALESCE(${updates.phone}, phone),
            location = COALESCE(${updates.location}, location),
            linkedin_url = COALESCE(${updates.linkedInUrl}, linkedin_url),
            github_url = COALESCE(${updates.githubUrl}, github_url),
            portfolio_url = COALESCE(${updates.portfolioUrl}, portfolio_url),
            current_job_title = COALESCE(${updates.currentJobTitle}, current_job_title),
            years_of_experience = COALESCE(${updates.yearsOfExperience}, years_of_experience),
            industry = COALESCE(${updates.industry}, industry),
            career_level = COALESCE(${updates.careerLevel}, career_level),
            employment_status = COALESCE(${updates.employmentStatus}, employment_status),
            avatar_url = COALESCE(${updates.avatarUrl}, avatar_url),
            bio = COALESCE(${updates.bio}, bio),
            updated_at = NOW()
          WHERE user_id = ${userId}
          RETURNING *
        `;

        if (updates.fullName) {
          await db`UPDATE users SET name = ${updates.fullName}, updated_at = NOW() WHERE id = ${userId}`;
        }

        if (rows && rows.length > 0) {
          const data = rows[0];
          return {
            id: data.id,
            userId: data.user_id,
            fullName: data.full_name,
            professionalHeadline: data.professional_headline,
            email: data.email,
            phone: data.phone,
            location: data.location,
            linkedInUrl: data.linkedin_url,
            githubUrl: data.github_url,
            portfolioUrl: data.portfolio_url,
            currentJobTitle: data.current_job_title,
            yearsOfExperience: Number(data.years_of_experience),
            industry: data.industry,
            careerLevel: data.career_level,
            employmentStatus: data.employment_status,
            completionPercentage: Number(data.completion_percentage),
            avatarUrl: data.avatar_url,
            bio: data.bio,
            createdAt: new Date(data.created_at).toISOString(),
            updatedAt: new Date(data.updated_at).toISOString(),
          };
        }
      } catch (err) {
        console.error("[ProfileService] Neon DB updateProfile error:", err);
      }
    }

    mockProfile.fullName = updates.fullName ?? mockProfile.fullName;
    mockProfile.professionalHeadline = updates.professionalHeadline ?? mockProfile.professionalHeadline;
    mockProfile.email = updates.email ?? mockProfile.email;
    mockProfile.phone = updates.phone ?? mockProfile.phone;
    mockProfile.location = updates.location ?? mockProfile.location;
    mockProfile.linkedInUrl = updates.linkedInUrl ?? mockProfile.linkedInUrl;
    mockProfile.githubUrl = updates.githubUrl ?? mockProfile.githubUrl;
    mockProfile.portfolioUrl = updates.portfolioUrl ?? mockProfile.portfolioUrl;
    mockProfile.currentJobTitle = updates.currentJobTitle ?? mockProfile.currentJobTitle;
    mockProfile.yearsOfExperience = updates.yearsOfExperience ?? mockProfile.yearsOfExperience;
    mockProfile.industry = updates.industry ?? mockProfile.industry;
    mockProfile.careerLevel = updates.careerLevel ?? mockProfile.careerLevel;
    mockProfile.employmentStatus = updates.employmentStatus ?? mockProfile.employmentStatus;
    mockProfile.updatedAt = new Date().toISOString();

    return { ...mockProfile };
  }

  /**
   * Save complete onboarding inputs directly to Neon PostgreSQL
   */
  async saveOnboarding(
    data: {
      fullName?: string;
      email?: string;
      phone?: string;
      location?: string;
      linkedInUrl?: string;
      githubUrl?: string;
      portfolioUrl?: string;
      careerField?: string;
      targetRole?: string;
      workplacePreference?: string;
      seniority?: string;
      targetLocations?: string[];
      minSalary?: number;
      skills?: string[];
      avatarUrl?: string;
      bio?: string;
      education?: Array<{
        degree: string;
        institution: string;
        fieldOfStudy?: string;
        startDate?: string;
        endDate?: string;
        gpa?: string;
      }>;
      experiences?: Array<{
        company: string;
        jobTitle: string;
        location?: string;
        duration?: string;
        startDate?: string;
        endDate?: string;
        isCurrent?: boolean;
        responsibilities?: string[];
        technologiesUsed?: string[];
      }>;
      projects?: Array<{
        name: string;
        role?: string;
        description?: string;
        projectUrl?: string;
        githubUrl?: string;
        technologies?: string[];
        responsibilities?: string[];
      }>;
      categorizedSkills?: Record<string, string[]>;
    },
    userId?: string
  ): Promise<FullProfileData> {
    const isUUID = (id?: string) => Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));

    if (userId && isUUID(userId)) {
      try {
        const db = getDb();
        const eduJson = JSON.stringify(data.education || []);
        const expJson = JSON.stringify(data.experiences || []);
        const prjJson = JSON.stringify(data.projects || []);
        const sklJson = JSON.stringify(data.skills || []);

        const headline = data.targetRole
          ? `${data.targetRole} • ${data.careerField || "Tech Specialist"}`
          : "Software Professional";

        await db`
          INSERT INTO profiles (
            user_id,
            full_name,
            email,
            phone,
            location,
            linkedin_url,
            github_url,
            portfolio_url,
            professional_headline,
            current_job_title,
            avatar_url,
            bio,
            education,
            experiences,
            projects,
            skills,
            completion_percentage,
            updated_at
          ) VALUES (
            ${userId},
            ${data.fullName || "Candidate"},
            ${data.email || ""},
            ${data.phone || ""},
            ${data.location || "Pakistan"},
            ${data.linkedInUrl || ""},
            ${data.githubUrl || ""},
            ${data.portfolioUrl || ""},
            ${headline},
            ${data.targetRole || "Software Engineer"},
            ${data.avatarUrl || ""},
            ${data.bio || ""},
            ${eduJson}::jsonb,
            ${expJson}::jsonb,
            ${prjJson}::jsonb,
            ${sklJson}::jsonb,
            95,
            NOW()
          )
          ON CONFLICT (user_id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            location = EXCLUDED.location,
            linkedin_url = EXCLUDED.linkedin_url,
            github_url = EXCLUDED.github_url,
            portfolio_url = EXCLUDED.portfolio_url,
            professional_headline = EXCLUDED.professional_headline,
            current_job_title = EXCLUDED.current_job_title,
            avatar_url = EXCLUDED.avatar_url,
            bio = EXCLUDED.bio,
            education = EXCLUDED.education,
            experiences = EXCLUDED.experiences,
            projects = EXCLUDED.projects,
            skills = EXCLUDED.skills,
            completion_percentage = 95,
            updated_at = NOW()
        `;

        if (data.fullName) {
          await db`
            UPDATE users 
            SET name = ${data.fullName}, updated_at = NOW() 
            WHERE id = ${userId}
          `;
        }

        return this.getFullProfile(userId);
      } catch (err) {
        console.error("[ProfileService] Neon DB saveOnboarding error:", err);
      }
    }

    // In-memory update as fallback
    if (data.fullName) mockProfile.fullName = data.fullName;
    if (data.email) mockProfile.email = data.email;
    if (data.phone) mockProfile.phone = data.phone;
    if (data.location) mockProfile.location = data.location;
    if (data.linkedInUrl) mockProfile.linkedInUrl = data.linkedInUrl;
    if (data.githubUrl) mockProfile.githubUrl = data.githubUrl;
    if (data.portfolioUrl) mockProfile.portfolioUrl = data.portfolioUrl;

    if (data.targetRole) {
      mockProfile.currentJobTitle = data.targetRole;
      mockProfile.professionalHeadline = `${data.targetRole} • ${data.careerField || "Tech Specialist"}`;
      mockJobPreferences.desiredJobTitles = [data.targetRole];
    }
    if (data.avatarUrl) mockProfile.avatarUrl = data.avatarUrl;
    if (data.bio) mockProfile.bio = data.bio;

    return this.getFullProfile();
  }

  async updateJobPreferences(profileId: string, updates: Partial<JobPreference>): Promise<JobPreference> {
    Object.assign(mockJobPreferences, updates, { updatedAt: new Date().toISOString() });
    return { ...mockJobPreferences };
  }

  async addSkill(skill: Omit<Skill, "id" | "profileId" | "createdAt" | "updatedAt">): Promise<Skill> {
    const newSkill: Skill = {
      ...skill,
      id: `skl_${Date.now()}`,
      profileId: mockProfile.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockSkills.push(newSkill);
    return newSkill;
  }

  async updateSkillProficiency(id: string, level: Skill["proficiencyLevel"], notes?: string): Promise<Skill | null> {
    const target = mockSkills.find((s) => s.id === id);
    if (!target) return null;
    target.proficiencyLevel = level;
    if (notes !== undefined) target.evidenceNotes = notes;
    target.verifiedViaInterview = true;
    target.updatedAt = new Date().toISOString();
    return { ...target };
  }
}

export const profileService = new ProfileService();
