import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { env } from "../config/env";
import type { User } from "@/types/database";

const COOKIE_NAME = "hireagent_session";
const TOKEN_EXPIRY = "30d";

export interface SessionPayload {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  subscriptionTier: string;
  subscriptionStatus: string;
}

/**
 * Sign JWT session token
 */
export function signSessionToken(payload: SessionPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify JWT session token
 */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as SessionPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Set HTTP-only secure session cookie in Next.js Server Components / Route Handlers
 */
export async function setSessionCookie(payload: SessionPayload): Promise<string> {
  const token = signSessionToken(payload);
  try {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: env.isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
  } catch {
    // Graceful fallback when invoked outside Next.js request store (CLI tests / scripts)
  }

  return token;
}

/**
 * Get current session payload from cookies
 */
export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Clear session cookie (Logout)
 */
export async function clearSessionCookie(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, "", {
      httpOnly: true,
      secure: env.isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  } catch {
    // Ignore in edge contexts where cookies might be immutable
  }
}
