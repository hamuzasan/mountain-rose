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
import {
  createDraftProductFromAi,
  publishDraftProductBySlug,
  updateDraftProductFromAi,
} from "@/sanity/lib/productMutations";
import type { AiCmsAction } from "@/types/aiCms";

export const runtime = "nodejs";

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
  await sendFonnteReply(sender, createSafeReplyMessage(message));
}

export async function POST(request: Request) {
  if (!verifyFonnteWebhookSecret(request)) {
    return jsonResponse({ ok: false, error: "Invalid webhook secret." }, 401);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: "Malformed JSON payload." }, 400);
  }

  const inbound = parseFonnteWebhookPayload(payload);

  if (!isWhatsAppAiCmsEnabled()) {
    return jsonResponse({
      ok: false,
      message: "WhatsApp AI CMS is disabled.",
    });
  }

  if (!isAdminWhatsAppNumber(inbound.sender)) {
    return jsonResponse({ ok: false, error: "Sender is not allowlisted." }, 403);
  }

  const command = getCommand(inbound.text);

  if (command.action === "HELP" || command.action === "UNKNOWN") {
    await reply(inbound.sender, createHelpMessage());
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
      await reply(
        inbound.sender,
        `Produk belum bisa dibuat. ${parsed.error || "AI parser belum siap."}`,
      );
      return jsonResponse({ ok: false, action: command.action, error: parsed.error });
    }

    const created = await createDraftProductFromAi(parsed.data);
    if (!created.ok || !created.data) {
      await reply(
        inbound.sender,
        `Draft produk belum berhasil dibuat. ${created.error || "Cek konfigurasi Sanity."}`,
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
        `Harga: ${parsed.data.price ?? "-"}`,
        "",
        "Review di Sanity Studio sebelum publish.",
        `Jika sudah disetujui, kirim: PUBLISH_PRODUCT ${created.data.slug}`,
      ].join("\n"),
    );

    return jsonResponse({
      ok: true,
      action: command.action,
      draft: created.data,
    });
  }

  if (command.action === "PUBLISH_PRODUCT") {
    if (!command.arg) {
      await reply(inbound.sender, "Gunakan format: PUBLISH_PRODUCT slug-produk");
      return jsonResponse({
        ok: false,
        action: command.action,
        error: "Product slug is missing.",
      });
    }

    const published = await publishDraftProductBySlug(command.arg);
    await reply(
      inbound.sender,
      published.ok
        ? `Produk ${command.arg} berhasil dipublish setelah konfirmasi owner.`
        : `Produk belum bisa dipublish. ${published.error || "Cek Sanity Studio."}`,
    );

    return jsonResponse({
      ok: published.ok,
      action: command.action,
      data: published.data,
      error: published.error,
    });
  }

  if (command.action === "UPDATE_PRODUCT") {
    const updated = await updateDraftProductFromAi();
    await reply(
      inbound.sender,
      "UPDATE_PRODUCT sudah dikenali, tetapi workflow update masih menunggu diff dan konfirmasi manual.",
    );
    return jsonResponse({
      ok: updated.ok,
      action: command.action,
      error: updated.error,
    });
  }

  return jsonResponse({ ok: true });
}
