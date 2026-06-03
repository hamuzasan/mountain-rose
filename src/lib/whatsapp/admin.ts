import "server-only";

export function normalizeWhatsAppNumber(value?: string | null) {
  return (value || "").replace(/[^\d]/g, "");
}

export function getAdminWhatsAppNumbers() {
  return (process.env.ADMIN_WHATSAPP_NUMBERS || "")
    .split(",")
    .map((n) => normalizeWhatsAppNumber(n))
    .filter(Boolean);
}

export function isAdminWhatsAppNumber(sender?: string | null) {
  const normalizedSender = normalizeWhatsAppNumber(sender);
  if (!normalizedSender) return false;
  return getAdminWhatsAppNumbers().includes(normalizedSender);
}

export function isWhatsAppAiCmsEnabled() {
  return process.env.WHATSAPP_AI_CMS_ENABLED === "true";
}

export function createHelpMessage() {
  return [
    "Mountain Rose AI CMS commands:",
    "",
    "HELP",
    "ADD_PRODUCT",
    "PUBLISH_PRODUCT product-slug",
    "UPDATE_PRODUCT product-slug",
    "",
    "AI products are created as drafts first. Review them in /admin/products before publishing.",
    "If GEMINI_API_KEY is not active yet, use labeled fields such as Name:, Price:, Category:, and Short description:.",
  ].join("\n");
}

export function createSafeReplyMessage(message: string) {
  return message.trim().slice(0, 3000);
}
