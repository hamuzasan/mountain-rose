import { absoluteUrl, siteConfig } from "@/config/site";
import type { Product } from "@/types/product";

export function createOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.ogImage),
    description: siteConfig.description,
  };
}

export function createWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "id-ID",
    description: siteConfig.description,
  };
}

export function createProductJsonLd(product: Product) {
  if (
    !product.name ||
    !product.slug ||
    !product.shortDescription
  ) {
    return null;
  }

  const offerPrice =
    typeof product.price === "number" && product.price > 0
      ? product.price
      : typeof product.priceAmount === "number" && product.priceAmount > 0
        ? product.priceAmount
        : null;
  const offerCurrency =
    typeof product.price === "number" && product.price > 0
      ? "IDR"
      : product.priceCurrency || null;

  if (offerPrice === null || !offerCurrency) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    category: product.category,
    material: product.leatherType,
    color: product.color,
    url: absoluteUrl(`/collections/${product.slug}`),
    offers: {
      "@type": "Offer",
      priceCurrency: offerCurrency,
      price: offerPrice,
      availability:
        product.isAvailable ?? true
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/collections/${product.slug}`),
    },
  };
}
