import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return { url, serviceRoleKey };
}

let cached: SupabaseClient | null = null;

export function getSupabaseAdminClient(): {
  client: SupabaseClient | null;
  error?: string;
} {
  const { url, serviceRoleKey } = getEnv();
  if (!url || !serviceRoleKey) {
    return { client: null, error: "Supabase admin configuration is missing." };
  }

  if (!cached) {
    cached = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }

  return { client: cached };
}
