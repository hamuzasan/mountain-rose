# Mountain Rose

Mountain Rose is a premium website for genuine cow leather bags with an elegant rose-inspired boutique identity. The site is built to feel warm, mature, handcrafted, editorial, and timeless.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- Supabase CMS

## CMS Setup

Supabase is the source of truth for product data, product images, and editable website content.

Required environment variables:

```env
NEXT_PUBLIC_SITE_URL=https://mountainrose.id
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Use `.env.local` for local values. Do not commit real secrets.

## Importing Product Catalogue PDF

Place the source PDFs here:

- `data/source/mountain-rose-company-profile.pdf`
- `data/source/mountain-rose-product-catalogue.pdf`

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Import product metadata into Supabase:

```bash
npm run import:catalogue
```

Manual product images should be uploaded to Supabase Storage at:

```text
product-images/products/[product-slug]/01.png
```

After uploading product images, sync them into the database:

```bash
npm run sync:product-images
```

The manual workflow is documented in `docs/MANUAL_PRODUCT_IMAGE_WORKFLOW.md`.

The metadata import creates or updates draft products first. Review and publish them in `/admin` before showing them on the public site.

## Managing Content with Supabase CMS

Open `http://localhost:3000/admin/login` after starting the dev server.

Fill content in this recommended order:

1. Site Settings
2. Homepage
3. Collections
4. Products
5. Instagram Cards
6. Leather Care Articles
7. Brand Story, optional archive page

Use `docs/CMS_CONTENT_GUIDE.md` for starter content, image guidelines, copywriting guidance, WhatsApp message examples, and SEO content tips.

## Development

Install dependencies:

```bash
npm install
```

Development:

```bash
npm run dev
```

Open `http://localhost:3000`.

Lint:

```bash
npm run lint
```

Build:

```bash
npm run build
```

Start production locally:

```bash
npm run start
```

Use `npm run start` after `npm run build`.

## Routes

- `/`
- `/collections`
- `/collections/[slug]`
- `/leather-care`
- `/leather-care/[slug]`
- `/contact`
- `/admin`
- `/admin/products`
- `/admin/settings`
- `/admin/instagram`
- `/admin/whatsapp-debug`

## SEO

- Sitemap: `/sitemap.xml`
- Robots: `/robots.txt`
- Open Graph defaults are configured from `src/config/site.ts`.
- Structured data is added for Organization, WebSite, and eligible Product pages.

`/og-image.jpg` is referenced as the default social image. Create the final branded OG image before production launch.

## Deployment

Deployment target: Vercel.

Read `docs/DEPLOYMENT.md` before deploying and use `docs/LAUNCH_CHECKLIST.md` before launch.

## Supabase CMS

- Schema: `supabase/schema.sql`
- Setup: `docs/SUPABASE_SETUP.md`
- Migration notes: `docs/CMS_MIGRATION_TO_SUPABASE.md`
- Logo URL is managed at `/admin/settings`.
- Homepage Instagram cards are managed at `/admin/instagram`.

## Project Rules

Before editing UI, layout, styling, pages, or components, read:

- `docs/DESIGN_SYSTEM.md`
- `docs/BRAND_GUIDE.md`
- `docs/COMPONENT_RULES.md`
- `docs/CMS_MODEL.md`
