"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { formatProductPrice } from "@/lib/format";
import {
  getOrderedProductImages,
  getProductImageUrl,
} from "@/lib/product-images";
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

function getHeroTitleLines(title: string): string[] {
  const words = title.trim().split(/\s+/).filter(Boolean);

  if (words.length <= 2) return [title];
  if (words.length === 3) return [words.slice(0, 1).join(" "), words.slice(1).join(" ")];
  if (words.length <= 4) {
    return [words.slice(0, 2).join(" "), words.slice(2).join(" ")];
  }

  return [
    words.slice(0, 1).join(" "),
    words.slice(1, 3).join(" "),
    words.slice(3).join(" "),
  ];
}

function DoodleLine({ placement }: { placement: "top" | "bottom" }) {
  if (placement === "top") {
    return (
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-24 z-0 hidden h-40 w-72 text-cognac/60 lg:block"
        viewBox="0 0 285 160"
        fill="none"
      >
        <path
          d="M6 113C34 72 80 111 62 133C42 158 18 119 58 92C98 65 126 108 105 127C88 143 70 118 96 92C129 58 171 77 166 111C160 151 112 118 142 78C168 43 223 50 242 18C251 2 269 7 279 20"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute bottom-8 left-0 z-0 hidden h-36 w-[34rem] text-saddle/45 lg:block"
      viewBox="0 0 535 145"
      fill="none"
    >
      <path
        d="M2 58C51 91 113 90 140 53C171 10 216 40 186 79C155 119 108 75 145 43C189 6 247 39 218 91C196 132 157 91 192 59C247 8 315 44 299 92C286 132 246 102 278 68C322 21 405 34 459 66C489 84 514 77 533 59"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeroProductCallout({
  product,
  position,
  imageIndex,
}: {
  product: HeroProduct | null;
  position: "left" | "right";
  imageIndex: number;
}) {
  const isLeft = position === "left";
  const { image, imageUrl } = getHeroProductImage(product, imageIndex);

  if (!product) {
    return (
      <div
        className={
          isLeft
            ? "relative z-30 mt-8 hidden lg:absolute lg:left-16 lg:top-[19rem] lg:mt-0 lg:block lg:w-64"
            : "relative z-30 mt-8 hidden lg:absolute lg:bottom-28 lg:right-16 lg:mt-0 lg:block lg:w-72"
        }
      >
        <div className="border border-espresso/10 bg-warmIvory/80 p-5 text-sm leading-7 text-mutedBrown">
          Tas kulit Mountain Rose akan tampil di sini saat data produk tersedia.
        </div>
      </div>
    );
  }

  return (
    <div
      key={product.slug}
      className={
        isLeft
          ? "hero-product-in relative z-30 mt-8 hidden lg:absolute lg:left-16 lg:top-[18.5rem] lg:mt-0 lg:block lg:w-64"
          : "hero-product-in relative z-30 mt-8 hidden lg:absolute lg:bottom-24 lg:right-16 lg:mt-0 lg:block lg:w-72"
      }
    >
      <Link
        href={`/collections/${product.slug}`}
        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
        aria-label={`Lihat detail ${product.name}`}
      >
        <div className="relative mx-auto h-40 w-full transition-transform duration-700 ease-out group-hover:-translate-y-1 sm:h-56 lg:h-52">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={
                image?.alt ||
                `${product.name} - tas kulit sapi Mountain Rose`
              }
              fill
              sizes="(min-width: 1024px) 280px, 85vw"
              className="object-contain drop-shadow-[0_18px_24px_rgba(43,26,18,0.16)] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center border border-espresso/10 bg-sand/30 text-xs font-semibold uppercase text-mutedBrown">
              Mountain Rose
            </div>
          )}
        </div>
        <div
          className={
            isLeft
              ? "mt-3 max-w-none text-left lg:max-w-56"
              : "mt-3 max-w-none text-left lg:ml-auto lg:max-w-64"
          }
        >
          <div className="text-xs font-semibold uppercase text-mutedRose">
            {product.category || product.leatherType || "Genuine cow leather"}
          </div>
          <h2 className="mt-1 font-heading text-2xl leading-tight text-espresso">
            {product.name}
          </h2>
          <p className="mt-2 text-sm leading-6 text-mutedBrown">
            {product.shortDescription ||
              "Tas kulit sapi asli dengan karakter hangat dan detail yang matang."}
          </p>
          <span className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full bg-espresso px-5 text-sm font-semibold text-warmIvory transition-colors group-hover:bg-darkLeather">
            Shop Now
          </span>
        </div>
      </Link>
    </div>
  );
}

function MobileHeroProductPanel({
  product,
  subtitle,
  waHref,
}: {
  product: HeroProduct | null;
  subtitle: string;
  waHref: string;
}) {
  return (
    <div className="relative z-40 mt-7 rounded-soft border border-espresso/10 bg-warmIvory/85 p-4 shadow-soft lg:hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase text-mutedRose">
            {product?.category || "Mountain Rose"}
          </div>
          <h2 className="mt-1 font-heading text-2xl leading-tight text-espresso">
            {product?.name || "Tas Kulit Sapi Asli"}
          </h2>
        </div>
        {product ? (
          <div className="shrink-0 rounded-full border border-espresso/10 bg-bone px-3 py-2 text-xs font-semibold text-espresso">
            {formatProductPrice(product)}
          </div>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-mutedBrown">
        {product?.shortDescription || subtitle}
      </p>
      <div className="mt-5 grid gap-3">
        <Link
          href={product ? `/collections/${product.slug}` : "/collections"}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-espresso px-5 text-sm font-semibold text-warmIvory transition-colors hover:bg-darkLeather focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
        >
          Lihat Detail
        </Link>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-espresso/20 bg-bone px-5 text-sm font-semibold text-espresso transition-colors hover:border-antiqueGold hover:bg-warmIvory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
          aria-label="Order via WhatsApp"
        >
          Order via WhatsApp
        </a>
      </div>
    </div>
  );
}

function HeroImagePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center border border-espresso/10 bg-sand/30 text-xs font-semibold uppercase text-mutedBrown">
      Mountain Rose
    </div>
  );
}

export default function HeroSection({
  title,
  subtitle,
  siteSettings,
  products = [],
}: HeroSectionProps) {
  const waHref = buildWhatsAppLink(
    siteSettings.whatsappNumber,
    `Halo ${siteSettings.brandName}, saya ingin konsultasi tas kulit sapi.`,
  );
  const titleLines = getHeroTitleLines(title);
  const heroProducts: HeroProduct[] = useMemo(
    () =>
      products
        .map((product) => {
          const orderedImages = getOrderedProductImages(product.images);

          return {
            ...product,
            heroImages: orderedImages,
          };
        })
        .filter((product) => product.heroImages.length > 0)
        .slice(0, 6),
    [products],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (heroProducts.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroProducts.length);
    }, 5600);

    return () => window.clearInterval(timer);
  }, [heroProducts.length]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setImageIndex((current) => current + 1);
    }, 2200);

    return () => window.clearInterval(timer);
  }, []);

  const safeActiveIndex = heroProducts.length ? activeIndex % heroProducts.length : 0;
  const mainProduct = heroProducts[safeActiveIndex] || null;
  const leftProduct =
    heroProducts.length > 1 ? heroProducts[(safeActiveIndex + 1) % heroProducts.length] : null;
  const rightProduct =
    heroProducts.length > 2 ? heroProducts[(safeActiveIndex + 2) % heroProducts.length] : null;
  const mainHeroImage = getHeroProductImage(mainProduct, imageIndex);
  const mainProductHref = mainProduct ? `/collections/${mainProduct.slug}` : "/collections";
  const mainImageAlt =
    mainHeroImage.image?.alt ||
    (mainProduct ? `${mainProduct.name} - tas kulit sapi Mountain Rose` : "Mountain Rose bag");

  return (
    <section className="bg-warmIvory px-0 pb-0 pt-0">
      <div className="mx-auto w-full bg-bone">
        <div className="relative isolate mx-auto min-h-[44rem] overflow-hidden bg-bone px-5 pb-20 pt-10 sm:px-8 lg:min-h-[52rem] lg:px-14 lg:pt-16">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-sand/45">
            <svg
              aria-hidden="true"
              className="absolute -top-8 left-0 h-12 w-full text-bone"
              viewBox="0 0 1440 80"
              preserveAspectRatio="none"
              fill="currentColor"
            >
              <path d="M0 32C170 64 330 4 520 30C724 58 845 42 1020 26C1208 8 1328 34 1440 18V80H0V32Z" />
            </svg>
          </div>

          <DoodleLine placement="top" />
          <DoodleLine placement="bottom" />

          <div className="relative z-30 text-center">
            <p className="mx-auto max-w-2xl text-xs font-semibold uppercase text-mutedRose">
              <span className="sm:hidden">Handmade Cow Leather</span>
              <span className="hidden sm:inline">
                Handmade genuine cow leather from Indonesia
              </span>
            </p>
            <h1 className="mx-auto mt-5 max-w-5xl font-heading text-5xl leading-[0.94] text-charcoal sm:text-7xl lg:text-8xl">
              {titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
          </div>

          <div className="relative z-20 mx-auto mt-9 max-w-[18.5rem] sm:max-w-md lg:absolute lg:left-1/2 lg:top-[22rem] lg:mt-0 lg:w-[25rem] lg:max-w-none lg:-translate-x-1/2">
            <Link
              href={mainProductHref}
              className="group relative block min-h-[20rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70 sm:min-h-[25rem]"
              aria-label={
                mainProduct ? `Lihat detail ${mainProduct.name}` : "Lihat koleksi Mountain Rose"
              }
            >
              <div className="absolute inset-x-8 bottom-8 top-2 z-0 rotate-[-7deg] bg-sand/45 transition-transform duration-700 ease-out group-hover:rotate-[-3deg]" />
              <div className="absolute right-1 top-16 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-espresso/25 bg-warmIvory/95 font-heading text-base text-espresso shadow-soft lg:-right-3 lg:top-20 lg:h-14 lg:w-14 lg:text-lg">
                {mainProduct?.heroImages.length ? `${mainProduct.heroImages.length}v` : "MR"}
              </div>
              <div className="absolute left-0 top-24 z-20 flex h-20 w-20 items-center justify-center rounded-full border border-espresso/20 bg-warmIvory/95 text-center text-xs leading-4 text-espresso shadow-soft lg:-left-5 lg:top-28 lg:h-28 lg:w-28 lg:text-sm lg:leading-5">
                Handmade
                <br />
                Cowhide
              </div>
              <div
                key={mainProduct?.slug || "hero-placeholder"}
                className="hero-product-in relative z-10 mx-auto h-[18rem] w-full transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:scale-[1.02] sm:h-[24rem] lg:h-[22rem]"
              >
                {mainHeroImage.imageUrl ? (
                  <Image
                    key={`${mainProduct?.slug || "product"}-${mainHeroImage.image?.storagePath || imageIndex}`}
                    src={mainHeroImage.imageUrl}
                    alt={mainImageAlt}
                    fill
                    sizes="(min-width: 1024px) 440px, 90vw"
                    className="object-contain drop-shadow-[0_28px_32px_rgba(43,26,18,0.2)]"
                    priority
                  />
                ) : (
                  <HeroImagePlaceholder />
                )}
              </div>
            </Link>
            {heroProducts.length > 1 ? (
              <div
                className="relative z-40 mx-auto mt-1 flex w-fit items-center gap-3"
                aria-label="Hero product slider"
              >
                {heroProducts.map((product, index) => (
                  <button
                    key={product.slug}
                    type="button"
                    aria-label={`Tampilkan ${product.name}`}
                    aria-current={index === safeActiveIndex}
                    onClick={() => setActiveIndex(index)}
                    className={[
                      "h-3 w-3 rounded-full border border-espresso/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70",
                      index === safeActiveIndex
                        ? "bg-antiqueGold"
                        : "bg-espresso/25 hover:bg-mutedBrown",
                    ].join(" ")}
                  />
                ))}
              </div>
            ) : null}
            <MobileHeroProductPanel product={mainProduct} subtitle={subtitle} waHref={waHref} />
          </div>

          <HeroProductCallout product={leftProduct} position="left" imageIndex={imageIndex + 1} />
          <HeroProductCallout product={rightProduct} position="right" imageIndex={imageIndex + 2} />

          {mainProduct ? (
            <div className="absolute bottom-10 left-1/2 z-40 hidden w-[26rem] -translate-x-1/2 items-center justify-between gap-5 rounded-soft border border-espresso/10 bg-warmIvory/95 px-5 py-3 text-sm text-mutedBrown shadow-soft lg:flex">
              <div className="min-w-0">
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  {mainProduct.category || "Mountain Rose"}
                </div>
                <div className="mt-1 truncate font-heading text-lg leading-tight text-espresso">
                  {mainProduct.name}
                </div>
              </div>
              <span className="shrink-0 font-semibold text-espresso">
                {formatProductPrice(mainProduct)}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
