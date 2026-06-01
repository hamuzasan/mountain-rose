import Link from "next/link";
import Image from "next/image";

import type { SiteSettings } from "@/types/site";

import { formatProductPrice } from "@/lib/format";
import { getDisplayProductImage, getProductImageUrl } from "@/lib/product-images";
import SectionHeading from "./SectionHeading";
import ProductCard from "../ui/ProductCard";

type ProductLike = Parameters<typeof ProductCard>[0]["product"];

type FeaturedProductsProps = {
  products: ProductLike[];
  siteSettings: Pick<SiteSettings, "brandName" | "whatsappNumber">;
};

export default function FeaturedProducts({ products, siteSettings }: FeaturedProductsProps) {
  const limited = products.slice(0, 4);
  const [heroProduct, ...rest] = limited;

  return (
    <section className="bg-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-4 py-9 sm:px-6 sm:py-16">
        <div className="mb-6 flex items-center gap-4 lg:hidden">
          <div className="h-px flex-1 bg-mutedRose/70" />
          <h2 className="text-center text-sm font-semibold uppercase text-deepRose">
            Catalogue Picks
          </h2>
          <div className="h-px flex-1 bg-mutedRose/70" />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:hidden">
          {limited.map((product) => {
            const image = getDisplayProductImage(product.images);
            const imageUrl = getProductImageUrl(image);

            return (
              <Link
                key={product.slug}
                href={`/collections/${product.slug}`}
                className="group overflow-hidden border border-espresso/10 bg-bone shadow-soft"
              >
                <div className="relative aspect-[4/5] bg-warmIvory">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={image?.alt || `${product.name} - Mountain Rose cow leather bag`}
                      fill
                      sizes="50vw"
                      className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="absolute inset-4 border border-antiqueGold/25 bg-sand/25" />
                  )}
                </div>
                <div className="border-t border-espresso/10 bg-bone px-3 py-3 text-center">
                  <div className="line-clamp-2 min-h-10 font-semibold leading-5 text-espresso">
                    {product.name}
                  </div>
                  <div className="mt-2 text-sm font-medium text-mutedBrown">
                    {formatProductPrice(product)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 text-center lg:hidden">
          <Link
            href="/collections"
            className="inline-flex h-11 items-center justify-center rounded-full bg-espresso px-6 text-sm font-semibold text-warmIvory transition-colors hover:bg-darkLeather focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
          >
            View All Collections
          </Link>
        </div>

        <div className="hidden lg:block">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Catalogue Picks"
            title="Featured Pieces from the Mountain Rose Catalogue"
            description="Genuine cow leather bags presented with larger visual space so the shape, texture, and material character can be seen clearly."
          />
          <Link
            href="/collections"
            className="inline-flex h-10 items-center justify-center rounded-soft border border-espresso/15 bg-bone px-4 text-sm font-semibold text-espresso transition-colors hover:bg-warmIvory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
          >
            View All Collections
          </Link>
          </div>

          <div className="mt-10 grid gap-6">
          {heroProduct ? (
            <ProductCard
              product={heroProduct}
              siteSettings={siteSettings}
              showWhatsAppCta
              variant="feature"
              priority
            />
          ) : null}

          {rest.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <ProductCard
                  key={p.slug}
                  product={p}
                  siteSettings={siteSettings}
                  showWhatsAppCta
                />
              ))}
            </div>
          ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
