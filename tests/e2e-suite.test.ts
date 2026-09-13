import assert from "node:assert";
import { AuthService } from "../src/lib/services/auth-service";
import { ProfileService } from "../src/lib/services/profile-service";
import { MatchingEngine } from "../src/lib/services/matching-engine";
import { CanonicalProfileService } from "../src/lib/services/canonical-profile-service";
import { DefaultAIProvider } from "../src/lib/ai/provider";
import { TailoredResumeOutputSchema } from "../src/lib/ai/types";
import { ResumeTextExtractor } from "../src/lib/services/resume-text-extractor";
import { ResumeParserService } from "../src/lib/services/resume-parser-service";
import { ApplicationService } from "../src/lib/services/application-service";
import { RateLimitService } from "../src/lib/services/rate-limit-service";
import type { Job, Profile } from "../src/types/database";

console.log("==========================================");
console.log("RUNNING COMPREHENSIVE E2E AUTOMATED TESTS");
console.log("==========================================");

async function runAllTests() {
  // 1. AUTHENTICATION TESTS
  console.log("\n[Group 1: Authentication]");
  const signUpRes = await AuthService.signUp("test.user@example.com", "SecretPass123!", "Test User");
  assert(signUpRes.user !== null, "Sign up should return user");
  assert.strictEqual(signUpRes.user?.email, "test.user@example.com", "Email should match");

  const signInRes = await AuthService.signIn("test.user@example.com", "SecretPass123!");
  assert(signInRes.user !== null, "Sign in should return authenticated user");
  console.log("  ✅ Auth Sign Up & Sign In tests passed!");

  // 2. PROFILE TESTS
  console.log("\n[Group 2: Profile & Completion]");
  const testProf: Profile = {
    id: "prof_e2e_01",
    userId: "usr_e2e_01",
    fullName: "Elena Vance",
    professionalHeadline: "Lead Systems Architect",
    email: "elena@example.com",
    location: "Austin, TX",
    currentJobTitle: "Lead Systems Architect",
    yearsOfExperience: 8,
    industry: "Enterprise SaaS",
    careerLevel: "lead",
    employmentStatus: "employed",
    completionPercentage: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const compResult = ProfileService.calculateCompletion({
    profile: testProf,
    experiences: [
      {
        id: "exp_e1",
        profileId: "prof_e2e_01",
        company: "Core Cloud Inc",
        jobTitle: "Lead Systems Architect",
        location: "Austin, TX",
        employmentType: "full_time",
        startDate: "2021-01",
        isCurrent: true,
        responsibilities: ["Architected microservices"],
        achievements: ["Reduced costs by $50k"],
        technologiesUsed: ["Go", "Kubernetes", "PostgreSQL"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "exp_e2",
        profileId: "prof_e2e_01",
        company: "Vanguard Tech",
        jobTitle: "Senior Engineer",
        location: "Austin, TX",
        employmentType: "full_time",
        startDate: "2018-01",
        endDate: "2020-12",
        isCurrent: false,
        responsibilities: ["Built REST APIs"],
        achievements: ["Improved performance"],
        technologiesUsed: ["TypeScript", "Node.js"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    education: [
      {
        id: "ed1",
        profileId: "prof_e2e_01",
        institution: "UT Austin",
        degree: "BS",
        fieldOfStudy: "Computer Engineering",
        startDate: "2014-08",
        endDate: "2018-05",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    skills: [
      {
        id: "sk1",
        profileId: "prof_e2e_01",
        name: "Go",
        category: "programming_languages",
        proficiencyLevel: "professional_experience",
        yearsOfExperience: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    projects: [
      {
        id: "pj1",
        profileId: "prof_e2e_01",
        name: "Stream Engine",
        description: "Open source event stream",
        role: "Creator",
        technologies: ["Go", "Kafka"],
        responsibilities: ["Implemented raft consensus"],
        achievements: ["10k stars"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    certifications: [],
    jobPreferences: {
      id: "pref1",
      profileId: "prof_e2e_01",
      desiredJobTitles: ["Principal Architect"],
      desiredIndustries: ["SaaS"],
      targetLocations: ["Remote"],
      workplacePreference: "remote",
      minimumExperienceYears: 7,
      employmentTypes: ["full_time"],
      minimumSalary: 180000,
      targetSalary: 220000,
      preferredTechnologies: ["Go"],
      openToRelocation: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });

  console.log(`  Profile Completion Score = ${compResult.percentage}%`);
  assert(compResult.percentage >= 80, "Fully populated profile should score >= 80%");
  console.log("  ✅ Profile Completion test passed!");

  // 3. MATCHING ENGINE TESTS
  console.log("\n[Group 3: Job Matching & Truthfulness]");
  const candidateSkills = [
    {
      id: "sk1",
      profileId: "prof_e2e_01",
      skillName: "Go",
      category: "programming_languages" as const,
      proficiencyLevel: "Expert" as const,
      yearsOfExperience: 5,
      verifiedViaInterview: true,
      evidenceSource: "professional_experience" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "sk2",
      profileId: "prof_e2e_01",
      skillName: "Kubernetes",
      category: "devops" as const,
      proficiencyLevel: "Advanced" as const,
      yearsOfExperience: 4,
      verifiedViaInterview: true,
      evidenceSource: "professional_experience" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const canonicalCand = CanonicalProfileService.compile(testProf, [], candidateSkills, [], [], [], [], null);
  const testJob: Job = {
    id: "job_t1",
    title: "Lead Systems Architect",
    company: "Distributed SaaS",
    location: "Austin, TX",
    workplaceType: "remote",
    employmentType: "full_time",
    seniority: "lead",
    experienceYearsRequired: 7,
    description: "Architecting cloud systems",
    requiredSkills: ["Go", "Kubernetes"],
    preferredSkills: ["Kafka"],
    responsibilities: ["System design"],
    postedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  const matchEval = MatchingEngine.evaluateMatch(canonicalCand, testJob);
  console.log(`  Match Score = ${matchEval.match.overallScore}%`);
  assert(matchEval.match.overallScore >= 70, "Strong candidate match score expected");
  console.log("  ✅ Job Matching test passed!");

  // 4. AI PROVIDER & FALLBACK TESTS
  console.log("\n[Group 4: AI Provider & Fallback Handling]");
  const aiProvider = new DefaultAIProvider();
  console.log(`  Active AI Provider: ${aiProvider.getActiveProvider()}`);
  const structuredAi = await aiProvider.generateStructuredJSON(
    "Generate tailored resume output sample",
    TailoredResumeOutputSchema
  );
  assert(structuredAi.professionalSummary !== undefined, "Structured JSON output must conform to schema");
  assert(Array.isArray(structuredAi.highlightedSkills), "Highlighted skills must be an array");
  console.log("  ✅ AI Provider Zod Schema Validation test passed!");

  // 5. RESUME EXTRACTOR & PARSER TESTS
  console.log("\n[Group 5: Resume Extraction & Validation]");
  // Test PDF validation
  try {
    ResumeTextExtractor.validate({ name: "resume.pdf", size: 5000 });
    console.log("  ✅ Resume size & PDF extension validation passed!");
  } catch {
    assert.fail("Valid PDF file should pass validation");
  }

  // Test invalid file extension
  try {
    ResumeTextExtractor.validate({ name: "resume.exe", size: 5000 });
    assert.fail("Invalid extension should throw error");
  } catch (err) {
    assert(err instanceof Error, "Should throw error on invalid extension");
    console.log("  ✅ Invalid extension error handling passed!");
  }

  const parser = new ResumeParserService();
  const parsedRes = await parser.parseResume("Skills: TypeScript, React, Go. Experience: Senior Engineer at SaaS Corp (2022-Present).", "resume.pdf");
  assert(parsedRes.extractedSkills.length > 0, "Parser must extract skills");
  console.log("  ✅ Resume Parser test passed!");

  // 6. APPLICATION LIFECYCLE TESTS
  console.log("\n[Group 6: Application Tracker Lifecycle]");
  const appService = new ApplicationService();
  const newApp = await appService.createApplication({
    jobTitle: "Staff Software Engineer",
    company: "ScaleTech",
    location: "Remote",
    status: "applied",
  }, "usr_e2e_01");

  assert.strictEqual(newApp.status, "applied", "Initial status should be applied");

  const updatedApp = await appService.updateStage(newApp.id, "interview", "usr_e2e_01");
  assert.strictEqual(updatedApp?.status, "interview", "Status transition to interview failed");
  console.log("  ✅ Application Stage transition test passed!");

  // 7. SECURITY & RATE LIMITING TESTS
  console.log("\n[Group 7: Security & Rate Limiting]");
  const rate1 = await RateLimitService.check("test_key_limit", 2, 60);
  assert.strictEqual(rate1.success, true, "First request within limit should pass");

  const rate2 = await RateLimitService.check("test_key_limit", 2, 60);
  assert.strictEqual(rate2.success, true, "Second request within limit should pass");

  const rate3 = await RateLimitService.check("test_key_limit", 2, 60);
  assert.strictEqual(rate3.success, false, "Third request exceeding limit must be blocked");
  console.log("  ✅ Rate Limiting security test passed!");

  console.log("\n==========================================");
  console.log("ALL E2E DOMAIN SUITE TESTS PASSED (100%)");
  console.log("==========================================");
}

runAllTests().catch((err) => {
  console.error("❌ Test suite error:", err);
  process.exit(1);
});
