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
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-warmIvory sm:aspect-[16/10]">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={
                article.coverImage?.alt ||
                `${article.title} - Mountain Rose leather care`
              }
              fill
              sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 rounded-full border border-espresso/10 bg-bone sm:h-12 sm:w-12" />
                <div className="mt-3 px-3 text-[0.65rem] font-semibold uppercase text-mutedBrown sm:text-xs">
                  Mountain Rose Leather Care
                </div>
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="px-3 py-3 sm:px-4 sm:py-4">
        {date ? (
          <div className="text-[0.65rem] font-semibold uppercase text-mutedRose sm:text-xs">
            {date}
          </div>
        ) : null}
        <Link
          href={`/leather-care/${article.slug}`}
          className="mt-2 line-clamp-3 block font-heading text-base leading-snug text-espresso transition-colors hover:text-darkLeather sm:text-lg"
        >
          {article.title}
        </Link>
        {article.excerpt ? (
          <p className="mt-3 hidden text-sm leading-7 text-mutedBrown sm:block">
            {article.excerpt}
          </p>
        ) : null}
        <div className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-soft border border-espresso/15 bg-warmIvory px-3 text-xs font-medium text-espresso transition-colors hover:bg-bone sm:mt-5 sm:h-10 sm:w-auto sm:px-4 sm:text-sm">
          Read Article
        </div>
      </div>
    </article>
  );
}
