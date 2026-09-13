import { cookies } from "next/headers";

export interface SupabaseClientStub {
  from(table: string): any;
  auth: {
    getUser(): Promise<{ data: { user: any }; error: any }>;
    signUp(params: any): Promise<{ data: any; error: any }>;
    signInWithPassword(params: any): Promise<{ data: any; error: any }>;
    signOut(): Promise<{ error: any }>;
    resetPasswordForEmail(email: string, options?: any): Promise<{ error: any }>;
  };
}

export async function createServerSupabaseClient(): Promise<SupabaseClientStub> {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  // Check if @supabase/ssr is resolvable
  try {
    const pkg = "@supabase/ssr";
    const { createServerClient } = eval("require")(pkg);
    return createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: any[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Ignore when called from Server Components
          }
        },
      },
    });
  } catch {
    // Return typed fallback client stub when Supabase package is not physically present in node_modules
    return {
      from: (_table: string) => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }), order: async () => ({ data: [], error: null }) }), order: async () => ({ data: [], error: null }) }),
        insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }) }),
        delete: () => ({ eq: () => ({ error: null }) }),
        upsert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
      }),
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signUp: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
        resetPasswordForEmail: async () => ({ error: null }),
      },
    };
  }
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes("placeholder") && key !== "placeholder-anon-key");
}
