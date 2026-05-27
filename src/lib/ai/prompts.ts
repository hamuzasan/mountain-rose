import type { GeminiProductParseInput, ProductCopyInput } from "./types";

export function buildProductParsePrompt(input: GeminiProductParseInput) {
  return [
    "You are helping Mountain Rose, a premium genuine cow leather bag brand.",
    "Extract product data from this WhatsApp message.",
    "Return only valid JSON with these fields when available:",
    "name, slug, price, category, shortDescription, description, leatherType, color, size, isFeatured, isAvailable, whatsAppMessage.",
    "Use a refined Indonesian boutique tone. Do not invent unsupported facts.",
    "",
    "Message:",
    input.rawText,
  ].join("\n");
}

export function buildProductCopyPrompt(input: ProductCopyInput) {
  return [
    "Write refined Indonesian product copy for Mountain Rose.",
    "Brand voice: elegant, calm, premium, trustworthy, mature.",
    "Avoid hype, cheap discount language, slang, and marketplace wording.",
    "Return JSON with shortDescription, description, and whatsAppMessage.",
    "",
    `Name: ${input.name || ""}`,
    `Category: ${input.category || ""}`,
    `Leather type: ${input.leatherType || ""}`,
    `Color: ${input.color || ""}`,
    `Size: ${input.size || ""}`,
    `Notes: ${input.notes || ""}`,
  ].join("\n");
}

export function buildTryOnPrompt(productName?: string) {
  return [
    "Create a tasteful fashion preview for Mountain Rose.",
    `Place the selected genuine cow leather bag${productName ? ` (${productName})` : ""} naturally with the person in the uploaded photo.`,
    "Keep the result elegant, warm, mature, and realistic.",
    "Do not make the rose theme childish, neon, or bright pink.",
    "Preserve the person's identity and avoid changing facial features.",
  ].join("\n");
}
