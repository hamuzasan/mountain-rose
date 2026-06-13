import type { SiteSettings } from "@/types/site";

function cleanContacts(values: Array<string | null | undefined>) {
  return [...new Set(values.map((value) => value?.trim()).filter(Boolean) as string[])];
}

export function formatPhoneDisplay(number: string) {
  const cleaned = number.replace(/[^\d]/g, "");
  if (!cleaned) return number;
  if (cleaned.startsWith("0")) return cleaned;
  return `+${cleaned}`;
}

export function getOrderedWhatsAppContacts(
  siteSettings: Pick<SiteSettings, "whatsappNumber" | "additionalWhatsAppNumbers">,
) {
  return cleanContacts([...(siteSettings.additionalWhatsAppNumbers || []), siteSettings.whatsappNumber]);
}

export function getOrderedEmailContacts(
  siteSettings: Pick<SiteSettings, "email" | "additionalEmails">,
) {
  return cleanContacts([...(siteSettings.additionalEmails || []), siteSettings.email]);
}

export function getInstagramHandle(instagramUrl: string) {
  const value = instagramUrl.trim();
  if (!value) return "@mountainrose.bag";

  const normalized = value
    .replace(/^https?:\/\/(www\.)?/i, "")
    .replace(/^www\./i, "");

  const withoutDomain = normalized.toLowerCase().startsWith("instagram.com/")
    ? normalized.slice("instagram.com/".length)
    : normalized;

  const handle = withoutDomain.split(/[/?#]/)[0].trim().replace(/^@/, "");
  return handle ? `@${handle}` : "@mountainrose.bag";
}
