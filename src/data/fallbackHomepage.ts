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
  category?: string;
  shortDescription?: string;
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
  heroTitle: "Carry Your Story",
  heroSubtitle:
    "Mountain Rose menghadirkan tas kulit sapi asli handmade dari Indonesia, dibuat untuk ketahanan, estetika, dan perjalanan yang penuh cerita.",
  storySectionTitle: "Authenticity, Durability, and Aesthetics",
  storySectionText:
    "Berakar pada semangat alam dan keindahan pegunungan, setiap tas dibuat dari genuine cowhide dengan proses handmade oleh pengrajin lokal.",
  ctaTitle: "Temukan Tas Kulit yang Siap Menemani Perjalananmu",
  ctaText:
    "Konsultasikan pilihan model, ukuran, dan karakter tas langsung melalui WhatsApp.",
};

export const FALLBACK_FEATURED_PRODUCTS: FeaturedProductFallback[] = [
  {
    _id: "fallback-rosewood-tote",
    name: "Rosewood Tote",
    slug: "rosewood-tote",
    category: "Tote",
    leatherType: "Kulit sapi asli",
    shortDescription:
      "Siluet tote yang tenang, ruang lega, dan detail yang terasa rapi untuk rutinitas harian.",
    isFeatured: true,
    isAvailable: true,
    images: [
      {
        alt: "Rosewood Tote dalam nuansa kulit hangat (placeholder)",
      },
    ],
  },
  {
    _id: "fallback-alpine-sling",
    name: "Alpine Sling",
    slug: "alpine-sling",
    category: "Sling Bag",
    leatherType: "Kulit sapi asli",
    shortDescription:
      "Ringkas, elegan, dan terasa ringan untuk langkah yang lebih bebas, tanpa kehilangan karakter.",
    isFeatured: true,
    isAvailable: true,
    images: [
      {
        alt: "Alpine Sling dengan detail jahitan halus (placeholder)",
      },
    ],
  },
  {
    _id: "fallback-heritage-handbag",
    name: "Heritage Handbag",
    slug: "heritage-handbag",
    category: "Handbag",
    leatherType: "Kulit sapi asli",
    shortDescription:
      "Bentuk klasik yang matang, dibuat untuk menemani momen penting dengan kesan premium.",
    isFeatured: true,
    isAvailable: true,
    images: [
      {
        alt: "Heritage Handbag dengan tampilan editorial (placeholder)",
      },
    ],
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
