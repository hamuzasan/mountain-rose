"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { formatProductPrice } from "@/lib/format";
import { getOrderedProductImages, getProductImageUrl } from "@/lib/product-images";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Product, ProductImage } from "@/types/product";
import type { SiteSettings } from "@/types/site";

type HeroSectionProps = {
  title: string;
  subtitle: string;
  siteSettings: Pick<SiteSettings, "whatsappNumber" | "brandName">;
  products?: Product[];
};

type HeroProduct = Product & {
  heroImages: ProductImage[];
};

function getHeroProductImage(product: HeroProduct | null, imageIndex: number) {
  if (!product?.heroImages.length) {
    return { image: null, imageUrl: null };
  }

  const image = product.heroImages[imageIndex % product.heroImages.length] || null;

  return {
    image,
    imageUrl: getProductImageUrl(image),
  };
}

function getShortHeroTitle(title: string) {
  if (title.length <= 62) return title;
  return "Timeless Cow Leather Bags";
}

function getHeroTitleLines(title: string) {
  const words = title.trim().split(/\s+/).filter(Boolean);

  if (words.length >= 8) {
    return [
      words.slice(0, 3).join(" "),
      words.slice(3, 5).join(" "),
      words.slice(5, 7).join(" "),
      words.slice(7).join(" "),
    ];
  }

  if (words.length >= 5) {
    return [
      words.slice(0, 2).join(" "),
      words.slice(2, 4).join(" "),
      words.slice(4).join(" "),
    ];
  }

  return [title];
}

function HeroImagePlaceholder() {
  return (
    <div className="relative flex h-full min-h-[18rem] w-full items-center justify-center overflow-hidden bg-sand/30">
      <div className="absolute inset-8 rotate-[-5deg] border border-antiqueGold/25 bg-bone/40" />
      <div className="relative text-center">
        <div className="mx-auto h-14 w-14 rounded-full border border-espresso/10 bg-warmIvory" />
        <div className="mt-4 text-xs font-semibold uppercase text-mutedBrown">
          Mountain Rose Leather Goods
        </div>
      </div>
    </div>
  );
}

function ProductMiniStrip({
  products,
  activeIndex,
  onSelect,
}: {
  products: HeroProduct[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  if (products.length <= 1) return null;

  return (
    <div className="mt-5 flex items-center gap-3 overflow-x-auto pb-1">
      {products.map((product, index) => {
        const image = product.heroImages[0] || null;
        const imageUrl = getProductImageUrl(image);
        const active = index === activeIndex;

        return (
          <button
            key={product.slug}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={`Show ${product.name}`}
            aria-current={active}
            className={[
              "relative h-16 w-16 shrink-0 overflow-hidden border bg-bone transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70",
              active ? "border-antiqueGold" : "border-espresso/10 hover:border-espresso/25",
            ].join(" ")}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={image?.alt || `${product.name} thumbnail Mountain Rose`}
                fill
                sizes="64px"
                className="object-contain p-2"
                quality={45}
              />
            ) : (
              <span className="absolute inset-3 border border-antiqueGold/20" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function HeroSection({
  title,
  subtitle,
  siteSettings,
  products = [],
}: HeroSectionProps) {
  const heroProducts: HeroProduct[] = useMemo(
    () =>
      products
        .map((product) => ({
          ...product,
          heroImages: getOrderedProductImages(product.images),
        }))
        .filter((product) => product.heroImages.length > 0),
    [products],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (heroProducts.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroProducts.length);
    }, 6200);

    return () => window.clearInterval(timer);
  }, [heroProducts.length]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setImageIndex((current) => current + 1);
    }, 2400);

    return () => window.clearInterval(timer);
  }, []);

  const safeActiveIndex = heroProducts.length ? activeIndex % heroProducts.length : 0;
  const product = heroProducts[safeActiveIndex] || null;
  const { image, imageUrl } = getHeroProductImage(product, imageIndex);
  const productHref = product ? `/collections/${product.slug}` : "/collections";
  const waHref = buildWhatsAppLink(
    siteSettings.whatsappNumber,
    `Hello ${siteSettings.brandName}, I would like to ask about your cow leather bags.`,
  );
  const heroTitle = getShortHeroTitle(title);
  const heroTitleLines = getHeroTitleLines(heroTitle);
  const imageAlt =
    image?.alt ||
    (product ? `${product.name} - Mountain Rose cow leather bag` : "Mountain Rose cow leather bag");
  const heroImageKey = `${product?.slug || "product"}-${image?.storagePath || imageUrl || imageIndex}`;
  const catalogueCount = products.length || heroProducts.length || 0;

  return (
    <section className="overflow-hidden bg-warmIvory">
      <div className="lg:hidden">
        <div className="relative h-[calc(100svh-7rem)] min-h-[34rem] max-h-[42rem] overflow-hidden bg-bone">
          <div className="absolute inset-x-0 bottom-0 h-28 bg-sand/55" />
          <div className="absolute -left-16 top-24 h-48 w-48 rounded-full border border-antiqueGold/15" />
          <div className="absolute right-5 top-7 z-20 text-right">
            <div className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-mutedRose">
              Mountain Rose
            </div>
            <div className="mt-1 text-xs text-mutedBrown">Handmade cow leather</div>
          </div>

          <Link
            href={productHref}
            className="group absolute inset-x-4 top-8 z-10 h-[72%] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
            aria-label={product ? `View ${product.name}` : "View Mountain Rose collection"}
          >
            <div
              className="absolute inset-x-10 bottom-0 top-14 rotate-[-3deg] bg-sand/35 transition-transform duration-700 group-hover:rotate-[-1deg]"
              style={{ clipPath: "polygon(8% 4%, 96% 12%, 88% 95%, 12% 100%)" }}
            />
            <div key={`mobile-${heroImageKey}`} className="hero-product-in relative z-10 h-full">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 1023px) 100vw, 640px"
                  className="object-contain drop-shadow-[0_26px_34px_rgba(43,26,18,0.22)] transition-transform duration-700 group-hover:scale-[1.02]"
                  quality={75}
                  priority
                />
              ) : (
                <HeroImagePlaceholder />
              )}
            </div>
          </Link>

          <div className="absolute bottom-20 left-6 z-20 max-w-[16.5rem]">
            <div className="font-heading text-[2.35rem] leading-[0.94] text-charcoal">
              {(product?.name || "Mountain Rose").split(" ").map((word, index, words) => (
                <span key={`${word}-${index}`}>
                  {word}
                  {index < words.length - 1 ? " " : ""}
                </span>
              ))}
            </div>
          </div>

          <div className="absolute bottom-9 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {(heroProducts.length ? heroProducts : [null, null, null, null]).map(
              (item, index) => {
                const active = heroProducts.length ? index === safeActiveIndex : index === 0;

                return (
                  <button
                    key={item ? item.slug : `placeholder-${index}`}
                    type="button"
                    onClick={() => {
                      if (heroProducts.length) {
                        setActiveIndex(index);
                        setImageIndex(0);
                      }
                    }}
                    aria-label={
                      item ? `Show ${item.name}` : `Product slide ${index + 1}`
                    }
                    aria-current={active}
                    className={[
                      "h-3 w-3 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70",
                      active
                        ? "border-deepRose bg-deepRose"
                        : "border-dustyRose bg-warmIvory/70",
                    ].join(" ")}
                  />
                );
              },
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto hidden min-h-[calc(100vh-5rem)] w-full max-w-7xl gap-8 overflow-hidden px-5 py-8 sm:px-6 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-14">
        <div className="relative z-20 min-w-0 lg:col-span-5">
          <div className="inline-flex items-center gap-3 text-xs font-semibold uppercase text-mutedRose">
            <span className="h-px w-10 bg-mutedRose/60" />
            Handmade genuine cow leather from Indonesia
          </div>
          <h1 className="mt-5 max-w-2xl font-heading text-4xl leading-[0.96] text-charcoal sm:text-6xl lg:text-7xl">
            {heroTitleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-[23rem] text-base leading-8 text-mutedBrown sm:max-w-xl sm:text-lg">
            {subtitle}
          </p>

          <div className="mt-8 flex max-w-[23rem] flex-col gap-3 sm:max-w-none sm:flex-row">
            <Link
              href="/collections"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-espresso px-7 text-sm font-semibold text-warmIvory transition-colors hover:bg-darkLeather focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
            >
              Explore Collection
            </Link>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-espresso/20 bg-bone px-7 text-sm font-semibold text-espresso transition-colors hover:border-antiqueGold hover:bg-warmIvory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
              aria-label="Consult via WhatsApp"
            >
              Consult via WhatsApp
            </a>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 border-y border-espresso/10 py-5">
            <div>
              <div className="font-heading text-2xl text-espresso">100%</div>
              <div className="mt-1 text-xs font-semibold uppercase text-mutedBrown">
                Cow Leather
              </div>
            </div>
            <div>
              <div className="font-heading text-2xl text-espresso">{catalogueCount}</div>
              <div className="mt-1 text-xs font-semibold uppercase text-mutedBrown">
                Catalogue Styles
              </div>
            </div>
            <div>
              <div className="font-heading text-2xl text-espresso">ID</div>
              <div className="mt-1 text-xs font-semibold uppercase text-mutedBrown">
                Handmade
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-w-0 lg:col-span-7">
          <div className="absolute -right-20 top-0 hidden h-56 w-56 rounded-full border border-mutedRose/20 lg:block" />
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-4 hidden h-36 w-72 text-cognac/55 lg:block"
            viewBox="0 0 285 160"
            fill="none"
          >
            <path
              d="M6 113C34 72 80 111 62 133C42 158 18 119 58 92C98 65 126 108 105 127C88 143 70 118 96 92C129 58 171 77 166 111C160 151 112 118 142 78C168 43 223 50 242 18C251 2 269 7 279 20"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>

          <div className="relative mx-auto max-w-[23rem] sm:max-w-2xl">
            <Link
              href={productHref}
              className="group relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
              aria-label={product ? `View ${product.name}` : "View Mountain Rose collection"}
            >
              <div
                className="absolute inset-x-6 bottom-10 top-5 rotate-[-4deg] bg-sand/45 transition-transform duration-700 group-hover:rotate-[-2deg] sm:inset-x-16 lg:bottom-14 lg:top-8"
                style={{ clipPath: "polygon(10% 0%, 95% 8%, 88% 86%, 63% 96%, 15% 100%, 4% 23%)" }}
              />
              <div className="absolute right-4 top-20 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-espresso/15 bg-warmIvory/95 font-heading text-base text-espresso shadow-soft sm:right-12 lg:right-20">
                {product?.heroImages.length ? `${product.heroImages.length}v` : "MR"}
              </div>
              <div className="absolute left-0 top-28 z-20 flex h-20 w-20 items-center justify-center rounded-full border border-espresso/15 bg-warmIvory/95 text-center text-xs leading-4 text-espresso shadow-soft sm:left-12 lg:left-20 lg:h-24 lg:w-24">
                Genuine
                <br />
                Cowhide
              </div>
              <div key={`desktop-${heroImageKey}`} className="hero-product-in relative z-10 h-[25rem] sm:h-[34rem] lg:h-[38rem]">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    sizes="(min-width: 1024px) 640px, 100vw"
                    className="object-contain drop-shadow-[0_28px_36px_rgba(43,26,18,0.2)] transition-transform duration-700 group-hover:scale-[1.02]"
                    quality={75}
                    priority
                  />
                ) : (
                  <HeroImagePlaceholder />
                )}
              </div>
            </Link>

            <div className="relative z-30 mx-auto -mt-12 w-[calc(100%-2rem)] max-w-[34rem] rounded-[2rem] border border-espresso/10 bg-warmIvory/95 px-5 py-4 shadow-soft backdrop-blur-[2px] sm:-mt-16 lg:-mt-20">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-[0.12em] text-mutedRose">
                    {product?.category || "Mountain Rose"}
                  </div>
                  <h2 className="mt-1 font-heading text-2xl leading-tight text-espresso sm:text-3xl">
                    {product?.name || "Genuine Cow Leather Bag"}
                  </h2>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {product ? (
                    <div className="rounded-full border border-espresso/10 bg-bone px-4 py-2 text-xs font-semibold text-espresso">
                      {formatProductPrice(product)}
                    </div>
                  ) : null}
                  <Link
                    href={productHref}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-espresso px-5 text-sm font-semibold text-warmIvory transition-colors hover:bg-darkLeather focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
                  >
                    View Detail
                  </Link>
                </div>
              </div>
            </div>

            <ProductMiniStrip
              products={heroProducts}
              activeIndex={safeActiveIndex}
              onSelect={setActiveIndex}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
