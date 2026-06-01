import type { Metadata } from "next";

import ContactFormSection from "@/components/sections/ContactFormSection";
import ContactHero from "@/components/sections/ContactHero";
import ContactInfoSection from "@/components/sections/ContactInfoSection";
import WhatsAppOrderSection from "@/components/sections/WhatsAppOrderSection";
import { FALLBACK_SITE_SETTINGS } from "@/data/fallbackSiteSettings";
import { getSiteSettings } from "@/data-access/siteSettings";

export const metadata: Metadata = {
  title: "Contact Mountain Rose | Premium Cow Leather Bags",
  description:
    "Contact Mountain Rose for cow leather bag consultation, product details, colors, and WhatsApp ordering.",
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
