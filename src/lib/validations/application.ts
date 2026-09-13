import { z } from "zod";

export const applicationCreateSchema = z.object({
  jobTitle: z.string().min(2, "Job title is required"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().min(2, "Location is required"),
  status: z.enum([
    "saved",
    "applied",
    "recruiter_contacted",
    "interview",
    "offer",
    "rejected",
    "withdrawn",
  ]),
  appliedDate: z.string().optional(),
  salaryOffered: z.coerce.number().optional(),
  notes: z.string().optional(),
  nextAction: z.string().optional(),
  nextActionDueDate: z.string().optional(),
  recruiterName: z.string().optional(),
  recruiterEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  recruiterTitle: z.string().optional(),
});

export const applicationStatusUpdateSchema = z.object({
  id: z.string().min(1),
  status: z.enum([
    "saved",
    "applied",
    "recruiter_contacted",
    "interview",
    "offer",
    "rejected",
    "withdrawn",
  ]),
});
