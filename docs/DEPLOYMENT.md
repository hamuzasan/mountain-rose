# Mountain Rose Deployment

Deployment target: Vercel.

This guide prepares Mountain Rose for production deployment. Do not commit `.env.local`, real tokens, or private credentials.

## Required Environment Variables

Set these in Vercel Project Settings > Environment Variables:

```env
NEXT_PUBLIC_SITE_URL=https://mountainrose.id
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=
SANITY_API_READ_TOKEN=
```

Notes:

- `NEXT_PUBLIC_SITE_URL` is public-safe and should be the final production domain.
- `NEXT_PUBLIC_SANITY_PROJECT_ID` is public-safe.
- `NEXT_PUBLIC_SANITY_DATASET` is public-safe.
- `NEXT_PUBLIC_SANITY_API_VERSION` is public-safe.
- `SANITY_API_READ_TOKEN` must stay server-only. Do not expose it in browser code or prefix it with `NEXT_PUBLIC_`.

## Vercel Setup

1. Push the repository to GitHub.
2. In Vercel, choose Add New Project.
3. Import the GitHub repository.
4. Keep the framework preset as Next.js.
5. Add the required environment variables for Production, Preview, and Development as needed.
6. Deploy.

## Production Domain

1. In Vercel, open Project Settings > Domains.
2. Add `mountainrose.id`.
3. Follow Vercel DNS instructions for the domain provider.
4. Set `NEXT_PUBLIC_SITE_URL=https://mountainrose.id`.
5. Redeploy after the environment variable is confirmed.

## Sanity Studio

The embedded Studio route is:

```text
/studio
```

After deployment, check:

- `/studio` loads.
- Authorized users can log in.
- The Sanity project ID and dataset are correct.
- CORS/origin settings in Sanity allow the production domain.

`robots.txt` disallows `/studio` from indexing, but it does not block users from opening the Studio.

## SEO Checks

After deployment, verify:

- `/sitemap.xml` loads.
- `/robots.txt` loads.
- `robots.txt` allows public pages.
- `robots.txt` disallows `/studio`, `/studio/`, and `/api/`.
- `robots.txt` includes `https://mountainrose.id/sitemap.xml`.
- Shared links use the expected metadata and Open Graph image.

`/og-image.jpg` is referenced by metadata. Add the final branded image at `public/og-image.jpg` before launch.

## Local Production Build

Run:

```bash
npm run lint
npm run build
npm run start
```

Use `npm run start` only after `npm run build`.

## Production Content Warning

Fallback data is useful during development, but production content should be filled in Sanity CMS so the website shows real Mountain Rose products, real images, and real business information.

Replace these placeholder values in Sanity Site Settings before launch:

- WhatsApp number: `6280000000000`
- Instagram URL: `https://instagram.com/mountainrose`
- Email: `hello@mountainrose.id`
- Address: `Indonesia`

Also replace fallback product/article content with real CMS entries where possible.

## Common Deployment Errors

- Missing Sanity project ID: check `NEXT_PUBLIC_SANITY_PROJECT_ID`.
- Wrong dataset: check `NEXT_PUBLIC_SANITY_DATASET`, usually `production`.
- Studio loads but cannot read/write: check Sanity project permissions and CORS origins.
- Images fail in production: confirm Sanity images use `cdn.sanity.io`; this is configured in `next.config.ts`.
- Metadata uses wrong domain: confirm `NEXT_PUBLIC_SITE_URL`.
- Sitemap uses fallback data only: confirm products and articles are published in Sanity.
- Build fails on environment assumptions: run `npm run build` locally and check exact error output.
