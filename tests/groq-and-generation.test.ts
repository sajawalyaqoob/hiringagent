import assert from "node:assert";
import { DefaultAIProvider } from "../src/lib/ai/provider";
import { generationService } from "../src/lib/services/generation-service";

async function testGroqAndGeneration() {
  console.log("==========================================");
  console.log("TESTING GROQ PROVIDER & GENERATION SERVICE");
  console.log("==========================================");

  // 1. Test Provider Type & Fallback
  const defaultProvider = new DefaultAIProvider();
  console.log("Default active provider:", defaultProvider.getActiveProvider());
  assert(
    ["groq", "gemini", "openai", "mock"].includes(defaultProvider.getActiveProvider()),
    "Active provider must be a valid AIProviderType"
  );

  // 2. Test Groq Explicit Config Initialization
  const groqProvider = new DefaultAIProvider({
    provider: "groq",
    apiKey: "dummy_gsk_test",
    modelName: "llama-3.3-70b-versatile",
  });
  assert.strictEqual(groqProvider.getActiveProvider(), "groq", "Provider should be groq");
  console.log("  ✅ Groq provider initialization verified");

  // 3. Test Generation Service
  const tailoredResume = await generationService.generateArtifact({
    type: "tailored_resume",
    jobTitle: "Staff Software Engineer",
    company: "Stripe",
    jobDescription: "Distributed payments infrastructure using Go and PostgreSQL",
    tone: "professional",
    keyHighlights: "45M daily events, 99.99% uptime",
  });

  assert(tailoredResume.id, "Generation must have an ID");
  assert.strictEqual(tailoredResume.type, "tailored_resume");
  assert(tailoredResume.outputContent && tailoredResume.outputContent.length > 50, "Output content must be populated");
  console.log("  ✅ GenerationService tailored_resume passed");

  const coverLetter = await generationService.generateArtifact({
    type: "cover_letter",
    jobTitle: "Senior Full-Stack Engineer",
    company: "Vercel",
    jobDescription: "Next.js performance and edge functions",
    recipientName: "Engineering Leadership",
  });

  assert(coverLetter.id, "Cover letter generation must have an ID");
  assert.strictEqual(coverLetter.type, "cover_letter");
  assert(
    (coverLetter.outputContent && coverLetter.outputContent.includes("Engineering Leadership")) ||
      (coverLetter.outputContent && coverLetter.outputContent.length > 50)
  );
  console.log("  ✅ GenerationService cover_letter passed");

  console.log("==========================================");
  console.log("ALL NEW UNIT TESTS PASSED (100%)");
  console.log("==========================================");
}

testGroqAndGeneration().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
