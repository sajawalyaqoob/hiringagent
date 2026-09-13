import assert from "node:assert";
import { MatchingEngine } from "../src/lib/services/matching-engine";
import { CanonicalProfileService } from "../src/lib/services/canonical-profile-service";
import type { Job, Profile } from "../src/types/database";

console.log("==========================================");
console.log("RUNNING MATCHING ENGINE AUTOMATED TESTS");
console.log("==========================================");

// Mock Candidate 1: Senior React Engineer (2 years React experience)
const candidateProfile1: Profile = {
  id: "prof_test_01",
  userId: "usr_01",
  fullName: "Alice Dev",
  professionalHeadline: "Frontend Engineer",
  email: "alice@example.com",
  location: "Seattle, WA",
  currentJobTitle: "Frontend Engineer",
  yearsOfExperience: 3,
  industry: "Technology",
  careerLevel: "mid",
  employmentStatus: "open_to_work",
  completionPercentage: 90,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const canonicalCandidate1 = CanonicalProfileService.compile(
  candidateProfile1,
  [],
  [
    {
      id: "s1",
      profileId: "prof_test_01",
      skillName: "React",
      category: "frameworks",
      proficiencyLevel: "Advanced",
      yearsOfExperience: 2,
      verifiedViaInterview: true,
      evidenceSource: "professional_experience",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  [],
  [],
  [],
  [],
  null
);

// Job 1: Requires 2 years React -> Expect Strong Match
const job1: Job = {
  id: "job_01",
  title: "Frontend Engineer",
  company: "Tech SaaS",
  location: "Seattle, WA",
  workplaceType: "remote",
  employmentType: "full_time",
  seniority: "mid",
  experienceYearsRequired: 2,
  description: "Building modern frontend applications",
  requiredSkills: ["React"],
  preferredSkills: [],
  responsibilities: ["Develop React components"],
  postedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

const evalResult1 = MatchingEngine.evaluateMatch(canonicalCandidate1, job1);
console.log(`[Test 1] Candidate 2 yrs React vs Job 2 yrs React required: Score = ${evalResult1.match.overallScore}%`);
assert(evalResult1.match.overallScore >= 75, "Expected strong match score (>= 75%)");
assert.strictEqual(evalResult1.match.matchingSkills.includes("React"), true, "React should be in matching skills");

// Mock Candidate 2: AWS Exposure only (6 months)
const canonicalCandidate2 = CanonicalProfileService.compile(
  candidateProfile1,
  [],
  [
    {
      id: "s2",
      profileId: "prof_test_01",
      skillName: "AWS",
      category: "cloud",
      proficiencyLevel: "Beginner",
      yearsOfExperience: 0.5,
      verifiedViaInterview: false,
      evidenceSource: "claimed_by_user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  [],
  [],
  [],
  [],
  null
);

// Job 2: Requires 5 years AWS -> Expect Experience Gap Detection
const job2: Job = {
  id: "job_02",
  title: "Cloud Infrastructure Architect",
  company: "Cloud Infrastructure Inc",
  location: "Remote",
  workplaceType: "remote",
  employmentType: "full_time",
  seniority: "senior",
  experienceYearsRequired: 5,
  description: "Architecting multi-region AWS cloud solutions",
  requiredSkills: ["AWS"],
  preferredSkills: ["Kubernetes"],
  responsibilities: ["Lead cloud deployment"],
  postedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

const evalResult2 = MatchingEngine.evaluateMatch(canonicalCandidate2, job2);
console.log(`[Test 2] Candidate 6 mos AWS vs Job 5 yrs AWS required: Score = ${evalResult2.match.overallScore}%`);

const awsGap = evalResult2.experienceGaps.find((g) => g.skillName === "AWS");
assert(awsGap !== undefined, "AWS gap entry should exist");
assert.strictEqual(awsGap?.status, "Experience Gap", "AWS status must be 'Experience Gap'");
assert.strictEqual(awsGap?.candidateYears, 0.5, "Candidate AWS years must be accurately reported as 0.5");
assert.strictEqual(awsGap?.requiredYears, 5, "Required AWS years must be accurately reported as 5");

console.log("✅ MATCHING ENGINE TESTS PASSED SUCCESSFULLY!");
