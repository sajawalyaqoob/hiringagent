import { isSupabaseConfigured, createServerSupabaseClient } from "../supabase/server";
import { mockJobs, mockJobMatches, mockProfile, mockExperiences, mockSkills, mockJobPreferences } from "@/lib/server/mock-db";
import type { Job, JobMatch } from "@/types/database";
import { JobAnalyzerService } from "./job-analyzer-service";
import { MatchingEngine } from "./matching-engine";
import { CanonicalProfileService } from "./canonical-profile-service";
import { SkillService } from "./skill-service";
import { DefaultJobProvider } from "./job-discovery-service";

export interface JobWithMatch {
  job: Job;
  match?: JobMatch;
}

export interface JobFilterParams {
  query?: string;
  minScore?: number;
  workplaceType?: string;
  seniority?: string;
  location?: string;
}

export class JobService {
  private analyzerService = new JobAnalyzerService();

  async getRecommendedJobs(filters?: JobFilterParams, userId?: string): Promise<JobWithMatch[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: dbJobs } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
        const { data: dbMatches } = userId
          ? await supabase.from("job_matches").select("*").eq("user_id", userId)
          : { data: [] };

        if (dbJobs && dbJobs.length > 0) {
          const matchesMap = new Map((dbMatches || []).map((m: any) => [m.job_id, m]));
          let results: JobWithMatch[] = dbJobs.map((j: any) => {
            const m: any = matchesMap.get(j.id);
            const jobObj: Job = {
              id: j.id,
              title: j.title,
              company: j.company,
              location: j.location,
              workplaceType: j.workplace_type,
              employmentType: j.employment_type,
              seniority: j.seniority,
              experienceYearsRequired: Number(j.experience_years_required),
              salaryMin: j.salary_min ? Number(j.salary_min) : undefined,
              salaryMax: j.salary_max ? Number(j.salary_max) : undefined,
              salaryCurrency: j.salary_currency,
              description: j.description,
              requiredSkills: j.required_skills || [],
              preferredSkills: j.preferred_skills || [],
              responsibilities: j.responsibilities || [],
              educationRequirement: j.education_requirement,
              sourceUrl: j.source_url,
              postedAt: j.posted_at,
              createdAt: j.created_at,
            };

            const matchObj: JobMatch | undefined = m
              ? {
                  id: m.id,
                  userId: m.user_id,
                  jobId: m.job_id,
                  matchScore: Number(m.overall_score || 85),
                  overallScore: Number(m.overall_score || 85),
                  skillsMatchScore: Number(m.skills_score || 85),
                  experienceMatchScore: Number(m.experience_score || 85),
                  seniorityMatchScore: Number(m.title_score || 85),
                  locationScore: Number(m.location_score || 80),
                  educationScore: Number(m.education_score || 90),
                  preferenceScore: Number(m.preference_score || 85),
                  matchingSkills: m.matching_skills || [],
                  missingSkills: m.missing_required_skills || [],
                  potentialConcerns: m.concerns || [],
                  recommendedAction: m.explanation || "Recommended based on profile score",
                  isSaved: Boolean(m.is_saved),
                  createdAt: m.created_at,
                  updatedAt: m.updated_at,
                }
              : undefined;

            return { job: jobObj, match: matchObj };
          });

          if (filters?.query) {
            const q = filters.query.toLowerCase();
            results = results.filter(
              ({ job }) =>
                job.title.toLowerCase().includes(q) ||
                job.company.toLowerCase().includes(q) ||
                job.requiredSkills.some((s) => s.toLowerCase().includes(q))
            );
          }
          return results;
        }
      } catch (err) {
        console.warn("[JobService] Error fetching jobs from Supabase:", err);
      }
    }

    const jobProvider = new DefaultJobProvider();
    const liveJobs = await jobProvider.fetchLiveJobs();
    const candidateSkills = Array.from(
      new Set([
        ...mockSkills.map((s) => s.name.toLowerCase()),
        ...(mockJobPreferences.preferredTechnologies || []).map((t) => t.toLowerCase()),
      ])
    );
    const candidateRole = (mockProfile.currentJobTitle || "").toLowerCase();

    // Map each job to JobWithMatch with dynamic personalization
    let results: JobWithMatch[] = liveJobs.map((job) => {
      const existingMatch = mockJobMatches.find((m) => m.jobId === job.id);
      if (existingMatch) return { job, match: existingMatch };

      // Compute dynamic alignment score
      const matchingSkills: string[] = [];
      const missingSkills: string[] = [];

      job.requiredSkills.forEach((req) => {
        const reqLower = req.toLowerCase();
        if (candidateSkills.some((cs) => cs.includes(reqLower) || reqLower.includes(cs))) {
          matchingSkills.push(req);
        } else {
          missingSkills.push(req);
        }
      });

      let score = 76;
      score += Math.min(matchingSkills.length * 6, 18);
      if (candidateRole && job.title.toLowerCase().includes(candidateRole)) {
        score += 8;
      }
      if (mockJobPreferences.workplacePreference === job.workplaceType) {
        score += 4;
      }
      score = Math.min(Math.max(score, 68), 98);

      const dynamicMatch: JobMatch = {
        id: `m_${job.id}`,
        userId: mockProfile.id,
        jobId: job.id,
        matchScore: score,
        overallScore: score,
        skillsMatchScore: Math.min(score + 2, 99),
        experienceMatchScore: Math.max(score - 4, 70),
        seniorityMatchScore: 90,
        locationScore: 92,
        educationScore: 95,
        preferenceScore: 88,
        matchingSkills: matchingSkills.length > 0 ? matchingSkills : ["Engineering Practice", "Tech Agility"],
        missingSkills: missingSkills.slice(0, 3),
        potentialConcerns: [],
        recommendedAction: score >= 88 ? "High match with your calibrated skills & target role" : "Compatible opportunity",
        isSaved: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return { job, match: dynamicMatch };
    });

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      results = results.filter(
        ({ job }) =>
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q) ||
          job.requiredSkills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filters?.minScore !== undefined) {
      results = results.filter(({ match }) => (match?.overallScore ?? match?.matchScore ?? 0) >= (filters.minScore ?? 0));
    }

    if (filters?.workplaceType && filters.workplaceType !== "any" && filters.workplaceType !== "all") {
      results = results.filter(({ job }) => job.workplaceType === filters.workplaceType);
    }

    if (filters?.seniority && filters.seniority !== "all") {
      results = results.filter(({ job }) => job.seniority === filters.seniority);
    }

    // Sort by overallScore descending so best matches are first
    results.sort((a, b) => (b.match?.overallScore || 0) - (a.match?.overallScore || 0));

    return results;
  }

  async getJobById(id: string, userId?: string): Promise<JobWithMatch | null> {
    const recommended = await this.getRecommendedJobs(undefined, userId);
    const found = recommended.find((r) => r.job.id === id);
    if (found) return found;

    const mockJ = mockJobs.find((j) => j.id === id);
    if (!mockJ) return null;
    const match = mockJobMatches.find((m) => m.jobId === id);
    return { job: mockJ, match };
  }

  async toggleSaveJob(jobId: string, userId?: string): Promise<boolean> {
    if (isSupabaseConfigured() && userId) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: existing } = await supabase
          .from("job_matches")
          .select("is_saved")
          .eq("job_id", jobId)
          .eq("user_id", userId)
          .single();

        const newState = !(existing?.is_saved || false);
        await supabase
          .from("job_matches")
          .upsert({ job_id: jobId, user_id: userId, is_saved: newState, updated_at: new Date().toISOString() });
        return newState;
      } catch (err) {
        console.warn("[JobService] Error toggling saved job in Supabase:", err);
      }
    }

    const match = mockJobMatches.find((m) => m.jobId === jobId);
    if (match) {
      match.isSaved = !match.isSaved;
      return match.isSaved;
    }
    return false;
  }

  async analyzePastedJob(
    data: {
      title: string;
      company: string;
      location: string;
      description: string;
      sourceUrl?: string;
    },
    userId: string = "usr_mock_01"
  ): Promise<{ job: Job; match: JobMatch }> {
    // Run JobAnalyzerService
    const analysis = await this.analyzerService.analyzeJobDescription(
      data.description,
      data.title,
      data.company
    );

    const newJob: Job = {
      id: `job_${Date.now().toString(36)}`,
      title: data.title || analysis.jobTitle,
      company: data.company || "Company",
      location: data.location || analysis.location,
      workplaceType: analysis.location.toLowerCase().includes("remote") ? "remote" : "any",
      employmentType: "full_time",
      seniority: analysis.seniority,
      experienceYearsRequired: analysis.yearsOfExperience,
      salaryMin: analysis.salaryRange?.min,
      salaryMax: analysis.salaryRange?.max,
      salaryCurrency: analysis.salaryRange?.currency || "USD",
      description: data.description,
      requiredSkills: analysis.mustHaveSkills,
      preferredSkills: analysis.niceToHaveSkills,
      responsibilities: analysis.responsibilities,
      educationRequirement: analysis.education,
      sourceUrl: data.sourceUrl,
      postedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Compile Canonical Profile to run MatchingEngine
    const userSkills = await SkillService.getUserSkills(userId);
    const canonicalCandidate = CanonicalProfileService.compile(
      mockProfile,
      mockExperiences,
      userSkills,
      [],
      [],
      [],
      [],
      null
    );

    const evaluation = MatchingEngine.evaluateMatch(canonicalCandidate, newJob);
    evaluation.match.userId = userId;
    evaluation.match.isSaved = true;

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: dbJob } = await supabase
          .from("jobs")
          .insert({
            user_id: userId,
            title: newJob.title,
            company: newJob.company,
            location: newJob.location,
            workplace_type: newJob.workplaceType,
            employment_type: newJob.employmentType,
            seniority: newJob.seniority,
            experience_years_required: newJob.experienceYearsRequired,
            salary_min: newJob.salaryMin,
            salary_max: newJob.salaryMax,
            salary_currency: newJob.salaryCurrency,
            description: newJob.description,
            required_skills: newJob.requiredSkills,
            preferred_skills: newJob.preferredSkills,
            responsibilities: newJob.responsibilities,
            education_requirement: newJob.educationRequirement,
            source_url: newJob.sourceUrl,
          })
          .select()
          .single();

        if (dbJob) {
          newJob.id = dbJob.id;
          evaluation.match.jobId = dbJob.id;

          await supabase.from("job_matches").insert({
            user_id: userId,
            job_id: dbJob.id,
            overall_score: evaluation.match.overallScore,
            skills_score: evaluation.match.skillsMatchScore,
            experience_score: evaluation.match.experienceMatchScore,
            title_score: evaluation.match.seniorityMatchScore,
            location_score: evaluation.match.locationScore || 80,
            education_score: evaluation.match.educationScore || 90,
            preference_score: evaluation.match.preferenceScore || 85,
            matching_skills: evaluation.match.matchingSkills,
            missing_required_skills: evaluation.match.missingSkills,
            missing_preferred_skills: [],
            concerns: evaluation.match.potentialConcerns,
            explanation: evaluation.match.recommendedAction,
            is_saved: true,
          });
        }
      } catch (err) {
        console.warn("[JobService] Error persisting job/match in Supabase:", err);
      }
    }

    mockJobs.unshift(newJob);
    mockJobMatches.unshift(evaluation.match);

    return { job: newJob, match: evaluation.match };
  }
}

export const jobService = new JobService();
