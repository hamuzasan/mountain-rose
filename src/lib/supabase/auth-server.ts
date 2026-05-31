import "server-only";

import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import type { Database } from "./database.types";

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return { url, anonKey };
}

export async function getSupabaseAuthServerClient(): Promise<{
  client: SupabaseClient<Database> | null;
  error?: string;
}> {
  const { url, anonKey } = getEnv();
  if (!url || !anonKey) {
    return { client: null, error: "Supabase public configuration is missing." };
  }

  const cookieStore = await cookies();

  return {
    client: createServerClient<Database>(url, anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot always set cookies; Route Handlers can.
          }
        },
      },
    }),
  };
}
