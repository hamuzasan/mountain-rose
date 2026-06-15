import type { SiteSettings } from "@/types/site";

import { buildWhatsAppLink } from "@/lib/whatsapp";
import {
  formatPhoneDisplay,
  getInstagramHandle,
  getOrderedEmailContacts,
  getOrderedWhatsAppContacts,
} from "@/lib/site-contacts";

type ContactInfoSectionProps = {
  siteSettings: Pick<
    SiteSettings,
    | "brandName"
    | "tagline"
    | "whatsappNumber"
    | "additionalWhatsAppNumbers"
    | "instagramUrl"
    | "email"
    | "additionalEmails"
    | "address"
  >;
};

export default function ContactInfoSection({ siteSettings }: ContactInfoSectionProps) {
  const whatsAppContacts = getOrderedWhatsAppContacts(siteSettings);
  const emailContacts = getOrderedEmailContacts(siteSettings);
  const instagramHandle = getInstagramHandle(siteSettings.instagramUrl);
  const primaryWaHref = buildWhatsAppLink(siteSettings.whatsappNumber);

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
                Choose the contact method that feels easiest. We can help with models,
                colors, materials, and product details.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href={primaryWaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-soft border border-espresso/10 bg-bone p-5 transition-colors hover:border-espresso/20"
                aria-label="Contact Mountain Rose via WhatsApp"
              >
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  WhatsApp
                </div>
                <div className="mt-3 flex flex-col gap-1 text-sm font-medium text-espresso">
                  {whatsAppContacts.map((number) => (
                    <span key={number}>{formatPhoneDisplay(number) || "WhatsApp"}</span>
                  ))}
                </div>
                <div className="mt-2 text-sm text-mutedBrown">
                  A calm and personal consultation.
                </div>
              </a>

              <a
                href={siteSettings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-soft border border-espresso/10 bg-bone p-5 transition-colors hover:border-espresso/20"
                aria-label="Open Mountain Rose Instagram"
              >
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Instagram
                </div>
                <div className="mt-3 text-sm font-medium text-espresso">
                  {instagramHandle}
                </div>
                <div className="mt-2 text-sm text-mutedBrown">
                  See editorial moments and the latest updates.
                </div>
              </a>

              <a
                href={`mailto:${emailContacts[0] || siteSettings.email}`}
                className="rounded-soft border border-espresso/10 bg-bone p-5 transition-colors hover:border-espresso/20"
                aria-label="Send an email to Mountain Rose"
              >
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Email
                </div>
                <div className="mt-3 flex flex-col gap-1 text-sm font-medium text-espresso">
                  {emailContacts.map((email) => (
                    <span key={email}>{email}</span>
                  ))}
                </div>
                <div className="mt-2 text-sm text-mutedBrown">
                  For detailed questions or special requests.
                </div>
              </a>

              <div className="rounded-soft border border-espresso/10 bg-bone p-5">
                <div className="text-xs font-semibold uppercase text-mutedRose">
                  Address
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
