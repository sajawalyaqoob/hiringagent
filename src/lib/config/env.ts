export const env = {
  isDev: process.env.NODE_ENV !== "production",
  isProd: process.env.NODE_ENV === "production",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "HireBoost AI",

  // Neon PostgreSQL Database
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_CMnJi9oV5fGO@ep-odd-night-b5v9ynf5-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require",

  // Authentication & Security
  jwtSecret: process.env.JWT_SECRET || "hireagent_production_jwt_secret_key_2026_super_secure_pakistan_portal",

  // Cloudinary Media & Payment Proof Storage
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "anp5fflm",
    apiKey: process.env.CLOUDINARY_API_KEY || "974866639114721",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "S-t_I4aJrHRcNfAfXJAw8BrfPCo",
    url: process.env.CLOUDINARY_URL || "cloudinary://974866639114721:S-t_I4aJrHRcNfAfXJAw8BrfPCo@anp5fflm",
  },

  // Pakistan JazzCash Payment Configuration
  jazzcash: {
    number: process.env.NEXT_PUBLIC_JAZZCASH_NUMBER || process.env.JAZZCASH_NUMBER || "03016532878",
    title: process.env.NEXT_PUBLIC_JAZZCASH_TITLE || "HireAgent",
  },

  // Admin Credentials
  admin: {
    email: process.env.ADMIN_EMAIL || "admin@hireagent.com",
    password: process.env.ADMIN_PASSWORD || "adminhireagent01233adminhireagent",
  },

  // AI Providers (Server Only)
  ai: {
    groqApiKey: process.env.GROQ_API_KEY || "",
    geminiApiKey: process.env.GEMINI_API_KEY || "",
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || "",
  },
};
