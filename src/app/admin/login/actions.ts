"use server";

import { redirect } from "next/navigation";

import { getSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function loginRedirectUrl(error: string) {
  const params = new URLSearchParams({ error });
  return `/admin/login?${params.toString()}`;
}

export async function loginAdminAction(formData: FormData) {
  const email = text(formData, "email");
  const password = text(formData, "password");
  const nextPath = text(formData, "next") || "/admin/products";

  if (!email || !password) {
    redirect(loginRedirectUrl("Email and password are required."));
  }

  const { client, error: configError } = await getSupabaseAuthServerClient();
  if (!client) {
    redirect(loginRedirectUrl(configError || "Supabase is not configured."));
  }

  const { error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(loginRedirectUrl(error.message));
  }

  redirect(nextPath.startsWith("/admin") ? nextPath : "/admin/products");
}
