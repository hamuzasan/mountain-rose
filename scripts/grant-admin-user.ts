import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "../src/lib/supabase/database.types";

function stripQuotes(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseEnvFile(text: string) {
  const lines = text.split(/\r?\n/);
  const entries: Array<{ key: string; value: string }> = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const eqIndex = line.indexOf("=");
    if (eqIndex <= 0) continue;

    const key = line.slice(0, eqIndex).trim();
    const value = stripQuotes(line.slice(eqIndex + 1));
    if (!key) continue;

    entries.push({ key, value });
  }

  return entries;
}

function loadEnvFromFileIfPresent(filePath: string) {
  if (!existsSync(filePath)) return;

  const raw = readFileSync(filePath, "utf8");
  const entries = parseEnvFile(raw);
  for (const { key, value } of entries) {
    if (process.env[key] == null) {
      process.env[key] = value;
    }
  }
}

function ensureEnvLoaded() {
  loadEnvFromFileIfPresent(resolve(process.cwd(), ".env.local"));
  loadEnvFromFileIfPresent(resolve(process.cwd(), ".env"));
}

function createSupabaseAdmin() {
  ensureEnvLoaded();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url) {
    throw new Error("Missing env var: NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!serviceRoleKey) {
    throw new Error("Missing env var: SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

async function findUserByEmail(
  supabase: ReturnType<typeof createSupabaseAdmin>,
  email: string,
) {
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw new Error(`Unable to list auth users: ${error.message}`);
    }

    const users = data.users || [];
    const match = users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (match) return match;
    if (users.length < perPage) return null;

    page += 1;
  }
}

async function main() {
  const email = (process.argv[2] || "").trim().toLowerCase();
  const role = (process.argv[3] || "admin").trim().toLowerCase();

  if (!email) {
    throw new Error("Usage: npm run grant:admin -- email@domain.com [role]");
  }

  const supabase = createSupabaseAdmin();
  const user = await findUserByEmail(supabase, email);

  if (!user?.id) {
    throw new Error(
      `User with email '${email}' was not found in Supabase Auth. Create or invite the user first.`,
    );
  }

  const { error } = await supabase.from("admin_profiles").upsert(
    {
      id: user.id,
      email,
      role,
    },
    {
      onConflict: "email",
    },
  );

  if (error) {
    throw new Error(`Unable to upsert admin_profiles: ${error.message}`);
  }

  console.log(`Admin profile ready for ${email}`);
  console.log(`User ID: ${user.id}`);
  console.log(`Role: ${role}`);
  console.log("Login path: /admin/login");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Grant admin failed.");
  process.exitCode = 1;
});
