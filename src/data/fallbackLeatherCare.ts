import type { LeatherCareArticle } from "@/types/leatherCare";

function isoDate(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

function sectionsToPortableText(
  heading: string,
  sections: string[],
): unknown[] {
  const blocks: unknown[] = [
    {
      _type: "block",
      children: [{ _type: "span", text: heading }],
    },
  ];

  sections.forEach((s) => {
    blocks.push({
      _type: "block",
      children: [{ _type: "span", text: `- ${s}` }],
    });
  });

  return blocks;
}

export const FALLBACK_LEATHER_CARE_ARTICLES: LeatherCareArticle[] = [
  {
    _id: "fallback-lc-1",
    title: "How to Keep a Cow Leather Bag Elegant",
    slug: "how-to-care-for-cow-leather-bags",
    excerpt:
      "A simple care guide to keep genuine cow leather clean, supple, and naturally beautiful.",
    content: sectionsToPortableText("Basic care:", [
      "Wipe gently with a soft cloth",
      "Avoid excess water",
      "Store in a dry, ventilated place",
      "Use leather conditioner sparingly",
    ]),
    coverImage: { alt: "Leather care (placeholder)" },
    publishedAt: isoDate(18),
  },
  {
    _id: "fallback-lc-2",
    title: "What to Avoid with Genuine Leather Bags",
    slug: "what-to-avoid-with-genuine-leather-bags",
    excerpt:
      "A few simple habits can help leather bags stay beautiful for longer.",
    content: sectionsToPortableText("Things to avoid:", [
      "Do not dry directly under harsh sunlight",
      "Avoid damp storage areas",
      "Do not use harsh chemical cleaners",
      "Avoid stacking overly heavy items on top",
    ]),
    coverImage: { alt: "Genuine leather bag care placeholder" },
    publishedAt: isoDate(26),
  },
  {
    _id: "fallback-lc-3",
    title: "Why Cow Leather Develops Character Over Time",
    slug: "why-cow-leather-develops-character",
    excerpt:
      "Genuine cow leather naturally develops a richer character through use and care.",
    content: sectionsToPortableText("Why it changes:", [
      "Natural leather texture",
      "Patina",
      "Color that becomes more mature",
      "Ways to keep the aging process beautiful",
    ]),
    coverImage: { alt: "Cow leather texture placeholder" },
    publishedAt: isoDate(35),
  },
  {
    _id: "fallback-lc-4",
    title: "How to Store a Leather Bag When Not in Use",
    slug: "how-to-store-leather-bags",
    excerpt:
      "Proper storage helps preserve the shape, color, and quality of genuine cow leather.",
    content: sectionsToPortableText("Storage tips:", [
      "Use a dust bag",
      "Fill the inside so the shape stays balanced",
      "Store in a place with good air circulation",
      "Take the bag out occasionally",
    ]),
    coverImage: { alt: "Leather bag storage placeholder" },
    publishedAt: isoDate(44),
  },
];
