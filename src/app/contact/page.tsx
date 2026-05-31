import type { Metadata } from "next";

import ContactFormSection from "@/components/sections/ContactFormSection";
import ContactHero from "@/components/sections/ContactHero";
import ContactInfoSection from "@/components/sections/ContactInfoSection";
import WhatsAppOrderSection from "@/components/sections/WhatsAppOrderSection";
import { FALLBACK_SITE_SETTINGS } from "@/data/fallbackSiteSettings";
import { getSiteSettings } from "@/data-access/siteSettings";

export const metadata: Metadata = {
  title: "Kontak Mountain Rose | Tas Kulit Sapi Premium",
  description:
    "Hubungi Mountain Rose untuk konsultasi tas kulit sapi, pilihan model, warna, dan pemesanan melalui WhatsApp.",
};

export default async function ContactPage() {
  const cmsSiteSettings = await getSiteSettings();
  const siteSettings = cmsSiteSettings
    ? { ...FALLBACK_SITE_SETTINGS, ...cmsSiteSettings }
    : FALLBACK_SITE_SETTINGS;

  return (
    <div className="bg-warmIvory">
      <ContactHero />
      <ContactInfoSection siteSettings={siteSettings} />
      <ContactFormSection siteSettings={siteSettings} />
      <WhatsAppOrderSection siteSettings={siteSettings} />
    </div>
  );
}
