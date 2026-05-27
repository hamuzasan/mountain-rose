import type { Metadata } from "next";

import CollectionsHero from "@/components/sections/CollectionsHero";
import CollectionsCatalog from "@/components/sections/CollectionsCatalog";
import { FALLBACK_PRODUCTS } from "@/data/fallbackProducts";
import { FALLBACK_SITE_SETTINGS } from "@/data/fallbackSiteSettings";
import { getAllCollections, getAllProducts, getSiteSettings } from "@/sanity/lib/queries";
import type { Product } from "@/types/product";

export const metadata: Metadata = {
  title: "Mountain Rose Collections | Tas Kulit Sapi Premium",
  description:
    "Jelajahi koleksi tas kulit sapi Mountain Rose dengan desain elegan, material asli, dan karakter timeless.",
};

function normalizeProduct(p: {
  _id: string;
  name: string;
  slug: string;
  price?: number;
  category?: string;
  shortDescription?: string;
  images?: Product["images"];
  leatherType?: string;
  color?: string;
  isFeatured?: boolean;
  isAvailable?: boolean;
  whatsAppMessage?: string;
}): Product {
  return {
    _id: p._id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    category: p.category,
    shortDescription: p.shortDescription,
    images: p.images,
    leatherType: p.leatherType,
    color: p.color,
    isFeatured: p.isFeatured,
    isAvailable: p.isAvailable,
    whatsAppMessage: p.whatsAppMessage,
  };
}

export default async function CollectionsPage() {
  const [cmsProducts, cmsSiteSettings] = await Promise.all([
    getAllProducts(),
    getSiteSettings(),
    getAllCollections(),
  ]);

  const siteSettings = cmsSiteSettings
    ? { ...FALLBACK_SITE_SETTINGS, ...cmsSiteSettings }
    : FALLBACK_SITE_SETTINGS;

  const products: Product[] =
    cmsProducts && cmsProducts.length > 0
      ? cmsProducts.map((p) => normalizeProduct(p as unknown as Product))
      : FALLBACK_PRODUCTS;

  return (
    <div className="bg-warmIvory">
      <CollectionsHero />
      <div className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-6">
        <CollectionsCatalog products={products} siteSettings={siteSettings} />
      </div>
    </div>
  );
}
