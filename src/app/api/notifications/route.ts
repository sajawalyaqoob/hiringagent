import { NextResponse } from "next/server";
import { notificationService } from "@/lib/services/notification-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;
    const notifications = await notificationService.getNotifications(userId);
    return NextResponse.json({ success: true, data: notifications });
  } catch (error: any) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { notificationId } = body;
    if (!notificationId) {
      return NextResponse.json({ success: false, error: "notificationId is required" }, { status: 400 });
    }
    await notificationService.markAsRead(notificationId);
    return NextResponse.json({ success: true, message: "Notification marked as read" });
  } catch (error: any) {
    console.error("PATCH /api/notifications error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update notification" },
      { status: 500 }
    );
  }
}
