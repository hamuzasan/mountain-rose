import { NextResponse } from "next/server";

import { getSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

function redirectTo(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const email = url.searchParams.get("email");
  const nextPath = url.searchParams.get("next") || "/admin/set-password";

  const { client } = await getSupabaseAuthServerClient();
  if (!client) {
    return redirectTo(request, `/admin/login?error=${encodeURIComponent("Supabase is not configured.")}`);
  }

  if (code) {
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (error) {
      return redirectTo(
        request,
        `/admin/login?error=${encodeURIComponent(error.message || "Unable to complete sign in.")}`,
      );
    }
    return redirectTo(request, nextPath);
  }

  if (tokenHash && type && email) {
    const { error } = await client.auth.verifyOtp({
      email,
      token_hash: tokenHash,
      type: type as "invite" | "recovery" | "email" | "email_change",
    });

    if (error) {
      return redirectTo(
        request,
        `/admin/login?error=${encodeURIComponent(error.message || "Unable to complete sign in.")}`,
      );
    }

    return redirectTo(request, nextPath);
  }

  return redirectTo(request, "/admin/login?error=Missing authentication code.");
}
