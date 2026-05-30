import { existsSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { groq } from "next-sanity";

import {
  mountainRoseCatalogueProducts,
  type CatalogueImportProduct,
} from "../data/import/mountainRoseCatalogueProducts";
import { getSanityWriteClient } from "../src/sanity/lib/writeClient";

const outputDir = resolve(process.cwd(), "data/generated/catalogue-pages");
const imageQuery = groq`
  *[_type == "product" && slug.current == $slug] | order(_updatedAt desc)[0]{
    _id,
    slug
  }
`;

type ImportSummary = {
  created: string[];
  updated: string[];
  skipped: string[];
  failed: Array<{ slug: string; reason: string }>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function toPortableText(text: string) {
  return [
    {
      _type: "block",
      _key: `${slugify(text).slice(0, 24)}-block`,
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: `${slugify(text).slice(0, 24)}-span`,
          text,
          marks: [],
        },
      ],
    },
  ];
}

function getImagePath(product: CatalogueImportProduct) {
  return join(outputDir, `${product.slug}.png`);
}

async function uploadLocalImage(product: CatalogueImportProduct) {
  const { client, error } = getSanityWriteClient();
  if (!client) throw new Error(error || "Sanity write client is not available.");

  const imagePath = getImagePath(product);
  if (!existsSync(imagePath)) {
    throw new Error(`Missing rendered image: ${imagePath}`);
  }

  const buffer = readFileSync(imagePath);
  const asset = await client.assets.upload("image", buffer, {
    filename: basename(imagePath),
    contentType: "image/png",
  });

  return {
    _type: "image" as const,
    asset: {
      _type: "reference" as const,
      _ref: asset._id,
    },
    alt: `${product.name} dari katalog Mountain Rose`,
  };
}

async function resolveDraftId(slug: string) {
  const { client, error } = getSanityWriteClient();
  if (!client) throw new Error(error || "Sanity write client is not available.");

  const existing = await client.fetch<{ _id?: string } | null>(imageQuery, { slug });
  if (!existing?._id) return `drafts.catalogue.${slug}`;
  if (existing._id.startsWith("drafts.")) return existing._id;
  return `drafts.${existing._id}`;
}

async function createOrUpdateDraftProduct(product: CatalogueImportProduct) {
  const { client, error } = getSanityWriteClient();
  if (!client) throw new Error(error || "Sanity write client is not available.");

  const draftId = await resolveDraftId(product.slug);
  const existed = Boolean(await client.getDocument(draftId));
  const image = await uploadLocalImage(product);

  await client.createOrReplace({
    _id: draftId,
    _type: "product",
    name: product.name,
    slug: { _type: "slug", current: product.slug },
    priceAmount: product.priceAmount,
    priceCurrency: product.priceCurrency,
    priceNote: product.priceNote,
    category: product.category,
    shortDescription: product.shortDescription,
    description: toPortableText(product.description),
    images: [image],
    material: product.material,
    leatherType: product.leatherType,
    color: product.color,
    size: product.size,
    sourcePdfPage: product.sourcePdfPage,
    isFeatured: product.isFeatured,
    isAvailable: product.isAvailable,
    whatsAppMessage: product.whatsAppMessage,
  });

  return existed ? "updated" : "created";
}

async function main() {
  const { client, error } = getSanityWriteClient();
  if (!client) {
    console.error(error || "Sanity write client is not available.");
    process.exitCode = 1;
    return;
  }

  const summary: ImportSummary = {
    created: [],
    updated: [],
    skipped: [],
    failed: [],
  };

  for (const product of mountainRoseCatalogueProducts) {
    const imagePath = getImagePath(product);
    if (!existsSync(imagePath)) {
      summary.skipped.push(product.slug);
      continue;
    }

    try {
      const action = await createOrUpdateDraftProduct(product);
      summary[action].push(product.slug);
    } catch (error) {
      summary.failed.push({
        slug: product.slug,
        reason: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  console.log("Catalogue import summary");
  console.log(`Created: ${summary.created.length}`);
  console.log(`Updated: ${summary.updated.length}`);
  console.log(`Skipped: ${summary.skipped.length}`);
  console.log(`Failed: ${summary.failed.length}`);

  if (summary.created.length) console.log(`Created slugs: ${summary.created.join(", ")}`);
  if (summary.updated.length) console.log(`Updated slugs: ${summary.updated.join(", ")}`);
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
