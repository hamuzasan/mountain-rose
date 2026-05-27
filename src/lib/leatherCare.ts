import { FALLBACK_LEATHER_CARE_ARTICLES } from "@/data/fallbackLeatherCare";
import type { LeatherCareArticle } from "@/types/leatherCare";

export function getFallbackLeatherCareArticles(): LeatherCareArticle[] {
  return FALLBACK_LEATHER_CARE_ARTICLES;
}

export function getFallbackLeatherCareArticleBySlug(
  slug: string,
): LeatherCareArticle | null {
  const normalized = (slug || "").trim().toLowerCase();
  if (!normalized) return null;

  return (
    FALLBACK_LEATHER_CARE_ARTICLES.find(
      (a) => a.slug.toLowerCase() === normalized,
    ) || null
  );
}

