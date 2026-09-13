import { z } from "zod";

export const generationRequestSchema = z.object({
  type: z.enum([
    "tailored_resume",
    "cover_letter",
    "linkedin_post",
    "recruiter_email",
    "recruiter_message",
    "application_strategy",
  ]),
  jobId: z.string().optional(),
  jobTitle: z.string().min(2, "Job title is required"),
  company: z.string().min(2, "Company is required"),
  jobDescription: z.string().min(20, "Job description or key context required"),
  tone: z.enum(["professional", "confident", "enthusiastic", "concise"]).default("professional"),
  keyHighlights: z.string().optional(),
  recipientName: z.string().optional(),
});
