# Mountain Rose AI Features

This document describes the safe technical foundation for future AI features. The website remains a premium Mountain Rose storefront with Sanity as the source of truth for products, content, and images.

## Planned Feature: Coba Tas Ini

Goal: let a visitor upload a personal photo and preview how a selected Mountain Rose bag may look with them.

Intended flow:

```text
Visitor opens product detail page
Visitor uploads temporary photo
Frontend sends photo + product slug to /api/ai/try-on
Server validates feature flag, file type, and file size
Server fetches product data and product image from Sanity or fallback
Server calls Gemini image editing
Server returns generated preview
Uploaded user photo is not stored permanently by default
```

Privacy rules:

- The feature is disabled by default with `AI_TRY_ON_ENABLED=false`.
- User-uploaded images must be processed server-side only.
- Do not store user photos permanently unless a future explicit privacy policy and consent flow is added.
- Do not log image data, base64 payloads, or personal photo URLs.
- Validate file type and size before any AI call.

## Planned Feature: WhatsApp AI CMS

Goal: let the owner send product text and photos through WhatsApp. A webhook parses the message with Gemini, uploads images to Sanity, and creates a draft product for review.

Intended flow:

```text
Owner sends command to WhatsApp provider
Provider posts webhook to /api/webhooks/whatsapp/fonnte or /api/webhooks/whatsapp/meta
Server checks WHATSAPP_AI_CMS_ENABLED
Server validates sender against ADMIN_WHATSAPP_NUMBERS
Server parses command: HELP, ADD_PRODUCT, UPDATE_PRODUCT, PUBLISH_PRODUCT
For ADD_PRODUCT, server calls Gemini text parser
Server creates or updates a draft product in Sanity
Server replies with a summary and review/publish instruction
Owner reviews content in Sanity Studio
Owner sends explicit PUBLISH_PRODUCT command when ready
```

Rules:

- Public users must never create CMS content.
- Only allowlisted owner/admin numbers may trigger CMS actions.
- AI-created products must be drafts first.
- Publishing requires explicit owner confirmation.
- Sanity remains the source of truth after draft creation.

## Required Environment Variables

```env
GEMINI_API_KEY=
GEMINI_TEXT_MODEL=
GEMINI_IMAGE_MODEL=
SANITY_WRITE_TOKEN=
WHATSAPP_PROVIDER=fonnte
ADMIN_WHATSAPP_NUMBERS=6280000000000
FONNTE_TOKEN=
FONNTE_WEBHOOK_SECRET=
META_WHATSAPP_VERIFY_TOKEN=
META_WHATSAPP_ACCESS_TOKEN=
META_WHATSAPP_PHONE_NUMBER_ID=
META_WHATSAPP_APP_SECRET=
AI_TRY_ON_ENABLED=false
WHATSAPP_AI_CMS_ENABLED=false
```

All keys and tokens are server-only. Do not prefix them with `NEXT_PUBLIC_`.

## Gemini API Usage

Gemini is planned for:

- Parsing unstructured WhatsApp product messages into structured product fields.
- Suggesting refined product copy in the Mountain Rose tone.
- Editing visitor photos for the future "Coba Tas Ini" preview.

The current foundation returns safe errors when `GEMINI_API_KEY` is missing and keeps paid image generation disabled behind feature flags.

## Sanity Write Token Usage

`SANITY_WRITE_TOKEN` is used only by server-side mutation helpers. It should have the minimum permissions required to create drafts, upload assets, and publish reviewed documents.

Do not import Sanity write helpers into client components.

## WhatsApp Provider Options

Fonnte is the MVP path because it is simpler for Indonesian WhatsApp automation and device-based testing.

Meta WhatsApp Cloud API is the production-grade path for official WhatsApp Business Platform usage. It requires app setup, webhook verification, access tokens, phone number ID, and production review depending on use case.

## Limitations And Risks

- AI parsing can misunderstand product details. Owner review is required.
- Product photos sent through WhatsApp may vary in quality and aspect ratio.
- Image editing can produce inaccurate previews; copy should present it as a visual approximation.
- WhatsApp provider payloads can vary; webhook parsing is intentionally tolerant.
- Rate limits, token expiration, and provider downtime must be handled before production rollout.
- Privacy policy and consent copy should be completed before enabling public try-on.
