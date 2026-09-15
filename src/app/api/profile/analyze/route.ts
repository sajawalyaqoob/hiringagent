import { NextResponse } from "next/server";
import { profileService } from "@/lib/services/profile-service";
import { profileAnalyzerService } from "@/lib/services/profile-analyzer-service";
import { AuthService } from "@/lib/services/auth-service";

export async function GET() {
  try {
    const user = await AuthService.getCurrentUser();
    const fullProfile = await profileService.getFullProfile(user?.id);
    const analysis = await profileAnalyzerService.analyzeProfile(fullProfile);

    return NextResponse.json({ success: true, data: analysis });
  } catch (error) {
    console.error("[API profile analyze GET]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to perform Groq AI profile analysis" },
      { status: 500 }
    );
  }
}
