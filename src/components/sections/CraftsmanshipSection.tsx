type CraftsmanshipSectionProps = {
  title: string;
  text: string;
};

export default function CraftsmanshipSection({
  title,
  text,
}: CraftsmanshipSectionProps) {
  return (
    <section className="bg-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <div className="text-xs font-semibold uppercase text-mutedRose">
              Craftsmanship
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
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-soft border border-espresso/10 bg-warmIvory px-4 py-3">
                  <div className="text-xs font-semibold uppercase text-mutedBrown">
                    Structure
                  </div>
                  <div className="mt-2 text-sm font-medium text-espresso">
                    Proporsi seimbang, terasa rapi.
                  </div>
                </div>
                <div className="rounded-soft border border-espresso/10 bg-warmIvory px-4 py-3">
                  <div className="text-xs font-semibold uppercase text-mutedBrown">
                    Stitching
                  </div>
                  <div className="mt-2 text-sm font-medium text-espresso">
                    Jahitan halus untuk ketahanan.
                  </div>
                </div>
                <div className="rounded-soft border border-espresso/10 bg-warmIvory px-4 py-3">
                  <div className="text-xs font-semibold uppercase text-mutedBrown">
                    Finishing
                  </div>
                  <div className="mt-2 text-sm font-medium text-espresso">
                    Tepi rapi, detail terukur.
                  </div>
                </div>
                <div className="rounded-soft border border-espresso/10 bg-warmIvory px-4 py-3">
                  <div className="text-xs font-semibold uppercase text-mutedBrown">
                    Usability
                  </div>
                  <div className="mt-2 text-sm font-medium text-espresso">
                    Nyaman dipakai, siap harian.
                  </div>
                </div>
              </div>
              <div className="mt-6 h-px w-full bg-espresso/10" />
              <div className="mt-4 text-xs font-semibold uppercase text-mutedRose">
                Calm, boutique approach
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

