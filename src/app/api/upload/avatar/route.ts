import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { AuthService } from "@/lib/services/auth-service";

export async function POST(request: Request) {
  try {
    const user = await AuthService.getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No image file provided" }, { status: 400 });
    }

    // If Cloudinary credentials are not configured yet, return a graceful development response
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({
        success: true,
        message: "Cloudinary credentials not yet configured in .env.local. Running in dev fallback mode.",
        data: {
          url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
          publicId: `dev_mock_avatar_${Date.now()}`,
          isDevMode: true,
        },
      });
    }

    // Convert file to base64 data URI for Cloudinary REST API upload
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

    const timestamp = Math.round(Date.now() / 1000);
    const folder = "hireboost_avatars";
    const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = createHash("sha1").update(toSign).digest("hex");

    const cloudFormData = new FormData();
    cloudFormData.append("file", base64Data);
    cloudFormData.append("api_key", apiKey);
    cloudFormData.append("timestamp", timestamp.toString());
    cloudFormData.append("folder", folder);
    cloudFormData.append("signature", signature);

    const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: cloudFormData,
    });

    if (!cloudRes.ok) {
      const errText = await cloudRes.text();
      console.error("[Cloudinary Upload Error]:", cloudRes.status, errText);
      return NextResponse.json(
        { success: false, error: `Cloudinary upload failed: ${cloudRes.statusText}` },
        { status: 502 }
      );
    }

    const cloudData = await cloudRes.json();

    return NextResponse.json({
      success: true,
      data: {
        url: cloudData.secure_url,
        publicId: cloudData.public_id,
        format: cloudData.format,
        bytes: cloudData.bytes,
      },
    });
  } catch (error: any) {
    console.error("[API upload/avatar POST]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload avatar" },
      { status: 500 }
    );
  }
}
