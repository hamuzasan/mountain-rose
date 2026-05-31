export type WhatsAppAttachment = {
  url?: string;
  mimeType?: string;
  fileName?: string;
  caption?: string;
};

export type InboundWhatsAppMessage = {
  sender: string;
  text: string;
  attachments: WhatsAppAttachment[];
  isSelfMessage?: boolean;
  isOutboundMessage?: boolean;
  eventType?: "message" | "message_status" | "device_status" | "unknown";
  raw: unknown;
};

export type WhatsAppReplyResult = {
  ok: boolean;
  provider?: "fonnte" | "meta" | "local";
  error?: string;
};
