import type { SiteSettings } from "@/types/site";

import { buildWhatsAppLink } from "@/lib/whatsapp";

type ContactInfoSectionProps = {
  siteSettings: Pick<
    SiteSettings,
    "brandName" | "tagline" | "whatsappNumber" | "instagramUrl" | "email" | "address"
  >;
};

function prettyPhone(number: string) {
  const cleaned = (number || "").replace(/[^\d]/g, "");
  if (!cleaned) return "";
  return `+${cleaned}`;
}

export default function ContactInfoSection({ siteSettings }: ContactInfoSectionProps) {
  const waHref = buildWhatsAppLink(siteSettings.whatsappNumber);
  const waLabel = prettyPhone(siteSettings.whatsappNumber) || "WhatsApp";

  return (
    <section className="bg-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-5 pb-14 sm:px-6 sm:pb-16">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="rounded-soft border border-espresso/10 bg-bone p-6">
              <div className="text-xs font-semibold uppercase text-mutedRose">
                {siteSettings.brandName}
              </div>
              <div className="mt-3 font-heading text-2xl leading-snug text-espresso">
                {siteSettings.tagline}
              </div>
              <p className="mt-4 text-sm leading-7 text-mutedBrown">
                Pilih cara menghubungi yang paling nyaman. Kami siap membantu konsultasi model, warna, dan detail produk.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-soft border border-espresso/10 bg-bone p-5 transition-colors hover:border-espresso/20"
                aria-label="Hubungi via WhatsApp"
              >
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  WhatsApp
                </div>
                <div className="mt-3 text-sm font-medium text-espresso">{waLabel}</div>
                <div className="mt-2 text-sm text-mutedBrown">
                  Konsultasi dengan suasana yang tenang dan personal.
                </div>
              </a>

              <a
                href={siteSettings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-soft border border-espresso/10 bg-bone p-5 transition-colors hover:border-espresso/20"
                aria-label="Buka Instagram Mountain Rose"
              >
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Instagram
                </div>
                <div className="mt-3 text-sm font-medium text-espresso">
                  {siteSettings.instagramUrl.replace(/^https?:\/\//, "")}
                </div>
                <div className="mt-2 text-sm text-mutedBrown">
                  Lihat suasana editorial dan update terbaru.
                </div>
              </a>

              <a
                href={`mailto:${siteSettings.email}`}
                className="rounded-soft border border-espresso/10 bg-bone p-5 transition-colors hover:border-espresso/20"
                aria-label="Kirim email ke Mountain Rose"
              >
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Email
                </div>
                <div className="mt-3 text-sm font-medium text-espresso">{siteSettings.email}</div>
                <div className="mt-2 text-sm text-mutedBrown">
                  Untuk pertanyaan detail atau kebutuhan khusus.
                </div>
              </a>

              <div className="rounded-soft border border-espresso/10 bg-bone p-5">
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Alamat
                </div>
                <div className="mt-3 text-sm font-medium text-espresso">Indonesia</div>
                <div className="mt-2 text-sm text-mutedBrown">{siteSettings.address}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
