import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/config/site";
import { getFallbackLeatherCareArticles } from "@/lib/leatherCare";
import { getFallbackProducts } from "@/lib/products";
import { getAllProducts } from "@/data-access/products";
import { getLeatherCareArticles } from "@/sanity/lib/queries";

type SitemapEntry = MetadataRoute.Sitemap[number];

function entry(
  path: string,
  priority: number,
  changeFrequency: SitemapEntry["changeFrequency"],
): SitemapEntry {
  return {
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cmsProducts, cmsArticles] = await Promise.all([
    getAllProducts(),
    getLeatherCareArticles(),
  ]);

  const products =
    cmsProducts && cmsProducts.length > 0 ? cmsProducts : getFallbackProducts();
  const articles =
    cmsArticles && cmsArticles.length > 0
      ? cmsArticles
      : getFallbackLeatherCareArticles();

  const staticPages: MetadataRoute.Sitemap = [
    entry("/", 1, "weekly"),
    entry("/collections", 0.9, "weekly"),
    entry("/story", 0.7, "monthly"),
    entry("/leather-care", 0.7, "weekly"),
    entry("/contact", 0.6, "monthly"),
  ];

  const productPages: MetadataRoute.Sitemap = products
    .filter((p) => Boolean(p.slug))
    .map((p) => entry(`/collections/${p.slug}`, 0.8, "weekly"));

  const articlePages: MetadataRoute.Sitemap = articles
    .filter((a) => Boolean(a.slug))
    .map((a) => {
      const publishedDate = a.publishedAt ? new Date(a.publishedAt) : null;
      return {
        ...entry(`/leather-care/${a.slug}`, 0.6, "monthly"),
        lastModified:
          publishedDate && !Number.isNaN(publishedDate.getTime())
            ? publishedDate
            : new Date(),
      };
    });

  return [...staticPages, ...productPages, ...articlePages];
}
