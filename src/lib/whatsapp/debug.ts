import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type WhatsAppWebhookDebugLog = {
  provider: "fonnte" | "meta";
  stage: string;
  status: "info" | "success" | "warning" | "error";
  sender?: string | null;
  command?: string | null;
  detail?: string | null;
  payload?: unknown;
  parsed?: unknown;
};

export async function logWhatsAppWebhookDebug(entry: WhatsAppWebhookDebugLog) {
  const timestamp = new Date().toISOString();
  const summary = [
    `[whatsapp:${entry.provider}]`,
    entry.status.toUpperCase(),
    entry.stage,
    entry.sender ? `sender=${entry.sender}` : "",
    entry.command ? `command=${entry.command}` : "",
    entry.detail ? `detail=${entry.detail}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (entry.status === "error") {
    console.error(`${timestamp} ${summary}`);
  } else {
    console.log(`${timestamp} ${summary}`);
  }

  const { client } = getSupabaseAdminClient();
  if (!client) return;

  const { error } = await client.from("whatsapp_webhook_logs").insert({
    provider: entry.provider,
    stage: entry.stage,
    status: entry.status,
    sender: entry.sender || null,
    command: entry.command || null,
    detail: entry.detail || null,
    payload: entry.payload ?? null,
    parsed: entry.parsed ?? null,
  });

  if (error) {
    console.error(
      `${timestamp} [whatsapp:${entry.provider}] ERROR debug_log_insert_failed detail=${error.message}`,
    );
  }
}
