type LeatherMaterialStoryProps = {
  title: string;
  text: string;
};

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
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-soft border border-espresso/10 bg-warmIvory p-5">
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Natural texture
                </div>
                <p className="mt-3 text-sm leading-7 text-mutedBrown">
                  Grain alami memberi karakter yang unik, terasa hangat dan matang.
                </p>
              </div>
              <div className="rounded-soft border border-espresso/10 bg-warmIvory p-5">
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Durability
                </div>
                <p className="mt-3 text-sm leading-7 text-mutedBrown">
                  Dipilih untuk ketahanan dan struktur, agar siap dipakai untuk momen harian.
                </p>
              </div>
              <div className="rounded-soft border border-espresso/10 bg-warmIvory p-5">
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Aging character
                </div>
                <p className="mt-3 text-sm leading-7 text-mutedBrown">
                  Dengan perawatan yang tepat, kulit berkembang menjadi patina yang lebih kaya.
                </p>
              </div>
              <div className="rounded-soft border border-espresso/10 bg-warmIvory p-5">
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Daily use
                </div>
                <p className="mt-3 text-sm leading-7 text-mutedBrown">
                  Nyaman dipakai, mudah dipadukan, dan tetap terlihat premium tanpa berlebihan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

