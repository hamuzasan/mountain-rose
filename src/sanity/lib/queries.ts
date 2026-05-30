import { groq } from "next-sanity";

import { client } from "./client";

export type SanityImageAsset = {
  _type: "image";
  asset?: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
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
  collection?: {
    title: string;
    slug: string;
  };
  shortDescription?: string;
  description?: unknown[];
  images?: SanityImageAsset[];
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
  coverImage?: SanityImageAsset;
};

export type Homepage = {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: SanityImageAsset;
  featuredProducts?: Product[];
  storySectionTitle?: string;
  storySectionText?: unknown[];
  ctaTitle?: string;
  ctaText?: string;
};

export type LeatherCareArticle = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: unknown[];
  coverImage?: SanityImageAsset;
  publishedAt?: string;
};

export type SiteSettings = {
  brandName?: string;
  tagline?: string;
  whatsappNumber?: string;
  instagramUrl?: string;
  email?: string;
  address?: string;
  logo?: SanityImageAsset;
};

export type BrandStory = {
  title?: string;
  subtitle?: string;
  content?: unknown[];
  image?: SanityImageAsset;
  intro?: string;
  craftsmanshipTitle?: string;
  craftsmanshipText?: string;
  leatherTitle?: string;
  leatherText?: string;
  roseTitle?: string;
  roseText?: string;
  ctaTitle?: string;
  ctaText?: string;
};

const productFields = groq`
  _id,
  name,
  "slug": slug.current,
  price,
  priceAmount,
  priceCurrency,
  priceNote,
  category,
  collection->{
    title,
    "slug": slug.current
  },
  shortDescription,
  description,
  images,
  material,
  leatherType,
  color,
  size,
  sourcePdfPage,
  isFeatured,
  isAvailable,
  whatsAppMessage
`;

const collectionFields = groq`
  _id,
  title,
  "slug": slug.current,
  description,
  coverImage
`;

const leatherCareArticleFields = groq`
  _id,
  title,
  "slug": slug.current,
  excerpt,
  content,
  coverImage,
  publishedAt
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    brandName,
    tagline,
    whatsappNumber,
    instagramUrl,
    email,
    address,
    logo
  }
`;

export const homepageQuery = groq`
  *[_type == "homepage"][0]{
    heroTitle,
    heroSubtitle,
    heroImage,
    featuredProducts[]->{
      ${productFields}
    },
    storySectionTitle,
    storySectionText,
    ctaTitle,
    ctaText
  }
`;

export const featuredProductsQuery = groq`
  *[_type == "product" && isFeatured == true] | order(_createdAt desc){
    ${productFields}
  }
`;

export const allProductsQuery = groq`
  *[_type == "product"] | order(name asc){
    ${productFields}
  }
`;

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0]{
    ${productFields}
  }
`;

export const allCollectionsQuery = groq`
  *[_type == "collection"] | order(title asc){
    ${collectionFields}
  }
`;

export const collectionBySlugQuery = groq`
  *[_type == "collection" && slug.current == $slug][0]{
    ${collectionFields}
  }
`;

export const leatherCareArticlesQuery = groq`
  *[_type == "leatherCareArticle"] | order(publishedAt desc){
    ${leatherCareArticleFields}
  }
`;

export const leatherCareArticleBySlugQuery = groq`
  *[_type == "leatherCareArticle" && slug.current == $slug][0]{
    ${leatherCareArticleFields}
  }
`;

export const brandStoryQuery = groq`
  *[_type == "brandStory"][0]{
    title,
    subtitle,
    content,
    image,
    intro,
    craftsmanshipTitle,
    craftsmanshipText,
    leatherTitle,
    leatherText,
    roseTitle,
    roseText,
    ctaTitle,
    ctaText
  }
`;

export async function getSiteSettings() {
  if (!client) return null;
  try {
    return await client.fetch<SiteSettings | null>(siteSettingsQuery);
  } catch {
    return null;
  }
}

export async function getBrandStory() {
  if (!client) return null;
  try {
    return await client.fetch<BrandStory | null>(brandStoryQuery);
  } catch {
    return null;
  }
}

export async function getHomepage() {
  if (!client) return null;
  return client.fetch<Homepage | null>(homepageQuery);
}

export async function getFeaturedProducts() {
  if (!client) return [];
  return client.fetch<Product[]>(featuredProductsQuery);
}

export async function getAllProducts() {
  if (!client) return [];
  return client.fetch<Product[]>(allProductsQuery);
}

export async function getProductBySlug(slug: string) {
  if (!client) return null;
  return client.fetch<Product | null>(productBySlugQuery, { slug });
}

export async function getAllCollections() {
  if (!client) return [];
  return client.fetch<Collection[]>(allCollectionsQuery);
}

export async function getCollectionBySlug(slug: string) {
  if (!client) return null;
  return client.fetch<Collection | null>(collectionBySlugQuery, { slug });
}

export async function getLeatherCareArticles() {
  if (!client) return [];
  return client.fetch<LeatherCareArticle[]>(leatherCareArticlesQuery);
}

export async function getLeatherCareArticleBySlug(slug: string) {
  if (!client) return null;
  return client.fetch<LeatherCareArticle | null>(
    leatherCareArticleBySlugQuery,
    { slug },
  );
}
