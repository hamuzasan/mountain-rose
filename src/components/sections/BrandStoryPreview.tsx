import Link from "next/link";

import SectionHeading from "./SectionHeading";

type BrandStoryPreviewProps = {
  title: string;
  text: string;
};

export default function BrandStoryPreview({ title, text }: BrandStoryPreviewProps) {
  return (
    <section className="bg-bone">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Story"
              title={title}
              description={text}
            />
            <p className="mt-6 max-w-2xl text-sm leading-7 text-mutedBrown sm:text-base">
              Mountain Rose adalah brand lokal yang mengutamakan authenticity, durability,
              dan aesthetics. Setiap tas dibuat dari 100% high-quality genuine cowhide
              melalui proses handmade agar fungsional, berkarakter, dan tahan menemani
              perjalanan panjang.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-soft border border-espresso/10 bg-warmIvory p-6">
              <div className="text-xs font-semibold uppercase text-mutedRose">
                Filosofi
              </div>
              <div className="mt-3 font-heading text-2xl leading-snug text-espresso">
                Elegansi yang tidak perlu berteriak.
              </div>
              <p className="mt-4 text-sm leading-7 text-mutedBrown">
                Seperti mawar yang tumbuh di tengah tebing, Mountain Rose membawa
                karakter kuat yang tetap elegan dan penuh cerita.
              </p>
              <div className="mt-6">
                <Link
                  href="/story"
                  className="inline-flex h-10 items-center justify-center rounded-soft border border-espresso/15 bg-bone px-4 text-sm font-semibold text-espresso transition-colors hover:bg-warmIvory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
                >
                  Baca Cerita Brand
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
