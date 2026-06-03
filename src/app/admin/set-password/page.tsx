import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/admin/auth";

import { updatePasswordAction } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Set Admin Password",
  description: "Set the password for a Mountain Rose admin invite.",
};

type PageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function AdminSetPasswordPage({ searchParams }: PageProps) {
  const [session, rawParams] = await Promise.all([
    getAdminSession(),
    searchParams ? searchParams : Promise.resolve({}),
  ]);
  const params = rawParams as { error?: string };

  if (!session.user) redirect("/admin/login");
  if (!session.profile) {
    return (
      <div className="bg-warmIvory px-5 py-16">
        <div className="mx-auto max-w-md border border-espresso/10 bg-bone p-7 shadow-soft sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mutedRose">
            Admin access required
          </p>
          <h1 className="mt-4 font-heading text-4xl leading-tight text-charcoal">
            Sign in first
          </h1>
          <p className="mt-4 text-sm leading-7 text-mutedBrown">
            This page is only available after the invitation link has created a valid session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-warmIvory px-5 py-16">
      <div className="mx-auto max-w-md border border-espresso/10 bg-bone p-7 shadow-soft sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mutedRose">
          Mountain Rose CMS
        </p>
        <h1 className="mt-4 font-heading text-4xl leading-tight text-charcoal">
          Set your password
        </h1>
        <p className="mt-4 text-sm leading-7 text-mutedBrown">
          Choose a password for your new admin account. After that, you can sign in normally.
        </p>

        {params.error ? (
          <p className="mt-6 rounded-soft border border-mutedRose/30 bg-dustyRose/10 px-4 py-3 text-sm text-deepRose">
            {params.error}
          </p>
        ) : null}

        <form action={updatePasswordAction} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-espresso" htmlFor="password">
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-2 min-h-12 w-full rounded-soft border border-espresso/15 bg-warmIvory px-4 text-sm text-charcoal focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-espresso" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-2 min-h-12 w-full rounded-soft border border-espresso/15 bg-warmIvory px-4 text-sm text-charcoal focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
            />
          </div>
          <button
            type="submit"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-espresso px-6 text-sm font-semibold text-warmIvory transition-colors hover:bg-darkLeather focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
          >
            Save password
          </button>
        </form>
      </div>
    </div>
  );
}
