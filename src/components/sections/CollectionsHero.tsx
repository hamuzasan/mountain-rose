import SectionHeading from "./SectionHeading";

export default function CollectionsHero() {
  return (
    <section className="bg-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-5 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <SectionHeading
              eyebrow="Koleksi"
              title="Koleksi Mountain Rose"
              description="Jelajahi tas kulit sapi asli handmade dari Indonesia, dibuat dengan material genuine cowhide, jahitan kokoh, dan karakter desain yang timeless."
            />
          </div>
          <div className="lg:col-span-4">
            <div className="rounded-soft border border-espresso/10 bg-bone p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Terpilih
                </div>
                <div className="h-2 w-20 rounded-full bg-antiqueGold/40" />
              </div>
              <p className="mt-3 text-sm leading-7 text-mutedBrown">
                Dari sling bag, messenger, backpack, hingga clutch, setiap produk dirancang untuk fungsi harian dengan kesan boutique yang tetap tenang.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10 h-px w-full bg-espresso/10" />
      </div>
    </section>
  );
}
