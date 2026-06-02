import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminInstagramEmbeds } from "@/lib/admin/instagram";
import type { InstagramEmbed } from "@/types/site";

import { deleteInstagramEmbedAction, saveInstagramEmbedAction } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Instagram CMS",
  description: "Manage Mountain Rose Instagram embeds.",
};

type PageProps = {
  searchParams?: Promise<{
    edit?: string;
    error?: string;
    saved?: string;
    deleted?: string;
  }>;
};

function fieldValue(value?: string | number | null) {
  return value == null ? "" : String(value);
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
  defaultValue?: string | number | null;
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
        defaultValue={defaultValue || ""}
        className="mt-2 w-full rounded-soft border border-espresso/15 bg-warmIvory px-3 py-3 text-sm leading-6 text-charcoal focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
      />
    </label>
  );
}

function InstagramForm({ embed }: { embed?: InstagramEmbed }) {
  return (
    <form action={saveInstagramEmbedAction} className="space-y-5">
      <input type="hidden" name="embedId" value={embed?.id || ""} />
      <TextInput label="Title" name="title" defaultValue={embed?.title} />
      <TextInput
        label="Instagram post / reel / story URL"
        name="instagramUrl"
        defaultValue={embed?.instagramUrl}
        required
      />
      <TextInput
        label="Sort order"
        name="sortOrder"
        type="number"
        defaultValue={embed?.sortOrder ?? 0}
      />
      <TextArea label="Caption" name="caption" defaultValue={embed?.caption} />
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-mutedBrown">
          Status
        </span>
        <select
          name="status"
          defaultValue={embed?.status === "draft" ? "draft" : "published"}
          className="mt-2 min-h-11 w-full rounded-soft border border-espresso/15 bg-warmIvory px-3 text-sm text-charcoal focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </label>
      <button
        type="submit"
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-espresso px-7 text-sm font-semibold text-warmIvory transition-colors hover:bg-darkLeather"
      >
        Save Instagram Card
      </button>
    </form>
  );
}

export default async function AdminInstagramPage({ searchParams }: PageProps) {
  const [session, rawParams, result] = await Promise.all([
    requireAdmin(),
    searchParams ? searchParams : Promise.resolve({}),
    getAdminInstagramEmbeds(),
  ]);
  const params = rawParams as {
    edit?: string;
    error?: string;
    saved?: string;
    deleted?: string;
  };
  const activeEmbed = params.edit
    ? result.embeds.find((embed) => embed.id === params.edit)
    : undefined;

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
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 border-b border-espresso/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mutedRose">
              Mountain Rose CMS
            </p>
            <h1 className="mt-3 font-heading text-4xl text-charcoal sm:text-5xl">
              Instagram Cards
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-mutedBrown">
              Add Instagram post or reel links here. Public posts render as an embedded Instagram-style grid on the homepage.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/settings"
              className="inline-flex min-h-11 items-center rounded-full border border-espresso/15 bg-bone px-5 text-sm font-semibold text-espresso"
            >
              Site Settings
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
            Instagram card saved.
          </div>
        ) : null}
        {params.deleted ? (
          <div className="mt-6 rounded-soft border border-antiqueGold/30 bg-bone px-4 py-3 text-sm text-espresso">
            Instagram card deleted.
          </div>
        ) : null}
        {params.error ? (
          <div className="mt-6 rounded-soft border border-mutedRose/30 bg-dustyRose/10 px-4 py-3 text-sm leading-6 text-deepRose">
            {params.error}
          </div>
        ) : null}
        {result.error ? (
          <div className="mt-6 rounded-soft border border-mutedRose/30 bg-dustyRose/10 px-4 py-3 text-sm leading-6 text-deepRose">
            <div>{result.error}</div>
            {result.error.includes("instagram_embeds") ? (
              <div className="mt-2 text-mutedBrown">
                Run the Instagram CMS schema in Supabase SQL Editor from{" "}
                <code>supabase/schema.sql</code>, then reload this page.
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem]">
          <section className="min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-2xl text-charcoal">Embed List</h2>
              <Link
                href="/admin/instagram"
                className="text-sm font-semibold text-mutedRose hover:text-deepRose"
              >
                New card
              </Link>
            </div>
            <div className="overflow-hidden border border-espresso/10 bg-bone shadow-soft">
              {result.embeds.length ? (
                <div className="divide-y divide-espresso/10">
                  {result.embeds.map((embed) => (
                    <div
                      key={embed.id}
                      className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-heading text-xl text-espresso">
                            {embed.title || "Instagram Card"}
                          </h3>
                          <span className="rounded-full border border-espresso/10 bg-warmIvory px-2 py-1 text-[0.65rem] font-semibold uppercase text-mutedBrown">
                            {embed.status}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-sm text-mutedBrown">
                          {embed.instagramUrl}
                        </p>
                        {embed.caption ? (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-mutedBrown">
                            {embed.caption}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap gap-2 md:justify-end">
                        <Link
                          href={`/admin/instagram?edit=${embed.id}`}
                          className="inline-flex min-h-10 items-center rounded-full border border-espresso/15 bg-warmIvory px-4 text-sm font-semibold text-espresso"
                        >
                          Edit
                        </Link>
                        <form action={deleteInstagramEmbedAction}>
                          <input type="hidden" name="embedId" value={embed.id} />
                          <button
                            type="submit"
                            className="inline-flex min-h-10 items-center rounded-full bg-espresso px-4 text-sm font-semibold text-warmIvory"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-sm text-mutedBrown">
                  No Instagram cards yet. Add a public Instagram post or reel URL from the form.
                </div>
              )}
            </div>
          </section>

          <aside className="border border-espresso/10 bg-bone p-5 shadow-soft">
            <h2 className="font-heading text-2xl text-charcoal">
              {activeEmbed ? "Edit Instagram Card" : "New Instagram Card"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-mutedBrown">
              Stories may not always be embeddable by Instagram. Public posts and reels are the most reliable.
            </p>
            <div className="mt-5">
              <InstagramForm embed={activeEmbed} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
