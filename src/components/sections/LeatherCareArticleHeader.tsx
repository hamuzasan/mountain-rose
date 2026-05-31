import Image from "next/image";
import Link from "next/link";

import type { LeatherCareArticle } from "@/types/leatherCare";
import { formatDateID } from "@/lib/format";

type LeatherCareArticleHeaderProps = {
  article: LeatherCareArticle;
};

export default function LeatherCareArticleHeader({
  article,
}: LeatherCareArticleHeaderProps) {
  const date = formatDateID(article.publishedAt);
  const imgUrl = article.coverImageUrl || null;

  return (
    <section className="bg-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-5 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-12">
        <nav
          aria-label="Breadcrumb"
          className="text-xs font-semibold uppercase text-mutedBrown"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition-colors hover:text-espresso">
                Beranda
              </Link>
            </li>
            <li className="text-mutedBrown/60">/</li>
            <li>
              <Link
                href="/leather-care"
                className="transition-colors hover:text-espresso"
              >
                Perawatan Kulit
              </Link>
            </li>
            <li className="text-mutedBrown/60">/</li>
            <li className="text-mutedRose">{article.title}</li>
          </ol>
        </nav>

        <div className="mt-6 max-w-3xl">
          {date ? (
            <div className="text-xs font-semibold uppercase text-mutedRose">
              {date}
            </div>
          ) : null}
          <h1 className="mt-4 font-heading text-4xl leading-tight text-espresso sm:text-5xl">
            {article.title}
          </h1>
          {article.excerpt ? (
            <p className="mt-6 text-base leading-8 text-mutedBrown sm:text-lg">
              {article.excerpt}
            </p>
          ) : null}
        </div>

        <div className="mt-10">
          <div className="overflow-hidden rounded-soft border border-espresso/10 bg-bone">
            {imgUrl ? (
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={imgUrl}
                  alt={
                    article.coverImage?.alt ||
                    `${article.title} - perawatan kulit Mountain Rose`
                  }
                  fill
                  sizes="(min-width: 1024px) 960px, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="aspect-[16/9] w-full">
                <div className="flex h-full w-full items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-full border border-espresso/10 bg-warmIvory" />
                    <div className="mt-4 text-xs font-semibold uppercase text-mutedBrown">
                      Mountain Rose Leather Care
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
