import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/admin/auth";
import { getWhatsAppDebugState } from "@/lib/admin/whatsapp-debug";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Debug WhatsApp CMS",
  description: "Monitor the Mountain Rose Fonnte webhook and AI CMS.",
};

const wibFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Jakarta",
  dateStyle: "short",
  timeStyle: "medium",
});

function StatusBadge({
  ok,
  label,
}: {
  ok: boolean;
  label: string;
}) {
  return (
    <div className="rounded-soft border border-espresso/10 bg-warmIvory px-4 py-3">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-mutedBrown">
        {label}
      </p>
      <p className={`mt-2 text-sm font-semibold ${ok ? "text-espresso" : "text-deepRose"}`}>
        {ok ? "Ready" : "Missing"}
      </p>
    </div>
  );
}

export default async function AdminWhatsAppDebugPage() {
  await requireAdmin();
  const { logs, env, error, renderedAt, deploymentId } = await getWhatsAppDebugState();
  const latestLogAt = logs[0]?.created_at ?? null;

  return (
    <div className="bg-warmIvory px-5 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 border-b border-espresso/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mutedRose">
              Mountain Rose CMS
            </p>
            <h1 className="mt-3 font-heading text-4xl text-charcoal sm:text-5xl">
              Debug WhatsApp
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-mutedBrown">
              This page helps confirm whether Fonnte webhooks are reaching the server,
              whether the sender number is detected, whether commands are parsed, and
              whether replies fail to send.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/products"
              prefetch={false}
              className="inline-flex min-h-11 items-center rounded-full border border-espresso/15 bg-bone px-5 text-sm font-semibold text-espresso"
            >
              Back to Products
            </Link>
          </div>
        </div>

        <section className="mt-8 border border-espresso/10 bg-bone p-5 shadow-soft">
          <h2 className="font-heading text-2xl text-charcoal">Configuration Status</h2>
          <p className="mt-2 text-sm leading-6 text-mutedBrown">
            This does not show secret values. It only checks whether important environment
            variables are available on the server.
          </p>
          <div className="mt-4 rounded-soft border border-espresso/10 bg-warmIvory px-4 py-3 text-xs uppercase tracking-[0.12em] text-mutedBrown">
            Rendered at: {wibFormatter.format(new Date(renderedAt))} WIB - Deployment: {deploymentId}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatusBadge ok={env.whatsappAiCmsEnabled} label="WHATSAPP_AI_CMS_ENABLED" />
            <StatusBadge ok={env.adminWhatsAppNumbers} label="ADMIN_WHATSAPP_NUMBERS" />
            <StatusBadge ok={env.fonnteToken} label="FONNTE_TOKEN" />
            <StatusBadge ok={env.fonnteWebhookSecret} label="FONNTE_WEBHOOK_SECRET" />
            <StatusBadge ok={env.geminiApiKey} label="GEMINI_API_KEY" />
            <StatusBadge ok={env.supabaseUrl} label="NEXT_PUBLIC_SUPABASE_URL" />
            <StatusBadge ok={env.supabaseServiceRoleKey} label="SUPABASE_SERVICE_ROLE_KEY" />
          </div>
        </section>

        <section className="mt-8 border border-espresso/10 bg-bone p-5 shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-2xl text-charcoal">Latest 50 Logs</h2>
              <p className="mt-2 text-sm leading-6 text-mutedBrown">
                After sending <span className="font-semibold text-espresso">HELP</span> to
                the Fonnte device number, refresh this page. If the log is empty, the webhook
                has not reached Vercel yet.
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.12em] text-mutedBrown">
                Log order: newest to oldest.
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.12em] text-mutedBrown">
                Latest log: {latestLogAt ? `${wibFormatter.format(new Date(latestLogAt))} WIB` : "none yet"}
              </p>
            </div>
            <Link
              href="/admin/whatsapp-debug"
              prefetch={false}
              className="inline-flex min-h-11 items-center rounded-full bg-espresso px-5 text-sm font-semibold text-warmIvory"
            >
              Refresh Logs
            </Link>
          </div>

          {error ? (
            <div className="mt-5 rounded-soft border border-mutedRose/30 bg-dustyRose/10 px-4 py-3 text-sm text-deepRose">
              {error}
            </div>
          ) : null}

          {!error && latestLogAt && new Date(latestLogAt).getTime() < new Date(renderedAt).getTime() - 60_000 ? (
            <div className="mt-5 rounded-soft border border-antiqueGold/30 bg-antiqueGold/10 px-4 py-3 text-sm text-espresso">
              No new webhook request has been recorded after this deployment/refresh. If you
              just sent <span className="font-semibold">HELP</span> but the log still stops at
              an older time, Fonnte has not sent a new request to the Vercel endpoint yet.
            </div>
          ) : null}

          <div className="mt-5 overflow-hidden border border-espresso/10">
            {logs.length ? (
              <div className="divide-y divide-espresso/10">
                {logs.map((log) => (
                  <details key={log.id} className="bg-warmIvory p-4">
                    <summary className="cursor-pointer list-none">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-espresso/10 bg-bone px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-mutedBrown">
                              {log.provider}
                            </span>
                            <span
                              className={`rounded-full px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] ${
                                log.status === "success"
                                  ? "bg-antiqueGold/15 text-espresso"
                                  : log.status === "error"
                                    ? "bg-dustyRose/20 text-deepRose"
                                    : "bg-bone text-mutedBrown"
                              }`}
                            >
                              {log.status}
                            </span>
                            <span className="text-sm font-semibold text-espresso">
                              {log.stage}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-mutedBrown">
                            {log.detail || "No additional detail."}
                          </p>
                          <p className="mt-2 text-xs uppercase tracking-[0.12em] text-mutedBrown">
                            Sender: {log.sender || "-"} {log.command ? `- Command: ${log.command}` : ""}
                          </p>
                        </div>
                        <p className="shrink-0 text-xs uppercase tracking-[0.12em] text-mutedBrown">
                          {wibFormatter.format(new Date(log.created_at))} WIB
                        </p>
                      </div>
                    </summary>
                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-mutedBrown">
                          Raw Payload
                        </p>
                        <pre className="mt-2 overflow-x-auto rounded-soft border border-espresso/10 bg-bone p-3 text-xs leading-5 text-espresso">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-mutedBrown">
                          Parsed Data
                        </p>
                        <pre className="mt-2 overflow-x-auto rounded-soft border border-espresso/10 bg-bone p-3 text-xs leading-5 text-espresso">
                          {JSON.stringify(log.parsed, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            ) : (
              <div className="p-6 text-sm leading-7 text-mutedBrown">
                No webhook logs yet. Make sure the Fonnte webhook points to
                <span className="mx-1 font-semibold text-espresso">
                  /api/webhooks/whatsapp/fonnte
                </span>
                on Vercel, then send a message from the admin number.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
