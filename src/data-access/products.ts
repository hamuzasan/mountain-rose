import { FALLBACK_FEATURED_PRODUCTS } from "@/data/fallbackHomepage";
import { FALLBACK_PRODUCTS } from "@/data/fallbackProducts";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Product, ProductImage } from "@/types/product";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category: string;
  short_description: string | null;
  description: string | null;
  material: string | null;
  leather_type: string | null;
  color: string | null;
  size: string | null;
  price: number | null;
  price_amount: number | null;
  price_currency: string | null;
  price_note: string | null;
  is_featured: boolean | null;
  is_available: boolean | null;
  whatsapp_message: string | null;
  source_pdf_page: number | null;
  status: string | null;
};

type ProductImageRow = {
  product_id: string;
  storage_path: string;
  public_url: string;
  alt: string | null;
  sort_order: number | null;
};

function mapProductImageRows(rows: ProductImageRow[]): Map<string, ProductImage[]> {
  const map = new Map<string, ProductImage[]>();

  for (const row of rows) {
    if (row.storage_path && !row.storage_path.startsWith("products/")) {
      continue;
    }

    const list = map.get(row.product_id) || [];
    list.push({
      publicUrl: row.public_url,
      storagePath: row.storage_path,
      alt: row.alt ?? undefined,
      sortOrder: row.sort_order ?? 0,
    });
    map.set(row.product_id, list);
  }

  return map;
}

function mapProductRow(row: ProductRow, images: ProductImage[] = []): Product {
  return {
    _id: row.id,
    name: row.name,
    slug: row.slug,
    price: row.price ?? undefined,
    priceAmount: row.price_amount ?? undefined,
    priceCurrency: row.price_currency ?? undefined,
    priceNote: row.price_note ?? undefined,
    category: row.category,
    shortDescription: row.short_description ?? undefined,
    description: row.description ?? undefined,
    images,
    material: row.material ?? undefined,
    leatherType: row.leather_type ?? undefined,
    color: row.color ?? undefined,
    size: row.size ?? undefined,
    sourcePdfPage: row.source_pdf_page ?? undefined,
    isFeatured: row.is_featured ?? undefined,
    isAvailable: row.is_available ?? undefined,
    whatsAppMessage: row.whatsapp_message ?? undefined,
  };
}

async function fetchPublishedProducts(): Promise<Product[]> {
  const { client } = getSupabaseServerClient();
  if (!client) return FALLBACK_PRODUCTS;

  const { data: rows, error } = await client
    .from("products")
    .select(
      "id,name,slug,category,short_description,description,material,leather_type,color,size,price,price_amount,price_currency,price_note,is_featured,is_available,whatsapp_message,source_pdf_page,status",
    )
    .eq("status", "published")
    .order("name", { ascending: true });

  if (error || !rows || rows.length === 0) {
    return FALLBACK_PRODUCTS;
  }

  const productRows = rows as ProductRow[];
  const productIds = productRows.map((row) => row.id);
  let imageRows: ProductImageRow[] = [];
  if (productIds.length) {
    const { data, error: imageError } = await client
      .from("product_images")
      .select("product_id,storage_path,public_url,alt,sort_order")
      .in("product_id", productIds)
      .order("sort_order", { ascending: true });

    if (!imageError && data) {
      imageRows = data as ProductImageRow[];
    }
  }

  const imagesByProduct = mapProductImageRows(imageRows);

  return productRows.map((row) => mapProductRow(row, imagesByProduct.get(row.id) || []));
}

export async function getAllProducts(): Promise<Product[]> {
  return fetchPublishedProducts();
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { client } = getSupabaseServerClient();
  if (!client) {
    return FALLBACK_FEATURED_PRODUCTS;
  }

  const { data: rows, error } = await client
    .from("products")
    .select(
      "id,name,slug,category,short_description,description,material,leather_type,color,size,price,price_amount,price_currency,price_note,is_featured,is_available,whatsapp_message,source_pdf_page,status",
    )
    .eq("status", "published")
    .eq("is_featured", true)
    .order("updated_at", { ascending: false })
    .limit(4);

  if (error || !rows || rows.length === 0) {
    return FALLBACK_FEATURED_PRODUCTS;
  }

  const productRows = rows as ProductRow[];
  const productIds = productRows.map((row) => row.id);
  let imageRows: ProductImageRow[] = [];
  if (productIds.length) {
    const { data, error: imageError } = await client
      .from("product_images")
      .select("product_id,storage_path,public_url,alt,sort_order")
      .in("product_id", productIds)
      .order("sort_order", { ascending: true });

    if (!imageError && data) {
      imageRows = data as ProductImageRow[];
    }
  }

  const imagesByProduct = mapProductImageRows(imageRows);

  return productRows.map((row) => mapProductRow(row, imagesByProduct.get(row.id) || []));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const normalized = (slug || "").trim().toLowerCase();
  if (!normalized) return null;

  const { client } = getSupabaseServerClient();
  if (!client) {
    return (
      FALLBACK_PRODUCTS.find((product) => product.slug.toLowerCase() === normalized) || null
    );
  }

  const { data, error } = await client
    .from("products")
    .select(
      "id,name,slug,category,short_description,description,material,leather_type,color,size,price,price_amount,price_currency,price_note,is_featured,is_available,whatsapp_message,source_pdf_page,status",
    )
    .eq("status", "published")
    .eq("slug", normalized)
    .maybeSingle();

  if (error || !data) {
    return (
      FALLBACK_PRODUCTS.find((product) => product.slug.toLowerCase() === normalized) || null
    );
  }

  const { data: imageRows, error: imageError } = await client
    .from("product_images")
    .select("product_id,storage_path,public_url,alt,sort_order")
    .eq("product_id", data.id)
    .order("sort_order", { ascending: true });

  const images =
    !imageError && imageRows
      ? mapProductImageRows(imageRows as ProductImageRow[]).get(data.id) || []
      : [];

  return mapProductRow(data as ProductRow, images);
}
