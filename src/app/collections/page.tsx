import type { Metadata } from "next";

import CollectionsHero from "@/components/sections/CollectionsHero";
import CollectionsCatalog from "@/components/sections/CollectionsCatalog";
import { FALLBACK_SITE_SETTINGS } from "@/data/fallbackSiteSettings";
import { getAllProducts } from "@/data-access/products";
import { getSiteSettings } from "@/data-access/siteSettings";

export const metadata: Metadata = {
  title: "Mountain Rose Collections | Premium Cow Leather Bags",
  description:
    "Explore Mountain Rose genuine cow leather bags with timeless design, handmade details, and premium material character.",
};

export default async function CollectionsPage() {
  const [cmsProducts, cmsSiteSettings] = await Promise.all([
    getAllProducts(),
    getSiteSettings(),
  ]);

  const siteSettings = cmsSiteSettings
    ? { ...FALLBACK_SITE_SETTINGS, ...cmsSiteSettings }
    : FALLBACK_SITE_SETTINGS;

  const products = cmsProducts && cmsProducts.length > 0 ? cmsProducts : [];

  return (
    <div className="bg-warmIvory">
      <CollectionsHero />
      <div className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-6">
        <CollectionsCatalog products={products} siteSettings={siteSettings} />
      </div>
    </div>
  );
}
