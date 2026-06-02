"use client";

import { useMemo, useState } from "react";

import type { Product, ProductCategory } from "@/types/product";
import type { SiteSettings } from "@/types/site";

import ProductFilters, { type ProductFiltersValue } from "./ProductFilters";
import ProductGrid from "./ProductGrid";

type CollectionsCatalogProps = {
  products: Product[];
  siteSettings: Pick<SiteSettings, "brandName" | "whatsappNumber">;
};

function normalizeCategory(category?: string): ProductCategory | "All" {
  const value = (category || "").trim();
  if (!value) return "All";
  return value as ProductCategory;
}

function productPriceValue(product: Product) {
  return product.price ?? product.priceAmount ?? 0;
}

function applyFilters(products: Product[], filters: ProductFiltersValue) {
  let next = products;

  if (filters.category !== "All") {
    next = next.filter(
      (p) => normalizeCategory(p.category) === normalizeCategory(filters.category),
    );
  }

  if (filters.availability === "Available") {
    next = next.filter((p) => p.isAvailable ?? true);
  }
  if (filters.availability === "Not Available") {
    next = next.filter((p) => !(p.isAvailable ?? true));
  }

  if (filters.sort === "PriceLow") {
    next = [...next].sort((a, b) => productPriceValue(a) - productPriceValue(b));
  } else if (filters.sort === "PriceHigh") {
    next = [...next].sort((a, b) => productPriceValue(b) - productPriceValue(a));
  } else if (filters.sort === "Featured") {
    next = [...next].sort(
      (a, b) => Number(b.isFeatured ?? false) - Number(a.isFeatured ?? false),
    );
  }

  return next;
}

export default function CollectionsCatalog({
  products,
  siteSettings,
}: CollectionsCatalogProps) {
  const categories = useMemo(
    () =>
      [...new Set(products.map((product) => product.category).filter(Boolean) as string[])]
        .sort((a, b) => a.localeCompare(b)),
    [products],
  );

  const [filters, setFilters] = useState<ProductFiltersValue>({
    category: "All",
    availability: "All",
    sort: "Featured",
  });

  const filtered = useMemo(() => applyFilters(products, filters), [products, filters]);

  return (
    <div className="mt-8">
      <ProductFilters value={filters} onChange={setFilters} categories={categories} />
      <div className="mt-8">
        <ProductGrid products={filtered} siteSettings={siteSettings} />
      </div>
    </div>
  );
}
