import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/admin/auth";

import AdminLoginForm from "./AdminLoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin CMS",
  description: "Login admin CMS Mountain Rose.",
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session.user && session.profile) redirect("/admin/products");

  return (
    <div className="bg-warmIvory px-5 py-16">
      <div className="mx-auto max-w-md border border-espresso/10 bg-bone p-7 shadow-soft sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mutedRose">
          Mountain Rose CMS
        </p>
        <h1 className="mt-4 font-heading text-4xl leading-tight text-charcoal">
          Masuk untuk mengelola katalog
        </h1>
        <p className="mt-4 text-sm leading-7 text-mutedBrown">
          Gunakan akun Supabase Auth yang sudah dimasukkan ke tabel admin_profiles.
        </p>
        <p className="mt-3 text-xs leading-6 text-mutedBrown">
          Jika lupa password, reset dari Supabase Dashboard. Jika email-mu ada di
          <code> ADMIN_EMAILS </code>, profil admin akan dibuat otomatis saat login. Kalau mau
          bootstrap manual, tetap bisa pakai <code>npm run grant:admin -- emailkamu@domain.com</code>.
        </p>
        <AdminLoginForm />
      </div>
    </div>
  );
}
