import Link from "next/link";

import type { SiteSettings } from "@/types/site";
import type { Product } from "@/types/product";

import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { buildDefaultProductWhatsAppMessage } from "@/data/fallbackHomepage";

type ProductOrderCTAProps = {
  product: Pick<Product, "name" | "isAvailable" | "whatsAppMessage">;
  siteSettings: Pick<SiteSettings, "brandName" | "whatsappNumber">;
};

export default function ProductOrderCTA({ product, siteSettings }: ProductOrderCTAProps) {
  const message =
    product.whatsAppMessage ||
    buildDefaultProductWhatsAppMessage(siteSettings, product.name) +
      " Apakah masih tersedia?";

  return (
    <section className="bg-espresso text-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="text-xs font-semibold uppercase text-dustyRose">
              Order
            </div>
            <h2 className="mt-3 font-heading text-3xl leading-tight text-bone sm:text-4xl">
              Tertarik dengan {product.name}?
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-bone/85 sm:text-base">
              {product.isAvailable ?? true
                ? "Tanyakan stok, detail material, dan opsi warna langsung melalui WhatsApp."
                : "Produk ini sedang tidak tersedia. Kamu tetap bisa konsultasi untuk alternatif yang serupa."}
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-soft border border-warmIvory/10 bg-darkLeather p-6">
              <div className="flex flex-col gap-3 sm:flex-row">
                <WhatsAppButton
                  phoneNumber={siteSettings.whatsappNumber}
                  message={message}
                  label="Order via WhatsApp"
                />
                <Link
                  href="/collections"
                  className="inline-flex h-10 items-center justify-center rounded-soft border border-warmIvory/15 bg-transparent px-4 text-sm font-medium text-bone transition-colors hover:bg-warmIvory/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
                >
                  Kembali ke Koleksi
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase text-bone/70">
                <span className="h-1.5 w-1.5 rounded-full bg-antiqueGold" />
                Boutique consultation
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

