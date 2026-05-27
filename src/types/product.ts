export type ProductCategory =
  | "Tote Bag"
  | "Sling Bag"
  | "Handbag"
  | "Laptop Bag"
  | "Wallet"
  | "Custom Bag"
  | "All";

export type Product = {
  _id: string;
  name: string;
  slug: string;
  price?: number;
  category?: string;
  shortDescription?: string;
  description?: unknown[];
  images?: Array<{
    asset?: { _ref: string; _type: "reference" };
    alt?: string;
  }>;
  leatherType?: string;
  color?: string;
  size?: string;
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
