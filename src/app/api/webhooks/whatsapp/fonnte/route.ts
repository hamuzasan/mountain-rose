import { NextResponse } from "next/server";

import { parseProductMessageWithAI } from "@/lib/ai/gemini";
import {
  createHelpMessage,
  createSafeReplyMessage,
  isAdminWhatsAppNumber,
  isWhatsAppAiCmsEnabled,
} from "@/lib/whatsapp/admin";
import {
  parseFonnteWebhookPayload,
  sendFonnteReply,
  verifyFonnteWebhookSecret,
} from "@/lib/whatsapp/fonnte";
import { logWhatsAppWebhookDebug } from "@/lib/whatsapp/debug";
import {
  createDraftProductFromAi,
  publishDraftProductBySlug,
  updateDraftProductFromAi,
} from "@/lib/supabase/productMutations";
import type { AiCmsAction } from "@/types/aiCms";

export const runtime = "nodejs";

const BOT_REPLY_PREFIXES = [
  "Mountain Rose AI CMS commands:",
  "Mountain Rose product draft was created.",
  "Product could not be created.",
  "Product could not be updated.",
  "Product draft",
  "Product ",
];

function getCommand(text: string): { action: AiCmsAction; arg?: string } {
  const [firstLine = ""] = text.trim().split(/\r?\n/);
  const [command = "", arg = ""] = firstLine.trim().split(/\s+/, 2);
  const action = command.toUpperCase();

  if (action === "HELP") return { action: "HELP" };
  if (action === "ADD_PRODUCT") return { action: "ADD_PRODUCT" };
  if (action === "UPDATE_PRODUCT") return { action: "UPDATE_PRODUCT", arg };
  if (action === "PUBLISH_PRODUCT") return { action: "PUBLISH_PRODUCT", arg };
  return { action: "UNKNOWN" };
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status });
}

async function reply(sender: string, message: string) {
  const result = await sendFonnteReply(sender, createSafeReplyMessage(message));
  await logWhatsAppWebhookDebug({
    provider: "fonnte",
    stage: "reply_sent",
    status: result.ok ? "success" : "error",
    sender,
    detail: result.ok ? "Reply was sent to Fonnte." : result.error,
    parsed: result,
  });
}

async function parseRequestPayload(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await request.formData();
    return Object.fromEntries(formData.entries());
  }

  const rawText = await request.text();
  if (!rawText.trim()) {
    return {};
  }

  try {
    return JSON.parse(rawText);
  } catch {
    return { rawText };
  }
}

export async function GET() {
  return jsonResponse({
    ok: true,
    provider: "fonnte",
    endpoint: "whatsapp-webhook",
    method: "POST",
    message:
      "Webhook endpoint is active. Browsers use GET, while Fonnte must send POST to this URL.",
    checks: {
      whatsappAiCmsEnabled: process.env.WHATSAPP_AI_CMS_ENABLED === "true",
      adminWhatsAppNumbersConfigured: Boolean(process.env.ADMIN_WHATSAPP_NUMBERS),
      fonnteTokenConfigured: Boolean(process.env.FONNTE_TOKEN),
      webhookSecretConfigured: Boolean(process.env.FONNTE_WEBHOOK_SECRET),
    },
  });
}

export async function POST(request: Request) {
  if (!verifyFonnteWebhookSecret(request)) {
    await logWhatsAppWebhookDebug({
      provider: "fonnte",
      stage: "invalid_secret",
      status: "error",
      detail: "Webhook secret does not match.",
    });
    return jsonResponse({ ok: false, error: "Invalid webhook secret." }, 401);
  }

  let payload: unknown;
  try {
    payload = await parseRequestPayload(request);
  } catch (error) {
    await logWhatsAppWebhookDebug({
      provider: "fonnte",
      stage: "malformed_payload",
      status: "error",
      detail: error instanceof Error ? error.message : "Payload could not be parsed.",
    });
    return jsonResponse({ ok: false, error: "Malformed JSON payload." }, 400);
  }

  const inbound = parseFonnteWebhookPayload(payload);
  const command = getCommand(inbound.text);

  await logWhatsAppWebhookDebug({
    provider: "fonnte",
    stage: "request_received",
    status: "info",
    sender: inbound.sender,
    command: command.action,
    detail: "Webhook reached the Fonnte endpoint.",
    payload,
    parsed: {
      sender: inbound.sender,
      text: inbound.text,
      eventType: inbound.eventType,
      attachmentCount: inbound.attachments.length,
      isSelfMessage: inbound.isSelfMessage,
      isOutboundMessage: inbound.isOutboundMessage,
      contentType: request.headers.get("content-type"),
      payloadKeys:
        payload && typeof payload === "object" ? Object.keys(payload as Record<string, unknown>) : [],
    },
  });

  const looksLikeBotReply = BOT_REPLY_PREFIXES.some((prefix) =>
    inbound.text.trim().startsWith(prefix),
  );

  if (inbound.isSelfMessage || inbound.isOutboundMessage || looksLikeBotReply) {
    await logWhatsAppWebhookDebug({
      provider: "fonnte",
      stage: "self_message_ignored",
      status: "warning",
      sender: inbound.sender,
      command: command.action,
      detail: "Message was detected as a bot reply/outgoing message and ignored to prevent loops.",
      payload,
      parsed: {
        isSelfMessage: inbound.isSelfMessage,
        isOutboundMessage: inbound.isOutboundMessage,
        looksLikeBotReply,
        text: inbound.text,
      },
    });
    return jsonResponse({ ok: true, ignored: "self_message" });
  }

  if (inbound.eventType !== "message" || (!inbound.sender && !inbound.text)) {
    await logWhatsAppWebhookDebug({
      provider: "fonnte",
      stage: "non_message_event_ignored",
      status: "warning",
      sender: inbound.sender,
      command: command.action,
      detail:
        inbound.eventType === "message_status"
          ? "Message status payload was received and ignored."
          : inbound.eventType === "device_status"
            ? "Device status payload was received and ignored."
            : "Payload does not look like an inbound chat message, so it was ignored.",
      payload,
      parsed: {
        eventType: inbound.eventType,
        sender: inbound.sender,
        text: inbound.text,
      },
    });
    return jsonResponse({ ok: true, ignored: inbound.eventType || "unknown" });
  }

  if (!isWhatsAppAiCmsEnabled()) {
    await logWhatsAppWebhookDebug({
      provider: "fonnte",
      stage: "feature_disabled",
      status: "warning",
      sender: inbound.sender,
      command: command.action,
      detail: "WHATSAPP_AI_CMS_ENABLED is still false.",
      payload,
    });
    return jsonResponse({
      ok: false,
      message: "WhatsApp AI CMS is disabled.",
    });
  }

  if (!isAdminWhatsAppNumber(inbound.sender)) {
    await logWhatsAppWebhookDebug({
      provider: "fonnte",
      stage: "sender_rejected",
      status: "warning",
      sender: inbound.sender,
      command: command.action,
      detail: "Sender number is not listed in ADMIN_WHATSAPP_NUMBERS.",
      payload,
    });
    return jsonResponse({ ok: true, ignored: "sender_not_allowlisted" });
  }

  if (command.action === "HELP" || command.action === "UNKNOWN") {
    await reply(inbound.sender, createHelpMessage());
    await logWhatsAppWebhookDebug({
      provider: "fonnte",
      stage: command.action === "HELP" ? "help_processed" : "unknown_command",
      status: "success",
      sender: inbound.sender,
      command: command.action,
      detail:
        command.action === "HELP"
          ? "HELP command was processed."
          : "Unknown command, help message was sent.",
      payload,
    });
    return jsonResponse({ ok: true, action: command.action });
  }

  if (command.action === "ADD_PRODUCT") {
    const imageUrls = inbound.attachments
      .map((attachment) => attachment.url)
      .filter((url): url is string => Boolean(url));

    const parsed = await parseProductMessageWithAI({
      rawText: inbound.text,
      sender: inbound.sender,
      imageUrls,
    });

    if (!parsed.ok || !parsed.data) {
      await logWhatsAppWebhookDebug({
        provider: "fonnte",
        stage: "add_product_parse_failed",
        status: "error",
        sender: inbound.sender,
        command: command.action,
        detail: parsed.error || "AI parser is not ready.",
        payload,
        parsed,
      });
      await reply(
        inbound.sender,
        `Product could not be created. ${parsed.error || "AI parser is not ready."}`,
      );
      return jsonResponse({ ok: false, action: command.action, error: parsed.error });
    }

    const created = await createDraftProductFromAi(parsed.data);
    if (!created.ok || !created.data) {
      await logWhatsAppWebhookDebug({
        provider: "fonnte",
        stage: "add_product_create_failed",
        status: "error",
        sender: inbound.sender,
        command: command.action,
        detail: created.error || "Check the Supabase configuration.",
        payload,
        parsed: {
          parsedProduct: parsed.data,
          createResult: created,
        },
      });
      await reply(
        inbound.sender,
        `Product draft could not be created. ${created.error || "Check the Supabase configuration."}`,
      );
      return jsonResponse({ ok: false, action: command.action, error: created.error });
    }

    await reply(
      inbound.sender,
      [
        "Mountain Rose product draft was created.",
        "",
        `Name: ${parsed.data.name || "-"}`,
        `Slug: ${created.data.slug}`,
        `Category: ${parsed.data.category || "-"}`,
        `Price: ${parsed.data.price ?? parsed.data.priceAmount ?? "-"}`,
        created.data.imageUploads ? `Uploaded images: ${created.data.imageUploads}` : "",
        "",
        "Review it in /admin/products before publishing.",
        `When approved, send: PUBLISH_PRODUCT ${created.data.slug}`,
      ]
        .filter(Boolean)
        .join("\n"),
    );

    await logWhatsAppWebhookDebug({
      provider: "fonnte",
      stage: "add_product_created",
      status: "success",
      sender: inbound.sender,
      command: command.action,
      detail: `Product draft ${created.data.slug} was created.`,
      payload,
      parsed: {
        parsedProduct: parsed.data,
        draft: created.data,
      },
    });

    return jsonResponse({
      ok: true,
      action: command.action,
      draft: created.data,
    });
  }

  if (command.action === "PUBLISH_PRODUCT") {
    if (!command.arg) {
      await logWhatsAppWebhookDebug({
        provider: "fonnte",
        stage: "publish_missing_slug",
        status: "warning",
        sender: inbound.sender,
        command: command.action,
        detail: "Product slug was not provided.",
        payload,
      });
      await reply(inbound.sender, "Use this format: PUBLISH_PRODUCT product-slug");
      return jsonResponse({
        ok: false,
        action: command.action,
        error: "Product slug is missing.",
      });
    }

    const published = await publishDraftProductBySlug(command.arg);
    await logWhatsAppWebhookDebug({
      provider: "fonnte",
      stage: published.ok ? "publish_success" : "publish_failed",
      status: published.ok ? "success" : "error",
      sender: inbound.sender,
      command: command.action,
      detail: published.ok
        ? `Product ${command.arg} was published.`
        : published.error || "Check /admin/products.",
      payload,
      parsed: published,
    });
    await reply(
      inbound.sender,
      published.ok
        ? `Product ${command.arg} was published after owner confirmation.`
        : `Product could not be published. ${published.error || "Check /admin/products."}`,
    );

    return jsonResponse({
      ok: published.ok,
      action: command.action,
      data: published.data,
      error: published.error,
    });
  }

  if (command.action === "UPDATE_PRODUCT") {
    if (!command.arg) {
      await logWhatsAppWebhookDebug({
        provider: "fonnte",
        stage: "update_missing_slug",
        status: "warning",
        sender: inbound.sender,
        command: command.action,
        detail: "Product slug was not provided.",
        payload,
      });
      await reply(inbound.sender, "Use this format: UPDATE_PRODUCT product-slug");
      return jsonResponse({
        ok: false,
        action: command.action,
        error: "Product slug is missing.",
      });
    }

    const imageUrls = inbound.attachments
      .map((attachment) => attachment.url)
      .filter((url): url is string => Boolean(url));

    const parsed = await parseProductMessageWithAI({
      rawText: inbound.text,
      sender: inbound.sender,
      imageUrls,
    });

    if (!parsed.ok || !parsed.data) {
      await logWhatsAppWebhookDebug({
        provider: "fonnte",
        stage: "update_parse_failed",
        status: "error",
        sender: inbound.sender,
        command: command.action,
        detail: parsed.error || "AI parser is not ready.",
        payload,
        parsed,
      });
      await reply(
        inbound.sender,
        `Product could not be updated. ${parsed.error || "AI parser is not ready."}`,
      );
      return jsonResponse({ ok: false, action: command.action, error: parsed.error });
    }

    const updated = await updateDraftProductFromAi(command.arg, parsed.data);
    await logWhatsAppWebhookDebug({
      provider: "fonnte",
      stage: updated.ok ? "update_success" : "update_failed",
      status: updated.ok ? "success" : "error",
      sender: inbound.sender,
      command: command.action,
      detail: updated.ok
        ? `Product draft ${command.arg} was updated.`
        : updated.error || "Check /admin/products.",
      payload,
      parsed: {
        parsedProduct: parsed.data,
        updateResult: updated,
      },
    });
    await reply(
      inbound.sender,
      updated.ok
        ? `Product draft ${command.arg} was updated. Review it in /admin/products before publishing.`
        : `Product could not be updated. ${updated.error || "Check /admin/products."}`,
    );
    return jsonResponse({
      ok: updated.ok,
      action: command.action,
      data: updated.data,
      error: updated.error,
    });
  }

  return jsonResponse({ ok: true });
}
