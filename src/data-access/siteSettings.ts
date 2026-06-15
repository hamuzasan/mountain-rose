import type { SiteSettings as SiteSettingsUi } from "@/types/site";
import { FALLBACK_SITE_SETTINGS } from "@/data/fallbackSiteSettings";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function getSiteSettings(): Promise<SiteSettingsUi> {
  const { client } = getSupabaseServerClient();
  if (!client) return FALLBACK_SITE_SETTINGS;

  const { data, error } = await client
    .from("site_settings")
    .select("brand_name,tagline,whatsapp_number,instagram_url,email,address,logo_url")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return FALLBACK_SITE_SETTINGS;

  return {
    brandName: data.brand_name || FALLBACK_SITE_SETTINGS.brandName,
    tagline: data.tagline || FALLBACK_SITE_SETTINGS.tagline,
    whatsappNumber: data.whatsapp_number || FALLBACK_SITE_SETTINGS.whatsappNumber,
    additionalWhatsAppNumbers: FALLBACK_SITE_SETTINGS.additionalWhatsAppNumbers,
    instagramUrl: data.instagram_url || FALLBACK_SITE_SETTINGS.instagramUrl,
    email: data.email || FALLBACK_SITE_SETTINGS.email,
    additionalEmails: FALLBACK_SITE_SETTINGS.additionalEmails,
    address: data.address || FALLBACK_SITE_SETTINGS.address,
    logoUrl: data.logo_url || FALLBACK_SITE_SETTINGS.logoUrl || null,
    logo: (data.logo_url || FALLBACK_SITE_SETTINGS.logoUrl) ? { alt: "Mountain Rose logo" } : undefined,
  };
}
