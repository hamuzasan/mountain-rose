import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminSiteSettings } from "@/lib/admin/site-settings";

import { saveSiteSettingsAction } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Site Settings CMS",
  description: "Manage Mountain Rose global website settings.",
};

type PageProps = {
  searchParams?: Promise<{ saved?: string }>;
};

function fieldValue(value?: string | null) {
  return value == null ? "" : value;
}

function TextInput({
  label,
  name,
  defaultValue,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-mutedBrown">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={fieldValue(defaultValue)}
        className="mt-2 min-h-11 w-full rounded-soft border border-espresso/15 bg-warmIvory px-3 text-sm text-charcoal focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-mutedBrown">
        {label}
      </span>
      <textarea
        name={name}
        rows={3}
        defaultValue={fieldValue(defaultValue)}
        className="mt-2 w-full rounded-soft border border-espresso/15 bg-warmIvory px-3 py-3 text-sm leading-6 text-charcoal focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
      />
    </label>
  );
}

export default async function AdminSettingsPage({ searchParams }: PageProps) {
  const [session, rawParams, result] = await Promise.all([
    requireAdmin(),
    searchParams ? searchParams : Promise.resolve({}),
    getAdminSiteSettings(),
  ]);
  const params = rawParams as { saved?: string };
  const { settings } = result;

  if (!session.profile) {
    return (
      <div className="bg-warmIvory px-5 py-16">
        <div className="mx-auto max-w-2xl border border-mutedRose/25 bg-bone p-8 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mutedRose">
            Admin inactive
          </p>
          <h1 className="mt-4 font-heading text-4xl text-charcoal">
            This account is not active as a CMS admin
          </h1>
          <Link
            href="/admin/logout"
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-espresso px-6 text-sm font-semibold text-warmIvory"
          >
            Sign out
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-warmIvory px-5 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-5 border-b border-espresso/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mutedRose">
              Mountain Rose CMS
            </p>
            <h1 className="mt-3 font-heading text-4xl text-charcoal sm:text-5xl">
              Site Settings
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-mutedBrown">
              Set the logo image, contact details, and brand basics used across the public website.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/instagram"
              className="inline-flex min-h-11 items-center rounded-full border border-espresso/15 bg-bone px-5 text-sm font-semibold text-espresso"
            >
              Instagram Cards
            </Link>
            <Link
              href="/admin/products"
              className="inline-flex min-h-11 items-center rounded-full bg-espresso px-5 text-sm font-semibold text-warmIvory"
            >
              Products
            </Link>
          </div>
        </div>

        {params.saved ? (
          <div className="mt-6 rounded-soft border border-antiqueGold/30 bg-bone px-4 py-3 text-sm text-espresso">
            Site settings saved.
          </div>
        ) : null}
        {result.error ? (
          <div className="mt-6 rounded-soft border border-mutedRose/30 bg-dustyRose/10 px-4 py-3 text-sm text-deepRose">
            {result.error}
          </div>
        ) : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <form action={saveSiteSettingsAction} className="space-y-5 border border-espresso/10 bg-bone p-5 shadow-soft">
            <input type="hidden" name="settingsId" value={settings.id} />
            <TextInput label="Brand name" name="brandName" defaultValue={settings.brandName} required />
            <TextArea label="Tagline" name="tagline" defaultValue={settings.tagline} />
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput label="WhatsApp number" name="whatsappNumber" defaultValue={settings.whatsappNumber} />
              <TextInput label="Instagram profile URL" name="instagramUrl" defaultValue={settings.instagramUrl} />
              <TextInput label="Email" name="email" type="email" defaultValue={settings.email} />
              <TextInput label="Address" name="address" defaultValue={settings.address} />
            </div>
            <TextInput
              label="Logo image URL"
              name="logoUrl"
              defaultValue={settings.logoUrl}
            />
            <p className="text-xs leading-5 text-mutedBrown">
              Upload the logo to Supabase Storage or another approved image host, then paste the public URL here.
            </p>
            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-espresso px-7 text-sm font-semibold text-warmIvory transition-colors hover:bg-darkLeather md:w-auto"
            >
              Save Settings
            </button>
          </form>

          <aside className="border border-espresso/10 bg-bone p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mutedRose">
              Logo Preview
            </p>
            <div className="mt-5 flex h-40 items-center justify-center border border-espresso/10 bg-warmIvory">
              {settings.logoUrl ? (
                <Image
                  src={settings.logoUrl}
                  alt="Mountain Rose logo preview"
                  width={180}
                  height={90}
                  className="max-h-28 w-auto object-contain"
                />
              ) : (
                <div className="font-heading text-2xl text-espresso">Mountain Rose</div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
