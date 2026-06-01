import type { Metadata } from "next";

import LeatherCareCTASection from "@/components/sections/LeatherCareCTASection";
import LeatherCareGrid from "@/components/sections/LeatherCareGrid";
import LeatherCareHero from "@/components/sections/LeatherCareHero";
import { FALLBACK_SITE_SETTINGS } from "@/data/fallbackSiteSettings";
import { FALLBACK_LEATHER_CARE_ARTICLES } from "@/data/fallbackLeatherCare";
import { getLeatherCareArticles } from "@/data-access/leatherCare";
import { getSiteSettings } from "@/data-access/siteSettings";
import type { LeatherCareArticle } from "@/types/leatherCare";

export const metadata: Metadata = {
  title: "Leather Care | Mountain Rose",
  description:
    "Care guidance for genuine cow leather bags so they stay elegant, strong, and naturally characterful over time.",
};

function toArticle(a: {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: LeatherCareArticle["coverImage"];
  coverImageUrl?: string;
  publishedAt?: string;
}): LeatherCareArticle {
  return {
    _id: a._id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    coverImage: a.coverImage,
    coverImageUrl: a.coverImageUrl,
    publishedAt: a.publishedAt,
  };
}

export default async function LeatherCarePage() {
  const [cmsArticles, cmsSiteSettings] = await Promise.all([
    getLeatherCareArticles(),
    getSiteSettings(),
  ]);

  const siteSettings = cmsSiteSettings
    ? { ...FALLBACK_SITE_SETTINGS, ...cmsSiteSettings }
    : FALLBACK_SITE_SETTINGS;

  const articles =
    cmsArticles && cmsArticles.length > 0
      ? (cmsArticles as unknown as Array<{
          _id: string;
          title: string;
          slug: string;
          excerpt?: string;
          coverImage?: LeatherCareArticle["coverImage"];
          coverImageUrl?: string;
          publishedAt?: string;
        }>).map((a) => toArticle(a))
      : FALLBACK_LEATHER_CARE_ARTICLES;

  return (
    <div className="bg-warmIvory">
      <LeatherCareHero />
      <div className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-6">
        <LeatherCareGrid articles={articles} />
      </div>
      <LeatherCareCTASection siteSettings={siteSettings} />
    </div>
  );
}
