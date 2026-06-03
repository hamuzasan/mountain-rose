import type { Product } from "@/types/product";

import { formatProductPrice } from "@/lib/format";

type ProductInfoProps = {
  product: Product;
};

function portableTextToPlainText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (!Array.isArray(value)) return "";

  const blocks = value.filter((v) => v && typeof v === "object") as Array<{
    _type?: string;
    children?: Array<{ text?: string }>;
  }>;

  const text = blocks
    .filter((b) => b._type === "block" && Array.isArray(b.children))
    .map((b) => (b.children || []).map((c) => c.text || "").join(""))
    .join("\n")
    .trim();

  return text;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const price = formatProductPrice(product);

  const longDesc = portableTextToPlainText(product.description);

  return (
    <div className="rounded-soft border border-espresso/10 bg-bone p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase text-mutedRose">
            {product.category || "Collection"}
          </div>
          <div className="mt-3 font-heading text-2xl leading-snug text-espresso">
            {product.name}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold uppercase text-mutedBrown">
            Price
          </div>
          <div className="mt-2 text-lg font-semibold text-espresso">
            {price}
          </div>
          {product.priceNote ? (
            <div className="mt-2 max-w-[16rem] text-xs leading-5 text-mutedBrown">
              {product.priceNote}
            </div>
          ) : null}
          <div className="mt-2 text-xs font-semibold uppercase text-mutedBrown">
            {(product.isAvailable ?? true) ? "Available" : "Not available"}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-soft border border-espresso/10 bg-warmIvory px-4 py-3">
            <div className="text-xs font-semibold uppercase text-mutedBrown">
            Material
          </div>
          <div className="mt-2 text-sm font-medium text-espresso">
            {product.material || product.leatherType || "Genuine cow leather"}
          </div>
        </div>
        <div className="rounded-soft border border-espresso/10 bg-warmIvory px-4 py-3">
            <div className="text-xs font-semibold uppercase text-mutedBrown">
            Color
          </div>
          <div className="mt-2 text-sm font-medium text-espresso">
            {product.color || "Warm tone"}
          </div>
        </div>
        {product.size ? (
          <div className="rounded-soft border border-espresso/10 bg-warmIvory px-4 py-3">
            <div className="text-xs font-semibold uppercase text-mutedBrown">
              Size
            </div>
            <div className="mt-2 text-sm font-medium text-espresso">
              {product.size}
            </div>
          </div>
        ) : null}
      </div>

      {product.shortDescription ? (
        <p className="mt-6 text-sm leading-7 text-mutedBrown">
          {product.shortDescription}
        </p>
      ) : null}

      {longDesc ? (
        <div className="mt-6 rounded-soft border border-espresso/10 bg-warmIvory p-4">
          <div className="text-xs font-semibold uppercase text-mutedRose">
            Description
          </div>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-mutedBrown">
            {longDesc}
          </p>
        </div>
      ) : null}
    </div>
  );
}
