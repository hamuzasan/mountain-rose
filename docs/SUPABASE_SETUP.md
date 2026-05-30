# Supabase Setup (Mountain Rose)

This document sets up Supabase as the future CMS backend. Sanity remains active during the migration.

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
2. Insert a row into `public.admin_profiles` for that user:

```sql
insert into public.admin_profiles (id, email, role)
values ('<auth.users.id>', '<admin email>', 'admin');
```

## Local Environment

Use `.env.local` for local secrets. Do not commit it.

Required:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Vercel Environment Variables

Set these in Vercel Project Settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

Keep RLS enabled in production. The service role key must never be used in browser code.
