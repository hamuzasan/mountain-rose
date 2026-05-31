"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const { client, error: configError } = getSupabaseBrowserClient();

    if (!client) {
      setError(configError || "Supabase belum dikonfigurasi.");
      setLoading(false);
      return;
    }

    const { error: signInError } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.replace(searchParams.get("next") || "/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      <div>
        <label className="block text-sm font-semibold text-espresso" htmlFor="email">
          Email admin
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 min-h-12 w-full rounded-soft border border-espresso/15 bg-warmIvory px-4 text-sm text-charcoal focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
          autoComplete="email"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-espresso" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-2 min-h-12 w-full rounded-soft border border-espresso/15 bg-warmIvory px-4 text-sm text-charcoal focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
          autoComplete="current-password"
        />
      </div>

      {error ? (
        <p className="rounded-soft border border-mutedRose/30 bg-dustyRose/10 px-4 py-3 text-sm text-deepRose">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-espresso px-6 text-sm font-semibold text-warmIvory transition-colors hover:bg-darkLeather disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Masuk..." : "Masuk ke CMS"}
      </button>
    </form>
  );
}
