import { NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth-service";
import { getDb } from "@/lib/db/neon";
import { uploadImageToCloudinary } from "@/lib/cloudinary/uploader";

export async function GET() {
  try {
    const user = await AuthService.getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const payments = await db`
      SELECT 
        id,
        user_id as "userId",
        plan_id as "planId",
        plan_name as "planName",
        amount_pkr as "amountPkr",
        payment_method as "paymentMethod",
        sender_number as "senderNumber",
        transaction_id as "transactionId",
        screenshot_url as "screenshotUrl",
        status,
        admin_notes as "adminNotes",
        created_at as "createdAt",
        reviewed_at as "reviewedAt"
      FROM payments
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      success: true,
      data: payments || [],
      userStatus: user.subscriptionStatus,
      userTier: user.subscriptionTier,
      expiresAt: user.subscriptionExpiresAt,
    });
  } catch (error: any) {
    console.error("[API payments GET]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve payments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await AuthService.getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "You must be signed in to submit payment proof." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const planId = (formData.get("planId") as string) || "weekly";
    const senderNumber = (formData.get("senderNumber") as string)?.trim();
    const transactionId = (formData.get("transactionId") as string)?.trim();
    const file = formData.get("screenshot") as File | null;

    if (!senderNumber || !transactionId) {
      return NextResponse.json(
        { success: false, error: "JazzCash Sender Number and Transaction ID (TID) are required." },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Payment screenshot proof is required." },
        { status: 400 }
      );
    }

    // Determine plan pricing and label
    const isMonthly = planId === "monthly";
    const planName = isMonthly ? "Monthly Career Pro" : "Weekly Pro";
    const amountPkr = isMonthly ? 3499 : 1499;

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload screenshot to Cloudinary under folder 'hireagent_payments'
    const uploadResult = await uploadImageToCloudinary(
      buffer,
      file.type || "image/jpeg",
      "hireagent_payments"
    );

    const db = getDb();

    // Insert payment record into Neon PostgreSQL
    const [paymentRecord] = await db`
      INSERT INTO payments (
        user_id,
        plan_id,
        plan_name,
        amount_pkr,
        payment_method,
        sender_number,
        transaction_id,
        screenshot_url,
        status
      ) VALUES (
        ${user.id},
        ${planId},
        ${planName},
        ${amountPkr},
        'jazzcash',
        ${senderNumber},
        ${transactionId},
        ${uploadResult.url},
        'pending'
      )
      RETURNING id, status, created_at as "createdAt"
    `;

    // Update user's subscription status to pending_approval
    await db`
      UPDATE users 
      SET 
        subscription_status = 'pending_approval',
        updated_at = NOW()
      WHERE id = ${user.id}
    `;

    return NextResponse.json({
      success: true,
      message: "Payment proof submitted successfully. Your account is now under review by our administrator.",
      payment: paymentRecord,
    });
  } catch (error: any) {
    console.error("[API payments POST]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit payment verification." },
      { status: 500 }
    );
  }
}
