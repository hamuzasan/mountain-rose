# Mountain Rose

This is the Mountain Rose website project.

Mountain Rose is a premium genuine cow leather bag brand with an elegant rose and leather boutique style. The website should feel warm, mature, luxurious, handcrafted, editorial, refined, and timeless.

Before editing UI, layout, styling, pages, or components, Codex must read:

- `docs/DESIGN_SYSTEM.md`
- `docs/BRAND_GUIDE.md`
- `docs/COMPONENT_RULES.md`

Design work must stay consistent across the entire project. Do not introduce random colors, random layouts, playful UI, neon colors, generic SaaS style, childish floral graphics, cheap marketplace style, or visuals that make the rose accent feel bright-pink dominant.

Use the documented design tokens and component rules as the source of truth.

## CMS Rules

Sanity is the source of truth for product and content data.

- Do not hardcode product content in page components unless it is temporary placeholder data.
- Use typed CMS query helpers from `src/sanity/lib/queries.ts`.
- Do not bypass the design system when rendering CMS content.
- CMS content must be displayed using the Mountain Rose visual style.
- Keep Sanity schemas aligned with the premium genuine cow leather bag brand, the rose-inspired boutique identity, and the Indonesian copywriting guidance.

## AI Rules

AI features must stay server-side, reviewed, and privacy-conscious.

- Never expose `GEMINI_API_KEY`, `SANITY_WRITE_TOKEN`, `FONNTE_TOKEN`, Meta WhatsApp tokens, or other secrets to the browser.
- Gemini API calls must happen server-side only.
- Sanity write helpers and `SANITY_WRITE_TOKEN` must never be imported into client components.
- WhatsApp AI CMS updates must require an owner/admin allowlist check.
- Public users must never be able to create CMS content.
- AI-created CMS content must follow a draft-before-publish workflow.
- Do not auto-publish AI-created products without explicit owner confirmation.
- User-uploaded try-on images must not be stored permanently by default.
