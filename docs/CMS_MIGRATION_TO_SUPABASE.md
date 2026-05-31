# Supabase CMS Status

Mountain Rose now uses Supabase as the only active CMS backend.

## Current Source of Truth

- Supabase Postgres for structured content
- Supabase Storage for product images
- Supabase Auth for admin access
- Custom admin CMS at `/admin`

## Current Editing Flow

1. Products are added and edited in `/admin/products`.
2. Product images are stored in Supabase Storage bucket `product-images`.
3. WhatsApp AI CMS commands write draft products into Supabase.
4. Drafts are reviewed in the admin CMS before they are published.

## Rules

- Do not allow public writes to CMS tables.
- Draft content must not appear on public pages.
- Admin writes require authenticated allowlisted admins.
