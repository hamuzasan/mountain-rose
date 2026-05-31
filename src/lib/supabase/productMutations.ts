import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";
import type { AiCmsResult, AiProductDraft } from "@/types/aiCms";

type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

function normalizeSlug(value?: string | null) {
  return (value || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function slugFromProduct(input: AiProductDraft) {
  return normalizeSlug(input.slug || input.name || "mountain-rose-product");
}

function stringOrNull(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function numberOrNull(value?: number | null) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function buildProductInsert(input: AiProductDraft, status = "draft"): ProductInsert {
  const slug = slugFromProduct(input);

  return {
    name: stringOrNull(input.name) || slug.replace(/-/g, " "),
    slug,
    category: stringOrNull(input.category) || "Custom Bag",
    short_description: stringOrNull(input.shortDescription),
    description: stringOrNull(input.description),
    material: stringOrNull(input.material) || stringOrNull(input.leatherType),
    leather_type: stringOrNull(input.leatherType) || stringOrNull(input.material),
    color: stringOrNull(input.color),
    size: stringOrNull(input.size),
    price: numberOrNull(input.price),
    price_amount: numberOrNull(input.priceAmount),
    price_currency: stringOrNull(input.priceCurrency) || "USD",
    price_note: stringOrNull(input.priceNote),
    is_featured: input.isFeatured ?? false,
    is_available: input.isAvailable ?? true,
    status,
    whatsapp_message: stringOrNull(input.whatsAppMessage),
    source_pdf_page: numberOrNull(input.sourcePdfPage),
  };
}

function buildProductUpdate(input: AiProductDraft): ProductUpdate {
  const update: ProductUpdate = {};

  if (input.name != null) update.name = stringOrNull(input.name) || undefined;
  if (input.slug != null) update.slug = slugFromProduct(input);
  if (input.category != null) update.category = stringOrNull(input.category) || undefined;
  if (input.shortDescription != null) {
    update.short_description = stringOrNull(input.shortDescription);
  }
  if (input.description != null) update.description = stringOrNull(input.description);
  if (input.material != null) update.material = stringOrNull(input.material);
  if (input.leatherType != null) update.leather_type = stringOrNull(input.leatherType);
  if (input.color != null) update.color = stringOrNull(input.color);
  if (input.size != null) update.size = stringOrNull(input.size);
  if (input.price != null) update.price = numberOrNull(input.price);
  if (input.priceAmount != null) update.price_amount = numberOrNull(input.priceAmount);
  if (input.priceCurrency != null) update.price_currency = stringOrNull(input.priceCurrency);
  if (input.priceNote != null) update.price_note = stringOrNull(input.priceNote);
  if (input.isFeatured != null) update.is_featured = input.isFeatured;
  if (input.isAvailable != null) update.is_available = input.isAvailable;
  if (input.whatsAppMessage != null) {
    update.whatsapp_message = stringOrNull(input.whatsAppMessage);
  }
  if (input.sourcePdfPage != null) update.source_pdf_page = numberOrNull(input.sourcePdfPage);

  return update;
}

function imageExtension(contentType?: string | null, fallbackUrl?: string) {
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("jpeg") || contentType?.includes("jpg")) return "jpg";
  const match = fallbackUrl?.match(/\.(png|jpe?g|webp)(?:\?|#|$)/i);
  return match ? match[1].replace("jpeg", "jpg").toLowerCase() : "jpg";
}

async function uploadRemoteProductImages(productId: string, slug: string, imageUrls?: string[]) {
  if (!imageUrls?.length) return { uploaded: 0, failed: 0 };

  const { client } = getSupabaseAdminClient();
  if (!client) return { uploaded: 0, failed: imageUrls.length };

  const { data: existingImages } = await client
    .from("product_images")
    .select("sort_order")
    .eq("product_id", productId)
    .order("sort_order", { ascending: false })
    .limit(1);

  let nextSort = (existingImages?.[0]?.sort_order ?? -1) + 1;
  let uploaded = 0;
  let failed = 0;

  for (const url of imageUrls) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        failed += 1;
        continue;
      }

      const contentType = response.headers.get("content-type") || "image/jpeg";
      if (!contentType.startsWith("image/")) {
        failed += 1;
        continue;
      }

      const bytes = Buffer.from(await response.arrayBuffer());
      const fileName = `${String(nextSort + 1).padStart(2, "0")}-wa.${imageExtension(
        contentType,
        url,
      )}`;
      const storagePath = `products/${slug}/${fileName}`;

      const { error: uploadError } = await client.storage
        .from("product-images")
        .upload(storagePath, bytes, {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        failed += 1;
        continue;
      }

      const { data: publicData } = client.storage
        .from("product-images")
        .getPublicUrl(storagePath);

      const payload = {
        product_id: productId,
        storage_path: storagePath,
        public_url: publicData.publicUrl,
        alt: `${slug.replace(/-/g, " ")} product image ${nextSort + 1}`,
        sort_order: nextSort,
      };

      const { data: existingRow } = await client
        .from("product_images")
        .select("id")
        .eq("storage_path", storagePath)
        .maybeSingle();

      if (existingRow?.id) {
        await client.from("product_images").update(payload).eq("id", existingRow.id);
      } else {
        await client.from("product_images").insert(payload);
      }

      nextSort += 1;
      uploaded += 1;
    } catch {
      failed += 1;
    }
  }

  return { uploaded, failed };
}

export async function createDraftProductFromAi(
  input: AiProductDraft,
): Promise<AiCmsResult<{ id: string; slug: string; imageUploads?: number }>> {
  const { client, error } = getSupabaseAdminClient();
  if (!client) return { ok: false, error: error || "Supabase admin client is not configured." };

  const row = buildProductInsert(input, "draft");

  const { data, error: upsertError } = await client
    .from("products")
    .upsert(row, { onConflict: "slug" })
    .select("id,slug")
    .maybeSingle();

  if (upsertError || !data) {
    return {
      ok: false,
      error: upsertError?.message || "Unable to create Supabase draft product.",
    };
  }

  const uploads = await uploadRemoteProductImages(data.id, data.slug, input.imageUrls);

  return {
    ok: true,
    data: {
      id: data.id,
      slug: data.slug,
      imageUploads: uploads.uploaded,
    },
    message: uploads.failed
      ? `${uploads.failed} image attachment could not be uploaded.`
      : undefined,
  };
}

export async function updateDraftProductFromAi(
  slug: string,
  input: AiProductDraft,
): Promise<AiCmsResult<{ id: string; slug: string; imageUploads?: number }>> {
  const { client, error } = getSupabaseAdminClient();
  if (!client) return { ok: false, error: error || "Supabase admin client is not configured." };

  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug) return { ok: false, error: "Product slug is missing." };

  const update = buildProductUpdate(input);
  const { data, error: updateError } = await client
    .from("products")
    .update(update)
    .eq("slug", normalizedSlug)
    .select("id,slug")
    .maybeSingle();

  if (updateError || !data) {
    return {
      ok: false,
      error: updateError?.message || `Unable to update product ${normalizedSlug}.`,
    };
  }

  const uploads = await uploadRemoteProductImages(data.id, data.slug, input.imageUrls);

  return {
    ok: true,
    data: {
      id: data.id,
      slug: data.slug,
      imageUploads: uploads.uploaded,
    },
  };
}

export async function publishDraftProductBySlug(
  slug: string,
): Promise<AiCmsResult<{ slug: string }>> {
  const { client, error } = getSupabaseAdminClient();
  if (!client) return { ok: false, error: error || "Supabase admin client is not configured." };

  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug) return { ok: false, error: "Product slug is missing." };

  const { data, error: publishError } = await client
    .from("products")
    .update({ status: "published" })
    .eq("slug", normalizedSlug)
    .select("slug")
    .maybeSingle();

  if (publishError || !data) {
    return {
      ok: false,
      error: publishError?.message || `Unable to publish product ${normalizedSlug}.`,
    };
  }

  return { ok: true, data: { slug: data.slug } };
}
