# Mountain Rose CMS Model

Sanity CMS is the source of truth for Mountain Rose product and content data. Frontend pages should use typed query helpers from `src/sanity/lib/queries.ts` and render CMS content through Mountain Rose design system components.

## CMS Collections

### Product

Products represent genuine cow leather bags and related leather goods. Each product should include:

- `name`: Public product name.
- `slug`: URL-safe product identifier.
- `price`: Product price when it should be displayed.
- `category`: Product category such as tote, shoulder bag, handbag, wallet, or clutch.
- `collection`: Optional reference to a Collection document.
- `shortDescription`: Concise card or preview copy.
- `description`: Rich editorial copy about leather, silhouette, durability, and craftsmanship.
- `images`: Product imagery with accessible alt text.
- `leatherType`: Material description, for example genuine cow leather.
- `color`: Warm, specific color label.
- `size`: Dimensions or readable size label.
- `isFeatured`: Controls homepage or highlighted product placement.
- `isAvailable`: Controls whether the product can be ordered or only viewed.
- `whatsAppMessage`: Optional prefilled WhatsApp inquiry text for this product.

Product content should avoid loud discounts, exaggerated claims, and marketplace-style urgency. Copy should feel premium, trustworthy, and calm.

### Collection

Collections group products into editorial or seasonal stories. Use collections for future pages such as signature bags, everyday leather, limited pieces, or rose-inspired edits.

- `title`: Collection name.
- `slug`: URL-safe collection identifier.
- `description`: Editorial collection description.
- `coverImage`: Main collection image with alt text.

### Homepage

Homepage content is editable in one Homepage document. It should remain structured and reusable rather than hardcoded in the page component.

- `heroTitle`: Main homepage statement.
- `heroSubtitle`: Supporting intro copy.
- `heroImage`: Primary visual.
- `featuredProducts`: References to selected Product documents.
- `storySectionTitle`: Brand story section heading.
- `storySectionText`: Rich story copy.
- `ctaTitle`: Call-to-action heading.
- `ctaText`: Calm inquiry or collection prompt.

The homepage UI should only be built when explicitly requested. This document prepares the content model for that future work.

### Brand Story

Brand Story supports editorial content about Mountain Rose positioning, craftsmanship, leather quality, and boutique identity.

- `title`: Story title.
- `subtitle`: Short supporting copy.
- `content`: Rich text story content.
- `image`: Supporting image with alt text.

### Leather Care Article

Leather Care Articles support educational content about genuine cow leather care.

- `title`: Article title.
- `slug`: URL-safe article identifier.
- `excerpt`: Short preview copy.
- `content`: Rich article content.
- `coverImage`: Article image with alt text.
- `publishedAt`: Publication date for sorting.

Articles should be useful, calm, and trustworthy. Avoid overclaiming and keep care advice practical.

### Site Settings

Site Settings stores global brand and contact data.

- `brandName`: Public brand name.
- `tagline`: Short brand line.
- `whatsappNumber`: WhatsApp contact number.
- `instagramUrl`: Instagram profile URL.
- `email`: Contact email.
- `address`: Boutique or business address.
- `logo`: Brand logo with alt text.

Use Site Settings for shared layout and contact information instead of hardcoding those values in components.

## WhatsApp Order Data

WhatsApp order links should be generated from CMS data and site settings:

- Use `siteSettings.whatsappNumber` as the destination number.
- Use `product.whatsAppMessage` when provided.
- Fall back to a refined default message using the product name.
- Encode the final message safely for URL usage.
- Keep WhatsApp CTAs visually aligned with Mountain Rose button rules. Do not use neon green or aggressive marketplace styling.

No private customer data should be stored in Sanity unless a future privacy and operations plan explicitly defines it.
