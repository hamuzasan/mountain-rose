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

  const featuredProducts =
    cmsFeatured && cmsFeatured.length > 0 ? cmsFeatured : FALLBACK_FEATURED_PRODUCTS;
  const visualProducts = allProducts && allProducts.length > 0 ? allProducts : featuredProducts;
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
      <FeaturedProducts products={featuredProducts} siteSettings={siteSettings} />
      <HomeCategoryShowcase products={visualProducts} />
      <BrandStoryPreview title={storyTitle} text={storyText} />
      <LeatherHighlight />
      <HomeLookbookSection products={visualProducts} />
      <RoseEditorialSection />
      <HomeCTASection title={ctaTitle} text={ctaText} siteSettings={siteSettings} />
    </>
  );
}
