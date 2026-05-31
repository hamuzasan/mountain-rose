import { mountainRoseCatalogueProducts } from "../../data/import/mountainRoseCatalogueProducts";

import type { Product } from "@/types/product";

export const FALLBACK_PRODUCTS: Product[] = mountainRoseCatalogueProducts.map((product) => ({
  _id: `fallback-${product.slug}`,
  name: product.name,
  slug: product.slug,
  priceAmount: product.priceAmount,
  priceCurrency: product.priceCurrency,
  priceNote: product.priceNote,
  category: product.category,
  material: product.material,
  leatherType: product.leatherType,
  color: product.color,
  size: product.size,
  sourcePdfPage: product.sourcePdfPage,
  shortDescription: product.shortDescription,
  description: product.description,
  isFeatured: product.isFeatured,
  isAvailable: product.isAvailable,
  whatsAppMessage: product.whatsAppMessage,
  images: [],
}));
