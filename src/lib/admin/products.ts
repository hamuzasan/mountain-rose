import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";
import type { Product, ProductImage } from "@/types/product";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type ProductImageRow = Database["public"]["Tables"]["product_images"]["Row"];

function mapImages(rows: ProductImageRow[]): Map<string, ProductImage[]> {
  const map = new Map<string, ProductImage[]>();

  for (const row of rows) {
    if (!row.product_id) continue;

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

export function mapAdminProduct(row: ProductRow, images: ProductImage[] = []): Product & {
  status?: string | null;
} {
  return {
    _id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    shortDescription: row.short_description ?? undefined,
    description: row.description ?? undefined,
    material: row.material ?? undefined,
    leatherType: row.leather_type ?? undefined,
    color: row.color ?? undefined,
    size: row.size ?? undefined,
    price: row.price ?? undefined,
    priceAmount: row.price_amount ?? undefined,
    priceCurrency: row.price_currency ?? undefined,
    priceNote: row.price_note ?? undefined,
    images,
    sourcePdfPage: row.source_pdf_page ?? undefined,
    isFeatured: row.is_featured ?? undefined,
    isAvailable: row.is_available ?? undefined,
    whatsAppMessage: row.whatsapp_message ?? undefined,
    status: row.status,
  };
}

export async function getAdminProducts() {
  const { client, error } = getSupabaseAdminClient();
  if (!client) {
    return { products: [], error: error || "Supabase admin client is not configured." };
  }

  const { data: productRows, error: productError } = await client
    .from("products")
    .select("*")
    .order("updated_at", { ascending: false });

  if (productError || !productRows) {
    return {
      products: [],
      error: productError?.message || "Unable to load products.",
    };
  }

  const ids = productRows.map((row) => row.id);
  let imageRows: ProductImageRow[] = [];

  if (ids.length) {
    const { data, error: imageError } = await client
      .from("product_images")
      .select("*")
      .in("product_id", ids)
      .order("sort_order", { ascending: true });

    if (!imageError && data) {
      imageRows = data as ProductImageRow[];
    }
  }

  const imageMap = mapImages(imageRows);

  return {
    products: (productRows as ProductRow[]).map((row) =>
      mapAdminProduct(row, imageMap.get(row.id) || []),
    ),
    error: null,
  };
}
