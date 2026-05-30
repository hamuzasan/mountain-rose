export type AiCmsAction =
  | "HELP"
  | "ADD_PRODUCT"
  | "UPDATE_PRODUCT"
  | "PUBLISH_PRODUCT"
  | "UNKNOWN";

export type AiParsedProductInput = {
  rawText: string;
  sender?: string;
  imageUrls?: string[];
  attachmentReferences?: string[];
};

export type AiProductDraft = {
  name?: string;
  slug?: string;
  price?: number;
  priceAmount?: number;
  priceCurrency?: string;
  priceNote?: string;
  category?: string;
  shortDescription?: string;
  description?: string;
  material?: string;
  leatherType?: string;
  color?: string;
  size?: string;
  sourcePdfPage?: number;
  isFeatured?: boolean;
  isAvailable?: boolean;
  whatsAppMessage?: string;
  imageUrls?: string[];
  attachmentReferences?: string[];
};

export type AiCmsResult<T = unknown> = {
  ok: boolean;
  action?: AiCmsAction;
  data?: T;
  error?: string;
  message?: string;
};
