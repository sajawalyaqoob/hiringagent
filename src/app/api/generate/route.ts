import { NextResponse } from "next/server";
import { generationService } from "@/lib/services/generation-service";
import { AuthService } from "@/lib/services/auth-service";
import { RateLimitService } from "@/lib/services/rate-limit-service";
import { UsageService } from "@/lib/services/usage-service";
import type { GenerationType } from "@/types/database";

export async function GET() {
  try {
    const user = await AuthService.getCurrentUser();
    const recent = await generationService.getRecentGenerations(user?.id);
    return NextResponse.json({ success: true, data: recent });
  } catch (error) {
    console.error("[API generate GET]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve recent generations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await AuthService.getCurrentUser();
    const userId = user?.id || "usr_mock_01";

    // Rate limiting check
    const rateLimit = await RateLimitService.check(`gen_${userId}`, 20, 60);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { type, jobTitle, company, jobDescription, tone, keyHighlights, recipientName, jobId, candidateName } = body;

    if (!type || !jobTitle || !company) {
      return NextResponse.json(
        { success: false, error: "type, jobTitle, and company are required fields" },
        { status: 400 }
      );
    }

    // Record usage category
    const categoryMap: Record<string, any> = {
      tailored_resume: "resume_generation",
      linkedin_post: "linkedin_generation",
      recruiter_email: "email_generation",
      recruiter_message: "email_generation",
      cover_letter: "email_generation",
    };
    const usageCategory = categoryMap[type] || "resume_generation";
    await UsageService.recordUsage(userId, usageCategory);

    const generation = await generationService.generateArtifact(
      {
        type: type as GenerationType,
        jobId,
        jobTitle,
        company,
        jobDescription: jobDescription || "",
        tone,
        keyHighlights,
        recipientName,
        candidateName,
      },
      userId
    );

    return NextResponse.json({ success: true, data: generation }, { status: 201 });
  } catch (error) {
    console.error("[API generate POST]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate artifact" },
      { status: 500 }
    );
  }
}
