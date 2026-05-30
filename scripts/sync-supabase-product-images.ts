import { existsSync, readFileSync } from "node:fs";
import { resolve, extname } from "node:path";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "../src/lib/supabase/database.types";

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
    if (process.env[key] == null) {
      process.env[key] = value;
    }
  }
}

function ensureEnvLoaded() {
  loadEnvFromFileIfPresent(resolve(process.cwd(), ".env.local"));
  loadEnvFromFileIfPresent(resolve(process.cwd(), ".env"));
}

function requireConfiguredSupabase() {
  ensureEnvLoaded();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

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

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

function normalizeFilename(name: string) {
  return name.trim().toLowerCase();
}

function isImageFile(name: string) {
  const extension = extname(name).toLowerCase();
  return [".png", ".jpg", ".jpeg", ".webp"].includes(extension);
}

async function main() {
  const summary = {
    synced: [] as string[],
    warned: [] as string[],
    failed: [] as Array<{ slug: string; reason: string }>,
  };

  let supabase: ReturnType<typeof requireConfiguredSupabase>;
  try {
    supabase = requireConfiguredSupabase();
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Supabase is not configured.");
    process.exitCode = 1;
    return;
  }

  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    console.error("Unable to list Supabase Storage buckets.");
    process.exitCode = 1;
    return;
  }

  const bucketExists = (buckets || []).some((bucket) => bucket.name === "product-images");
  if (!bucketExists) {
    console.error("Storage bucket 'product-images' was not found.");
    process.exitCode = 1;
    return;
  }

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id,name,slug,status")
    .order("name", { ascending: true });

  if (productsError || !products) {
    console.error("Unable to read products from Supabase.");
    process.exitCode = 1;
    return;
  }

  const productRows = products as ProductRow[];

  for (const product of productRows) {
    const prefix = `products/${product.slug}`;
    const { data: files, error: filesError } = await supabase.storage
      .from("product-images")
      .list(prefix, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (filesError) {
      summary.failed.push({
        slug: product.slug,
        reason: `Unable to list files in ${prefix}.`,
      });
      continue;
    }

    const imageFiles = (files || [])
      .filter((file) => file.name && !file.name.endsWith("/"))
      .filter((file) => isImageFile(file.name))
      .sort((a, b) =>
        normalizeFilename(a.name).localeCompare(normalizeFilename(b.name), undefined, {
          numeric: true,
          sensitivity: "base",
        }),
      );

    if (imageFiles.length === 0) {
      summary.warned.push(product.slug);
      console.warn(`No uploaded product images found for ${product.slug} in ${prefix}.`);
      continue;
    }

    for (let index = 0; index < imageFiles.length; index += 1) {
      const file = imageFiles[index];
      const storagePath = `${prefix}/${file.name}`;
      const { data: publicData } = supabase.storage
        .from("product-images")
        .getPublicUrl(storagePath);
      const publicUrl = publicData.publicUrl;

      if (!publicUrl) {
        summary.failed.push({
          slug: product.slug,
          reason: `Unable to resolve public URL for ${storagePath}.`,
        });
        continue;
      }

      const alt = `${product.name} product image ${index + 1}`;

      const { data: existing, error: existingError } = await supabase
        .from("product_images")
        .select("id")
        .eq("product_id", product.id)
        .eq("storage_path", storagePath)
        .maybeSingle();

      if (existingError) {
        summary.failed.push({
          slug: product.slug,
          reason: `Unable to check existing image row for ${storagePath}.`,
        });
        continue;
      }

      const payload = {
        product_id: product.id,
        storage_path: storagePath,
        public_url: publicUrl,
        alt,
        sort_order: index,
      };

      if (existing?.id) {
        const { error } = await supabase
          .from("product_images")
          .update(payload)
          .eq("id", existing.id);
        if (error) {
          summary.failed.push({
            slug: product.slug,
            reason: `Unable to update image row for ${storagePath}.`,
          });
          continue;
        }
      } else {
        const { error } = await supabase.from("product_images").insert(payload);
        if (error) {
          summary.failed.push({
            slug: product.slug,
            reason: `Unable to insert image row for ${storagePath}.`,
          });
          continue;
        }
      }
    }

    summary.synced.push(product.slug);
  }

  console.log("Supabase product image sync summary");
  console.log(`Synced: ${summary.synced.length}`);
  console.log(`Warnings: ${summary.warned.length}`);
  console.log(`Failed: ${summary.failed.length}`);

  if (summary.synced.length) console.log(`Synced slugs: ${summary.synced.join(", ")}`);
  if (summary.warned.length) console.log(`Warning slugs: ${summary.warned.join(", ")}`);
  if (summary.failed.length) {
    for (const item of summary.failed) {
      console.log(`Failed ${item.slug}: ${item.reason}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Image sync failed.");
  process.exitCode = 1;
});
