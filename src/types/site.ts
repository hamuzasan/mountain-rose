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
  logo?: {
    asset?: { _ref: string; _type: "reference" };
    alt?: string;
  };
};
