export type Collection = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  collectionId: string | null;
  shortDescription: string | null;
  description: string | null;
  material: string | null;
  leatherType: string | null;
  color: string | null;
  size: string | null;
  price: number | null;
  priceAmount: number | null;
  priceCurrency: string | null;
  priceNote: string | null;
  isFeatured: boolean;
  isAvailable: boolean;
  status: "draft" | "published" | string;
  whatsappMessage: string | null;
  sourcePdfPage: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProductImage = {
  id: string;
  productId: string;
  storagePath: string;
  publicUrl: string;
  alt: string | null;
  sortOrder: number;
  createdAt: string;
};

export type SiteSettings = {
  id: string;
  brandName: string;
  tagline: string | null;
  whatsappNumber: string | null;
  instagramUrl: string | null;
  email: string | null;
  address: string | null;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type HomepageContent = {
  id: string;
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroImageUrl: string | null;
  storySectionTitle: string | null;
  storySectionText: string | null;
  ctaTitle: string | null;
  ctaText: string | null;
  createdAt: string;
  updatedAt: string;
};

export type InstagramEmbed = {
  id: string;
  title: string | null;
  instagramUrl: string;
  caption: string | null;
  sortOrder: number;
  status: "draft" | "published" | string;
  thumbnailUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BrandStory = {
  id: string;
  title: string | null;
  subtitle: string | null;
  intro: string | null;
  craftsmanshipTitle: string | null;
  craftsmanshipText: string | null;
  leatherTitle: string | null;
  leatherText: string | null;
  roseTitle: string | null;
  roseText: string | null;
  ctaTitle: string | null;
  ctaText: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LeatherCareArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImageUrl: string | null;
  publishedAt: string | null;
  status: "draft" | "published" | string;
  createdAt: string;
  updatedAt: string;
};
