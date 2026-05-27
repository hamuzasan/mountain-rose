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

  return (
    <section className="bg-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Featured"
            title="Pilihan Tas untuk Gaya yang Tenang"
            description="Kurasi singkat dari tas kulit sapi asli dengan karakter hangat, detail rapi, dan siluet yang matang."
          />
          <Link
            href="/collections"
            className="inline-flex h-10 items-center justify-center rounded-soft border border-espresso/15 bg-bone px-4 text-sm font-semibold text-espresso transition-colors hover:bg-warmIvory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
          >
            Lihat Semua Koleksi
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {limited.map((p) => (
            <ProductCard
              key={p.slug}
              product={p}
              siteSettings={siteSettings}
              showWhatsAppCta
            />
          ))}
        </div>
      </div>
    </section>
  );
}

