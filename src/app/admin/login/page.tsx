import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/admin/auth";

import AdminLoginForm from "./AdminLoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin CMS",
  description: "Login admin CMS Mountain Rose.",
};

type PageProps = {
  searchParams?: Promise<{ error?: string; next?: string }>;
};

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const [session, rawParams] = await Promise.all([
    getAdminSession(),
    searchParams ? searchParams : Promise.resolve({}),
  ]);
  const params = rawParams as { error?: string; next?: string };
  if (session.user && session.profile) redirect("/admin/products");

  return (
    <div className="bg-warmIvory px-5 py-16">
      <div className="mx-auto max-w-md border border-espresso/10 bg-bone p-7 shadow-soft sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mutedRose">
          Mountain Rose CMS
        </p>
        <h1 className="mt-4 font-heading text-4xl leading-tight text-charcoal">
          Sign in to manage the catalogue
        </h1>
        <p className="mt-4 text-sm leading-7 text-mutedBrown">
          Use the Supabase Auth account connected to the admin_profiles table.
        </p>
        <p className="mt-3 text-xs leading-6 text-mutedBrown">
          If the email is listed in <code> ADMIN_EMAILS </code>, the admin profile is
          created automatically on login. You can also bootstrap manually with{" "}
          <code>npm run grant:admin -- your@email.com</code>.
        </p>
        <AdminLoginForm error={params.error} next={params.next} />
      </div>
    </div>
  );
}
