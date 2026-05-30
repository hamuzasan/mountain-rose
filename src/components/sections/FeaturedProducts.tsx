import Link from "next/link";

import type { SiteSettings } from "@/types/site";

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
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Featured"
            title="Produk Katalog yang Siap Menjadi Sorotan"
            description="Tas kulit sapi asli dari katalog Mountain Rose, ditampilkan dengan ruang visual yang lebih besar agar detail bentuk, tekstur, dan karakter material terasa jelas."
          />
          <Link
            href="/collections"
            className="inline-flex h-10 items-center justify-center rounded-soft border border-espresso/15 bg-bone px-4 text-sm font-semibold text-espresso transition-colors hover:bg-warmIvory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
          >
            Lihat Semua Koleksi
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
    </section>
  );
}
