import { z } from "zod";

export const jobDescriptionSchema = z.object({
  title: z.string().min(2, "Job title is required"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().min(2, "Location is required"),
  sourceUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  description: z.string().min(50, "Job description must be at least 50 characters to analyze"),
});

export const jobFilterSchema = z.object({
  query: z.string().optional(),
  minMatchScore: z.coerce.number().min(0).max(100).optional(),
  workplaceType: z.enum(["remote", "hybrid", "on_site", "any"]).optional(),
  seniority: z.enum(["intern", "entry", "mid", "senior", "lead", "principal", "executive"]).optional(),
  employmentType: z.enum(["full_time", "part_time", "contract", "freelance", "internship"]).optional(),
  location: z.string().optional(),
  minSalary: z.coerce.number().optional(),
});
