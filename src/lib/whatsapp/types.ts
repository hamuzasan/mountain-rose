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
  raw: unknown;
};

export type WhatsAppReplyResult = {
  ok: boolean;
  provider?: "fonnte" | "meta" | "local";
  error?: string;
};
