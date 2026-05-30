import { FALLBACK_HOMEPAGE, FALLBACK_FEATURED_PRODUCTS } from "@/data/fallbackHomepage";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Product } from "@/types/product";

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

export async function getFeaturedProducts(): Promise<Product[]> {
  const { client } = getSupabaseServerClient();
  if (!client) return FALLBACK_FEATURED_PRODUCTS as unknown as Product[];

  const { data, error } = await client
    .from("products")
    .select(
      "id,name,slug,category,short_description,description,material,leather_type,color,size,price,price_amount,price_currency,price_note,is_featured,is_available,whatsapp_message,source_pdf_page,status",
    )
    .eq("status", "published")
    .eq("is_featured", true)
    .order("updated_at", { ascending: false })
    .limit(4);

  if (error || !data || data.length === 0) return FALLBACK_FEATURED_PRODUCTS as unknown as Product[];

  return data.map((p) => ({
    _id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price ?? undefined,
    priceAmount: p.price_amount ?? undefined,
    priceCurrency: p.price_currency ?? undefined,
    priceNote: p.price_note ?? undefined,
    category: p.category ?? undefined,
    shortDescription: p.short_description ?? undefined,
    description: p.description ? [{ _type: "block", children: [{ _type: "span", text: p.description }] }] : undefined,
    material: p.material ?? undefined,
    leatherType: p.leather_type ?? undefined,
    color: p.color ?? undefined,
    size: p.size ?? undefined,
    sourcePdfPage: p.source_pdf_page ?? undefined,
    isFeatured: p.is_featured ?? undefined,
    isAvailable: p.is_available ?? undefined,
    whatsAppMessage: p.whatsapp_message ?? undefined,
    images: undefined,
  }));
}
