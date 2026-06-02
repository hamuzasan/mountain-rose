"use client";

import { useState, useTransition } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type AdminLoginFormProps = {
  error?: string;
  next?: string;
};

export default function AdminLoginForm({ error, next }: AdminLoginFormProps) {
  const [formError, setFormError] = useState(error || "");
  const [isPending, startTransition] = useTransition();
  const nextPath = next?.startsWith("/admin") ? next : "/admin/products";

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      setFormError("");

      const email = String(formData.get("email") || "").trim();
      const password = String(formData.get("password") || "").trim();
      if (!email || !password) {
        setFormError("Email and password are required.");
        return;
      }

      const { client, error: configError } = getSupabaseBrowserClient();
      if (!client) {
        setFormError(configError || "Supabase is not configured.");
        return;
      }

      const { error: signInError } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setFormError(signInError.message);
        return;
      }

      window.location.replace(nextPath);
    });
  }

  return (
    <form action={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label className="block text-sm font-semibold text-espresso" htmlFor="email">
          Admin email
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

      {formError ? (
        <p className="rounded-soft border border-mutedRose/30 bg-dustyRose/10 px-4 py-3 text-sm text-deepRose">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-espresso px-6 text-sm font-semibold text-warmIvory transition-colors hover:bg-darkLeather focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
      >
        {isPending ? "Signing in..." : "Sign in to CMS"}
      </button>
    </form>
  );
}
