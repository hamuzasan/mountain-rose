import "server-only";

import type { WhatsAppReplyResult } from "./types";

export function isMetaWhatsAppConfigured() {
  return Boolean(
    process.env.META_WHATSAPP_ACCESS_TOKEN &&
      process.env.META_WHATSAPP_PHONE_NUMBER_ID,
  );
}

export async function sendMetaWhatsAppReply(): Promise<WhatsAppReplyResult> {
  if (!isMetaWhatsAppConfigured()) {
    return {
      ok: false,
      provider: "meta",
      error: "Meta WhatsApp Cloud API is not configured yet.",
    };
  }

  return {
    ok: false,
    provider: "meta",
    error: "Meta reply helper is reserved for future production implementation.",
  };
}
