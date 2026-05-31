"use client";

import type { ProductCategory } from "@/types/product";

type AvailabilityFilter = "All" | "Available" | "Not Available";
type SortKey = "Featured" | "PriceLow" | "PriceHigh";

export type ProductFiltersValue = {
  category: ProductCategory;
  availability: AvailabilityFilter;
  sort: SortKey;
};

type ProductFiltersProps = {
  value: ProductFiltersValue;
  onChange: (next: ProductFiltersValue) => void;
  categories?: string[];
};

export default function ProductFilters({
  value,
  onChange,
  categories = [],
}: ProductFiltersProps) {
  const categoryOptions = ["All", ...categories].map((category) => ({
    label: category === "All" ? "Semua" : category,
    value: category as ProductCategory,
  }));

  return (
    <div className="rounded-soft border border-espresso/10 bg-bone p-4 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label
            htmlFor="filter-category"
            className="block text-xs font-semibold uppercase text-mutedRose"
          >
            Kategori
          </label>
          <select
            id="filter-category"
            value={value.category}
            onChange={(e) =>
              onChange({ ...value, category: e.target.value as ProductCategory })
            }
            className="mt-2 h-11 w-full rounded-soft border border-espresso/15 bg-warmIvory px-3 text-sm font-medium text-espresso outline-none transition-colors focus:border-antiqueGold/70 focus:ring-2 focus:ring-antiqueGold/20"
          >
            {categoryOptions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-availability"
            className="block text-xs font-semibold uppercase text-mutedRose"
          >
            Ketersediaan
          </label>
          <select
            id="filter-availability"
            value={value.availability}
            onChange={(e) =>
              onChange({
                ...value,
                availability: e.target.value as AvailabilityFilter,
              })
            }
            className="mt-2 h-11 w-full rounded-soft border border-espresso/15 bg-warmIvory px-3 text-sm font-medium text-espresso outline-none transition-colors focus:border-antiqueGold/70 focus:ring-2 focus:ring-antiqueGold/20"
          >
            <option value="All">Semua</option>
            <option value="Available">Tersedia</option>
            <option value="Not Available">Belum tersedia</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-sort"
            className="block text-xs font-semibold uppercase text-mutedRose"
          >
            Urutan
          </label>
          <select
            id="filter-sort"
            value={value.sort}
            onChange={(e) => onChange({ ...value, sort: e.target.value as SortKey })}
            className="mt-2 h-11 w-full rounded-soft border border-espresso/15 bg-warmIvory px-3 text-sm font-medium text-espresso outline-none transition-colors focus:border-antiqueGold/70 focus:ring-2 focus:ring-antiqueGold/20"
          >
            <option value="Featured">Sorotan</option>
            <option value="PriceLow">Harga: rendah ke tinggi</option>
            <option value="PriceHigh">Harga: tinggi ke rendah</option>
          </select>
        </div>
      </div>
    </div>
  );
}
