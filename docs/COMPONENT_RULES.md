# Mountain Rose Component Rules

## General Rules

- Components must be reusable and composable.
- Do not duplicate UI blocks when a shared component should exist.
- Do not hardcode random colors. Use the approved design tokens.
- Use semantic HTML for structure and meaning.
- Use accessible alt text, buttons, links, labels, and focus states.
- Keep interaction subtle and refined.
- Avoid generic SaaS styling, childish visuals, marketplace density, and loud promotional UI.

## Navbar

- Use semantic `header` and `nav` elements.
- Keep navigation calm, spacious, and readable.
- Use warm backgrounds, leather text colors, and subtle borders.
- Reserve strong accents for active states or important actions.

## Footer

- Use semantic `footer` markup.
- Include brand, navigation, contact, and legal areas when content exists.
- Keep contrast elegant and readable.
- Avoid overcrowding with excessive links or promotional badges.

## HeroSection

- Must be reusable for future homepage or editorial pages.
- Should support heading, intro copy, CTA, and image/media slots.
- Use large imagery and calm editorial spacing.
- Do not build the final homepage until explicitly requested.

## ProductCard

- Must support product image, name, material, short description, price or inquiry status, and link/CTA.
- Use accessible image alt text that describes the bag.
- Keep badges minimal and premium.
- Avoid discount-heavy or marketplace-style card layouts.

## ProductGrid

- Must compose `ProductCard` instances.
- Use responsive grid behavior with generous spacing.
- Avoid cramped catalog density.
- Keep filtering and sorting controls separate from the grid component when possible.

## SectionHeading

- Must support eyebrow text, title, and optional description.
- Use heading levels correctly based on page context.
- Keep copy refined and concise.

## StorySection

- Use for brand storytelling, material narratives, and craftsmanship details.
- Support image and text layouts without locking into a single homepage design.
- Keep tone calm, editorial, and mature.

## MaterialHighlight

- Use for genuine cow leather details, texture, durability, and care notes.
- Pair concise copy with strong material imagery when available.
- Do not overclaim material quality.

## CTASection

- Use for refined inquiry, collection, or contact prompts.
- Keep CTA language calm and premium.
- Avoid urgency-heavy sales copy.

## WhatsAppButton

- Use accessible `a` links with clear labels.
- Include `aria-label` when the visible label is short.
- Keep styling consistent with the button rules.
- Do not make the button neon green or visually aggressive.
