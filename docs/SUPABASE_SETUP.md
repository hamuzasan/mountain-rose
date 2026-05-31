# Supabase Setup (Mountain Rose)

This document sets up Supabase as the active CMS backend for Mountain Rose product and content data.

## Create Project

1. Create a Supabase project.
2. Copy:
   - Project URL
   - `anon` public key
   - `service_role` key (server-only)

## Database Schema

1. Open Supabase SQL Editor.
2. Run:
   - `supabase/schema.sql`

This creates tables, `updated_at` triggers, indexes, and RLS policies.

## Storage Bucket

Create a bucket:

- Name: `product-images`
- Visibility: public (for product display)

Rules:

- Only admins/service role should upload images.
- Public visitors should never upload product images.

## Admin User

1. Create an admin user via Supabase Auth (email/password is fine for MVP).
2. Add the admin email to `ADMIN_EMAILS` in `.env.local`.
3. Open the custom CMS at:

```text
http://localhost:3000/admin
```

4. Login with the Supabase Auth email/password. If the email is in `ADMIN_EMAILS`, the system will auto-create the `admin_profiles` row.
5. The product CMS is available at `/admin/products`.

The CMS can add/edit products, upload product images to the `product-images` bucket, and publish or return products to draft.

## Recovering Admin Access

If you forget the admin password:

1. Open Supabase Dashboard → Authentication → Users.
2. Reset the password for the admin email or create a new user.
3. Make sure the email is present in `ADMIN_EMAILS`.

You can do that from the project root with:

```bash
npm run grant:admin -- your-admin@email.com
```

This script finds the matching Supabase Auth user and upserts the `admin_profiles` row automatically.

## Local Environment

Use `.env.local` for local secrets. Do not commit it.

Required:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAILS=owner@mountainrose.id
```

## Vercel Environment Variables

Set these in Vercel Project Settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

Keep RLS enabled in production. The service role key must never be used in browser code.
