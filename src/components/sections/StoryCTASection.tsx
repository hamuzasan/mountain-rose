import Link from "next/link";

import type { SiteSettings } from "@/types/site";

import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

type StoryCTASectionProps = {
  title: string;
  text: string;
  siteSettings: Pick<SiteSettings, "whatsappNumber">;
};

export default function StoryCTASection({
  title,
  text,
  siteSettings,
}: StoryCTASectionProps) {
  return (
    <section className="bg-espresso text-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="text-xs font-semibold uppercase text-dustyRose">
              Next Step
            </div>
            <h2 className="mt-3 font-heading text-3xl leading-tight text-bone sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-bone/85 sm:text-base">
              {text}
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-soft border border-warmIvory/10 bg-darkLeather p-6">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/collections"
                  className="inline-flex h-10 items-center justify-center rounded-soft border border-warmIvory/15 bg-transparent px-4 text-sm font-medium text-bone transition-colors hover:bg-warmIvory/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
                >
                  View Collections
                </Link>
                <WhatsAppButton
                  phoneNumber={siteSettings.whatsappNumber}
                  label="Consult via WhatsApp"
                />
              </div>
              <div className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase text-bone/70">
                <span className="h-1.5 w-1.5 rounded-full bg-antiqueGold" />
                Antique gold detail
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
