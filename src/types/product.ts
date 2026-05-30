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

export type ProductImage = {
  publicUrl?: string;
  storagePath?: string;
  alt?: string;
  sortOrder?: number;
  asset?: { _ref: string; _type: "reference" };
};

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
  description?: string | unknown[];
  images?: ProductImage[];
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
