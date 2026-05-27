"use client";

import Link from "next/link";
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

  return (
    <header className="sticky top-0 z-40 border-b border-espresso/10 bg-bone/95 backdrop-blur-[2px]">
      <nav
        className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-6"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="flex items-baseline gap-3 text-espresso hover:text-darkLeather"
          onClick={() => setIsOpen(false)}
        >
          <span className="font-heading text-lg leading-none">
            {settings.brandName}
          </span>
          <span className="hidden text-xs font-medium text-mutedBrown sm:inline">
            Genuine Cow Leather
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-6">
            {NAVIGATION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-mutedBrown transition-colors hover:text-espresso"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <WhatsAppButton phoneNumber={settings.whatsappNumber} />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-soft border border-espresso/15 bg-warmIvory px-3 text-sm font-medium text-espresso transition-colors hover:bg-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antiqueGold/70"
            aria-controls={menuId}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((v) => !v)}
          >
            {isOpen ? "Close" : "Menu"}
          </button>
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
                className="rounded-soft px-2 py-2 text-sm font-medium text-mutedBrown transition-colors hover:bg-bone hover:text-espresso"
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

