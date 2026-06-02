import Link from "next/link";
import Image from "next/image";

import type { SiteSettings } from "@/types/site";

import { formatProductPrice } from "@/lib/format";
import { getDisplayProductImage, getProductImageUrl } from "@/lib/product-images";
import ProductCard from "../ui/ProductCard";

type ProductLike = Parameters<typeof ProductCard>[0]["product"];

type FeaturedProductsProps = {
  products: ProductLike[];
  siteSettings: Pick<SiteSettings, "brandName" | "whatsappNumber">;
};

export default function FeaturedProducts({ products, siteSettings }: FeaturedProductsProps) {
  const editorialProducts = products.slice(0, 3);
  const remainingProducts = products.slice(3);

  return (
    <section className="bg-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 flex flex-col gap-4 border-b border-espresso/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mutedRose">
              Premium Leather Lookbook
            </p>
            <h2 className="mt-3 max-w-2xl font-heading text-4xl leading-tight text-charcoal sm:text-5xl">
              Catalogue pieces with stronger visual presence.
            </h2>
          </div>
          <Link
            href="/collections"
            className="inline-flex min-h-11 w-max items-center justify-center rounded-soft border border-espresso/15 bg-bone px-5 text-sm font-semibold text-espresso transition-colors hover:bg-warmIvory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
          >
            View All Collections
          </Link>
        </div>

        {editorialProducts.length ? (
          <div className="space-y-6 lg:hidden">
            {editorialProducts.map((product, index) => {
            const image = getDisplayProductImage(product.images);
            const imageUrl = getProductImageUrl(image);

            return (
              <Link
                key={product.slug}
                href={`/collections/${product.slug}`}
                className="group block"
              >
                <article className="relative min-h-[22rem] overflow-hidden border border-espresso/10 bg-bone shadow-soft">
                  <div className="absolute inset-x-0 top-0 h-[74%] bg-sand/45">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={image?.alt || `${product.name} - Mountain Rose cow leather bag`}
                        fill
                        sizes="100vw"
                        className="object-contain p-5 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        priority={index === 0}
                        quality={index === 0 ? 75 : 65}
                      />
                    ) : (
                      <div className="absolute inset-8 border border-antiqueGold/25 bg-warmIvory/45" />
                    )}
                  </div>
                  <div
                    className={[
                      "absolute bottom-5 w-[72%] border p-4 shadow-soft",
                      index === 0
                        ? "right-5 border-espresso/10 bg-warmIvory text-espresso"
                        : index === 1
                          ? "left-5 border-deepRose bg-deepRose text-warmIvory"
                          : "right-5 border-darkLeather bg-darkLeather text-warmIvory",
                    ].join(" ")}
                  >
                    <p
                      className={[
                        "text-[0.65rem] font-semibold uppercase tracking-[0.16em]",
                        index === 0 ? "text-mutedRose" : "text-dustyRose",
                      ].join(" ")}
                    >
                      {product.category || "Leather Bag"}
                    </p>
                    <h3 className="mt-2 font-heading text-xl leading-tight">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm font-semibold">
                      {formatProductPrice(product)}
                    </p>
                  </div>
                </article>
              </Link>
            );
            })}
          </div>
        ) : null}

        {editorialProducts.length ? (
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-7">
            {editorialProducts.map((product, index) => {
              const image = getDisplayProductImage(product.images);
              const imageUrl = getProductImageUrl(image);
              const isPrimary = index === 0;

              return (
                <Link
                  key={product.slug}
                  href={`/collections/${product.slug}`}
                  className={[
                    "group relative block overflow-visible",
                    isPrimary ? "col-span-5 row-span-2 min-h-[36rem]" : "col-span-7 min-h-[17.5rem]",
                    index === 2 ? "col-start-7" : "",
                  ].join(" ")}
                >
                  <article
                    className={[
                      "relative h-full overflow-hidden border border-espresso/10 bg-sand/45 shadow-soft",
                      isPrimary ? "mr-10" : index === 1 ? "ml-16" : "mr-16",
                    ].join(" ")}
                  >
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={image?.alt || `${product.name} - Mountain Rose cow leather bag`}
                        fill
                        sizes={isPrimary ? "40vw" : "55vw"}
                        className="object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                        priority={index === 0}
                        quality={index === 0 ? 75 : 65}
                      />
                    ) : (
                      <div className="absolute inset-10 border border-antiqueGold/25 bg-warmIvory/45" />
                    )}
                  </article>

                  <div
                    className={[
                      "absolute z-10 w-56 border p-5 shadow-soft transition-transform duration-300 group-hover:-translate-y-1",
                      isPrimary
                        ? "right-0 top-14 border-espresso/10 bg-warmIvory text-espresso"
                        : index === 1
                          ? "left-0 top-12 border-deepRose bg-deepRose text-warmIvory"
                          : "right-0 top-10 border-darkLeather bg-darkLeather text-warmIvory",
                    ].join(" ")}
                  >
                    <p
                      className={[
                        "text-xs font-semibold uppercase tracking-[0.16em]",
                        isPrimary ? "text-mutedRose" : "text-dustyRose",
                      ].join(" ")}
                    >
                      {product.category || "Leather Bag"}
                    </p>
                    <h3 className="mt-3 font-heading text-2xl leading-tight">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm text-current/80">
                      {product.material || product.leatherType || "Genuine cow leather"}
                    </p>
                    <p className="mt-4 text-sm font-semibold">
                      {formatProductPrice(product)}
                    </p>
                    {isPrimary ? (
                      <span className="mt-8 inline-flex min-h-9 items-center bg-bone px-4 text-xs font-semibold text-espresso">
                        View Details
                      </span>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : null}

        {remainingProducts.length ? (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {remainingProducts.map((p) => (
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
    </section>
  );
}
