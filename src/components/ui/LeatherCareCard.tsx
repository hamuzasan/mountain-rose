"use client";

import Image from "next/image";
import Link from "next/link";

import type { LeatherCareArticle } from "@/types/leatherCare";
import { formatDateID } from "@/lib/format";

type LeatherCareCardProps = {
  article: LeatherCareArticle;
};

export default function LeatherCareCard({ article }: LeatherCareCardProps) {
  const imgUrl = article.coverImageUrl || null;

  const date = formatDateID(article.publishedAt);

  return (
    <article className="group overflow-hidden rounded-soft border border-espresso/10 bg-bone">
      <Link href={`/leather-care/${article.slug}`} className="block">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-warmIvory">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={
                article.coverImage?.alt ||
                `${article.title} - perawatan kulit Mountain Rose`
              }
              fill
              sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full border border-espresso/10 bg-bone" />
                <div className="mt-3 text-xs font-semibold uppercase text-mutedBrown">
                  Mountain Rose Leather Care
                </div>
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="px-4 py-4">
        {date ? (
          <div className="text-xs font-semibold uppercase text-mutedRose">
            {date}
          </div>
        ) : null}
        <Link
          href={`/leather-care/${article.slug}`}
          className="mt-2 block font-heading text-lg leading-snug text-espresso transition-colors hover:text-darkLeather"
        >
          {article.title}
        </Link>
        {article.excerpt ? (
          <p className="mt-3 text-sm leading-7 text-mutedBrown">
            {article.excerpt}
          </p>
        ) : null}
        <div className="mt-5 inline-flex h-10 items-center justify-center rounded-soft border border-espresso/15 bg-warmIvory px-4 text-sm font-medium text-espresso transition-colors hover:bg-bone">
          Baca Artikel
        </div>
      </div>
    </article>
  );
}
