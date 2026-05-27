import Image from "next/image";
import Link from "next/link";

import { urlFor } from "@/sanity/lib/image";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { SiteSettings } from "@/types/site";

type HeroSectionProps = {
  title: string;
  subtitle: string;
  heroImage?: {
    asset?: { _ref: string; _type: "reference" };
    alt?: string;
  } | null;
  siteSettings: Pick<SiteSettings, "whatsappNumber" | "brandName">;
};

export default function HeroSection({
  title,
  subtitle,
  heroImage,
  siteSettings,
}: HeroSectionProps) {
  const imgUrl = heroImage?.asset
    ? urlFor(heroImage)?.width(1600).height(1200).fit("crop").quality(80).url()
    : null;

  const waHref = buildWhatsAppLink(
    siteSettings.whatsappNumber,
    `Halo ${siteSettings.brandName}, saya ingin konsultasi tas kulit sapi.`,
  );

  return (
    <section className="bg-warmIvory">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-12 pt-10 sm:px-6 sm:pb-16 lg:grid-cols-12 lg:items-center lg:gap-14 lg:pb-20 lg:pt-14">
        <div className="lg:col-span-6">
          <div className="text-xs font-semibold uppercase text-mutedRose">
            Premium genuine cow leather
          </div>
          <h1 className="mt-4 font-heading text-4xl leading-tight text-espresso sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-mutedBrown sm:text-lg">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/collections"
              className="inline-flex h-11 items-center justify-center rounded-soft border border-espresso/15 bg-bone px-5 text-sm font-semibold text-espresso transition-colors hover:bg-warmIvory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
            >
              Lihat Koleksi
            </Link>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-soft border border-brass/40 bg-espresso px-5 text-sm font-semibold text-warmIvory transition-colors hover:bg-darkLeather focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
              aria-label="Order via WhatsApp"
            >
              Order via WhatsApp
            </a>
          </div>
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
                Jahitan rapi
              </div>
            </div>
            <div className="rounded-soft border border-espresso/10 bg-bone px-3 py-3">
              <div className="text-xs font-semibold uppercase text-mutedRose">
                Nuansa
              </div>
              <div className="mt-2 text-sm font-medium text-espresso">
                Hangat, matang
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-soft border border-espresso/10 bg-bone">
            <div className="absolute inset-0 bg-gradient-to-b from-warmIvory/0 via-warmIvory/0 to-warmIvory/20" />
            {imgUrl ? (
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={imgUrl}
                  alt={
                    heroImage?.alt ||
                    "Mountain Rose hero image - tas kulit sapi premium"
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

