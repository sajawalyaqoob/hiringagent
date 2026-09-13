import type { Job } from "@/types/database";
import { mockJobs } from "@/lib/server/mock-db";

export interface JobSearchCriteria {
  keywords?: string;
  location?: string;
  isRemote?: boolean;
  employmentType?: string;
  minSalary?: number;
  seniority?: string;
  limit?: number;
  page?: number;
}

export interface JobProvider {
  name: string;
  searchJobs(criteria: JobSearchCriteria): Promise<Job[]>;
  getJob(jobId: string): Promise<Job | null>;
}

export class DefaultJobProvider implements JobProvider {
  name = "DefaultJobProvider";

  async searchJobs(criteria: JobSearchCriteria): Promise<Job[]> {
    const apiKey = process.env.JOB_API_KEY || process.env.JSEARCH_API_KEY || process.env.RAPIDAPI_KEY;

    if (apiKey && apiKey.trim() !== "") {
      try {
        const query = encodeURIComponent(`${criteria.keywords || "Software Engineer"} in ${criteria.location || "Remote"}`);
        const url = `https://jsearch.p.rapidapi.com/search?query=${query}&page=${criteria.page || 1}&num_pages=1`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": "jsearch.p.rapidapi.com",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const rawJobs = data?.data || [];

          if (Array.isArray(rawJobs) && rawJobs.length > 0) {
            return this.normalizeExternalJobs(rawJobs);
          }
        }
      } catch (err) {
        console.warn("[JobProvider] External job API call failed, using local provider fallback:", err);
      }
    }

    // Fallback Local Provider filtering
    let results = [...mockJobs];

    if (criteria.keywords) {
      const q = criteria.keywords.toLowerCase();
      results = results.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.requiredSkills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (criteria.isRemote) {
      results = results.filter((j) => j.workplaceType === "remote" || j.location.toLowerCase().includes("remote"));
    }

    if (criteria.seniority) {
      results = results.filter((j) => j.seniority === criteria.seniority);
    }

    return results;
  }

  async getJob(jobId: string): Promise<Job | null> {
    const local = mockJobs.find((j) => j.id === jobId);
    return local || null;
  }

  private normalizeExternalJobs(rawList: any[]): Job[] {
    const seen = new Set<string>();
    const normalized: Job[] = [];

    rawList.forEach((item, idx) => {
      const title = item.job_title || "Software Engineer";
      const company = item.employer_name || "Enterprise SaaS";
      const key = `${title.toLowerCase()}_${company.toLowerCase()}`;

      if (!seen.has(key)) {
        seen.add(key);

        const isRemote = Boolean(item.job_is_remote);
        const location = isRemote
          ? "Remote"
          : `${item.job_city || ""}, ${item.job_state || item.job_country || "US"}`.trim();

        normalized.push({
          id: item.job_id ? `ext_${item.job_id}` : `job_ext_${idx}_${Date.now()}`,
          title,
          company,
          location: location || "Remote",
          workplaceType: isRemote ? "remote" : "any",
          employmentType: item.job_employment_type?.toLowerCase().includes("part") ? "part_time" : "full_time",
          seniority: title.toLowerCase().includes("senior") ? "senior" : title.toLowerCase().includes("lead") ? "lead" : "mid",
          experienceYearsRequired: item.job_required_experience?.no_experience_required ? 0 : 3,
          salaryMin: item.job_min_salary ? Number(item.job_min_salary) : 130000,
          salaryMax: item.job_max_salary ? Number(item.job_max_salary) : 180000,
          salaryCurrency: item.job_salary_currency || "USD",
          description: item.job_description || `${title} at ${company}. High-performance software engineering role.`,
          requiredSkills: item.job_required_skills || ["TypeScript", "React", "Node.js", "SQL"],
          preferredSkills: ["Docker", "AWS", "CI/CD"],
          responsibilities: item.job_highlights?.Responsibilities || [
            "Develop modern full-stack web applications and scalable data services.",
            "Collaborate with design and product engineering teams.",
          ],
          educationRequirement: item.job_required_education?.postgraduate_degree ? "Master's degree" : "Bachelor's degree in CS or equivalent",
          sourceUrl: item.job_apply_link || item.job_google_link || undefined,
          postedAt: item.job_posted_at_datetime_utc || new Date().toISOString(),
          createdAt: new Date().toISOString(),
        });
      }
    });

    return normalized;
  }
}
