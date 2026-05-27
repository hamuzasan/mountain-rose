import type { Metadata } from "next";

import BrandStoryPreview from "@/components/sections/BrandStoryPreview";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import HeroSection from "@/components/sections/HeroSection";
import HomeCTASection from "@/components/sections/HomeCTASection";
import LeatherHighlight from "@/components/sections/LeatherHighlight";
import RoseEditorialSection from "@/components/sections/RoseEditorialSection";
import { FALLBACK_HOMEPAGE, FALLBACK_FEATURED_PRODUCTS } from "@/data/fallbackHomepage";
import { FALLBACK_SITE_SETTINGS } from "@/data/fallbackSiteSettings";
import { createOrganizationJsonLd, createWebsiteJsonLd } from "@/lib/structuredData";
import { getFeaturedProducts, getHomepage, getSiteSettings } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Mountain Rose | Tas Kulit Sapi Premium",
  description:
    "Tas kulit sapi asli dengan desain elegan terinspirasi dari mawar, dibuat untuk menemani perjalanan panjang.",
};

function portableTextToPlainText(value: unknown): string {
  if (!Array.isArray(value)) return "";

  const blocks = value.filter((v) => v && typeof v === "object") as Array<{
    _type?: string;
    children?: Array<{ text?: string }>;
  }>;

  const text = blocks
    .filter((b) => b._type === "block" && Array.isArray(b.children))
    .map((b) => (b.children || []).map((c) => c.text || "").join(""))
    .join("\n")
    .trim();

  return text;
}

export default async function Home() {
  const [cmsHomepage, cmsFeatured, cmsSiteSettings] = await Promise.all([
    getHomepage(),
    getFeaturedProducts(),
    getSiteSettings(),
  ]);

  const siteSettings = cmsSiteSettings
    ? { ...FALLBACK_SITE_SETTINGS, ...cmsSiteSettings }
    : FALLBACK_SITE_SETTINGS;

  const heroTitle = cmsHomepage?.heroTitle || FALLBACK_HOMEPAGE.heroTitle;
  const heroSubtitle = cmsHomepage?.heroSubtitle || FALLBACK_HOMEPAGE.heroSubtitle;
  const heroImage = cmsHomepage?.heroImage || null;

  const storyTitle = cmsHomepage?.storySectionTitle || FALLBACK_HOMEPAGE.storySectionTitle;
  const storyText =
    portableTextToPlainText(cmsHomepage?.storySectionText) ||
    FALLBACK_HOMEPAGE.storySectionText;

  const ctaTitle = cmsHomepage?.ctaTitle || FALLBACK_HOMEPAGE.ctaTitle;
  const ctaText = cmsHomepage?.ctaText || FALLBACK_HOMEPAGE.ctaText;

  const featuredProducts =
    cmsFeatured && cmsFeatured.length > 0 ? cmsFeatured : FALLBACK_FEATURED_PRODUCTS;
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
        heroImage={heroImage}
        siteSettings={siteSettings}
      />
      <FeaturedProducts products={featuredProducts} siteSettings={siteSettings} />
      <BrandStoryPreview title={storyTitle} text={storyText} />
      <LeatherHighlight />
      <RoseEditorialSection />
      <HomeCTASection title={ctaTitle} text={ctaText} siteSettings={siteSettings} />
    </>
  );
}
