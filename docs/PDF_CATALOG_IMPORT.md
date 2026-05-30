# PDF Catalogue Import

Mountain Rose keeps catalogue product data normalized in typed files before it is upserted into Supabase. Product images are now handled manually and synced separately.

## Source Files

Place the reference PDFs here:

- `data/source/mountain-rose-company-profile.pdf`
- `data/source/mountain-rose-product-catalogue.pdf`

The company profile is used as brand reference only. The product catalogue is used to map product names, categories, sizes, prices, and source PDF pages into structured product data.

If the PDFs are missing, the import scripts will stop with a clear message.

## Product Metadata Import

The typed product catalogue lives here:

- `data/import/mountainRoseCatalogueProducts.ts`

It contains the normalized fields needed for Supabase import, such as:

- product name
- slug
- category
- material
- leather type
- size
- price amount and currency
- source PDF page
- short description
- long description
- availability
- featured flag
- WhatsApp message

Import metadata only with:

```bash
npm run import:catalogue
```

This script upserts product rows into Supabase and keeps products as drafts by default unless they are already published.

## Manual Product Image Workflow

Product images are no longer extracted automatically from the PDF. The new workflow is manual:

1. Crop the bag images manually from the PDF or catalogue files.
2. Save the crops as PNG files, preferably with transparent backgrounds.
3. Name them consistently:
   - `01.png`
   - `02.png`
   - `03.png`
   - `04.png`
4. Upload the files to Supabase Storage bucket `product-images`.
5. Use this folder convention:
   - `products/[product-slug]/01.png`
   - `products/[product-slug]/02.png`
   - `products/[product-slug]/03.png`
6. Sync the uploaded files into the `product_images` table:

```bash
npm run sync:product-images
```

The sync script reads the files already stored in Supabase Storage, gets their public URLs, and upserts `product_images` rows in the database.

## Review Workflow

After importing metadata and syncing images:

1. Open the custom admin area at `/admin` when it is available.
2. Review each draft product.
3. Check the product title, price, description, image order, and availability.
4. Publish only after owner review.

## Notes

- The website should not depend on local generated image folders anymore.
- The catalogue PDF remains a source reference, not a runtime image pipeline.
- Supabase stays the source of truth for product content and product images.
