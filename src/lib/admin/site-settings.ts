import "server-only";

import { FALLBACK_SITE_SETTINGS } from "@/data/fallbackSiteSettings";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { SiteSettings } from "@/types/site";

type SiteSettingsRow = {
  id: string;
  brand_name: string;
  tagline: string | null;
  whatsapp_number: string | null;
  instagram_url: string | null;
  email: string | null;
  address: string | null;
  logo_url: string | null;
};

function mapRow(row: SiteSettingsRow): SiteSettings & { id: string } {
  return {
    id: row.id,
    brandName: row.brand_name || FALLBACK_SITE_SETTINGS.brandName,
    tagline: row.tagline || FALLBACK_SITE_SETTINGS.tagline,
    whatsappNumber: row.whatsapp_number || FALLBACK_SITE_SETTINGS.whatsappNumber,
    instagramUrl: row.instagram_url || FALLBACK_SITE_SETTINGS.instagramUrl,
    email: row.email || FALLBACK_SITE_SETTINGS.email,
    address: row.address || FALLBACK_SITE_SETTINGS.address,
    logoUrl: row.logo_url,
    logo: row.logo_url ? { alt: "Mountain Rose logo" } : undefined,
  };
}

export async function getAdminSiteSettings() {
  const { client, error } = getSupabaseAdminClient();
  if (!client) {
    return {
      settings: { ...FALLBACK_SITE_SETTINGS, id: "" },
      error: error || "Supabase admin is not configured.",
    };
  }

  const { data, error: queryError } = await client
    .from("site_settings")
    .select("id,brand_name,tagline,whatsapp_number,instagram_url,email,address,logo_url")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    settings: data ? mapRow(data as SiteSettingsRow) : { ...FALLBACK_SITE_SETTINGS, id: "" },
    error: queryError?.message,
  };
}
