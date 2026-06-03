import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductDetailHero from "@/components/sections/ProductDetailHero";
import ProductGallery from "@/components/sections/ProductGallery";
import ProductInfo from "@/components/sections/ProductInfo";
import ProductMaterialDetails from "@/components/sections/ProductMaterialDetails";
import ProductOrderCTA from "@/components/sections/ProductOrderCTA";
import { FALLBACK_SITE_SETTINGS } from "@/data/fallbackSiteSettings";
import { createProductJsonLd } from "@/lib/structuredData";
import { getProductBySlug } from "@/data-access/products";
import { getSiteSettings } from "@/data-access/siteSettings";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product | Mountain Rose",
    };
  }

  return {
    title: `${product.name} | Mountain Rose`,
    description:
      product.shortDescription ||
      "A handmade genuine cow leather bag from Mountain Rose with refined rose-inspired elegance.",
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const [cmsSiteSettings, cmsProduct] = await Promise.all([
    getSiteSettings(),
    getProductBySlug(slug),
  ]);

  const siteSettings = cmsSiteSettings
    ? { ...FALLBACK_SITE_SETTINGS, ...cmsSiteSettings }
    : FALLBACK_SITE_SETTINGS;

  const product = cmsProduct;

  if (!product) notFound();
  const productJsonLd = createProductJsonLd(product);

  return (
    <div className="bg-warmIvory">
      {productJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      ) : null}
      <ProductDetailHero product={product} />
      <section className="bg-warmIvory">
        <div className="mx-auto w-full max-w-6xl px-5 pb-14 sm:px-6 sm:pb-16">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-6">
              <ProductGallery images={product.images} productName={product.name} />
            </div>
            <div className="lg:col-span-6">
              <ProductInfo product={product} />
            </div>
          </div>
        </div>
      </section>
      <ProductMaterialDetails product={product} />
      <ProductOrderCTA product={product} siteSettings={siteSettings} />
    </div>
  );
}
