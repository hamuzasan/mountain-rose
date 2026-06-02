type LeatherMaterialStoryProps = {
  title: string;
  text: string;
};

const MATERIAL_POINTS = [
  "Natural texture",
  "Durability",
  "Aging character",
  "Daily use",
];

export default function LeatherMaterialStory({
  title,
  text,
}: LeatherMaterialStoryProps) {
  return (
    <section className="bg-bone">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <div className="text-xs font-semibold uppercase text-mutedRose">
              Leather
            </div>
            <h2 className="mt-3 font-heading text-3xl leading-tight text-espresso">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-sm leading-7 text-mutedBrown sm:text-base">
              {text}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
              {MATERIAL_POINTS.map((point, index) => (
                <div
                  key={point}
                  className="relative min-h-[8rem] overflow-hidden rounded-soft border border-espresso/10 bg-warmIvory p-4 sm:min-h-[9rem] sm:p-5"
                >
                  <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full border border-antiqueGold/25" />
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-mutedRose/25 bg-bone font-heading text-sm text-espresso">
                    0{index + 1}
                  </div>
                  <div className="mt-5 font-heading text-base leading-snug text-espresso sm:text-lg">
                    {point}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
