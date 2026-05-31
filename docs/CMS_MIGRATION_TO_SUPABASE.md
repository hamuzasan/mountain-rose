# CMS Migration: Sanity to Supabase

Supabase is the active CMS backend:

- Postgres for structured content
- Storage for images
- Auth for admin access
- Custom admin UI at `/admin`

Sanity is deprecated but temporarily kept to avoid breaking the public website during migration.

## Migration Approach

1. Add Supabase foundation: client utilities, schema, RLS policies, and safe data-access placeholders.
2. Migrate public read paths page-by-page to use Supabase data-access.
3. Use `/admin/products` for product catalogue editing, image upload, draft/publish status, and review of AI-created drafts.
4. Retarget imports:
   - PDF catalogue import should write to Supabase tables + Storage.
   - WhatsApp AI CMS writes to Supabase tables + Storage.
5. Remove Sanity only after:
   - all public pages use Supabase
   - admin CMS is stable
   - content parity is verified

## Rules

- Do not break the public website.
- Do not remove Sanity until migration is complete.
- Do not allow public writes to CMS tables.
- Draft content must not appear on public pages.
- Admin writes require allowlisted authenticated admins.
