import { isSupabaseConfigured, createServerSupabaseClient } from "../supabase/server";
import { mockApplications } from "@/lib/server/mock-db";
import type { Application, ApplicationStage } from "@/types/database";

export class ApplicationService {
  async getApplications(userId?: string): Promise<Application[]> {
    if (isSupabaseConfigured() && userId) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
          .from("applications")
          .select("*, recruiter:recruiters(*)")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (!error && data) {
          return data.map((a: any) => ({
            id: a.id,
            userId: a.user_id,
            jobId: a.job_id,
            jobTitle: a.job_title,
            company: a.company,
            location: a.location,
            status: a.status as ApplicationStage,
            appliedDate: a.applied_date,
            salaryOffered: a.salary_offered ? Number(a.salary_offered) : undefined,
            notes: a.notes,
            recruiterId: a.recruiter_id,
            recruiter: a.recruiter
              ? {
                  id: a.recruiter.id,
                  name: a.recruiter.name,
                  company: a.recruiter.company,
                  title: a.recruiter.title,
                  email: a.recruiter.email,
                  linkedInUrl: a.recruiter.linkedin_url,
                  phone: a.recruiter.phone,
                  isPublicInfo: Boolean(a.recruiter.is_public_info),
                  notes: a.recruiter.notes,
                }
              : undefined,
            nextAction: a.next_action,
            nextActionDueDate: a.next_action_due_date,
            tailoredResumeId: a.tailored_resume_id,
            createdAt: a.created_at,
            updatedAt: a.updated_at,
          }));
        }
      } catch (err) {
        console.warn("[ApplicationService] Error fetching applications from Supabase:", err);
      }
    }
    return [...mockApplications];
  }

  async getApplicationById(id: string, userId?: string): Promise<Application | undefined> {
    const apps = await this.getApplications(userId);
    return apps.find((a) => a.id === id);
  }

  async updateStage(id: string, newStage: ApplicationStage, userId?: string): Promise<Application | null> {
    if (isSupabaseConfigured() && userId) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
          .from("applications")
          .update({ status: newStage, updated_at: new Date().toISOString() })
          .eq("id", id)
          .eq("user_id", userId)
          .select()
          .single();

        if (!error && data) {
          const app = await this.getApplicationById(id, userId);
          return app || null;
        }
      } catch (err) {
        console.warn("[ApplicationService] Error updating stage in Supabase:", err);
      }
    }

    const app = mockApplications.find((a) => a.id === id);
    if (!app) return null;
    app.status = newStage;
    app.updatedAt = new Date().toISOString();
    return { ...app };
  }

  async updateApplication(id: string, updates: Partial<Application>, userId?: string): Promise<Application | null> {
    if (isSupabaseConfigured() && userId) {
      try {
        const supabase = await createServerSupabaseClient();
        await supabase
          .from("applications")
          .update({
            job_title: updates.jobTitle,
            company: updates.company,
            location: updates.location,
            status: updates.status,
            applied_date: updates.appliedDate,
            salary_offered: updates.salaryOffered,
            notes: updates.notes,
            next_action: updates.nextAction,
            next_action_due_date: updates.nextActionDueDate,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .eq("user_id", userId);

        const updated = await this.getApplicationById(id, userId);
        return updated || null;
      } catch (err) {
        console.warn("[ApplicationService] Error updating application in Supabase:", err);
      }
    }

    const app = mockApplications.find((a) => a.id === id);
    if (!app) return null;
    Object.assign(app, updates, { updatedAt: new Date().toISOString() });
    return { ...app };
  }

  async createApplication(
    data: {
      jobTitle: string;
      company: string;
      location: string;
      status: ApplicationStage;
      appliedDate?: string;
      salaryOffered?: number;
      notes?: string;
      nextAction?: string;
      nextActionDueDate?: string;
      recruiterName?: string;
      recruiterEmail?: string;
    },
    userId: string = "usr_mock_01"
  ): Promise<Application> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: dbApp, error } = await supabase
          .from("applications")
          .insert({
            user_id: userId,
            job_title: data.jobTitle,
            company: data.company,
            location: data.location || "Remote",
            status: data.status,
            applied_date: data.appliedDate || new Date().toISOString(),
            salary_offered: data.salaryOffered || null,
            notes: data.notes || "",
            next_action: data.nextAction || null,
            next_action_due_date: data.nextActionDueDate || null,
          })
          .select()
          .single();

        if (!error && dbApp) {
          return {
            id: dbApp.id,
            userId: dbApp.user_id,
            jobTitle: dbApp.job_title,
            company: dbApp.company,
            location: dbApp.location,
            status: dbApp.status as ApplicationStage,
            appliedDate: dbApp.applied_date,
            salaryOffered: dbApp.salary_offered ? Number(dbApp.salary_offered) : undefined,
            notes: dbApp.notes,
            nextAction: dbApp.next_action,
            nextActionDueDate: dbApp.next_action_due_date,
            createdAt: dbApp.created_at,
            updatedAt: dbApp.updated_at,
          };
        }
      } catch (err) {
        console.warn("[ApplicationService] Error creating application in Supabase:", err);
      }
    }

    const newApp: Application = {
      id: `app_${Date.now()}`,
      userId,
      jobTitle: data.jobTitle,
      company: data.company,
      location: data.location,
      status: data.status,
      appliedDate: data.appliedDate || new Date().toISOString().split("T")[0],
      salaryOffered: data.salaryOffered,
      notes: data.notes,
      nextAction: data.nextAction,
      nextActionDueDate: data.nextActionDueDate,
      recruiter: data.recruiterName
        ? {
            id: `rec_${Date.now()}`,
            name: data.recruiterName,
            email: data.recruiterEmail,
            company: data.company,
            title: "Technical Recruiter",
            isPublicInfo: true,
          }
        : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockApplications.unshift(newApp);
    return newApp;
  }

  async deleteApplication(id: string, userId?: string): Promise<boolean> {
    if (isSupabaseConfigured() && userId) {
      try {
        const supabase = await createServerSupabaseClient();
        const { error } = await supabase.from("applications").delete().eq("id", id).eq("user_id", userId);
        if (!error) return true;
      } catch (err) {
        console.warn("[ApplicationService] Error deleting application in Supabase:", err);
      }
    }

    const index = mockApplications.findIndex((a) => a.id === id);
    if (index === -1) return false;
    mockApplications.splice(index, 1);
    return true;
  }
}

export const applicationService = new ApplicationService();
