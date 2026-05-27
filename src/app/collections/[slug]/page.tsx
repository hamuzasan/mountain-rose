import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductDetailHero from "@/components/sections/ProductDetailHero";
import ProductGallery from "@/components/sections/ProductGallery";
import ProductInfo from "@/components/sections/ProductInfo";
import ProductMaterialDetails from "@/components/sections/ProductMaterialDetails";
import ProductOrderCTA from "@/components/sections/ProductOrderCTA";
import ProductTryOnSection from "@/components/sections/ProductTryOnSection";
import { FALLBACK_SITE_SETTINGS } from "@/data/fallbackSiteSettings";
import { getFallbackProductBySlug, getFallbackProducts } from "@/lib/products";
import { createProductJsonLd } from "@/lib/structuredData";
import { getAllProducts, getProductBySlug, getSiteSettings } from "@/sanity/lib/queries";
import type { Product } from "@/types/product";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function toProduct(p: {
  _id: string;
  name: string;
  slug: string;
  price?: number;
  category?: string;
  shortDescription?: string;
  description?: unknown[];
  images?: Product["images"];
  leatherType?: string;
  color?: string;
  size?: string;
  isFeatured?: boolean;
  isAvailable?: boolean;
  whatsAppMessage?: string;
}): Product {
  return {
    _id: p._id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    category: p.category,
    shortDescription: p.shortDescription,
    description: p.description,
    images: p.images,
    leatherType: p.leatherType,
    color: p.color,
    size: p.size,
    isFeatured: p.isFeatured,
    isAvailable: p.isAvailable,
    whatsAppMessage: p.whatsAppMessage,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fallback = getFallbackProductBySlug(slug);
  const cmsProduct = fallback ? null : await getProductBySlug(slug);
  const product = cmsProduct ? toProduct(cmsProduct as unknown as Product) : fallback;

  if (!product) {
    return {
      title: "Product | Mountain Rose",
    };
  }

  return {
    title: `${product.name} | Mountain Rose`,
    description:
      product.shortDescription ||
      "Tas kulit sapi asli dengan desain elegan terinspirasi dari mawar, dibuat untuk menemani perjalanan panjang.",
  };
}

export async function generateStaticParams() {
  const fallback = getFallbackProducts().map((p) => ({ slug: p.slug }));
  const cms = await getAllProducts();
  const cmsSlugs = (cms || [])
    .map((p) => p.slug)
    .filter((s): s is string => Boolean(s))
    .map((slug) => ({ slug }));

  const map = new Map<string, { slug: string }>();
  [...fallback, ...cmsSlugs].forEach((p) => map.set(p.slug, p));
  return [...map.values()];
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const [cmsSiteSettings, fallbackProduct, cmsProduct] = await Promise.all([
    getSiteSettings(),
    Promise.resolve(getFallbackProductBySlug(slug)),
    getProductBySlug(slug),
  ]);

  const siteSettings = cmsSiteSettings
    ? { ...FALLBACK_SITE_SETTINGS, ...cmsSiteSettings }
    : FALLBACK_SITE_SETTINGS;

  const product: Product | null = fallbackProduct
    ? fallbackProduct
    : cmsProduct
      ? toProduct(cmsProduct as unknown as Product)
      : null;

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
      <ProductTryOnSection
        productSlug={product.slug}
        isEnabled={process.env.AI_TRY_ON_ENABLED === "true"}
      />
      <ProductOrderCTA product={product} siteSettings={siteSettings} />
    </div>
  );
}
