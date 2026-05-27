import SectionHeading from "./SectionHeading";

export default function CollectionsHero() {
  return (
    <section className="bg-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-5 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <SectionHeading
              eyebrow="Collections"
              title="Koleksi Mountain Rose"
              description="Jelajahi tas kulit sapi asli dengan karakter hangat, detail rapi, dan sentuhan elegan yang terinspirasi dari mawar."
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
                Proporsi yang matang dan warna kulit yang tenang, untuk gaya yang terasa premium tanpa berlebihan.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10 h-px w-full bg-espresso/10" />
      </div>
    </section>
  );
}

