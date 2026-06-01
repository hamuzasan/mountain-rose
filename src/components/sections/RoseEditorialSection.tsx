import SectionHeading from "./SectionHeading";

export default function RoseEditorialSection() {
  return (
    <section className="bg-bone">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Rose"
              title="Rose as a Symbol, Not Decoration"
              description="At Mountain Rose, the rose is a quiet signal of elegance: subtle, mature, and full of character."
            />
            <p className="mt-6 max-w-2xl text-sm leading-7 text-mutedBrown sm:text-base">
              The rose accent is never meant to dominate. It appears with restraint, balancing the strength of genuine cow leather with a softer boutique mood.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-soft border border-espresso/10 bg-warmIvory p-6">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Editorial Note
                </div>
                <div className="h-2 w-20 rounded-full bg-antiqueGold/40" />
              </div>
              <div className="mt-4 font-heading text-2xl leading-snug text-espresso">
                Subtle, warm, and timeless.
              </div>
              <div className="mt-5 grid gap-3">
                <div className="rounded-soft border border-espresso/10 bg-bone px-4 py-3">
                  <div className="text-sm font-medium text-espresso">Elegance</div>
                  <div className="mt-1 text-sm text-mutedBrown">
                    Clean silhouettes and balanced proportions.
                  </div>
                </div>
                <div className="rounded-soft border border-espresso/10 bg-bone px-4 py-3">
                  <div className="text-sm font-medium text-espresso">Softness</div>
                  <div className="mt-1 text-sm text-mutedBrown">
                    Rose accents that are quiet, not loud.
                  </div>
                </div>
                <div className="rounded-soft border border-espresso/10 bg-bone px-4 py-3">
                  <div className="text-sm font-medium text-espresso">Character</div>
                  <div className="mt-1 text-sm text-mutedBrown">
                    Leather that becomes richer with time.
                  </div>
                </div>
              </div>
              <div className="mt-6 h-px w-full bg-espresso/10" />
              <div className="mt-4 text-xs font-semibold uppercase text-mutedBrown">
                Muted rose, used with restraint
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
