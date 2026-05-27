export type BrandStory = {
  title: string;
  subtitle?: string;
  intro?: string;
  content?: unknown[];
  image?: {
    asset?: { _ref: string; _type: "reference" };
    alt?: string;
  };
  craftsmanshipTitle?: string;
  craftsmanshipText?: string;
  leatherTitle?: string;
  leatherText?: string;
  roseTitle?: string;
  roseText?: string;
  ctaTitle?: string;
  ctaText?: string;
};

