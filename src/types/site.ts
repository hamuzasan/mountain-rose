export type NavigationItem = {
  label: string;
  href: string;
};

export type SiteSettings = {
  brandName: string;
  tagline: string;
  whatsappNumber: string;
  instagramUrl: string;
  email: string;
  address: string;
  logoUrl?: string | null;
  logo?: {
    asset?: { _ref: string; _type: "reference" };
    alt?: string;
  };
};

export type InstagramEmbed = {
  id: string;
  title: string | null;
  instagramUrl: string;
  caption: string | null;
  sortOrder: number;
  status: "draft" | "published" | string;
  thumbnailUrl?: string | null;
};
