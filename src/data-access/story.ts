import { FALLBACK_STORY } from "@/data/fallbackStory";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { BrandStory } from "@/types/story";

export async function getBrandStory(): Promise<BrandStory> {
  const { client } = getSupabaseServerClient();
  if (!client) return FALLBACK_STORY;

  const { data } = await client
    .from("brand_story")
    .select(
      "title,subtitle,intro,craftsmanship_title,craftsmanship_text,leather_title,leather_text,rose_title,rose_text,cta_title,cta_text,image_url",
    )
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    title: data?.title || FALLBACK_STORY.title,
    subtitle: data?.subtitle || FALLBACK_STORY.subtitle,
    intro: data?.intro || FALLBACK_STORY.intro,
    craftsmanshipTitle: data?.craftsmanship_title || FALLBACK_STORY.craftsmanshipTitle,
    craftsmanshipText: data?.craftsmanship_text || FALLBACK_STORY.craftsmanshipText,
    leatherTitle: data?.leather_title || FALLBACK_STORY.leatherTitle,
    leatherText: data?.leather_text || FALLBACK_STORY.leatherText,
    roseTitle: data?.rose_title || FALLBACK_STORY.roseTitle,
    roseText: data?.rose_text || FALLBACK_STORY.roseText,
    ctaTitle: data?.cta_title || FALLBACK_STORY.ctaTitle,
    ctaText: data?.cta_text || FALLBACK_STORY.ctaText,
    content: undefined,
    image: data?.image_url ? { alt: "Mountain Rose story image" } : undefined,
  };
}
