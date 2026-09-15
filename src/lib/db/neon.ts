import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { env } from "../config/env";

let sqlClient: NeonQueryFunction<false, false> | null = null;

/**
 * Get or initialize the Neon serverless SQL query client
 */
export function getDb() {
  if (!sqlClient) {
    const connString =
      env.databaseUrl ||
      process.env.DATABASE_URL ||
      "postgresql://neondb_owner:npg_CMnJi9oV5fGO@ep-odd-night-b5v9ynf5-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require";

    sqlClient = neon(connString);
  }
  return sqlClient;
}

/**
 * Convenience SQL tagged template function for parameterized queries
 */
export const sql = (strings: TemplateStringsArray, ...values: any[]) => {
  const db = getDb();
  return db(strings, ...values);
};

/**
 * Execute parameterized query using Neon HTTP driver
 */
export async function query<T = any>(queryString: string, params: any[] = []): Promise<T[]> {
  const db = getDb();
  // Neon sql client supports executing raw query strings with parameterized arrays
  const result = await (db as any)(queryString, params);
  return result as T[];
}

/**
 * Test Neon database connectivity
 */
export async function testDbConnection(): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    const db = getDb();
    const rows = await db`SELECT 1 as connected, NOW() as server_time`;
    const latencyMs = Date.now() - start;
    return { ok: Boolean(rows && rows.length > 0), latencyMs };
  } catch (err: any) {
    return { ok: false, latencyMs: Date.now() - start, error: err.message || "Connection failed" };
  }
}
