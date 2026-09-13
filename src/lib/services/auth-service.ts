import { createServerSupabaseClient, isSupabaseConfigured } from "../supabase/server";
import { mockUser, mockProfile } from "../server/mock-db";
import type { User } from "@/types/database";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export class AuthService {
  /**
   * Get current authenticated user from Supabase or Fallback Local Store
   */
  static async getCurrentUser(): Promise<User | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: { user: authUser }, error } = await supabase.auth.getUser();

        if (error || !authUser) return null;

        // Fetch user profile / record from public.users table
        const { data: dbUser } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (dbUser) {
          return {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name || authUser.user_metadata?.full_name || "User",
            role: dbUser.role || "user",
            subscriptionTier: dbUser.subscription_tier || "free",
            subscriptionStatus: dbUser.subscription_status || "active",
            createdAt: dbUser.created_at,
            updatedAt: dbUser.updated_at,
          };
        }

        // Fallback user constructed from authUser metadata if not yet in DB
        return {
          id: authUser.id,
          email: authUser.email || "",
          name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
          role: "user",
          subscriptionTier: "professional",
          subscriptionStatus: "active",
          createdAt: authUser.created_at,
          updatedAt: new Date().toISOString(),
        };
      } catch (err) {
        console.warn("[AuthService] Error fetching Supabase user, falling back:", err);
      }
    }

    // Default development user session
    return mockUser;
  }

  /**
   * Sign up a new user with email and password
   */
  static async signUp(email: string, password: string, name: string): Promise<{ user: User | null; error?: string }> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        });

        if (error) return { user: null, error: error.message };

        if (data.user) {
          const newUser: User = {
            id: data.user.id,
            email: data.user.email || email,
            name,
            role: "user",
            subscriptionTier: "free",
            subscriptionStatus: "active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Create row in public.users table
          await supabase.from("users").insert({
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            subscription_tier: newUser.subscriptionTier,
            subscription_status: newUser.subscriptionStatus,
          });

          // Create default profile
          await supabase.from("profiles").insert({
            user_id: newUser.id,
            full_name: name,
            email: newUser.email,
            professional_headline: "Software Professional",
            location: "Remote / Unspecified",
            current_job_title: "Candidate",
            years_of_experience: 0,
            industry: "Technology",
            career_level: "mid",
            employment_status: "open_to_work",
            completion_percentage: 20,
          });

          return { user: newUser };
        }
      } catch (err) {
        return { user: null, error: err instanceof Error ? err.message : "Sign up failed" };
      }
    }

    // Local dev mock sign up response
    mockUser.email = email;
    mockUser.name = name;
    mockProfile.email = email;
    mockProfile.fullName = name;

    const newUser: User = {
      id: mockUser.id || `usr_${Date.now().toString(36)}`,
      email,
      name,
      role: "user",
      subscriptionTier: "free",
      subscriptionStatus: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return { user: newUser };
  }

  /**
   * Log in user with email and password
   */
  static async signIn(email: string, password: string): Promise<{ user: User | null; error?: string }> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) return { user: null, error: error.message };

        if (data.user) {
          const user = await this.getCurrentUser();
          return { user };
        }
      } catch (err) {
        return { user: null, error: err instanceof Error ? err.message : "Login failed" };
      }
    }

    // Local dev mock login
    return { user: mockUser };
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { error } = await supabase.auth.signOut();
        if (error) return { success: false, error: error.message };
      } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : "Logout failed" };
      }
    }
    return { success: true };
  }

  /**
   * Send password reset email
   */
  static async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password`,
        });
        if (error) return { success: false, error: error.message };
      } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : "Password reset request failed" };
      }
    }
    return { success: true };
  }
}
