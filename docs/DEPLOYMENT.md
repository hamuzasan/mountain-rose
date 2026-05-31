# Mountain Rose Deployment

Deployment target: Vercel.

This guide prepares Mountain Rose for production deployment. Do not commit `.env.local`, real tokens, or private credentials.

## Required Environment Variables

Set these in Vercel Project Settings > Environment Variables:

```env
NEXT_PUBLIC_SITE_URL=https://mountainrose.id
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Notes:

- `NEXT_PUBLIC_SITE_URL` is public-safe and should be the final production domain.
- `NEXT_PUBLIC_SUPABASE_URL` is public-safe.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is public-safe only when RLS is configured correctly.
- `SUPABASE_SERVICE_ROLE_KEY` must stay server-only. Do not expose it in browser code or prefix it with `NEXT_PUBLIC_`.

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

## Admin CMS

The admin CMS routes are:

```text
/admin/login
/admin/products
/admin/whatsapp-debug
```

After deployment, check:

- `/admin/login` loads.
- Authorized users can log in.
- Product and content data can be read from Supabase.

## SEO Checks

After deployment, verify:

- `/sitemap.xml` loads.
- `/robots.txt` loads.
- `robots.txt` allows public pages.
- `robots.txt` disallows `/admin`, `/admin/`, and `/api/`.
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

Fallback data is useful during development, but production content should be filled in Supabase CMS so the website shows real Mountain Rose products, real images, and real business information.

Replace these placeholder values in Site Settings before launch:

- WhatsApp number: `6280000000000`
- Instagram URL: `https://instagram.com/mountainrose`
- Email: `hello@mountainrose.id`
- Address: `Indonesia`

Also replace fallback product/article content with real CMS entries where possible.

## Common Deployment Errors

- Missing Supabase URL: check `NEXT_PUBLIC_SUPABASE_URL`.
- Missing anon key: check `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Admin CMS cannot read/write: check Supabase RLS, `SUPABASE_SERVICE_ROLE_KEY`, and `ADMIN_EMAILS`.
- Metadata uses wrong domain: confirm `NEXT_PUBLIC_SITE_URL`.
- Sitemap uses fallback data only: confirm products and articles are published in Supabase.
- Build fails on environment assumptions: run `npm run build` locally and check exact error output.
