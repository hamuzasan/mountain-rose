import "server-only";

import type { AiCmsResult, AiProductDraft } from "@/types/aiCms";

import { getSanityWriteClient } from "./writeClient";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function toPortableText(value?: string) {
  if (!value) return undefined;
  return [
    {
      _type: "block",
      _key: "ai-description",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "ai-description-text",
          text: value,
          marks: [],
        },
      ],
    },
  ];
}

function productDraftId(slug: string) {
  return `drafts.product.${slug}`;
}

function publishedProductId(slug: string) {
  return `product.${slug}`;
}

async function uploadImageFromUrl(
  url: string,
  productName: string,
): Promise<{ _type: "image"; asset: { _type: "reference"; _ref: string }; alt: string } | null> {
  const { client, error } = getSanityWriteClient();
  if (!client) throw new Error(error || "Sanity write client is not available.");

  const response = await fetch(url);
  if (!response.ok) return null;

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) return null;

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const extension = contentType.split("/")[1]?.split(";")[0] || "jpg";
  const asset = await client.assets.upload("image", buffer, {
    filename: `${slugify(productName || "mountain-rose-product")}.${extension}`,
    contentType,
  });

  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
    alt: `${productName} - tas kulit sapi Mountain Rose`,
  };
}

export async function uploadProductImagesToSanity(
  product: AiProductDraft,
): Promise<AiCmsResult<Array<{ _type: "image"; asset: { _type: "reference"; _ref: string }; alt: string }>>> {
  const urls = product.imageUrls || [];
  if (!urls.length) return { ok: true, data: [] };

  try {
    const uploaded = await Promise.all(
      urls.map((url) => uploadImageFromUrl(url, product.name || "Mountain Rose")),
    );

    return {
      ok: true,
      data: uploaded.filter((img): img is NonNullable<typeof img> => Boolean(img)),
    };
  } catch {
    return {
      ok: false,
      error: "Unable to upload product images to Sanity.",
    };
  }
}

export async function createDraftProductFromAi(
  product: AiProductDraft,
): Promise<AiCmsResult<{ draftId: string; slug: string }>> {
  const { client, error } = getSanityWriteClient();
  if (!client) return { ok: false, error };
  if (!product.name) return { ok: false, error: "Product name is required." };

  const slug = slugify(product.slug || product.name);
  if (!slug) return { ok: false, error: "Valid product slug is required." };

  const imageResult = await uploadProductImagesToSanity(product);
  const images = imageResult.ok ? imageResult.data || [] : [];

  const doc = {
    _id: productDraftId(slug),
    _type: "product",
    name: product.name,
    slug: { _type: "slug", current: slug },
    price: product.price ?? 0,
    category: product.category || "Custom Bag",
    shortDescription: product.shortDescription,
    description: toPortableText(product.description),
    images,
    leatherType: product.leatherType,
    color: product.color,
    size: product.size,
    isFeatured: product.isFeatured ?? false,
    isAvailable: product.isAvailable ?? true,
    whatsAppMessage: product.whatsAppMessage,
  };

  try {
    await client.createOrReplace(doc);
    return {
      ok: true,
      data: { draftId: doc._id, slug },
      message: "Draft product created in Sanity.",
    };
  } catch {
    return {
      ok: false,
      error: "Unable to create Sanity draft product.",
    };
  }
}

export async function publishDraftProductBySlug(
  slugInput: string,
): Promise<AiCmsResult<{ productId: string; slug: string }>> {
  const { client, error } = getSanityWriteClient();
  if (!client) return { ok: false, error };

  const slug = slugify(slugInput);
  if (!slug) return { ok: false, error: "Valid product slug is required." };

  try {
    const draftId = productDraftId(slug);
    const draft = await client.getDocument<Record<string, unknown>>(draftId);
    if (!draft) return { ok: false, error: "Draft product was not found." };

    const productId =
      typeof draft._id === "string" && draft._id.startsWith("drafts.")
        ? draft._id.replace(/^drafts\./, "")
        : publishedProductId(slug);

    const publishedDoc = {
      ...draft,
      _id: productId,
    };

    await client.transaction().createOrReplace(publishedDoc).delete(draftId).commit();

    return {
      ok: true,
      data: { productId, slug },
      message: "Draft product published after explicit owner command.",
    };
  } catch {
    return {
      ok: false,
      error: "Unable to publish Sanity draft product.",
    };
  }
}

export async function updateDraftProductFromAi(): Promise<AiCmsResult> {
  return {
    ok: false,
    error:
      "UPDATE_PRODUCT is reserved for a future reviewed patch workflow. TODO: require an explicit draft diff confirmation before mutation.",
  };
}
