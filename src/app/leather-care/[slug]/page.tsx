import type { Metadata } from "next";
import { notFound } from "next/navigation";

import LeatherCareArticleContent from "@/components/sections/LeatherCareArticleContent";
import LeatherCareArticleHeader from "@/components/sections/LeatherCareArticleHeader";
import LeatherCareCTASection from "@/components/sections/LeatherCareCTASection";
import { FALLBACK_SITE_SETTINGS } from "@/data/fallbackSiteSettings";
import { getFallbackLeatherCareArticleBySlug, getFallbackLeatherCareArticles } from "@/lib/leatherCare";
import { getLeatherCareArticleBySlug, getLeatherCareArticles } from "@/data-access/leatherCare";
import { getSiteSettings } from "@/data-access/siteSettings";
import type { LeatherCareArticle } from "@/types/leatherCare";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type CmsLeatherCareArticle = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: unknown[];
  coverImage?: LeatherCareArticle["coverImage"];
  coverImageUrl?: string;
  publishedAt?: string;
};

function toArticle(a: {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: unknown[];
  coverImage?: LeatherCareArticle["coverImage"];
  coverImageUrl?: string;
  publishedAt?: string;
}): LeatherCareArticle {
  return {
    _id: a._id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    content: a.content,
    coverImage: a.coverImage,
    coverImageUrl: a.coverImageUrl,
    publishedAt: a.publishedAt,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fallback = getFallbackLeatherCareArticleBySlug(slug);
  const cms = fallback ? null : await getLeatherCareArticleBySlug(slug);
  const article = cms ? toArticle(cms as unknown as CmsLeatherCareArticle) : fallback;

  if (!article) return { title: "Leather Care | Mountain Rose" };

  return {
    title: `${article.title} | Mountain Rose Leather Care`,
    description:
      article.excerpt ||
      "Care guidance for genuine cow leather bags so they stay elegant, strong, and characterful over time.",
  };
}

export async function generateStaticParams() {
  const fallback = getFallbackLeatherCareArticles().map((a) => ({ slug: a.slug }));
  const cms = await getLeatherCareArticles();
  const cmsSlugs = (cms || [])
    .map((a) => a.slug)
    .filter((s): s is string => Boolean(s))
    .map((slug) => ({ slug }));

  const map = new Map<string, { slug: string }>();
  [...fallback, ...cmsSlugs].forEach((p) => map.set(p.slug, p));
  return [...map.values()];
}

export default async function LeatherCareArticlePage({ params }: PageProps) {
  const { slug } = await params;

  const [cmsSiteSettings, fallbackArticle, cmsArticle] = await Promise.all([
    getSiteSettings(),
    Promise.resolve(getFallbackLeatherCareArticleBySlug(slug)),
    getLeatherCareArticleBySlug(slug),
  ]);

  const siteSettings = cmsSiteSettings
    ? { ...FALLBACK_SITE_SETTINGS, ...cmsSiteSettings }
    : FALLBACK_SITE_SETTINGS;

  const article: LeatherCareArticle | null = fallbackArticle
    ? fallbackArticle
    : cmsArticle
      ? toArticle(cmsArticle as unknown as CmsLeatherCareArticle)
      : null;

  if (!article) notFound();

  return (
    <div className="bg-warmIvory">
      <LeatherCareArticleHeader article={article} />
      <LeatherCareArticleContent article={article} />
      <LeatherCareCTASection siteSettings={siteSettings} />
    </div>
  );
}
