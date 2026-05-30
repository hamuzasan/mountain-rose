import { FALLBACK_PRODUCTS } from "@/data/fallbackProducts";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Product } from "@/types/product";

export async function getAllProducts(): Promise<Product[]> {
  const { client } = getSupabaseServerClient();
  if (!client) return FALLBACK_PRODUCTS;

  const { data, error } = await client
    .from("products")
    .select(
      "id,name,slug,category,short_description,description,material,leather_type,color,size,price,price_amount,price_currency,price_note,is_featured,is_available,whatsapp_message,source_pdf_page,status",
    )
    .eq("status", "published")
    .order("name", { ascending: true });

  if (error || !data) return FALLBACK_PRODUCTS;

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

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { client } = getSupabaseServerClient();
  if (!client) {
    const fallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
    return fallback || null;
  }

  const { data, error } = await client
    .from("products")
    .select(
      "id,name,slug,category,short_description,description,material,leather_type,color,size,price,price_amount,price_currency,price_note,is_featured,is_available,whatsapp_message,source_pdf_page,status",
    )
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;

  return {
    _id: data.id,
    name: data.name,
    slug: data.slug,
    price: data.price ?? undefined,
    priceAmount: data.price_amount ?? undefined,
    priceCurrency: data.price_currency ?? undefined,
    priceNote: data.price_note ?? undefined,
    category: data.category ?? undefined,
    shortDescription: data.short_description ?? undefined,
    description: data.description ? [{ _type: "block", children: [{ _type: "span", text: data.description }] }] : undefined,
    material: data.material ?? undefined,
    leatherType: data.leather_type ?? undefined,
    color: data.color ?? undefined,
    size: data.size ?? undefined,
    sourcePdfPage: data.source_pdf_page ?? undefined,
    isFeatured: data.is_featured ?? undefined,
    isAvailable: data.is_available ?? undefined,
    whatsAppMessage: data.whatsapp_message ?? undefined,
    images: undefined,
  };
}
