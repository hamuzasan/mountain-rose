import { existsSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";

import { createClient } from "@supabase/supabase-js";

const BUCKET_NAME = "product-images";
const TARGET_PARENT_FOLDER = "products";
const PAGE_SIZE = 1000;

const SOURCE_FOLDERS = [
  "adler",
  "guntur-backpack",
  "panjalu-messenger",
  "papandayan-backpack",
  "papandayan-messenger",
  "schatzi",
  "sundaland-beauty-moon",
  "sundaland-beauty-pouch",
  "sundaland-beauty-rose",
] as const;

type StorageItem = {
  name: string;
};

type CollectedFile = {
  sourcePath: string;
  slug: string;
  sortKey: number | null;
  orderName: string;
  extension: string;
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
  const entries: Array<{ key: string; value: string }> = [];
  for (const rawLine of text.split(/\r?\n/)) {
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
  for (const { key, value } of parseEnvFile(raw)) {
    if (process.env[key] == null) {
      process.env[key] = value;
    }
  }
}

function ensureEnvLoaded() {
  loadEnvFromFileIfPresent(join(process.cwd(), ".env.local"));
  loadEnvFromFileIfPresent(join(process.cwd(), ".env"));
}

function requireConfiguredSupabase() {
  ensureEnvLoaded();

  const url = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";

  if (!url) {
    throw new Error("Missing env var: SUPABASE_URL");
  }

  if (!serviceRoleKey) {
    throw new Error("Missing env var: SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

function isImageFile(name: string) {
  const extension = extname(name).toLowerCase();
  return [".png", ".jpg", ".jpeg", ".webp"].includes(extension);
}

function getExtension(name: string) {
  const extension = extname(name).toLowerCase();
  return extension || ".png";
}

function parseFirstNumber(value: string) {
  const match = value.match(/(\d+)/);
  if (!match) return null;
  const parsed = Number.parseInt(match[1] ?? "", 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function naturalCompare(a: CollectedFile, b: CollectedFile) {
  const aSort = a.sortKey ?? Number.POSITIVE_INFINITY;
  const bSort = b.sortKey ?? Number.POSITIVE_INFINITY;

  if (aSort !== bSort) {
    return aSort - bSort;
  }

  const nameCompare = a.orderName.localeCompare(b.orderName, undefined, {
    numeric: true,
    sensitivity: "base",
  });
  if (nameCompare !== 0) return nameCompare;

  return a.sourcePath.localeCompare(b.sourcePath, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

async function listAllItems(
  supabase: ReturnType<typeof requireConfiguredSupabase>,
  prefix?: string,
): Promise<StorageItem[]> {
  const collected: StorageItem[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list(prefix, {
      limit: PAGE_SIZE,
      offset,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) {
      throw new Error(`Unable to list "${prefix ?? "(root)"}": ${error.message}`);
    }

    const batch = (data || []) as StorageItem[];
    collected.push(...batch);

    if (batch.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return collected;
}

async function collectFilesRecursively(
  supabase: ReturnType<typeof requireConfiguredSupabase>,
  prefix: string,
  slug: string,
  relativePath = "",
): Promise<CollectedFile[]> {
  const items = await listAllItems(supabase, prefix);
  const files: CollectedFile[] = [];

  for (const item of items) {
    const sourcePath = `${prefix}/${item.name}`.replace(/^\/+/, "");
    const nextRelativePath = relativePath ? `${relativePath}/${item.name}` : item.name;

    if (isImageFile(item.name)) {
      files.push({
        sourcePath,
        slug,
        sortKey: parseFirstNumber(item.name),
        orderName: item.name,
        extension: getExtension(item.name),
      });
      continue;
    }

    const nestedFiles = await collectFilesRecursively(supabase, sourcePath, slug, nextRelativePath);
    files.push(...nestedFiles);
  }

  return files;
}

async function moveOne(
  supabase: ReturnType<typeof requireConfiguredSupabase>,
  sourcePath: string,
  targetPath: string,
) {
  if (sourcePath === targetPath) {
    return { skipped: true as const };
  }

  const { error } = await supabase.storage.from(BUCKET_NAME).move(sourcePath, targetPath);
  if (error) {
    return { skipped: false as const, error };
  }

  return { skipped: false as const };
}

async function migrateSlug(
  supabase: ReturnType<typeof requireConfiguredSupabase>,
  slug: string,
) {
  const sourcePrefixes = [slug, `${TARGET_PARENT_FOLDER}/${slug}`];
  const collected: CollectedFile[] = [];

  for (const prefix of sourcePrefixes) {
    try {
      const files = await collectFilesRecursively(supabase, prefix, slug);
      collected.push(...files);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[${slug}] Failed to read prefix "${prefix}": ${message}`);
    }
  }

  const uniqueByPath = new Map<string, CollectedFile>();
  for (const file of collected) {
    if (!uniqueByPath.has(file.sourcePath)) {
      uniqueByPath.set(file.sourcePath, file);
    }
  }

  const files = [...uniqueByPath.values()].sort(naturalCompare);

  if (files.length === 0) {
    console.warn(`[${slug}] No files found in "${slug}" or "${TARGET_PARENT_FOLDER}/${slug}".`);
    return { moved: 0, skipped: 0, failed: 0 };
  }

  const tempPrefix = `${TARGET_PARENT_FOLDER}/${slug}/__migration-${Date.now()}`;
  const tempMoves: Array<{ tempPath: string; finalPath: string; sourcePath: string }> = [];

  let moved = 0;
  let skipped = 0;
  let failed = 0;

  console.log(`\n[${slug}] Found ${files.length} file(s). Preparing temporary move...`);

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const tempName = `${String(index + 1).padStart(2, "0")}${file.extension}`;
    const tempPath = `${tempPrefix}/${tempName}`;
    const result = await moveOne(supabase, file.sourcePath, tempPath);

    if ("error" in result) {
      failed += 1;
      console.error(`[${slug}] Temp move failed: ${file.sourcePath} -> ${tempPath}`);
      console.error(`[${slug}] ${result.error?.message ?? "Unknown move error"}`);
      continue;
    }

    if (result.skipped) {
      skipped += 1;
      console.log(`[${slug}] Temp move skipped: ${file.sourcePath}`);
      continue;
    }

    tempMoves.push({
      sourcePath: file.sourcePath,
      tempPath,
      finalPath: `${TARGET_PARENT_FOLDER}/${slug}/${tempName}`,
    });
    moved += 1;
    console.log(`[${slug}] Temp moved: ${file.sourcePath} -> ${tempPath}`);
  }

  let renamed = 0;
  let renameFailed = 0;

  console.log(`[${slug}] Renaming files into final order...`);

  for (const item of tempMoves) {
    const result = await moveOne(supabase, item.tempPath, item.finalPath);

    if ("error" in result) {
      renameFailed += 1;
      console.error(`[${slug}] Final move failed: ${item.tempPath} -> ${item.finalPath}`);
      console.error(`[${slug}] ${result.error?.message ?? "Unknown move error"}`);
      continue;
    }

    if (result.skipped) {
      skipped += 1;
      console.log(`[${slug}] Final move skipped: ${item.finalPath}`);
      continue;
    }

    renamed += 1;
    console.log(`[${slug}] Finalized: ${item.tempPath} -> ${item.finalPath}`);
  }

  const extractedCount = tempMoves.length;
  console.log(
    `[${slug}] Summary: source files=${files.length}, staged=${moved}, finalized=${renamed}, failed=${failed + renameFailed}, skipped=${skipped}`,
  );

  if (extractedCount < 2) {
    console.warn(`[${slug}] Warning: fewer than 2 files were finalized.`);
  }

  return {
    moved: renamed,
    skipped,
    failed: failed + renameFailed,
  };
}

async function main() {
  const supabase = requireConfiguredSupabase();

  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    throw new Error(`Unable to list storage buckets: ${bucketError.message}`);
  }

  const bucketExists = (buckets || []).some((bucket) => bucket.name === BUCKET_NAME);
  if (!bucketExists) {
    throw new Error(`Storage bucket "${BUCKET_NAME}" was not found.`);
  }

  console.log(`Using bucket: ${BUCKET_NAME}`);
  console.log(`Source folders: ${SOURCE_FOLDERS.join(", ")}`);
  console.log(`Target parent folder: ${TARGET_PARENT_FOLDER}`);
  console.log("Using service role key for Storage migration.");

  const summary = {
    moved: 0,
    skipped: 0,
    failed: 0,
  };

  for (const slug of SOURCE_FOLDERS) {
    const result = await migrateSlug(supabase, slug);
    summary.moved += result.moved;
    summary.skipped += result.skipped;
    summary.failed += result.failed;
  }

  console.log("\nMigration summary");
  console.log(`Moved: ${summary.moved}`);
  console.log(`Skipped: ${summary.skipped}`);
  console.log(`Failed: ${summary.failed}`);

  if (summary.failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Top-level migration failure:");
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
