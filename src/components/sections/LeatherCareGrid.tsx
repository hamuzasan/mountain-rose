import type { LeatherCareArticle } from "@/types/leatherCare";

import LeatherCareCard from "@/components/ui/LeatherCareCard";

type LeatherCareGridProps = {
  articles: LeatherCareArticle[];
};

export default function LeatherCareGrid({ articles }: LeatherCareGridProps) {
  if (!articles.length) {
    return (
      <div className="rounded-soft border border-espresso/10 bg-bone p-8 text-center text-sm text-mutedBrown">
        No leather care articles are available yet.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((a) => (
        <LeatherCareCard key={a.slug} article={a} />
      ))}
    </div>
  );
}
