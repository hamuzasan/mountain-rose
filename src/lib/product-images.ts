import type { ProductImage } from "@/types/product";

export function getOrderedProductImages(images?: ProductImage[] | null): ProductImage[] {
  return [...(images || [])]
    .filter((image) => Boolean(image.publicUrl?.trim()))
    .sort((a, b) => {
      const order = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      if (order !== 0) return order;
      return (a.storagePath || "").localeCompare(b.storagePath || "", undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });
}

export function getProductImageUrl(image?: ProductImage | null): string | null {
  const value = image?.publicUrl?.trim();
  return value || null;
}

export function getPrimaryProductImage(images?: ProductImage[] | null): ProductImage | null {
  return getOrderedProductImages(images)[0] || null;
}

export function getDisplayProductImage(images?: ProductImage[] | null): ProductImage | null {
  const ordered = getOrderedProductImages(images);
  return ordered[1] || ordered[0] || null;
}
