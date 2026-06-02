import type { Metadata } from "next";

import FeaturedProducts from "@/components/sections/FeaturedProducts";
import HeroSection from "@/components/sections/HeroSection";
import HomeCTASection from "@/components/sections/HomeCTASection";
import HomeLookbookSection from "@/components/sections/HomeLookbookSection";
import InstagramShowcase from "@/components/sections/InstagramShowcase";
import LeatherHighlight from "@/components/sections/LeatherHighlight";
import OfflineStoreSection from "@/components/sections/OfflineStoreSection";
import RoseEditorialSection from "@/components/sections/RoseEditorialSection";
import { FALLBACK_HOMEPAGE, FALLBACK_FEATURED_PRODUCTS } from "@/data/fallbackHomepage";
import { FALLBACK_SITE_SETTINGS } from "@/data/fallbackSiteSettings";
import { getHomepage } from "@/data-access/homepage";
import { getInstagramEmbeds } from "@/data-access/instagram";
import { getAllProducts, getFeaturedProducts } from "@/data-access/products";
import { getSiteSettings } from "@/data-access/siteSettings";
import { createOrganizationJsonLd, createWebsiteJsonLd } from "@/lib/structuredData";
import type { Product } from "@/types/product";

const HOMEPAGE_PRODUCT_PRIORITY = [
  "papandayan-messenger",
  "sundaland-beauty-moon",
  "sundaland-beauty-rose",
  "adler",
  "sundaland-beauty-pouch",
  "papandayan-backpack",
];

function sortHomepageProducts(products: Product[]) {
  return [...products].sort((a, b) => {
    const aIndex = HOMEPAGE_PRODUCT_PRIORITY.indexOf(a.slug);
    const bIndex = HOMEPAGE_PRODUCT_PRIORITY.indexOf(b.slug);
    const safeA = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
    const safeB = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;

    return safeA - safeB;
  });
}

function hasRealCatalogueProducts(products: Product[]) {
  return products.some((product) => HOMEPAGE_PRODUCT_PRIORITY.includes(product.slug));
}

export const metadata: Metadata = {
  title: "Mountain Rose | Premium Cow Leather Bags",
  description:
    "Premium handmade genuine cow leather bags from Indonesia with timeless rose-inspired elegance.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const [cmsHomepage, cmsFeatured, allProducts, cmsSiteSettings, instagramEmbeds] = await Promise.all([
    getHomepage(),
    getFeaturedProducts(),
    getAllProducts(),
    getSiteSettings(),
    getInstagramEmbeds(),
  ]);

  const siteSettings = cmsSiteSettings
    ? { ...FALLBACK_SITE_SETTINGS, ...cmsSiteSettings }
    : FALLBACK_SITE_SETTINGS;

  const heroTitle = cmsHomepage?.heroTitle || FALLBACK_HOMEPAGE.heroTitle;
  const heroSubtitle = cmsHomepage?.heroSubtitle || FALLBACK_HOMEPAGE.heroSubtitle;

  const ctaTitle = cmsHomepage?.ctaTitle || FALLBACK_HOMEPAGE.ctaTitle;
  const ctaText = cmsHomepage?.ctaText || FALLBACK_HOMEPAGE.ctaText;

  const catalogueProducts =
    allProducts && hasRealCatalogueProducts(allProducts)
      ? sortHomepageProducts(allProducts)
      : [];
  const featuredProducts =
    cmsFeatured && hasRealCatalogueProducts(cmsFeatured)
      ? sortHomepageProducts(cmsFeatured)
      : catalogueProducts.length
        ? catalogueProducts.slice(0, 4)
        : FALLBACK_FEATURED_PRODUCTS;
  const visualProducts = catalogueProducts.length ? catalogueProducts : featuredProducts;
  const jsonLd = [createOrganizationJsonLd(), createWebsiteJsonLd()];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection
        title={heroTitle}
        subtitle={heroSubtitle}
        siteSettings={siteSettings}
        products={visualProducts}
      />
      <FeaturedProducts products={visualProducts} siteSettings={siteSettings} />
      <InstagramShowcase embeds={instagramEmbeds} siteSettings={siteSettings} />
      <LeatherHighlight />
      <HomeLookbookSection products={visualProducts} />
      <RoseEditorialSection />
      <OfflineStoreSection siteSettings={siteSettings} />
      <HomeCTASection title={ctaTitle} text={ctaText} siteSettings={siteSettings} />
    </>
  );
}
