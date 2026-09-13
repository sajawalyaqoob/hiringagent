import { z } from "zod";
import type { AIProviderConfig, AIProviderType } from "./types";

export interface IAIProvider {
  getActiveProvider(): AIProviderType;
  generateText(prompt: string, systemInstruction?: string): Promise<string>;
  generateStructuredJSON<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    systemInstruction?: string
  ): Promise<T>;
}

export const ANTI_HALLUCINATION_SYSTEM_PROMPT = `You are an AI career consultant operating under strict Zero-Hallucination rules for HireBoost AI.
CRITICAL MANDATORY CONSTRAINTS:
1. NEVER fabricate, invent, or assume any employment history, company names, job titles, years of experience, degrees, certifications, skills, or metrics not explicitly contained in the candidate's provided profile context.
2. If required skills or qualifications are missing from the candidate's profile, explicitly state them as missing or omit them—DO NOT claim the candidate possesses them.
3. Improve phrasing, active verbs, and alignment with target job descriptions ONLY using truthful facts verified from the candidate.`;

export class DefaultAIProvider implements IAIProvider {
  private config: AIProviderConfig;

  constructor(config?: AIProviderConfig) {
    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    let provider: AIProviderType = "mock";
    let apiKey: string | undefined = undefined;

    if (groqKey && groqKey.trim() !== "") {
      provider = "groq";
      apiKey = groqKey.trim();
    } else if (geminiKey && geminiKey.trim() !== "") {
      provider = "gemini";
      apiKey = geminiKey.trim();
    } else if (openaiKey && openaiKey.trim() !== "") {
      provider = "openai";
      apiKey = openaiKey.trim();
    }

    this.config = config || {
      provider,
      apiKey,
      modelName:
        provider === "groq"
          ? (process.env.GROQ_MODEL || "groq/compound-mini")
          : provider === "gemini"
          ? "gemini-1.5-flash"
          : provider === "openai"
          ? "gpt-4o-mini"
          : "mock",
    };
  }

  getActiveProvider(): AIProviderType {
    return this.config.provider;
  }

  /**
   * Helper to clean JSON strings from Markdown block formatting
   */
  private cleanJsonResponse(raw: string): string {
    let cleaned = raw.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "").replace(/```$/, "");
    }
    return cleaned.trim();
  }

  /**
   * Execute API request to Google Gemini REST API
   */
  private async callGeminiAPI(prompt: string, systemInstruction?: string): Promise<string> {
    const apiKey = this.config.apiKey;
    if (!apiKey) throw new Error("Gemini API key missing");

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const fullSystemInstruction = `${ANTI_HALLUCINATION_SYSTEM_PROMPT}\n${systemInstruction || ""}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          system_instruction: { parts: [{ text: fullSystemInstruction }] },
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048,
          },
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        console.error("[AIProvider Gemini Error]:", response.status, errText);
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!generatedText) throw new Error("Empty text response from Gemini API");

      return generatedText;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  /**
   * Execute API request to OpenAI REST API
   */
  private async callOpenAIAPI(prompt: string, systemInstruction?: string): Promise<string> {
    const apiKey = this.config.apiKey;
    if (!apiKey) throw new Error("OpenAI API key missing");

    const endpoint = "https://api.openai.com/v1/chat/completions";
    const fullSystemInstruction = `${ANTI_HALLUCINATION_SYSTEM_PROMPT}\n${systemInstruction || ""}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.config.modelName || "gpt-4o-mini",
          messages: [
            { role: "system", content: fullSystemInstruction },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        console.error("[AIProvider OpenAI Error]:", response.status, errText);
        throw new Error(`OpenAI API returned status ${response.status}`);
      }

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content;
      if (!text) throw new Error("Empty text response from OpenAI API");

      return text;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  /**
   * Execute API request to Groq REST API (OpenAI-compatible)
   */
  private async callGroqAPI(prompt: string, systemInstruction?: string): Promise<string> {
    const apiKey = this.config.apiKey;
    if (!apiKey) throw new Error("Groq API key missing");

    const endpoint = "https://api.groq.com/openai/v1/chat/completions";
    const fullSystemInstruction = `${ANTI_HALLUCINATION_SYSTEM_PROMPT}\n${systemInstruction || ""}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.config.modelName || process.env.GROQ_MODEL || "groq/compound-mini",
          messages: [
            { role: "system", content: fullSystemInstruction },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
          max_tokens: 1024,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        console.error("[AIProvider Groq Error]:", response.status, errText);
        throw new Error(`Groq API returned status ${response.status}`);
      }

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content;
      if (!text) throw new Error("Empty text response from Groq API");

      return text;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    if (this.config.provider === "groq") {
      try {
        return await this.callGroqAPI(prompt, systemInstruction);
      } catch (err) {
        console.warn("[AIProvider] Groq call failed, falling back to mock:", err);
      }
    }

    if (this.config.provider === "gemini") {
      try {
        return await this.callGeminiAPI(prompt, systemInstruction);
      } catch (err) {
        console.warn("[AIProvider] Gemini call failed, falling back to mock:", err);
      }
    }

    if (this.config.provider === "openai") {
      try {
        return await this.callOpenAIAPI(prompt, systemInstruction);
      } catch (err) {
        console.warn("[AIProvider] OpenAI call failed, falling back to mock:", err);
      }
    }

    // Development Fallback Mode when live credentials are not set or fail
    return `[HireBoost AI Output (Dev Mode)]\nProcessed prompt for candidate profile context.\nPrompt summary: ${prompt.slice(0, 80)}...`;
  }

  async generateStructuredJSON<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    systemInstruction?: string
  ): Promise<T> {
    const jsonPrompt = `${prompt}\n\nIMPORTANT: Return ONLY a valid JSON object matching the requested schema. Do NOT include extra commentary outside the JSON object.`;

    if (this.config.provider === "groq" || this.config.provider === "gemini" || this.config.provider === "openai") {
      try {
        const rawText = await this.generateText(jsonPrompt, systemInstruction);
        const cleaned = this.cleanJsonResponse(rawText);
        const parsedJson = JSON.parse(cleaned);
        return schema.parse(parsedJson);
      } catch (err) {
        console.warn("[AIProvider] Live API structured JSON parsing/validation failed, using schema fallback:", err);
      }
    }

    // Fallback Mock generator creating valid Zod schema matching objects
    try {
      // Create schema-compliant mock objects based on target schema
      const rawText = await this.generateText(prompt, systemInstruction);
      return this.createFallbackFromSchema(schema, rawText);
    } catch (err) {
      console.error("[AIProvider] Fallback generation error:", err);
      throw new Error("Unable to parse structured AI response. Please try again.");
    }
  }

  private createFallbackFromSchema<T>(schema: z.ZodSchema<T>, _rawText: string): T {
    // Attempt dummy object parse for development mode
    const sampleOutput: Record<string, any> = {
      professionalSummary: "Results-driven engineering professional with verified experience architecting scalable distributed systems and cloud platforms.",
      highlightedSkills: ["TypeScript", "Next.js", "React", "PostgreSQL", "Go"],
      improvedBullets: [
        {
          original: "Responsible for database queries and API design.",
          improved: "Architected PostgreSQL query indexing strategy, reducing p99 response times by 38%.",
          reason: "Quantifies technical impact using candidate's verified database metrics.",
        },
      ],
      atsKeywordAlignment: ["TypeScript", "Next.js", "PostgreSQL", "Kafka"],
      postContent: "🚀 Excited to share my latest engineering work building high-throughput distributed systems in Next.js & Go! Focused on system reliability, type safety, and clean architecture.",
      hashtags: ["#SoftwareEngineering", "#TypeScript", "#NextJS", "#TechCareers"],
      callToAction: "Connect with me to discuss scalable platform engineering!",
      subject: "Senior Software Engineer — Candidate Inquiry",
      greeting: "Hello Hiring Manager,",
      introduction: "I am reaching out regarding the engineering opportunity at your organization.",
      valueProposition: "Over the past 6 years, I have architected event-driven microservices handling 45M+ daily requests.",
      closing: "Best regards,",
      fullEmailText: "Subject: Senior Software Engineer Inquiry\n\nHello,\n\nI am reaching out to share my interest in engineering opportunities. Over the past 6 years, I have architected distributed microservices processing 45M+ daily requests.\n\nBest regards,\nAlex Morgan",
      messageType: "linkedin_inmail",
      messageText: "Hi! I noticed your team's engineering work and wanted to connect. I specialize in Next.js, Go, and PostgreSQL distributed systems.",
      suggestedFollowupDays: 4,
    };

    const parsed = schema.safeParse(sampleOutput);
    if (parsed.success) return parsed.data;

    throw new Error("Fallback JSON object did not satisfy Zod schema.");
  }
}
