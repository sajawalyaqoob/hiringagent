import { createHash } from "node:crypto";
import { env } from "../config/env";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  format?: string;
  bytes?: number;
}

/**
 * Upload an image buffer directly to Cloudinary using secure signed REST API
 */
export async function uploadImageToCloudinary(
  buffer: Buffer,
  mimeType: string,
  folder: string = "hireagent_payments"
): Promise<CloudinaryUploadResult> {
  const cloudName = env.cloudinary.cloudName || "anp5fflm";
  const apiKey = env.cloudinary.apiKey || "974866639114721";
  const apiSecret = env.cloudinary.apiSecret || "S-t_I4aJrHRcNfAfXJAw8BrfPCo";

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are not properly configured in environment variables.");
  }

  const base64Data = `data:${mimeType};base64,${buffer.toString("base64")}`;
  const timestamp = Math.round(Date.now() / 1000);

  // Cloudinary signature calculation: parameters sorted alphabetically + api_secret
  const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash("sha1").update(toSign).digest("hex");

  const formData = new FormData();
  formData.append("file", base64Data);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("folder", folder);
  formData.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("[Cloudinary Upload Error]:", res.status, errorText);
    throw new Error(`Cloudinary upload failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return {
    url: data.secure_url || data.url,
    publicId: data.public_id,
    format: data.format,
    bytes: data.bytes,
  };
}
