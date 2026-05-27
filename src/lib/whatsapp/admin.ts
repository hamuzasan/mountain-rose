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
    "PUBLISH_PRODUCT slug-produk",
    "UPDATE_PRODUCT slug-produk",
    "",
    "Produk AI dibuat sebagai draft terlebih dahulu. Review di Sanity Studio sebelum publish.",
  ].join("\n");
}

export function createSafeReplyMessage(message: string) {
  return message.trim().slice(0, 3000);
}
