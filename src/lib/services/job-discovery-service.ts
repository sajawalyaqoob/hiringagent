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
  private cache: { timestamp: number; jobs: Job[] } | null = null;
  private CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async fetchLiveJobs(): Promise<Job[]> {
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_TTL) {
      return this.cache.jobs;
    }

    try {
      const res = await fetch("https://www.arbeitnow.com/api/job-board-api", {
        headers: { Accept: "application/json" },
        next: { revalidate: 300 },
      });

      if (res.ok) {
        const data = await res.json();
        const rawList = data?.data || [];
        if (Array.isArray(rawList) && rawList.length > 0) {
          const normalized = this.normalizeArbeitnowJobs(rawList);
          this.cache = { timestamp: Date.now(), jobs: normalized };
          return normalized;
        }
      }
    } catch (err) {
      console.warn("[JobProvider] Live Arbeitnow API fetch failed, falling back to local dataset:", err);
    }

    return mockJobs;
  }

  private normalizeArbeitnowJobs(rawList: any[]): Job[] {
    return rawList.map((item, idx) => {
      const title = item.title || "Software Specialist";
      const company = item.company_name || "Tech Solutions Corp";
      const isRemote = Boolean(item.remote);
      const location = isRemote ? "Remote Worldwide" : item.location || "Global";
      const tags = Array.isArray(item.tags) && item.tags.length > 0 ? item.tags : ["Engineering", "Cloud", "Agile"];
      
      const titleLower = title.toLowerCase();
      let seniority: "entry" | "mid" | "senior" | "lead" | "executive" = "mid";
      if (titleLower.includes("senior") || titleLower.includes("sr.")) seniority = "senior";
      else if (titleLower.includes("lead") || titleLower.includes("staff") || titleLower.includes("principal")) seniority = "lead";
      else if (titleLower.includes("junior") || titleLower.includes("entry") || titleLower.includes("intern")) seniority = "entry";
      else if (titleLower.includes("director") || titleLower.includes("head") || titleLower.includes("vp")) seniority = "executive";

      const baseSalary = seniority === "lead" ? 175000 : seniority === "senior" ? 145000 : seniority === "entry" ? 85000 : 115000;

      // Clean HTML tags from description if needed
      const cleanDesc = (item.description || "")
        .replace(/<[^>]*>?/gm, " ")
        .replace(/\s+/g, " ")
        .trim();

      return {
        id: `live_${item.slug || idx}_${Date.now().toString(36)}`,
        title,
        company,
        location,
        workplaceType: isRemote ? "remote" : "hybrid",
        employmentType: "full_time",
        seniority,
        experienceYearsRequired: seniority === "lead" ? 7 : seniority === "senior" ? 5 : seniority === "entry" ? 1 : 3,
        salaryMin: baseSalary,
        salaryMax: Math.round(baseSalary * 1.35),
        salaryCurrency: "USD",
        description: cleanDesc || `${title} at ${company}. Fast-paced technology team seeking passionate talent.`,
        requiredSkills: tags,
        preferredSkills: ["Git", "System Architecture", "Collaboration"],
        responsibilities: [
          `Architect and ship high-impact features for ${company}.`,
          "Partner with cross-functional teams to define technical strategy.",
          "Write clean, resilient code and drive continuous improvements.",
        ],
        educationRequirement: "Bachelor's degree in CS, STEM or equivalent practical experience",
        sourceUrl: item.url || undefined,
        postedAt: item.created_at ? new Date(item.created_at * 1000).toISOString() : new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
    });
  }

  async searchJobs(criteria: JobSearchCriteria): Promise<Job[]> {
    const liveJobs = await this.fetchLiveJobs();
    let results = liveJobs.length > 0 ? liveJobs : [...mockJobs];

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
