import type { Product } from "@/types/product";

export function formatCurrencyIDR(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "Harga tersedia via WhatsApp";
  if (value === 0) return "Harga custom";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatProductPrice(product: Pick<Product, "price" | "priceAmount" | "priceCurrency">): string {
  if (typeof product.price === "number" && product.price > 0) {
    return formatCurrencyIDR(product.price);
  }

  if (
    product.priceCurrency === "USD" &&
    typeof product.priceAmount === "number" &&
    product.priceAmount > 0
  ) {
    return `US$ ${new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(product.priceAmount)}`;
  }

  if (typeof product.price === "number" && product.price === 0) {
    return "Harga custom";
  }

  return "Hubungi kami";
}

export function formatDateID(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}
