import type { LeatherCareArticle } from "@/types/leatherCare";

type LeatherCareArticleContentProps = {
  article: Pick<LeatherCareArticle, "content">;
};

function portableTextToPlainText(value: unknown): string {
  if (!Array.isArray(value)) return "";

  const blocks = value.filter((v) => v && typeof v === "object") as Array<{
    _type?: string;
    children?: Array<{ text?: string }>;
  }>;

  const text = blocks
    .filter((b) => b._type === "block" && Array.isArray(b.children))
    .map((b) => (b.children || []).map((c) => c.text || "").join(""))
    .join("\n")
    .trim();

  return text;
}

export default function LeatherCareArticleContent({
  article,
}: LeatherCareArticleContentProps) {
  const text = portableTextToPlainText(article.content);
  return (
    <section className="bg-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-soft border border-espresso/10 bg-bone p-6 sm:p-8">
          <div className="text-xs font-semibold uppercase text-mutedRose">
            Article
          </div>
          <div className="mt-6 whitespace-pre-line text-sm leading-8 text-mutedBrown sm:text-base">
            {text || "Konten artikel belum tersedia."}
          </div>
        </div>
      </div>
    </section>
  );
}

