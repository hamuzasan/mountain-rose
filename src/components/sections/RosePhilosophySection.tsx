type RosePhilosophySectionProps = {
  title: string;
  text: string;
};

export default function RosePhilosophySection({
  title,
  text,
}: RosePhilosophySectionProps) {
  return (
    <section className="bg-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <div className="text-xs font-semibold uppercase text-mutedRose">
              Rose Philosophy
            </div>
            <h2 className="mt-3 font-heading text-3xl leading-tight text-espresso">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-soft border border-espresso/10 bg-bone p-6">
              <p className="text-sm leading-7 text-mutedBrown sm:text-base">
                {text}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-soft border border-espresso/10 bg-warmIvory px-4 py-3">
                  <div className="text-xs font-semibold uppercase text-mutedBrown">
                    Elegance
                  </div>
                  <div className="mt-2 text-sm font-medium text-espresso">
                    Subtle, mature.
                  </div>
                </div>
                <div className="rounded-soft border border-espresso/10 bg-warmIvory px-4 py-3">
                  <div className="text-xs font-semibold uppercase text-mutedBrown">
                    Softness
                  </div>
                  <div className="mt-2 text-sm font-medium text-espresso">
                    Measured accents.
                  </div>
                </div>
                <div className="rounded-soft border border-espresso/10 bg-warmIvory px-4 py-3">
                  <div className="text-xs font-semibold uppercase text-mutedBrown">
                    Character
                  </div>
                  <div className="mt-2 text-sm font-medium text-espresso">
                    Layered meaning.
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase text-mutedBrown">
                <span className="h-1.5 w-1.5 rounded-full bg-antiqueGold" />
                Muted rose accent only
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
