import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  const expectedToken = process.env.META_WHATSAPP_VERIFY_TOKEN;

  if (mode === "subscribe" && token && token === expectedToken && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json(
    { ok: false, error: "Meta WhatsApp verification failed." },
    { status: 403 },
  );
}

export async function POST(request: NextRequest) {
  const isConfigured = Boolean(
    process.env.META_WHATSAPP_ACCESS_TOKEN &&
      process.env.META_WHATSAPP_PHONE_NUMBER_ID,
  );

  let payload: unknown = null;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed JSON payload." }, { status: 400 });
  }

  void payload;

  return NextResponse.json({
    ok: true,
    configured: isConfigured,
    message:
      "Meta WhatsApp webhook foundation is active. Full production message handling is intentionally deferred.",
  });
}
