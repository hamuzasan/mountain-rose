import "server-only";

import { normalizeWhatsAppNumber } from "./admin";
import type { InboundWhatsAppMessage, WhatsAppAttachment, WhatsAppReplyResult } from "./types";

function findBooleanValue(input: unknown, keys: string[]): boolean | null {
  if (!input || typeof input !== "object") return null;
  const record = input as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (["true", "1", "yes"].includes(normalized)) return true;
      if (["false", "0", "no"].includes(normalized)) return false;
    }
  }

  return null;
}

function firstStringValue(input: unknown, keys: string[]): string {
  if (!input || typeof input !== "object") return "";
  const record = input as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
  }

  return "";
}

function collectAttachments(input: unknown): WhatsAppAttachment[] {
  if (!input || typeof input !== "object") return [];
  const record = input as Record<string, unknown>;
  const candidates = [
    record.attachments,
    record.files,
    record.media,
    record.image,
    (record.data as Record<string, unknown> | undefined)?.attachments,
    (record.data as Record<string, unknown> | undefined)?.files,
    (record.data as Record<string, unknown> | undefined)?.media,
    (record.data as Record<string, unknown> | undefined)?.image,
  ];

  return candidates.flatMap((candidate) => {
    if (!candidate) return [];
    const values = Array.isArray(candidate) ? candidate : [candidate];
    return values.flatMap((item) => {
      if (typeof item === "string") return [{ url: item }];
      if (!item || typeof item !== "object") return [];

      const source = item as Record<string, unknown>;
      const url = firstStringValue(source, ["url", "link", "file", "mediaUrl"]);
      if (!url) return [];

      return [
        {
          url,
          mimeType: firstStringValue(source, ["mimeType", "mimetype", "type"]),
          fileName: firstStringValue(source, ["fileName", "filename", "name"]),
          caption: firstStringValue(source, ["caption"]),
        },
      ];
    });
  });
}

export function parseFonnteWebhookPayload(payload: unknown): InboundWhatsAppMessage {
  const data =
    payload && typeof payload === "object"
      ? ((payload as Record<string, unknown>).data as Record<string, unknown> | undefined)
      : undefined;

  const sender = normalizeWhatsAppNumber(
    firstStringValue(payload, ["sender", "from", "number", "phone"]) ||
      firstStringValue(data, ["sender", "from", "number", "phone"]),
  );
  const text =
    firstStringValue(payload, ["message", "text", "body", "caption"]) ||
    firstStringValue(data, ["message", "text", "body", "caption"]);

  const selfFlag =
    findBooleanValue(payload, [
      "isFromMe",
      "fromMe",
      "self",
      "owner",
      "isOwner",
      "from_self",
    ]) ??
    findBooleanValue(data, [
      "isFromMe",
      "fromMe",
      "self",
      "owner",
      "isOwner",
      "from_self",
    ]);

  const outboundFlag =
    findBooleanValue(payload, [
      "isOutbound",
      "outbound",
      "isOutgoing",
      "outgoing",
      "sent",
      "sentByMe",
    ]) ??
    findBooleanValue(data, [
      "isOutbound",
      "outbound",
      "isOutgoing",
      "outgoing",
      "sent",
      "sentByMe",
    ]);

  return {
    sender,
    text,
    attachments: collectAttachments(payload),
    isSelfMessage: Boolean(selfFlag),
    isOutboundMessage: Boolean(outboundFlag),
    raw: payload,
  };
}

export async function sendFonnteReply(
  target: string,
  message: string,
): Promise<WhatsAppReplyResult> {
  const token = process.env.FONNTE_TOKEN;
  const normalizedTarget = normalizeWhatsAppNumber(target);

  if (!token || !normalizedTarget) {
    return {
      ok: false,
      provider: "fonnte",
      error: "Fonnte token or target number is missing.",
    };
  }

  const formData = new FormData();
  formData.append("target", normalizedTarget);
  formData.append("message", message);

  try {
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: formData,
    });

    if (!response.ok) {
      return {
        ok: false,
        provider: "fonnte",
        error: `Fonnte replied with ${response.status}.`,
      };
    }

    return { ok: true, provider: "fonnte" };
  } catch {
    return {
      ok: false,
      provider: "fonnte",
      error: "Unable to send Fonnte reply.",
    };
  }
}

export function verifyFonnteWebhookSecret(request: Request) {
  const expected = process.env.FONNTE_WEBHOOK_SECRET;
  if (!expected) return true;

  const provided =
    request.headers.get("x-fonnte-secret") ||
    request.headers.get("x-webhook-secret") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  return provided === expected;
}
