import { isSupabaseConfigured, createServerSupabaseClient } from "../supabase/server";
import { mockResumes } from "@/lib/server/mock-db";
import type { Resume } from "@/types/database";
import { ResumeParserService } from "./resume-parser-service";

export interface ResumeAnalysisResult {
  atsScore: number;
  formatScore: number;
  keywordMatchScore: number;
  bulletImpactScore: number;
  strengths: string[];
  improvements: string[];
  detectedKeywords: string[];
  missingKeywords: string[];
}

export class ResumeService {
  private parserService = new ResumeParserService();

  /**
   * Validate uploaded resume file
   */
  static validateResumeFile(file: { name: string; size: number; type: string }) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "docx") {
      throw new Error("Invalid file type. Only PDF and DOCX files are allowed.");
    }
    const maxBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxBytes) {
      throw new Error("File size exceeds maximum limit of 10MB.");
    }
  }

  async getResumes(userId?: string): Promise<Resume[]> {
    if (isSupabaseConfigured() && userId) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
          .from("resumes")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (!error && data) {
          return data.map((r: any) => ({
            id: r.id,
            userId: r.user_id,
            title: r.title,
            fileName: r.file_name,
            fileSize: Number(r.file_size),
            fileType: r.file_type as "pdf" | "docx",
            fileUrl: r.file_path,
            isPrimary: Boolean(r.is_primary),
            status: r.status as "active" | "draft" | "archived",
            parseStatus: r.parse_status as "pending" | "processing" | "completed" | "failed",
            analyzedAt: r.analyzed_at,
            atsScore: r.ats_score ? Number(r.ats_score) : undefined,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          }));
        }
      } catch (err) {
        console.warn("[ResumeService] Error fetching resumes from Supabase:", err);
      }
    }
    return [...mockResumes];
  }

  async getPrimaryResume(userId?: string): Promise<Resume | undefined> {
    const resumes = await this.getResumes(userId);
    return resumes.find((r) => r.isPrimary) || resumes[0];
  }

  async setPrimary(id: string, userId?: string): Promise<boolean> {
    if (isSupabaseConfigured() && userId) {
      try {
        const supabase = await createServerSupabaseClient();
        // Unset all primary
        await supabase.from("resumes").update({ is_primary: false }).eq("user_id", userId);
        // Set selected primary
        await supabase.from("resumes").update({ is_primary: true }).eq("id", id).eq("user_id", userId);
        return true;
      } catch (err) {
        console.warn("[ResumeService] Error setting primary resume in Supabase:", err);
      }
    }

    mockResumes.forEach((r) => {
      r.isPrimary = r.id === id;
    });
    return true;
  }

  async renameResume(id: string, newTitle: string, userId?: string): Promise<Resume | null> {
    if (isSupabaseConfigured() && userId) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
          .from("resumes")
          .update({ title: newTitle, updated_at: new Date().toISOString() })
          .eq("id", id)
          .eq("user_id", userId)
          .select()
          .single();

        if (!error && data) {
          return {
            id: data.id,
            userId: data.user_id,
            title: data.title,
            fileName: data.file_name,
            fileSize: Number(data.file_size),
            fileType: data.file_type as "pdf" | "docx",
            fileUrl: data.file_path,
            isPrimary: Boolean(data.is_primary),
            status: data.status,
            parseStatus: data.parse_status,
            analyzedAt: data.analyzed_at,
            atsScore: data.ats_score ? Number(data.ats_score) : undefined,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      } catch (err) {
        console.warn("[ResumeService] Error renaming resume in Supabase:", err);
      }
    }

    const resume = mockResumes.find((r) => r.id === id);
    if (!resume) return null;
    resume.title = newTitle;
    resume.updatedAt = new Date().toISOString();
    return { ...resume };
  }

  async deleteResume(id: string, userId?: string): Promise<boolean> {
    if (isSupabaseConfigured() && userId) {
      try {
        const supabase = await createServerSupabaseClient();
        const { error } = await supabase.from("resumes").delete().eq("id", id).eq("user_id", userId);
        if (!error) return true;
      } catch (err) {
        console.warn("[ResumeService] Error deleting resume from Supabase:", err);
      }
    }

    const index = mockResumes.findIndex((r) => r.id === id);
    if (index === -1) return false;
    mockResumes.splice(index, 1);
    if (mockResumes.length > 0 && !mockResumes.some((r) => r.isPrimary)) {
      mockResumes[0].isPrimary = true;
    }
    return true;
  }

  async uploadMockResume(
    data: {
      title: string;
      fileName: string;
      fileSize: number;
      fileType: "pdf" | "docx";
    },
    userId: string = "usr_mock_01"
  ): Promise<Resume> {
    ResumeService.validateResumeFile({
      name: data.fileName,
      size: data.fileSize,
      type: data.fileType,
    });

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        // Parse with parser service abstraction
        const parsed = await this.parserService.parseResume(data.fileName, data.fileName);

        const { data: dbResume, error } = await supabase
          .from("resumes")
          .insert({
            user_id: userId,
            title: data.title,
            file_name: data.fileName,
            file_size: data.fileSize,
            file_type: data.fileType,
            file_path: `/storage/resumes/${data.fileName}`,
            is_primary: false,
            status: "active",
            parse_status: "PARSED",
            analyzed_at: new Date().toISOString(),
            ats_score: parsed.estimatedAtsScore,
          })
          .select()
          .single();

        if (!error && dbResume) {
          return {
            id: dbResume.id,
            userId: dbResume.user_id,
            title: dbResume.title,
            fileName: dbResume.file_name,
            fileSize: Number(dbResume.file_size),
            fileType: dbResume.file_type as "pdf" | "docx",
            fileUrl: dbResume.file_path,
            isPrimary: Boolean(dbResume.is_primary),
            status: "active",
            parseStatus: "completed",
            analyzedAt: dbResume.analyzed_at,
            atsScore: Number(dbResume.ats_score),
            createdAt: dbResume.created_at,
            updatedAt: dbResume.updated_at,
          };
        }
      } catch (err) {
        console.warn("[ResumeService] Error creating resume in Supabase:", err);
      }
    }

    const newResume: Resume = {
      id: `res_${Date.now()}`,
      userId,
      title: data.title,
      fileName: data.fileName,
      fileSize: data.fileSize,
      fileType: data.fileType,
      fileUrl: `/mock/resumes/${data.fileName}`,
      isPrimary: mockResumes.length === 0,
      status: "active",
      parseStatus: "completed",
      analyzedAt: new Date().toISOString(),
      atsScore: 88,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockResumes.push(newResume);
    return newResume;
  }

  async getResumeAnalysis(id: string): Promise<ResumeAnalysisResult> {
    const resume = mockResumes.find((r) => r.id === id) || mockResumes[0];
    const score = resume?.atsScore || 90;

    return {
      atsScore: score,
      formatScore: 95,
      keywordMatchScore: 88,
      bulletImpactScore: 92,
      strengths: [
        "Consistent reverse-chronological layout with standard section headers recognized by all major ATS parsers.",
        "Strong quantifiable impact metrics ('45M+ daily requests', '$120k annually saved', '38% latency reduction').",
        "Clear technical skill taxonomy categorized by programming languages, frameworks, and infrastructure.",
      ],
      improvements: [
        "Include more explicit references to cloud cost monitoring tools (e.g. AWS Cost Explorer, Datadog Billing).",
        "Add brief summaries for open-source project outcomes alongside direct GitHub references.",
        "Ensure bullet points in the earliest positions maintain active voice and outcome-focused verbs.",
      ],
      detectedKeywords: [
        "TypeScript",
        "Next.js",
        "React",
        "PostgreSQL",
        "Go",
        "Kafka",
        "Docker",
        "Kubernetes",
        "AWS",
        "Microservices",
        "CI/CD",
        "Distributed Systems",
      ],
      missingKeywords: [
        "Terraform",
        "GraphQL Federation",
        "Site Reliability Engineering (SRE)",
        "SOC2 Compliance",
      ],
    };
  }
}

export const resumeService = new ResumeService();
