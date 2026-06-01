import type { SiteSettings } from "@/types/site";

export type HomepageFallback = {
  heroTitle: string;
  heroSubtitle: string;
  storySectionTitle: string;
  storySectionText: string;
  ctaTitle: string;
  ctaText: string;
};

export type FeaturedProductFallback = {
  _id: string;
  name: string;
  slug: string;
  price?: number;
  priceAmount?: number;
  priceCurrency?: string;
  priceNote?: string;
  category?: string;
  shortDescription?: string;
  material?: string;
  leatherType?: string;
  color?: string;
  isFeatured?: boolean;
  isAvailable?: boolean;
  images?: Array<{
    asset?: { _ref: string; _type: "reference" };
    alt?: string;
  }>;
  whatsAppMessage?: string;
};

export const FALLBACK_HOMEPAGE: HomepageFallback = {
  heroTitle: "Timeless Genuine Cow Leather Bags",
  heroSubtitle:
    "Mountain Rose creates handmade genuine cow leather bags from Indonesia, shaped with lasting character, careful detail, and quiet elegance.",
  storySectionTitle: "Authentic, Durable, and Full of Character",
  storySectionText:
    "Rooted in mountain calm and mature rose-inspired elegance, each piece is made from genuine cowhide by local craftsmen.",
  ctaTitle: "Find the Leather Bag That Carries Your Story",
  ctaText:
    "Consult with Mountain Rose to choose the shape, size, and character that fits your daily rhythm.",
};

export const FALLBACK_FEATURED_PRODUCTS: FeaturedProductFallback[] = [
  {
    _id: "fallback-papandayan-messenger",
    name: "Papandayan Messenger",
    slug: "papandayan-messenger",
    category: "Messenger Bag",
    material: "Genuine Cow Leather",
    leatherType: "Genuine Cow Leather",
    color: "Dark Brown",
    priceAmount: 75,
    priceCurrency: "USD",
    shortDescription:
      "A genuine cow leather messenger bag with a confident silhouette and practical daily space.",
    isFeatured: true,
    isAvailable: true,
    images: [],
  },
  {
    _id: "fallback-sundaland-beauty-moon",
    name: "Sundaland Beauty Moon",
    slug: "sundaland-beauty-moon",
    category: "Sling Bag",
    material: "Genuine Cow Leather",
    leatherType: "Genuine Cow Leather",
    color: "Black",
    priceAmount: 75,
    priceCurrency: "USD",
    shortDescription:
      "A compact genuine cow leather sling bag made for light travel and refined everyday use.",
    isFeatured: true,
    isAvailable: true,
    images: [],
  },
  {
    _id: "fallback-sundaland-beauty-rose",
    name: "Sundaland Beauty Rose",
    slug: "sundaland-beauty-rose",
    category: "Clutch & Sling Bag",
    material: "Genuine Cow Leather",
    leatherType: "Genuine Cow Leather",
    color: "Black",
    priceAmount: 75,
    priceCurrency: "USD",
    shortDescription:
      "A refined cow leather clutch and sling bag with an elegant rose accent.",
    isFeatured: true,
    isAvailable: true,
    images: [],
  },
  {
    _id: "fallback-adler",
    name: "Adler",
    slug: "adler",
    category: "Sling Bag",
    material: "Genuine Cow Leather (Crazy Horse)",
    leatherType: "Genuine Cow Leather (Crazy Horse)",
    color: "Brown",
    priceAmount: 50,
    priceCurrency: "USD",
    shortDescription:
      "A crazy horse cow leather sling bag with natural character and practical proportions.",
    isFeatured: true,
    isAvailable: true,
    images: [],
  },
];

export function buildDefaultProductWhatsAppMessage(
  siteSettings: Pick<SiteSettings, "brandName">,
  productName?: string,
) {
  const brand = siteSettings.brandName || "Mountain Rose";
  if (!productName) return `Hello ${brand}, I am interested in your cow leather bags.`;
  return `Hello ${brand}, I am interested in ${productName}. Could you share more details?`;
}
