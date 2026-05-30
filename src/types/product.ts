export type ProductCategory =
  | "Tote Bag"
  | "Sling Bag"
  | "Handbag"
  | "Laptop Bag"
  | "Wallet"
  | "Custom Bag"
  | "Clutch & Sling Bag"
  | "Pouch"
  | "Messenger Bag"
  | "Backpack"
  | "All";

export type Product = {
  _id: string;
  name: string;
  slug: string;
  price?: number;
  priceAmount?: number;
  priceCurrency?: string;
  priceNote?: string;
  category?: string;
  shortDescription?: string;
  description?: unknown[];
  images?: Array<{
    asset?: { _ref: string; _type: "reference" };
    alt?: string;
  }>;
  material?: string;
  leatherType?: string;
  color?: string;
  size?: string;
  sourcePdfPage?: number;
  isFeatured?: boolean;
  isAvailable?: boolean;
  whatsAppMessage?: string;
};

export type Collection = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: {
    asset?: { _ref: string; _type: "reference" };
    alt?: string;
  };
};
