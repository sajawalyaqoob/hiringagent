import { NextResponse } from "next/server";
import { profileService } from "@/lib/services/profile-service";
import { profileSchema } from "@/lib/validations/profile";
import { AuthService } from "@/lib/services/auth-service";

export async function GET() {
  try {
    const user = await AuthService.getCurrentUser();
    const data = await profileService.getFullProfile(user?.id);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[API profile GET]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve career profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await AuthService.getCurrentUser();
    const body = await request.json();
    const validated = profileSchema.partial().safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await profileService.updateProfile(validated.data, user?.id);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[API profile PUT]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update career profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await AuthService.getCurrentUser();
    const body = await request.json();
    const updated = await profileService.saveOnboarding(body, user?.id);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[API profile POST]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save profile onboarding" },
      { status: 500 }
    );
  }
}
