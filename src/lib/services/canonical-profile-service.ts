import type {
  Profile,
  Experience,
  Education,
  Project,
  Certification,
  Language,
  JobPreference,
} from "@/types/database";
import type { UserSkillDetail } from "./skill-service";

export interface CanonicalCareerProfile {
  identity: {
    fullName: string;
    professionalHeadline: string;
    email: string;
    phone?: string;
    location: string;
    linkedInUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
  };
  currentRole: string;
  totalYearsOfExperience: number;
  careerLevel: string;
  industry: string;
  employmentStatus: string;
  experiences: Array<{
    id: string;
    company: string;
    jobTitle: string;
    location: string;
    isRemote: boolean;
    employmentType: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    responsibilities: string[];
    achievements: string[];
    technologiesUsed: string[];
  }>;
  skills: Array<{
    name: string;
    category: string;
    proficiency: string;
    yearsOfExperience: number;
    evidenceSource: string;
    verifiedViaInterview: boolean;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    role: string;
    technologies: string[];
    responsibilities: string[];
    achievements: string[];
    projectUrl?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    issueDate: string;
    credentialId?: string;
  }>;
  languages: Array<{
    name: string;
    proficiency: string;
  }>;
  preferences: {
    desiredJobTitles: string[];
    desiredIndustries: string[];
    targetLocations: string[];
    workplacePreference: string;
    minimumSalary: number;
    targetSalary: number;
    minimumExperienceYears: number;
    preferredTechnologies: string[];
    openToRelocation: boolean;
  };
  highlightsAndAchievements: string[];
  targetRoles: string[];
}

export class CanonicalProfileService {
  /**
   * Compiles normalized CanonicalCareerProfile object from profile sub-entities
   */
  static compile(
    profile: Profile,
    experiences: Experience[],
    skills: UserSkillDetail[],
    education: Education[],
    projects: Project[],
    certifications: Certification[],
    languages: Language[],
    preferences?: JobPreference | null
  ): CanonicalCareerProfile {
    // Extract top achievements across all experiences and projects
    const expAchievements = experiences.flatMap((e) => e.achievements || []);
    const projAchievements = projects.flatMap((p) => p.achievements || []);
    const allAchievements = Array.from(new Set([...expAchievements, ...projAchievements]));

    const targetRoles = preferences?.desiredJobTitles || [profile.currentJobTitle];

    return {
      identity: {
        fullName: profile.fullName,
        professionalHeadline: profile.professionalHeadline,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        linkedInUrl: profile.linkedInUrl,
        githubUrl: profile.githubUrl,
        portfolioUrl: profile.portfolioUrl,
      },
      currentRole: profile.currentJobTitle,
      totalYearsOfExperience: Number(profile.yearsOfExperience || 0),
      careerLevel: profile.careerLevel,
      industry: profile.industry,
      employmentStatus: profile.employmentStatus,
      experiences: experiences.map((exp) => ({
        id: exp.id,
        company: exp.company,
        jobTitle: exp.jobTitle,
        location: exp.location,
        isRemote: Boolean(exp.isRemote),
        employmentType: exp.employmentType,
        startDate: exp.startDate,
        endDate: exp.endDate,
        isCurrent: exp.isCurrent,
        responsibilities: exp.responsibilities || [],
        achievements: exp.achievements || [],
        technologiesUsed: exp.technologiesUsed || [],
      })),
      skills: skills.map((s) => ({
        name: s.skillName,
        category: s.category,
        proficiency: s.proficiencyLevel,
        yearsOfExperience: s.yearsOfExperience,
        evidenceSource: s.evidenceSource,
        verifiedViaInterview: s.verifiedViaInterview,
      })),
      education: education.map((edu) => ({
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        startDate: edu.startDate,
        endDate: edu.endDate,
      })),
      projects: projects.map((proj) => ({
        name: proj.name,
        description: proj.description,
        role: proj.role,
        technologies: proj.technologies || [],
        responsibilities: proj.responsibilities || [],
        achievements: proj.achievements || [],
        projectUrl: proj.projectUrl,
      })),
      certifications: certifications.map((c) => ({
        name: c.name,
        issuer: c.issuer,
        issueDate: c.issueDate,
        credentialId: c.credentialId,
      })),
      languages: languages.map((l) => ({
        name: l.name,
        proficiency: l.proficiency,
      })),
      preferences: {
        desiredJobTitles: preferences?.desiredJobTitles || [profile.currentJobTitle],
        desiredIndustries: preferences?.desiredIndustries || [profile.industry],
        targetLocations: preferences?.targetLocations || [profile.location],
        workplacePreference: preferences?.workplacePreference || "any",
        minimumSalary: preferences?.minimumSalary || 0,
        targetSalary: preferences?.targetSalary || 0,
        minimumExperienceYears: preferences?.minimumExperienceYears || 0,
        preferredTechnologies: preferences?.preferredTechnologies || [],
        openToRelocation: Boolean(preferences?.openToRelocation),
      },
      highlightsAndAchievements: allAchievements,
      targetRoles,
    };
  }
}
