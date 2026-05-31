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
    `Halo ${siteSettings.brandName}, saya ingin konsultasi model tas dan warna.`,
  );

  return (
    <section className="bg-espresso text-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Konsultasi"
              title={<span className="text-bone">{title}</span>}
              description={<span className="text-bone/85">{text}</span>}
            />
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-soft border border-warmIvory/10 bg-darkLeather p-6">
              <div className="text-xs font-semibold uppercase text-dustyRose">
                Langkah Berikutnya
              </div>
              <div className="mt-3 font-heading text-2xl leading-snug text-bone">
                Order dengan tenang.
              </div>
              <p className="mt-4 text-sm leading-7 text-bone/80">
                Sampaikan kebutuhanmu, dan kami bantu memilih model yang paling tepat untuk perjalananmu.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-soft border border-brass/40 bg-warmIvory px-5 text-sm font-semibold text-espresso transition-colors hover:bg-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
                  aria-label="Order via WhatsApp"
                >
                  Konsultasi via WhatsApp
                </a>
                <Link
                  href="/collections"
                  className="inline-flex h-11 items-center justify-center rounded-soft border border-warmIvory/15 bg-transparent px-5 text-sm font-semibold text-bone transition-colors hover:bg-warmIvory/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
                >
                  Lihat Koleksi
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase text-bone/70">
                <span className="h-1.5 w-1.5 rounded-full bg-antiqueGold" />
                Detail antique gold
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
