import { isSupabaseConfigured, createServerSupabaseClient } from "../supabase/server";
import { mockGenerations } from "@/lib/server/mock-db";
import { DefaultAIProvider } from "../ai/provider";
import type { Generation, GenerationType } from "@/types/database";

export interface GenerateInputParams {
  type: GenerationType;
  jobId?: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  tone?: "professional" | "confident" | "enthusiastic" | "concise";
  keyHighlights?: string;
  recipientName?: string;
}

export class GenerationService {
  private aiProvider = new DefaultAIProvider();

  async getRecentGenerations(userId?: string): Promise<Generation[]> {
    if (isSupabaseConfigured() && userId) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
          .from("generations")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (!error && data) {
          return data.map((g: any) => ({
            id: g.id,
            userId: g.user_id,
            type: g.generation_type as GenerationType,
            jobId: g.job_id,
            jobTitle: g.input_metadata?.jobTitle || "Job Target",
            company: g.input_metadata?.company || "Company",
            status: g.status,
            inputs: g.input_metadata || {},
            outputContent: g.output_content,
            errorMessage: g.error_message,
            createdAt: g.created_at,
            updatedAt: g.updated_at,
          }));
        }
      } catch (err) {
        console.warn("[GenerationService] Error fetching generations from Supabase:", err);
      }
    }
    return [...mockGenerations];
  }

  async generateArtifact(params: GenerateInputParams, userId: string = "usr_mock_01"): Promise<Generation> {
    const tone = params.tone || "professional";
    const recipient = params.recipientName || "Hiring Team";
    let generatedOutput = "";

    if (this.aiProvider.getActiveProvider() !== "mock") {
      try {
        const livePrompt = `You are generating a tailored ${params.type.replace(/_/g, " ")} for a candidate applying to:
Job Title: ${params.jobTitle}
Company: ${params.company}
Recipient: ${recipient}
Tone: ${tone}
Job Description Context:
${params.jobDescription || "High-performance platform engineering role"}

Candidate Highlights & Achievements:
${params.keyHighlights || "Experienced full-stack & systems engineer with verified expertise in TypeScript, Next.js, Go, PostgreSQL, Kafka, and Cloud Infrastructure."}

Requirements:
- Format cleanly in Markdown.
- Tailor specifically to ${params.company} and ${params.jobTitle}.
- DO NOT invent fake past company names or unverified degrees.
- Focus on high-impact quantifiable outcomes and active verbs.`;

        generatedOutput = await this.aiProvider.generateText(livePrompt);
      } catch (aiErr) {
        console.warn("[GenerationService] Live AI generation failed, falling back to curated template:", aiErr);
      }
    }

    if (!generatedOutput) {
      switch (params.type) {
      case "tailored_resume":
        generatedOutput = `# Alex Morgan
Seattle, WA | alex.morgan@example.com | (555) 234-8901 | linkedin.com/in/alex-morgan-dev

## Tailored Profile Summary for ${params.jobTitle} at ${params.company}
Performance-driven Senior Software Engineer with 6+ years of production experience architecting scalable distributed systems and resilient web applications. Tailored for ${params.company}'s mission, bringing deep proficiency in modern TypeScript/Next.js architectures, high-volume data streaming, and cloud infrastructure optimization.

## Targeted Key Achievements
- **Architecture & Scale:** Spearheaded distributed event systems processing 45M+ daily requests with 99.99% availability.
- **Performance:** Reduced PostgreSQL p99 query latency by 38% through index redesign and partition pruning.
- **Efficiency:** Decreased cloud infrastructure compute costs by $120k annually via container right-sizing.

## Core Relevant Technologies
- **Core:** TypeScript, Next.js, React, Node.js, Go (Golang)
- **Data & Storage:** PostgreSQL, Redis, Apache Kafka
- **Infrastructure:** AWS, Kubernetes, Docker, CI/CD GitHub Actions`;
        break;

      case "cover_letter":
        generatedOutput = `Dear ${recipient},

I am writing to express my strong enthusiasm for the ${params.jobTitle} role at ${params.company}. Having followed ${params.company}'s engineering momentum, I am eager to contribute my 6+ years of full-stack and systems engineering experience to your high-performing team.

In my current role at CloudScale Technologies, I architected distributed microservices handling over 45 million daily requests while decreasing p99 database latency by 38%. Prior to that, at Vanguard Digital Labs, I led frontend performance initiatives in Next.js and TypeScript that elevated Lighthouse scores from 54 to 98 across customer analytics products.

${params.keyHighlights ? `Specifically, ${params.keyHighlights}` : `Your focus on reliable, developer-first engineering resonates with my commitment to type safety, clean abstractions, and high system availability.`}

I would welcome the opportunity to discuss how my technical background and proactive problem-solving can accelerate ${params.company}'s roadmap. Thank you for your time and consideration.

Warm regards,
Alex Morgan
Seattle, WA | (555) 234-8901 | alex.morgan@example.com`;
        break;

      case "recruiter_email":
        generatedOutput = `Subject: Senior Full-Stack Engineer — Alex Morgan for ${params.company} ${params.jobTitle}

Hi ${recipient},

I hope you're having a productive week.

I noticed ${params.company}'s opening for the ${params.jobTitle} position and wanted to reach out directly. Over the past 6 years, I've specialized in building high-throughput distributed systems in Go and TypeScript, and modern web platforms in Next.js.

At CloudScale Technologies, I recently:
• Scaled event-driven microservices to handle 45M+ daily events.
• Reduced PostgreSQL p99 latency by 38% through database indexing and connection pooling.
• Cut AWS compute spend by $120k/year through automated container optimization.

Given your team's stack and requirements, I would love to connect for 10 minutes to learn more about your current engineering priorities and discuss how my experience aligns.

Best regards,
Alex Morgan
Portfolio: https://alexmorgan.codes
LinkedIn: https://linkedin.com/in/alex-morgan-dev`;
        break;

      case "recruiter_message":
        generatedOutput = `Hi ${recipient} — I saw that ${params.company} is hiring for a ${params.jobTitle}. I'm a Senior Full-Stack & Distributed Systems Engineer with 6+ years of experience scaling Next.js, Go, and PostgreSQL platforms (45M+ daily requests). Would love to connect and share how my background could add value to your engineering team!`;
        break;

      case "linkedin_post":
        generatedOutput = `🚀 Excited to announce I am actively exploring senior engineering roles!

Over the past 6 years, I've had the privilege of architecting high-throughput distributed pipelines and delightful Next.js web applications, most recently scaling event services to 45M+ daily events and reducing database latency by 38%.

I am primarily looking for roles in:
🔹 Senior / Staff Full-Stack Engineer
🔹 Senior Distributed Systems & Backend Engineer
🔹 Focus areas: TypeScript, Next.js, Go, PostgreSQL, Cloud Infrastructure

If your team is building impactful developer tooling, fintech, or cloud infrastructure, I'd love to connect!

#SoftwareEngineering #TechCareers #FullStack #OpenToWork #TypeScript #Nextjs`;
        break;

      case "application_strategy":
        generatedOutput = `# Application Strategy: ${params.jobTitle} at ${params.company}

## 1. High-Impact Match Angles
- **Match Score:** 94% compatibility with stated requirements.
- **Top Differentiator:** Highlight hands-on Kafka and Go concurrency experience alongside Next.js full-stack capabilities.

## 2. Key Action Plan
1. **Resume Submission:** Use Tailored Version #1 emphasizing p99 query latency metrics and large-scale message streaming.
2. **Direct Outreach:** Send personalized recruiter email to ${params.company}'s engineering recruitment lead within 24 hours of portal submission.
3. **Portfolio Presentation:** Ensure StreamQuery open-source repository link is prominent on page 1 of resume.
4. **Interview Preparation:** Prepare deep dive into distributed transaction isolation levels and multi-region failover.`;
        break;
      }
    }

    const newGen: Generation = {
      id: `gen_${Date.now().toString(36)}`,
      userId,
      type: params.type,
      jobId: params.jobId,
      jobTitle: params.jobTitle,
      company: params.company,
      status: "completed",
      inputs: {
        tone,
        keyHighlights: params.keyHighlights,
        recipientName: params.recipientName,
        jobTitle: params.jobTitle,
        company: params.company,
      },
      outputContent: generatedOutput,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: dbGen } = await supabase
          .from("generations")
          .insert({
            user_id: userId,
            generation_type: params.type,
            job_id: params.jobId || null,
            status: "completed",
            input_metadata: newGen.inputs,
            output_content: generatedOutput,
          })
          .select()
          .single();

        if (dbGen) {
          newGen.id = dbGen.id;
        }
      } catch (err) {
        console.warn("[GenerationService] Error saving generation to Supabase:", err);
      }
    }

    mockGenerations.unshift(newGen);
    return newGen;
  }
}

export const generationService = new GenerationService();
