import { NextResponse } from "next/server";
import { SkillService } from "@/lib/services/skill-service";
import { AuthService } from "@/lib/services/auth-service";
import { profileService } from "@/lib/services/profile-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (query !== null) {
      const results = SkillService.searchPresetSkills(query);
      return NextResponse.json({ success: true, data: results });
    }

    const user = await AuthService.getCurrentUser();
    const full = await profileService.getFullProfile(user?.id);
    const userSkills = await SkillService.getUserSkills(full.profile.id);

    return NextResponse.json({ success: true, data: userSkills });
  } catch (error) {
    console.error("[API skills GET]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await AuthService.getCurrentUser();
    const full = await profileService.getFullProfile(user?.id);
    const body = await request.json();

    const { skillName, category, proficiencyLevel, yearsOfExperience, evidenceSource, evidenceNotes } = body;

    if (!skillName || !category) {
      return NextResponse.json(
        { success: false, error: "skillName and category are required" },
        { status: 400 }
      );
    }

    const saved = await SkillService.addOrUpdateSkill(full.profile.id, {
      skillName,
      category,
      proficiencyLevel: proficiencyLevel || "Intermediate",
      yearsOfExperience: Number(yearsOfExperience || 0),
      verifiedViaInterview: false,
      evidenceSource: evidenceSource || "claimed_by_user",
      evidenceNotes: evidenceNotes || "",
    });

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    console.error("[API skills POST]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save skill" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await AuthService.getCurrentUser();
    const full = await profileService.getFullProfile(user?.id);
    const { searchParams } = new URL(request.url);
    const skillName = searchParams.get("skillName");

    if (!skillName) {
      return NextResponse.json(
        { success: false, error: "skillName is required" },
        { status: 400 }
      );
    }

    await SkillService.deleteSkill(full.profile.id, skillName);
    return NextResponse.json({ success: true, message: "Skill removed" });
  } catch (error) {
    console.error("[API skills DELETE]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete skill" },
      { status: 500 }
    );
  }
}
