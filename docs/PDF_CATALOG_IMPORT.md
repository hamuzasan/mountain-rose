# PDF Catalogue Import

Mountain Rose uses a prepared import pipeline to normalize catalogue data into typed product entries before uploading draft products to Sanity CMS.

## Source PDF Locations

Place the source files here:

- `data/source/mountain-rose-company-profile.pdf`
- `data/source/mountain-rose-product-catalogue.pdf`

The company profile provides brand context such as authenticity, durability, aesthetics, handmade production, and 100% high-quality genuine cowhide. The product catalogue provides product pages and images.

If `mountain-rose-product-catalogue.pdf` is missing, the extraction script will stop with a clear message and explain where the file should be placed.

## Product Mapping

Each catalogue product is mapped manually into typed data inside:

- `data/import/mountainRoseCatalogueProducts.ts`

This file stores:

- product name
- slug
- category
- material and leather type
- size
- catalogue price amount and currency
- inferred color
- source PDF page
- short description
- editorial description
- WhatsApp message

This keeps the catalogue import deterministic and reviewable. The website does not parse PDFs dynamically at request time.

## Image Extraction

The extraction script reads:

- `data/source/mountain-rose-product-catalogue.pdf`

And renders product pages 2 through 10 into:

- `data/generated/catalogue-pages/`

Expected output files:

- `sundaland-beauty-rose.png`
- `sundaland-beauty-moon.png`
- `sundaland-beauty-pouch.png`
- `papandayan-messenger.png`
- `papandayan-backpack.png`
- `guntur-backpack.png`
- `schatzi.png`
- `panjalu-messenger.png`
- `adler.png`

The script first looks for `pdftoppm`, then `magick` / ImageMagick. If no renderer is available, it prints a manual export fallback.

## Product Data Creation

Product data is created from:

- the typed import file
- the catalogue PDF page mapping
- the Mountain Rose brand context from the company profile

Descriptions and colors are normalized carefully and kept conservative. If a catalogue color is uncertain, a general leather color such as Brown, Black, Olive, Cognac, or Dark Brown is used.

## Supabase Upload

The import script:

1. Reads typed product data from `data/import/mountainRoseCatalogueProducts.ts`
2. Reads matching PNG files from `data/generated/catalogue-pages/`
3. Uploads product images to Supabase Storage (`product-images` bucket)
4. Creates or updates draft product rows in Supabase Postgres
5. Creates or updates `product_images` rows and links them to products

The script uses:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

## Draft-First Workflow

Imported products are created as drafts first because:

- PDF extraction can contain visual ambiguity
- catalogue pricing may need local review
- product copy should be checked before going live
- owners may want to add local IDR pricing, better alt text, or more images

Do not auto-publish imported products.

## Review In Admin CMS

After import:

1. Open `/admin` (future task)
2. Review newly created drafts
3. Check image crop, title, size, price note, and descriptions
4. Publish only after owner review

## Commands

Extract product page images:

```bash
npm run extract:catalogue
```

Import draft products into Supabase:

```bash
npm run import:catalogue
```
