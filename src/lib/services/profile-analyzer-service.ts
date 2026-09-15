import { DefaultAIProvider } from "../ai/provider";
import type { FullProfileData } from "./profile-service";
import { getDomainById } from "../config/domains";

export interface ProfileStrengthAnalysis {
  overallScore: number;
  gradeLabel: string;
  fieldDomain: string;
  strengthsHighlighted: string[];
  missingFieldGaps: string[];
  actionableRecommendations: string[];
  atsOptimizationTips: string[];
}

export class ProfileAnalyzerService {
  private aiProvider = new DefaultAIProvider();

  async analyzeProfile(fullProfile: FullProfileData): Promise<ProfileStrengthAnalysis> {
    const p = fullProfile.profile;
    const domainId = p.industry || "cs_it";
    const domainObj = getDomainById(domainId);

    const candidateSummary = `
Name: ${p.fullName || "Candidate"}
Career Field / Industry: ${p.industry || domainObj.label}
Current Job Title: ${p.currentJobTitle || domainObj.defaultJobTitle}
Years of Experience: ${p.yearsOfExperience || 0}
Headline: ${p.professionalHeadline || ""}
Location: ${p.location || ""}
Email: ${p.email || ""}
Phone: ${p.phone || ""}
LinkedIn: ${p.linkedInUrl || ""}
GitHub / Portfolio: ${p.githubUrl || p.portfolioUrl || ""}
Executive Summary / Bio: ${p.bio || "Not provided"}

Education (${fullProfile.education.length} entries):
${fullProfile.education.map((e) => `- ${e.degree} at ${e.institution} (${e.startDate || ""} - ${e.endDate || ""})`).join("\n")}

Experience (${fullProfile.experiences.length} entries):
${fullProfile.experiences.map((exp) => `- ${exp.jobTitle} at ${exp.company} (${exp.startDate || ""} - ${exp.endDate || "Present"}): ${exp.responsibilities.slice(0, 2).join("; ")}`).join("\n")}

Skills (${fullProfile.skills.length} listed):
${fullProfile.skills.map((s) => s.name).join(", ")}
`;

    // Try calling Groq AI
    if (this.aiProvider.getActiveProvider() !== "mock") {
      try {
        const prompt = `You are a top executive recruiter and ATS resume auditor evaluating a candidate's profile for the "${domainObj.label}" field.

Candidate Profile Data:
${candidateSummary}

Analyze this profile specifically for the candidate's field (${domainObj.label}). Provide a structured JSON evaluation with the following fields:
1. overallScore: number from 0 to 100 representing overall profile strength.
2. gradeLabel: string short grade (e.g. "Executive Gold", "Strong Professional", "Needs Key Details").
3. strengthsHighlighted: array of 3 specific candidate strengths.
4. missingFieldGaps: array of 3 specific missing items needed for ${domainObj.label} (e.g., medical licenses for healthcare, CPA/auditing software for accountants, PE license for engineers, portfolio for designers, GitHub for developers).
5. actionableRecommendations: array of 3 clear steps to boost interview callback rate.
6. atsOptimizationTips: array of 2 bullet points for ATS formatting.

Return ONLY raw valid JSON.`;

        const systemInstruction = `You are Groq AI Career Auditor operating under strict domain-tailored rules. Adapt evaluation specifically to the candidate's field (${domainObj.label}). Do not force tech skills on non-tech roles.`;

        const rawResult = await this.aiProvider.generateText(prompt, systemInstruction);
        const cleaned = rawResult.replace(/^```json/, "").replace(/```$/, "").trim();
        const parsed = JSON.parse(cleaned);

        if (parsed && typeof parsed.overallScore === "number") {
          return {
            overallScore: Math.min(100, Math.max(10, parsed.overallScore)),
            gradeLabel: parsed.gradeLabel || "Strong Professional",
            fieldDomain: domainObj.label,
            strengthsHighlighted: Array.isArray(parsed.strengthsHighlighted) ? parsed.strengthsHighlighted : [],
            missingFieldGaps: Array.isArray(parsed.missingFieldGaps) ? parsed.missingFieldGaps : [],
            actionableRecommendations: Array.isArray(parsed.actionableRecommendations) ? parsed.actionableRecommendations : [],
            atsOptimizationTips: Array.isArray(parsed.atsOptimizationTips) ? parsed.atsOptimizationTips : [],
          };
        }
      } catch (err) {
        console.warn("[ProfileAnalyzerService] Groq AI profile analysis error, using calculated fallback:", err);
      }
    }

    // Dynamic calculated fallback based on candidate domain
    const baseScore = fullProfile.completion.percentage;
    const strengths: string[] = [];
    const gaps: string[] = [];
    const recommendations: string[] = [];

    if (p.fullName && p.email) {
      strengths.push(`Complete identity & contact credentials set for ${p.fullName}`);
    }
    if (fullProfile.experiences.length > 0) {
      strengths.push(`Verified work experience entries (${fullProfile.experiences.length} positions)`);
    } else {
      gaps.push(`Add work history detailing achievements and duties`);
      recommendations.push(`List at least 2 work history entries with explicit time periods`);
    }

    if (fullProfile.education.length > 0) {
      strengths.push(`Formal degree listed: ${fullProfile.education[0].degree}`);
    } else {
      gaps.push(`Missing degree or academic credential for ${domainObj.label}`);
      recommendations.push(`Add formal degree or relevant certifications`);
    }

    if (fullProfile.skills.length >= 5) {
      strengths.push(`Core domain skills categorized (${fullProfile.skills.length} skills)`);
    } else {
      gaps.push(`List more domain-specific skills for ${domainObj.label}`);
      recommendations.push(`Add at least 5 primary skills relevant to ${domainObj.label}`);
    }

    if (domainObj.id === "healthcare_medicine" && !p.bio?.toLowerCase().includes("license")) {
      gaps.push("Specify medical license / board certification status");
    } else if (domainObj.id === "accounting_finance" && !fullProfile.skills.some(s => s.name.toLowerCase().includes("excel") || s.name.toLowerCase().includes("sap"))) {
      gaps.push("Include financial ERP or auditing software proficiency (e.g. QuickBooks, SAP, Excel)");
    } else if (domainObj.id === "cs_it" && !p.githubUrl) {
      gaps.push("Add direct GitHub repository or code portfolio links");
    }

    return {
      overallScore: baseScore,
      gradeLabel: baseScore > 85 ? "Executive Gold" : baseScore > 65 ? "Strong Candidate" : "Setup In Progress",
      fieldDomain: domainObj.label,
      strengthsHighlighted: strengths.length > 0 ? strengths : ["Profile initialized with basic contact info"],
      missingFieldGaps: gaps.length > 0 ? gaps : ["Add quantified metric achievements to work history"],
      actionableRecommendations: recommendations.length > 0 ? recommendations : ["Use AI Studio to generate a tailored CV for target positions"],
      atsOptimizationTips: [
        `Ensure job title exactly matches target openings in ${domainObj.label}`,
        "Use standard month/year timeline formatting for recruiter screening",
      ],
    };
  }
}

export const profileAnalyzerService = new ProfileAnalyzerService();
