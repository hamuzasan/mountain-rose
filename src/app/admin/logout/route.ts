import { NextResponse } from "next/server";

import { getSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

export async function GET(request: Request) {
  const { client } = await getSupabaseAuthServerClient();
  if (client) {
    await client.auth.signOut();
  }

  return NextResponse.redirect(new URL("/admin/login", request.url));
}
