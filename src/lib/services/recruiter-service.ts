import { isSupabaseConfigured, createServerSupabaseClient } from "../supabase/server";
import type { Recruiter } from "@/types/database";

export class RecruiterService {
  /**
   * Fetch recruiters for user or company
   */
  static async getRecruiters(userId?: string): Promise<Recruiter[]> {
    if (isSupabaseConfigured() && userId) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
          .from("recruiters")
          .select("*")
          .or(`user_id.eq.${userId},user_id.is.null`)
          .order("created_at", { ascending: false });

        if (!error && data) {
          return data.map((r: any) => ({
            id: r.id,
            name: r.name,
            company: r.company,
            title: r.title,
            email: r.email,
            linkedInUrl: r.linkedin_url,
            phone: r.phone,
            isPublicInfo: Boolean(r.is_public_info),
            notes: r.notes,
          }));
        }
      } catch (err) {
        console.warn("[RecruiterService] Error fetching recruiters from Supabase:", err);
      }
    }

    // Default public recruiters list
    return [
      {
        id: "rec_01",
        name: "Sarah Jenkins",
        title: "Principal Technical Recruiter",
        company: "CloudScale Technologies",
        email: "s.jenkins@cloudscale.example.com",
        linkedInUrl: "https://linkedin.com/in/sarahjenkins-recruiter",
        isPublicInfo: true,
        notes: "Leads hiring for backend distributed systems and platform team.",
      },
      {
        id: "rec_02",
        name: "Marcus Vance",
        title: "Senior Talent Partner",
        company: "Vanguard Digital Labs",
        email: "marcus.vance@vanguard.example.com",
        linkedInUrl: "https://linkedin.com/in/marcusvance-talent",
        isPublicInfo: true,
        notes: "Direct contact for web application development and lead roles.",
      },
    ];
  }

  /**
   * Create or update recruiter
   */
  static async saveRecruiter(
    recruiter: Omit<Recruiter, "id"> & { id?: string },
    userId: string = "usr_mock_01"
  ): Promise<Recruiter> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const payload = {
          user_id: userId,
          name: recruiter.name,
          title: recruiter.title || "",
          company: recruiter.company || "",
          email: recruiter.email || null,
          linkedin_url: recruiter.linkedInUrl || null,
          phone: recruiter.phone || null,
          is_public_info: recruiter.isPublicInfo ?? true,
          notes: recruiter.notes || "",
        };

        if (recruiter.id) {
          const { data } = await supabase
            .from("recruiters")
            .update(payload)
            .eq("id", recruiter.id)
            .select()
            .single();

          if (data) {
            return {
              id: data.id,
              name: data.name,
              company: data.company,
              title: data.title,
              email: data.email,
              linkedInUrl: data.linkedin_url,
              phone: data.phone,
              isPublicInfo: data.is_public_info,
              notes: data.notes,
            };
          }
        } else {
          const { data } = await supabase.from("recruiters").insert(payload).select().single();
          if (data) {
            return {
              id: data.id,
              name: data.name,
              company: data.company,
              title: data.title,
              email: data.email,
              linkedInUrl: data.linkedin_url,
              phone: data.phone,
              isPublicInfo: data.is_public_info,
              notes: data.notes,
            };
          }
        }
      } catch (err) {
        console.warn("[RecruiterService] Error saving recruiter to Supabase:", err);
      }
    }

    return {
      id: recruiter.id || `rec_${Date.now()}`,
      name: recruiter.name,
      title: recruiter.title,
      company: recruiter.company,
      email: recruiter.email,
      linkedInUrl: recruiter.linkedInUrl,
      phone: recruiter.phone,
      isPublicInfo: recruiter.isPublicInfo ?? true,
      notes: recruiter.notes,
    };
  }
}
