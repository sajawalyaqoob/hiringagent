import type { Job, JobMatch } from "@/types/database";
import type { CanonicalCareerProfile } from "./canonical-profile-service";

export interface ExperienceSkillGap {
  skillName: string;
  requiredYears: number;
  candidateYears: number;
  status: "Meets Requirement" | "Experience Gap" | "Missing Skill";
}

export interface MatchEvaluation {
  match: JobMatch;
  experienceGaps: ExperienceSkillGap[];
}

export class MatchingEngine {
  /**
   * Deterministic transparent job matching engine
   */
  static evaluateMatch(candidate: CanonicalCareerProfile, job: Job): MatchEvaluation {
    const requiredSkills = job.requiredSkills || [];
    const preferredSkills = job.preferredSkills || [];
    const candidateSkillsMap = new Map<string, { years: number; proficiency: string; evidence: string }>();

    // Index candidate skills (case-insensitive)
    candidate.skills.forEach((s) => {
      candidateSkillsMap.set(s.name.toLowerCase(), {
        years: s.yearsOfExperience || candidate.totalYearsOfExperience || 1,
        proficiency: s.proficiency,
        evidence: s.evidenceSource,
      });
    });

    // Also check technologies in experiences and projects
    candidate.experiences.forEach((exp) => {
      (exp.technologiesUsed || []).forEach((tech) => {
        const key = tech.toLowerCase();
        if (!candidateSkillsMap.has(key)) {
          candidateSkillsMap.set(key, {
            years: 2, // Default estimation from experience record
            proficiency: "Intermediate",
            evidence: "professional_experience",
          });
        }
      });
    });

    candidate.projects.forEach((proj) => {
      (proj.technologies || []).forEach((tech) => {
        const key = tech.toLowerCase();
        if (!candidateSkillsMap.has(key)) {
          candidateSkillsMap.set(key, {
            years: 1,
            proficiency: "Familiar",
            evidence: "personal_project",
          });
        }
      });
    });

    // 1. SKILLS SCORE (Weight: 40%)
    const matchingSkills: string[] = [];
    const missingRequiredSkills: string[] = [];
    const missingPreferredSkills: string[] = [];
    const experienceGaps: ExperienceSkillGap[] = [];

    let requiredSkillsMatched = 0;
    requiredSkills.forEach((reqSkill) => {
      const lower = reqSkill.toLowerCase();
      const matched = Array.from(candidateSkillsMap.keys()).find(
        (k) => k === lower || k.includes(lower) || lower.includes(k)
      );

      if (matched) {
        matchingSkills.push(reqSkill);
        requiredSkillsMatched++;

        const candidateSkillInfo = candidateSkillsMap.get(matched)!;
        const requiredYears = job.experienceYearsRequired || 2;

        if (candidateSkillInfo.years < requiredYears) {
          experienceGaps.push({
            skillName: reqSkill,
            requiredYears,
            candidateYears: candidateSkillInfo.years,
            status: "Experience Gap",
          });
        } else {
          experienceGaps.push({
            skillName: reqSkill,
            requiredYears,
            candidateYears: candidateSkillInfo.years,
            status: "Meets Requirement",
          });
        }
      } else {
        missingRequiredSkills.push(reqSkill);
        experienceGaps.push({
          skillName: reqSkill,
          requiredYears: job.experienceYearsRequired || 1,
          candidateYears: 0,
          status: "Missing Skill",
        });
      }
    });

    let preferredSkillsMatched = 0;
    preferredSkills.forEach((prefSkill) => {
      const lower = prefSkill.toLowerCase();
      const matched = Array.from(candidateSkillsMap.keys()).find(
        (k) => k === lower || k.includes(lower) || lower.includes(k)
      );
      if (matched) {
        if (!matchingSkills.includes(prefSkill)) matchingSkills.push(prefSkill);
        preferredSkillsMatched++;
      } else {
        missingPreferredSkills.push(prefSkill);
      }
    });

    const reqScore = requiredSkills.length > 0 ? (requiredSkillsMatched / requiredSkills.length) * 80 : 80;
    const prefScore = preferredSkills.length > 0 ? (preferredSkillsMatched / preferredSkills.length) * 20 : 20;
    const skillsScore = Math.min(100, Math.round(reqScore + prefScore));

    // 2. EXPERIENCE SCORE (Weight: 20%)
    const requiredYears = job.experienceYearsRequired || 0;
    const candidateYears = candidate.totalYearsOfExperience || 0;
    let experienceScore = 100;

    if (requiredYears > 0) {
      if (candidateYears >= requiredYears) {
        experienceScore = 100;
      } else if (candidateYears >= requiredYears * 0.7) {
        experienceScore = 75;
      } else if (candidateYears >= requiredYears * 0.4) {
        experienceScore = 50;
      } else {
        experienceScore = 30;
      }
    }

    // 3. TITLE / ROLE RELEVANCE (Weight: 15%)
    const jobTitleLower = job.title.toLowerCase();
    const candidateTitleLower = candidate.currentRole.toLowerCase();
    const targetRolesLower = candidate.preferences.desiredJobTitles.map((t) => t.toLowerCase());

    let titleScore = 40;
    if (jobTitleLower === candidateTitleLower || targetRolesLower.includes(jobTitleLower)) {
      titleScore = 100;
    } else if (
      jobTitleLower.includes(candidateTitleLower) ||
      candidateTitleLower.includes(jobTitleLower) ||
      targetRolesLower.some((tr) => jobTitleLower.includes(tr) || tr.includes(jobTitleLower))
    ) {
      titleScore = 85;
    } else {
      // Compare seniority keywords
      const seniorityMatches = candidate.careerLevel.toLowerCase() === job.seniority.toLowerCase();
      titleScore = seniorityMatches ? 70 : 50;
    }

    // 4. LOCATION & WORKPLACE (Weight: 10%)
    let locationScore = 70;
    const jobLoc = job.location.toLowerCase();
    const candLoc = candidate.identity.location.toLowerCase();

    if (job.workplaceType === "remote" || candidate.preferences.workplacePreference === "remote") {
      locationScore = 100;
    } else if (jobLoc === candLoc || jobLoc.includes(candLoc) || candLoc.includes(jobLoc)) {
      locationScore = 100;
    } else if (candidate.preferences.openToRelocation) {
      locationScore = 80;
    } else {
      locationScore = 40;
    }

    // 5. EDUCATION SCORE (Weight: 5%)
    let educationScore = 85;
    if (!job.educationRequirement) {
      educationScore = 100;
    } else if (candidate.education.length > 0) {
      educationScore = 95;
    } else {
      educationScore = 60;
    }

    // 6. PREFERENCE ALIGNMENT (Weight: 10%)
    let preferenceScore = 80;
    if (job.salaryMin && candidate.preferences.minimumSalary > 0) {
      if (job.salaryMin >= candidate.preferences.minimumSalary) {
        preferenceScore = 100;
      } else {
        preferenceScore = 60;
      }
    }

    // OVERALL SCORE CALCULATION
    const overallScore = Math.round(
      skillsScore * 0.40 +
      experienceScore * 0.20 +
      titleScore * 0.15 +
      locationScore * 0.10 +
      educationScore * 0.05 +
      preferenceScore * 0.10
    );

    // Identify potential concerns
    const concerns: string[] = [];
    if (candidateYears < requiredYears) {
      concerns.push(
        `Experience Gap: Job requires ${requiredYears} years of total experience, candidate has ${candidateYears} years.`
      );
    }

    experienceGaps.forEach((gap) => {
      if (gap.status === "Experience Gap") {
        concerns.push(
          `Skill Depth Gap: Required ${gap.requiredYears} years in ${gap.skillName}, but candidate has ${gap.candidateYears} years exposure.`
        );
      } else if (gap.status === "Missing Skill") {
        concerns.push(`Missing Required Skill: ${gap.skillName}`);
      }
    });

    const explanation = `Matched ${matchingSkills.length} out of ${requiredSkills.length} required skills. Candidate has ${candidateYears} years of experience vs ${requiredYears} required. Overall title alignment score is ${titleScore}%.`;

    const jobMatch: JobMatch = {
      id: `match_${job.id}`,
      userId: candidate.identity.email,
      jobId: job.id,
      matchScore: overallScore,
      overallScore,
      skillsMatchScore: skillsScore,
      experienceMatchScore: experienceScore,
      seniorityMatchScore: titleScore,
      locationScore,
      educationScore,
      preferenceScore,
      matchingSkills,
      missingSkills: missingRequiredSkills,
      potentialConcerns: concerns,
      recommendedAction:
        overallScore >= 80
          ? "High priority match. Tailor resume and apply immediately."
          : overallScore >= 60
          ? "Moderate match. Highlight transferrable projects in cover letter."
          : "Low match score. Review missing skill requirements before applying.",
      isSaved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      match: jobMatch,
      experienceGaps,
    };
  }
}
