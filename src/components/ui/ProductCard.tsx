"use client";

import Image from "next/image";
import Link from "next/link";

import type { SiteSettings } from "@/types/site";
import type { Product } from "@/types/product";

import { buildDefaultProductWhatsAppMessage } from "@/data/fallbackHomepage";
import { formatProductPrice } from "@/lib/format";
import { getDisplayProductImage, getProductImageUrl } from "@/lib/product-images";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type ProductCardProps = {
  product: Pick<
    Product,
    | "name"
    | "slug"
    | "price"
    | "priceAmount"
    | "priceCurrency"
    | "category"
    | "shortDescription"
    | "material"
    | "leatherType"
    | "isAvailable"
    | "images"
    | "whatsAppMessage"
  >;
  siteSettings: Pick<SiteSettings, "brandName" | "whatsappNumber">;
  showWhatsAppCta?: boolean;
  variant?: "default" | "feature";
  className?: string;
  priority?: boolean;
};

export default function ProductCard({
  product,
  siteSettings,
  showWhatsAppCta = true,
  variant = "default",
  className = "",
  priority = false,
}: ProductCardProps) {
  const primaryImage = getDisplayProductImage(product.images);
  const imgUrl = getProductImageUrl(primaryImage);

  const alt =
    primaryImage?.alt || `${product.name} - Mountain Rose cow leather bag`;

  const subLabel = product.category || product.leatherType || "Genuine cow leather";
  const priceLabel = formatProductPrice(product);

  const waMessage =
    product.whatsAppMessage ||
    buildDefaultProductWhatsAppMessage(siteSettings, product.name);
  const waHref = buildWhatsAppLink(siteSettings.whatsappNumber, waMessage);

  const isFeature = variant === "feature";

  return (
    <article
      className={[
        "group overflow-hidden rounded-soft border border-espresso/10 bg-bone transition-all duration-300 hover:-translate-y-1 hover:border-antiqueGold/50 hover:shadow-soft",
        isFeature ? "lg:grid lg:grid-cols-2 lg:items-stretch" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Link href={`/collections/${product.slug}`} className="block">
        <div
          className={[
            "relative w-full overflow-hidden bg-warmIvory",
            isFeature ? "aspect-[5/4] lg:h-full lg:min-h-[28rem]" : "aspect-[4/5]",
          ].join(" ")}
        >
          {imgUrl ? (
            <div className="absolute inset-3 sm:inset-7">
              <Image
                src={imgUrl}
                alt={alt}
                fill
                sizes={
                  isFeature
                    ? "(min-width: 1024px) 520px, 100vw"
                    : "(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                }
                className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                priority={priority}
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-8 rotate-[-5deg] border border-antiqueGold/20 bg-sand/35" />
              <div className="relative text-center">
                <div className="mx-auto h-14 w-14 rounded-full border border-espresso/10 bg-bone" />
                <div className="mt-4 text-xs font-semibold uppercase text-mutedBrown">
                  Mountain Rose Leather Goods
                </div>
              </div>
            </div>
          )}
          <div className="absolute left-2 top-2 max-w-[calc(100%-1rem)] rounded-soft border border-espresso/10 bg-bone/90 px-2 py-1 text-[0.6rem] font-semibold uppercase leading-tight text-mutedRose sm:left-4 sm:top-4 sm:px-3 sm:py-2 sm:text-xs">
            {subLabel}
          </div>
        </div>
      </Link>

      <div
        className={[
          "flex flex-col gap-2 px-3 py-3 sm:gap-3 sm:px-4 sm:py-4",
          isFeature ? "justify-between sm:px-6 sm:py-6" : "",
        ].join(" ")}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <Link
              href={`/collections/${product.slug}`}
              className={[
                "block font-heading leading-snug text-espresso transition-colors hover:text-darkLeather",
                isFeature ? "text-xl sm:text-3xl" : "text-sm sm:text-base",
              ].join(" ")}
            >
              {product.name}
            </Link>
            <div className="mt-1 line-clamp-1 text-[0.6rem] font-medium uppercase text-mutedRose sm:mt-2 sm:text-xs">
              {product.material || product.leatherType || "Genuine cow leather"}
            </div>
            {(product.isAvailable ?? true) ? null : (
              <div className="mt-2 inline-flex items-center rounded-soft border border-espresso/10 bg-warmIvory px-2 py-1 text-[11px] font-semibold uppercase text-mutedBrown">
                Not available
              </div>
            )}
          </div>
          {priceLabel ? (
            <div className="whitespace-nowrap text-xs font-semibold text-espresso sm:text-sm">
              {priceLabel}
            </div>
          ) : (
            <div className="text-xs font-medium text-mutedBrown">
              Ask for price
            </div>
          )}
        </div>

        {product.shortDescription ? (
          <p
            className={[
              "hidden text-sm leading-7 text-mutedBrown sm:block",
              isFeature ? "max-w-md sm:text-base sm:leading-8" : "",
            ].join(" ")}
          >
            {product.shortDescription}
          </p>
        ) : null}

        <div className="grid gap-2 pt-1 sm:flex sm:items-center sm:gap-3">
          <Link
            href={`/collections/${product.slug}`}
            className="inline-flex h-10 items-center justify-center rounded-soft border border-espresso/15 bg-warmIvory px-3 text-xs font-medium text-espresso transition-colors hover:bg-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70 sm:px-4 sm:text-sm"
          >
            View Detail
          </Link>
          {showWhatsAppCta && (product.isAvailable ?? true) ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Consult about ${product.name} via WhatsApp`}
              className="hidden h-10 items-center justify-center rounded-soft border border-brass/40 bg-espresso px-4 text-sm font-medium text-warmIvory transition-colors hover:bg-darkLeather focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70 sm:inline-flex"
            >
              WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
