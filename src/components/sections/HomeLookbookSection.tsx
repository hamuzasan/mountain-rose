import Image from "next/image";
import Link from "next/link";

import { getDisplayProductImage, getProductImageUrl } from "@/lib/product-images";
import type { Product } from "@/types/product";

type HomeLookbookSectionProps = {
  products: Product[];
};

export default function HomeLookbookSection({ products }: HomeLookbookSectionProps) {
  const imageItems = products
    .map((product) => {
      const image = getDisplayProductImage(product.images);
      return {
        product,
        image,
        imageUrl: getProductImageUrl(image),
      };
    })
    .filter((item) => Boolean(item.imageUrl))
    .slice(0, 4);

  if (!imageItems.length) return null;

  return (
    <section className="bg-bone">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <div className="relative overflow-hidden rounded-soft border border-espresso/10 bg-sand/45 px-5 py-10 sm:px-8 lg:px-10">
          <div className="absolute -left-20 top-12 h-48 w-48 rounded-full border border-espresso/10" />
          <div className="absolute -right-16 bottom-10 h-40 w-40 rounded-full border border-mutedRose/20" />

          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <div className="text-xs font-semibold uppercase text-mutedRose">
                Ruang Visual Katalog
              </div>
              <h2 className="mt-3 font-heading text-4xl leading-tight text-espresso sm:text-5xl">
                Bawa ceritamu dengan karakter yang matang.
              </h2>
              <p className="mt-5 text-sm leading-7 text-mutedBrown sm:text-base">
                Potongan visual yang hangat, tenang, dan editorial. Setiap gambar
                berasal dari produk Mountain Rose yang benar-benar ada di katalog.
              </p>
              <Link
                href="/collections"
                className="mt-7 inline-flex h-11 items-center justify-center rounded-soft border border-espresso/15 bg-warmIvory px-5 text-sm font-semibold text-espresso transition-colors hover:bg-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
              >
                Lihat Koleksi
              </Link>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {imageItems.map((item, index) => (
                  <Link
                    key={`${item.product.slug}-${index}`}
                    href={`/collections/${item.product.slug}`}
                    className={[
                      "group relative min-h-56 overflow-hidden rounded-soft border border-espresso/10 bg-warmIvory shadow-soft",
                      index === 0 ? "sm:mt-8" : "",
                      index === 1 ? "sm:-mt-2" : "",
                      index === 2 ? "sm:mt-12" : "",
                    ].join(" ")}
                  >
                    <div className="absolute inset-x-4 bottom-14 top-4">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={
                            item.image?.alt ||
                            `${item.product.name} - tas kulit sapi Mountain Rose`
                          }
                          fill
                          sizes="(min-width: 1024px) 180px, 50vw"
                          className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                        />
                      ) : null}
                    </div>
                    <div className="absolute inset-x-3 bottom-3 text-center">
                      <div className="rounded-soft border border-espresso/10 bg-bone/95 px-2 py-2 text-xs font-semibold uppercase text-mutedRose">
                        {item.product.category || "Collection"}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
