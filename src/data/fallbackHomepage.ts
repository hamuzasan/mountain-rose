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
  heroTitle: "Tas Kulit Sapi Asli dengan Karakter yang Bertahan Lama",
  heroSubtitle:
    "Mountain Rose menghadirkan tas kulit sapi handmade dari Indonesia, dirancang dengan karakter kuat, detail rapi, dan elegansi yang tidak lekang oleh waktu.",
  storySectionTitle: "Autentik, Tahan Lama, dan Berkarakter",
  storySectionText:
    "Berakar pada semangat alam dan keindahan pegunungan, setiap tas dibuat dari genuine cowhide dengan proses handmade oleh pengrajin lokal.",
  ctaTitle: "Temukan Tas Kulit yang Siap Menemani Perjalananmu",
  ctaText:
    "Konsultasikan pilihan model, ukuran, dan karakter tas langsung melalui WhatsApp.",
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
      "Messenger bag kulit sapi asli dengan siluet tegas dan ruang yang cukup untuk aktivitas harian.",
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
      "Sling bag kulit sapi asli yang ringkas, elegan, dan praktis untuk perjalanan ringan.",
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
      "Tas clutch dan sling kulit sapi asli dengan siluet rapi dan aksen rose yang elegan.",
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
      "Sling bag kulit sapi crazy horse dengan karakter natural dan proporsi praktis.",
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
  if (!productName) return `Halo ${brand}, saya tertarik dengan produk tas kulit sapi.`;
  return `Halo ${brand}, saya tertarik dengan ${productName}. Boleh info detailnya?`;
}
