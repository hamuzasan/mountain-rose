import Link from "next/link";

import type { Product } from "@/types/product";

type ProductDetailHeroProps = {
  product: Pick<Product, "name" | "category" | "shortDescription">;
};

export default function ProductDetailHero({ product }: ProductDetailHeroProps) {
  return (
    <section className="bg-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-5 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-12">
        <nav
          aria-label="Breadcrumb"
          className="text-xs font-semibold uppercase text-mutedBrown"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition-colors hover:text-espresso">
                Home
              </Link>
            </li>
            <li className="text-mutedBrown/60">/</li>
            <li>
              <Link
                href="/collections"
                className="transition-colors hover:text-espresso"
              >
                Collections
              </Link>
            </li>
            <li className="text-mutedBrown/60">/</li>
            <li className="text-mutedRose">{product.name}</li>
          </ol>
        </nav>

        <div className="mt-6">
          <h1 className="font-heading text-4xl leading-tight text-espresso sm:text-5xl">
            {product.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {product.category ? (
              <div className="inline-flex items-center rounded-soft border border-espresso/10 bg-bone px-3 py-1 text-xs font-semibold uppercase text-mutedRose">
                {product.category}
              </div>
            ) : null}
            <div className="h-1.5 w-1.5 rounded-full bg-antiqueGold" />
            <div className="text-xs font-semibold uppercase text-mutedBrown">
              Genuine cow leather
            </div>
          </div>

          {product.shortDescription ? (
            <p className="mt-6 max-w-3xl text-base leading-8 text-mutedBrown sm:text-lg">
              {product.shortDescription}
            </p>
          ) : null}
        </div>

        <div className="mt-10 h-px w-full bg-espresso/10" />
      </div>
    </section>
  );
}

