import { isSupabaseConfigured, createServerSupabaseClient } from "../supabase/server";
import { DefaultAIProvider } from "../ai/provider";

export interface InterviewMessage {
  id: string;
  interviewId: string;
  role: "system" | "assistant" | "user";
  content: string;
  extractedFacts?: Record<string, unknown>;
  category?: string;
  createdAt: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  status: "in_progress" | "completed";
  messages: InterviewMessage[];
  currentQuestionIndex: number;
  extractedProfileFacts: Record<string, unknown>;
  createdAt: string;
}

export const INTERVIEW_QUESTIONS = [
  {
    category: "target_roles",
    question: "What specific type of engineering role and team environment are you looking for next?",
  },
  {
    category: "skills_verification",
    question: "Which technologies and frameworks do you use most comfortably in daily development?",
  },
  {
    category: "hands_on_depth",
    question: "How many years have you built production software with React or TypeScript, and what was your primary architectural contribution?",
  },
  {
    category: "database_experience",
    question: "Which databases (SQL or NoSQL) have you deployed or optimized, and what challenges did you resolve?",
  },
  {
    category: "deployment_devops",
    question: "Have you set up CI/CD pipelines or cloud infrastructure (AWS, GCP, Vercel, Docker)? What platforms have you used?",
  },
  {
    category: "top_achievement",
    question: "What is one technical achievement or project outcome you are most proud of that demonstrates your engineering impact?",
  },
  {
    category: "team_collaboration",
    question: "When working in an engineering team, what role do you typically take during design reviews and sprint planning?",
  },
];

export class CareerInterviewService {
  private static aiProvider = new DefaultAIProvider();

  /**
   * Start or retrieve an AI Career Interview session
   */
  static async startOrGetSession(userId: string = "usr_mock_01"): Promise<InterviewSession> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: active } = await supabase
          .from("ai_interviews")
          .select("*")
          .eq("user_id", userId)
          .eq("status", "in_progress")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (active) {
          const { data: msgs } = await supabase
            .from("ai_interview_messages")
            .select("*")
            .eq("interview_id", active.id)
            .order("created_at", { ascending: true });

          const formattedMsgs: InterviewMessage[] = (msgs || []).map((m: any) => ({
            id: m.id,
            interviewId: m.interview_id,
            role: m.role,
            content: m.content,
            extractedFacts: m.extracted_facts,
            category: m.category,
            createdAt: m.created_at,
          }));

          const userRespCount = formattedMsgs.filter((m) => m.role === "user").length;

          return {
            id: active.id,
            userId: active.user_id,
            status: active.status,
            messages: formattedMsgs,
            currentQuestionIndex: Math.min(userRespCount, INTERVIEW_QUESTIONS.length - 1),
            extractedProfileFacts: active.summary || {},
            createdAt: active.created_at,
          };
        }

        // Create new interview session in DB
        const { data: newSession } = await supabase
          .from("ai_interviews")
          .insert({
            user_id: userId,
            status: "in_progress",
            summary: {},
          })
          .select()
          .single();

        if (newSession) {
          const firstQ = INTERVIEW_QUESTIONS[0];
          const { data: firstMsg } = await supabase
            .from("ai_interview_messages")
            .insert({
              interview_id: newSession.id,
              role: "assistant",
              content: firstQ.question,
              category: firstQ.category,
            })
            .select()
            .single();

          return {
            id: newSession.id,
            userId: newSession.user_id,
            status: "in_progress",
            messages: [
              {
                id: firstMsg.id,
                interviewId: newSession.id,
                role: "assistant",
                content: firstQ.question,
                category: firstQ.category,
                createdAt: firstMsg.created_at,
              },
            ],
            currentQuestionIndex: 0,
            extractedProfileFacts: {},
            createdAt: newSession.created_at,
          };
        }
      } catch (err) {
        console.warn("[CareerInterviewService] Error initiating interview in Supabase:", err);
      }
    }

    // Local fallback session
    const firstQ = INTERVIEW_QUESTIONS[0];
    return {
      id: "int_session_mock_01",
      userId,
      status: "in_progress",
      messages: [
        {
          id: "msg_01",
          interviewId: "int_session_mock_01",
          role: "assistant",
          content: firstQ.question,
          category: firstQ.category,
          createdAt: new Date().toISOString(),
        },
      ],
      currentQuestionIndex: 0,
      extractedProfileFacts: {},
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Process candidate answer using live AI provider and generate next interview question
   */
  static async submitAnswer(
    sessionId: string,
    userAnswer: string,
    userId: string = "usr_mock_01"
  ): Promise<InterviewSession> {
    const session = await this.startOrGetSession(userId);
    const currentQ = INTERVIEW_QUESTIONS[session.currentQuestionIndex];

    // Extract facts from candidate response using AI
    const factExtractionPrompt = `Analyze candidate answer for question category "${currentQ?.category || "general"}".
Answer: "${userAnswer}"
Extract structured skills, technologies, years of experience, and quantifiable achievements strictly stated by candidate.
Return JSON: {"skills": ["skill"], "achievements": ["achievement"], "summary": "brief summary"}`;

    let extractedFacts: Record<string, any> = {};
    try {
      if (this.aiProvider.getActiveProvider() !== "mock") {
        const rawAi = await this.aiProvider.generateText(factExtractionPrompt);
        extractedFacts = { rawAnswer: userAnswer, summary: rawAi.slice(0, 200) };
      } else {
        extractedFacts = { rawAnswer: userAnswer, verified: true };
      }
    } catch {
      extractedFacts = { rawAnswer: userAnswer };
    }

    const userMsg: InterviewMessage = {
      id: `msg_u_${Date.now()}`,
      interviewId: sessionId,
      role: "user",
      content: userAnswer,
      extractedFacts,
      category: currentQ?.category || "general",
      createdAt: new Date().toISOString(),
    };

    session.messages.push(userMsg);
    const nextIndex = session.currentQuestionIndex + 1;

    if (nextIndex < INTERVIEW_QUESTIONS.length) {
      const nextQ = INTERVIEW_QUESTIONS[nextIndex];
      let assistantContent = nextQ.question;

      // Make AI assistant response contextual to user's prior answer if live AI active
      if (this.aiProvider.getActiveProvider() !== "mock") {
        try {
          const followUpPrompt = `Candidate answered: "${userAnswer}".
Now ask the next interview question naturally in 2 sentences. Next Question: "${nextQ.question}"`;
          assistantContent = await this.aiProvider.generateText(followUpPrompt);
        } catch {
          assistantContent = `Great insight. ${nextQ.question}`;
        }
      }

      const assistantMsg: InterviewMessage = {
        id: `msg_a_${Date.now()}`,
        interviewId: sessionId,
        role: "assistant",
        content: assistantContent,
        category: nextQ.category,
        createdAt: new Date().toISOString(),
      };
      session.messages.push(assistantMsg);
      session.currentQuestionIndex = nextIndex;
    } else {
      session.status = "completed";
      const completionMsg: InterviewMessage = {
        id: `msg_a_${Date.now()}`,
        interviewId: sessionId,
        role: "assistant",
        content: "Thank you for completing your career discovery interview! Your verified skill evidence and career highlights have been compiled into your profile.",
        category: "completion",
        createdAt: new Date().toISOString(),
      };
      session.messages.push(completionMsg);
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        await supabase.from("ai_interview_messages").insert({
          interview_id: sessionId,
          role: "user",
          content: userAnswer,
          extracted_facts: extractedFacts,
          category: userMsg.category,
        });

        if (session.status === "completed") {
          await supabase.from("ai_interviews").update({ status: "completed" }).eq("id", sessionId);
        }
      } catch (err) {
        console.warn("[CareerInterviewService] Error writing answer to Supabase:", err);
      }
    }

    return session;
  }
}
