import { z } from "zod";

export const resumeUploadSchema = z.object({
  title: z.string().min(2, "Resume title is required"),
  fileType: z.enum(["pdf", "docx"]),
  fileSize: z.number().max(10 * 1024 * 1024, "File size must be under 10MB"),
});

export const resumeRenameSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(2, "Resume title must be at least 2 characters"),
});
