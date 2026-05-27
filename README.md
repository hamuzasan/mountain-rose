# Mountain Rose

Mountain Rose is a premium website for genuine cow leather bags with an elegant rose-inspired boutique identity. The site is built to feel warm, mature, handcrafted, editorial, and timeless.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- Sanity CMS

## CMS Setup

Sanity is the source of truth for editable product, collection, homepage, brand story, leather care, and site settings content. The embedded Studio is available at `/studio`.

Required environment variables:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=
SANITY_API_READ_TOKEN=
NEXT_PUBLIC_SITE_URL=https://mountainrose.id
```

Use `.env.local` for local values. Do not commit real secrets.

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

## Project Rules

Before editing UI, layout, styling, pages, or components, read:

- `docs/DESIGN_SYSTEM.md`
- `docs/BRAND_GUIDE.md`
- `docs/COMPONENT_RULES.md`
- `docs/CMS_MODEL.md`
