import { isSupabaseConfigured, createServerSupabaseClient } from "../supabase/server";

export type UsageCategory =
  | "resume_analysis"
  | "job_analysis"
  | "resume_generation"
  | "linkedin_generation"
  | "email_generation"
  | "ai_interview"
  | "job_search";

export interface CategoryUsageLimit {
  category: UsageCategory;
  used: number;
  limit: number;
  remaining: number;
}

export class UsageService {
  /**
   * Record usage of a specific action
   */
  static async recordUsage(userId: string, category: UsageCategory): Promise<number> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: existing } = await supabase
          .from("usage_records")
          .select("*")
          .eq("user_id", userId)
          .eq("category", category)
          .single();

        if (existing) {
          const newCount = existing.count + 1;
          await supabase
            .from("usage_records")
            .update({ count: newCount, updated_at: new Date().toISOString() })
            .eq("id", existing.id);
          return newCount;
        } else {
          await supabase.from("usage_records").insert({
            user_id: userId,
            category,
            count: 1,
          });
          return 1;
        }
      } catch (err) {
        console.warn("[UsageService] Error recording usage in Supabase:", err);
      }
    }
    return 1;
  }

  /**
   * Get category usage statistics and limits
   */
  static async getUsageLimits(userId: string, tier: "free" | "professional" | "career_pro" = "professional"): Promise<CategoryUsageLimit[]> {
    const limitsByTier: Record<string, Record<UsageCategory, number>> = {
      free: {
        resume_analysis: 3,
        job_analysis: 5,
        resume_generation: 2,
        linkedin_generation: 2,
        email_generation: 3,
        ai_interview: 1,
        job_search: 20,
      },
      professional: {
        resume_analysis: 25,
        job_analysis: 100,
        resume_generation: 30,
        linkedin_generation: 50,
        email_generation: 75,
        ai_interview: 10,
        job_search: 500,
      },
      career_pro: {
        resume_analysis: 999,
        job_analysis: 999,
        resume_generation: 999,
        linkedin_generation: 999,
        email_generation: 999,
        ai_interview: 999,
        job_search: 9999,
      },
    };

    const tierLimits = limitsByTier[tier] || limitsByTier.professional;

    const categories: UsageCategory[] = [
      "resume_analysis",
      "job_analysis",
      "resume_generation",
      "linkedin_generation",
      "email_generation",
      "ai_interview",
      "job_search",
    ];

    return categories.map((cat) => {
      const limit = tierLimits[cat];
      const used = 2; // Default baseline for demo
      return {
        category: cat,
        used,
        limit,
        remaining: Math.max(0, limit - used),
      };
    });
  }
}
