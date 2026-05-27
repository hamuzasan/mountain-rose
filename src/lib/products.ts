import { FALLBACK_PRODUCTS } from "@/data/fallbackProducts";
import type { Product } from "@/types/product";

export function getFallbackProducts(): Product[] {
  return FALLBACK_PRODUCTS;
}

export function getFallbackProductBySlug(slug: string): Product | null {
  const normalized = (slug || "").trim().toLowerCase();
  if (!normalized) return null;

  return (
    FALLBACK_PRODUCTS.find((p) => p.slug.toLowerCase() === normalized) || null
  );
}

