import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export type WhatsAppDebugLog = {
  id: string;
  provider: string;
  stage: string;
  status: "info" | "success" | "warning" | "error";
  sender: string | null;
  command: string | null;
  detail: string | null;
  payload: unknown;
  parsed: unknown;
  created_at: string;
};

function getEnvStatus() {
  return {
    whatsappAiCmsEnabled: process.env.WHATSAPP_AI_CMS_ENABLED === "true",
    adminWhatsAppNumbers: Boolean(process.env.ADMIN_WHATSAPP_NUMBERS),
    fonnteToken: Boolean(process.env.FONNTE_TOKEN),
    fonnteWebhookSecret: Boolean(process.env.FONNTE_WEBHOOK_SECRET),
    geminiApiKey: Boolean(process.env.GEMINI_API_KEY),
    supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  };
}

export async function getWhatsAppDebugState() {
  const env = getEnvStatus();
  const renderedAt = new Date().toISOString();
  const deploymentId =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.NODE_ENV ||
    "unknown";
  const { client, error } = getSupabaseAdminClient();

  if (!client) {
    return {
      logs: [] as WhatsAppDebugLog[],
      env,
      renderedAt,
      deploymentId,
      error: error || "Supabase admin client is not ready.",
    };
  }

  const { data, error: logsError } = await client
    .from("whatsapp_webhook_logs")
    .select("id,provider,stage,status,sender,command,detail,payload,parsed,created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return {
    logs: (data || []) as WhatsAppDebugLog[],
    env,
    renderedAt,
    deploymentId,
    error: logsError?.message,
  };
}
