"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { urlFor } from "@/sanity/lib/image";
import type { Product } from "@/types/product";

type ProductGalleryProps = {
  images: NonNullable<Product["images"]> | undefined;
  productName: string;
};

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const list = images || [];
  const [activeIndex, setActiveIndex] = useState(0);

  const active = list[activeIndex] || list[0] || null;

  const activeUrl = useMemo(() => {
    if (!active?.asset) return null;
    return urlFor(active)
      ?.width(1600)
      .height(1600)
      .fit("crop")
      .quality(85)
      .url();
  }, [active]);

  const alt =
    active?.alt || `${productName} - tas kulit sapi (Mountain Rose)`;

  return (
    <div className="rounded-soft border border-espresso/10 bg-bone">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-soft bg-warmIvory">
        {activeUrl ? (
          <Image
            src={activeUrl}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 520px, 100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-14 w-14 rounded-full border border-espresso/10 bg-bone" />
              <div className="mt-4 text-xs font-semibold uppercase text-mutedBrown">
                Mountain Rose
              </div>
            </div>
          </div>
        )}
      </div>

      {list.length > 1 ? (
        <div className="grid grid-cols-5 gap-3 p-4">
          {list.slice(0, 5).map((img, idx) => {
            const thumbUrl = img.asset
              ? urlFor(img)
                  ?.width(320)
                  .height(320)
                  .fit("crop")
                  .quality(75)
                  .url()
              : null;

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
                aria-label={`View image ${idx + 1}`}
              >
                {thumbUrl ? (
                  <Image
                    src={thumbUrl}
                    alt={img.alt || `${productName} thumbnail ${idx + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
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

