import type { AiParsedProductInput, AiProductDraft, AiCmsResult } from "@/types/aiCms";

export type AiTextParseResult = AiCmsResult<AiProductDraft>;

export type ProductCopyInput = {
  name?: string;
  category?: string;
  leatherType?: string;
  color?: string;
  size?: string;
  notes?: string;
};

export type ProductCopySuggestion = {
  shortDescription: string;
  description: string;
  whatsAppMessage: string;
};

export type TryOnImageInput = {
  productSlug: string;
  productName?: string;
  productImageUrl?: string;
  userImage: File;
};

export type TryOnImageResult = AiCmsResult<{
  imageBase64?: string;
  mimeType?: string;
  note?: string;
}>;

export type GeminiProductParseInput = AiParsedProductInput;
