import Image from "next/image";

import type { BrandStory } from "@/types/story";

import { urlFor } from "@/sanity/lib/image";

type StoryHeroProps = {
  story: Pick<BrandStory, "title" | "subtitle" | "image">;
};

export default function StoryHero({ story }: StoryHeroProps) {
  const imgUrl = story.image?.asset
    ? urlFor(story.image)?.width(1600).height(1000).fit("crop").quality(85).url()
    : null;

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
                Kulit sapi asli
              </div>
            </div>
            <div className="rounded-soft border border-espresso/10 bg-bone px-3 py-3">
              <div className="text-xs font-semibold uppercase text-mutedRose">
                Detail
              </div>
              <div className="mt-2 text-sm font-medium text-espresso">
                Finishing rapi
              </div>
            </div>
            <div className="rounded-soft border border-espresso/10 bg-bone px-3 py-3">
              <div className="text-xs font-semibold uppercase text-mutedRose">
                Nuansa
              </div>
              <div className="mt-2 text-sm font-medium text-espresso">
                Tenang, matang
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
                    "Mountain Rose story image - suasana editorial kulit"
                  }
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="aspect-[4/3] w-full">
                <div className="flex h-full w-full items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-full border border-espresso/10 bg-warmIvory" />
                    <div className="mt-4 text-xs font-semibold uppercase text-mutedBrown">
                      Editorial image placeholder
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-soft border border-espresso/10 bg-warmIvory/80 px-3 py-2 text-xs font-semibold text-espresso">
              <span className="h-1.5 w-1.5 rounded-full bg-antiqueGold" />
              Rose-inspired elegance
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

