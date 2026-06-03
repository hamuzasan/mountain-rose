"use server";

import { redirect } from "next/navigation";

import { getSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function errorUrl(message: string) {
  return `/admin/set-password?error=${encodeURIComponent(message)}`;
}

export async function updatePasswordAction(formData: FormData) {
  const password = text(formData, "password");
  const confirmPassword = text(formData, "confirmPassword");

  if (!password || !confirmPassword) {
    redirect(errorUrl("Password and confirmation are required."));
  }

  if (password.length < 8) {
    redirect(errorUrl("Password must be at least 8 characters."));
  }

  if (password !== confirmPassword) {
    redirect(errorUrl("Passwords do not match."));
  }

  const { client } = await getSupabaseAuthServerClient();
  if (!client) {
    redirect(errorUrl("Supabase is not configured."));
  }

  const { error } = await client.auth.updateUser({ password });
  if (error) {
    redirect(errorUrl(error.message || "Unable to update password."));
  }

  redirect("/admin/products?password=1");
}
