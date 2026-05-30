# Manual Product Image Workflow

Mountain Rose now uses a manual image workflow for product photography from the PDF catalogue.

## Workflow

### Step 1: Crop the product images manually

Open `data/source/mountain-rose-product-catalogue.pdf` in your PDF viewer or design tool and crop the individual bag photos yourself.

### Step 2: Remove the background if desired

If you want transparent product images, remove the background before uploading. Save the result as PNG.

### Step 3: Use consistent filenames

Name the files in order:

- `01.png`
- `02.png`
- `03.png`
- `04.png`

### Step 4: Upload to Supabase Storage

Upload the files into the `product-images` bucket using this folder pattern:

```text
products/[product-slug]/01.png
products/[product-slug]/02.png
products/[product-slug]/03.png
```

Example:

```text
products/papandayan-messenger/01.png
products/papandayan-messenger/02.png
products/papandayan-messenger/03.png
products/papandayan-messenger/04.png
```

If you already uploaded images into old slug-only folders such as `adler/` or `papandayan-messenger/`, you can normalize them with the migration script:

```bash
npm run migrate:product-image-folders
```

That script moves the files into `products/[product-slug]/` and renames them in order to `01.png`, `02.png`, and so on.

### Step 5: Sync the uploaded images

Run:

```bash
npm run sync:product-images
```

This creates or updates `product_images` rows in Supabase and keeps the image order based on the filename order.

### Step 6: Review the product in the admin area

Open `/admin/products` and check:

- image order
- product preview
- alt text
- product status

### Step 7: Publish when ready

Keep products as drafts until the owner has reviewed the content and images.

## Recommended Image Handling

- Use clean product crops.
- Prefer transparent PNGs.
- Keep straps and handles intact.
- Keep filenames short and ordered.
- Avoid overwriting published images unless you intend to update them.

## Why this workflow exists

- It gives the brand full control over the exact crop and background treatment.
- It keeps the product pipeline simple and predictable.
- It avoids relying on local extraction folders or automated PDF image detection.
