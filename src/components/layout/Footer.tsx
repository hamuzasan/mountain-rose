import Link from "next/link";

import { FALLBACK_SITE_SETTINGS } from "@/data/fallbackSiteSettings";
import { NAVIGATION } from "@/data/navigation";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { SiteSettings } from "@/types/site";

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

export default function Footer({ siteSettings }: FooterProps) {
  const settings = resolveSiteSettings(siteSettings);
  const waHref = buildWhatsAppLink(settings.whatsappNumber);

  return (
    <footer className="border-t border-warmIvory/10 bg-darkLeather text-warmIvory">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-heading text-xl text-bone">{settings.brandName}</div>
            <p className="mt-3 max-w-md text-sm leading-7 text-bone/80">
              {settings.tagline}
            </p>
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
                    className="text-sm text-bone/85 transition-colors hover:text-warmIvory"
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
                className="transition-colors hover:text-warmIvory"
              >
                WhatsApp
              </a>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-warmIvory"
              >
                Instagram
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="transition-colors hover:text-warmIvory"
              >
                {settings.email}
              </a>
              <div className="pt-2 text-sm leading-7 text-bone/75">
                {settings.address}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-warmIvory/10 pt-6 text-xs text-bone/70 sm:flex-row sm:items-center sm:justify-between">
          <div>© 2026 {settings.brandName}. All rights reserved.</div>
          <div className="text-bone/60">Premium genuine cow leather bags.</div>
        </div>
      </div>
    </footer>
  );
}

