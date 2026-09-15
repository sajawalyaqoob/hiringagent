import { NextResponse } from "next/server";
import { supportService } from "@/lib/services/support-service";
import { notificationService } from "@/lib/services/notification-service";
import { AuthService } from "@/lib/services/auth-service";

export async function GET() {
  try {
    const user = await AuthService.getCurrentUser();
    if (user && user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const tickets = await supportService.getAllTicketsForAdmin();
    return NextResponse.json({ success: true, data: tickets });
  } catch (error) {
    console.error("[API admin support GET]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve support tickets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await AuthService.getCurrentUser();
    if (user && user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { action, ticketId, response, status, userId, notificationTitle, notificationMessage } = body;

    if (action === "respond_ticket") {
      if (!ticketId || !response) {
        return NextResponse.json({ success: false, error: "ticketId and response are required" }, { status: 400 });
      }

      const updated = await supportService.respondToTicket(ticketId, response, status || "resolved");
      return NextResponse.json({ success: true, message: "Support ticket updated and user notified!", data: updated });
    }

    if (action === "send_notification") {
      if (!userId || !notificationTitle || !notificationMessage) {
        return NextResponse.json({ success: false, error: "userId, notificationTitle, and notificationMessage are required" }, { status: 400 });
      }

      const notif = await notificationService.createNotification({
        userId,
        title: notificationTitle,
        message: notificationMessage,
        type: "info",
        link: "/dashboard/support",
      });

      return NextResponse.json({ success: true, message: "Notification sent to user successfully!", data: notif });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[API admin support POST]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process admin support action" },
      { status: 500 }
    );
  }
}
