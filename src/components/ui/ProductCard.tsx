"use client";

import Image from "next/image";
import Link from "next/link";

import type { SiteSettings } from "@/types/site";

import { urlFor } from "@/sanity/lib/image";
import { buildDefaultProductWhatsAppMessage } from "@/data/fallbackHomepage";
import { formatCurrencyIDR } from "@/lib/format";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type ProductLike = {
  name: string;
  slug: string;
  price?: number;
  category?: string;
  shortDescription?: string;
  leatherType?: string;
  isAvailable?: boolean;
  images?: Array<{
    asset?: { _ref: string; _type: "reference" };
    alt?: string;
  }>;
  whatsAppMessage?: string;
};

type ProductCardProps = {
  product: ProductLike;
  siteSettings: Pick<SiteSettings, "brandName" | "whatsappNumber">;
  showWhatsAppCta?: boolean;
};

function formatIdr(amount: number) {
  return formatCurrencyIDR(amount);
}

export default function ProductCard({
  product,
  siteSettings,
  showWhatsAppCta = true,
}: ProductCardProps) {
  const primaryImage = product.images?.[0];
  const imgUrl = primaryImage?.asset
    ? urlFor(primaryImage)
        ?.width(900)
        .height(900)
        .fit("crop")
        .quality(80)
        .url()
    : null;

  const alt =
    primaryImage?.alt || `${product.name} - tas kulit sapi (Mountain Rose)`;

  const subLabel = product.category || product.leatherType || "Kulit sapi asli";
  const priceLabel =
    typeof product.price === "number" ? formatIdr(product.price) : null;

  const waMessage =
    product.whatsAppMessage ||
    buildDefaultProductWhatsAppMessage(siteSettings, product.name);
  const waHref = buildWhatsAppLink(siteSettings.whatsappNumber, waMessage);

  return (
    <article className="group overflow-hidden rounded-soft border border-espresso/10 bg-bone">
      <Link href={`/collections/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-warmIvory">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border border-espresso/10 bg-bone" />
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-col gap-3 px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={`/collections/${product.slug}`}
              className="font-heading text-base leading-6 text-espresso transition-colors hover:text-darkLeather"
            >
              {product.name}
            </Link>
            <div className="mt-1 text-xs font-medium text-mutedRose uppercase">
              {subLabel}
            </div>
            {(product.isAvailable ?? true) ? null : (
              <div className="mt-2 inline-flex items-center rounded-soft border border-espresso/10 bg-warmIvory px-2 py-1 text-[11px] font-semibold uppercase text-mutedBrown">
                Not Available
              </div>
            )}
          </div>
          {priceLabel ? (
            <div className="text-sm font-semibold text-espresso">
              {priceLabel}
            </div>
          ) : (
            <div className="text-xs font-medium text-mutedBrown">
              Hubungi untuk harga
            </div>
          )}
        </div>

        {product.shortDescription ? (
          <p className="text-sm leading-7 text-mutedBrown">
            {product.shortDescription}
          </p>
        ) : null}

        <div className="flex items-center gap-3 pt-1">
          <Link
            href={`/collections/${product.slug}`}
            className="inline-flex h-10 items-center justify-center rounded-soft border border-espresso/15 bg-warmIvory px-4 text-sm font-medium text-espresso transition-colors hover:bg-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
          >
            Lihat Detail
          </Link>
          {showWhatsAppCta && (product.isAvailable ?? true) ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Order ${product.name} via WhatsApp`}
              className="inline-flex h-10 items-center justify-center rounded-soft border border-brass/40 bg-espresso px-4 text-sm font-medium text-warmIvory transition-colors hover:bg-darkLeather focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
            >
              WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
