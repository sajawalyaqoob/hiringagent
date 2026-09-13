import { NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth-service";

export async function GET() {
  try {
    const user = await AuthService.getCurrentUser();
    return NextResponse.json({
      success: true,
      isAuthenticated: Boolean(user),
      user,
    });
  } catch (error) {
    console.error("[API auth GET]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify session" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    if (action === "signup") {
      if (!email || !password || !name) {
        return NextResponse.json(
          { success: false, error: "email, password, and name are required" },
          { status: 400 }
        );
      }
      const result = await AuthService.signUp(email, password, name);
      if (result.error) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, user: result.user });
    }

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json(
          { success: false, error: "email and password are required" },
          { status: 400 }
        );
      }
      const result = await AuthService.signIn(email, password);
      if (result.error) {
        return NextResponse.json({ success: false, error: result.error }, { status: 401 });
      }
      return NextResponse.json({ success: true, user: result.user });
    }

    if (action === "logout") {
      await AuthService.signOut();
      return NextResponse.json({ success: true, message: "Logged out successfully" });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[API auth POST]:", error);
    return NextResponse.json(
      { success: false, error: "Authentication request failed" },
      { status: 500 }
    );
  }
}
