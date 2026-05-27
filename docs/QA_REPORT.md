# Mountain Rose QA Report

QA date: 2026-05-27

## Summary

- [x] `npm run lint` passed.
- [x] `npm run build` passed.
- [x] Local production route checks passed with `next start`.
- [x] CMS fallback behavior was reviewed.
- [x] SEO files, metadata, robots, sitemap, and structured data were reviewed.
- [x] WhatsApp link behavior was reviewed.
- [x] Accessibility basics were reviewed.
- [x] Image handling was reviewed.
- [ ] Final branded Open Graph image is still needed at `public/og-image.jpg`.
- [ ] Manual real-device and social-share preview checks are still needed before launch.

Production readiness status: build-ready. Final launch should wait until the manual checklist items are completed in Vercel, Sanity, and real devices.

## Routes Checked

Checked with a local production server using `npm run build` followed by `next start`.

- [x] `/` returned 200.
- [x] `/collections` returned 200.
- [x] `/collections/rosewood-tote` returned 200.
- [x] `/story` returned 200.
- [x] `/leather-care` returned 200.
- [x] `/leather-care/cara-merawat-tas-kulit-sapi` returned 200.
- [x] `/contact` returned 200.
- [x] `/studio` returned 200.
- [x] `/sitemap.xml` returned 200.
- [x] `/robots.txt` returned 200.

Finding fixed: `/studio` returned 500 when Sanity environment variables were missing. The Studio route now renders a clear setup notice when Sanity project configuration is absent, while preserving the real embedded Studio when configuration exists.

## Lint Result

- [x] Initial lint passed.
- [x] Final lint passed.

## Build Result

- [x] Initial production build passed.
- [x] Final production build passed.

The build prerenders static pages and fallback dynamic paths for products and leather care articles.

## Responsive Checks

Reviewed layout structure and responsive classes for:

- [x] Mobile widths: 360px, 390px, 430px.
- [x] Tablet width: 768px.
- [x] Desktop widths: 1024px, 1280px, 1440px.

Notes:

- Navbar has a mobile menu with accessible state attributes.
- Product grids use one column on mobile, two on tablet, and three on desktop.
- Product detail layout stacks on small screens and becomes two columns on desktop.
- Article body uses restrained widths for readability.
- Contact form stacks fields on mobile and uses labeled controls.
- Footer and CTA sections use responsive stacking.

Automated viewport screenshots were not available in this session. Complete a final visual pass on real browsers/devices before launch.

## Visual Consistency

- [x] Approved design tokens are used throughout the checked UI.
- [x] No neon colors, bright pink dominance, playful floral graphics, generic SaaS layout, or marketplace-style badge clutter was found.
- [x] Shadows and borders remain restrained.
- [x] Rose accents stay muted and secondary.

## CMS Fallback Checks

- [x] Site Settings fallback is available.
- [x] Homepage fallback is available.
- [x] Product fallback is available.
- [x] Collection/product route fallback paths are available.
- [x] Brand Story fallback is available.
- [x] Leather Care fallback is available.

Fallback data remains development-safe. Production content should be filled in Sanity before launch.

## WhatsApp Checks

- [x] `buildWhatsAppLink` sanitizes phone numbers.
- [x] Messages are encoded with `encodeURIComponent`.
- [x] Links use `https://wa.me/`.
- [x] Empty phone numbers fall back safely to `https://wa.me/`.
- [x] Navbar, footer, homepage, product detail, contact, contact form, and leather care CTAs use the shared WhatsApp behavior.
- [x] Product detail messages include the product name.
- [x] Contact form message includes user-entered name, WhatsApp number, product interest, and message.

Manual check before launch: replace placeholder WhatsApp number in Sanity Site Settings.

## SEO Checks

- [x] Root metadata uses `metadataBase`, title template, description, keywords, Open Graph, and Twitter defaults.
- [x] Page-level metadata exists for homepage, collections, story, leather care, contact, product detail, and article detail pages.
- [x] Product detail metadata includes the product name.
- [x] Article detail metadata includes the article title.
- [x] Metadata descriptions are natural and avoid keyword stuffing.
- [x] Open Graph references `/og-image.jpg`.
- [ ] `public/og-image.jpg` is not present yet.

## Sitemap Checks

- [x] Static public routes are included.
- [x] Product routes from CMS are used when available.
- [x] Fallback product routes are used when CMS products are unavailable.
- [x] Leather care article routes from CMS are used when available.
- [x] Fallback article routes are used when CMS articles are unavailable.
- [x] URLs are absolute and based on `NEXT_PUBLIC_SITE_URL` / site config.
- [x] `/studio` and `/api` are not included.

## Robots Checks

- [x] Public pages are allowed.
- [x] `/studio` and `/studio/` are disallowed from indexing.
- [x] `/api/` is disallowed from indexing.
- [x] Sitemap URL is included.
- [x] The whole site is not blocked.

## Structured Data Checks

- [x] Organization JSON-LD uses only safe brand facts.
- [x] Website JSON-LD uses safe site-level facts.
- [x] Product JSON-LD requires sufficient product data.
- [x] Product JSON-LD does not include fake reviews or ratings.
- [x] Product availability maps only from `isAvailable`.

Finding fixed: product JSON-LD now skips zero/custom price products so a custom inquiry product is not represented as a free offer.

## Accessibility Checks

- [x] Mobile menu button has an accessible label and expanded state.
- [x] Form fields have labels.
- [x] Interactive buttons and links have visible focus states.
- [x] WhatsApp links include useful accessible labels where needed.
- [x] Product and article images have meaningful alt fallbacks.
- [x] Heading order is generally logical across reviewed pages.
- [x] Contrast uses approved dark leather and warm ivory design tokens.

Manual check before launch: keyboard-test the deployed site in a real browser, especially the mobile menu and Sanity Studio login flow.

## Image Handling Checks

- [x] Product images use `next/image` when Sanity image URLs exist.
- [x] Article cover images use `next/image` when Sanity image URLs exist.
- [x] Hero/story CMS images use `next/image` where available.
- [x] Missing images render elegant Mountain Rose placeholders.
- [x] `next.config.ts` only allows `cdn.sanity.io` remote images.
- [x] No random external images were found.
- [ ] Add final `public/og-image.jpg` before launch.

## Performance Checks

- [x] Static/server components are used for non-interactive pages and sections where practical.
- [x] Client components are limited to interactive UI such as navbar menu, filters, gallery, product cards, contact form, and WhatsApp behavior.
- [x] No avoidable console logging was found.
- [x] No unnecessary external image domains are configured.
- [x] No real secrets are present in `.env.example`.

## Known Issues

- `public/og-image.jpg` is referenced by metadata but has not been created yet.
- Production Sanity project ID, dataset, API version, and optional read token must be configured in Vercel.
- Placeholder contact values must be replaced in Sanity Site Settings.
- Final product images, article covers, and editorial imagery must be uploaded in Sanity.
- Automated screenshot-based viewport verification was not available in this session.

## Recommended Fixes

- Add a final branded Open Graph image at `public/og-image.jpg`.
- Fill Sanity Site Settings, Homepage, Collections, Products, Brand Story, and Leather Care Articles before launch.
- Confirm Sanity CORS/origin settings include the production domain.
- Complete a manual device/browser pass at common mobile, tablet, and desktop widths.
- Verify social preview cards after deployment.
