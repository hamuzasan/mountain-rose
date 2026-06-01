import Image from "next/image";

import type { BrandStory } from "@/types/story";

type StoryHeroProps = {
  story: Pick<BrandStory, "title" | "subtitle" | "image" | "imageUrl">;
};

export default function StoryHero({ story }: StoryHeroProps) {
  const imgUrl = story.imageUrl || null;

  return (
    <section className="bg-warmIvory">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-12 pt-10 sm:px-6 sm:pb-14 sm:pt-14 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6">
          <div className="text-xs font-semibold uppercase text-mutedRose">
            Story
          </div>
          <h1 className="mt-4 font-heading text-4xl leading-tight text-espresso sm:text-5xl">
            {story.title}
          </h1>
          {story.subtitle ? (
            <p className="mt-6 max-w-xl text-base leading-8 text-mutedBrown sm:text-lg">
              {story.subtitle}
            </p>
          ) : null}
          <div className="mt-10 h-px w-full bg-espresso/10" />
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="rounded-soft border border-espresso/10 bg-bone px-3 py-3">
              <div className="text-xs font-semibold uppercase text-mutedRose">
                Material
              </div>
              <div className="mt-2 text-sm font-medium text-espresso">
                Genuine cow leather
              </div>
            </div>
            <div className="rounded-soft border border-espresso/10 bg-bone px-3 py-3">
              <div className="text-xs font-semibold uppercase text-mutedRose">
                Detail
              </div>
              <div className="mt-2 text-sm font-medium text-espresso">
                Refined finishing
              </div>
            </div>
            <div className="rounded-soft border border-espresso/10 bg-bone px-3 py-3">
              <div className="text-xs font-semibold uppercase text-mutedRose">
                Mood
              </div>
              <div className="mt-2 text-sm font-medium text-espresso">
                Calm, mature
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-soft border border-espresso/10 bg-bone">
            {imgUrl ? (
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={imgUrl}
                  alt={
                    story.image?.alt ||
                    "Mountain Rose editorial leather story image"
                  }
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-warmIvory">
                <div className="absolute inset-x-8 bottom-10 top-10 rotate-[-5deg] border border-antiqueGold/25 bg-sand/35" />
                <div className="absolute left-10 top-12 h-36 w-36 rounded-full border border-mutedRose/25" />
                <div className="absolute bottom-12 right-12 h-44 w-44 rounded-full border border-espresso/10" />
                <div className="absolute inset-x-12 bottom-16 h-24 rounded-t-full border-t border-cognac/35" />
                <div className="relative flex h-full items-center justify-center">
                  <div className="max-w-xs text-center">
                    <div className="text-xs font-semibold uppercase text-mutedRose">
                      Mountain Rose
                    </div>
                    <div className="mt-3 font-heading text-3xl leading-tight text-espresso">
                      Leather, roses, and a long journey
                    </div>
                    <p className="mt-4 text-sm leading-7 text-mutedBrown">
                      A calm editorial visual for the character of material and handmade detail.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-soft border border-espresso/10 bg-warmIvory/80 px-3 py-2 text-xs font-semibold text-espresso">
              <span className="h-1.5 w-1.5 rounded-full bg-antiqueGold" />
              Rose-inspired restraint
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
