import { isSupabaseConfigured, createServerSupabaseClient } from "../supabase/server";
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
    jobPreferences?: JobPreference | null;
  }): ProfileCompletionResult {
    let score = 0;
    const missingSections: string[] = [];
    const recommendations: string[] = [];

    // Personal Info (15%)
    if (data.profile.fullName && data.profile.email && data.profile.location) {
      score += 15;
    } else {
      missingSections.push("Personal Contact Information");
      recommendations.push("Add location and contact phone number to complete identity.");
    }

    // Professional Headline & Level (15%)
    if (data.profile.professionalHeadline && data.profile.currentJobTitle && data.profile.yearsOfExperience >= 0) {
      score += 15;
    } else {
      missingSections.push("Professional Headline & Seniority");
      recommendations.push("Define a sharp professional headline and total years of experience.");
    }

    // Experience Records (25%)
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

  async getFullProfile(userId?: string): Promise<FullProfileData> {
    if (isSupabaseConfigured() && userId) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: prof } = await supabase.from("profiles").select("*").eq("user_id", userId).single();
        if (prof) {
          const { data: exps } = await supabase.from("experiences").select("*").eq("profile_id", prof.id);
          const { data: edus } = await supabase.from("education").select("*").eq("profile_id", prof.id);
          const { data: skls } = await supabase.from("user_skills").select("*").eq("profile_id", prof.id);
          const { data: projs } = await supabase.from("projects").select("*").eq("profile_id", prof.id);
          const { data: certs } = await supabase.from("certifications").select("*").eq("profile_id", prof.id);
          const { data: langs } = await supabase.from("languages").select("*").eq("profile_id", prof.id);
          const { data: prefs } = await supabase.from("job_preferences").select("*").eq("profile_id", prof.id).single();

          const profileObj: Profile = {
            id: prof.id,
            userId: prof.user_id,
            fullName: prof.full_name,
            professionalHeadline: prof.professional_headline,
            email: prof.email,
            phone: prof.phone,
            location: prof.location,
            linkedInUrl: prof.linkedin_url,
            githubUrl: prof.github_url,
            portfolioUrl: prof.portfolio_url,
            currentJobTitle: prof.current_job_title,
            yearsOfExperience: Number(prof.years_of_experience),
            industry: prof.industry,
            careerLevel: prof.career_level,
            employmentStatus: prof.employment_status,
            completionPercentage: Number(prof.completion_percentage),
            createdAt: prof.created_at,
            updatedAt: prof.updated_at,
          };

          const experiences: Experience[] = (exps || []).map((e: any) => ({
            id: e.id,
            profileId: e.profile_id,
            company: e.company,
            jobTitle: e.job_title,
            location: e.location,
            isRemote: e.is_remote,
            employmentType: e.employment_type,
            startDate: e.start_date,
            endDate: e.end_date,
            isCurrent: e.is_current,
            responsibilities: e.responsibilities || [],
            achievements: e.achievements || [],
            technologiesUsed: e.technologies_used || [],
            createdAt: e.created_at,
            updatedAt: e.updated_at,
          }));

          const education: Education[] = (edus || []).map((e: any) => ({
            id: e.id,
            profileId: e.profile_id,
            institution: e.institution,
            degree: e.degree,
            fieldOfStudy: e.field_of_study,
            startDate: e.start_date,
            endDate: e.end_date,
            gpa: e.gpa,
            honors: e.honors || [],
            createdAt: e.created_at,
            updatedAt: e.updated_at,
          }));

          const skills: Skill[] = (skls || []).map((s: any) => ({
            id: s.id,
            profileId: s.profile_id,
            name: s.skill_name,
            category: s.category,
            proficiencyLevel: s.proficiency_level,
            yearsOfExperience: Number(s.years_of_experience),
            verifiedViaInterview: Boolean(s.verified_via_interview),
            evidenceNotes: s.evidence_notes,
            createdAt: s.created_at,
            updatedAt: s.updated_at,
          }));

          const projects: Project[] = (projs || []).map((p: any) => ({
            id: p.id,
            profileId: p.profile_id,
            name: p.name,
            description: p.description,
            role: p.role,
            technologies: p.technologies || [],
            responsibilities: p.responsibilities || [],
            achievements: p.achievements || [],
            projectUrl: p.project_url,
            githubUrl: p.github_url,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
          }));

          const certifications: Certification[] = (certs || []).map((c: any) => ({
            id: c.id,
            profileId: c.profile_id,
            name: c.name,
            issuer: c.issuer,
            issueDate: c.issue_date,
            expiryDate: c.expiry_date,
            credentialUrl: c.credential_url,
            credentialId: c.credential_id,
            createdAt: c.created_at,
            updatedAt: c.updated_at,
          }));

          const languages: Language[] = (langs || []).map((l: any) => ({
            id: l.id,
            profileId: l.profile_id,
            name: l.name,
            proficiency: l.proficiency,
          }));

          const jobPreferences: JobPreference = prefs
            ? {
                id: prefs.id,
                profileId: prefs.profile_id,
                desiredJobTitles: prefs.desired_job_titles || [],
                desiredIndustries: prefs.desired_industries || [],
                targetLocations: prefs.target_locations || [],
                workplacePreference: prefs.workplace_preference,
                minimumExperienceYears: Number(prefs.minimum_experience_years),
                maximumCommuteMinutes: prefs.maximum_commute_minutes ? Number(prefs.maximum_commute_minutes) : undefined,
                employmentTypes: prefs.employment_types || [],
                minimumSalary: Number(prefs.minimum_salary),
                targetSalary: Number(prefs.target_salary),
                preferredTechnologies: prefs.preferred_technologies || [],
                openToRelocation: Boolean(prefs.open_to_relocation),
                createdAt: prefs.created_at,
                updatedAt: prefs.updated_at,
              }
            : mockJobPreferences;

          const completion = ProfileService.calculateCompletion({
            profile: profileObj,
            experiences,
            education,
            skills,
            projects,
            certifications,
            jobPreferences,
          });

          profileObj.completionPercentage = completion.percentage;

          return {
            profile: profileObj,
            experiences,
            education,
            skills,
            projects,
            certifications,
            languages,
            jobPreferences,
            completion,
          };
        }
      } catch (err) {
        console.warn("[ProfileService] Error fetching full profile from Supabase:", err);
      }
    }

    const completion = ProfileService.calculateCompletion({
      profile: mockProfile,
      experiences: mockExperiences,
      education: mockEducation,
      skills: mockSkills,
      projects: mockProjects,
      certifications: mockCertifications,
      jobPreferences: mockJobPreferences,
    });

    mockProfile.completionPercentage = completion.percentage;

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

  async updateProfile(updates: Partial<Profile>, userId?: string): Promise<Profile> {
    if (isSupabaseConfigured() && userId) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
          .from("profiles")
          .update({
            full_name: updates.fullName,
            professional_headline: updates.professionalHeadline,
            email: updates.email,
            phone: updates.phone,
            location: updates.location,
            linkedin_url: updates.linkedInUrl,
            github_url: updates.githubUrl,
            portfolio_url: updates.portfolioUrl,
            current_job_title: updates.currentJobTitle,
            years_of_experience: updates.yearsOfExperience,
            industry: updates.industry,
            career_level: updates.careerLevel,
            employment_status: updates.employmentStatus,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId)
          .select()
          .single();

        if (!error && data) {
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
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      } catch (err) {
        console.warn("[ProfileService] Error updating profile in Supabase:", err);
      }
    }

    Object.assign(mockProfile, updates, { updatedAt: new Date().toISOString() });
    return { ...mockProfile };
  }

  async updateJobPreferences(updates: Partial<JobPreference>, profileId?: string): Promise<JobPreference> {
    if (isSupabaseConfigured() && profileId) {
      try {
        const supabase = await createServerSupabaseClient();
        const payload = {
          profile_id: profileId,
          desired_job_titles: updates.desiredJobTitles,
          desired_industries: updates.desiredIndustries,
          target_locations: updates.targetLocations,
          workplace_preference: updates.workplacePreference,
          minimum_experience_years: updates.minimumExperienceYears,
          maximum_commute_minutes: updates.maximumCommuteMinutes,
          employment_types: updates.employmentTypes,
          minimum_salary: updates.minimumSalary,
          target_salary: updates.targetSalary,
          preferred_technologies: updates.preferredTechnologies,
          open_to_relocation: updates.openToRelocation,
          updated_at: new Date().toISOString(),
        };

        const { data } = await supabase
          .from("job_preferences")
          .upsert(payload, { onConflict: "profile_id" })
          .select()
          .single();

        if (data) {
          return {
            id: data.id,
            profileId: data.profile_id,
            desiredJobTitles: data.desired_job_titles || [],
            desiredIndustries: data.desired_industries || [],
            targetLocations: data.target_locations || [],
            workplacePreference: data.workplace_preference,
            minimumExperienceYears: Number(data.minimum_experience_years),
            maximumCommuteMinutes: data.maximum_commute_minutes ? Number(data.maximum_commute_minutes) : undefined,
            employmentTypes: data.employment_types || [],
            minimumSalary: Number(data.minimum_salary),
            targetSalary: Number(data.target_salary),
            preferredTechnologies: data.preferred_technologies || [],
            openToRelocation: Boolean(data.open_to_relocation),
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      } catch (err) {
        console.warn("[ProfileService] Error updating job preferences in Supabase:", err);
      }
    }

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

  async saveOnboarding(data: {
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
  }): Promise<FullProfileData> {
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
    if (data.seniority) {
      const s = data.seniority.toLowerCase();
      if (["entry", "mid", "senior", "lead", "principal", "executive"].includes(s)) {
        mockProfile.careerLevel = s as any;
      }
    }
    if (data.workplacePreference) {
      mockJobPreferences.workplacePreference = data.workplacePreference as any;
    }
    if (data.targetLocations && data.targetLocations.length > 0) {
      mockJobPreferences.targetLocations = data.targetLocations;
      mockProfile.location = data.targetLocations[0];
    }
    if (data.minSalary) {
      mockJobPreferences.minimumSalary = data.minSalary;
      mockJobPreferences.targetSalary = Math.round(data.minSalary * 1.2);
    }

    // Process Education Entries
    if (data.education && Array.isArray(data.education) && data.education.length > 0) {
      mockEducation.length = 0;
      data.education.forEach((edu, idx) => {
        mockEducation.push({
          id: `edu_${Date.now()}_${idx}`,
          profileId: mockProfile.id,
          degree: edu.degree,
          institution: edu.institution,
          fieldOfStudy: edu.fieldOfStudy || edu.degree,
          startDate: edu.startDate || "2021",
          endDate: edu.endDate || "2025",
          gpa: edu.gpa || undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
    }

    // Process Work Experiences Entries (with explicit time periods)
    if (data.experiences && Array.isArray(data.experiences) && data.experiences.length > 0) {
      mockExperiences.length = 0;
      data.experiences.forEach((exp, idx) => {
        mockExperiences.push({
          id: `exp_${Date.now()}_${idx}`,
          profileId: mockProfile.id,
          company: exp.company,
          jobTitle: exp.jobTitle,
          location: exp.location || mockProfile.location || "Remote",
          isRemote: true,
          employmentType: "full_time",
          startDate: exp.startDate || (exp.duration ? exp.duration : "2023"),
          endDate: exp.endDate || (exp.isCurrent ? undefined : "Present"),
          isCurrent: exp.isCurrent ?? false,
          responsibilities: exp.responsibilities && exp.responsibilities.length > 0
            ? exp.responsibilities
            : [
                `Developed and maintained features for ${exp.company}.`,
                "Worked on client deliverables, automated tests, and production deployments.",
              ],
          achievements: [],
          technologiesUsed: exp.technologiesUsed || data.skills?.slice(0, 5) || ["TypeScript", "Next.js"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
    }

    // Process Notable Projects Entries
    if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
      mockProjects.length = 0;
      data.projects.forEach((proj, idx) => {
        mockProjects.push({
          id: `prj_${Date.now()}_${idx}`,
          profileId: mockProfile.id,
          name: proj.name,
          role: proj.role || mockProfile.currentJobTitle || "Full Stack Developer",
          description: proj.description || `${proj.name} production software system.`,
          technologies: proj.technologies || data.skills?.slice(0, 4) || ["React", "Node.js"],
          responsibilities: proj.responsibilities || [
            `Designed, developed, and deployed the complete ${proj.name} architecture.`,
            "Implemented authentication, security controls, and responsive UI.",
          ],
          achievements: [],
          projectUrl: proj.projectUrl,
          githubUrl: proj.githubUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
    }

    // Process Skills (Categorized & Flat)
    if (data.skills && data.skills.length > 0) {
      mockJobPreferences.preferredTechnologies = data.skills;
      for (const sk of data.skills) {
        const exists = mockSkills.some((s) => s.name.toLowerCase() === sk.toLowerCase());
        if (!exists) {
          mockSkills.push({
            id: `skl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            profileId: mockProfile.id,
            name: sk,
            category: "frameworks",
            proficiencyLevel: "professional_experience",
            yearsOfExperience: 3,
            verifiedViaInterview: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }

    // Update completion percentage
    const completion = ProfileService.calculateCompletion({
      profile: mockProfile,
      experiences: mockExperiences,
      education: mockEducation,
      skills: mockSkills,
      projects: mockProjects,
      certifications: mockCertifications,
      languages: mockLanguages,
      jobPreferences: mockJobPreferences,
    });
    mockProfile.completionPercentage = completion.percentage;
    mockProfile.updatedAt = new Date().toISOString();

    return this.getFullProfile();
  }
}

export const profileService = new ProfileService();
