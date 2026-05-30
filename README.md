# Mountain Rose

Mountain Rose is a premium website for genuine cow leather bags with an elegant rose-inspired boutique identity. The site is built to feel warm, mature, handcrafted, editorial, and timeless.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- Supabase CMS foundation
- Sanity CMS

## CMS Setup

Supabase is the source of truth for product data and product images. Sanity remains available for editorial content during the migration. The embedded Studio is available at `/studio`.

Required environment variables:

```env
NEXT_PUBLIC_SITE_URL=https://mountainrose.id
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Sanity is still used for editorial content during the migration:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=
SANITY_API_READ_TOKEN=
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

## Managing Content with Sanity

Open `http://localhost:3000/studio` after starting the dev server.

Fill content in this recommended order:

1. Site Settings
2. Homepage
3. Collections
4. Products
5. Brand Story
6. Leather Care Articles

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
- `/story`
- `/leather-care`
- `/leather-care/[slug]`
- `/contact`
- `/studio`

## SEO

- Sitemap: `/sitemap.xml`
- Robots: `/robots.txt`
- Open Graph defaults are configured from `src/config/site.ts`.
- Structured data is added for Organization, WebSite, and eligible Product pages.

`/og-image.jpg` is referenced as the default social image. Create the final branded OG image before production launch.

## Deployment

Deployment target: Vercel.

Read `docs/DEPLOYMENT.md` before deploying and use `docs/LAUNCH_CHECKLIST.md` before launch.

## Supabase CMS (Foundation)

Supabase CMS foundation is prepared for incremental migration. Sanity remains active until public pages are migrated.

- Schema: `supabase/schema.sql`
- Setup: `docs/SUPABASE_SETUP.md`
- Migration notes: `docs/CMS_MIGRATION_TO_SUPABASE.md`

## Project Rules

Before editing UI, layout, styling, pages, or components, read:

- `docs/DESIGN_SYSTEM.md`
- `docs/BRAND_GUIDE.md`
- `docs/COMPONENT_RULES.md`
- `docs/CMS_MODEL.md`
