import { FALLBACK_LEATHER_CARE_ARTICLES } from "@/data/fallbackLeatherCare";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { LeatherCareArticle } from "@/types/leatherCare";

export async function getLeatherCareArticles(): Promise<LeatherCareArticle[]> {
  const { client } = getSupabaseServerClient();
  if (!client) return FALLBACK_LEATHER_CARE_ARTICLES;

  const { data, error } = await client
    .from("leather_care_articles")
    .select("id,title,slug,excerpt,content,cover_image_url,published_at,status")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data) return FALLBACK_LEATHER_CARE_ARTICLES;

  return data.map((a) => ({
    _id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt ?? undefined,
    content: a.content
      ? [{ _type: "block", children: [{ _type: "span", text: a.content }] }]
      : undefined,
    coverImageUrl: a.cover_image_url ?? undefined,
    coverImage: a.cover_image_url ? { alt: `${a.title} cover` } : undefined,
    publishedAt: a.published_at ?? undefined,
  }));
}

export async function getLeatherCareArticleBySlug(
  slug: string,
): Promise<LeatherCareArticle | null> {
  const { client } = getSupabaseServerClient();
  if (!client) {
    return FALLBACK_LEATHER_CARE_ARTICLES.find((a) => a.slug === slug) || null;
  }

  const { data } = await client
    .from("leather_care_articles")
    .select("id,title,slug,excerpt,content,cover_image_url,published_at,status")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) return null;

  return {
    _id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt ?? undefined,
    content: data.content
      ? [{ _type: "block", children: [{ _type: "span", text: data.content }] }]
      : undefined,
    coverImageUrl: data.cover_image_url ?? undefined,
    coverImage: data.cover_image_url ? { alt: `${data.title} cover` } : undefined,
    publishedAt: data.published_at ?? undefined,
  };
}
