import { NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth-service";
import { getDb } from "@/lib/db/neon";

export async function GET() {
  try {
    const user = await AuthService.getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Access denied. Admin role required." }, { status: 403 });
    }

    const db = getDb();

    // 1. Fetch all payment submissions with associated user details
    const payments = await db`
      SELECT 
        p.id,
        p.user_id as "userId",
        u.name as "userName",
        u.email as "userEmail",
        u.subscription_status as "userSubscriptionStatus",
        p.plan_id as "planId",
        p.plan_name as "planName",
        p.amount_pkr as "amountPkr",
        p.payment_method as "paymentMethod",
        p.sender_number as "senderNumber",
        p.transaction_id as "transactionId",
        p.screenshot_url as "screenshotUrl",
        p.status,
        p.admin_notes as "adminNotes",
        p.created_at as "createdAt",
        p.reviewed_at as "reviewedAt"
      FROM payments p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `;

    // 2. Fetch all registered users for management
    const users = await db`
      SELECT 
        id,
        email,
        name,
        role,
        subscription_tier as "subscriptionTier",
        subscription_status as "subscriptionStatus",
        subscription_expires_at as "subscriptionExpiresAt",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM users
      ORDER BY created_at DESC
      LIMIT 100
    `;

    // 3. Compute dashboard summary statistics
    const totalPkr = payments
      .filter((p: any) => p.status === "approved")
      .reduce((sum: number, p: any) => sum + Number(p.amountPkr || 0), 0);

    const pendingCount = payments.filter((p: any) => p.status === "pending").length;
    const activeUsersCount = users.filter((u: any) => u.subscriptionStatus === "active").length;

    return NextResponse.json({
      success: true,
      payments: payments || [],
      users: users || [],
      stats: {
        totalRevenuePkr: totalPkr,
        pendingApprovals: pendingCount,
        activeSubscribers: activeUsersCount,
        totalUsers: users.length,
      },
    });
  } catch (error: any) {
    console.error("[API payments/admin GET]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load admin payment portal data." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await AuthService.getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Access denied. Admin role required." }, { status: 403 });
    }

    const body = await request.json();
    const { action, paymentId, userId, notes, status } = body;
    const db = getDb();

    if (action === "approve") {
      if (!paymentId) {
        return NextResponse.json({ success: false, error: "paymentId is required for approval." }, { status: 400 });
      }

      // Fetch payment record
      const rows = await db`SELECT * FROM payments WHERE id = ${paymentId} LIMIT 1`;
      if (!rows || rows.length === 0) {
        return NextResponse.json({ success: false, error: "Payment record not found." }, { status: 404 });
      }
      const payment = rows[0];

      // Expiry duration: 7 days for weekly, 30 days for monthly
      const isWeekly = payment.plan_id === "weekly";
      const daysToAdd = isWeekly ? 7 : 30;

      // Update payment record to approved
      await db`
        UPDATE payments
        SET 
          status = 'approved',
          admin_notes = ${notes || "Verified JazzCash transfer"},
          reviewed_at = NOW(),
          reviewed_by = ${user.id}
        WHERE id = ${paymentId}
      `;

      // Activate user account and set expiration date
      await db`
        UPDATE users
        SET 
          subscription_status = 'active',
          subscription_tier = ${payment.plan_id},
          subscription_expires_at = NOW() + (${daysToAdd} || ' days')::INTERVAL,
          updated_at = NOW()
        WHERE id = ${payment.user_id}
      `;

      return NextResponse.json({
        success: true,
        message: `Payment approved! User account activated for ${daysToAdd} days.`,
      });
    }

    if (action === "reject") {
      if (!paymentId) {
        return NextResponse.json({ success: false, error: "paymentId is required." }, { status: 400 });
      }

      const rows = await db`SELECT * FROM payments WHERE id = ${paymentId} LIMIT 1`;
      if (!rows || rows.length === 0) {
        return NextResponse.json({ success: false, error: "Payment record not found." }, { status: 404 });
      }
      const payment = rows[0];

      // Mark payment rejected
      await db`
        UPDATE payments
        SET 
          status = 'rejected',
          admin_notes = ${notes || "Payment verification failed. Invalid TID or screenshot."},
          reviewed_at = NOW(),
          reviewed_by = ${user.id}
        WHERE id = ${paymentId}
      `;

      // Set user status to rejected
      await db`
        UPDATE users
        SET 
          subscription_status = 'rejected',
          updated_at = NOW()
        WHERE id = ${payment.user_id}
      `;

      return NextResponse.json({
        success: true,
        message: "Payment marked as rejected.",
      });
    }

    if (action === "toggle_user_status") {
      if (!userId || !status) {
        return NextResponse.json({ success: false, error: "userId and status are required." }, { status: 400 });
      }

      await db`
        UPDATE users
        SET 
          subscription_status = ${status},
          updated_at = NOW()
        WHERE id = ${userId}
      `;

      return NextResponse.json({
        success: true,
        message: `User status changed to ${status}.`,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid admin action." }, { status: 400 });
  } catch (error: any) {
    console.error("[API payments/admin POST]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Admin payment operation failed." },
      { status: 500 }
    );
  }
}
