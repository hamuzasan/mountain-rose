import Link from "next/link";

import { FALLBACK_SITE_SETTINGS } from "@/data/fallbackSiteSettings";
import { NAVIGATION } from "@/data/navigation";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { SiteSettings } from "@/types/site";

import { BrandLogo } from "./BrandLogo";

type FooterProps = {
  siteSettings?: Partial<SiteSettings> | null;
};

function resolveSiteSettings(
  siteSettings?: Partial<SiteSettings> | null,
): SiteSettings {
  return {
    ...FALLBACK_SITE_SETTINGS,
    ...(siteSettings || {}),
  };
}

function formatPhone(number: string) {
  const cleaned = number.replace(/[^\d]/g, "");
  if (!cleaned) return number;
  if (cleaned.startsWith("0")) return cleaned;
  return `+${cleaned}`;
}

export default function Footer({ siteSettings }: FooterProps) {
  const settings = resolveSiteSettings(siteSettings);
  const waHref = buildWhatsAppLink(settings.whatsappNumber);
  const whatsAppContacts = [
    settings.whatsappNumber,
    ...(settings.additionalWhatsAppNumbers || []),
  ].filter(Boolean);
  const emailContacts = [settings.email, ...(settings.additionalEmails || [])].filter(Boolean);

  return (
    <footer className="border-t border-warmIvory/10 bg-darkLeather text-warmIvory">
      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-6 lg:py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <BrandLogo
              siteSettings={settings}
              variant="light"
              className="max-h-20 max-w-[210px]"
            />
            <p className="mt-3 max-w-md text-sm leading-7 text-bone/80">
              {settings.tagline}
            </p>
            <div className="mt-6 h-px w-32 bg-antiqueGold/45" />
          </div>

          <div className="md:col-span-3">
            <div className="text-xs font-semibold uppercase text-dustyRose">
              Navigation
            </div>
            <ul className="mt-4 flex flex-col gap-2">
              {NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-bone/85 transition-colors hover:text-warmIvory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="text-xs font-semibold uppercase text-dustyRose">
              Contact
            </div>
            <div className="mt-4 flex flex-col gap-2 text-sm text-bone/85">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-warmIvory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
              >
                Consult via WhatsApp
              </a>
              <div className="flex flex-col gap-1 text-bone/75">
                {whatsAppContacts.map((number) => (
                  <span key={number}>{formatPhone(number)}</span>
                ))}
              </div>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-warmIvory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
              >
                Instagram
              </a>
              {emailContacts.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="transition-colors hover:text-warmIvory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
                >
                  {email}
                </a>
              ))}
              <div className="pt-2 text-sm leading-7 text-bone/75">
                {settings.address}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-warmIvory/10 pt-6 text-xs text-bone/70 sm:flex-row sm:items-center sm:justify-between">
          <div>&copy; 2026 {settings.brandName}. All rights reserved.</div>
          <div className="text-bone/60">Premium handmade cow leather bags from Indonesia.</div>
        </div>
      </div>
    </footer>
  );
}
