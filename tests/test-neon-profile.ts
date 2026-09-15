import { AuthService } from "../src/lib/services/auth-service";
import { profileService } from "../src/lib/services/profile-service";
import { getDb } from "../src/lib/db/neon";

async function testProfilePersistence() {
  console.log("=== Testing User Data Persistence in Neon DB ===");
  const db = getDb();

  // 1. Sign up user
  const email = `candidate_profile_${Date.now()}@example.com`;
  const signup = await AuthService.signUp(email, "Pakistan2026!", "Bilal Ahmed");
  if (!signup.user) throw new Error("Sign up failed");

  console.log("1. Created user:", signup.user.email, "| ID:", signup.user.id);

  // 2. Save complete onboarding data
  const onboardingData = {
    fullName: "Bilal Ahmed",
    email: email,
    phone: "+92 300 9876543",
    location: "Lahore, Pakistan",
    linkedInUrl: "https://linkedin.com/in/bilal-ahmed-dev",
    githubUrl: "https://github.com/bilal-ahmed",
    targetRole: "Lead Full Stack Engineer",
    careerField: "Enterprise Software",
    bio: "Passionate engineer with 6 years building high-throughput web apps.",
    education: [
      {
        degree: "BS Computer Science",
        institution: "FAST NUCES Lahore",
        fieldOfStudy: "Computer Science",
        startDate: "2018",
        endDate: "2022",
        gpa: "3.7 / 4.0",
      },
    ],
    experiences: [
      {
        company: "TechLogix Global",
        jobTitle: "Senior Software Engineer",
        location: "Lahore",
        duration: "Jan 2022 - Present (2 Years)",
        responsibilities: [
          "Built high-throughput payment microservices using Next.js, Node.js and PostgreSQL.",
          "Optimized database queries reducing p95 latency by 40%.",
        ],
        technologiesUsed: ["Next.js", "TypeScript", "PostgreSQL", "Docker"],
      },
    ],
    projects: [
      {
        name: "PayFlow Gateway",
        role: "Lead Architect",
        description: "Fintech payment processing pipeline with real-time webhooks.",
        technologies: ["Node.js", "PostgreSQL", "Redis"],
        responsibilities: ["Engineered payment ingestion API handling 5M monthly requests."],
        projectUrl: "https://payflow.example.com",
        githubUrl: "https://github.com/bilal-ahmed/payflow",
      },
    ],
    skills: ["TypeScript", "Next.js", "React", "PostgreSQL", "Node.js", "Docker"],
  };

  const savedProfile = await profileService.saveOnboarding(onboardingData, signup.user.id);
  console.log("2. Saved onboarding profile:", {
    fullName: savedProfile.profile.fullName,
    headline: savedProfile.profile.professionalHeadline,
    phone: savedProfile.profile.phone,
    completionPercentage: savedProfile.profile.completionPercentage,
    experiencesCount: savedProfile.experiences.length,
    educationCount: savedProfile.education.length,
    projectsCount: savedProfile.projects.length,
    skillsCount: savedProfile.skills.length,
  });

  // 3. Query directly from database to verify it is physically stored in Neon DB
  const [dbRow] = await db`SELECT * FROM profiles WHERE user_id = ${signup.user.id}`;
  console.log("3. Direct DB row check in Neon PostgreSQL:", {
    fullName: dbRow.full_name,
    phone: dbRow.phone,
    headline: dbRow.professional_headline,
    experiences: dbRow.experiences.length,
    education: dbRow.education.length,
    projects: dbRow.projects.length,
    skills: dbRow.skills.length,
  });

  if (dbRow.full_name !== "Bilal Ahmed" || dbRow.phone !== "+92 300 9876543") {
    throw new Error("Persistence verification failed: database row does not match!");
  }

  console.log("=== User Data Persistence in Neon DB Successfully Verified! ===");
}

testProfilePersistence().catch(console.error);
