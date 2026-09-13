import assert from "node:assert";
import { ProfileService } from "../src/lib/services/profile-service";
import type { Profile } from "../src/types/database";

console.log("==========================================");
console.log("RUNNING PROFILE COMPLETION AUTOMATED TESTS");
console.log("==========================================");

const incompleteProfile: Profile = {
  id: "prof_inc",
  userId: "usr_inc",
  fullName: "Test User",
  professionalHeadline: "",
  email: "test@example.com",
  location: "Seattle, WA",
  currentJobTitle: "",
  yearsOfExperience: 0,
  industry: "",
  careerLevel: "entry",
  employmentStatus: "open_to_work",
  completionPercentage: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const resultEmpty = ProfileService.calculateCompletion({
  profile: incompleteProfile,
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  jobPreferences: null,
});

console.log(`[Test Completion Empty] Score: ${resultEmpty.percentage}%`);
assert(resultEmpty.percentage < 30, "Incomplete profile should score below 30%");
assert(resultEmpty.missingSections.length > 0, "Should report missing sections");

console.log("✅ PROFILE COMPLETION TESTS PASSED SUCCESSFULLY!");
