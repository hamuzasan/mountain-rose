export type LeatherCareArticle = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: unknown[];
  coverImage?: {
    asset?: { _ref: string; _type: "reference" };
    alt?: string;
  };
  coverImageUrl?: string;
  publishedAt?: string;
};
