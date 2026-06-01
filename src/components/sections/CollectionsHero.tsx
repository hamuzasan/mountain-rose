import SectionHeading from "./SectionHeading";

export default function CollectionsHero() {
  return (
    <section className="bg-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-5 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <SectionHeading
              eyebrow="Collections"
              title="Mountain Rose Collections"
              description="Explore handmade genuine cow leather bags from Indonesia, crafted with durable stitching, thoughtful proportions, and timeless character."
            />
          </div>
          <div className="lg:col-span-4">
            <div className="rounded-soft border border-espresso/10 bg-bone p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Curated
                </div>
                <div className="h-2 w-20 rounded-full bg-antiqueGold/40" />
              </div>
              <p className="mt-3 text-sm leading-7 text-mutedBrown">
                From sling bags and messengers to backpacks and clutches, every piece is shaped for daily function with a calm boutique presence.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10 h-px w-full bg-espresso/10" />
      </div>
    </section>
  );
}
