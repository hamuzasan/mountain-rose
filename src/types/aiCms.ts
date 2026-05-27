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
  category?: string;
  shortDescription?: string;
  description?: string;
  leatherType?: string;
  color?: string;
  size?: string;
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
