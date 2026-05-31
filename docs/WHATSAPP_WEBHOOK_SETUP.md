# WhatsApp Webhook Setup

Mountain Rose supports two future WhatsApp automation paths. Use Fonnte for MVP testing and Meta WhatsApp Cloud API for a more official production setup.

## A. Fonnte MVP Setup

1. Create a Fonnte account.
2. Connect the owner/admin WhatsApp device.
3. Copy the device token.
4. Set the webhook URL to:

```text
https://your-domain.com/api/webhooks/whatsapp/fonnte
```

5. Use a public HTTPS URL. Local testing should use a secure tunnel.
6. Enable autoread if desired.
7. Enable attachment support if product photos will be sent.
8. Set these environment variables:

```env
WHATSAPP_PROVIDER=fonnte
FONNTE_TOKEN=
FONNTE_WEBHOOK_SECRET=
ADMIN_WHATSAPP_NUMBERS=6280000000000
WHATSAPP_AI_CMS_ENABLED=false
```

9. Test with `WHATSAPP_AI_CMS_ENABLED=false` first to confirm the endpoint responds safely.
10. Set `WHATSAPP_AI_CMS_ENABLED=true` only after admin number allowlist, Supabase service role key, and Fonnte token are configured.
11. Gemini is recommended for free-form product messages, but labeled field messages can still create Supabase product drafts before Gemini is enabled.
12. Untuk debugging, buka `/admin/whatsapp-debug` setelah mengirim pesan. Halaman ini akan menunjukkan apakah webhook masuk, nomor pengirim terbaca, command terdeteksi, dan apakah balasan Fonnte berhasil dikirim.

### Expected Fonnte Payload

Fonnte payloads may vary by account and webhook setting. The endpoint uses a tolerant parser and looks for common fields:

- Sender: `sender`, `from`, `number`, `phone`, or `data.sender`
- Message text: `message`, `text`, `body`, `caption`, or `data.message`
- Attachments: `attachments`, `files`, `media`, `image`, or similar nested values

Do not assume public users are trusted. The endpoint rejects non-admin senders.

### Supabase CMS Target

The Fonnte webhook writes to Supabase:

- `ADD_PRODUCT` creates or updates a draft row in `products`.
- Attachments are uploaded to Supabase Storage bucket `product-images` when Fonnte provides reachable image URLs.
- `UPDATE_PRODUCT slug-produk` updates existing product fields.
- `PUBLISH_PRODUCT slug-produk` changes product status to `published`.
- The owner should review all AI-created drafts in `/admin/products`.
- Debug event terbaru dapat dilihat di `/admin/whatsapp-debug`.

## B. Meta WhatsApp Cloud API Production Setup

1. Create a Meta developer app.
2. Configure WhatsApp Business Platform.
3. Configure the production phone number.
4. Create a webhook endpoint:

```text
https://your-domain.com/api/webhooks/whatsapp/meta
```

5. Set a verify token and save it in:

```env
META_WHATSAPP_VERIFY_TOKEN=
```

6. Subscribe to the messages webhook.
7. Set access token and phone number ID:

```env
META_WHATSAPP_ACCESS_TOKEN=
META_WHATSAPP_PHONE_NUMBER_ID=
META_WHATSAPP_APP_SECRET=
```

8. Test inbound message events.
9. Use approved message templates if outbound replies are needed outside the allowed customer service session window.

The current Meta endpoint is intentionally a placeholder foundation. Complete signature verification and production message handling before using it for live automation.
