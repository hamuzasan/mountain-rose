-- Mountain Rose Supabase CMS schema
-- Safe incremental migration: Sanity remains in place until public pages are migrated.

create extension if not exists pgcrypto;

-- Updated-at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Tables
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  cover_image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  category text not null,
  collection_id uuid references public.collections(id) on delete set null,
  short_description text,
  description text,
  material text,
  leather_type text,
  color text,
  size text,
  price numeric,
  price_amount numeric,
  price_currency text default 'USD',
  price_note text,
  is_featured boolean default false,
  is_available boolean default true,
  status text default 'draft',
  whatsapp_message text,
  source_pdf_page integer,
  seo_title text,
  seo_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  storage_path text not null,
  public_url text not null,
  alt text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null default 'Mountain Rose',
  tagline text,
  whatsapp_number text,
  instagram_url text,
  email text,
  address text,
  logo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.homepage_content (
  id uuid primary key default gen_random_uuid(),
  hero_title text,
  hero_subtitle text,
  hero_image_url text,
  story_section_title text,
  story_section_text text,
  cta_title text,
  cta_text text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.brand_story (
  id uuid primary key default gen_random_uuid(),
  title text,
  subtitle text,
  intro text,
  craftsmanship_title text,
  craftsmanship_text text,
  leather_title text,
  leather_text text,
  rose_title text,
  rose_text text,
  cta_title text,
  cta_text text,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.leather_care_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image_url text,
  published_at timestamptz,
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text default 'admin',
  created_at timestamptz default now()
);

create table if not exists public.whatsapp_webhook_logs (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  stage text not null,
  status text not null default 'info',
  sender text,
  command text,
  detail text,
  payload jsonb,
  parsed jsonb,
  created_at timestamptz default now()
);

-- updated_at triggers
drop trigger if exists set_updated_at_collections on public.collections;
create trigger set_updated_at_collections
before update on public.collections
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_products on public.products;
create trigger set_updated_at_products
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_site_settings on public.site_settings;
create trigger set_updated_at_site_settings
before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_homepage_content on public.homepage_content;
create trigger set_updated_at_homepage_content
before update on public.homepage_content
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_brand_story on public.brand_story;
create trigger set_updated_at_brand_story
before update on public.brand_story
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_leather_care_articles on public.leather_care_articles;
create trigger set_updated_at_leather_care_articles
before update on public.leather_care_articles
for each row execute function public.set_updated_at();

-- indexes
create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_status_idx on public.products (status);
create index if not exists products_is_featured_idx on public.products (is_featured);
create index if not exists products_is_available_idx on public.products (is_available);

create index if not exists collections_slug_idx on public.collections (slug);

create index if not exists leather_care_articles_slug_idx on public.leather_care_articles (slug);
create index if not exists leather_care_articles_status_idx on public.leather_care_articles (status);

create index if not exists product_images_product_id_idx on public.product_images (product_id);

-- RLS
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.site_settings enable row level security;
alter table public.homepage_content enable row level security;
alter table public.brand_story enable row level security;
alter table public.leather_care_articles enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.whatsapp_webhook_logs enable row level security;

-- Admin profiles: users can read their own admin row (so policies can check membership safely)
drop policy if exists "admin_profiles_read_own" on public.admin_profiles;
create policy "admin_profiles_read_own"
on public.admin_profiles
for select
to authenticated
using (id = (select auth.uid()));

-- Public read policies
drop policy if exists "collections_public_read" on public.collections;
create policy "collections_public_read"
on public.collections
for select
to anon, authenticated
using (true);

drop policy if exists "products_public_read_published" on public.products;
create policy "products_public_read_published"
on public.products
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "product_images_public_read" on public.product_images;
create policy "product_images_public_read"
on public.product_images
for select
to anon, authenticated
using (true);

drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read"
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists "homepage_content_public_read" on public.homepage_content;
create policy "homepage_content_public_read"
on public.homepage_content
for select
to anon, authenticated
using (true);

drop policy if exists "brand_story_public_read" on public.brand_story;
create policy "brand_story_public_read"
on public.brand_story
for select
to anon, authenticated
using (true);

drop policy if exists "leather_care_public_read_published" on public.leather_care_articles;
create policy "leather_care_public_read_published"
on public.leather_care_articles
for select
to anon, authenticated
using (status = 'published');

-- Admin write policies: only authenticated users listed in admin_profiles may write
-- Note: service role bypasses RLS on the server.
drop policy if exists "collections_admin_write" on public.collections;
create policy "collections_admin_write"
on public.collections
for all
to authenticated
using (exists (select 1 from public.admin_profiles ap where ap.id = (select auth.uid())))
with check (exists (select 1 from public.admin_profiles ap where ap.id = (select auth.uid())));

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write"
on public.products
for all
to authenticated
using (exists (select 1 from public.admin_profiles ap where ap.id = (select auth.uid())))
with check (exists (select 1 from public.admin_profiles ap where ap.id = (select auth.uid())));

drop policy if exists "product_images_admin_write" on public.product_images;
create policy "product_images_admin_write"
on public.product_images
for all
to authenticated
using (exists (select 1 from public.admin_profiles ap where ap.id = (select auth.uid())))
with check (exists (select 1 from public.admin_profiles ap where ap.id = (select auth.uid())));

drop policy if exists "site_settings_admin_write" on public.site_settings;
create policy "site_settings_admin_write"
on public.site_settings
for all
to authenticated
using (exists (select 1 from public.admin_profiles ap where ap.id = (select auth.uid())))
with check (exists (select 1 from public.admin_profiles ap where ap.id = (select auth.uid())));

drop policy if exists "homepage_content_admin_write" on public.homepage_content;
create policy "homepage_content_admin_write"
on public.homepage_content
for all
to authenticated
using (exists (select 1 from public.admin_profiles ap where ap.id = (select auth.uid())))
with check (exists (select 1 from public.admin_profiles ap where ap.id = (select auth.uid())));

drop policy if exists "brand_story_admin_write" on public.brand_story;
create policy "brand_story_admin_write"
on public.brand_story
for all
to authenticated
using (exists (select 1 from public.admin_profiles ap where ap.id = (select auth.uid())))
with check (exists (select 1 from public.admin_profiles ap where ap.id = (select auth.uid())));

drop policy if exists "leather_care_admin_write" on public.leather_care_articles;
create policy "leather_care_admin_write"
on public.leather_care_articles
for all
to authenticated
using (exists (select 1 from public.admin_profiles ap where ap.id = (select auth.uid())))
with check (exists (select 1 from public.admin_profiles ap where ap.id = (select auth.uid())));

-- admin_profiles are managed manually or by service role/admin scripts
drop policy if exists "admin_profiles_admin_manage" on public.admin_profiles;
create policy "admin_profiles_admin_manage"
on public.admin_profiles
for all
to authenticated
using (exists (select 1 from public.admin_profiles ap where ap.id = (select auth.uid())))
with check (exists (select 1 from public.admin_profiles ap where ap.id = (select auth.uid())));

drop policy if exists "whatsapp_webhook_logs_admin_read" on public.whatsapp_webhook_logs;
create policy "whatsapp_webhook_logs_admin_read"
on public.whatsapp_webhook_logs
for select
to authenticated
using (exists (select 1 from public.admin_profiles ap where ap.id = (select auth.uid())));

drop policy if exists "whatsapp_webhook_logs_admin_write" on public.whatsapp_webhook_logs;
create policy "whatsapp_webhook_logs_admin_write"
on public.whatsapp_webhook_logs
for all
to authenticated
using (exists (select 1 from public.admin_profiles ap where ap.id = (select auth.uid())))
with check (exists (select 1 from public.admin_profiles ap where ap.id = (select auth.uid())));
