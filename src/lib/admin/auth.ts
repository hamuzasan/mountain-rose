import "server-only";

import { redirect } from "next/navigation";

import { getSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export type AdminProfile = {
  id: string;
  email: string;
  role: string | null;
};

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

async function autoProvisionAdminProfile(user: { id: string; email?: string | null }) {
  const email = user.email?.trim().toLowerCase();
  if (!email) return null;

  const { client } = getSupabaseAdminClient();
  if (!client) return null;

  const adminEmails = getAdminEmails();
  const { count } = await client
    .from("admin_profiles")
    .select("id", { count: "exact", head: true });

  const isBootstrapOwner = (count || 0) === 0;
  const isAllowlisted = adminEmails.includes(email);

  if (!isBootstrapOwner && !isAllowlisted) {
    return null;
  }

  const role = isBootstrapOwner ? "owner" : "admin";
  const { data, error } = await client
    .from("admin_profiles")
    .upsert(
      {
        id: user.id,
        email,
        role,
      },
      { onConflict: "id" },
    )
    .select("id,email,role")
    .maybeSingle();

  if (error || !data) return null;

  return data as AdminProfile;
}

export async function getAdminSession() {
  const { client, error } = await getSupabaseAuthServerClient();
  if (!client) {
    return {
      user: null,
      profile: null,
      error: error || "Supabase is not configured.",
    };
  }

  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser();

  if (userError || !user) {
    return {
      user: null,
      profile: null,
      error: userError?.message || "Admin session not found.",
    };
  }

  const { data: profile, error: profileError } = await client
    .from("admin_profiles")
    .select("id,email,role")
    .eq("id", user.id)
    .maybeSingle();

  const resolvedProfile =
    (profile as AdminProfile | null) || (await autoProvisionAdminProfile(user));

  return {
    user,
    profile: resolvedProfile,
    error: profileError?.message,
  };
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session.user) {
    redirect("/admin/login");
  }

  return session;
}
