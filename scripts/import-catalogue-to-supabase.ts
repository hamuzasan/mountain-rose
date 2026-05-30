import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import {
  mountainRoseCatalogueProducts,
  type CatalogueImportProduct,
} from "../data/import/mountainRoseCatalogueProducts";

const outputDir = resolve(process.cwd(), "data/generated/catalogue-pages");
const bucketName = "product-images";
const storagePrefix = "catalogue";

type Database = {
  public: {
    Tables: {
      products: {
        Row: { id: string; slug: string };
        Insert: {
          name: string;
          slug: string;
          category: string;
          collection_id?: string | null;
          short_description?: string | null;
          description?: string | null;
          material?: string | null;
          leather_type?: string | null;
          color?: string | null;
          size?: string | null;
          price?: number | null;
          price_amount?: number | null;
          price_currency?: string | null;
          price_note?: string | null;
          is_featured?: boolean | null;
          is_available?: boolean | null;
          status?: string | null;
          whatsapp_message?: string | null;
          source_pdf_page?: number | null;
          seo_title?: string | null;
          seo_description?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      product_images: {
        Row: { id: string; product_id: string; storage_path: string };
        Insert: {
          product_id: string;
          storage_path: string;
          public_url: string;
          alt?: string | null;
          sort_order?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["product_images"]["Insert"]>;
      };
    };
  };
};

type ImportSummary = {
  created: string[];
  updated: string[];
  skipped: string[];
  failed: Array<{ slug: string; reason: string }>;
};

function stripQuotes(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseEnvFile(text: string) {
  const lines = text.split(/\r?\n/);
  const entries: Array<{ key: string; value: string }> = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const eqIndex = line.indexOf("=");
    if (eqIndex <= 0) continue;

    const key = line.slice(0, eqIndex).trim();
    const value = stripQuotes(line.slice(eqIndex + 1));
    if (!key) continue;

    entries.push({ key, value });
  }

  return entries;
}

function loadEnvFromFileIfPresent(filePath: string) {
  if (!existsSync(filePath)) return;

  const raw = readFileSync(filePath, "utf8");
  const entries = parseEnvFile(raw);
  for (const { key, value } of entries) {
    // Do not override env vars that are already set by the shell/CI.
    if (process.env[key] == null) {
      process.env[key] = value;
    }
  }
}

function ensureEnvLoaded() {
  // Next.js loads .env* automatically, but standalone Node scripts do not.
  // We keep this minimal and safe: load local env files if present.
  loadEnvFromFileIfPresent(resolve(process.cwd(), ".env.local"));
  loadEnvFromFileIfPresent(resolve(process.cwd(), ".env"));
}

function getEnv() {
  ensureEnvLoaded();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return { url, serviceRoleKey };
}

function getImagePath(product: CatalogueImportProduct) {
  return join(outputDir, `${product.slug}.png`);
}

function buildStoragePath(product: CatalogueImportProduct) {
  return `${storagePrefix}/${product.slug}.png`;
}

function requireConfiguredSupabase() {
  const { url, serviceRoleKey } = getEnv();
  if (!url) {
    throw new Error("Missing env var: NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!serviceRoleKey) {
    throw new Error("Missing env var: SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

type SupabaseAdminClient = SupabaseClient<Database>;

async function ensureBucketExists(supabase: SupabaseAdminClient) {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    throw new Error("Unable to list storage buckets. Check Supabase configuration.");
  }
  const exists = (data || []).some((b) => b.name === bucketName);
  if (!exists) {
    throw new Error(
      `Storage bucket '${bucketName}' was not found. Create it in Supabase Storage first.`,
    );
  }
}

async function uploadImage(
  supabase: SupabaseAdminClient,
  product: CatalogueImportProduct,
) {
  const imagePath = getImagePath(product);
  if (!existsSync(imagePath)) {
    throw new Error(`Missing extracted image file: ${imagePath}`);
  }

  const storagePath = buildStoragePath(product);
  const buffer = readFileSync(imagePath);

  const { error } = await supabase.storage.from(bucketName).upload(storagePath, buffer, {
    contentType: "image/png",
    upsert: true,
  });
  if (error) {
    throw new Error(
      `Unable to upload image to Supabase Storage (${bucketName}/${storagePath}).`,
    );
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
  const publicUrl = data.publicUrl;
  if (!publicUrl) {
    throw new Error("Unable to resolve public URL for uploaded image.");
  }

  return { storagePath, publicUrl };
}

async function upsertProduct(
  supabase: SupabaseAdminClient,
  product: CatalogueImportProduct,
) {
  const { data: existing, error: existingError } = await supabase
    .from("products")
    .select("id")
    .eq("slug", product.slug)
    .limit(1)
    .maybeSingle();
  if (existingError) {
    throw new Error("Unable to check existing product by slug.");
  }

  const row = {
    name: product.name,
    slug: product.slug,
    category: product.category,
    short_description: product.shortDescription,
    description: product.description,
    material: product.material,
    leather_type: product.leatherType,
    color: product.color,
    size: product.size,
    price: null as number | null,
    price_amount: product.priceAmount,
    price_currency: product.priceCurrency,
    price_note: product.priceNote,
    is_featured: product.isFeatured,
    is_available: product.isAvailable,
    status: "draft",
    whatsapp_message: product.whatsAppMessage,
    source_pdf_page: product.sourcePdfPage,
    seo_title: null as string | null,
    seo_description: null as string | null,
  };

  const productsBuilder = supabase.from("products") as unknown as {
    upsert: (
      values: Record<string, unknown>,
      options: { onConflict: string },
    ) => {
      select: (columns: string) => {
        maybeSingle: () => Promise<{ data: unknown; error: unknown }>;
      };
    };
  };

  const { data, error } = await productsBuilder
    .upsert(row as unknown as Record<string, unknown>, { onConflict: "slug" })
    .select("id,slug")
    .maybeSingle();

  const record =
    data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  const id = record?.id;

  if (error || typeof id !== "string") {
    throw new Error("Unable to upsert product row into Supabase.");
  }

  return { productId: id, existed: existing != null };
}

async function upsertProductImage(
  supabase: SupabaseAdminClient,
  productId: string,
  image: { storagePath: string; publicUrl: string },
  alt: string,
) {
  const productImagesBuilder = supabase.from("product_images") as unknown as {
    select: (columns: string) => {
      eq: (column: string, value: unknown) => {
        eq: (column2: string, value2: unknown) => {
          limit: (count: number) => {
            maybeSingle: () => Promise<{ data: unknown; error: unknown }>;
          };
        };
      };
    };
    update: (values: Record<string, unknown>) => {
      eq: (column: string, value: unknown) => Promise<{ data: unknown; error: unknown }>;
    };
    insert: (values: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
  };

  const { data: existing, error: existingError } = await productImagesBuilder
    .select("id")
    .eq("product_id", productId)
    .eq("storage_path", image.storagePath)
    .limit(1)
    .maybeSingle();

  if (existingError) {
    throw new Error("Unable to query existing product_images rows.");
  }

  const existingRecord =
    existing && typeof existing === "object"
      ? (existing as Record<string, unknown>)
      : null;
  const existingId =
    existingRecord && typeof existingRecord.id === "string"
      ? existingRecord.id
      : null;

  if (existingId) {
    const { error } = await productImagesBuilder
      .update({
        public_url: image.publicUrl,
        alt,
        sort_order: 0,
      })
      .eq("id", existingId);
    if (error) throw new Error("Unable to update product_images row.");
    return { existed: true };
  }

  const { error } = await productImagesBuilder.insert({
    product_id: productId,
    storage_path: image.storagePath,
    public_url: image.publicUrl,
    alt,
    sort_order: 0,
  });

  if (error) {
    throw new Error("Unable to insert product_images row.");
  }

  return { existed: false };
}

async function main() {
  const summary: ImportSummary = {
    created: [],
    updated: [],
    skipped: [],
    failed: [],
  };

  let supabase: SupabaseAdminClient;
  try {
    supabase = requireConfiguredSupabase();
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Supabase is not configured.");
    process.exitCode = 1;
    return;
  }

  try {
    await ensureBucketExists(supabase);
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Storage bucket check failed.");
    process.exitCode = 1;
    return;
  }

  for (const product of mountainRoseCatalogueProducts) {
    const imagePath = getImagePath(product);
    if (!existsSync(imagePath)) {
      summary.skipped.push(product.slug);
      continue;
    }

    try {
      const uploaded = await uploadImage(supabase, product);
      const { productId, existed } = await upsertProduct(supabase, product);
      await upsertProductImage(
        supabase,
        productId,
        uploaded,
        `${product.name} dari katalog Mountain Rose`,
      );

      if (existed) summary.updated.push(product.slug);
      else summary.created.push(product.slug);
    } catch (error) {
      summary.failed.push({
        slug: product.slug,
        reason: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  console.log("Catalogue import summary (Supabase)");
  console.log(`Created: ${summary.created.length}`);
  console.log(`Updated: ${summary.updated.length}`);
  console.log(`Skipped (missing images): ${summary.skipped.length}`);
  console.log(`Failed: ${summary.failed.length}`);

  if (summary.updated.length) console.log(`Updated slugs: ${summary.updated.join(", ")}`);
  if (summary.created.length) console.log(`Created slugs: ${summary.created.join(", ")}`);
  if (summary.skipped.length) console.log(`Skipped slugs: ${summary.skipped.join(", ")}`);
  if (summary.failed.length) {
    for (const item of summary.failed) {
      console.log(`Failed ${item.slug}: ${item.reason}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Import failed.");
  process.exitCode = 1;
});
