import { NextResponse } from "next/server";
import { supportService } from "@/lib/services/support-service";
import { AuthService } from "@/lib/services/auth-service";

export async function GET() {
  try {
    const user = await AuthService.getCurrentUser();
    const tickets = await supportService.getTickets(user?.id);
    return NextResponse.json({ success: true, data: tickets });
  } catch (error) {
    console.error("[API support GET]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve support tickets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await AuthService.getCurrentUser();
    const body = await request.json();
    const { subject, category, message } = body;

    if (!subject || !category || !message) {
      return NextResponse.json(
        { success: false, error: "Subject, category, and message are required" },
        { status: 400 }
      );
    }

    const ticket = await supportService.createTicket(
      { subject, category, message },
      user?.id || "usr_mock_01",
      user?.name || "Candidate",
      user?.email || "candidate@example.com"
    );

    return NextResponse.json({ success: true, data: ticket }, { status: 201 });
  } catch (error) {
    console.error("[API support POST]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create support ticket" },
      { status: 500 }
    );
  }
}
