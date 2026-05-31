import type { Metadata } from "next";

import BrandStoryPreview from "@/components/sections/BrandStoryPreview";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import HomeCategoryShowcase from "@/components/sections/HomeCategoryShowcase";
import HeroSection from "@/components/sections/HeroSection";
import HomeCTASection from "@/components/sections/HomeCTASection";
import HomeLookbookSection from "@/components/sections/HomeLookbookSection";
import LeatherHighlight from "@/components/sections/LeatherHighlight";
import RoseEditorialSection from "@/components/sections/RoseEditorialSection";
import { FALLBACK_HOMEPAGE, FALLBACK_FEATURED_PRODUCTS } from "@/data/fallbackHomepage";
import { FALLBACK_SITE_SETTINGS } from "@/data/fallbackSiteSettings";
import { getHomepage } from "@/data-access/homepage";
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
  title: "Mountain Rose | Tas Kulit Sapi Premium",
  description:
    "Tas kulit sapi asli dengan desain elegan terinspirasi dari mawar, dibuat untuk menemani perjalanan panjang.",
};

export default async function Home() {
  const [cmsHomepage, cmsFeatured, allProducts, cmsSiteSettings] = await Promise.all([
    getHomepage(),
    getFeaturedProducts(),
    getAllProducts(),
    getSiteSettings(),
  ]);

  const siteSettings = cmsSiteSettings
    ? { ...FALLBACK_SITE_SETTINGS, ...cmsSiteSettings }
    : FALLBACK_SITE_SETTINGS;

  const heroTitle = cmsHomepage?.heroTitle || FALLBACK_HOMEPAGE.heroTitle;
  const heroSubtitle = cmsHomepage?.heroSubtitle || FALLBACK_HOMEPAGE.heroSubtitle;

  const storyTitle = cmsHomepage?.storySectionTitle || FALLBACK_HOMEPAGE.storySectionTitle;
  const storyText = cmsHomepage?.storySectionText || FALLBACK_HOMEPAGE.storySectionText;

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
        products={featuredProducts}
      />
      <HomeCategoryShowcase products={visualProducts} />
      <FeaturedProducts products={featuredProducts} siteSettings={siteSettings} />
      <BrandStoryPreview title={storyTitle} text={storyText} />
      <LeatherHighlight />
      <HomeLookbookSection products={visualProducts} />
      <RoseEditorialSection />
      <HomeCTASection title={ctaTitle} text={ctaText} siteSettings={siteSettings} />
    </>
  );
}
