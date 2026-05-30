import { NextRequest, NextResponse } from "next/server";

import { generateTryOnImageWithAI } from "@/lib/ai/gemini";
import { getPrimaryProductImage, getProductImageUrl } from "@/lib/product-images";
import { getProductBySlug } from "@/data-access/products";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function isTryOnEnabled() {
  return process.env.AI_TRY_ON_ENABLED === "true";
}

export async function POST(request: NextRequest) {
  if (!isTryOnEnabled()) {
    return NextResponse.json(
      {
        ok: false,
        error: "AI try-on preview is disabled.",
        message: "Fitur preview AI sedang disiapkan.",
      },
      { status: 403 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form data." }, { status: 400 });
  }

  const slug = formData.get("productSlug");
  const image = formData.get("image");

  if (typeof slug !== "string" || !slug.trim()) {
    return NextResponse.json({ ok: false, error: "Product slug is required." }, { status: 400 });
  }

  if (!(image instanceof File)) {
    return NextResponse.json({ ok: false, error: "User image is required." }, { status: 400 });
  }

  if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
    return NextResponse.json(
      { ok: false, error: "Only JPG, PNG, and WEBP images are supported." },
      { status: 400 },
    );
  }

  if (image.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Image must be 6MB or smaller." },
      { status: 400 },
    );
  }

  const product = await getProductBySlug(slug);

  if (!product) {
    return NextResponse.json({ ok: false, error: "Product was not found." }, { status: 404 });
  }

  const primaryImage = getPrimaryProductImage(product.images);
  const productImageUrl = getProductImageUrl(primaryImage) || undefined;

  const result = await generateTryOnImageWithAI({
    productSlug: slug,
    productName: product.name,
    productImageUrl,
    userImage: image,
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 501 });
}
