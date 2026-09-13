import { NextResponse } from "next/server";
import { CareerInterviewService } from "@/lib/services/career-interview-service";
import { AuthService } from "@/lib/services/auth-service";

export async function GET() {
  try {
    const user = await AuthService.getCurrentUser();
    const session = await CareerInterviewService.startOrGetSession(user?.id);
    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    console.error("[API interview GET]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load career interview session" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await AuthService.getCurrentUser();
    const body = await request.json();
    const { sessionId, answer } = body;

    if (!sessionId || !answer) {
      return NextResponse.json(
        { success: false, error: "sessionId and answer are required" },
        { status: 400 }
      );
    }

    const updatedSession = await CareerInterviewService.submitAnswer(sessionId, answer, user?.id);
    return NextResponse.json({ success: true, data: updatedSession });
  } catch (error) {
    console.error("[API interview POST]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process interview response" },
      { status: 500 }
    );
  }
}
