"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";

type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value ? value : null;
}

function optionalNumber(formData: FormData, key: string) {
  const value = text(formData, key);
  if (!value) return null;
  const parsed = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function adminProductsErrorUrl(message: string) {
  return `/admin/products?error=${encodeURIComponent(message)}`;
}

function imageExtension(file: File) {
  const nameMatch = file.name.match(/\.(png|jpe?g|webp)$/i);
  if (nameMatch) return nameMatch[1].replace("jpeg", "jpg").toLowerCase();
  if (file.type.includes("png")) return "png";
  if (file.type.includes("webp")) return "webp";
  return "jpg";
}

async function uploadProductImages(productId: string, slug: string, productName: string, files: File[]) {
  if (!files.length) return;

  const { client } = getSupabaseAdminClient();
  if (!client) throw new Error("Supabase admin client is not configured.");

  const { data: existingImages } = await client
    .from("product_images")
    .select("sort_order")
    .eq("product_id", productId)
    .order("sort_order", { ascending: false })
    .limit(1);

  let sortOrder = (existingImages?.[0]?.sort_order ?? -1) + 1;

  for (const file of files) {
    if (!file.size) continue;
    if (!file.type.startsWith("image/")) continue;

    const storagePath = `products/${slug}/${String(sortOrder + 1).padStart(2, "0")}.${imageExtension(
      file,
    )}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await client.storage
      .from("product-images")
      .upload(storagePath, bytes, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

    if (uploadError) throw new Error(uploadError.message);

    const { data: publicData } = client.storage
      .from("product-images")
      .getPublicUrl(storagePath);

    const payload = {
      product_id: productId,
      storage_path: storagePath,
      public_url: publicData.publicUrl,
      alt: `${productName} product image ${sortOrder + 1}`,
      sort_order: sortOrder,
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

    sortOrder += 1;
  }
}

function productPayload(formData: FormData): ProductInsert {
  const name = text(formData, "name");
  const slug = normalizeSlug(text(formData, "slug") || name);
  const category = text(formData, "category");

  if (!name || !slug || !category) {
    throw new Error("Product name, slug, and category are required.");
  }

  return {
    name,
    slug,
    category,
    short_description: nullableText(formData, "shortDescription"),
    description: nullableText(formData, "description"),
    material: nullableText(formData, "material"),
    leather_type: nullableText(formData, "leatherType"),
    color: nullableText(formData, "color"),
    size: nullableText(formData, "size"),
    price: optionalNumber(formData, "price"),
    price_amount: optionalNumber(formData, "priceAmount"),
    price_currency: text(formData, "priceCurrency") || "USD",
    price_note: nullableText(formData, "priceNote"),
    is_featured: checked(formData, "isFeatured"),
    is_available: checked(formData, "isAvailable"),
    status: text(formData, "status") === "published" ? "published" : "draft",
    whatsapp_message: nullableText(formData, "whatsAppMessage"),
    source_pdf_page: optionalNumber(formData, "sourcePdfPage"),
  };
}

export async function saveProductAction(formData: FormData) {
  const session = await requireAdmin();
  if (!session.profile) throw new Error("This account is not registered as a CMS admin.");

  const { client } = getSupabaseAdminClient();
  if (!client) throw new Error("Supabase admin client is not configured.");

  const productId = text(formData, "productId");
  const payload = productPayload(formData);

  let saved: { id: string; slug: string; name: string } | null = null;

  if (productId) {
    const updatePayload: ProductUpdate = payload;
    const { data, error } = await client
      .from("products")
      .update(updatePayload)
      .eq("id", productId)
      .select("id,slug,name")
      .maybeSingle();

    if (error || !data) throw new Error(error?.message || "Product update failed.");
    saved = data;
  } else {
    const { data, error } = await client
      .from("products")
      .upsert(payload, { onConflict: "slug" })
      .select("id,slug,name")
      .maybeSingle();

    if (error || !data) throw new Error(error?.message || "Product save failed.");
    saved = data;
  }

  const imageFiles = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
  await uploadProductImages(saved.id, saved.slug, saved.name, imageFiles);

  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath(`/collections/${saved.slug}`);
  revalidatePath("/admin/products");
  redirect(`/admin/products?edit=${saved.slug}&saved=1`);
}

export async function setProductStatusAction(formData: FormData) {
  const session = await requireAdmin();
  if (!session.profile) {
    redirect(adminProductsErrorUrl("This account is not registered as a CMS admin."));
  }

  const { client } = getSupabaseAdminClient();
  if (!client) {
    redirect(adminProductsErrorUrl("Supabase admin client is not configured."));
  }

  const productId = text(formData, "productId");
  const status = text(formData, "status") === "published" ? "published" : "draft";
  if (!productId) {
    redirect(adminProductsErrorUrl("Product ID was not found."));
  }

  const { data, error } = await client
    .from("products")
    .update({ status })
    .eq("id", productId)
    .select("slug")
    .maybeSingle();

  if (error || !data) {
    redirect(adminProductsErrorUrl(error?.message || "Product status update failed."));
  }

  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath(`/collections/${data.slug}`);
  revalidatePath("/admin/products");
  redirect(`/admin/products?edit=${data.slug}&status=${status}`);
}
