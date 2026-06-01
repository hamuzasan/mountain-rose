export default function ContactHero() {
  return (
    <section className="bg-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-5 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="text-xs font-semibold uppercase text-mutedRose">
              Contact
            </div>
            <h1 className="mt-4 font-heading text-4xl leading-tight text-espresso sm:text-5xl">
              Contact Mountain Rose
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-mutedBrown sm:text-lg">
              Ask about genuine cow leather bags, colors, shapes, and product details
              through a calm and personal conversation.
            </p>
          </div>
          <div className="lg:col-span-4">
            <div className="rounded-soft border border-espresso/10 bg-bone p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Note
                </div>
                <div className="h-2 w-20 rounded-full bg-antiqueGold/40" />
              </div>
              <p className="mt-3 text-sm leading-7 text-mutedBrown">
                We respond clearly and thoughtfully, so every choice feels confident.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10 h-px w-full bg-espresso/10" />
      </div>
    </section>
  );
}
