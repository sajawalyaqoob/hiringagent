import { isSupabaseConfigured, createServerSupabaseClient } from "../supabase/server";
import { mockGenerations } from "@/lib/server/mock-db";
import { DefaultAIProvider } from "../ai/provider";
import { profileService, type FullProfileData } from "./profile-service";
import { getDomainById } from "../config/domains";
import type { Generation, GenerationType } from "@/types/database";

export interface GenerateInputParams {
  type: GenerationType;
  jobId?: string;
  jobTitle: string;
  company: string;
  jobDescription?: string;
  tone?: "professional" | "confident" | "enthusiastic" | "concise";
  keyHighlights?: string;
  recipientName?: string;
  candidateName?: string;
  fullProfile?: FullProfileData;
}

export class GenerationService {
  private aiProvider = new DefaultAIProvider();

  async getRecentGenerations(userId?: string): Promise<Generation[]> {
    if (isSupabaseConfigured() && userId) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
          .from("generations")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (!error && data) {
          return data.map((g: any) => ({
            id: g.id,
            userId: g.user_id,
            type: g.generation_type as GenerationType,
            jobId: g.job_id,
            jobTitle: g.input_metadata?.jobTitle || "Job Target",
            company: g.input_metadata?.company || "Company",
            status: g.status,
            inputs: g.input_metadata || {},
            outputContent: g.output_content,
            errorMessage: g.error_message,
            createdAt: g.created_at,
            updatedAt: g.updated_at,
          }));
        }
      } catch (err) {
        console.warn("[GenerationService] Error fetching generations from Supabase:", err);
      }
    }
    return [...mockGenerations];
  }

  async generateArtifact(params: GenerateInputParams, userId: string = "usr_mock_01"): Promise<Generation> {
    const tone = params.tone || "professional";
    const recipient = params.recipientName || "Hiring Manager";
    let generatedOutput = "";

    // Load actual user profile from DB if not provided
    const userProfileData: FullProfileData =
      params.fullProfile || (await profileService.getFullProfile(userId));
    const p = userProfileData.profile;
    const candidateName = params.candidateName || p.fullName || "Candidate Name";
    const domainObj = getDomainById(p.industry || "cs_it");

    const skillsString = userProfileData.skills.map((s) => s.name).join(", ");
    const expString = userProfileData.experiences
      .map(
        (e) =>
          `${e.jobTitle} at ${e.company} (${e.startDate || ""} - ${e.endDate || "Present"}):\n${(e.responsibilities || []).map((r) => `  • ${r}`).join("\n")}`
      )
      .join("\n\n");
    const eduString = userProfileData.education
      .map((e) => `${e.degree} — ${e.institution} (${e.startDate || ""} - ${e.endDate || ""})`)
      .join("\n");

    if (this.aiProvider.getActiveProvider() !== "mock") {
      try {
        const livePrompt = `You are an expert career consultant generating a tailored ${params.type.replace(/_/g, " ")} for a candidate in the field of "${domainObj.label}".

CANDIDATE DETAILS:
Full Name: ${candidateName}
Career Domain: ${domainObj.label}
Professional Headline: ${p.professionalHeadline || domainObj.defaultHeadline}
Current / Desired Job Title: ${p.currentJobTitle || domainObj.defaultJobTitle}
Years of Experience: ${p.yearsOfExperience || 0}
Location: ${p.location || "Remote"}
Email: ${p.email || ""}
Phone: ${p.phone || ""}
LinkedIn: ${p.linkedInUrl || ""}
GitHub / Portfolio: ${p.githubUrl || p.portfolioUrl || ""}
Executive Summary / Bio: ${p.bio || ""}

VERIFIED SKILLS:
${skillsString || "Core Domain Competencies"}

WORK HISTORY:
${expString || "Relevant professional experience in " + domainObj.label}

EDUCATION:
${eduString || "Academic degree and qualifications"}

TARGET OPPORTUNITY:
Job Title: ${params.jobTitle}
Target Company: ${params.company}
Recipient: ${recipient}
Tone: ${tone}
Job Description / Context:
${params.jobDescription || `Role for ${params.jobTitle} at ${params.company}`}

Additional Highlights:
${params.keyHighlights || "Focus on domain expertise, quantifiable accomplishments, and seamless alignment."}

MANDATORY RULES:
1. Format output cleanly in Markdown.
2. Tailor SPECIFICALLY to candidate's field (${domainObj.label}) and target company (${params.company}).
3. DO NOT invent fake companies, degrees, or licenses not listed in candidate context.
4. Highlight active verbs, key results, and domain skills.`;

        const systemPrompt = `You are Groq AI Tailor operating under strict Zero-Hallucination rules for HireBoost AI. Adapt content strictly to candidate field (${domainObj.label}).`;

        generatedOutput = await this.aiProvider.generateText(livePrompt, systemPrompt);
      } catch (aiErr) {
        console.warn("[GenerationService] Live AI generation failed, using dynamic candidate fallback:", aiErr);
      }
    }

    if (!generatedOutput) {
      switch (params.type) {
        case "tailored_resume":
          generatedOutput = `# ${candidateName}
${p.location || "Open to Remote"} | ${p.email || "email@example.com"} | ${p.phone || ""} | ${p.linkedInUrl || ""}

## Executive Summary (Tailored for ${params.jobTitle} at ${params.company})
${p.bio || `${candidateName} is a dedicated ${p.currentJobTitle || domainObj.defaultJobTitle} specializing in ${domainObj.label}. Tailored for ${params.company}, offering proven expertise, commitment to quality, and strong alignment with organizational goals.`}

## Core Relevant Skills & Competencies
${skillsString ? skillsString.split(", ").map((s) => `- **${s}**`).join("\n") : `- **Domain Expertise:** ${domainObj.label}\n- **Strategic Execution:** Quality assurance & process management`}

## Professional Experience
${userProfileData.experiences.length > 0 ? expString : `### ${p.currentJobTitle || domainObj.defaultJobTitle} — Primary Practice
*2022 – Present*
- Delivered high-value projects aligned with ${domainObj.label} industry standards.
- Optimized team workflows and ensured compliance across key deliverables.`}

## Education & Qualifications
${userProfileData.education.length > 0 ? eduString : `- **Degree in ${domainObj.label}** | Accredited Institution`}`;
          break;

        case "cover_letter":
          generatedOutput = `Dear ${recipient},

I am writing to express my strong interest in the ${params.jobTitle} position at ${params.company}. With a solid background in ${domainObj.label} and a proven track record as a ${p.currentJobTitle || domainObj.defaultJobTitle}, I am eager to contribute to ${params.company}'s continued success.

${userProfileData.experiences.length > 0 ? `In my recent experience as ${userProfileData.experiences[0].jobTitle} at ${userProfileData.experiences[0].company}, I successfully managed core initiatives and delivered quantifiable results.` : `Throughout my career in ${domainObj.label}, I have consistently prioritized high quality, efficiency, and collaborative problem-solving.`}

${params.keyHighlights ? `Specifically, ${params.keyHighlights}` : `Your organization's reputation for excellence strongly aligns with my professional values and expertise in ${skillsString || domainObj.label}.`}

I welcome the opportunity to discuss how my background and dedicated approach can add value to ${params.company}. Thank you for your time and consideration.

Warm regards,
${candidateName}
${p.email || ""} | ${p.phone || ""}`;
          break;

        case "recruiter_email":
          generatedOutput = `Subject: ${params.jobTitle} Application — ${candidateName} for ${params.company}

Hi ${recipient},

I hope you are having a productive week.

I noticed ${params.company}'s opening for the ${params.jobTitle} position and wanted to reach out directly. As a ${p.currentJobTitle || domainObj.defaultJobTitle} with experience in ${domainObj.label}, I have closely followed ${params.company}'s work and would love to bring my expertise to your team.

Key Highlights of My Profile:
• Specialized in ${domainObj.label} with core skills in ${skillsString || "strategic execution"}.
${userProfileData.experiences.length > 0 ? `• Recent position: ${userProfileData.experiences[0].jobTitle} at ${userProfileData.experiences[0].company}.` : ""}
• Track record of delivering quality outcomes on time.

I would appreciate 10 minutes to learn more about your current priorities for the ${params.jobTitle} role.

Best regards,
${candidateName}
${p.linkedInUrl || p.email || ""}`;
          break;

        case "recruiter_message":
          generatedOutput = `Hi ${recipient} — I saw that ${params.company} is hiring for a ${params.jobTitle}. As a ${p.currentJobTitle || domainObj.defaultJobTitle} with background in ${domainObj.label}, I would love to connect and share how my experience in ${skillsString ? skillsString.slice(0, 60) : domainObj.label} can support your team!`;
          break;

        case "linkedin_post":
          generatedOutput = `🚀 Excited to announce I am exploring new opportunities in ${domainObj.label}!

As a ${p.currentJobTitle || domainObj.defaultJobTitle}, I specialize in delivering high-quality results, leading key initiatives, and applying domain expertise in ${skillsString || domainObj.label}.

Target Roles:
🔹 ${params.jobTitle}
🔹 ${p.currentJobTitle || domainObj.defaultJobTitle}

If your team or network is looking for a dedicated ${domainObj.label} professional, let's connect!

#CareerOpportunities #${domainObj.label.replace(/[^a-zA-Z0-9]/g, "")} #OpenToWork`;
          break;

        case "application_strategy":
          generatedOutput = `# Application Strategy: ${params.jobTitle} at ${params.company}

## 1. Candidate Match Profile
- **Candidate Field:** ${domainObj.label}
- **Target Role:** ${params.jobTitle}
- **Target Company:** ${params.company}

## 2. Key Action Plan
1. **Tailored CV Submission:** Highlight verified skills (${skillsString || "Core Domain Skills"}).
2. **Direct Outreach:** Send personalized recruiter email to ${recipient} at ${params.company}.
3. **Interview Preparation:** Prepare 2 concrete examples of project delivery from recent work history.`;
          break;
      }
    }

    const newGen: Generation = {
      id: `gen_${Date.now().toString(36)}`,
      userId,
      type: params.type,
      jobId: params.jobId,
      jobTitle: params.jobTitle,
      company: params.company,
      status: "completed",
      inputs: {
        tone,
        keyHighlights: params.keyHighlights,
        recipientName: params.recipientName,
        jobTitle: params.jobTitle,
        company: params.company,
        domainField: domainObj.label,
      },
      outputContent: generatedOutput,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: dbGen } = await supabase
          .from("generations")
          .insert({
            user_id: userId,
            generation_type: params.type,
            job_id: params.jobId || null,
            status: "completed",
            input_metadata: newGen.inputs,
            output_content: generatedOutput,
          })
          .select()
          .single();

        if (dbGen) {
          newGen.id = dbGen.id;
        }
      } catch (err) {
        console.warn("[GenerationService] Error saving generation to Supabase:", err);
      }
    }

    mockGenerations.unshift(newGen);
    return newGen;
  }
}

export const generationService = new GenerationService();
