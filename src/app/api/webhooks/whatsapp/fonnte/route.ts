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
  "Draft produk Mountain Rose berhasil dibuat.",
  "Produk belum bisa dibuat.",
  "Produk belum bisa diupdate.",
  "Draft produk",
  "Produk ",
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
    detail: result.ok ? "Balasan berhasil dikirim ke Fonnte." : result.error,
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
      "Endpoint webhook aktif. Browser memakai GET, sedangkan Fonnte harus mengirim POST ke URL ini.",
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
      detail: "Webhook secret tidak cocok.",
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
      detail: error instanceof Error ? error.message : "Payload tidak bisa diparse.",
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
    detail: "Webhook masuk ke endpoint Fonnte.",
    payload,
    parsed: {
      sender: inbound.sender,
      text: inbound.text,
      attachmentCount: inbound.attachments.length,
      isSelfMessage: inbound.isSelfMessage,
      isOutboundMessage: inbound.isOutboundMessage,
      contentType: request.headers.get("content-type"),
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
      detail: "Pesan terdeteksi sebagai balasan bot/outgoing message dan diabaikan untuk mencegah loop.",
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

  if (!isWhatsAppAiCmsEnabled()) {
    await logWhatsAppWebhookDebug({
      provider: "fonnte",
      stage: "feature_disabled",
      status: "warning",
      sender: inbound.sender,
      command: command.action,
      detail: "WHATSAPP_AI_CMS_ENABLED masih false.",
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
      detail: "Nomor pengirim tidak ada di ADMIN_WHATSAPP_NUMBERS.",
      payload,
    });
    return jsonResponse({ ok: false, error: "Sender is not allowlisted." }, 403);
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
          ? "Command HELP diproses."
          : "Command tidak dikenal, help message dikirim.",
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
        detail: parsed.error || "AI parser belum siap.",
        payload,
        parsed,
      });
      await reply(
        inbound.sender,
        `Produk belum bisa dibuat. ${parsed.error || "AI parser belum siap."}`,
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
        detail: created.error || "Cek konfigurasi Supabase.",
        payload,
        parsed: {
          parsedProduct: parsed.data,
          createResult: created,
        },
      });
      await reply(
        inbound.sender,
        `Draft produk belum berhasil dibuat. ${created.error || "Cek konfigurasi Supabase."}`,
      );
      return jsonResponse({ ok: false, action: command.action, error: created.error });
    }

    await reply(
      inbound.sender,
      [
        "Draft produk Mountain Rose berhasil dibuat.",
        "",
        `Nama: ${parsed.data.name || "-"}`,
        `Slug: ${created.data.slug}`,
        `Kategori: ${parsed.data.category || "-"}`,
        `Harga: ${parsed.data.price ?? parsed.data.priceAmount ?? "-"}`,
        created.data.imageUploads ? `Gambar terunggah: ${created.data.imageUploads}` : "",
        "",
        "Review di /admin/products sebelum publish.",
        `Jika sudah disetujui, kirim: PUBLISH_PRODUCT ${created.data.slug}`,
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
      detail: `Draft produk ${created.data.slug} berhasil dibuat.`,
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
        detail: "Slug produk belum diberikan.",
        payload,
      });
      await reply(inbound.sender, "Gunakan format: PUBLISH_PRODUCT slug-produk");
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
        ? `Produk ${command.arg} berhasil dipublish.`
        : published.error || "Cek /admin/products.",
      payload,
      parsed: published,
    });
    await reply(
      inbound.sender,
      published.ok
        ? `Produk ${command.arg} berhasil dipublish setelah konfirmasi owner.`
        : `Produk belum bisa dipublish. ${published.error || "Cek /admin/products."}`,
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
        detail: "Slug produk belum diberikan.",
        payload,
      });
      await reply(inbound.sender, "Gunakan format: UPDATE_PRODUCT slug-produk");
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
        detail: parsed.error || "AI parser belum siap.",
        payload,
        parsed,
      });
      await reply(
        inbound.sender,
        `Produk belum bisa diupdate. ${parsed.error || "AI parser belum siap."}`,
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
        ? `Draft produk ${command.arg} berhasil diupdate.`
        : updated.error || "Cek /admin/products.",
      payload,
      parsed: {
        parsedProduct: parsed.data,
        updateResult: updated,
      },
    });
    await reply(
      inbound.sender,
      updated.ok
        ? `Draft produk ${command.arg} berhasil diupdate. Review di /admin/products sebelum publish.`
        : `Produk belum bisa diupdate. ${updated.error || "Cek /admin/products."}`,
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
