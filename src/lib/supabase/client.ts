import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return { url, anonKey };
}

let cachedClient: SupabaseClient<Database> | null = null;

export function getSupabaseBrowserClient(): {
  client: SupabaseClient<Database> | null;
  error?: string;
} {
  const { url, anonKey } = getEnv();
  if (!url || !anonKey) {
    return { client: null, error: "Supabase public configuration is missing." };
  }

  if (!cachedClient) {
    cachedClient = createBrowserClient<Database>(url, anonKey);
  }

  return {
    client: cachedClient,
  };
}
