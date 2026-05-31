import "server-only";

import type { AiProductDraft } from "@/types/aiCms";

import { buildProductCopyPrompt, buildProductParsePrompt, buildTryOnPrompt } from "./prompts";
import type {
  AiTextParseResult,
  GeminiProductParseInput,
  ProductCopyInput,
  ProductCopySuggestion,
  TryOnImageInput,
  TryOnImageResult,
} from "./types";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY;
}

function getTextModel() {
  return process.env.GEMINI_TEXT_MODEL || "gemini-1.5-flash";
}

function getImageModel() {
  return process.env.GEMINI_IMAGE_MODEL || "gemini-2.0-flash-preview-image-generation";
}

function missingGeminiKeyResult<T>(message: string) {
  return {
    ok: false,
    error: "GEMINI_API_KEY is not configured.",
    message,
  } satisfies { ok: false; error: string; message: string; data?: T };
}

function extractJson(text: string) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fenced?.[1] || trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return candidate.slice(start, end + 1);
}

async function callGeminiText(prompt: string) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return { ok: false as const, error: "GEMINI_API_KEY is not configured." };

  const response = await fetch(
    `${GEMINI_API_BASE}/models/${getTextModel()}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    },
  );

  if (!response.ok) {
    return { ok: false as const, error: `Gemini request failed with ${response.status}.` };
  }

  const json = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
  return { ok: true as const, text };
}

function safeBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return undefined;
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseNumber(value: string) {
  const cleaned = value.replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", ".");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseBoolean(value: string) {
  const normalized = value.trim().toLowerCase();
  if (["true", "yes", "ya", "y", "available", "tersedia", "1"].includes(normalized)) {
    return true;
  }
  if (["false", "no", "tidak", "n", "not available", "habis", "0"].includes(normalized)) {
    return false;
  }
  return undefined;
}

function parseProductMessageLocally(input: GeminiProductParseInput): AiTextParseResult {
  const draft: AiProductDraft = {
    imageUrls: input.imageUrls,
    attachmentReferences: input.attachmentReferences,
  };
  const lines = input.rawText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  for (const line of lines) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex <= 0) continue;

    const rawKey = line.slice(0, separatorIndex).trim().toLowerCase();
    const value = line.slice(separatorIndex + 1).trim();
    if (!value) continue;

    if (["nama", "name", "product", "produk"].includes(rawKey)) draft.name = value;
    if (["slug", "url"].includes(rawKey)) draft.slug = normalizeSlug(value);
    if (["kategori", "category"].includes(rawKey)) draft.category = value;
    if (["warna", "color"].includes(rawKey)) draft.color = value;
    if (["ukuran", "size"].includes(rawKey)) draft.size = value;
    if (["material", "bahan"].includes(rawKey)) draft.material = value;
    if (["jenis kulit", "leather type", "leathertype"].includes(rawKey)) {
      draft.leatherType = value;
    }
    if (["deskripsi singkat", "short description", "shortdescription"].includes(rawKey)) {
      draft.shortDescription = value;
    }
    if (["deskripsi", "description"].includes(rawKey)) draft.description = value;
    if (["whatsapp", "whatsapp message", "pesan whatsapp"].includes(rawKey)) {
      draft.whatsAppMessage = value;
    }
    if (["featured", "is featured", "isfeatured"].includes(rawKey)) {
      draft.isFeatured = parseBoolean(value);
    }
    if (["available", "is available", "isavailable", "tersedia"].includes(rawKey)) {
      draft.isAvailable = parseBoolean(value);
    }
    if (["source pdf page", "sourcepdfpage", "halaman pdf"].includes(rawKey)) {
      draft.sourcePdfPage = parseNumber(value);
    }
    if (["harga", "price"].includes(rawKey)) {
      const amount = parseNumber(value);
      const upper = value.toUpperCase();
      if (upper.includes("USD") || upper.includes("US$") || upper.includes("$")) {
        draft.priceAmount = amount;
        draft.priceCurrency = "USD";
      } else if (upper.includes("IDR") || upper.includes("RP") || (amount ?? 0) > 10000) {
        draft.price = amount;
      } else {
        draft.priceAmount = amount;
        draft.priceCurrency = draft.priceCurrency || "USD";
      }
    }
    if (["price amount", "priceamount"].includes(rawKey)) draft.priceAmount = parseNumber(value);
    if (["price currency", "pricecurrency", "mata uang"].includes(rawKey)) {
      draft.priceCurrency = value.toUpperCase();
    }
    if (["price note", "pricenote", "catatan harga"].includes(rawKey)) draft.priceNote = value;
  }

  if (!draft.slug && draft.name) draft.slug = normalizeSlug(draft.name);
  if (!draft.material && draft.leatherType) draft.material = draft.leatherType;
  if (!draft.leatherType && draft.material) draft.leatherType = draft.material;

  if (!draft.name && !draft.slug) {
    return {
      ok: false,
      error:
        "GEMINI_API_KEY is not configured and the message does not contain labeled product fields.",
    };
  }

  return { ok: true, data: draft };
}

function normalizeProductDraft(input: Record<string, unknown>): AiProductDraft {
  return {
    name: typeof input.name === "string" ? input.name : undefined,
    slug: typeof input.slug === "string" ? input.slug : undefined,
    price: typeof input.price === "number" ? input.price : undefined,
    priceAmount: typeof input.priceAmount === "number" ? input.priceAmount : undefined,
    priceCurrency:
      typeof input.priceCurrency === "string" ? input.priceCurrency.toUpperCase() : undefined,
    priceNote: typeof input.priceNote === "string" ? input.priceNote : undefined,
    category: typeof input.category === "string" ? input.category : undefined,
    shortDescription:
      typeof input.shortDescription === "string" ? input.shortDescription : undefined,
    description: typeof input.description === "string" ? input.description : undefined,
    material: typeof input.material === "string" ? input.material : undefined,
    leatherType: typeof input.leatherType === "string" ? input.leatherType : undefined,
    color: typeof input.color === "string" ? input.color : undefined,
    size: typeof input.size === "string" ? input.size : undefined,
    sourcePdfPage: typeof input.sourcePdfPage === "number" ? input.sourcePdfPage : undefined,
    isFeatured: safeBoolean(input.isFeatured),
    isAvailable: safeBoolean(input.isAvailable),
    whatsAppMessage:
      typeof input.whatsAppMessage === "string" ? input.whatsAppMessage : undefined,
  };
}

export async function parseProductMessageWithAI(
  input: GeminiProductParseInput,
): Promise<AiTextParseResult> {
  if (!getGeminiApiKey()) {
    return parseProductMessageLocally(input);
  }

  try {
    const result = await callGeminiText(buildProductParsePrompt(input));
    if (!result.ok) return { ok: false, error: result.error };

    const jsonText = extractJson(result.text);
    if (!jsonText) return { ok: false, error: "Gemini did not return valid JSON." };

    const parsed = JSON.parse(jsonText) as Record<string, unknown>;
    return {
      ok: true,
      data: {
        ...normalizeProductDraft(parsed),
        imageUrls: input.imageUrls,
        attachmentReferences: input.attachmentReferences,
      },
    };
  } catch {
    return { ok: false, error: "Unable to parse product message with Gemini." };
  }
}

export async function generateProductCopyWithAI(
  input: ProductCopyInput,
): Promise<{ ok: boolean; data?: ProductCopySuggestion; error?: string }> {
  if (!getGeminiApiKey()) {
    return missingGeminiKeyResult<ProductCopySuggestion>(
      "Configure Gemini before generating product copy.",
    );
  }

  try {
    const result = await callGeminiText(buildProductCopyPrompt(input));
    if (!result.ok) return { ok: false, error: result.error };

    const jsonText = extractJson(result.text);
    if (!jsonText) return { ok: false, error: "Gemini did not return valid JSON." };

    const parsed = JSON.parse(jsonText) as ProductCopySuggestion;
    return { ok: true, data: parsed };
  } catch {
    return { ok: false, error: "Unable to generate product copy with Gemini." };
  }
}

export async function generateTryOnImageWithAI(
  input: TryOnImageInput,
): Promise<TryOnImageResult> {
  if (!getGeminiApiKey()) {
    return missingGeminiKeyResult(
      "Configure Gemini before enabling AI try-on previews.",
    );
  }

  void getImageModel();
  void buildTryOnPrompt(input.productName);
  void input.productImageUrl;
  void input.userImage;

  return {
    ok: false,
    error: "Gemini image editing is not enabled in this foundation yet.",
    message:
      "The route is ready for validation and privacy handling, but paid image editing should be implemented after product approval.",
  };
}
