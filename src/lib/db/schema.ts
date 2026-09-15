import bcrypt from "bcryptjs";
import { getDb } from "./neon";
import { env } from "../config/env";

export const SCHEMA_SQL = `
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'weekly', 'monthly', 'professional', 'career_pro')),
    subscription_status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (subscription_status IN ('pending_payment', 'pending_approval', 'active', 'expired', 'rejected')),
    subscription_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    professional_headline TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL,
    phone TEXT,
    location TEXT NOT NULL DEFAULT '',
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    current_job_title TEXT NOT NULL DEFAULT '',
    years_of_experience NUMERIC(4, 1) NOT NULL DEFAULT 0,
    industry TEXT NOT NULL DEFAULT '',
    career_level TEXT NOT NULL DEFAULT 'mid',
    employment_status TEXT NOT NULL DEFAULT 'open_to_work',
    completion_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PAYMENTS TABLE (Pakistan JazzCash Manual Submissions)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL CHECK (plan_id IN ('weekly', 'monthly', 'professional', 'career_pro')),
    plan_name TEXT NOT NULL,
    amount_pkr NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'jazzcash',
    sender_number TEXT NOT NULL,
    transaction_id TEXT NOT NULL,
    screenshot_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES users(id)
);

-- 4. RESUMES TABLE
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    file_type TEXT NOT NULL DEFAULT 'pdf',
    file_path TEXT NOT NULL DEFAULT '',
    is_primary BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'active',
    parse_status TEXT NOT NULL DEFAULT 'PARSED',
    analyzed_at TIMESTAMPTZ,
    ats_score NUMERIC(5, 2) DEFAULT 85,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. JOBS TABLE
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT '',
    workplace_type TEXT NOT NULL DEFAULT 'remote',
    employment_type TEXT NOT NULL DEFAULT 'full_time',
    seniority TEXT NOT NULL DEFAULT 'senior',
    experience_years_required NUMERIC(4, 1) NOT NULL DEFAULT 3,
    salary_min NUMERIC(10, 2),
    salary_max NUMERIC(10, 2),
    salary_currency TEXT DEFAULT 'PKR',
    description TEXT NOT NULL DEFAULT '',
    required_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    preferred_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    responsibilities JSONB NOT NULL DEFAULT '[]'::jsonb,
    education_requirement TEXT,
    source TEXT DEFAULT 'curated',
    source_url TEXT,
    posted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    job_title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'applied',
    applied_date TIMESTAMPTZ DEFAULT NOW(),
    salary_offered NUMERIC(10, 2),
    notes TEXT,
    next_action TEXT,
    next_action_due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. GENERATIONS TABLE (AI Resumes & Cover Letters)
CREATE TABLE IF NOT EXISTS generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    generation_type TEXT NOT NULL,
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'completed',
    input_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_content TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);
`;

let hasInitialized = false;

/**
 * Initialize Neon PostgreSQL tables and seed Admin User
 */
export async function initializeDatabase(): Promise<{ success: boolean; message: string }> {
  if (hasInitialized) {
    return { success: true, message: "Database already initialized in this runtime." };
  }

  try {
    const db = getDb();

    // 1. Execute schema creation in pieces to ensure full compatibility
    await db`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await db`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        subscription_tier TEXT NOT NULL DEFAULT 'free',
        subscription_status TEXT NOT NULL DEFAULT 'pending_payment',
        subscription_expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await db`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        full_name TEXT NOT NULL,
        professional_headline TEXT NOT NULL DEFAULT '',
        email TEXT NOT NULL,
        phone TEXT,
        location TEXT NOT NULL DEFAULT '',
        linkedin_url TEXT,
        github_url TEXT,
        portfolio_url TEXT,
        current_job_title TEXT NOT NULL DEFAULT '',
        years_of_experience NUMERIC(4, 1) NOT NULL DEFAULT 0,
        industry TEXT NOT NULL DEFAULT '',
        career_level TEXT NOT NULL DEFAULT 'mid',
        employment_status TEXT NOT NULL DEFAULT 'open_to_work',
        completion_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // Ensure profiles table has rich profile columns for user data persistence
    await db`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT`;
    await db`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT`;
    await db`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb`;
    await db`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experiences JSONB DEFAULT '[]'::jsonb`;
    await db`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS projects JSONB DEFAULT '[]'::jsonb`;
    await db`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb`;
    await db`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS job_preferences JSONB DEFAULT '{}'::jsonb`;

    await db`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        plan_id TEXT NOT NULL,
        plan_name TEXT NOT NULL,
        amount_pkr NUMERIC(10, 2) NOT NULL,
        payment_method TEXT NOT NULL DEFAULT 'jazzcash',
        sender_number TEXT NOT NULL,
        transaction_id TEXT NOT NULL,
        screenshot_url TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        admin_notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        reviewed_at TIMESTAMPTZ,
        reviewed_by UUID REFERENCES users(id)
      )
    `;

    await db`
      CREATE TABLE IF NOT EXISTS resumes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_size BIGINT NOT NULL DEFAULT 0,
        file_type TEXT NOT NULL DEFAULT 'pdf',
        file_path TEXT NOT NULL DEFAULT '',
        is_primary BOOLEAN DEFAULT FALSE,
        status TEXT NOT NULL DEFAULT 'active',
        parse_status TEXT NOT NULL DEFAULT 'PARSED',
        analyzed_at TIMESTAMPTZ,
        ats_score NUMERIC(5, 2) DEFAULT 85,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await db`
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT NOT NULL DEFAULT '',
        workplace_type TEXT NOT NULL DEFAULT 'remote',
        employment_type TEXT NOT NULL DEFAULT 'full_time',
        seniority TEXT NOT NULL DEFAULT 'senior',
        experience_years_required NUMERIC(4, 1) NOT NULL DEFAULT 3,
        salary_min NUMERIC(10, 2),
        salary_max NUMERIC(10, 2),
        salary_currency TEXT DEFAULT 'PKR',
        description TEXT NOT NULL DEFAULT '',
        required_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
        preferred_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
        responsibilities JSONB NOT NULL DEFAULT '[]'::jsonb,
        education_requirement TEXT,
        source TEXT DEFAULT 'curated',
        source_url TEXT,
        posted_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await db`
      CREATE TABLE IF NOT EXISTS applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
        job_title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'applied',
        applied_date TIMESTAMPTZ DEFAULT NOW(),
        salary_offered NUMERIC(10, 2),
        notes TEXT,
        next_action TEXT,
        next_action_due_date TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await db`
      CREATE TABLE IF NOT EXISTS generations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        generation_type TEXT NOT NULL,
        job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
        status TEXT NOT NULL DEFAULT 'completed',
        input_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        output_content TEXT,
        error_message TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await db`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        ip_address TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // 2. Performance Indexes
    await db`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    await db`CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id)`;
    await db`CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status)`;
    await db`CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id)`;
    await db`CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id)`;
    await db`CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id)`;

    // 3. Seed or Ensure Admin Account
    const adminEmail = env.admin.email || "admin@hireagent.com";
    const adminPassword = env.admin.password || "adminhireagent01233adminhireagent";

    const existingAdmin = await db`SELECT id FROM users WHERE email = ${adminEmail} LIMIT 1`;

    if (!existingAdmin || existingAdmin.length === 0) {
      const adminHash = bcrypt.hashSync(adminPassword, 10);
      const [adminUser] = await db`
        INSERT INTO users (email, password_hash, name, role, subscription_tier, subscription_status)
        VALUES (${adminEmail}, ${adminHash}, 'HireAgent Administrator', 'admin', 'career_pro', 'active')
        RETURNING id
      `;

      if (adminUser?.id) {
        await db`
          INSERT INTO profiles (user_id, full_name, professional_headline, email, current_job_title, location)
          VALUES (${adminUser.id}, 'HireAgent Administrator', 'Chief Executive & Platform Administrator', ${adminEmail}, 'System Administrator', 'Islamabad, Pakistan')
          ON CONFLICT (user_id) DO NOTHING
        `;
      }
      console.log(`[Neon DB] Admin user created: ${adminEmail}`);
    } else {
      // Ensure admin has role 'admin' and status 'active'
      await db`
        UPDATE users
        SET role = 'admin', subscription_status = 'active', subscription_tier = 'career_pro', updated_at = NOW()
        WHERE email = ${adminEmail}
      `;
    }

    hasInitialized = true;
    return { success: true, message: "Neon PostgreSQL schema initialized and admin user verified." };
  } catch (error: any) {
    console.error("[Neon DB] Initialization error:", error);
    return { success: false, message: error.message || "Failed to initialize database" };
  }
}
