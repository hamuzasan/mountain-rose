import type { SiteSettings } from "@/types/site";
import type { Product } from "@/types/product";

import ProductCard from "@/components/ui/ProductCard";

type ProductGridProps = {
  products: Product[];
  siteSettings: Pick<SiteSettings, "brandName" | "whatsappNumber">;
};

export default function ProductGrid({ products, siteSettings }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="rounded-soft border border-espresso/10 bg-bone p-8 text-center text-sm text-mutedBrown">
        No products are available right now.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
      {products.map((p, index) => (
        <ProductCard
          key={p.slug}
          product={p}
          siteSettings={siteSettings}
          showWhatsAppCta
          className={index === 0 ? "lg:col-span-2" : ""}
          variant={index === 0 ? "feature" : "default"}
          priority={index === 0}
        />
      ))}
    </div>
  );
}
