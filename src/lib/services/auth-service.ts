import bcrypt from "bcryptjs";
import { getDb } from "../db/neon";
import { initializeDatabase } from "../db/schema";
import {
  setSessionCookie,
  getSessionFromCookies,
  clearSessionCookie,
  type SessionPayload,
} from "../auth/session";
import { env } from "../config/env";
import type { User } from "@/types/database";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export class AuthService {
  /**
   * Get current authenticated user from session cookie & Neon DB
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const session = await getSessionFromCookies();
      if (!session || !session.id) {
        return null;
      }

      const db = getDb();
      const rows = await db`
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
        WHERE id = ${session.id}
        LIMIT 1
      `;

      if (!rows || rows.length === 0) {
        return null;
      }

      const row = rows[0];
      return {
        id: row.id,
        email: row.email,
        name: row.name,
        role: row.role as User["role"],
        subscriptionTier: row.subscriptionTier as User["subscriptionTier"],
        subscriptionStatus: row.subscriptionStatus as User["subscriptionStatus"],
        subscriptionExpiresAt: row.subscriptionExpiresAt ? new Date(row.subscriptionExpiresAt).toISOString() : null,
        createdAt: new Date(row.createdAt).toISOString(),
        updatedAt: new Date(row.updatedAt).toISOString(),
      };
    } catch (err) {
      console.error("[AuthService.getCurrentUser] Error:", err);
      return null;
    }
  }

  /**
   * Sign up a new user with email, password, and name
   */
  static async signUp(
    email: string,
    password: string,
    name: string
  ): Promise<{ user: User | null; error?: string }> {
    try {
      await initializeDatabase();
      const db = getDb();

      const normalizedEmail = email.trim().toLowerCase();

      // Check if user already exists
      const existing = await db`SELECT id FROM users WHERE email = ${normalizedEmail} LIMIT 1`;
      if (existing && existing.length > 0) {
        return { user: null, error: "An account with this email address already exists. Please sign in." };
      }

      // Hash password with bcrypt
      const passwordHash = await bcrypt.hash(password, 10);

      // Check if registering admin email
      const isAdmin = normalizedEmail === env.admin.email.toLowerCase();
      const role = isAdmin ? "admin" : "user";
      const subscriptionTier = isAdmin ? "career_pro" : "free";
      const subscriptionStatus = isAdmin ? "active" : "pending_payment";

      // Insert new user into Neon PostgreSQL
      const [newUser] = await db`
        INSERT INTO users (
          email,
          password_hash,
          name,
          role,
          subscription_tier,
          subscription_status
        ) VALUES (
          ${normalizedEmail},
          ${passwordHash},
          ${name.trim()},
          ${role},
          ${subscriptionTier},
          ${subscriptionStatus}
        )
        RETURNING 
          id, 
          email, 
          name, 
          role, 
          subscription_tier as "subscriptionTier", 
          subscription_status as "subscriptionStatus",
          subscription_expires_at as "subscriptionExpiresAt",
          created_at as "createdAt", 
          updated_at as "updatedAt"
      `;

      if (!newUser) {
        return { user: null, error: "Failed to create user record." };
      }

      // Create initial profile in Neon DB
      await db`
        INSERT INTO profiles (
          user_id,
          full_name,
          email,
          professional_headline,
          current_job_title,
          location
        ) VALUES (
          ${newUser.id},
          ${name.trim()},
          ${normalizedEmail},
          'Software Professional',
          'Candidate',
          'Pakistan'
        )
        ON CONFLICT (user_id) DO NOTHING
      `;

      const userObject: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role as User["role"],
        subscriptionTier: newUser.subscriptionTier as User["subscriptionTier"],
        subscriptionStatus: newUser.subscriptionStatus as User["subscriptionStatus"],
        subscriptionExpiresAt: newUser.subscriptionExpiresAt
          ? new Date(newUser.subscriptionExpiresAt).toISOString()
          : null,
        createdAt: new Date(newUser.createdAt).toISOString(),
        updatedAt: new Date(newUser.updatedAt).toISOString(),
      };

      // Set HTTP-only session cookie
      await setSessionCookie({
        id: userObject.id,
        email: userObject.email,
        name: userObject.name,
        role: userObject.role,
        subscriptionTier: userObject.subscriptionTier,
        subscriptionStatus: userObject.subscriptionStatus,
      });

      return { user: userObject };
    } catch (err: any) {
      console.error("[AuthService.signUp] Error:", err);
      return { user: null, error: err.message || "Failed to create account. Please try again." };
    }
  }

  /**
   * Log in user with email and password
   */
  static async signIn(
    email: string,
    password: string
  ): Promise<{ user: User | null; error?: string }> {
    try {
      await initializeDatabase();
      const db = getDb();

      const normalizedEmail = email.trim().toLowerCase();

      // Retrieve user by email
      const rows = await db`
        SELECT 
          id, 
          email, 
          password_hash, 
          name, 
          role, 
          subscription_tier as "subscriptionTier", 
          subscription_status as "subscriptionStatus",
          subscription_expires_at as "subscriptionExpiresAt",
          created_at as "createdAt", 
          updated_at as "updatedAt"
        FROM users
        WHERE email = ${normalizedEmail}
        LIMIT 1
      `;

      if (!rows || rows.length === 0) {
        return { user: null, error: "Invalid email or password." };
      }

      const userRow = rows[0];

      // Compare password with bcrypt hash
      const isMatch = await bcrypt.compare(password, userRow.password_hash);
      if (!isMatch) {
        return { user: null, error: "Invalid email or password." };
      }

      const userObject: User = {
        id: userRow.id,
        email: userRow.email,
        name: userRow.name,
        role: userRow.role as User["role"],
        subscriptionTier: userRow.subscriptionTier as User["subscriptionTier"],
        subscriptionStatus: userRow.subscriptionStatus as User["subscriptionStatus"],
        subscriptionExpiresAt: userRow.subscriptionExpiresAt
          ? new Date(userRow.subscriptionExpiresAt).toISOString()
          : null,
        createdAt: new Date(userRow.createdAt).toISOString(),
        updatedAt: new Date(userRow.updatedAt).toISOString(),
      };

      // Set HTTP-only session cookie
      await setSessionCookie({
        id: userObject.id,
        email: userObject.email,
        name: userObject.name,
        role: userObject.role,
        subscriptionTier: userObject.subscriptionTier,
        subscriptionStatus: userObject.subscriptionStatus,
      });

      return { user: userObject };
    } catch (err: any) {
      console.error("[AuthService.signIn] Error:", err);
      return { user: null, error: err.message || "Authentication failed. Please try again." };
    }
  }

  /**
   * Sign out current user by removing session cookie
   */
  static async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      await clearSessionCookie();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to sign out" };
    }
  }

  /**
   * Password reset stub
   */
  static async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    return { success: true };
  }
}
