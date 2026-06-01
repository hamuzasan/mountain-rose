import Image from "next/image";
import Link from "next/link";

import { getDisplayProductImage, getProductImageUrl } from "@/lib/product-images";
import type { Product } from "@/types/product";

type HomeCategoryShowcaseProps = {
  products: Product[];
};

type CategoryItem = {
  category: string;
  product: Product;
  imageUrl: string | null;
};

function getCategoryItems(products: Product[]): CategoryItem[] {
  const map = new Map<string, CategoryItem>();

  for (const product of products) {
    const category = product.category?.trim() || "Collection";
    if (map.has(category)) continue;

    const image = getDisplayProductImage(product.images);
    map.set(category, {
      category,
      product,
      imageUrl: getProductImageUrl(image),
    });
  }

  return [...map.values()].slice(0, 5);
}

export default function HomeCategoryShowcase({ products }: HomeCategoryShowcaseProps) {
  const categories = getCategoryItems(products);

  if (!categories.length) return null;

  return (
    <section className="bg-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-4 py-9 sm:px-6 sm:py-16">
        <div className="mb-6 flex items-center gap-4 lg:hidden">
          <div className="h-px flex-1 bg-mutedRose/70" />
          <h2 className="text-center text-sm font-semibold uppercase text-deepRose">
            Product Categories
          </h2>
          <div className="h-px flex-1 bg-mutedRose/70" />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:hidden">
          {categories.slice(0, 4).map((item) => (
            <Link
              key={item.product.slug}
              href={`/collections/${item.product.slug}`}
              className="group overflow-hidden border border-espresso/10 bg-bone shadow-soft"
            >
              <div className="relative aspect-square bg-warmIvory">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={`${item.product.name} - ${item.category} Mountain Rose`}
                    fill
                    sizes="50vw"
                    className="object-contain p-5 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="absolute inset-4 border border-antiqueGold/25 bg-sand/25" />
                )}
              </div>
              <div className="border-t border-espresso/10 bg-bone px-3 py-3 text-center">
                <div className="text-[11px] font-semibold uppercase text-mutedRose">
                  {item.category}
                </div>
                <div className="mt-1 line-clamp-2 font-heading text-base leading-tight text-espresso">
                  {item.product.name}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="hidden gap-10 lg:grid lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4">
            <div className="text-xs font-semibold uppercase text-mutedRose">
              Shop by Category
            </div>
            <h2 className="mt-3 font-heading text-4xl leading-tight text-espresso sm:text-5xl">
              Choose the shape that fits your rhythm.
            </h2>
            <p className="mt-5 text-sm leading-7 text-mutedBrown sm:text-base">
              From sling bags to backpacks, every category carries a different function while keeping the same genuine cow leather character.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((item, index) => (
                <Link
                  key={item.category}
                  href="/collections"
                  className={[
                    "inline-flex h-10 items-center justify-center rounded-soft border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70",
                    index === 0
                      ? "border-espresso bg-espresso text-warmIvory hover:bg-darkLeather"
                      : "border-espresso/15 bg-bone text-espresso hover:bg-warmIvory",
                  ].join(" ")}
                >
                  {item.category}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="grid gap-4 sm:grid-cols-3">
              {categories.slice(0, 3).map((item, index) => (
                <Link
                  key={item.product.slug}
                  href={`/collections/${item.product.slug}`}
                  className={[
                    "group relative min-h-[19rem] overflow-hidden rounded-soft border border-espresso/10 bg-bone shadow-soft",
                    index === 1 ? "sm:mt-10" : "",
                    index === 2 ? "sm:mt-4" : "",
                  ].join(" ")}
                >
                  <div className="absolute inset-x-5 bottom-24 top-5">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={`${item.product.name} - ${item.category} Mountain Rose`}
                        fill
                        sizes="(min-width: 1024px) 240px, 33vw"
                        className={[
                          "object-contain transition-transform duration-700 ease-out group-hover:scale-[1.05]",
                          index === 0 ? "-rotate-3" : "",
                          index === 1 ? "rotate-2" : "",
                          index === 2 ? "-rotate-1" : "",
                        ].join(" ")}
                      />
                    ) : null}
                  </div>
                  <div className="absolute inset-x-4 bottom-4 rounded-soft border border-espresso/10 bg-warmIvory/95 p-4">
                    <div className="text-xs font-semibold uppercase text-mutedRose">
                      {item.category}
                    </div>
                    <div className="mt-1 font-heading text-xl leading-snug text-espresso">
                      {item.product.name}
                    </div>
                    <div className="mt-3 text-xs font-semibold uppercase text-mutedBrown">
                      View Detail
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
