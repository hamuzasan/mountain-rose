import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";

import {
  mountainRoseCatalogueProducts,
  type CatalogueImportProduct,
} from "../data/import/mountainRoseCatalogueProducts";
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

type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];

function buildProductRow(product: CatalogueImportProduct, status: string): ProductInsert {
  return {
    name: product.name,
    slug: product.slug,
    category: product.category,
    short_description: product.shortDescription,
    description: product.description,
    material: product.material,
    leather_type: product.leatherType,
    color: product.color,
    size: product.size,
    price: null,
    price_amount: product.priceAmount,
    price_currency: product.priceCurrency,
    price_note:
      product.priceNote ||
      "Prices can change without notice depending on quantity, exchange rates and market conditions.",
    is_featured: product.isFeatured,
    is_available: product.isAvailable,
    status,
    whatsapp_message: product.whatsAppMessage,
    source_pdf_page: product.sourcePdfPage,
    seo_title: null,
    seo_description: null,
  };
}

async function upsertProduct(
  supabase: ReturnType<typeof requireConfiguredSupabase>,
  product: CatalogueImportProduct,
) {
  const { data: existing, error: existingError } = await supabase
    .from("products")
    .select("id,status")
    .eq("slug", product.slug)
    .maybeSingle();

  if (existingError) {
    throw new Error(`Unable to check existing product for slug '${product.slug}'.`);
  }

  const status = existing?.status === "published" ? "published" : "draft";
  const row = buildProductRow(product, status);

  const { data, error } = await supabase
    .from("products")
    .upsert(row, { onConflict: "slug" })
    .select("id,status")
    .maybeSingle();

  if (error || !data) {
    throw new Error(`Unable to upsert product '${product.slug}'.`);
  }

  return { existed: existing != null };
}

async function main() {
  const summary = {
    created: [] as string[],
    updated: [] as string[],
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

  for (const product of mountainRoseCatalogueProducts) {
    try {
      const { existed } = await upsertProduct(supabase, product);

      if (existed) {
        summary.updated.push(product.slug);
      } else {
        summary.created.push(product.slug);
      }
    } catch (error) {
      summary.failed.push({
        slug: product.slug,
        reason: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  console.log("Catalogue metadata import summary (Supabase)");
  console.log(`Created: ${summary.created.length}`);
  console.log(`Updated: ${summary.updated.length}`);
  console.log(`Failed: ${summary.failed.length}`);

  if (summary.created.length) console.log(`Created slugs: ${summary.created.join(", ")}`);
  if (summary.updated.length) console.log(`Updated slugs: ${summary.updated.join(", ")}`);

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
