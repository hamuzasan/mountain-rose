"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useMemo, useState } from "react";

import { FALLBACK_SITE_SETTINGS } from "@/data/fallbackSiteSettings";
import { NAVIGATION } from "@/data/navigation";
import type { SiteSettings } from "@/types/site";

import { WhatsAppButton } from "../ui/WhatsAppButton";

type NavbarProps = {
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

export default function Navbar({ siteSettings }: NavbarProps) {
  const settings = useMemo(() => resolveSiteSettings(siteSettings), [siteSettings]);
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-espresso/10 bg-bone/95 backdrop-blur-[2px]">
      <nav
        className="relative mx-auto flex w-full max-w-7xl items-center justify-center px-5 py-4 sm:px-6 md:justify-between md:py-4"
        aria-label="Primary"
      >
        <button
          type="button"
          className="fixed left-5 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-soft text-espresso transition-colors hover:bg-warmIvory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70 md:hidden"
          aria-controls={menuId}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          onClick={() => setIsOpen((v) => !v)}
        >
          <span className="relative block h-3.5 w-5" aria-hidden="true">
            <span className="absolute left-0 top-0 h-px w-5 bg-espresso" />
            <span className="absolute left-0 top-1.5 h-px w-5 bg-espresso" />
            <span className="absolute left-0 top-3 h-px w-5 bg-espresso" />
          </span>
        </button>

        <Link
          href="/"
          className="flex flex-col items-center text-center text-espresso hover:text-darkLeather md:flex-row md:items-baseline md:gap-3 md:text-left"
          onClick={() => setIsOpen(false)}
        >
          <span className="font-heading text-xl leading-none md:text-lg">
            {settings.brandName}
          </span>
          <span className="hidden text-xs font-medium text-mutedBrown sm:inline md:inline">
            Kulit Sapi Handmade
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center rounded-soft border border-espresso/10 bg-warmIvory px-2 py-1">
            {NAVIGATION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-soft px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-bone text-espresso"
                    : "text-mutedBrown hover:bg-bone hover:text-espresso",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <WhatsAppButton phoneNumber={settings.whatsappNumber} />
        </div>

      </nav>

      <div
        id={menuId}
        className={[
          "md:hidden",
          isOpen ? "block" : "hidden",
        ].join(" ")}
      >
        <div className="border-t border-espresso/10 bg-warmIvory">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-4 sm:px-6">
            {NAVIGATION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-soft px-2 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-bone text-espresso"
                    : "text-mutedBrown hover:bg-bone hover:text-espresso",
                ].join(" ")}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <WhatsAppButton phoneNumber={settings.whatsappNumber} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
