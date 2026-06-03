import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminLeatherCareArticles } from "@/lib/admin/leather-care";
import { formatDateID } from "@/lib/format";
import type { LeatherCareArticle } from "@/types/leatherCare";

import {
  deleteLeatherCareArticleAction,
  saveLeatherCareArticleAction,
  setLeatherCareStatusAction,
} from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leather Care CMS",
  description: "Manage Mountain Rose leather care articles.",
};

type PageProps = {
  searchParams?: Promise<{
    edit?: string;
    saved?: string;
    status?: string;
    deleted?: string;
    error?: string;
  }>;
};

type AdminArticle = LeatherCareArticle & { status?: string | null };

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
  rows = 4,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-mutedBrown">
        {label}
      </span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={fieldValue(defaultValue)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-soft border border-espresso/15 bg-warmIvory px-3 py-3 text-sm leading-6 text-charcoal focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
      />
    </label>
  );
}

function ArticleForm({ article }: { article?: AdminArticle }) {
  return (
    <form action={saveLeatherCareArticleAction} className="space-y-5">
      <input type="hidden" name="articleId" value={article?._id || ""} />
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label="Article title" name="title" defaultValue={article?.title} required />
        <TextInput label="Slug" name="slug" defaultValue={article?.slug} required />
        <TextInput label="Cover image URL" name="coverImageUrl" defaultValue={article?.coverImageUrl} />
        <TextInput
          label="Published at"
          name="publishedAt"
          type="datetime-local"
          defaultValue={article?.publishedAt ? article.publishedAt.slice(0, 16) : ""}
        />
      </div>
      <TextArea
        label="Excerpt"
        name="excerpt"
        defaultValue={article?.excerpt}
        rows={3}
        placeholder="Short article summary for listing cards."
      />
      <TextArea
        label="Article content"
        name="content"
        defaultValue={
          Array.isArray(article?.content)
            ? article.content
                .map((block) =>
                  typeof block === "object" && block && "children" in block
                    ? (block as { children?: Array<{ text?: string }> }).children
                        ?.map((child) => child.text || "")
                        .join("")
                    : "",
                )
                .filter(Boolean)
                .join("\n\n")
            : ""
        }
        rows={12}
        placeholder="Use blank lines to separate paragraphs."
      />
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-mutedBrown">
          Status
        </span>
        <select
          name="status"
          defaultValue={article?.status === "published" ? "published" : "draft"}
          className="mt-2 min-h-11 w-full rounded-soft border border-espresso/15 bg-warmIvory px-3 text-sm text-charcoal focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>
      <button
        type="submit"
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-espresso px-7 text-sm font-semibold text-warmIvory transition-colors hover:bg-darkLeather md:w-auto"
      >
        Save Article
      </button>
    </form>
  );
}

export default async function AdminLeatherCarePage({ searchParams }: PageProps) {
  const [session, rawParams, result] = await Promise.all([
    requireAdmin(),
    searchParams ? searchParams : Promise.resolve({}),
    getAdminLeatherCareArticles(),
  ]);
  const params = rawParams as {
    edit?: string;
    saved?: string;
    status?: string;
    deleted?: string;
    error?: string;
  };
  const activeArticle = params.edit
    ? (result.articles.find((article) => article.slug === params.edit) as AdminArticle | undefined)
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
            prefetch={false}
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
              Leather Care Articles
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-mutedBrown">
              Add, edit, publish, and remove article content for the leather care section.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/products"
              prefetch={false}
              className="inline-flex min-h-11 items-center rounded-full border border-espresso/15 bg-bone px-5 text-sm font-semibold text-espresso"
            >
              Products
            </Link>
            <Link
              href="/admin/settings"
              prefetch={false}
              className="inline-flex min-h-11 items-center rounded-full border border-espresso/15 bg-bone px-5 text-sm font-semibold text-espresso"
            >
              Site Settings
            </Link>
          </div>
        </div>

        {params.saved ? (
          <div className="mt-6 rounded-soft border border-antiqueGold/30 bg-bone px-4 py-3 text-sm text-espresso">
            Article saved successfully.
          </div>
        ) : null}
        {params.status ? (
          <div className="mt-6 rounded-soft border border-antiqueGold/30 bg-bone px-4 py-3 text-sm text-espresso">
            Article status changed to <strong>{params.status === "published" ? "Published" : "Draft"}</strong>.
          </div>
        ) : null}
        {params.deleted ? (
          <div className="mt-6 rounded-soft border border-antiqueGold/30 bg-bone px-4 py-3 text-sm text-espresso">
            Article deleted.
          </div>
        ) : null}
        {params.error ? (
          <div className="mt-6 rounded-soft border border-mutedRose/30 bg-dustyRose/10 px-4 py-3 text-sm text-deepRose">
            {params.error}
          </div>
        ) : null}
        {result.error ? (
          <div className="mt-6 rounded-soft border border-mutedRose/30 bg-dustyRose/10 px-4 py-3 text-sm text-deepRose">
            {result.error}
          </div>
        ) : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem]">
          <section className="min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-2xl text-charcoal">Article List</h2>
              <Link
                href="/admin/leather-care"
                prefetch={false}
                className="text-sm font-semibold text-mutedRose hover:text-deepRose"
              >
                New article
              </Link>
            </div>

            <div className="overflow-hidden border border-espresso/10 bg-bone shadow-soft">
              {result.articles.length ? (
                <div className="divide-y divide-espresso/10">
                  {result.articles.map((article) => (
                    <div
                      key={article._id}
                      className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-heading text-xl text-espresso">{article.title}</h3>
                          <span className="rounded-full border border-espresso/10 bg-warmIvory px-2 py-1 text-[0.65rem] font-semibold uppercase text-mutedBrown">
                            {(article as AdminArticle).status || "draft"}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-mutedBrown">
                          {article.slug}
                          {article.publishedAt ? ` - ${formatDateID(article.publishedAt)}` : ""}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-mutedBrown">
                          {article.excerpt || "No excerpt yet."}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 md:justify-end">
                        <Link
                          href={`/admin/leather-care?edit=${article.slug}`}
                          prefetch={false}
                          className="inline-flex min-h-10 items-center rounded-full border border-espresso/15 bg-warmIvory px-4 text-sm font-semibold text-espresso"
                        >
                          Edit
                        </Link>
                        <form action={setLeatherCareStatusAction}>
                          <input type="hidden" name="articleId" value={article._id} />
                          <input
                            type="hidden"
                            name="status"
                            value={
                              (article as AdminArticle).status === "published"
                                ? "draft"
                                : "published"
                            }
                          />
                          <button
                            type="submit"
                            className="inline-flex min-h-10 items-center rounded-full bg-espresso px-4 text-sm font-semibold text-warmIvory"
                          >
                            {(article as AdminArticle).status === "published" ? "Draft" : "Publish"}
                          </button>
                        </form>
                        <form action={deleteLeatherCareArticleAction}>
                          <input type="hidden" name="articleId" value={article._id} />
                          <input type="hidden" name="slug" value={article.slug} />
                          <button
                            type="submit"
                            className="inline-flex min-h-10 items-center rounded-full border border-mutedRose/30 bg-dustyRose/10 px-4 text-sm font-semibold text-deepRose"
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
                  No articles yet. Use the form beside this list to create one.
                </div>
              )}
            </div>
          </section>

          <aside className="border border-espresso/10 bg-bone p-5 shadow-soft">
            <h2 className="font-heading text-2xl text-charcoal">
              {activeArticle ? "Edit Article" : "New Article"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-mutedBrown">
              Article content is stored in the same Supabase CMS and published to the public leather care pages.
            </p>
            <div className="mt-5">
              <ArticleForm article={activeArticle} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

