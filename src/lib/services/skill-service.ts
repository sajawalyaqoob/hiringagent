import { isSupabaseConfigured, createServerSupabaseClient } from "../supabase/server";
import type { SkillCategory } from "@/types/database";

export type ProficiencyLevel = "Beginner" | "Familiar" | "Intermediate" | "Advanced" | "Expert";

export type EvidenceSource =
  | "claimed_by_user"
  | "personal_project"
  | "professional_experience"
  | "mentioned_in_resume"
  | "verified_interview";

export interface UserSkillDetail {
  id: string;
  profileId: string;
  skillName: string;
  category: SkillCategory;
  proficiencyLevel: ProficiencyLevel;
  yearsOfExperience: number;
  verifiedViaInterview: boolean;
  evidenceSource: EvidenceSource;
  evidenceNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export const PRESET_SKILLS: { name: string; category: SkillCategory }[] = [
  // Programming Languages
  { name: "TypeScript", category: "programming_languages" },
  { name: "JavaScript", category: "programming_languages" },
  { name: "Python", category: "programming_languages" },
  { name: "Go (Golang)", category: "programming_languages" },
  { name: "Java", category: "programming_languages" },
  { name: "C++", category: "programming_languages" },
  { name: "Rust", category: "programming_languages" },
  { name: "SQL", category: "programming_languages" },

  // Frameworks
  { name: "Next.js", category: "frameworks" },
  { name: "React", category: "frameworks" },
  { name: "Node.js", category: "frameworks" },
  { name: "Express.js", category: "frameworks" },
  { name: "NestJS", category: "frameworks" },
  { name: "Django", category: "frameworks" },
  { name: "FastAPI", category: "frameworks" },
  { name: "Spring Boot", category: "frameworks" },

  // Libraries
  { name: "Redux", category: "libraries" },
  { name: "Zustand", category: "libraries" },
  { name: "Tailwind CSS", category: "libraries" },
  { name: "Prisma", category: "libraries" },
  { name: "RxJS", category: "libraries" },

  // Databases
  { name: "PostgreSQL", category: "databases" },
  { name: "MongoDB", category: "databases" },
  { name: "Redis", category: "databases" },
  { name: "MySQL", category: "databases" },
  { name: "DynamoDB", category: "databases" },

  // Cloud & Infrastructure
  { name: "AWS", category: "cloud" },
  { name: "Google Cloud Platform (GCP)", category: "cloud" },
  { name: "Azure", category: "cloud" },
  { name: "Vercel", category: "cloud" },
  { name: "Supabase", category: "cloud" },

  // DevOps & CI/CD
  { name: "Docker", category: "devops" },
  { name: "Kubernetes", category: "devops" },
  { name: "GitHub Actions", category: "devops" },
  { name: "Terraform", category: "devops" },

  // Testing
  { name: "Jest", category: "testing" },
  { name: "Playwright", category: "testing" },
  { name: "Cypress", category: "testing" },

  // Tools
  { name: "Git", category: "tools" },
  { name: "Linux", category: "tools" },

  // Soft Skills
  { name: "System Architecture", category: "soft_skills" },
  { name: "Technical Leadership", category: "soft_skills" },
  { name: "Cross-functional Collaboration", category: "soft_skills" },
  { name: "Agile / Scrum", category: "soft_skills" },
];

export class SkillService {
  /**
   * Search master preset skills
   */
  static searchPresetSkills(query: string): { name: string; category: SkillCategory }[] {
    if (!query || query.trim() === "") return PRESET_SKILLS;
    const lower = query.toLowerCase();
    return PRESET_SKILLS.filter(
      (s) => s.name.toLowerCase().includes(lower) || s.category.toLowerCase().includes(lower)
    );
  }

  /**
   * Fetch structured skills for a profile
   */
  static async getUserSkills(profileId: string): Promise<UserSkillDetail[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
          .from("user_skills")
          .select("*")
          .eq("profile_id", profileId);

        if (!error && data) {
          return data.map((item: any) => ({
            id: item.id,
            profileId: item.profile_id,
            skillName: item.skill_name,
            category: item.category as SkillCategory,
            proficiencyLevel: item.proficiency_level as ProficiencyLevel,
            yearsOfExperience: Number(item.years_of_experience || 0),
            verifiedViaInterview: Boolean(item.verified_via_interview),
            evidenceSource: item.evidence_source as EvidenceSource,
            evidenceNotes: item.evidence_notes,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          }));
        }
      } catch (err) {
        console.warn("[SkillService] Error fetching user skills from Supabase:", err);
      }
    }

    // Default mock response
    return [
      {
        id: "skl_01",
        profileId,
        skillName: "TypeScript",
        category: "programming_languages",
        proficiencyLevel: "Expert",
        yearsOfExperience: 6,
        verifiedViaInterview: true,
        evidenceSource: "professional_experience",
        evidenceNotes: "Used extensively at CloudScale Technologies for 3+ years",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "skl_02",
        profileId,
        skillName: "React",
        category: "frameworks",
        proficiencyLevel: "Expert",
        yearsOfExperience: 6,
        verifiedViaInterview: true,
        evidenceSource: "professional_experience",
        evidenceNotes: "Built multiple customer-facing applications",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "skl_03",
        profileId,
        skillName: "PostgreSQL",
        category: "databases",
        proficiencyLevel: "Advanced",
        yearsOfExperience: 5,
        verifiedViaInterview: false,
        evidenceSource: "professional_experience",
        evidenceNotes: "Database sharding and latency optimization experience",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  /**
   * Save or update a skill for user profile
   */
  static async addOrUpdateSkill(
    profileId: string,
    skill: Omit<UserSkillDetail, "id" | "profileId" | "createdAt" | "updatedAt">
  ): Promise<UserSkillDetail> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const payload = {
          profile_id: profileId,
          skill_name: skill.skillName,
          category: skill.category,
          proficiency_level: skill.proficiencyLevel,
          years_of_experience: skill.yearsOfExperience,
          verified_via_interview: skill.verifiedViaInterview,
          evidence_source: skill.evidenceSource,
          evidence_notes: skill.evidenceNotes || "",
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from("user_skills")
          .upsert(payload, { onConflict: "profile_id,skill_name" })
          .select()
          .single();

        if (!error && data) {
          return {
            id: data.id,
            profileId: data.profile_id,
            skillName: data.skill_name,
            category: data.category as SkillCategory,
            proficiencyLevel: data.proficiency_level as ProficiencyLevel,
            yearsOfExperience: Number(data.years_of_experience),
            verifiedViaInterview: Boolean(data.verified_via_interview),
            evidenceSource: data.evidence_source as EvidenceSource,
            evidenceNotes: data.evidence_notes,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      } catch (err) {
        console.warn("[SkillService] Error upserting skill in Supabase:", err);
      }
    }

    return {
      id: `skl_${Date.now().toString(36)}`,
      profileId,
      ...skill,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Delete a skill from profile
   */
  static async deleteSkill(profileId: string, skillName: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { error } = await supabase
          .from("user_skills")
          .delete()
          .eq("profile_id", profileId)
          .eq("skill_name", skillName);

        if (!error) return true;
      } catch (err) {
        console.warn("[SkillService] Error deleting skill from Supabase:", err);
      }
    }
    return true;
  }
}
