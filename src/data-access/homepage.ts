import { FALLBACK_HOMEPAGE } from "@/data/fallbackHomepage";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function getHomepage() {
  const { client } = getSupabaseServerClient();
  if (!client) return FALLBACK_HOMEPAGE;

  const { data } = await client
    .from("homepage_content")
    .select(
      "hero_title,hero_subtitle,hero_image_url,story_section_title,story_section_text,cta_title,cta_text",
    )
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    heroTitle: data?.hero_title || FALLBACK_HOMEPAGE.heroTitle,
    heroSubtitle: data?.hero_subtitle || FALLBACK_HOMEPAGE.heroSubtitle,
    storySectionTitle: data?.story_section_title || FALLBACK_HOMEPAGE.storySectionTitle,
    storySectionText: data?.story_section_text || FALLBACK_HOMEPAGE.storySectionText,
    ctaTitle: data?.cta_title || FALLBACK_HOMEPAGE.ctaTitle,
    ctaText: data?.cta_text || FALLBACK_HOMEPAGE.ctaText,
  };
}
