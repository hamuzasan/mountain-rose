import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return { url, anonKey };
}

export function getSupabaseBrowserClient(): {
  client: SupabaseClient | null;
  error?: string;
} {
  const { url, anonKey } = getEnv();
  if (!url || !anonKey) {
    return { client: null, error: "Supabase public configuration is missing." };
  }

  return {
    client: createClient(url, anonKey),
  };
}
