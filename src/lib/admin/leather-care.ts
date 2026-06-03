import "server-only";

import { randomUUID } from "node:crypto";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";
import type { LeatherCareArticle } from "@/types/leatherCare";

type LeatherCareArticleRow = Database["public"]["Tables"]["leather_care_articles"]["Row"];

function parseContent(value: string | null): unknown[] | null {
  const text = (value || "").trim();
  if (!text) return null;

  return text.split(/\n{2,}/).map((paragraph) => ({
    _type: "block",
    children: [{ _type: "span", text: paragraph.trim() }],
  }));
}

function imageExtension(file: File) {
  const nameMatch = file.name.match(/\.(png|jpe?g|webp)$/i);
  if (nameMatch) return nameMatch[1].replace("jpeg", "jpg").toLowerCase();
  if (file.type.includes("png")) return "png";
  if (file.type.includes("webp")) return "webp";
  return "jpg";
}

export async function uploadLeatherCareCoverImage(
  slug: string,
  file: File,
): Promise<string> {
  const { client } = getSupabaseAdminClient();
  if (!client) {
    throw new Error("Supabase admin client is not configured.");
  }

  const safeSlug = slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const ext = imageExtension(file);
  const path = `leather-care/${safeSlug}/${randomUUID()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await client.storage.from("product-images").upload(path, bytes, {
    contentType: file.type || "image/jpeg",
    upsert: true,
  });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = client.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

export function mapAdminLeatherCareArticle(row: LeatherCareArticleRow): LeatherCareArticle {
  return {
    _id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? undefined,
    content: parseContent(row.content) ?? undefined,
    coverImageUrl: row.cover_image_url ?? undefined,
    coverImage: row.cover_image_url ? { alt: `${row.title} cover` } : undefined,
    publishedAt: row.published_at ?? undefined,
  };
}

export async function getAdminLeatherCareArticles() {
  const { client, error } = getSupabaseAdminClient();
  if (!client) {
    return {
      articles: [] as LeatherCareArticle[],
      error: error || "Supabase admin client is not configured.",
    };
  }

  const { data, error: queryError } = await client
    .from("leather_care_articles")
    .select("*")
    .order("updated_at", { ascending: false });

  if (queryError || !data) {
    return {
      articles: [] as LeatherCareArticle[],
      error: queryError?.message || "Unable to load leather care articles.",
    };
  }

  return {
    articles: (data as LeatherCareArticleRow[]).map(mapAdminLeatherCareArticle),
    error: null,
  };
}
