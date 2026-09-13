import { z } from "zod";

export type AIProviderType = "groq" | "gemini" | "openai" | "anthropic" | "mock";

export interface AIProviderConfig {
  provider: AIProviderType;
  apiKey?: string;
  modelName?: string;
}

export const TailoredResumeOutputSchema = z.object({
  professionalSummary: z.string(),
  highlightedSkills: z.array(z.string()),
  improvedBullets: z.array(
    z.object({
      original: z.string(),
      improved: z.string(),
      reason: z.string(),
    })
  ),
  atsKeywordAlignment: z.array(z.string()),
});

export type TailoredResumeOutput = z.infer<typeof TailoredResumeOutputSchema>;

export const LinkedInPostOutputSchema = z.object({
  postContent: z.string(),
  hashtags: z.array(z.string()),
  callToAction: z.string(),
});

export type LinkedInPostOutput = z.infer<typeof LinkedInPostOutputSchema>;

export const ColdEmailOutputSchema = z.object({
  subject: z.string(),
  greeting: z.string(),
  introduction: z.string(),
  valueProposition: z.string(),
  callToAction: z.string(),
  closing: z.string(),
  fullEmailText: z.string(),
});

export type ColdEmailOutput = z.infer<typeof ColdEmailOutputSchema>;

export const RecruiterMessageOutputSchema = z.object({
  messageType: z.enum(["linkedin_inmail", "email_followup", "direct_message"]),
  subject: z.string().optional(),
  messageText: z.string(),
  suggestedFollowupDays: z.number().default(4),
});

export type RecruiterMessageOutput = z.infer<typeof RecruiterMessageOutputSchema>;
