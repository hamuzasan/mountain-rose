import "server-only";

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
