import Link from "next/link";

import type { SiteSettings } from "@/types/site";

import { buildWhatsAppLink } from "@/lib/whatsapp";
import SectionHeading from "./SectionHeading";

type HomeCTASectionProps = {
  title: string;
  text: string;
  siteSettings: Pick<SiteSettings, "brandName" | "whatsappNumber">;
};

export default function HomeCTASection({
  title,
  text,
  siteSettings,
}: HomeCTASectionProps) {
  const waHref = buildWhatsAppLink(
    siteSettings.whatsappNumber,
    `Hello ${siteSettings.brandName}, I would like to ask about bag styles and colors.`,
  );

  return (
    <section className="bg-espresso text-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Consultation"
              title={<span className="text-bone">{title}</span>}
              description={<span className="text-bone/85">{text}</span>}
            />
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-soft border border-warmIvory/10 bg-darkLeather p-6">
              <div className="text-xs font-semibold uppercase text-dustyRose">
                Next Step
              </div>
              <div className="mt-3 font-heading text-2xl leading-snug text-bone">
                Order with calm confidence.
              </div>
              <p className="mt-4 text-sm leading-7 text-bone/80">
                Tell us what you need, and we will help you choose the most suitable bag for your daily journey.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-soft border border-brass/40 bg-warmIvory px-5 text-sm font-semibold text-espresso transition-colors hover:bg-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
                  aria-label="Order via WhatsApp"
                >
                  Consult via WhatsApp
                </a>
                <Link
                  href="/collections"
                  className="inline-flex h-11 items-center justify-center rounded-soft border border-warmIvory/15 bg-transparent px-5 text-sm font-semibold text-bone transition-colors hover:bg-warmIvory/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
                >
                  View Collection
                </Link>
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
