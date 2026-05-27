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

function normalizeProductDraft(input: Record<string, unknown>): AiProductDraft {
  return {
    name: typeof input.name === "string" ? input.name : undefined,
    slug: typeof input.slug === "string" ? input.slug : undefined,
    price: typeof input.price === "number" ? input.price : undefined,
    category: typeof input.category === "string" ? input.category : undefined,
    shortDescription:
      typeof input.shortDescription === "string" ? input.shortDescription : undefined,
    description: typeof input.description === "string" ? input.description : undefined,
    leatherType: typeof input.leatherType === "string" ? input.leatherType : undefined,
    color: typeof input.color === "string" ? input.color : undefined,
    size: typeof input.size === "string" ? input.size : undefined,
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
    return missingGeminiKeyResult<AiProductDraft>(
      "Configure Gemini before enabling WhatsApp AI CMS parsing.",
    );
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
