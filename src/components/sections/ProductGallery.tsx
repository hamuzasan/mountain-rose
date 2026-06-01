"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { getOrderedProductImages, getProductImageUrl } from "@/lib/product-images";
import type { Product } from "@/types/product";

type ProductGalleryProps = {
  images: NonNullable<Product["images"]> | undefined;
  productName: string;
};

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const list = useMemo(() => getOrderedProductImages(images), [images]);
  const [activeIndex, setActiveIndex] = useState(0);

  const active = list[activeIndex] || list[0] || null;

  const activeUrl = useMemo(() => getProductImageUrl(active), [active]);

  const alt =
    active?.alt || `${productName} - Mountain Rose cow leather bag`;

  return (
    <div className="rounded-soft border border-espresso/10 bg-bone p-3 shadow-soft">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-soft bg-warmIvory">
        {activeUrl ? (
          <div className="absolute inset-6 sm:inset-10">
            <Image
              src={activeUrl}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-contain"
              priority
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-14 w-14 rounded-full border border-espresso/10 bg-bone" />
              <div className="mt-4 text-xs font-semibold uppercase text-mutedBrown">
                Mountain Rose Leather Goods
              </div>
            </div>
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-soft border border-espresso/10 bg-bone/90 px-3 py-2 text-xs font-semibold uppercase text-mutedRose">
          View {activeIndex + 1}
        </div>
      </div>

      {list.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 pt-3 sm:grid-cols-5">
          {list.slice(0, 5).map((img, idx) => {
            const thumbUrl = getProductImageUrl(img);

            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={[
                  "relative aspect-square overflow-hidden rounded-soft border transition-colors",
                  isActive ? "border-antiqueGold/70" : "border-espresso/10 hover:border-espresso/20",
                ].join(" ")}
                aria-label={`Show image ${idx + 1}`}
              >
                {thumbUrl ? (
                  <Image
                    src={thumbUrl}
                    alt={img.alt || `${productName} thumbnail ${idx + 1}`}
                    fill
                    sizes="64px"
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="absolute inset-0 bg-warmIvory" />
                )}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
