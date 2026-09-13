import { NextResponse } from "next/server";
import { ResumeParserService } from "@/lib/services/resume-parser-service";
import { ResumeTextExtractor } from "@/lib/services/resume-text-extractor";
import { AuthService } from "@/lib/services/auth-service";

export async function POST(request: Request) {
  try {
    const user = await AuthService.getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No resume file provided in request" },
        { status: 400 }
      );
    }

    // Validate size and file format
    ResumeTextExtractor.validate({ name: file.name, size: file.size, type: file.type });

    const arrayBuffer = await file.arrayBuffer();
    const parser = new ResumeParserService();
    const parseResult = await parser.parseResume(arrayBuffer, file.name);

    // Return proposed changes for user preview/confirmation (Does NOT overwrite profile automatically)
    return NextResponse.json({
      success: true,
      message: "Resume parsed successfully. Review proposed profile updates before applying.",
      data: {
        fileName: file.name,
        fileSize: file.size,
        extracted: parseResult,
        proposedChanges: {
          personal: {
            fullName: parseResult.extractedName,
            email: parseResult.extractedEmail,
            phone: parseResult.extractedPhone,
            professionalHeadline: parseResult.extractedHeadline,
          },
          skills: parseResult.extractedSkills,
          experiences: parseResult.extractedExperiences,
          education: parseResult.extractedEducation,
        },
      },
    });
  } catch (error) {
    console.error("[API resumes/parse POST]:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to parse resume file" },
      { status: 500 }
    );
  }
}
