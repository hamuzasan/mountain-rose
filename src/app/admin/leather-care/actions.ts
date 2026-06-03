"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";

type ArticleInsert = Database["public"]["Tables"]["leather_care_articles"]["Insert"];
type ArticleUpdate = Database["public"]["Tables"]["leather_care_articles"]["Update"];

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value ? value : null;
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function articlePayload(formData: FormData): ArticleInsert {
  const title = text(formData, "title");
  const slug = normalizeSlug(text(formData, "slug") || title);

  if (!title || !slug) {
    throw new Error("Article title and slug are required.");
  }

  return {
    title,
    slug,
    excerpt: nullableText(formData, "excerpt"),
    content: nullableText(formData, "content"),
    cover_image_url: nullableText(formData, "coverImageUrl"),
    status: text(formData, "status") === "published" ? "published" : "draft",
    published_at: nullableText(formData, "publishedAt") || null,
  };
}

function errorUrl(message: string) {
  return `/admin/leather-care?error=${encodeURIComponent(message)}`;
}

export async function saveLeatherCareArticleAction(formData: FormData) {
  const session = await requireAdmin();
  if (!session.profile) throw new Error("This account is not registered as a CMS admin.");

  const { client } = getSupabaseAdminClient();
  if (!client) throw new Error("Supabase admin client is not configured.");

  const articleId = text(formData, "articleId");
  const payload = articlePayload(formData);

  if (payload.status === "published" && !payload.published_at) {
    payload.published_at = new Date().toISOString();
  }

  let saved: { id: string; slug: string; title: string } | null = null;

  if (articleId) {
    const updatePayload: ArticleUpdate = payload;
    const { data, error } = await client
      .from("leather_care_articles")
      .update(updatePayload)
      .eq("id", articleId)
      .select("id,slug,title")
      .maybeSingle();

    if (error || !data) throw new Error(error?.message || "Article update failed.");
    saved = data;
  } else {
    const { data, error } = await client
      .from("leather_care_articles")
      .upsert(payload, { onConflict: "slug" })
      .select("id,slug,title")
      .maybeSingle();

    if (error || !data) throw new Error(error?.message || "Article save failed.");
    saved = data;
  }

  revalidatePath("/leather-care");
  revalidatePath(`/leather-care/${saved.slug}`);
  revalidatePath("/admin/leather-care");
  redirect(`/admin/leather-care?edit=${saved.slug}&saved=1`);
}

export async function setLeatherCareStatusAction(formData: FormData) {
  const session = await requireAdmin();
  if (!session.profile) {
    redirect(errorUrl("This account is not registered as a CMS admin."));
  }

  const { client } = getSupabaseAdminClient();
  if (!client) {
    redirect(errorUrl("Supabase admin client is not configured."));
  }

  const articleId = text(formData, "articleId");
  const status = text(formData, "status") === "published" ? "published" : "draft";
  if (!articleId) {
    redirect(errorUrl("Article ID was not found."));
  }

  const payload: ArticleUpdate = {
    status,
    published_at: status === "published" ? new Date().toISOString() : null,
  };

  const { data, error } = await client
    .from("leather_care_articles")
    .update(payload)
    .eq("id", articleId)
    .select("slug")
    .maybeSingle();

  if (error || !data) {
    redirect(errorUrl(error?.message || "Article status update failed."));
  }

  revalidatePath("/leather-care");
  revalidatePath(`/leather-care/${data.slug}`);
  revalidatePath("/admin/leather-care");
  redirect(`/admin/leather-care?edit=${data.slug}&status=${status}`);
}

export async function deleteLeatherCareArticleAction(formData: FormData) {
  const session = await requireAdmin();
  if (!session.profile) {
    redirect(errorUrl("This account is not registered as a CMS admin."));
  }

  const { client } = getSupabaseAdminClient();
  if (!client) {
    redirect(errorUrl("Supabase admin client is not configured."));
  }

  const articleId = text(formData, "articleId");
  const slug = text(formData, "slug");
  if (!articleId) {
    redirect(errorUrl("Article ID was not found."));
  }

  const { error } = await client.from("leather_care_articles").delete().eq("id", articleId);
  if (error) {
    redirect(errorUrl(error.message || "Article delete failed."));
  }

  revalidatePath("/leather-care");
  if (slug) revalidatePath(`/leather-care/${slug}`);
  revalidatePath("/admin/leather-care");
  redirect("/admin/leather-care?deleted=1");
}

